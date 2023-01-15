from django.apps import AppConfig



class CoreConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "RSO"
    verbose_name = "База данных Ресурсоснабжающих организаций"

    def ready(self):
        #   Импортируем файл с сигналами
        from .moduls import signals

