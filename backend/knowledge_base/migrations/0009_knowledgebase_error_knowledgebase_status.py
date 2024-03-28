# Generated by Django 5.0.3 on 2024-03-26 14:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('knowledge_base', '0008_alter_kobject_group'),
    ]

    operations = [
        migrations.AddField(
            model_name='knowledgebase',
            name='error',
            field=models.TextField(blank=True, default=None, null=True),
        ),
        migrations.AddField(
            model_name='knowledgebase',
            name='status',
            field=models.IntegerField(choices=[(1, 'Загрузка'), (2, 'Ок'), (3, 'Ошибка')], default=2),
        ),
    ]