from django.urls import reverse

from django.utils.safestring import mark_safe
from django.utils.html import format_html

from RSO.models import *

from simple_history.admin import SimpleHistoryAdmin

from RSO.moduls.inlines import *

AdminSite.empty_value_display = "-Нет данных-"


@admin.register(Well)
class WellHistoryAdmin(SimpleHistoryAdmin):
    list_display = ('pk', 'get_number', 'status', 'manage_org')
    history_list_display = ('pk', 'status', 'manage_org')
    inlines = [GeneralWellInformationInline, TechnicalWellInformationInline, DynamicWellParametrInline, WellPumpInline,
               ReinforcmentInline, ProcessPipeInline, LiftingPipeInline, ControlDeviceInline, FilterInline, DebitInline,
               GeoTechnicalSectionInline, ChemicalCompositionInline, ]
    list_filter = ('manage_org',)

    #   Берет номер скважины из "Общей информации"
    def get_number(self, obj):
        try:
            return obj.general_well_information.number_well
        except Exception as e:
            print(f"Exception {e}")
            return 0
    get_number.short_description = 'Номер скважины'


@admin.register(WellRepair)
class WellRepairHistoryAdmin(SimpleHistoryAdmin):
    list_display = ('pk', 'well', 'date_of_repair', 'type_of_repair', 'date_of_maintenance',
                    'type_of_maintenance', 'date_of_technical_inspection',)
    history_list_display = list_display


@admin.register(DynamicWellParametrs)
class DynamicWellParametrsHistoryAdmin(SimpleHistoryAdmin):
    list_display = ('pk', 'wells_link', 'static_well_level', 'dynamic_well_level',)
    history_list_display = list_display

    def wells_link(self, obj):
        try:
            link = reverse("admin:RSO_well_change", args=[obj.well_id.id])
            return mark_safe(f'<a href="{link}">{obj.well_id.manage_org}' +
                            f'№{obj.well_id.general_well_information.number_well}</a>')
        except Exception as e:
            print(f"Exception {e}")
    wells_link.allow_tags = True
    wells_link.short_description = 'Управляющая организация и номер скважины'


@admin.register(GeneralWellInformation)
class GeneralWellInformationHistoryAdmin(SimpleHistoryAdmin):
    list_display = ('pk', 'wells_link', 'type_of_property', 'number_well', 'type_of_pavilion', 'area', 'district',
                    'city', 'location', 'street', 'house',
                    )
    history_list_display = list_display
    fieldsets = (
        ('Основная информация', {
            'fields': ('well_id', 'type_of_property', 'photo_objcect', 'type_of_pavilion', 'area', 'district', 'city', 'location',
                       'street', 'house', 'number_well', 'purpose_well', 'usage_license',
                       )
        }),
        ('Дополнительная информация', {
            'classes': ('collapse',),
            'fields': ('absolute_mark_of_the_wellhead', 'deep', 'numbers_of_layers', 'usage_information', 'river_basin',
                       'water_managment_region', 'underground_water_pool', 'underground_water_deposit',
                       'water_bearing_horizon', 'position_in_relief', 'type_of_water_consumption', 'water_user',
                       'drilling_method', 'drilling_organization', 'drilling_start_date', 'drilling_end_date',
                       'construction_of_pavilion', 'inv_number_of_pavilion',
                       'date_of_signing_the_acceptance_certificate', 'well_commissioning_date', 'well_plugging_date',),
        }),
    )

    def wells_link(self, obj):
        try:
            link = reverse("admin:RSO_well_change", args=[obj.well_id.id])
            return mark_safe(f'<a href="{link}">{obj.well_id.manage_org}' +
                            f'№{obj.well_id.general_well_information.number_well}</a>')
        except Exception as e:
            print(f"Exception {e}")
    wells_link.allow_tags = True
    wells_link.short_description = 'Управляющая организация и номер скважины'


