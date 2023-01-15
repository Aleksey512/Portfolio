# Модели для создания базы данных в разделе Ресурсо-снабжающие организации
import datetime
from itertools import chain

from django.db import models
from django.db.models.query import EmptyQuerySet
from django.db.models import Prefetch
from django.utils.functional import cached_property

from simple_history.models import HistoricalRecords


def wells_path(instance, filename):
    """Сохранение фото колодцев по id 😅 """
    try:
        return 'photos_object/wells_{0}/{1}'.format(instance.pk, filename)
    except Exception as e:
        print(f"Exception {e}")


def wells_scheme(instance, filename):
    """Сохранение схемы колодцев по id 😅 """
    try:
        return 'scheme/wells_{0}/{1}'.format(instance.pk, filename)
    except Exception as e:
        print(f"Exception {e}")


def water_pipeline_scheme(instance, filename):
    """Сохранение схемы сборного водовода по id 😅 """
    try:
        return 'scheme/water_pipeline_{0}/{1}'.format(instance.pk, filename)
    except Exception as e:
        print(f"Exception {e}")


class Well(models.Model):
    """
    Скважина
    """
    STATUS_CHOICES = (
        ("В работе", "В работе"),
        ("В резерве", "В резерве"),
        ("В ремонте", "В ремонте"),
    )
    status = models.CharField(max_length=100, choices=STATUS_CHOICES, verbose_name="Статус", null=True)
    section_water_pipeline = models.ForeignKey(
        "SectionOfTheWaterPipeline",
        on_delete=models.CASCADE,
        related_name='wells',
        verbose_name='Участок сборного водовода',
    )
    coordinate_northern_latitude = models.FloatField(verbose_name='Северная широта', null=True, blank=True)
    coordinates_eastern_longitude = models.FloatField(verbose_name='Восточная долгота', null=True, blank=True)
    manage_org = models.CharField(max_length=255, verbose_name="Управляющая организация", help_text='Обязательное поле')
    history = HistoricalRecords()

    def last_well_repair(self):
        """     
        Api function
        Фильтрует ремонты скажины
        """
        try:
            return self.well_repair.last()
        except Exception as e:
            print(f"Excpetion {e}")

    def __str__(self):
        try:
            return (f'№{self.general_well_information.number_well}' +
                    f' // Управляющая организация {self.manage_org}')
        except:
            return f'Номер не указан: // Управляющая организация {self.manage_org}'

    class Meta:
        verbose_name = '1) Скважина'
        verbose_name_plural = '1) Скважины'


class WellRepair(models.Model):
    """Ремонт/тех обслуживание скважины"""
    well = models.ForeignKey(
        Well,
        on_delete=models.CASCADE,
        related_name='well_repair',
        verbose_name='Скважина',
    )
    TYPE_CHOICES = (
        ("По току", "По току"),
        ("По напряжению", "По напряжению"),
        ("Нет сети", "Нет сети"),
        ("Инцидент", "Инцидент"),
    )
    BROKEN_CHOICES = (
        ("Запорная арматура", "Запорная арматура"),
        ("Агрегат насосный", "Агрегат насосный"),
        ("КИПиА", "КИПиА"),
        ("N линии трубопровода", "N линии трубопровода"),
    )
    time = models.TimeField(verbose_name='Время', null=True, blank=True, auto_now_add=True)
    shift_number = models.SmallIntegerField(verbose_name='Номер смены', null=True, blank=True)
    fullname = models.CharField(max_length=255, verbose_name="Дежурная смена, ФИО", null=True, blank=True)
    date_of_repair = models.DateField(verbose_name='Дата последнего ремонта', null=True, blank=True, auto_now_add=True)
    type_of_repair = models.CharField(max_length=255, verbose_name='Вид последнего ремонта', choices=TYPE_CHOICES,
                                      null=True, blank=True)
    broken = models.CharField(max_length=255, verbose_name="Сломанное устройство", choices=BROKEN_CHOICES, null=True,
                              blank=True)
    date_of_maintenance = models.DateField(verbose_name='Дата последнего технического обслуживания', null=True,
                                           blank=True)
    type_of_maintenance = models.CharField(max_length=255, verbose_name='Вид технического обслуживания', null=True,
                                           blank=True)
    date_of_technical_inspection = models.DateField(verbose_name='Дата технического осмотра', null=True, blank=True)
    note = models.CharField(max_length=255, verbose_name="Проведенные работы", null=True, blank=True)
    history = HistoricalRecords()

    def __str__(self):
        return f'{self.well}'

    class Meta:
        verbose_name = '1) Скважина --> Ремонт/замена скважины'
        verbose_name_plural = '1) Скважина --> Ремонт/замена скважины'


class DynamicWellParametrs(models.Model):
    """Динамические параметры скважины"""
    well_id = models.OneToOneField(
        Well,
        on_delete=models.CASCADE,
        related_name='dynamic_well_parametrs',
        primary_key=True,
    )

    static_well_level = models.FloatField(verbose_name='Статический уровень скважины, м',
                                          help_text='Обязательное поле')
    dynamic_well_level = models.FloatField(verbose_name='Динамический уровень скважины, м',
                                           help_text='Обязательное поле')
    history = HistoricalRecords()

    def __str__(self):
        return f'Динамические параметры: {self.well_id}'

    class Meta:
        verbose_name = '1) Скважина --> Динамические параметры скважины'
        verbose_name_plural = '1) Скважина --> Динамические параметры скважин'


class GeneralWellInformation(models.Model):
    """
    Общая информация о скважине
    Раздел : Общие сведения о скважине
    """
    TYPE_OF_PAVILION_CHOICES = (
        ("Надземный", "Надземный"),
        ("Полузагубленный", "Полузагубленный"),
        ("Подземный", "Подземный"),
    )
    TYPE_OF_PROPERTY_CHOICES = (
        ("Муниципальная", "Муниципальная"),
        ("Частная", "Частная"),
        ("Государственная", "Государственная"),
        ("Аренда", "Аренда"),
        ("Безвозмездное пользование", "Безвозмездное пользвание"),
    )
    well_id = models.OneToOneField(
        Well,
        on_delete=models.CASCADE,
        related_name='general_well_information',
        primary_key=True,
    )
    type_of_property = models.CharField(max_length=50, choices=TYPE_OF_PROPERTY_CHOICES,
                                        verbose_name='Вид собственности', )
    area = models.CharField(max_length=255, verbose_name='Субъект', null=True, blank=True)
    district = models.CharField(max_length=255, verbose_name='Район', null=True, blank=True)
    city = models.CharField(max_length=255, verbose_name='Город', null=True, blank=True)
    location = models.CharField(max_length=255, verbose_name='Населенный пункт', null=True, blank=True)
    street = models.CharField(max_length=255, verbose_name='Улица', null=True, blank=True)
    house = models.CharField(max_length=255, verbose_name='Дом', null=True, blank=True)
    number_well = models.PositiveBigIntegerField(verbose_name='Номер скважины', null=True,
                                                 help_text="Обязательное поле", )
    absolute_mark_of_the_wellhead = models.DecimalField(max_digits=20, decimal_places=2,
                                                        verbose_name='Абсолютная отметка устья', null=True, blank=True,
                                                        help_text='Максимум 2 знака после запятой', )
    deep = models.DecimalField(max_digits=20, decimal_places=2, verbose_name='Глубна скважины, м', null=True,
                               blank=True, help_text='Максимум 2 знака после запятой')
    numbers_of_layers = models.PositiveBigIntegerField(verbose_name='Количество слоев', null=True, blank=True)
    purpose_well = models.CharField(max_length=255, verbose_name='Назначение', null=True)
    usage_information = models.CharField(max_length=255, verbose_name='Информация о пользовании', null=True, blank=True)
    usage_license = models.CharField(max_length=255, verbose_name='Лицензия на право пользования', null=True,
                                     blank=True)
    photo_objcect = models.ImageField(upload_to=wells_path, null=True, blank=True)
    scheme_object = models.ImageField(upload_to=wells_scheme, null=True, blank=True)
    river_basin = models.CharField(max_length=255, verbose_name='Речной бассейн', null=True, blank=True)
    water_managment_region = models.CharField(max_length=255, verbose_name='Водохозяйственный участок', null=True,
                                              blank=True)
    underground_water_pool = models.CharField(max_length=255, verbose_name='Басссейн подземных вод', null=True,
                                              blank=True)
    underground_water_deposit = models.CharField(max_length=255, verbose_name='Месторождени подземных вод', null=True,
                                                 blank=True)
    water_bearing_horizon = models.CharField(max_length=255, verbose_name='Водоностный горизонт', null=True, blank=True)
    position_in_relief = models.CharField(max_length=255, verbose_name='Положение в рельефе', null=True, blank=True)
    type_of_water_consumption = models.CharField(max_length=255, verbose_name='Вид водопотребления', null=True,
                                                 blank=True)
    water_user = models.CharField(max_length=255, verbose_name='Водопользователь', null=True, blank=True)
    drilling_method = models.CharField(max_length=255, verbose_name='Способ бурения', null=True, blank=True)
    drilling_organization = models.CharField(max_length=255, verbose_name='Организация проводившая бурение', null=True,
                                             blank=True)
    drilling_start_date = models.DateField(verbose_name='Дата начала бурения', null=True, blank=True)
    drilling_end_date = models.DateField(verbose_name='Дата окончания бурения', null=True, blank=True)
    type_of_pavilion = models.CharField(max_length=25, choices=TYPE_OF_PAVILION_CHOICES,
                                        verbose_name='Тип павильона', null=True)
    construction_of_pavilion = models.CharField(max_length=255, verbose_name='Конструкция павильона', null=True,
                                                blank=True)
    inv_number_of_pavilion = models.CharField(max_length=255, verbose_name='Инвертарный номер павильона', null=True,
                                              blank=True)
    date_of_signing_the_acceptance_certificate = models.DateField(verbose_name='Дата подписания приемо-сдаточного акта',
                                                                  null=True, blank=True)
    well_commissioning_date = models.DateField(verbose_name='Дата запуска скважины в эксплуатацию', null=True,
                                               blank=True)
    well_plugging_date = models.DateField(verbose_name='Дата тампонирования', null=True, blank=True)
    history = HistoricalRecords()

    def __str__(self):
        return f'Общая информация: {self.number_well}'

    class Meta:
        verbose_name = '1) Скважина --> Общая информация о скважине'
        verbose_name_plural = '1) Скважина --> Общая информация о скважине'
        ordering = ['-well_id']


