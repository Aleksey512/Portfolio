from django.db import models


class Application(models.Model):
    """Заявка"""

    # Адрес
    city = models.CharField(max_length=100, verbose_name='Город')
    street = models.CharField(max_length=100, verbose_name='Улица')
    house = models.CharField(max_length=10, verbose_name='Дом')
    entrance = models.IntegerField(verbose_name='Подъезд')
    apartment = models.IntegerField(verbose_name='Квартира')

    # Заявитель
    APPLICANT_CHOICES = (
        ("Арендатор", "Арендатор"),
        ("Госорганы", "Госорганы"),
        ("Жилец", "Жилец"),
        ("Наниматель", "Наниматель"),
        ("Родственник собственника", "Родственник собственника"),
        ("Собственник", "Собственник"),
        ("Организация", "Организация"),
    )

    applicant = models.CharField(max_length=25, choices=APPLICANT_CHOICES, verbose_name='Заявитель', default=None)

    # Статус заявки
    APPLICANT_STATUS_CHOICES = (
        ("Аварийная", "Аварийная"),
        ("Плановая", "Плановая"),
        ("Платная", "Платная"),
        ("Консультация", "Консультация"),
    )
    application_status = models.CharField(max_length=15, choices=APPLICANT_STATUS_CHOICES, verbose_name='Статус заявки', default=None)

    # Текст заявки
    text_application = models.TextField(verbose_name='Текст заявки')

    # Работы/Услуги
    WORK_CHOICES = (
        ("Благоустройство", "Благоустройство"),
        ("Вентиляция", "Вентиляция"),
        ("Газовое оборудование", "Газовое оборудование"),
        ("Утечка газа", "Утечка газа"),
        ("Горячее водоснабжение", "Горячее водоснабжение"),
        ("Запорная армаратура", "Запорная армаратура"),
        ("Канализация", "Канализация"),
        ("Квитанция", "Квитанция"),
        ("Кровля", "Кровля"),
        ("Лифт", "Лифт"),
        ("Лифт кабина", "Лифт кабина"),
        ("Мусоропровод", "Мусоропровод"),
        ("Конструктив", "Конструктив"),
        ("Отопление", "Отопление"),
        ("Отчет собственникам", "Отчет собственникам"),
        ("Провайдер", "Провайдер"),
        ("Уборка подъезда", "Уборка подъезда"),
        ("Придомовая уборка", "Придомовая уборка"),
        ("Холодное водоснабжение", "Холодное водоснабжение"),
        ("Электричество", "Электричество"),
    )
    works_services = models.CharField(max_length=25, choices=WORK_CHOICES, verbose_name='Работы/услуги', default=None)

    # Добавить исполнителя и ответственная организация

    class Meta:
        ordering = ("works_services", )
        verbose_name = 'Заявка Аварийно-диспетчерской службы'
        verbose_name_plural = 'Заявки Аварийно-диспетчерской службы'
