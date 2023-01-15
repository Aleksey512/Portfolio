from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes

from .api.serializer import *

from RSO.models import WaterPumpingStation
from RSO.api.serializers import WaterPumpingStationSerializer


@api_view(["GET"])
def dynamic_settings_from_date(request, pk, date):
    """
    По запросу передает динамические параметры по указанной дате\n
    :param request: api/RsoDynamic/waterpumpingstation/<int:pk>/dispatcher/dynamicsettings/<str:date>\n
    :param pk: PrimaryKey на ВЗУ\n
    :param date: Дата в GET запросе (YYYY-mm-dd)\n
    :return: Response
    """
    try:
        water_pumping_station = WaterPumpingStation.objects.get(pk=pk).dynamic_settings_from_date(date=date)
        serializer_context = {
            'request': request
        }
    except WaterPumpingStation.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == "GET":
        serializer = DynamicSettingsSerializer(water_pumping_station, context=serializer_context, many=True)
        return Response(serializer.data)


@api_view(["GET"])
def chlorine_from_date(request, pk, date):
    """
    По запросу передает хлор по указанной дате\n
    :param request: api/RsoDynamic/waterpumpingstation/<int:pk>/dispatcher/chlorine/<str:date>\n
    :param pk: PrimaryKey на ВЗУ\n
    :param date: Дата в GET запросе (YYYY-mm-dd)\n
    :return: Response
    """
    try:
        water_pumping_station = WaterPumpingStation.objects.get(pk=pk).chlorine_from_date(date=date)
        serializer_context = {
            'request': request
        }
    except WaterPumpingStation.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == "GET":
        serializer = ChlorineSerializer(water_pumping_station, context=serializer_context, many=True)
        return Response(serializer.data)


@api_view(["GET"])
def operational_information_from_date(request, pk, date):
    """
    По запросу передает оперативную информацию по указанной дате\n
    :param request: api/RsoDynamic/waterpumpingstation/<int:pk>/dispatcher/operationalinformation/<str:date>\n
    :param pk: PrimaryKey на ВЗУ\n
    :param date: Дата в GET запросе (YYYY-mm-dd)\n
    :return: Response
    """
    try:
        water_pumping_station = WaterPumpingStation.objects.get(pk=pk).operational_information_from_date(date=date)
        serializer_context = {
            'request': request
        }
    except WaterPumpingStation.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == "GET":
        serializer = OperationalInformationSerializer(water_pumping_station, context=serializer_context, many=True)
        return Response(serializer.data)