class TechnicalWellInformation(models.Model):
    """
    Техническая информация о скважине
    Раздел : Техническая информация о скважине
    """
    well_id = models.OneToOneField(
        Well,
        on_delete=models.CASCADE,
        primary_key=True,
        related_name='technical_well_information',
    )
    diametr_casing_pipe = models.DecimalField(max_digits=20, decimal_places=2,
                                              verbose_name='Диаметр обсадной трубы', help_text='Обязательное поле')
    amount_of_reinforcment = models.PositiveBigIntegerField(verbose_name='Количество арматуры', null=True, blank=True)
    amount_of_control_device = models.PositiveBigIntegerField(verbose_name='Количество приборов контроля и учета',
                                                              null=True,
                                                              blank=True)
    amount_of_filter = models.PositiveBigIntegerField(verbose_name='Количество фильтров', null=True, blank=True)
    amount_of_lifting_pipe = models.PositiveBigIntegerField(verbose_name='Количество водоподъемных труб', null=True,
                                                            blank=True)
    history = HistoricalRecords()

    def __str__(self):
        return f'Техническая информация: {self.well_id}'

    class Meta:
        verbose_name = '1) Скважина --> Техническая информация о скважине'
        verbose_name_plural = '1) Скважина --> Техническая информация о скважинах'
        ordering = ['-well_id']


class Reinforcment(models.Model):
    """
    Арматура
    Раздел : Оборудование скважины
    """
    well_id = models.ForeignKey(
        Well,
        on_delete=models.CASCADE,
        related_name='reinforcments',
    )
    STATUS_CHOICES = (
        ("В работе", "В работе"),
        ("В резерве", "В резерве"),
        ("В ремонте", "В ремонте"),
    )
    status = models.CharField(max_length=100, choices=STATUS_CHOICES, verbose_name="Статус", null=True)
    reinforcment_name = models.CharField(max_length=255, verbose_name='Наименование', null=True, blank=True)
    reinforcment_type = models.CharField(max_length=255, verbose_name='Тип', null=True, blank=True)
    nominal_diametr = models.DecimalField(max_digits=20, decimal_places=2, verbose_name='Условный диаметр', null=True,
                                          help_text='Максимум 2 знака после запятой', blank=True)
    weight = models.DecimalField(max_digits=20, decimal_places=2, verbose_name='Масса единицы, кг.', null=True,
                                 help_text='Максимум 2 знака после запятой', blank=True)
    driver_type = models.CharField(max_length=255, verbose_name='Вид привода', null=True, blank=True)
    year_of_manufacture = models.DateField(verbose_name='Год изготовления', null=True, blank=True)
    history = HistoricalRecords()

    def last_reinforcment_repair(self):
        """Api function"""
        try:
            return self.reinforcment_repair.last()
        except Exception as e:
            print(f"Excpetion {e}")

    def __str__(self):
        return (f'ID: {self.pk}' +
                f'// Скважина: {self.well_id}')

    class Meta:
        verbose_name = '1) Скважина --> Арматура'
        verbose_name_plural = '1) Скважина --> Арматура'


class ReinforcmentRepair(models.Model):
    """Ремонт/тех обслуживание арматуры на скважине"""
    reinforcment = models.ForeignKey(
        Reinforcment,
        on_delete=models.CASCADE,
        related_name='reinforcment_repair',
        verbose_name='Арматура',
    )
    TYPE_CHOICES = (
        ("Авария", "Авария"),
        ("Инцидент", "Инцидент")
    )
    time = models.TimeField(verbose_name='Время', null=True, blank=True, auto_now_add=True)
    shift_number = models.SmallIntegerField(verbose_name='Номер смены', null=True, blank=True)
    fullname = models.CharField(max_length=255, verbose_name="Дежурная смена, ФИО", null=True, blank=True)
    date_of_repair = models.DateField(verbose_name='Дата последнего ремонта', null=True, blank=True, auto_now_add=True)
    type_of_repair = models.CharField(max_length=255, verbose_name='Вид последнего ремонта', choices=TYPE_CHOICES,
                                      null=True, blank=True)
    date_of_maintenance = models.DateField(verbose_name='Дата последнего технического обслуживания', null=True,
                                           blank=True)
    type_of_maintenance = models.CharField(max_length=255, verbose_name='Вид технического обслуживания', null=True,
                                           blank=True)
    date_of_technical_inspection = models.DateField(verbose_name='Дата технического осмотра', null=True, blank=True)
    note = models.CharField(max_length=255, verbose_name="Проведенные работы", null=True, blank=True)
    history = HistoricalRecords()

    def __str__(self):
        return f'{self.reinforcment}'

    class Meta:
        verbose_name = '1) Скважина --> Ремонт/замена арматуры на сважине'
        verbose_name_plural = '1) Скважина --> Ремонт/замена арматуры на сважине'


class ProcessPipe(models.Model):
    """
    Труба технологической обвязки
    Раздел : Оборудование скважины
    """
    well_id = models.ForeignKey(
        Well,
        on_delete=models.CASCADE,
        related_name='process_pipes',
    )
    STATUS_CHOICES = (
        ("В работе", "В работе"),
        ("В резерве", "В резерве"),
        ("В ремонте", "В ремонте"),
    )
    status = models.CharField(max_length=100, choices=STATUS_CHOICES, verbose_name="Статус", null=True)
    name_of_site = models.CharField(max_length=255, verbose_name='Наименованеи участка', null=True, blank=True)
    lenght = models.DecimalField(max_digits=20, decimal_places=2, verbose_name='Длина, м.', null=True,
                                 help_text='Максимум 2 знака после запятой', blank=True)
    outside_diametr = models.DecimalField(max_digits=20, decimal_places=2, verbose_name='Наружний диаметр, м.',
                                          null=True, help_text='Максимум 2 знака после запятой', blank=True)
    wall_thickness = models.DecimalField(max_digits=20, decimal_places=2, verbose_name='Толщина стенки, мм', null=True,
                                         help_text='Максимум 2 знака после запятой', blank=True)
    metall_mark = models.CharField(max_length=255, verbose_name='Марка металла', null=True, blank=True)
    installation_date = models.DateField(verbose_name='Дата монтажа', null=True, blank=True)
    GOST_group_pipe = models.CharField(max_length=255, verbose_name='ГОСТ группа труб', null=True, blank=True)
    number_of_certificate = models.DecimalField(max_digits=20, decimal_places=2,
                                                verbose_name='Номер сертификата', null=True,
                                                help_text='Максимум 2 знака после запятой', blank=True)
    strength_and_density_trial_param = models.CharField(max_length=255,
                                                        verbose_name='Параметры испытания на прочность и плотность',
                                                        null=True, blank=True)
    strength_and_density_trial_date = models.DateField(verbose_name='Дата испытания на плотность и прочность',
                                                       null=True, blank=True)
    history = HistoricalRecords()

    def __str__(self):
        return (f'Скважина: {self.well_id}' +
                f'ID: {self.pk}')

    class Meta:
        verbose_name = '1) Скважина --> Труба технологической обвязки'
        verbose_name_plural = '1) Скважина --> Трубы технологическй обвязки'


