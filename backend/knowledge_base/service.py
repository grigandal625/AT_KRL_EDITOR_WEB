from at_krl.core.kb_entity import KBEntity 
from at_krl.core.kb_type import KBType
from at_krl.core.kb_class import KBClass
from at_krl.core.temporal.kb_event import KBEvent
from at_krl.core.temporal.kb_interval import KBInterval
from at_krl.core.kb_rule import KBRule

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