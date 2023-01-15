from __future__ import absolute_import
import os
from celery import Celery

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'MailingList.settings')
celery_app = Celery('MailingList')
celery_app.config_from_object('django.conf:settings', namespace='CELERY')
celery_app.conf.timezone = "Europe/Moscow"
celery_app.autodiscover_tasks()

celery_app.conf.beat_schedule ={

}
