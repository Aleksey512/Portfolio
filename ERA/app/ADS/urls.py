from django.urls import path

from ADS.api.views import *


urlpatterns = [
    path('api/v1/ads/application', ApplicationAPIList.as_view()),
    path('api/v1/ads/application/<int:pk>/', ApplicationAPIUpdate.as_view()),
    path('api/v1/ads/applicationdelete/<int:pk>/', ApplicationAPIDestroy.as_view()),
]