@admin.register(Reinforcment)
class ReinforcmentHistoryAdmin(SimpleHistoryAdmin):
    list_display = ('pk', 'wells_link', 'reinforcment_name', 'reinforcment_type', 'driver_type', 'year_of_manufacture',)
    history_list_display = list_display

    def wells_link(self, obj):
        try:
            link = reverse("admin:RSO_well_change", args=[obj.well_id.id])
            return mark_safe(f'<a href="{link}">{obj.well_id.manage_org}' +
                            f'№{obj.well_id.general_well_information.number_well}</a>')
        except Exception as e:
            print(f"Exception {e}")
    wells_link.allow_tags = True
    wells_link.short_description = 'Управляющая организация и номер скважины'


@admin.register(ReinforcmentRepair)
class ReinforcmentRepairHistoryAdmin(SimpleHistoryAdmin):
    list_display = ('pk', 'reinforcment',  'date_of_repair', 'type_of_repair', 'date_of_maintenance',
                    'type_of_maintenance', 'date_of_technical_inspection', )
    history_list_display = list_display

    # def reinforcment_link(self, obj):
    #     link = reverse("admin:RSO_reinforcment_change", args=[obj.reinforcment_id.id])
    #     return mark_safe('<a href="{}">{}</a>'.format(
    #         link,
    #         obj.reinforcment_id.id
    #     ))
    # reinforcment_link.allow_tags = True
    # reinforcment_link.short_description = 'ID Арматуры'


@admin.register(ProcessPipe)
class ProcessPipeHistoryAdmin(SimpleHistoryAdmin):
    list_display = (
        'pk', 'wells_link', 'name_of_site', 'lenght', 'outside_diametr', 'wall_thickness',
        'installation_date',
    )
    history_list_display = list_display

    def wells_link(self, obj):
        try:
            link = reverse("admin:RSO_well_change", args=[obj.well_id.id])
            return mark_safe(f'<a href="{link}">{obj.well_id.manage_org}' +
                            f'№{obj.well_id.general_well_information.number_well}</a>')
        except Exception as e:
            print(f"Exception {e}")
    wells_link.allow_tags = True
    wells_link.short_description = 'Управляющая организация и номер скважины'


@admin.register(ControlDevice)
class ControlDeviceHistoryAdmin(SimpleHistoryAdmin):
    list_display = ('pk', 'wells_link', 'serial_number', 'type_control_device', 'model_control_device',
                    'year_of_manufacturer',)
    inlines = [ControlDeviceValueInline]
    history_list_display = list_display
    fieldsets = (
        ('Основная информация', {
            'fields': ('well_id', 'serial_number', 'purpose_control_device', 'type_control_device',
                       'model_control_device', 'manufacturer', 'year_of_manufacture', 'settings_and_parametrs',
                       'date_of_entry_into_operation', 'capacity',
                       )
        }),
        ('Дополнительная информация', {
            'classes': ('collapse',),
            'fields': ('date_of_check', 'calibration_interval',
                       ),
        }),
    )

    def year_of_manufacturer(self, obj):
        if obj.year_of_manufacture:
            return obj.year_of_manufacture.strftime("%Y")
        else:
            return None
    year_of_manufacturer.short_description = 'Год изготовления'

    def wells_link(self, obj):
        try:
            link = reverse("admin:RSO_well_change", args=[obj.well_id.id])
            return mark_safe(f'<a href="{link}">{obj.well_id.manage_org}' +
                            f'№{obj.well_id.general_well_information.number_well}</a>')
        except Exception as e:
            print(f"Exception {e}")
    wells_link.allow_tags = True
    wells_link.short_description = 'Управляющая организация и номер скважины'