class ControlDevice(models.Model):
    """
    Прибор контроля и учета
    Раздел : Оборудование скважины
    """
    well_id = models.ForeignKey(
        Well,
        on_delete=models.CASCADE,
        related_name='control_devices',
    )
    STATUS_CHOICES = (
        ("В работе", "В работе"),
        ("В резерве", "В резерве"),
        ("В ремонте", "В ремонте"),
    )
    status = models.CharField(max_length=100, choices=STATUS_CHOICES, verbose_name="Статус", null=True)
    serial_number = models.CharField(max_length=255, verbose_name='Серийный № счётчика', unique=True,
                                     help_text="Обязательное поле")
    purpose_control_device = models.CharField(max_length=255, verbose_name='Назначение', null=True, blank=True)
    type_control_device = models.CharField(max_length=255, verbose_name='Тип', null=True, blank=True)
    model_control_device = models.CharField(max_length=255, verbose_name='Модель', null=True, blank=True)
    manufacturer = models.CharField(max_length=255, verbose_name='Завод изготовитель', null=True, blank=True)
    year_of_manufacture = models.DateField(verbose_name='Год изготовления', null=True, blank=True)
    settings_and_parametrs = models.CharField(max_length=255, verbose_name='Параметры и настройки', null=True,
                                              blank=True)
    date_of_entry_into_operation = models.DateField(verbose_name='Дата ввода в эксплуатацию', null=True, blank=True)
    capacity = models.DecimalField(max_digits=20, decimal_places=2, verbose_name='Мощность, квт', null=True, blank=True)
    date_of_check = models.DateField(verbose_name='Дата поверки', null=True, blank=True)
    calibration_interval = models.DecimalField(max_digits=20, decimal_places=2,
                                               verbose_name='Межповерочный интервал', null=True, blank=True,
                                               help_text='Максимум 2 знака после запятой', )
    history = HistoricalRecords()

    def __str__(self):
        return (f'Скважина: {self.well_id}' +
                f'Серийный номер: {self.serial_number}')

    class Meta:
        verbose_name = '1) Скважина --> Прибор контроля и учета'
        verbose_name_plural = '1) Скважина --> Приборы контроля и учета'


class ControlDeviceValue(models.Model):
    """
    Показания прибора контроля и учета
    Раздел : Оборудование скважины
    """
    control_device_serial_number = models.ForeignKey(
        ControlDevice,
        to_field='serial_number',
        on_delete=models.CASCADE,
        related_name='values_of_control_device',
    )
    date_value = models.DateField(verbose_name='Текущий расчетный период (месяц)', null=True, blank=True)
    begin_value = models.CharField(max_length=255, verbose_name='Показания на начало расч.периода', null=True,
                                   blank=True)
    end_value = models.CharField(max_length=255, verbose_name='Показания на конец расч.периода', null=True, blank=True)
    metr_consuption = models.CharField(max_length=255, verbose_name='Расход счётчика', null=True, blank=True)
    history = HistoricalRecords()

    def __str__(self):
        return f'Серийный нмоер устройста: {self.control_device_serial_number.serial_number}'

    class Meta:
        verbose_name = '1) Скважина --> Показания прибора контроля и учета '
        verbose_name_plural = '1) Скважина --> Показания приборов контроля и учета'


class LiftingPipe(models.Model):
    """Раздел : Оборудование скважины"""
    well_id = models.ForeignKey(
        Well,
        on_delete=models.CASCADE,
        related_name='lifting_pipes',
    )
    STATUS_CHOICES = (
        ("В работе", "В работе"),
        ("В резерве", "В резерве"),
        ("В ремонте", "В ремонте"),
    )
    status = models.CharField(max_length=100, choices=STATUS_CHOICES, verbose_name="Статус", null=True)
    pipe_number_from_the_pump = models.PositiveBigIntegerField(verbose_name='Номер трубы от насоса', null=True,
                                                               blank=True)
    lenght = models.DecimalField(max_digits=20, decimal_places=2, verbose_name='Длина, м.', null=True, blank=True)
    material = models.CharField(max_length=255, verbose_name='Материал', null=True, blank=True)
    technical_condition_safety_rope = models.CharField(max_length=255,
                                                       verbose_name='Техническое состояние страховочного тросса',
                                                       null=True, blank=True)
    connection_type = models.CharField(max_length=255, verbose_name='Тип соединения', null=True, blank=True)
    technical_condition_connection = models.CharField(max_length=255, verbose_name='Техническое состояние соединения',
                                                      null=True, blank=True)
    technical_condition_pipe = models.CharField(max_length=255, verbose_name='Техническое состояние трубы', null=True,
                                                blank=True)
    exploitation_time = models.DateTimeField(verbose_name='Время эксплуатации', null=True,
                                             blank=True)  # ЧТО ЗНАЧИТ ЭТО ПОЛЕ?
    history = HistoricalRecords()

    def last_lifting_pipe_repair(self):
        """Api function"""
        try:
            return self.lifting_pipe_repair.last()
        except Exception as e:
            print(f"Excpetion {e}")

    def __str__(self):
        return (f'Скважина: {self.well_id}' +
                f'Номер трубы от насоса: {self.pipe_number_from_the_pump}')

    class Meta:
        verbose_name = '1) Скважина --> Водоподъемная труба'
        verbose_name_plural = '1) Скважина --> Водоподъемные трубы'


class LiftingPipeRepair(models.Model):
    """Ремонт/обслуживание водоподъемной трубы"""
    lifting_pipe = models.ForeignKey(
        LiftingPipe,
        on_delete=models.CASCADE,
        related_name='lifting_pipe_repair',
        verbose_name='Водоподъемная труба',
    )
    TYPE_CHOICES = (
        ("Авария", "Авария"),
        ("Инцидент", "Инцидент")
    )
    time = models.TimeField(verbose_name='Время', null=True, blank=True, auto_now_add=True)
    shift_number = models.SmallIntegerField(verbose_name='Номер смены', null=True, blank=True)
    fullname = models.CharField(max_length=255, verbose_name="Дежурная смена, ФИО", null=True, blank=True)
    date_of_repair = models.DateField(verbose_name='Дата последнего ремонта', null=True, blank=True, auto_now_add=True)
    type_of_repair = models.CharField(max_length=255, verbose_name='Вид ремонта', choices=TYPE_CHOICES, null=True,
                                      blank=True)
    date_of_maintenance = models.DateField(verbose_name='Дата технического обслуживания', null=True, blank=True)
    type_of_maintenance = models.CharField(max_length=255, verbose_name='Вид технического обслужиавния', null=True,
                                           blank=True)
    date_of_technical_inspection = models.DateField(verbose_name='Дата технического осмотра', null=True, blank=True)
    note = models.CharField(max_length=255, verbose_name="Проведенные работы", null=True, blank=True)
    history = HistoricalRecords()

    def __str__(self):
        return f'{self.lifting_pipe}'

    class Meta:
        verbose_name = '1) Скважина --> Ремонт/замена водоподъемной трубы'
        verbose_name_plural = '1) Скважина --> Ремонт/замена водоподъемных труб'


