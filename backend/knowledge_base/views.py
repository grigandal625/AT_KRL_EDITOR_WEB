from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action
from knowledge_base import models
from knowledge_base import serializers


class KnowledgeBaseViewSet(ModelViewSet):
    queryset = models.KnowledgeBase.objects.all()
    serializer_class = serializers.KnowledgeBaseSerializer


class KBRelatedMixin:
    def get_queryset(self):
        return self.queryset.filter(knowledge_base=self.knowledge_base)

    @property
    def knowledge_base(self):
        return models.KnowledgeBase.objects.get(self.kwargs['knowledge_base_pk'])

    def perform_create(self, serializer):
        return serializer.save(knowledge_base=self.knowledge_base)


class KTypeViewSet(ModelViewSet, KBRelatedMixin):
    queryset = models.KType.objects.all()
    serializer_class = serializers.KTypeSerializer

    def perform_update(self, serializer: serializers.KTypeSerializer):
        instance: models.KType = serializer.instance
        validated_data = serializer.validated_data
        if validated_data.get('meta', instance.meta) != instance.meta:
            instance.kt_values.all().delete()
        super().perform_update(serializer)


class KTypeValueViewSet(ModelViewSet):
    queryset = models.KTypeValue.objects.all()
    serializer_class = serializers.KTypeValueSerializer

    def get_queryset(self):
        return self.queryset.filter(type=self.type)

    @property
    def type(self):
        return models.KType.objects.get(self.kwargs['k_type_pk'])

    def perform_create(self, serializer):
        return serializer.save(type=self.type)


class KObjectViewSet(ModelViewSet, KBRelatedMixin):
    queryset = models.KObject.objects.all()
    serializer_class = serializers.KObjectSerializer


class KObjectAttributeViewSet(ModelViewSet):
    queryset = models.KObjectAttribute.objects.all()
    serializer_class = serializers.KObjectAttributeSerializer

    def get_queryset(self):
        return self.queryset.filter(object=self.object)

    @property
    def object(self):
        return models.KObject.objects.get(self.kwargs['k_object_pk'])

    def perform_create(self, serializer):
        return serializer.save(object=self.object)


class KEventViewSet(ModelViewSet, KBRelatedMixin):
    queryset = models.KEvent
    serializer_class = serializers.KEventSerializer


class KIntervalViewSet(ModelViewSet, KBRelatedMixin):
    queryset = models.KInterval
    serializer_class = serializers.KIntervalSerializer


class KRuleViewSet(ModelViewSet, KBRelatedMixin):
    queryset = models.KRule.objects.all()
    serializer_class = serializers.KRuleSerializer


class KRuleInstructionViewSet(ModelViewSet):
    queryset = models.KRuleInstruction.objects.all()
    serializer_class = serializers.KRuleInstructionSerializer

    def get_queryset(self):
        return self.queryset.filter(rule=self.rule)

    @property
    def rule(self):
        return models.KRule.objects.get(self.kwargs['k_rule_pk'])

    def perform_create(self, serializer):
        return serializer.save(rule=self.rule)


class KRuleElseInstructionViewSet(ModelViewSet):
    queryset = models.KRuleElseInstruction.objects.all()
    serializer_class = serializers.KRuleElseInstructionSerializer

    def get_queryset(self):
        return self.queryset.filter(rule=self.rule)

    @property
    def rule(self):
        return models.KRule.objects.get(self.kwargs['k_rule_pk'])

    def perform_create(self, serializer):
        return serializer.save(rule=self.rule)