import os

from celery import Celery
from celery import signals

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'at_krl_editor.settings')

app = Celery('at_krl_editor')
app.config_from_object('django.conf:settings', namespace='CELERY')
app.autodiscover_tasks()