class Pump(models.Model):
    """Раздел : Оборудование скважины"""
    well_id = models.OneToOneField(
        Well,
        on_delete=models.CASCADE,
        related_name='pumps',
        primary_key=True,
    )
    STATUS_CHOICES = (
        ("В работе", "В работе"),
        ("В резерве", "В резерве"),
        ("В ремонте", "В ремонте"),
    )
    status = models.CharField(max_length=100, choices=STATUS_CHOICES, verbose_name="Статус", null=True)
    pump_output = models.FloatField(verbose_name='Производительность насоса сквважины, мᶾ/ час',
                                    help_text='Обязательное поле')
    power = models.FloatField(verbose_name='Мощность насоса, Вт', help_text='Обязательное поле')
    operating_time_of_the_pump = models.FloatField(verbose_name='Наработка насоса, моточасы', null=True, blank=True, )
    nominal_current_pump_motor = models.FloatField(verbose_name='Номинальный ток электродвигателя насоса, А', null=True,
                                                   blank=True, )
    pump_pressure = models.FloatField(verbose_name='Напор насоса, МПа', help_text='Обязательное поле')
    type_of_pump = models.CharField(max_length=255, verbose_name='Тип насоса скважины', null=True, blank=True)
    mark_of_pump = models.CharField(max_length=255, verbose_name='Марка насоса скважины', null=True, blank=True)
    manufacturer = models.CharField(max_length=255, verbose_name="Завод изготовитель", null=True, blank=True)
    manufacturer_number = models.CharField(max_length=255, verbose_name='Заводской номер', unique=True, null=True,
                                           blank=True)
    pump_parametrs = models.CharField(max_length=255, verbose_name='Параметры насоса', null=True, blank=True)
    pump_output = models.DecimalField(max_digits=20, decimal_places=2,
                                      verbose_name='Производительность насоса сквважины, мᶾ/ час',
                                      help_text='Обязательное поле')
    deep_instalation_pump = models.DecimalField(max_digits=20, decimal_places=2,
                                                verbose_name='Глубина установки насоса скважины',
                                                help_text='Обязательное поле')
    history = HistoricalRecords()

    def last_pump_repair(self):
        """Api function"""
        try:
            return self.pump_repair.last()
        except Exception as e:
            print(f"Excpetion {e}")

    def __str__(self):
        return (f'Заодской номер: {self.manufacturer_number}' +
                f'Скважина: {self.well_id}')

    class Meta:
        verbose_name = '1) Скважина --> Насос'
        verbose_name_plural = '1) Скважина --> Насосы'


class PumpRepair(models.Model):
    """Ремонт/замена Насоса"""
    pump = models.ForeignKey(
        Pump,
        on_delete=models.CASCADE,
        related_name='pump_repair',
        verbose_name='Насос',
    )
    TYPE_CHOICES = (
        ("Авария", "Авария"),
        ("Инцидент", "Инцидент")
    )
    time = models.TimeField(verbose_name='Время', null=True, blank=True, auto_now_add=True)
    shift_number = models.SmallIntegerField(verbose_name='Номер смены', null=True, blank=True)
    fullname = models.CharField(max_length=255, verbose_name="Дежурная смена, ФИО", null=True, blank=True)
    date_of_repair = models.DateField(verbose_name='Дата последнего ремонта', null=True, blank=True, auto_now_add=True)
    type_of_repair = models.CharField(max_length=255, verbose_name='Вид последнего ремонта', choices=TYPE_CHOICES,
                                      null=True, blank=True)
    date_of_maintenance = models.DateField(verbose_name='Дата последнего технического обслуживания', null=True,
                                           blank=True)
    type_of_maintenance = models.CharField(max_length=255, verbose_name='Вид технического обслуживания', null=True,
                                           blank=True)
    date_of_technical_inspection = models.DateField(verbose_name='Дата технического осмотра', null=True, blank=True)
    conclusion_of_technical_inspection = models.CharField(max_length=255,
                                                          verbose_name='Заключение технического осмотра',
                                                          null=True, blank=True)
    note = models.CharField(max_length=255, verbose_name="Проведенные работы", null=True, blank=True)
    history = HistoricalRecords()

    def __str__(self):
        return f'Заводской номер насоса: {self.pump.manufacturer_number}'

    class Meta:
        verbose_name = '1) Скважина --> Ремонт/Замена насоса на скважине'
        verbose_name_plural = '1) Скважина --> Ремонт/Замена насоса на скважинах'


class Filter(models.Model):
    """Раздел : Оборудование скважины"""
    well_id = models.ForeignKey(
        Well,
        on_delete=models.CASCADE,
        related_name='filters',
    )
    STATUS_CHOICES = (
        ("В работе", "В работе"),
        ("В резерве", "В резерве"),
        ("В ремонте", "В ремонте"),
    )
    status = models.CharField(max_length=100, choices=STATUS_CHOICES, verbose_name="Статус", null=True)
    construction_of_filter = models.CharField(max_length=255, verbose_name='Конструкция фильтров скважины', null=True,
                                              blank=True)
    carcass_of_filter = models.CharField(max_length=255, verbose_name='Каркас фильтра скважины', null=True, blank=True)
    filter_diametr = models.DecimalField(max_digits=20, decimal_places=2, verbose_name='Диаметр фильтра скважины',
                                         null=True, blank=True)
    numbers_of_hole = models.PositiveBigIntegerField(verbose_name='Количество отверстий фильтра скважины', null=True,
                                                     blank=True)
    location_of_hole = models.CharField(max_length=255, verbose_name='Расположение отверстий фильтра скважины',
                                        null=True, blank=True)
    filter_network = models.CharField(max_length=255, verbose_name='Cетка фильтра скважины', null=True, blank=True)
    type_of_network = models.CharField(max_length=255, verbose_name='Тип сетки фильтра скважины', null=True, blank=True)
    diametr_of_network = models.DecimalField(max_digits=20, decimal_places=2, verbose_name='Диаметр сетки', null=True,
                                             blank=True)
    granulometric_composition = models.CharField(max_length=255,
                                                 verbose_name='Гранулометрический состав гравийной засыпки', null=True,
                                                 blank=True)
    another_data = models.CharField(max_length=255, verbose_name='Иные данные фильра скважины', null=True, blank=True)
    history = HistoricalRecords()

    def last_filter_repair(self):
        """Api function"""
        try:
            return self.filter_repair.last()
        except Exception as e:
            print(f"Excpetion {e}")

    def __str__(self):
        return (f'Скважины: {self.well_id}' +
                f'ID Фильтра: {self.pk}')

    class Meta:
        verbose_name = '1) Скважина --> Фильтр'
        verbose_name_plural = '1) Скважина --> Фильтры'


class FilterRepair(models.Model):
    """Ремонт/замена филтра на скважине"""
    filter = models.ForeignKey(
        Filter,
        on_delete=models.CASCADE,
        related_name='filter_repair',
        verbose_name='Фильтр',
    )
    TYPE_CHOICES = (
        ("Авария", "Авария"),
        ("Инцидент", "Инцидент")
    )
    time = models.TimeField(verbose_name='Время', null=True, blank=True, auto_now_add=True)
    shift_number = models.SmallIntegerField(verbose_name='Номер смены', null=True, blank=True)
    fullname = models.CharField(max_length=255, verbose_name="Дежурная смена, ФИО", null=True, blank=True)
    date_of_repair = models.DateField(verbose_name='Дата последнего ремонта', null=True, blank=True, auto_now_add=True)
    type_of_repair = models.CharField(max_length=255, verbose_name='Вид последнего ремонта', choices=TYPE_CHOICES,
                                      null=True, blank=True)
    date_of_maintenance = models.DateField(verbose_name='Дата последнего технического обслуживания', null=True,
                                           blank=True)
    type_of_maintenance = models.CharField(max_length=255, verbose_name='Вид технического обслуживания', null=True,
                                           blank=True)
    date_of_technical_inspection = models.DateField(verbose_name='Дата технического осмотра', null=True, blank=True)
    conclusion_of_technical_inspection = models.CharField(max_length=255,
                                                          verbose_name='Заключение технического осмотра',
                                                          null=True, blank=True)
    note = models.CharField(max_length=255, verbose_name="Проведенные работы", null=True, blank=True)
    history = HistoricalRecords()

    def __str__(self):
        return (f'{self.filter}' +
                f'{self.date_of_repair}')

    class Meta:
        verbose_name = '1) Скважина --> Ремонт/замена фильтра'
        verbose_name_plural = '2) Скважина --> Ремонт/замена фильтра'


