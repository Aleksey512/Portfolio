from django.apps import AppConfig


class CoreConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "Fare"
    verbose_name = "Расчёт-детализация платы за управление МКД"
