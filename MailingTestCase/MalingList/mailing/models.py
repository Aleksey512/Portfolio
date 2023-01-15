from django.db import models

from django.core.validators import RegexValidator, MaxValueValidator, MinValueValidator, ValidationError, BaseValidator
from django.db.models import CheckConstraint, Q, F
from django.utils.translation import gettext_lazy as _

import pytz


class Mailing(models.Model):
    """Mailing model"""
    datetime_start = models.DateTimeField(verbose_name="Дата и время создания рассылки",)
    datetime_end = models.DateTimeField(verbose_name="Дата и время окончания рассылки", )
    client_tag = models.CharField(max_length=15, verbose_name='Тег', help_text="Максимум 15 символов", null=True,
                                  blank=True)
    client_mobile_operator_code = models.PositiveIntegerField(verbose_name="Код мобильного оператора",
                                                              validators=[MinValueValidator(1), MaxValueValidator(999)],
                                                              help_text="От 1 до 999")
    message_text = models.TextField(verbose_name="Текст сообщения")
    in_active = models.BooleanField(default=False)

    class Meta:
        constraints = [
            # Ensures constraint on DB level, raises IntegrityError (500 on debug=False)
            CheckConstraint(
                check=Q(datetime_end__gt=F('datetime_start')), name='check_start_date',
            ),
        ]

    def clean(self):
        # Ensures constraint on model level, raises ValidationError
        if self.datetime_start > self.datetime_end:
            # raise error for field
            raise ValidationError({'datetime_end': _('End date cannot be smaller then start date.')})

class Client(models.Model):
    """Client Description"""

    CHIOCES_TIMEZONE = list(map(lambda a: (a, a), pytz.all_timezones))

    phone_regex = RegexValidator(regex=r'^\+?[78][-\(]?\d{3}\)?-?\d{3}-?\d{2}-?\d{2}$',
                                 message="Phone number must be entered in the format: "
                                         "'+7-999-999-99-99'.") # validator for phone_number
    phone_number = models.CharField(validators=[phone_regex], max_length=17, blank=True, verbose_name="Номер телефона",
                                    help_text="Format: +7-999-888-77-66")
    mobile_operator_code = models.PositiveIntegerField(verbose_name="Код мобильного оператора",
                                                       validators=[MinValueValidator(1), MaxValueValidator(999)],
                                                       help_text="MinValue = 1, MaxValue = 999")
    tag = models.CharField(max_length=15, verbose_name='Тег', help_text="Max 15 digits")
    timezone = models.CharField(max_length=100, verbose_name="Timezone", choices=CHIOCES_TIMEZONE)


class Message(models.Model):
    """Message model"""
    client_id = models.ForeignKey(
        Client,
        on_delete=models.CASCADE,
        related_name="message",
    )
    mailing_id = models.ForeignKey(
        Mailing,
        on_delete=models.CASCADE,
        related_name="message",
    )
    CHOICES_STATUS = [
        ("SHP", "Shipped"),
        ("PRS", "Processed"),
        ("NST", "Not sent"),
    ]
    datetime = models.DateTimeField(verbose_name="Дата и время отправки сообщения", auto_now_add=True)
    status = models.CharField(max_length=20, verbose_name="Статус отправки", choices=CHOICES_STATUS, default="PRS")
    text = models.TextField(verbose_name="Текст сообщения")