class Debit(models.Model):
    """Раздел : Cведения производительности скважины"""
    well_id = models.ForeignKey(
        Well,
        on_delete=models.CASCADE,
        related_name='debits',
    )
    type_of_debit_measuring_device = models.CharField(max_length=100,
                                                      verbose_name='Тип устройства для измерения дебита скважины',
                                                      null=True, blank=True)
    mark_of_debit_measuring_device = models.CharField(max_length=100,
                                                      verbose_name='Марка устройста для измерения дебита скважины',
                                                      null=True, blank=True)
    data_of_debit_measuring = models.DateField(verbose_name='Дата измерения дебита', null=True, blank=True)
    debit_litr_in_sec = models.FloatField(verbose_name='Дебит скважины л/сек', null=True, blank=True)
    debit_metr_in_hour = models.FloatField(verbose_name='Дебит скважины мᶾ/ час', null=True, blank=True)
    debit_metr_in_day = models.FloatField(verbose_name='Дебит скважины мᶾ/ сутки', null=True, blank=True)
    specific_debit_litr_in_sec = models.FloatField(verbose_name='Удельный дебит скважины л/сек',
                                                   help_text='Обязательное поле')
    specific_debit_metr_in_hour = models.FloatField(verbose_name='Удельный дебит скважины мᶾ/ час', null=True,
                                                    blank=True)
    history = HistoricalRecords()

    def __str__(self):
        return (f'Скважина: {self.well_id}' +
                f'ID: {self.pk}')

    class Meta:
        verbose_name = '1) Скважина --> Дебит'
        verbose_name_plural = '1) Скважина --> Дебит'


class GeoTechnicalSection(models.Model):
    """Раздел : Геологические характеристики скважины"""
    well_id = models.ForeignKey(
        Well,
        on_delete=models.CASCADE,
        related_name='geo_technical_sections',
    )
    layer_number = models.PositiveBigIntegerField(verbose_name='Номер слоя', null=True, blank=True)
    scale_of_deep = models.DecimalField(max_digits=20, decimal_places=2, verbose_name='Шкала глубин', null=True,
                                        blank=True)
    index = models.CharField(max_length=255, verbose_name='Индекс', null=True, blank=True)
    breed_description = models.CharField(max_length=255, verbose_name='Описание породы', null=True, blank=True)
    power_of_layer = models.IntegerField(verbose_name='Мощность слоя', null=True, blank=True)
    seam_roof_depth = models.DecimalField(max_digits=20, decimal_places=2,
                                          verbose_name='Глубина залегания кровли пласта, м', null=True, blank=True)
    seam_sole_depth = models.DecimalField(max_digits=20, decimal_places=2,
                                          verbose_name='Глубина залегания подошвы пласта, м', null=True, blank=True)
    geological_age_of_the_passed_rocks = models.CharField(max_length=255,
                                                          verbose_name='Геологический возраст пройденных пород',
                                                          null=True, blank=True)
    geological_index = models.CharField(max_length=255, verbose_name='Геологический индекс', null=True, blank=True)
    to_appear_ground_water_level = models.DecimalField(max_digits=20, decimal_places=2,
                                                       verbose_name='Появившийся уровень грунтовых вод, м', null=True,
                                                       blank=True)
    to_appear_ground_water_level_date = models.DateField(verbose_name='Дата появившегося уровня грунтовых вод',
                                                         null=True, blank=True)
    installing_ground_water_level = models.DecimalField(max_digits=20, decimal_places=2,
                                                        verbose_name='Установившися уровень грунтовых вод, м',
                                                        null=True,
                                                        blank=True)
    installing_ground_water_level_date = models.DateField(verbose_name='Дата установившегося уровня грунтовых вод',
                                                          null=True, blank=True)
    laboratory_ground_deep = models.DecimalField(max_digits=20, decimal_places=2,
                                                 verbose_name='Глубина отбора образцов для лаборатории, м', null=True,
                                                 blank=True)
    history = HistoricalRecords()

    def __str__(self):
        return f'Скважина: {self.well_id}'

    class Meta:
        verbose_name = '1) Скважина --> Геолого-технический разрез скважины'
        verbose_name_plural = '1) Скважина --> Геолого-технический разрезы скважины'


class ChemicalCompositionOfWater(models.Model):
    """Раздел : Биологические сведения о скважине"""
    well_id = models.ForeignKey(
        Well,
        on_delete=models.CASCADE,
        related_name='chemical_compositions_of_water',
    )
    date_take_water_sample = models.DateField(verbose_name='Дата взятия пробы воды', help_text='Обязательное поле')
    time_take_water_sample = models.TimeField(verbose_name='Время взятия пробы', help_text='Обязательное поле')
    data_analisys_water_sample = models.DateField(verbose_name='Дата производства анализа пробы воды', null=True,
                                                  blank=True)
    number_of_protocol_sample = models.CharField(max_length=255, verbose_name='№ протокола анализа пробы', null=True,
                                                 blank=True)
    total_number_of_microbe = models.CharField(max_length=255, verbose_name='Общее микробное число, КОЕ/мл.', null=True,
                                               blank=True)
    common_coliform_bacteria = models.CharField(max_length=255, verbose_name='Общие калиформные бактерии, КОЕ в 100мл.',
                                                null=True, blank=True)
    thermotolerant_coliform_bacteria = models.CharField(max_length=255,
                                                        verbose_name='Термотолерантные бактерии, КОЕ в 100мл.',
                                                        null=True, blank=True)
    coliphages = models.CharField(max_length=255, verbose_name='Колифаги, БОЕ/мл.', null=True, blank=True)
    conclution = models.TextField(verbose_name='Заключение', help_text='Обязательное поле')
    history = HistoricalRecords()

    def __str__(self):
        return f'Скважина: {self.well_id}'

    class Meta:
        verbose_name = '1) Скважина --> Химичиский состав воды'
        verbose_name_plural = '1) Скважина --> Химические составы воды'


class ClearingWell(models.Model):
    """Раздел : Биологические сведения о скважине"""
    well_id = models.ForeignKey(
        Well,
        on_delete=models.CASCADE,
        related_name='clearing_wells',
    )
    date_of_clorination = models.DateField(verbose_name='Дата хлорирования', null=True, blank=True)
    clorination_concentration = models.DecimalField(max_digits=20, decimal_places=2,
                                                    verbose_name='Концентрация хлорной воды мг/дмᶾ', null=True,
                                                    blank=True)
    time_on_contact = models.TimeField(verbose_name='Время контакта хлора с подземной водой, ч.', null=True, blank=True)
    clearning_method = models.CharField(max_length=255, verbose_name='Способ очистки скважины', null=True, blank=True)
    data_of_clearning = models.DateField(verbose_name='Дата чистки скважины', null=True, blank=True)
    time_of_clearning = models.TimeField(verbose_name='Время чистки скважины', null=True, blank=True)
    history = HistoricalRecords()

    def __str__(self):
        return f'Скважина: {self.well_id}'

    class Meta:
        verbose_name = '1) Скважина --> Очистка скважины'
        verbose_name_plural = '1) Скважина --> Очистка скважин'


