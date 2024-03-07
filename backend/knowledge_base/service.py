from at_krl.core.kb_entity import KBEntity 
from at_krl.core.kb_type import KBType, KBNumericType, KBSymbolicType, KBFuzzyType
from at_krl.core.kb_class import KBClass
from at_krl.core.temporal.kb_event import KBEvent
from at_krl.core.temporal.kb_interval import KBInterval
from at_krl.core.kb_rule import KBRule
from at_krl.core.knowledge_base import KnowledgeBase

from antlr4 import CommonTokenStream, InputStream
from at_krl.grammar.at_krlLexer import at_krlLexer
from at_krl.grammar.at_krlParser import at_krlParser
from at_krl.utils.listener import ATKRLListener
from at_krl.utils.error_listener import ATKRLErrorListener

from xml.etree.ElementTree import fromstring
import json

from knowledge_base import models
from knowledge_base.utils import service

class KBService:

    MODEL_CONVERTOR_CLASS_MAPPLING = {
        models.KType: (service.KTypeConvertSerializer, KBType),
        models.KObject: (service.KObjectConvertSerializer, KBClass),
        models.KEvent: (service.KEventConvertSerializer, KBEvent),
        models.KInterval: (service.KIntervalConvertSerializer, KBInterval),
        models.KRule: (service.KRuleConvertSerializer, KBRule)
    }

    @staticmethod
    def convert(t) -> KBEntity:
        serializer_class, kb_entity_class = KBService.MODEL_CONVERTOR_CLASS_MAPPLING[t.__class__]
        serializer = serializer_class(t)
        kb_entity = kb_entity_class.from_dict(serializer.data)
        return kb_entity
    
    @staticmethod
    def convert_kb(kb: models.KnowledgeBase) -> KnowledgeBase:
        result = KnowledgeBase()
        for t in kb.k_types.all():
            result.types.append(KBService.convert(t))
        for o in kb.k_objects.all():
            kb_class: KBClass = KBService.convert(o)
            object_id = kb_class.id
            class_id = result.get_free_class_id(object_id)
            kb_class.id = class_id
            result.classes.objects.append(kb_class)
            result.world.properties.append(
                kb_class.create_instance(result, object_id, kb_class.desc, as_property=True)
            )
        for i in kb.k_intervals.all():
            result.classes.intervals.append(KBService.convert(i))
        for e in kb.k_events.all():
            result.classes.events.append(KBService.convert(e))
        for r in kb.k_rules.all():
            result.add_rule(KBService.convert(r))
        return result
    
    @staticmethod
    def to_model(t: KBEntity, kb: models.KnowledgeBase) -> models.KType | models.KObject | models.KEvent | models.KInterval | models.KRule:
        if isinstance(t, KBType):
            return KBService.type_to_model(t, kb)
        elif isinstance(t, KBEvent):
            return KBService.event_to_model(t, kb)
        elif isinstance(t, KBInterval):
            return KBService.interval_to_model(t, kb)
        elif isinstance(t, KBClass):
            return KBService.object_to_model(t, kb)
        elif isinstance(t, KBRule):
            return KBService.rule_to_model(t, kb)
    
    @staticmethod
    def type_to_model(t: KBType, kb: models.KnowledgeBase) -> models.KType:
        meta_mapping = {
            KBNumericType.meta.__get__(object()): models.KType.MetaTypeChoices.NUMBER,
            KBSymbolicType.meta.__get__(object()): models.KType.MetaTypeChoices.STRING,
            KBFuzzyType.meta.__get__(object()): models.KType.MetaTypeChoices.FUZZY
        }
        create_kwargs = {'knowledge_base': kb, 'kb_id': t.id, 'meta': meta_mapping[t.meta], 'comment': t.desc}
        result = models.KType.objects.create(**create_kwargs)
        if isinstance(t, KBNumericType):
            models.KTypeValue.objects.create(type=result, data=t._from)
            models.KTypeValue.objects.create(type=result, data=t._to)
        elif isinstance(t, KBSymbolicType):
            for v in t.values:
                models.KTypeValue.objects.create(type=result, data=v)
        elif isinstance(t, KBFuzzyType):
            for mf in t.membership_functions:
                models.KTypeValue.objects.create(type=result, data=mf.__dict__())
        return result
    
    @staticmethod
    def object_to_model(t: KBClass, kb: models.KnowledgeBase) -> models.KObject:
        result = models.KObject.objects.create(
            kb_id=t.id, knowledge_base=kb, group=t.group, comment=t.desc)
        for prop in t.properties:
            attr_type = kb.k_types.filter(kb_id=prop.type_or_class_id).first()
            models.KObjectAttribute.objects.create(kb_id=prop.id, object=result, type=attr_type, comment=prop.desc)
        return result
    
    @staticmethod
    def event_to_model(t: KBEvent, kb: models.KnowledgeBase) -> models.KEvent:
        return models.KEvent.objects.create(
            knowledge_base=kb,
            kb_id=t.id,
            occurance_condition=t.occurance_condition.__dict__(),
            comment=t.desc
        )
    
    @staticmethod
    def interval_to_model(t: KBInterval, kb: models.KnowledgeBase) -> models.KInterval:
        return models.KInterval.objects.create(
            knowledge_base=kb,
            kb_id=t.id,
            open=t.open.__dict__(),
            close=t.close.__dict__(),
            comment=t.desc
        )
    
    @staticmethod
    def rule_to_model(t: KBRule, kb: models.KnowledgeBase) -> models.KRule:
        result = models.KRule.objects.create(
            knowledge_base=kb,
            kb_id=t.id,
            condition=t.condition.__dict__(),
            comment=t.desc,
        )

        for instr in t.instructions:
            models.KRuleInstruction.objects.create(
                rule=result,
                data=instr.__dict__()
            )
        if t.else_instructions:
            for else_instr in t.else_instructions:
                models.KRuleElseInstruction.objects.create(
                    rule=result,
                    data=else_instr.__dict__()
                )
        return result
    
    @staticmethod
    def knowledge_base_to_model(data_kb: KnowledgeBase, kb: models.KnowledgeBase = None, file_name: str = None) -> models.KnowledgeBase:
        kb = kb or models.KnowledgeBase.objects.create(name=file_name)
        for t in data_kb.types:
            KBService.type_to_model(t, kb)
        for property in data_kb.world.properties:
            object_id = property.id
            class_id = property.type_or_class_id

            cls = data_kb.get_object_by_id(class_id)
            cls.id = object_id
            KBService.object_to_model(cls, kb)
            
            cls.id = class_id
        for i in data_kb.classes.intervals:
            KBService.interval_to_model(i, kb)
        for e in data_kb.classes.events:
            KBService.event_to_model(e, kb)
        for r in data_kb.world.rules:
            KBService.rule_to_model(r, kb)
        return kb
    
    @staticmethod
    def kb_from_krl(krl_text: str) -> KnowledgeBase:
        input_stream = InputStream(krl_text)
        lexer = at_krlLexer(input_stream) # создаем лексер
        stream = CommonTokenStream(lexer)
        parser = at_krlParser(stream) # создаем парсер

        listener = ATKRLListener()
        parser.addParseListener(listener) # добавляем лисенер

        error_listener = ATKRLErrorListener()
        parser.removeErrorListeners()
        parser.addErrorListener(error_listener)

        tree = parser.knowledge_base() # даем команду распарсить БЗ
        # После этого в объекте listener в свойсте KB будет загруженная бз
        return listener.KB
    
    @staticmethod
    def kb_from_xml(xml_text: str) -> KnowledgeBase:
        kb_xml = fromstring(xml_text)
        return KnowledgeBase.from_xml(kb_xml)
    
    @staticmethod
    def kb_from_json(json_text: str) -> KnowledgeBase:
        kb_dict = json.loads(json_text)
        return KnowledgeBase.from_dict(kb_dict)