@admin.register(ControlDeviceValue)
class ControlDeviceValueHistoryAdmin(SimpleHistoryAdmin):
    list_display = ('pk', 'serial_number_link', 'date_values', 'begin_value', 'end_value', 'metr_consuption',)
    history_list_display = list_display

    def serial_number_link(self, obj):
        try:
            link = reverse("admin:RSO_controldevice_change", args=[obj.control_device_serial_number.serial_number])
            return mark_safe('<a href="{}">{}</a>'.format(
                link,
                obj.control_device_serial_number.serial_number
            ))
        except Exception as e:
            print(f"Exception {e}")

    serial_number_link.allow_tags = True
    serial_number_link.short_description = 'Серийный номер прибора'

    def date_values(self, obj):
        if obj.date_value:
            return obj.date_value.strftime("%m %Y")
        else:
            return None
    date_values.short_description = 'Текущий расчетный период (месяц)'


@admin.register(LiftingPipe)
class LiftingPipeHistoryAdmin(SimpleHistoryAdmin):
    list_display = ('pk', 'wells_link', 'pipe_number_from_the_pump', 'lenght', 'connection_type',
                    'technical_condition_connection',)
    history_list_display = list_display

    def wells_link(self, obj):
        try:
            link = reverse("admin:RSO_well_change", args=[obj.well_id.id])
            return mark_safe(f'<a href="{link}">{obj.well_id.manage_org}' +
                            f'№{obj.well_id.general_well_information.number_well}</a>')
        except Exception as e:
            print(f"Exception {e}")
    wells_link.allow_tags = True
    wells_link.short_description = 'Управляющая организация и номер скважины'


@admin.register(LiftingPipeRepair)
class LiftingPipeRepairHistoryAdmin(SimpleHistoryAdmin):
    list_display = ('pk', 'lifting_pipe',  'type_of_repair', 'date_of_maintenance', 'type_of_maintenance',
                    'date_of_technical_inspection',)
    history_list_display = list_display

    # def lifting_pipe_link(self, obj):
    #     link = reverse("admin:RSO_liftingpipe_change", args=[obj.lifting_pipe_id.id])
    #     return mark_safe('<a href="{}">{}</a>'.format(
    #         link,
    #         obj.lifting_pipe_id.id
    #     ))

    # lifting_pipe_link.allow_tags = True
    # lifting_pipe_link.short_description = 'ID Водоподъмной трубы'


@admin.register(Pump)
class PumpHistoryAdmin(SimpleHistoryAdmin):
    list_display = ('pk', 'wells_link', 'type_of_pump', 'mark_of_pump', 'manufacturer', 'pump_output', 'status')
    history_list_display = list_display

    def wells_link(self, obj):
        try:
            link = reverse("admin:RSO_well_change", args=[obj.well_id.id])
            return mark_safe(f'<a href="{link}">{obj.well_id.manage_org}' +
                            f'№{obj.well_id.general_well_information.number_well}</a>')
        except Exception as e:
            print(f"Exception {e}")
    wells_link.allow_tags = True
    wells_link.short_description = 'Управляющая организация и номер скважины'


@admin.register(PumpRepair)
class PumpRepairHistoryAdmin(SimpleHistoryAdmin):
    list_display = ('pk', 'pump_link',  'date_of_repair', 'type_of_repair',
                    'date_of_maintenance', 'type_of_maintenance', 'date_of_technical_inspection',
                    'conclusion_of_technical_inspection',)
    history_list_display = list_display

    def pump_link(self, obj):
        try:
            link = reverse("admin:RSO_pump_change", args=[obj.pump.pk])
            return mark_safe('<a href="{}">{}</a>'.format(
                link,
                obj.pump.pk
            ))
        except Exception as e:
            print(f"Exception {e}")

    pump_link.allow_tags = True
    pump_link.short_description = 'Насос'


