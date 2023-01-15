from django.db import models


class FareData(models.Model):
    """Данные тарифов"""

    TYPE_CHOICES = (
        ("Орёл (детализация)", "Орёл (детализация)"),
        ("Орёл (расчёт)", "Орёл (расчёт)"),
        ("Россия (расчёт)", "Россия (расчёт)"),
    )

    type = models.CharField(max_length=20, choices=TYPE_CHOICES, verbose_name='Тип расчёта', default=None)
    manage_org = models.CharField(max_length=100, verbose_name='Управляющая организация')
    address = models.CharField(max_length=100, verbose_name='Адрес')
    date = models.CharField(max_length=100, verbose_name='Дата')
    calculation_data = models.JSONField()

    class Meta:
        ordering = ("address",)
        verbose_name = 'Данные расчета/детализации'
        verbose_name_plural = 'Данные расчетов/детализаций'
