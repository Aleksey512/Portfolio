from ERA.celery import celery_app
from celery.schedules import crontab

from datetime import datetime, timedelta

from .models import Smena


def timedelta_to_dhms(duration):
    """Преобразование  в дни, часы, минуты, секунды"""

    days, seconds = duration.days, duration.seconds
    hours = seconds // 3600
    minutes = (seconds % 3600) // 60
    seconds = seconds
    return days, hours, minutes, seconds


@celery_app.task
def flag_test():
    """Смотрит на Смену --> Дату/Время, и если прошло больше 12:30 ставит flag_complete в True"""

    try:
        now_datetime = datetime.now()
        for x in Smena.objects.filter(flag_complete=False).values_list('pk', flat=True):
            get = Smena.objects.get(pk=x)
            get_datetime = datetime.combine(get.date, get.time)
            delta = now_datetime - get_datetime
            days, hours, minutes, seconds = timedelta_to_dhms(delta)
            if (days > 0) or (days <= 0 and hours >= 12 and minutes >= 30):
                get.flag_complete = True
                get.save()
        return True
    except SystemExit:
        print("Task остановлен специально")
    except Exception as e:
        print(f"Возникла ошибка которая привела к завершению Task \n{e}")