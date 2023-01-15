from django.contrib import admin
from core.models import Profile

admin.site.site_header = "ЭРА ЖКХ"
admin.site.site_title = "Панель администрирования"
admin.site.index_title = "Добро пожаловать!"

admin.site.register(Profile)
