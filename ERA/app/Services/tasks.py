import os
from ERA.celery import celery_app
from celery.schedules import crontab

import datetime


@celery_app.task
def backup_DataBase():
    """
    Делает бэкап БД и сохраняет в папку --> /DumpDataBase/
    Имя файла --> Текущая дата.json
    """
    try:
        if os.path.isdir("./DumpDataBase"):
            os.system(f"python ./manage.py dumpdata -a > ./DumpDataBase/{datetime.datetime.today().date()}.json")
        else:
            os.makedirs("./DumpDataBase")
            os.system(f"python ./manage.py dumpdata -a > ./DumpDataBase/{datetime.datetime.today().date()}.json")
    except SystemExit:
        print("Task остановлен специально")
    except Exception as e:
        print(f"Возникла ошибка которая привела к завершению Task \n{e}")



