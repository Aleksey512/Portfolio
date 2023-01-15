from django.contrib import admin
from django.urls import reverse
from django.utils.safestring import mark_safe

from ADS.models import *


@admin.register(Application)
class DistrictAdmin(admin.ModelAdmin):
    list_display = ("city", "street", "house", "entrance", "apartment", "applicant", "application_status", "works_services",)
    list_filter = ("city", "street", "house", "entrance", "apartment", "applicant", "application_status", "works_services",)
    search_fields = ("city", "street", "house", "entrance", "apartment", "applicant", "application_status", "works_services",)
