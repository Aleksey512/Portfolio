import os
from datetime import timedelta

from celery import Celery
from celery.schedules import crontab

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ERA.settings')
celery_app = Celery('ERA')
celery_app.config_from_object('django.conf:settings', namespace='CELERY')
celery_app.conf.timezone = "Europe/Moscow"
celery_app.autodiscover_tasks()

celery_app.conf.beat_schedule = {
    'run-every-weekend': {
        'task': 'Services.tasks.backup_DataBase',
        'schedule': crontab(day_of_week=0, hour=1, minute=0),
        },
    'run-every-30-minutes': {
            'task': 'RsoDynamic.tasks.flag_test',
            'schedule': crontab(minute="*/30"),
        },
    'run-in-45-minutes-every-hour': {
            'task': 'RSO.tasks.test1',
            'schedule': crontab(minute=45, hour='*/1',),
        },
}