class WaterPumpingStation(models.Model):
    """
    ВЗУ
    """
    manage_org = models.CharField(max_length=100, verbose_name='Управляющая организация', help_text="Обязательное поле")
    area = models.CharField(max_length=255, verbose_name='Субъект', null=True, blank=True)
    district = models.CharField(max_length=255, verbose_name='Район', null=True, blank=True)
    city = models.CharField(max_length=255, verbose_name='Город', null=True, blank=True)
    location = models.CharField(max_length=255, verbose_name='Населенный пункт', null=True, blank=True)
    street = models.CharField(max_length=255, verbose_name='Улица', null=True, blank=True)
    house = models.CharField(max_length=255, verbose_name='Дом', null=True, blank=True)
    power = models.FloatField(verbose_name='Мощность ВНС, м³/ч.', null=True, blank=True)
    year_of_constraction = models.DateField(verbose_name='Год постройки', null=True, blank=True)
    year_of_commissioning = models.DateField(verbose_name='Год ввода в эксплуатацию', null=True, blank=True)
    total_area = models.FloatField(verbose_name='Общая площадь, кв.м.', null=True, blank=True)
    number_of_floors = models.PositiveBigIntegerField(verbose_name='Этажность', null=True, blank=True)
    construction_of_pavilion = models.CharField(max_length=255, verbose_name='Конструкция павильона', null=True,
                                                blank=True)
    materials_of_wall = models.CharField(max_length=255, verbose_name='Материал стен', null=True, blank=True)
    materials_of_roof = models.CharField(max_length=255, verbose_name='Материал кровли', null=True, blank=True)
    materials_of_foundation = models.CharField(max_length=255, verbose_name='Материал фундамента', null=True,
                                               blank=True)
    history = HistoricalRecords()

    def filtered_smena(self):
        """
        Api function
        Фильтрует смену
        """
        try:
            return self.smena.filter(flag_complete=False)
        except Exception as e:
            print(f"Exception {e}")

    def dynamic_settings_from_date(self, date):
        """
        Api function
        Возвращает динамические параметры по заданной дате
        """
        try:
            smena = set(self.smena.filter(dynamic_settings__date=date))
            all_query_list = []
            for x in smena:
                get = x.dynamic_settings.filter(date=date)
                all_query_list.append(get)
            all_query = list(chain.from_iterable(all_query_list))
            return all_query
        except Exception as e:
            print(f"Exception {e}")

    def chlorine_from_date(self, date):
        """
        Api function
        Возвращает хлор по заданной дате
        """
        try:
            smena = set(self.smena.filter(chlorine__date=date))
            all_query_list = []
            for x in smena:
                get = x.chlorine.filter(date=date)
                all_query_list.append(get)
            all_query = list(chain.from_iterable(all_query_list))
            return all_query
        except Exception as e:
            print(f"Exception {e}")

    def operational_information_from_date(self, date):
        """
        Api function
        Возвращает оперативную информацию по заданной дате
        """
        try:
            smena = set(self.smena.filter(operational_information__date=date))
            all_query_list = []
            for x in smena:
                get = x.operational_information.filter(date=date)
                all_query_list.append(get)
            all_query = list(chain.from_iterable(all_query_list))
            return all_query
        except Exception as e:
            print(f"Exception {e}")

    def __str__(self):
        return (f'/ Субъект: {self.area}' +
                f'/ Город: {self.city}' +
                f'/ Улица: {self.street}' +
                f'/ Управляющая организация: {self.manage_org}')

    class Meta:
        verbose_name = '2) ВНС --> Водопроводно-насосная станция'
        verbose_name_plural = '2) ВНС --> Водопроводно-насосные станции'


class WaterPumpingStationPump(models.Model):
    """
    ВНС
    Насос
    """
    PUMP_PURPOSE_CHOICES = (
        ("Основной", "Основной"),
        ("Резервный", "Резервный"),
    )
    STATUS_CHOICES = (
        ("В работе", "В работе"),
        ("В резерве", "В резерве"),
        ("В ремонте", "В ремонте"),
    )
    water_pumping_station = models.ForeignKey(
        WaterPumpingStation,
        on_delete=models.CASCADE,
        related_name='water_pumping_station_pump',
        verbose_name='Водопроводно-насосная станция',
    )
    status = models.CharField(max_length=100, choices=STATUS_CHOICES, verbose_name="Статус", null=True)
    number_of_line = models.PositiveBigIntegerField(verbose_name='Номер линии', null=True, blank=True)
    type_of_pump = models.CharField(max_length=255, verbose_name='Тип насоса', null=True, blank=True)
    pump_purpose = models.CharField(max_length=31, choices=PUMP_PURPOSE_CHOICES, verbose_name='Назначение насоса',
                                    blank=True)
    mark_of_pump = models.CharField(max_length=255, verbose_name='Марка насоса', null=True, blank=True)
    manufacturer_pump_number = models.CharField(max_length=255, verbose_name='Заводской номер', unique=True, blank=True,
                                                null=True, )
    year_of_pump = models.DateField(verbose_name='Год ввода в эксплуатацию', null=True, blank=True)
    efficiency_pump = models.FloatField(verbose_name='Производительность насоса, мᶾ/ час',
                                        help_text='Обязательное поле')
    pump_pressuere = models.FloatField(verbose_name='Напор, Мпа', help_text='Обязательное поле')
    brand_of_electric_motor = models.CharField(max_length=255, verbose_name='Тип, марка электродвигателя', null=True,
                                               blank=True)
    power_of_electric_motor = models.FloatField(verbose_name='Мощность, кВт', null=True, blank=True)
    number_of_revolutions = models.FloatField(verbose_name='Число оборотов, об/мин', null=True, blank=True)
    history = HistoricalRecords()

    def last_water_pumping_station_pump_repair(self):
        """
        Api function
        Фильтрует ремонты насоса на ВЗУ
        """
        try:
            return self.water_pumping_station_pump_repair.last()
        except Exception as e:
            print(f"Excpetion {e}")

    def __str__(self):
        return (f'Заводской номер насоса: {self.manufacturer_pump_number}' +
                f'/ВНС: {self.water_pumping_station}')

    class Meta:
        verbose_name = '2) ВНС --> Насос водопроводно-насосной станции'
        verbose_name_plural = '2) ВНС --> Насосы водопроводно-насосных станций'


class WaterPumpingStationPumpConventer(models.Model):
    """
    ВНС
    Частотный преобразователь
    """
    water_pumping_station_pump = models.ForeignKey(
        WaterPumpingStationPump,
        on_delete=models.CASCADE,
        related_name='water_pumping_station_pump_conventer',
        verbose_name='Насос на водопроводно-насосной станции',
    )
    STATUS_CHOICES = (
        ("В работе", "В работе"),
        ("В резерве", "В резерве"),
        ("В ремонте", "В ремонте"),
    )
    status = models.CharField(max_length=100, choices=STATUS_CHOICES, verbose_name="Статус", null=True)
    frequency_converter = models.CharField(max_length=255, verbose_name='Частотный преобразователь Nч', null=True,
                                           blank=True)
    type_of_frequency_converter = models.CharField(max_length=255, verbose_name='Тип, марка Nч', null=True,
                                                   blank=True)
    year_of_frequency_converter = models.DateField(verbose_name='Год ввода в эксплуатацию(Nч)',
                                                   null=True, blank=True)
    history = HistoricalRecords()

    def __str__(self):
        return (f'Nч: {self.frequency_converter}' +
                f'/ Заводской номер насоса: {self.water_pumping_station_pump.manufacturer_pump_number}' +
                f'/ВНС: {self.water_pumping_station_pump.water_pumping_station}'
                )

    class Meta:
        verbose_name = '2) ВНС --> Частотный преобразователь на ВНС'
        verbose_name_plural = '2) ВНС --> Частотный преобразователь на ВНС'


class WaterPumpingStationConventerRepair(models.Model):
    """
    ВНС
    Ремнот/замена частотного преобразвоателя
    """
    water_pumping_station_conventer = models.ForeignKey(
        WaterPumpingStationPumpConventer,
        on_delete=models.CASCADE,
        related_name='water_pumping_station_conventer_repair',
        verbose_name='Nч',
    )
    TYPE_CHOICES = (
        ("Авария", "Авария"),
        ("Инцидент", "Инцидент")
    )
    date_of_repair_frequency_converter = models.DateField(verbose_name='Дата последнего ремонта(Nч)',
                                                          null=True, blank=True)
    type_of_repair_frequency_converter = models.CharField(max_length=255,
                                                          verbose_name='Тип последнего ремнонта(Nч)',
                                                          null=True, blank=True, choices=TYPE_CHOICES)
    date_of_technical_inspection_frequency_converter = models.DateField(verbose_name='Дата технического осмотра(Nч)',
                                                                        null=True, blank=True)
    conclusion_frequency_converter = models.CharField(max_length=255,
                                                      verbose_name='Заключение технического осмотра(Nч)',
                                                      null=True, blank=True)
    note = models.CharField(max_length=255, verbose_name="Проведенные работы", null=True, blank=True)
    history = HistoricalRecords()

    def __str__(self):
        return (f'ID: {self.pk}' +
                f'/ Nч: {self.water_pumping_station_conventer.frequency_converter}' +
                f'/ Заводской номер насоса: {self.water_pumping_station_conventer.water_pumping_station_pump.manufacturer_pump_number}' +
                f'/ ID ВНС: {self.water_pumping_station_conventer.water_pumping_station_pump.water_pumping_station.pk}')

    class Meta:
        verbose_name = '2) ВНС --> Ремонт/замена частотного преобразователя на ВНС'
        verbose_name_plural = '2) ВНС --> Ремонт/замена частотного преобразователя на ВНС'