@admin.register(Filter)
class FilterHistoryAdmin(SimpleHistoryAdmin):
    list_display = ('pk', 'wells_link', 'construction_of_filter', 'carcass_of_filter', 'filter_diametr',)
    history_list_display = list_display

    def wells_link(self, obj):
        try:
            link = reverse("admin:RSO_well_change", args=[obj.well_id.id])
            return mark_safe(f'<a href="{link}">{obj.well_id.manage_org}' +
                            f'№{obj.well_id.general_well_information.number_well}</a>')
        except Exception as e:
            print(f"Exception {e}")
    wells_link.allow_tags = True
    wells_link.short_description = 'Управляющая организация и номер скважины'


@admin.register(FilterRepair)
class FilterRepair(SimpleHistoryAdmin):
    list_display = ("pk", "date_of_repair", "type_of_repair", "date_of_maintenance", "type_of_maintenance",
                    "date_of_technical_inspection", "conclusion_of_technical_inspection")
    history_list_display = list_display

    def filter_link(self, obj):
        try:
            link = reverse("admin:RSO_filter_change", args=[obj.filter.id])
            return mark_safe('<a href="{}">{}</a>'.format(
                link,
                obj.filter.id
            ))
        except Exception as e:
            print(f"Exception {e}")

    filter_link.allow_tags = True
    filter_link.short_description = 'ID Фильтра'


@admin.register(TechnicalWellInformation)
class TechicalWellInformationHistoryAdmin(SimpleHistoryAdmin):
    list_display = ('pk', 'wells_link', 'diametr_casing_pipe', 'amount_of_reinforcment', 'amount_of_control_device',
                    'amount_of_filter', 'amount_of_lifting_pipe',)
    history_list_display = list_display
    readonly_fields = ('amount_of_reinforcment', 'amount_of_control_device', 'amount_of_filter',
                       'amount_of_lifting_pipe')

    def wells_link(self, obj):
        try:
            link = reverse("admin:RSO_well_change", args=[obj.well_id.id])
            return mark_safe(f'<a href="{link}">{obj.well_id.manage_org}' +
                             f'№{obj.well_id.general_well_information.number_well}</a>')
        except Exception as e:
            print(f"Exception {e}")
    wells_link.allow_tags = True
    wells_link.short_description = 'Управляющая организация и номер скважины'


@admin.register(Debit)
class DebitHistoryAdmin(SimpleHistoryAdmin):
    list_display = ('pk', 'wells_link', 'type_of_debit_measuring_device', 'data_of_debit_measuring',
                    'debit_litr_in_sec', 'debit_metr_in_hour', 'debit_metr_in_day', 'specific_debit_litr_in_sec',)
    history_list_display = list_display

    def wells_link(self, obj):
        try:
            link = reverse("admin:RSO_well_change", args=[obj.well_id.id])
            return mark_safe(f'<a href="{link}">{obj.well_id.manage_org}' +
                             f'№{obj.well_id.general_well_information.number_well}</a>')
        except Exception as e:
            print(f"Exception {e}")
    wells_link.allow_tags = True
    wells_link.short_description = 'Управляющая организация и номер скважины'


@admin.register(GeoTechnicalSection)
class GeoTechnicalSectionHistoryAdmin(SimpleHistoryAdmin):
    list_display = ('pk', 'wells_link', 'layer_number', 'scale_of_deep', 'index', 'breed_description',)
    history_list_display = list_display

    def wells_link(self, obj):
        try:
            link = reverse("admin:RSO_well_change", args=[obj.well_id.id])
            return mark_safe(f'<a href="{link}">{obj.well_id.manage_org}' +
                            f'№{obj.well_id.general_well_information.number_well}</a>')
        except Exception as e:
            print(f"Exception {e}")
    wells_link.allow_tags = True
    wells_link.short_description = 'Управляющая организация и номер скважины'


