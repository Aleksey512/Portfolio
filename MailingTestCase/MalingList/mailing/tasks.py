from MailingList.celery import celery_app

from datetime import datetime, timezone
import pytz

from MailingList.settings import TIME_ZONE
from .models import *


def dispatch(mailing):
    if mailing.client_tag:
        clients = Client.objects.filter(tag=mailing.client_tag).filter(
            mobile_operator_code=mailing.client_mobile_operator_code)
        for client in clients:
            message = Message.objects.create(client_id=client, mailing_id=mailing, text=mailing.message_text)
            message.save()
    else:
        clients = Client.objects.filter(mobile_operator_code=mailing.client_mobile_operator_code)
        for client in clients:
            message = Message.objects.create(client_id=client, mailing_id=mailing, text=mailing.message_text)
            message.save()


@celery_app.task
def activate_mailing():
    try:
        not_active_mailings = Mailing.objects.filter(in_active=False)
        for mailing in not_active_mailings:
            if mailing.datetime_start <= datetime.now(timezone.utc) <= mailing.datetime_end:
                mailing.in_active = True
                mailing.save()
                dispatch(mailing)
        return 'Success'
    except Exception as e:
        print(f"Ooops, whats wrong!\n{e}" )


# @celery_app.task
# def deactivate_mailing():
#     try:
#         active_mailings = Mailing.objects.filter(in_active=True)
#         for mailing in active_mailings:
#             if datetime.now(timezone.utc) <= mailing.datetime_end:
#                 return "Mailing in process"
#             else:
#                 mailing.in_active = False
#                 mailing.save()
#     except Exception as e:
#         print(f"Ooops, whats wrong!\n{e}" )

