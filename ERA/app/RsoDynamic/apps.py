from django.apps import AppConfig


class RsodynamicConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "RsoDynamic"

    def ready(self):
        #   Импортируем файл с сигналами
        from .moduls import signals