@admin.register(ChemicalCompositionOfWater)
class ChemicalCompositionOfWaterHistoryAdmin(SimpleHistoryAdmin):
    list_display = ('pk', 'wells_link', 'date_take_water_sample', 'time_take_water_sample', 'number_of_protocol_sample',
                    'total_number_of_microbe', 'common_coliform_bacteria',)
    history_list_display = list_display

    def wells_link(self, obj):
        try:
            link = reverse("admin:RSO_well_change", args=[obj.well_id.id])
            return mark_safe(f'<a href="{link}">{obj.well_id.manage_org}' +
                            f'№{obj.well_id.general_well_information.number_well}</a>')
        except Exception as e:
            print(f"Exception {e}")
    wells_link.allow_tags = True
    wells_link.short_description = 'Управляющая организация и номер скважины'


@admin.register(ClearingWell)
class ClearingWellHistoryAdmin(SimpleHistoryAdmin):
    list_display = ('pk', 'wells_link', 'date_of_clorination', 'clorination_concentration', 'time_on_contact',
                    'clearning_method', 'data_of_clearning', 'time_of_clearning',)
    history_list_display = list_display

    def wells_link(self, obj):
        try:
            link = reverse("admin:RSO_well_change", args=[obj.well_id.id])
            return mark_safe(f'<a href="{link}">{obj.well_id.manage_org}' +
                            f'№{obj.well_id.general_well_information.number_well}</a>')
        except Exception as e:
            print(f"Exception {e}")
    wells_link.allow_tags = True
    wells_link.short_description = 'Управляющая организация и номер скважины'


@admin.register(WaterPumpingStation)
class WaterPumpingStationHistoryAdmin(SimpleHistoryAdmin):

    #   Возвращает год из DateField
    def year_of_constraction(self, obj):
        try:
            return obj.year_of_constraction.strftime("%Y")
        except Exception as e:
            print(f"Exception {e}")

    year_of_constraction.short_description = 'Год постройки'

    def year_of_commissioning(self, obj):
        try:
            return obj.year_of_commissioning.strftime("%Y")
        except Exception as e:
            print(f"Exception {e}")

    year_of_commissioning.short_description = 'Год ввода в эксплуатацию'

    list_display = ('pk', 'manage_org', 'area', 'district', 'city', 'location', 'street', 'house', 'power', 'year_of_constraction',
                    'year_of_commissioning',)
    history_list_display = ('pk', 'area', 'district', 'city', 'location', 'street', 'house', 'power',
                            'year_of_constraction', 'year_of_commissioning',)
    inlines = [WaterPumpingStationPumpInline]


@admin.register(WaterPumpingStationPump)
class WaterPumpingStationPumpHistoryAdmin(SimpleHistoryAdmin):
    list_display = ('pk', 'water_pumping_station_link', 'number_of_line', 'type_of_pump', 'pump_purpose',
                    'mark_of_pump', 'manufacturer_pump_number', 'year_of_pump', 'efficiency_pump', 'pump_pressuere',
                    'brand_of_electric_motor', 'power_of_electric_motor', 'number_of_revolutions',)
    history_list_display = list_display
    inlines = [WaterPumpingStationPumpConventerInline,]
    list_filter = ("water_pumping_station",)

    def water_pumping_station_link(self, obj):
        try:
            link = reverse("admin:RSO_waterpumpingstation_change", args=[obj.water_pumping_station.id])
            return mark_safe('<a href="{}">{}</a>'.format(
                link,
                obj.water_pumping_station.manage_org
            ))
        except Exception as e:
            print(f"Exception {e}")

    water_pumping_station_link.allow_tags = True
    water_pumping_station_link.short_description = 'ID ВНС'


@admin.register(WaterPumpingStationPumpRepair)
class WaterPumpingStationPumpRepairHistoryAdmin(SimpleHistoryAdmin):
    list_display = ('pk', 'water_pumping_station_pump_link',  'date_of_repair', 'type_of_repair',
                    'date_of_maintenance', 'type_of_maintenance', 'date_of_technical_inspection',
                    'conclusion_of_technical_inspection',)
    history_list_display = list_display

    def water_pumping_station_pump_link(self, obj):
        try:
            link = reverse("admin:RSO_waterpumpingstationpump_change", args=[obj.water_pumping_station_pump.id])
            return mark_safe('<a href="{}">{}</a>'.format(
                link,
                obj.water_pumping_station_pump.manufacturer_pump_number
            ))
        except Exception as e:
            print(f"Exception {e}")

    water_pumping_station_pump_link.allow_tags = True
    water_pumping_station_pump_link.short_description = 'Заводской номер насоса на водопроводно-насосной станции'


