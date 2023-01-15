from django.db import models
from django.contrib.auth.models import User
from django.contrib.postgres.fields import ArrayField

from datetime import datetime, timedelta

from simple_history.models import HistoricalRecords

from RSO.models import WaterPumpingStation


def timedelta_to_dhms(duration):
    """Преобразование  в дни, часы, минуты, секунды"""

    days, seconds = duration.days, duration.seconds
    hours = seconds // 3600
    minutes = (seconds % 3600) // 60
    seconds = seconds
    return days, hours, minutes, seconds


class Smena(models.Model):
    """Смена"""
    SHIFT_NUMBER_CHOICE = (
        (1, 1),
        (2, 2),
    )
    user = models.ForeignKey(
        User,
        on_delete=models.PROTECT,
        verbose_name="Пользователь",
    )
    water_pumping_station = models.ForeignKey(
        WaterPumpingStation,
        on_delete=models.CASCADE,
        related_name="smena",
        verbose_name="ВЗУ",
    )
    shift_number = models.PositiveIntegerField(verbose_name="Смена", null=True, blank=True, choices=SHIFT_NUMBER_CHOICE)
    fullname = models.CharField(max_length=255, verbose_name="Дежурная смена, ФИО", null=True, blank=True)
    all_water = models.FloatField(verbose_name="Подано воды за сутки, м3", null=True, blank=True)
    manage_org = models.CharField(max_length=100, verbose_name="Управляющая организация", null=True, blank=True)
    date = models.DateField(verbose_name="Дата", null=True, blank=True, auto_now_add=True)
    flag_complete = models.BooleanField(default=False, )
    time = models.TimeField(verbose_name="Время", null=True, blank=True, auto_now_add=True)
    # slug = models.SlugField(unique=True)
    history = HistoricalRecords()

    def dynamic_every_hour(self):
        """
        Проверяет динамические на параметр создания не больше 1:10 назад
        :return True - если вовремя ввели, false - если не вовремя
        """
        try:
            now_datetime = datetime.now()
            last_dynamic = self.dynamic_settings.last()
            get_datetime = datetime.combine(last_dynamic.date, last_dynamic.time)
            delta = now_datetime - get_datetime
            days, hours, minutes, seconds = timedelta_to_dhms(delta)
            if (days > 0) or (days <= 0 and hours >= 1 and minutes >= 10):
                return False
            else:
                return True
        except:
            return True

    def chlorine_every_hour(self):
        """
        Проверяет хлор на параметр создания не больше 1:10 назад
        :return True - если вовремя ввели, false - если не вовремя
        """
        try:
            now_datetime = datetime.now()
            last_dynamic = self.chlorine.last()
            get_datetime = datetime.combine(last_dynamic.date, last_dynamic.time)
            delta = now_datetime - get_datetime
            days, hours, minutes, seconds = timedelta_to_dhms(delta)
            if (days > 0) or (days <= 0 and hours >= 1 and minutes >= 10):
                return False
            else:
                return True
        except:
            return True

    def __str__(self):
        return (f'Номер смены: {self.shift_number}' +
                f' Дата: {self.date}' +
                f' ID: {self.pk}')

    class Meta:
        verbose_name = "Смена"
        verbose_name_plural = "Смены"


class DynamicSettings(models.Model):
    """Динамические параметры"""
    smena_id = models.ForeignKey(
        Smena,
        on_delete=models.CASCADE,
        verbose_name="Смена",
        related_name="dynamic_settings"
    )
    date = models.DateField(verbose_name="Дата", null=True, blank=True, auto_now=True)
    time = models.TimeField(verbose_name="Время", null=True, blank=True, auto_now=True)
    pressure = models.FloatField(null=True, blank=True, verbose_name="Давление, кг/см2")
    water_level_in_reseruar = ArrayField(
            models.FloatField(verbose_name="Уровень воды в резервуаре", null=True, blank=True),
            verbose_name="Уровень воды в резервуаре", null=True, blank=True
    )
    current = models.FloatField(verbose_name="Нагрузка, А", null=True, blank=True)
    voltage = models.IntegerField(verbose_name="Напряжение, В", null=True, blank=True)
    pump_in_work = ArrayField(
            models.IntegerField(verbose_name="Насосы в работе", null=True, blank=True),
            verbose_name="Насосы в работе", null=True, blank=True
    )
    max_consumption = models.FloatField(verbose_name="Максимальный часовой расход, м3", null=True, blank=True)
    min_consumption = models.FloatField(verbose_name="Минимальный часовой расход, м3", null=True, blank=True)
    presence_plomb = models.IntegerField(verbose_name="Наличие пломб на РЧВ, шт", null=True, blank=True)
    note = models.TextField(verbose_name="Примечание", null=True, blank=True)
    manage_org = models.CharField(max_length=100, verbose_name="Управляющая организация", null=True, blank=True)
    history = HistoricalRecords()

    def __str__(self):
        return f'{self.smena_id}'

    class Meta:
        verbose_name = "Динамические параметры"
        verbose_name_plural = "Динамические параметры"


class Chlorine(models.Model):
    """Хлор"""
    smena_id = models.ForeignKey(
        Smena,
        on_delete=models.CASCADE,
        verbose_name="Смена",
        related_name="chlorine"
    )
    date = models.DateField(verbose_name="Дата", null=True, blank=True, auto_now=True)
    time = models.TimeField(verbose_name="Время", null=True, blank=True, auto_now=True)
    max_chlorine = models.FloatField(verbose_name="Максимальная доза хлора", null=True, blank=True)
    min_chlorine = models.FloatField(verbose_name="Минимальная доза хлора", null=True, blank=True)
    reagent_consumption = models.FloatField(verbose_name="Расход реагента", null=True, blank=True)
    note = models.CharField(max_length=500, verbose_name="Примечание", null=True, blank=True)
    manage_org = models.CharField(max_length=100, verbose_name="Управляющая организация", null=True, blank=True)
    history = HistoricalRecords()

    def __str__(self):
        return f"{self.smena_id}"

    class Meta:
        verbose_name = "Хлор"
        verbose_name_plural = "Хлор"


class OperationalInformation(models.Model):
    """Оперативная информация"""
    smena_id = models.ForeignKey(
        Smena,
        on_delete=models.CASCADE,
        verbose_name="Смена",
        related_name="operational_information"
    )
    date = models.DateField(verbose_name="Дата", null=True, blank=True, auto_now=True)
    time = models.TimeField(verbose_name="Время", null=True, blank=True, auto_now=True)
    object = models.CharField(max_length=100, verbose_name="Объект", null=True, blank=True)
    manage_org = models.CharField(max_length=100, verbose_name="Управляющая организация", null=True, blank=True)
    history = HistoricalRecords()

    def __str__(self):
        return f"{self.smena_id}"

    class Meta:
        verbose_name = "Оперативная информация"
        verbose_name_plural = "Оперативная информация"