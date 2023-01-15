from django.contrib import admin

from .models import *


class ClientAdmin(admin.ModelAdmin):
    list_display = ("id", "phone_number", "mobile_operator_code", "tag", "timezone")


admin.site.register(Client, ClientAdmin)
