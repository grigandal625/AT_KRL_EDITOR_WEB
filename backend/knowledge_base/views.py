from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action
from knowledge_base import models
from knowledge_base import serializers
from rest_framework.response import Response
from knowledge_base.service import KBService


class KnowledgeBaseViewSet(ModelViewSet):
    queryset = models.KnowledgeBase.objects.all()
    serializer_class = serializers.KnowledgeBaseSerializer


class KBRelatedMixin:
    def get_queryset(self):
        return self.queryset.filter(knowledge_base=self.knowledge_base)

    @property
    def knowledge_base(self):
        return models.KnowledgeBase.objects.get(id=self.kwargs['knowledge_base_pk'])

    def perform_create(self, serializer):
        return serializer.save(knowledge_base=self.knowledge_base)
    

    @action(methods=['GET'], detail=True)
    def duplicate(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        data = serializer.data
        data.pop('id', None)
        data['kb_id'] = self.get_free_name(instance)
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        new_instance = self.perform_create(serializer)
        self.duplicate_extras(instance, new_instance)
        serializer = self.get_serializer(new_instance)
        return Response(serializer.data)
    
    def get_free_name(self, instance):
        model_class = instance.__class__
        counter = 1
        new_name = f'КОПИЯ_{instance.kb_id}'
        search_name = new_name
        others = model_class.objects.exclude(pk=instance.pk).filter(knowledge_base=self.knowledge_base, kb_id=search_name)
        while others.count():
            search_name = f'{new_name}_{counter}'
            counter += 1
            others = model_class.objects.exclude(pk=instance.pk).filter(knowledge_base=self.knowledge_base, kb_id=search_name)

        new_name = search_name
        return new_name

    def duplicate_extras(self, instance, new_instance):
        pass

    @action(methods=['GET'], detail=True, serializer_class=serializers.KRLSerializer)
    def krl(self, *args, **kwargs):
        instance = self.get_object()
        entity = KBService.convert(instance)
        return Response(data={'krl': entity.krl})


class KTypeViewSet(KBRelatedMixin, ModelViewSet):
    queryset = models.KType.objects.all()
    serializer_class = serializers.KTypeSerializer

    def perform_update(self, serializer: serializers.KTypeSerializer):
        instance: models.KType = serializer.instance
        validated_data = serializer.validated_data
        if validated_data.get('meta', instance.meta) != instance.meta:
            instance.kt_values.all().delete()
        super().perform_update(serializer)

    @action(methods=['PUT'], detail=True, serializer_class=serializers.KTypeSetValuesSerializer)
    def set_values(self, request, *args, **kwargs):
        instance: models.KType = self.get_object()
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        instance.kt_values.all().delete()
        serializer.save(type=instance)
        return Response(data=serializer.data)

    def duplicate_extras(self, instance, new_instance):
        for value in instance.kt_values.all():
            models.KTypeValue.objects.create(
                data=value.data,
                type=new_instance
            )
        return new_instance


class KTypeValueViewSet(ModelViewSet):
    queryset = models.KTypeValue.objects.all()
    serializer_class = serializers.KTypeValueSerializer

    def get_queryset(self):
        return self.queryset.filter(type=self.type)

    @property
    def type(self):
        return models.KType.objects.get(id=self.kwargs['k_type_pk'])

    def perform_create(self, serializer):
        return serializer.save(type=self.type)


class KObjectViewSet(KBRelatedMixin, ModelViewSet):
    queryset = models.KObject.objects.all()
    serializer_class = serializers.KObjectSerializer

    def duplicate_extras(self, instance, new_instance):
        for attr in instance.ko_attributes.all():
            models.KObjectAttribute.objects.create(
                object=new_instance,
                kb_id=attr.kb_id,
                type=attr.type,
                comment=attr.comment,
            )

    @action(methods=['PUT'], detail=True, serializer_class=serializers.KObjectSetAttributesSerializer)
    def set_attributes(self, request, *args, **kwargs):
        instance: models.KObject = self.get_object()
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        instance.ko_attributes.all().delete()
        serializer.save(object=instance)
        return Response(data=serializer.data)


class KObjectAttributeViewSet(ModelViewSet):
    queryset = models.KObjectAttribute.objects.all()
    serializer_class = serializers.KObjectAttributeSerializer

    def get_queryset(self):
        return self.queryset.filter(object=self.object)

    @property
    def object(self):
        return models.KObject.objects.get(id=self.kwargs['k_object_pk'])

    def perform_create(self, serializer):
        return serializer.save(object=self.object)


class KEventViewSet(KBRelatedMixin, ModelViewSet):
    queryset = models.KEvent.objects.all()
    serializer_class = serializers.KEventSerializer


class KIntervalViewSet(KBRelatedMixin, ModelViewSet):
    queryset = models.KInterval.objects.all()
    serializer_class = serializers.KIntervalSerializer


class KRuleViewSet(KBRelatedMixin, ModelViewSet):
    queryset = models.KRule.objects.all()
    serializer_class = serializers.KRuleSerializer

    def duplicate_extras(self, instance, new_instance):
        for instr in instance.kr_instructions.all():
            models.KRuleInstruction.objects.create(
                rule=new_instance,
                data=instr.data
            )
        for else_instr in instance.kr_else_instructions.all():
            models.KRuleElseInstruction.objects.create(
                rule=new_instance,
                data=else_instr.data
            )
        return new_instance

    @action(methods=['PUT'], detail=True, serializer_class=serializers.KRuleSetInstructionsSerializer)
    def set_instructions(self, request, *args, **kwargs):
        instance: models.KRule = self.get_object()
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        instance.kr_instructions.all().delete()
        serializer.save(rule=instance)
        return Response(data=serializer.data)


    @action(methods=['PUT'], detail=True, serializer_class=serializers.KRuleSetElseInstructionsSerializer)
    def set_else_instructions(self, request, *args, **kwargs):
        instance: models.KRule = self.get_object()
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        instance.kr_else_instructions.all().delete()
        serializer.save(rule=instance)
        return Response(data=serializer.data)
    
    @action(methods=['PUT'], detail=True, serializer_class=serializers.KRuleUpdateConditionAndInstructionsSerializer)
    def update_condition_and_instructions(self, request, *args, **kwargs):
        instance: models.KRule = self.get_object()
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        instance.kr_instructions.all().delete()
        instance.kr_else_instructions.all().delete()
        serializer.save()
        return Response(data=serializer.data)


class KRuleInstructionViewSet(ModelViewSet):
    queryset = models.KRuleInstruction.objects.all()
    serializer_class = serializers.KRuleInstructionSerializer

    def get_queryset(self):
        return self.queryset.filter(rule=self.rule)

    @property
    def rule(self):
        return models.KRule.objects.get(id=self.kwargs['k_rule_pk'])

    def perform_create(self, serializer):
        return serializer.save(rule=self.rule)


class KRuleElseInstructionViewSet(ModelViewSet):
    queryset = models.KRuleElseInstruction.objects.all()
    serializer_class = serializers.KRuleElseInstructionSerializer

    def get_queryset(self):
        return self.queryset.filter(rule=self.rule)

    @property
    def rule(self):
        return models.KRule.objects.get(id=self.kwargs['k_rule_pk'])

    def perform_create(self, serializer):
        return serializer.save(rule=self.rule)