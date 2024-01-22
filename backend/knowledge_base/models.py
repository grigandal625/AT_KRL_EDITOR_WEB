from django.db import models

# Create your models here.


class KnowledgeBase(models.Model):
    name = models.CharField(max_length=255)
    problem_area = models.TextField(null=True, blank=True, default=None)
    description = models.TextField(null=True, blank=True, default=None)


class KType(models.Model):
    class MetaTypeChoices(models.IntegerChoices):
        STRING = 1
        NUMBER = 2
        FUZZY = 3
    
    kb_id = models.CharField(max_length=255)
    knowledge_base = models.ForeignKey(to=KnowledgeBase, on_delete=models.CASCADE, related_name='k_types')
    meta = models.IntegerField(choices=MetaTypeChoices.choices)
    comment = models.TextField(null=True, blank=True)


class KTypeValue(models.Model):
    type = models.ForeignKey(KType, on_delete=models.CASCADE, related_name='kt_values')
    data = models.JSONField()


class KObject(models.Model):
    kb_id = models.CharField(max_length=255)
    knowledge_base = models.ForeignKey(to=KnowledgeBase, on_delete=models.CASCADE, related_name='k_objects')
    comment = models.TextField(null=True, blank=True)


class KObjectAttribute(models.Model):
    kb_id = models.CharField(max_length=255)
    object = models.ForeignKey(to=KObject, on_delete=models.CASCADE, related_name='ko_attributes')
    type = models.ForeignKey(to=KType, on_delete=models.RESTRICT, related_name='ko_attributes')
    comment = models.TextField(null=True, blank=True)


class KEvent(models.Model):
    kb_id = models.CharField(max_length=255)
    knowledge_base = models.ForeignKey(to=KnowledgeBase, on_delete=models.CASCADE, related_name='k_events')
    occurance_condition = models.JSONField()
    comment = models.TextField(null=True, blank=True)


class KInterval(models.Model):
    kb_id = models.CharField(max_length=255)
    knowledge_base = models.ForeignKey(to=KnowledgeBase, on_delete=models.CASCADE, related_name='k_intervals')
    open = models.JSONField()
    close = models.JSONField()
    comment = models.TextField(null=True, blank=True)


class KRule(models.Model):
    kb_id = models.CharField(max_length=255)
    knowledge_base = models.ForeignKey(to=KnowledgeBase, on_delete=models.CASCADE, related_name='k_rules')
    condition = models.JSONField()
    comment = models.TextField(null=True, blank=True)


class KRuleInstruction(models.Model):
    rule = models.ForeignKey(to=KRule, on_delete=models.CASCADE, related_name='kr_instructions')
    data = models.JSONField()


class KRuleElseInstruction(models.Model):
    rule = models.ForeignKey(to=KRule, on_delete=models.CASCADE, related_name='kr_else_instructions')
    data = models.JSONField()