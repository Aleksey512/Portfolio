from django.contrib import admin
from django.contrib.admin import AdminSite
from django.core.paginator import Paginator

from RsoDynamic.models import *

from simple_history.admin import SimpleHistoryAdmin


AdminSite.empty_value_display = "-Нет данных-"


@admin.register(DynamicSettings)
class DynamicSettingsHistoryAdmin(SimpleHistoryAdmin):
    list_display = ("pk", "pump_in_work", "date", "time",)
    list_filter = ("manage_org", "date")

@admin.register(Chlorine)
class ChlorineHsitoryAdmin(SimpleHistoryAdmin):
    list_display = ("pk", "date", "time", 'reagent_consumption')
    list_filter = ("manage_org", "date")

@admin.register(Smena)
class SmenaHistoryAdmin(SimpleHistoryAdmin):
    list_display = ("pk", "shift_number", "fullname", "date", "time", "flag_complete")
    list_filter = ("manage_org", "flag_complete", "date")