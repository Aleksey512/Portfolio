from django.contrib import admin
from django.urls import reverse
from django.utils.safestring import mark_safe

from Fare.models import *


@admin.register(FareData)
class FareDataAdmin(admin.ModelAdmin):
    list_display = ("type", "manage_org", "address",)
    list_filter = ("type", "manage_org",)
    search_fields = ("type", "address",)

    # def manage_org_link(self, obj):
    #     link = reverse("admin:tarif_manageorg_change", args=[obj.manage_org.id])
    #     return mark_safe('<a href="{}">{}</a>'.format(
    #         link,
    #         obj.manage_org.name
    #     ))
    #
    # manage_org_link.allow_tags = True
    # manage_org_link.short_description = 'Управляющая организация'
