# Generated by Django 5.0.1 on 2024-01-21 11:03

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('knowledge_base', '0002_alter_kevent_knowledge_base_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='knowledgebase',
            name='description',
            field=models.TextField(blank=True, default=None, null=True),
        ),
        migrations.AddField(
            model_name='knowledgebase',
            name='problem_area',
            field=models.TextField(blank=True, default=None, null=True),
        ),
    ]