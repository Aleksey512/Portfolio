from django.urls import path
from core import views
from rest_framework_simplejwt.views import TokenRefreshView

app_name = "core"

urlpatterns = [
    path('', views.index, name="React UI"),
    path('login/', views.index, name="React UI"),
    path('dashboard/', views.index, name="React UI"),
    path('services/fare/', views.index, name="React UI"),

    path('api/user/profile', views.getProfile, name="Профиль пользователя"),

    path('api/user/token/', views.MyTokenObtainPairView.as_view(), name='Выдача токена'),
    path('api/user/token/refresh/', TokenRefreshView.as_view(), name='Обновление токена'),

    path('api/user/register/', views.mail_era, name='Отправка заявки на почту'),

    path('api/file/contract_offer/', views.get_contract_offer, name='Загрузка договора оферты'),
]
