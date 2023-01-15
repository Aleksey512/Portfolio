from django.db.models.signals import post_save

from django.dispatch import receiver

from .models import Mailing

from .tasks import *


@receiver(post_save, sender=Mailing)
def create_mailing(sender, instance, **kwargs):

    if instance.in_active == False:
        activate_mailing.apply_async(eta=instance.datetime_start)