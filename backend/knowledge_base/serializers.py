from rest_framework import serializers

from knowledge_base.models import KnowledgeBase
from knowledge_base.models import KType
from knowledge_base.models import KTypeValue
from knowledge_base.models import KObject
from knowledge_base.models import KObjectAttribute
from knowledge_base.models import KEvent
from knowledge_base.models import KInterval
from knowledge_base.models import KRule
from knowledge_base.models import KRuleInstruction
from knowledge_base.models import KRuleElseInstruction


class KnowledgeBaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = KnowledgeBase
        fields = '__all__'


class KTypeValueSerializer(serializers.ModelSerializer):
    class Meta:
        model = KTypeValue
        exclude = 'type',


class KTypeSerializer(serializers.ModelSerializer):
    kt_values = KTypeValueSerializer(many=True, read_only=True)

    class Meta:
        model = KType
        exclude = 'knowledge_base',


class KObjectAttributeSerializer(serializers.ModelSerializer):
    class Meta:
        model = KObjectAttribute
        exclude = 'object',


class KObjectSerializer(serializers.ModelSerializer):
    ko_attributes = KObjectAttributeSerializer(many=True, read_only=True)

    class Meta:
        model = KObject
        exclude = 'knowledge_base',


class KEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = KEvent
        exclude = 'knowledge_base',


class KIntervalSerializer(serializers.ModelSerializer):
    class Meta:
        model = KInterval
        exclude = 'knowledge_base',


class KRuleInstructionSerializer(serializers.ModelSerializer):
    class Meta:
        model = KRuleInstruction
        exclude = 'rule',


class KRuleElseInstructionSerializer(serializers.ModelSerializer):
    class Meta:
        model = KRuleElseInstruction
        exclude = 'rule',


class KRuleSerializer(serializers.ModelSerializer):
    kr_instructions = KRuleInstructionSerializer(many=True, read_only=True)
    kr_else_instructions = KRuleElseInstructionSerializer(many=True, read_only=True)

    class Meta:
        model = KRule
        exclude = 'knowledge_base',