from django.urls import path
from RsoDynamic.api.views import *
from RsoDynamic import views

from rest_framework import routers

router = routers.SimpleRouter()

router.register(r'api/RsoDynamic/smena', SmenaAPIViewSet, basename='smena')
router.register(r'api/RsoDynamic/dynamicsettings', DynamicSettingsAPIViewSet, basename='dynamicsettings')
router.register(r'api/RsoDynamic/chlorine', ChlorineAPIViewSet, basename='chlorine')
router.register(r'api/RsoDynamic/operationalinformation', OperationalInformationAPIViewSet,
                basename='operationalinformation')

urlpatterns = [
    # Получает динамические параметры по дате
    path('api/RsoDynamic/waterpumpingstation/<int:pk>/dispatcher/dynamicsettings/<str:date>',
         views.dynamic_settings_from_date),
    # Получает хлор по дате
    path('api/RsoDynamic/waterpumpingstation/<int:pk>/dispatcher/chlorine/<str:date>',
         views.chlorine_from_date),
    # Получает оперативную информацию по дате
    path('api/RsoDynamic/waterpumpingstation/<int:pk>/dispatcher/operationalinformation/<str:date>',
         views.operational_information_from_date),
]

urlpatterns += router.urls
