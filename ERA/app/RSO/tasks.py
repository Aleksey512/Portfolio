from ERA.celery import celery_app
from celery.schedules import crontab

from RSO.models import TechnicalWellInformation


@celery_app.task(ignore_result=True)
def test1():
    """Сохранение технических характеристик скважины (Надо для RSO.signals)"""

    try:
        for x in TechnicalWellInformation.objects.all().values_list('pk', flat=True):
            TechnicalWellInformation.objects.get(pk=x).save()
        return True
    except SystemExit:
        print("Task остановлен специально")
    except Exception as e:
        print(f"Возникла ошибка которая привела к завершению Task \n{e}")