@admin.register(WaterPumpingStationPumpConventer)
class WaterPumpingStationPumpConventerHistoryAdmin(SimpleHistoryAdmin):
    list_display = ('pk', 'water_pumping_station_pump_link', 'frequency_converter', 'type_of_frequency_converter',
                    'year_of_frequency_converter')
    history_list_display = list_display

    def water_pumping_station_pump_link(self, obj):
        try:
            link = reverse("admin:RSO_waterpumpingstationpump_change", args=[obj.water_pumping_station_pump.id])
            return mark_safe('<a href="{}">{}</a>'.format(
                link,
                obj.water_pumping_station_pump.manufacturer_pump_number
            ))
        except Exception as e:
            print(f"Exception {e}")

    water_pumping_station_pump_link.allow_tags = True
    water_pumping_station_pump_link.short_description = 'Заводской номер насоса на водопроводно-насосной станции'


@admin.register(WaterPumpingStationConventerRepair)
class WaterPumpingStationConventerRepairHistoryAdmin(SimpleHistoryAdmin):
    list_display = ('pk', 'water_pumping_station_conventer_link', 'date_of_repair_frequency_converter',
                    'type_of_repair_frequency_converter', 'date_of_technical_inspection_frequency_converter',
                    'conclusion_frequency_converter',)
    history_list_display = list_display

    def water_pumping_station_conventer_link(self, obj):
        try:
            link = reverse("admin:RSO_waterpumpingstationpumpconventer_change",
                           args=[obj.water_pumping_station_conventer.id])
            return mark_safe('<a href="{}">{}</a>'.format(
                link,
                obj.water_pumping_station_conventer.frequency_converter
            ))
        except Exception as e:
            print(f"Exception {e}")

    water_pumping_station_conventer_link.allow_tags = True
    water_pumping_station_conventer_link.short_description = 'Номер Nч'


@admin.register(WaterTower)
class WaterTowerHistoryAdmin(SimpleHistoryAdmin):
    list_display = ('type', 'working_volume', 'cadastral_number', 'inventory_number', 'material',)
    list_filter = ('cadastral_number', 'inventory_number', 'type',)
    history_list_display = list_display


@admin.register(WaterTowerRepairData)
class WaterTowerRepairDataHistoryAdmin(SimpleHistoryAdmin):
    list_display = ('pk', 'water_tower_link',  'date_of_repair', 'description_repair',)
    list_filter = ('water_tower__cadastral_number', 'date_of_repair',)
    history_list_display = list_display

    def water_tower_link(self, obj):
        try:
            link = reverse("admin:RSO_watertower_change", args=[obj.water_tower.cadastral_number])
            return mark_safe('<a href="{}">{}</a>'.format(
                link,
                obj.water_tower.cadastral_number
            ))
        except Exception as e:
            print(f"Exception {e}")

    water_tower_link.allow_tags = True
    water_tower_link.short_description = 'Кадастровый номер ВНБ'


@admin.register(WaterTowerTechnicalInformation)
class WaterTowerTechnicalInformationHistoryAdmin(SimpleHistoryAdmin):
    list_display = ('pk', 'water_tower_link', 'circuit_voltage', 'amount_of_chanels', 'microcontroller_voltage',
                    'power_circuit_voltage', 'fluctuations_interval', 'power_consumption',)
    list_filter = ('water_tower__cadastral_number',)
    history_list_display = list_display

    def water_tower_link(self, obj):
        try:
            link = reverse("admin:RSO_watertower_change", args=[obj.water_tower.cadastral_number])
            return mark_safe('<a href="{}">{}</a>'.format(
                link,
                obj.water_tower.cadastral_number
            ))
        except Exception as e:
            print(f"Exception {e}")

    water_tower_link.allow_tags = True
    water_tower_link.short_description = 'Кадастровый номер ВНБ'


