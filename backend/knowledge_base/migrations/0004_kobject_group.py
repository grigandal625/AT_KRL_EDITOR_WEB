# Generated by Django 5.0.1 on 2024-01-30 11:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('knowledge_base', '0003_knowledgebase_description_knowledgebase_problem_area'),
    ]

    operations = [
        migrations.AddField(
            model_name='kobject',
            name='group',
            field=models.CharField(default='', max_length=255),
            preserve_default=False,
        ),
    ]
