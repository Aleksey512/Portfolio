from django.urls import path

from wear import views

urlpatterns = [
    path("api/wear/type_selector", views.type_selector, name="Определение типа дома"),
    path("api/wear/form_data", views.form_data, name="Поулчение данных для формы"),
    path("api/wear/form_data/engine", views.form_data_engin_syst, name="Макс, пошел нахуй"),
    path("api/wear/wear_calculation", views.wear_calculation, name="Расчет износа, хули"),
    path("api/wear/final_calc", views.final_calc, name="финалОЧКА"),
]
