from django.urls import path
from Fare import views
from Fare.api import views as api

urlpatterns = [
    path("api/fare/orel/calculation", views.orel_calc, name="Расчет платы по Орлу"),
    path("api/fare/orel/calculation/excel", views.orel_calc_excel, name="Формирвоание Excel из расчета платы по Орлу"),
    path("api/fare/russia/calculation", views.russia_calc, name="Расчет платы по России"),
    path("api/fare/russia/calculation/excel", views.russia_calc_excel, name="Формирвоание Excel из расчета платы по России"),
    path("api/fare/orel/detail", views.orel_detail, name="Дитализация платы по Орлу"),
    path("api/fare/orel/detail/excel", views.orel_detail_excel, name="Формирвоание Excel из детализации платы по Орлу"),

    path('api/fare', api.FareDataAPIList.as_view()),
    path('api/fare/<int:pk>/', api.FareDataAPIUpdate.as_view()),
    path('api/faredelete/<int:pk>/', api.FareDataAPIDestroy.as_view()),
]