@admin.register(WaterTank)
class WaterTankHistoryAdmin(SimpleHistoryAdmin):
    list_display = ("pk", "capacity", "size", "cadastral_number", "inventory_number", 'year_of_installation_Y',
                    'year_of_entered_Y',)
    history_list_display = list_display

    def year_of_installation_Y(self, obj):
        try:
            return obj.year_of_installation.strftime("%Y")
        except Exception as e:
            print(f"Exception {e}")

    year_of_installation_Y.short_description = 'Год установки'

    def year_of_entered_Y(self, obj):
        try:
            return obj.year_of_entered.strftime("%Y")
        except Exception as e:
            print(f"Exception {e}")
    year_of_entered_Y.short_description = 'Год ввода в эксплуатацию'

    def size(self, obj):
        try:
            return format_html(f'Длинна: {obj.length}' +
                               f'<br>Ширина: {obj.width}' +
                               f'<br>Высота: {obj.height}' +
                               f'<br>Диаметр {obj.diametr}')
        except Exception as e:
            print(f"Exception {e}")

    size.allow_tags = True
    size.short_description = 'Размеры'


@admin.register(WaterTankRepair)
class WaterTankRepairHistoryAdmin(SimpleHistoryAdmin):
    list_display = ("pk", "water_tank_link", "date_exam", "type_exam", "date_of_repair", "description_repair",)
    history_list_display = list_display

    def water_tank_link(self, obj):
        try:
            link = reverse("admin:RSO_watertank_change", args=[obj.water_tank.inventory_number])
            return mark_safe('<a href="{}">{}</a>'.format(
                link,
                obj.water_tank.inventory_number
            ))
        except Exception as e:
            print(f"Exception {e}")

    water_tank_link.allow_tags = True
    water_tank_link.short_description = 'Инвентарный номер резервуара'


@admin.register(PrefabricateWaterPipeline)
class PrefabricateWaterPipelineHistoryAdmin(SimpleHistoryAdmin):
    list_display = ('area', 'water_pumping_station_link', 'district', 'city', 'location', 'street', 'house',
                    'total_length', 'number_of_wells', 'laying_method',)
    history_list_display = list_display

    def water_pumping_station_link(self, obj):
        try:
            link = reverse("admin:RSO_waterpumpingstation_change", args=[obj.water_pumping_station.id])
            return mark_safe('<a href="{}">{}</a>'.format(
                link,
                obj.water_pumping_station.id
            ))
        except Exception as e:
            print(f"Exception {e}")

    water_pumping_station_link.allow_tags = True
    water_pumping_station_link.short_description = 'ID Водопроводно-насосной станции'


@admin.register(SectionOfTheWaterPipeline)
class SectionOfTheWaterPipelineHistoryAdmin(SimpleHistoryAdmin):
    list_display = ('pk', 'prefabricate_water_pipeline_link', 'length', 'plot_number', 'section_diametr',)
    history_list_display = list_display

    def prefabricate_water_pipeline_link(self, obj):
        try:
            link = reverse("admin:RSO_prefabricatewaterpipeline_change", args=[obj.water_pipeline.id])
            return mark_safe('<a href="{}">{}</a>'.format(
                link,
                obj.water_pipeline.id
            ))
        except Exception as e:
            print(f"Exception {e}")
    prefabricate_water_pipeline_link.allow_tags = True
    prefabricate_water_pipeline_link.short_description = 'ID Сборного водовода'


@admin.register(Pit)
class PitHistoryAdmin(SimpleHistoryAdmin):
    list_display = ("id", "area",)
