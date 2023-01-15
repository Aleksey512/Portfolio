from django.shortcuts import render, HttpResponse
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from Fare.moduls.tarif_calc import tarif_calc
from Fare.moduls.to_excel import to_excel_orel

from openpyxl.writer.excel import save_virtual_workbook

from core.models import Profile


def index(request):
    return render(request, 'index.html')


@api_view(['POST'])
def test_json(request):
    profile_info = Profile.objects.get(user=request.user.id)
    if profile_info.fare_access:
        square__mkd = float(request.data["square__mkd"])
        square__resid = float(request.data["square__resid"])
        square__nonresid = float(request.data["square__nonresid"])
        number__offloor = int(request.data["number__offloor"])
        year__ofcommissioning = int(request.data["year__ofcommissioning"])
        type__ofwall = float(request.data["type__ofwall"])
        cold__watersupply = request.data["cold__watersupply"]
        central__heating = request.data["central__heating"]
        drainage = request.data["drainage"]
        hot__watersupply = request.data["hot__watersupply"]
        gas__supply = request.data["gas__supply"]
        elevators = request.data["elevators"]
        garbage__chute = request.data["garbage__chute"]
        local__boilerhouse = request.data["local__boilerhouse"]
        domestic__boiler = request.data["domestic__boiler"]
        playground = request.data["playground"]
        hot__water_pumps = request.data["hot__waterPumps"]
        fire__alarm = request.data["fire__alarm"]
        water__supply_metering__system = request.data["water__supplyMetering__system"]
        automatic__control_system = request.data["automatic__controlSystem"]
        staircase__cleaning = request.data["staircase__cleaning"]

        _, board_size, arr = tarif_calc(
            squareAll=square__mkd, square=square__resid + square__nonresid, floorSet=number__offloor,
            time=year__ofcommissioning, type=type__ofwall, coldWater=cold__watersupply, heat=central__heating,
            waterDisposal=drainage, hotWater=hot__watersupply, gasSupply=gas__supply, lift=elevators,
            garbageChute=garbage__chute, localBoiler=local__boilerhouse, boiler=domestic__boiler, playground=playground,
            recirculationPumps=hot__water_pumps, fire=fire__alarm, systemNode=water__supply_metering__system,
            nodes=automatic__control_system, cleaningStaircases=staircase__cleaning
        )

        return Response({"board_size": board_size, "data": arr})
    else:
        return Response({"Доступ": "Запрещён"})


@api_view(['POST'])
@permission_classes([AllowAny])
@authentication_classes([])
def test_excel(request):
    # profile_info = Profile.objects.get(user=request.user.id)
    # # print(request.data)
    # if profile_info.fare_access:
    if True:
        address = request.data["address"]
        apartments = request.data["apartments"]
        square__mkd = float(request.data["square__mkd"])
        square__resid = float(request.data["square__resid"])
        square__nonresid = float(request.data["square__nonresid"])
        number__offloor = int(request.data["number__offloor"])
        year__ofcommissioning = int(request.data["year__ofcommissioning"])
        type__ofwall = float(request.data["type__ofwall"])
        cold__watersupply = request.data["cold__watersupply"]
        central__heating = request.data["central__heating"]
        drainage = request.data["drainage"]
        hot__watersupply = request.data["hot__watersupply"]
        gas__supply = request.data["gas__supply"]
        elevators = request.data["elevators"]
        garbage__chute = request.data["garbage__chute"]
        local__boilerhouse = request.data["local__boilerhouse"]
        domestic__boiler = request.data["domestic__boiler"]
        playground = request.data["playground"]
        hot__water_pumps = request.data["hot__waterPumps"]
        fire__alarm = request.data["fire__alarm"]
        water__supply_metering__system = request.data["water__supplyMetering__system"]
        automatic__control_system = request.data["automatic__controlSystem"]
        staircase__cleaning = request.data["staircase__cleaning"]
        text_footer = request.data["text_footer"] if ("text_footer" in request.data) else "Должность"
        name_footer = request.data["name_footer"] if ("name_footer" in request.data) else "ФИО"

        _, board_size, arr = tarif_calc(
            squareAll=square__mkd, square=square__resid + square__nonresid, floorSet=number__offloor,
            time=year__ofcommissioning, type=type__ofwall, coldWater=cold__watersupply, heat=central__heating,
            waterDisposal=drainage, hotWater=hot__watersupply, gasSupply=gas__supply, lift=elevators,
            garbageChute=garbage__chute, localBoiler=local__boilerhouse, boiler=domestic__boiler, playground=playground,
            recirculationPumps=hot__water_pumps, fire=fire__alarm, systemNode=water__supply_metering__system,
            nodes=automatic__control_system, cleaningStaircases=staircase__cleaning
        )
        wb = to_excel_orel(title="Расчёт", adress=address, number_floor=number__offloor, number_apartments=apartments,
                           all_area=square__mkd, resid_area=square__resid, nonresid_area=square__nonresid,
                           size_security=round(board_size * (square__resid + square__nonresid) * 0.05, 2),
                           fulfillment_obligations=25_695.78, dict_calc=arr,
                           all_year_pay=round(board_size * (square__resid + square__nonresid) * 12, 2),
                           board_size=round(board_size, 3), text_footer=text_footer, name_footer=name_footer)

        response = HttpResponse(content=save_virtual_workbook(wb), content_type='application/vnd.ms-excel')
        response['Content-Disposition'] = 'attachment; filename=calculation.xlsx'
        return response
    else:
        return Response({"Доступ": "Запрещён"})


def test_channels(request):
    return render(request, "webSocket/channels.html", {})


def test_room(request, room_name):
    return render(request, 'webSocket/room.html', {
        'room_name': room_name
    })