class WaterPumpingStationPumpRepair(models.Model):
    """
    ВНС
    Ремонт/замена насосов
    """
    water_pumping_station_pump = models.ForeignKey(
        WaterPumpingStationPump,
        on_delete=models.CASCADE,
        related_name='water_pumping_station_pump_repair',
        verbose_name='Насос на водопроводно-насосной станции',
    )
    TYPE_CHOICES = (
        ("Шум, стук", "Шум, стук"),
        ("Вибрация повыш.", "Вибрация повыш."),
        ("Температура > 70гр.", "Температура > 70гр."),
        ("Дым, изоляция", "Дым, изоляция"),
        ("Мех. повреждения", "Мех. повреждения"),
        ("Несчастный случай", "Несчастный случай"),
        ("Инцидент", "Инцидент")
    )
    BROKEN_CHOICES = (
        ("Запорная арматура", "Запорная арматура"),
        ("Агрегат насосный", "Агрегат насосный"),
        ("КИПиА", "КИПиА"),
        ("N линии трубопровода", "N линии трубопровода"),
    )
    time = models.TimeField(verbose_name='Время', null=True, blank=True, auto_now_add=True)
    shift_number = models.SmallIntegerField(verbose_name='Номер смены', null=True, blank=True)
    fullname = models.CharField(max_length=255, verbose_name="Дежурная смена, ФИО", null=True, blank=True)
    date_of_repair = models.DateField(verbose_name='Дата последнего ремонта', null=True, blank=True, auto_now_add=True)
    type_of_repair = models.CharField(max_length=255, verbose_name='Вид последнего ремонта', null=True, blank=True,
                                      choices=TYPE_CHOICES)
    broken = models.CharField(max_length=255, verbose_name="Сломанное устройство", choices=BROKEN_CHOICES, null=True,
                              blank=True)
    date_of_maintenance = models.DateField(verbose_name='Дата последнего технического обслуживания', null=True,
                                           blank=True)
    type_of_maintenance = models.CharField(max_length=255, verbose_name='Вид технического обслуживания',
                                           null=True, blank=True)
    date_of_technical_inspection = models.DateField(verbose_name='Дата технического осмотра', null=True, blank=True)
    conclusion_of_technical_inspection = models.CharField(max_length=255,
                                                          verbose_name='Заключение технического осмотра', null=True,
                                                          blank=True)
    note = models.CharField(max_length=255, verbose_name="Проведенные работы", null=True, blank=True)
    history = HistoricalRecords()

    def __str__(self):
        return (f'Заводской номер насоса: {self.water_pumping_station_pump.manufacturer_pump_number}' +
                f'ВНС: {self.water_pumping_station_pump.water_pumping_station}')

    class Meta:
        verbose_name = '2) ВНС --> Ремонт/замена насоса на ВНС'
        verbose_name_plural = '2) ВНС --> Ремонт/замена насоса на водопроводно-насосной станции'


class WaterTower(models.Model):
    """Водонапорная башня"""
    MATERIAL_CHOICES = (
        ("Металл", "Металл"),
        ("Кирпич", "Кирпич"),
    )
    STATUS_CHOICES = (
        ("В работе", "В работе"),
        ("В резерве", "В резерве"),
        ("В ремонте", "В ремонте"),
    )
    status = models.CharField(max_length=100, choices=STATUS_CHOICES, verbose_name="Статус", null=True)
    type = models.CharField(max_length=255, verbose_name='Тип, модель оборудования', null=True, blank=True)
    working_volume = models.FloatField(verbose_name='Рабочий объем, куб.м', help_text='Обязательное поле')
    cadastral_number = models.CharField(max_length=25, verbose_name='Кадастровый номер', unique=True, null=True,
                                        help_text='Обязательное поле', )
    inventory_number = models.FloatField(verbose_name='Инвентарный номер', null=True, blank=True)
    area = models.CharField(max_length=255, verbose_name='Субъект', null=True, blank=True)
    district = models.CharField(max_length=255, verbose_name='Район', null=True, blank=True)
    city = models.CharField(max_length=255, verbose_name='Город', null=True, blank=True)
    location = models.CharField(max_length=255, verbose_name='Населенный пункт', null=True, blank=True)
    street = models.CharField(max_length=255, verbose_name='Улица', null=True, blank=True)
    house = models.CharField(max_length=255, verbose_name='Дом', null=True, blank=True)
    year_install = models.DateField(verbose_name='Год установки', null=True, blank=True)
    year_of_commissioning = models.DateField(verbose_name='Год ввода в эксплуатацию', help_text='Обязательное поле')
    manufacturer_number = models.FloatField(verbose_name='Заводской номер', null=True, blank=True)
    material = models.CharField(max_length=20, verbose_name='Материал', choices=MATERIAL_CHOICES)
    number_of_sensors = models.PositiveBigIntegerField(verbose_name='Количество сопряженных датчиков, шт.', null=True,
                                                       blank=True)
    history = HistoricalRecords()

    def __str__(self):
        return f'Кадастровый номер: {self.cadastral_number}'

    class Meta:
        verbose_name = "3) ВНБ --> Водонапорная башня"
        verbose_name_plural = "3) ВНБ --> Водонапорные башни"


class WaterTowerRepairData(models.Model):
    """Ремонт/Замена Водонапорной башни"""
    water_tower = models.ForeignKey(
        WaterTower,
        on_delete=models.CASCADE,
        related_name='water_tower_repair_data',
    )
    TYPE_CHOICES = (
        ("КИПиА", "КИПиА"),
        ("Инцидент", "Инцидент")
    )
    time = models.TimeField(verbose_name='Время', null=True, blank=True, auto_now_add=True)
    shift_number = models.SmallIntegerField(verbose_name='Номер смены', null=True, blank=True)
    fullname = models.CharField(max_length=255, verbose_name="Дежурная смена, ФИО", null=True, blank=True)
    type_of_repair = models.CharField(max_length=255, verbose_name='Вид последнего ремонта',
                                      null=True, blank=True, choices=TYPE_CHOICES)
    date_of_repair = models.DateField(verbose_name='Дата ремонта, замены', null=True, blank=True)
    description_repair = models.CharField(max_length=255, verbose_name='Выполненные работы', null=True, blank=True)
    history = HistoricalRecords()

    def __str__(self):
        return f'Кадастровый номер: {self.water_tower}'

    class Meta:
        verbose_name = '3) ВНБ --> Ремонт/замена водонапорной башни'
        verbose_name_plural = '3) ВНБ --> Ремонт/замена водонапорных башен'


class WaterTowerTechnicalInformation(models.Model):
    """Технические характеристики водонапорной башни"""
    water_tower = models.OneToOneField(
        WaterTower,
        on_delete=models.CASCADE,
        related_name='water_tower_technical_information',
        verbose_name='Водонапорная башня',
        primary_key=True,
    )
    circuit_voltage = models.IntegerField(verbose_name='Напряжение трехфазной цепи, В', null=True, blank=True)
    amount_of_chanels = models.PositiveBigIntegerField(verbose_name='Количество силовых каналов, шт.', null=True,
                                                       blank=True)
    microcontroller_voltage = models.FloatField(verbose_name='Напряжение электропитания в цепи микроконтроллера, В',
                                                null=True, blank=True)
    power_circuit_voltage = models.IntegerField(verbose_name='Напряжение в цепях питания датчиков, В', null=True,
                                                blank=True)
    fluctuations_interval = models.FloatField(verbose_name='Интервал допустимых колебаний напряжения,%', null=True,
                                              blank=True)
    power_consumption = models.FloatField(verbose_name='Потребляемая мощность, до, Вт', null=True, blank=True)
    history = HistoricalRecords()

    def __str__(self):
        return f'Кадастровый номер: {self.water_tower}'

    class Meta:
        verbose_name = '3) ВНБ --> Технические характеристики водонапорной башни'
        verbose_name_plural = '3) ВНБ --> Технические характеристики водонапорных башен'


