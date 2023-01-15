from django.contrib import admin
from django.urls import path, include
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from django.conf import settings
from django.conf.urls.static import static

schema_view = get_schema_view(
    openapi.Info(
        title="ЭРА ЖКХ API",
        default_version='v1',
        description="Интеграция с сервисами для передачи данных из БД",
        terms_of_service="https://www.google.com/policies/terms/",
        contact=openapi.Contact(email="razerfuuu@mail.ru"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    path("admin/", admin.site.urls),

    path("", include("core.urls"), name="Авторизация"),
    path("", include("Fare.urls"), name="Расчёт/детализация платы"),
    path("", include("wear.urls"), name="Износ"),
    path("", include("RSO.urls"), name="База данных объектов ресурсоснабжаюющих организаци"),
    path("", include("test.urls"), name="Тестовое пространство"),
    path("", include("RsoDynamic.urls"), name="Динамические параметры РСО"),

    path('era_gkh_bot/', include("era_gkh_bot.urls"), name="Telegram bot"),

    path('celery/', include('thumbnailer.urls'), name="Celery"),

    path('swagger/api.json', schema_view.without_ui(cache_timeout=0), name='Swagger API в формате json'),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='Swagger API UI'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='Redoc API'),

    path('__debug__/', include('debug_toolbar.urls')),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