class WaterTank(models.Model):
    """
    Резервуар
    Общая информация
    """
    water_pumping_station = models.ForeignKey(
        WaterPumpingStation,
        on_delete=models.CASCADE,
        related_name='water_tank',
        verbose_name='ВНС',
        null=True, blank=True,
    )
    TYPE_OF_PAVILION_CHOICES = (
        ("Надземный", "Надземный"),
        ("Заглубленный", "Заглубленный"),
        ("Подземный", "Подземный"),
    )
    TANK_FORM_CHOICES = (
        ("Горизонтальный цилиндрический", "Горизонтальный цилиндрический"),
        ("Вертикальный цилиндрический", "Вертикальный цилиндрический"),
    )
    MATERIAL_CHOICES = (
        ("Металл", "Металл"),
        ("Кирпич", "Кирпич"),
    )
    STATUS_CHOICES = (
        ("В работе", "В работе"),
        ("В резерве", "В резерве"),
        ("В ремонте", "В ремонте"),
    )
    status = models.CharField(max_length=100, choices=STATUS_CHOICES, verbose_name="Статус", null=True)
    purpose = models.CharField(max_length=255, verbose_name='Назначение', null=True, blank=True)
    capacity = models.FloatField(verbose_name='Номинальная вместимость, куб. м', null=True, blank=True)
    length = models.FloatField(verbose_name='Длинна', null=True, blank=True)
    width = models.FloatField(verbose_name='Ширина', null=True, blank=True)
    height = models.FloatField(verbose_name='Высота', null=True, blank=True)
    diametr = models.FloatField(verbose_name='Диаметр', null=True, blank=True)
    cadastral_number = models.CharField(max_length=255, verbose_name='Кадастровый номер')
    inventory_number = models.CharField(max_length=255, verbose_name='Инвертарный номер', unique=True)
    area = models.CharField(max_length=255, verbose_name='Субъект', null=True, blank=True)
    district = models.CharField(max_length=255, verbose_name='Район', null=True, blank=True)
    city = models.CharField(max_length=255, verbose_name='Город', null=True, blank=True)
    location = models.CharField(max_length=255, verbose_name='Населенный пункт', null=True, blank=True)
    street = models.CharField(max_length=255, verbose_name='Улица', null=True, blank=True)
    house = models.CharField(max_length=255, verbose_name='Дом', null=True, blank=True)
    year_of_installation = models.DateField(verbose_name='Год установки', null=True, blank=True)
    year_of_entered = models.DateField(verbose_name='Год ввода в эксплуатацию', null=True, blank=True)
    type_of_pavilion = models.CharField(max_length=30, verbose_name='Вид расположения',
                                        choices=TYPE_OF_PAVILION_CHOICES)
    tank_form = models.CharField(max_length=30, verbose_name='Форма резервуара', choices=TANK_FORM_CHOICES)
    material = models.CharField(max_length=15, verbose_name='Материал', choices=MATERIAL_CHOICES)
    history = HistoricalRecords()

    def __str__(self):
        return (f'Инвентарный номер: {self.inventory_number}' +
                f'/ВНС: {self.water_pumping_station}')

    class Meta:
        verbose_name = '4) Резервуар'
        verbose_name_plural = '4) Резервуары'
        ordering = ["-inventory_number"]


class WaterTankRepair(models.Model):
    """Эксплуатация резервуара"""
    water_tank = models.ForeignKey(
        WaterTank,
        on_delete=models.CASCADE,
        related_name='water_tank_repair',
        verbose_name='Резервуар',
    )
    date_exam = models.DateField(verbose_name='Дата обследования', null=True, blank=True)
    type_exam = models.CharField(max_length=255, verbose_name='Вид обследования', null=True, blank=True)
    date_of_repair = models.DateField(verbose_name='Дата ремонта, замены', null=True, blank=True)
    description_repair = models.CharField(max_length=255, verbose_name='Выполненные работы', null=True, blank=True)
    history = HistoricalRecords()

    def __str__(self):
        return f'{self.water_tank}'

    class Meta:
        verbose_name = '4) Эксплуатация резервуара'
        verbose_name_plural = '4) Эксплуатация резервуаров'


class PrefabricateWaterPipeline(models.Model):
    """Сборный водовод"""

    water_pumping_station = models.ForeignKey(
        WaterPumpingStation,
        on_delete=models.CASCADE,
        related_name='prefabricate_water_pipeline',
        verbose_name='Водопроводно-насосная станция',
    )
    area = models.CharField(max_length=255, verbose_name='Субъект', null=True, blank=True, )
    district = models.CharField(max_length=255, verbose_name='Район', null=True, blank=True, )
    city = models.CharField(max_length=255, verbose_name='Город', null=True, blank=True)
    location = models.CharField(max_length=255, verbose_name='Населенный пункт', null=True, blank=True)
    street = models.CharField(max_length=255, verbose_name='Улица', null=True, blank=True)
    house = models.CharField(max_length=255, verbose_name='Дом', null=True, blank=True)
    total_length = models.FloatField(verbose_name='Общая длина трубопровода, м', null=True, blank=True, )
    number_of_wells = models.PositiveBigIntegerField(verbose_name='Количество колодцев', null=True, blank=True, )
    laying_method = models.CharField(max_length=255, verbose_name='Способ прокладки', null=True, blank=True, )
    scheme_prefabricate_water_pipeline = models.ImageField(upload_to=water_pipeline_scheme,
                                                           verbose_name=' Схема сборного трубопровода', null=True,
                                                           blank=True)
    history = HistoricalRecords()

    def __str__(self):
        return (f'ID Сборного водовода: {self.pk}' +
                f'//ВЗУ: {self.water_pumping_station}')

    class Meta:
        verbose_name = '5) Сбордный водовод'
        verbose_name_plural = '5) Сборные водоводы'


class SectionOfTheWaterPipeline(models.Model):
    """Участок сборного водовода"""
    water_pipeline = models.ForeignKey(
        PrefabricateWaterPipeline,
        on_delete=models.CASCADE,
        related_name='section_of_the_water_pipeline',
        verbose_name='Сборный водовод',
    )
    length = models.FloatField(verbose_name='Длина трубопровода участка, м', null=True, blank=True, )
    plot_number = models.PositiveBigIntegerField(verbose_name='Номер участка', null=True, blank=True, )
    section_diametr = models.FloatField(verbose_name='Диаметр данного участка трубопровода, мм', null=True,
                                        blank=True, )
    history = HistoricalRecords()

    def __str__(self):
        return (f'{self.water_pipeline} ' +
                f' //Номер участка: {self.plot_number}')

    class Meta:
        verbose_name = '5) Участок сборного водовода'
        verbose_name_plural = '5) Участки сборного водовода'


class Pit(models.Model):
    """Люк//Колодец"""
    GATHERING_CHOICES = (
        ("Скобы", "Скобы"),
        ("Лестница", "Лестница"),
    )
    water_pipeline = models.ForeignKey(
        SectionOfTheWaterPipeline,
        on_delete=models.CASCADE,
        related_name='pit_on_section',
        verbose_name='Сборный водовод',
    )
    area = models.CharField(max_length=255, verbose_name='Субъект', null=True, blank=True)
    district = models.CharField(max_length=255, verbose_name='Район', null=True, blank=True)
    city = models.CharField(max_length=255, verbose_name='Город', null=True, blank=True)
    location = models.CharField(max_length=255, verbose_name='Населенный пункт', null=True, blank=True)
    street = models.CharField(max_length=255, verbose_name='Улица', null=True, blank=True)
    house = models.CharField(max_length=255, verbose_name='Дом', null=True, blank=True)
    pit_number = models.PositiveBigIntegerField(verbose_name='Номер колодца, Nк', null=True, blank=True)
    diametr_pit = models.FloatField(verbose_name='Диаметр', null=True, blank=True)
    deep = models.FloatField(verbose_name='Глубина', null=True, blank=True)
    material = models.CharField(max_length=255, verbose_name='Материал', null=True, blank=True)
    diametr_hatch = models.FloatField(verbose_name='Люк диаметр, м', null=True, blank=True)
    gathering = models.CharField(max_length=10, verbose_name='Сход', null=True, blank=True, choices=GATHERING_CHOICES)
    history = HistoricalRecords()

    def __str__(self):
        return (f'{self.water_pipeline.water_pipeline}' +
                f'  Номер учаска: {self.water_pipeline.plot_number}')

    class Meta:
        verbose_name = "5) Люк"
        verbose_name_plural = "5) Люки"
