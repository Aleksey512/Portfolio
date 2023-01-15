import copy

from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from Fare.moduls.tarif_calc import tarif_calc
from Fare.moduls.tarif_obr import tarif_obr
from core.models import Profile


@api_view(['POST'])
@permission_classes([AllowAny])
@authentication_classes([])
def orel_calc(request):
    square__mkd = float(request.data["square__mkd"])
    square__resid = float(request.data["square__resid"])
    square__nonresid = float(request.data["square__nonresid"])
    number__offloor = int(request.data["number__offloor"])
    year__ofcommissioning = int(request.data["year__ofcommissioning"])
    type__ofwall = float(request.data["type__ofwall"])

    cold__watersupply = request.data["cold__watersupply"] if "cold__watersupply" in request.data else False
    central__heating = request.data["central__heating"] if "central__heating" in request.data else False
    drainage = request.data["drainage"] if "drainage" in request.data else False
    hot__watersupply = request.data["hot__watersupply"] if "hot__watersupply" in request.data else False
    gas__supply = request.data["gas__supply"] if "gas__supply" in request.data else False
    elevators = request.data["elevators"] if "elevators" in request.data else False
    garbage__chute = request.data["garbage__chute"] if "garbage__chute" in request.data else False
    local__boilerhouse = request.data["local__boilerhouse"] if "local__boilerhouse" in request.data else False
    domestic__boiler = request.data["domestic__boiler"] if "domestic__boiler" in request.data else False
    playground = request.data["playground"] if "playground" in request.data else False
    hot__water_pumps = request.data["hot__waterPumps"] if "hot__waterPumps" in request.data else False
    fire__alarm = request.data["fire__alarm"] if "fire__alarm" in request.data else False
    water__supply_metering__system = request.data[
        "water__supplyMetering__system"] if "water__supplyMetering__system" in request.data else False
    automatic__control_system = request.data[
        "automatic__controlSystem"] if "automatic__controlSystem" in request.data else False
    staircase__cleaning = request.data["staircase__cleaning"] if "staircase__cleaning" in request.data else False

    _, board_size, arr = tarif_calc(
        squareAll=square__mkd, square=square__resid + square__nonresid, floorSet=number__offloor,
        time=year__ofcommissioning, type=type__ofwall, coldWater=cold__watersupply, heat=central__heating,
        waterDisposal=drainage, hotWater=hot__watersupply, gasSupply=gas__supply, lift=elevators,
        garbageChute=garbage__chute, localBoiler=local__boilerhouse, boiler=domestic__boiler, playground=playground,
        recirculationPumps=hot__water_pumps, fire=fire__alarm, systemNode=water__supply_metering__system,
        nodes=automatic__control_system, cleaningStaircases=staircase__cleaning
    )

    arr1 = copy.deepcopy(arr[:5])
    arr1 += [{
        "category": '...',
        "value": '...',
        "v1": '...',
        "v2": '...',
        "v3": '...'
    }]
    arr1 += copy.deepcopy([arr[-1]])

    return Response({"board_size": 0, "data": arr1})


@api_view(['POST'])
@permission_classes([AllowAny])
@authentication_classes([])
def orel_detail(request):
    board__size = float(request.data["board__size"])
    square__mkd = float(request.data["square__mkd"])
    square__resid = float(request.data["square__resid"])
    square__nonresid = float(request.data["square__nonresid"])
    number__offloor = int(request.data["number__offloor"])
    year__ofcommissioning = int(request.data["year__ofcommissioning"])
    type__ofwall = float(request.data["type__ofwall"])

    cold__watersupply = request.data["cold__watersupply"] if "cold__watersupply" in request.data else False
    central__heating = request.data["central__heating"] if "central__heating" in request.data else False
    drainage = request.data["drainage"] if "drainage" in request.data else False
    hot__watersupply = request.data["hot__watersupply"] if "hot__watersupply" in request.data else False
    gas__supply = request.data["gas__supply"] if "gas__supply" in request.data else False
    elevators = request.data["elevators"] if "elevators" in request.data else False
    garbage__chute = request.data["garbage__chute"] if "garbage__chute" in request.data else False
    local__boilerhouse = request.data["local__boilerhouse"] if "local__boilerhouse" in request.data else False
    domestic__boiler = request.data["domestic__boiler"] if "domestic__boiler" in request.data else False
    playground = request.data["playground"] if "playground" in request.data else False
    hot__water_pumps = request.data["hot__waterPumps"] if "hot__waterPumps" in request.data else False
    fire__alarm = request.data["fire__alarm"] if "fire__alarm" in request.data else False
    water__supply_metering__system = request.data[
        "water__supplyMetering__system"] if "water__supplyMetering__system" in request.data else False
    automatic__control_system = request.data[
        "automatic__controlSystem"] if "automatic__controlSystem" in request.data else False
    staircase__cleaning = request.data["staircase__cleaning"] if "staircase__cleaning" in request.data else False

    arr, _, _ = tarif_calc(
        squareAll=square__mkd, square=square__resid + square__nonresid, floorSet=number__offloor,
        time=year__ofcommissioning, type=type__ofwall, coldWater=cold__watersupply, heat=central__heating,
        waterDisposal=drainage, hotWater=hot__watersupply, gasSupply=gas__supply, lift=elevators,
        garbageChute=garbage__chute, localBoiler=local__boilerhouse, boiler=domestic__boiler, playground=playground,
        recirculationPumps=hot__water_pumps, fire=fire__alarm, systemNode=water__supply_metering__system,
        nodes=automatic__control_system, cleaningStaircases=staircase__cleaning, tarifGen=board__size
    )

    arr1 = copy.deepcopy(arr[:7])
    arr1 += [{
        "category": '...',
        "value": '...',
        "v1": '...',
        "v2": '...',
        "v3": '...'
    }]
    arr1 += copy.deepcopy(arr[-1])

    return Response({"board_size": 0, "data": arr1})


@api_view(['POST'])
@permission_classes([AllowAny])
@authentication_classes([])
def russia_calc(request):
    year = int(request.data["year__ofcommissioning"])
    number__floor = int(request.data["number__floor"])
    number__basement = int(request.data["number__basement"])
    number__entrance = int(request.data["number__entrance"])
    number__flat = int(request.data["number__flat"])
    number__people = int(request.data["number__people"])
    square__building = float(request.data["square__building"])
    square__resid_nonresid = float(request.data["square__resid-nonresid"])
    square__attic = float(request.data["square__attic"])
    square__basement = float(request.data["square__basement"])
    number__landing = float(request.data["number__landing"])
    number__garbagevalves = int(request.data["number__garbagevalves"])
    number__elevator = int(request.data["number__elevator"])
    square__elevatorcabin = float(request.data["square__elevatorcabin"])
    type__ofwall = int(request.data["type__ofwall"])
    type__offoundation = int(request.data["type__offoundation"])
    type__ofoverlap = int(request.data["type__ofoverlap"])
    rate__ofreturn = float(request.data["rate__ofreturn"])
    maintenance__ofoneelevator = float(request.data["maintenance__ofoneelevator"])
    mrot = float(request.data["mrot"])
    central__heating = request.data["central__heating"] if "central__heating" in request.data else False
    heating__gbs_and__aogvl = request.data[
        "heating__gbs-and__aogv"] if "heating__gbs-and__aogv" in request.data else False
    hot__watersupply = request.data["hot__watersupply"] if "hot__watersupply" in request.data else False
    cold__watersupply = request.data["cold__watersupply"] if "cold__watersupply" in request.data else False
    drainage = request.data["drainage"] if "drainage" in request.data else False
    gas__supply = request.data["gas__supply"] if "gas__supply" in request.data else False
    sweeping__stairs = request.data["sweeping__stairs"] if "sweeping__stairs" in request.data else False
    sweeping__landings_with__moisture = request.data[
        "sweeping__landings-with__moisture"] if "sweeping__landings-with__moisture" in request.data else False
    washing__stairs = request.data["washing__stairs"] if "washing__stairs" in request.data else False
    wet__sweeping_places__nexttothe_garbage = request.data[
        "wet__sweeping-places__nexttothe-garbage"] if "wet__sweeping-places__nexttothe-garbage" in request.data else False
    window__washing = request.data["window__washing"] if "window__washing" in request.data else False
    other__sanitationwork = request.data[
        "other__sanitationwork"] if "other__sanitationwork" in request.data else False
    sweeping__elevators_with__moisture = request.data[
        "sweeping__elevators-with__moisture"] if "sweeping__elevators-with__moisture" in request.data else False
    cleaning__attic = request.data["cleaning__attic"] if "cleaning__attic" in request.data else False
    basement__cleaning = request.data["basement__cleaning"] if "basement__cleaning" in request.data else False
    maintenance__and_repair__elevators = request.data[
        "maintenance__and-repair__elevators"] if "maintenance__and-repair__elevators" in request.data else False
    waste__chute_maintenance__works = request.data[
        "waste__chute-maintenance__works"] if "waste__chute-maintenance__works" in request.data else False
    heating__system_maintenance__work = request.data[
        "heating__system-maintenance__work"] if "heating__system-maintenance__work" in request.data else False
    gas__network_maintenance__work = request.data[
        "gas__network-maintenance__work"] if "gas__network-maintenance__work" in request.data else False
    repair__networks_engineering__equipment = request.data[
        "repair__networks-engineering__equipment"] if "repair__networks-engineering__equipment" in request.data else False
    repair__structural_elements__buildings = request.data[
        "repair__structural-elements__buildings"] if "repair__structural-elements__buildings" in request.data else False
    emergency__dispatch_service = request.data[
        "emergency__dispatch-service"] if "emergency__dispatch-service" in request.data else False
    maintenance = request.data["maintenance"] if "maintenance" in request.data else False
    maintenance__other_common__property = request.data[
        "maintenance__other-common__property"] if "maintenance__other-common__property" in request.data else False
    works__maintenance_adjacent__territory = request.data[
        "works__maintenance-adjacent__territory"] if "works__maintenance-adjacent__territory" in request.data else False

    boardSize, arr = tarif_obr(
        year=year, floor_all=number__floor, floor_underground=number__basement, entrances=number__entrance,
        apartments=number__flat, residents=number__people, area_all=square__building,
        area_resident=square__resid_nonresid, area_attic=square__attic, area_basement=square__basement,
        area_land_mar=number__landing, n_gar_chute=number__garbagevalves, elevators=number__elevator,
        area_elevator=square__elevatorcabin, type_exterior_wall=type__ofwall, type_found=type__offoundation,
        type_overlap=type__ofoverlap, heating=central__heating, aogv=heating__gbs_and__aogvl,
        supply_hot=hot__watersupply, supply_cold=cold__watersupply, drainage=drainage, supply_gas=gas__supply,
        cleaning_landings_marches=sweeping__stairs, sweeping_landings_marches=sweeping__landings_with__moisture,
        washing_landings_marches=washing__stairs, sweeping_chambers_garbage=wet__sweeping_places__nexttothe_garbage,
        window_washing=window__washing, other_entrances_staircases=other__sanitationwork,
        sweeping_elevator_cabins=sweeping__elevators_with__moisture, cleaning_attic=cleaning__attic,
        basement_cleaning=basement__cleaning, maintenance_repair_elevators=maintenance__and_repair__elevators,
        waste_chute_maintenance=waste__chute_maintenance__works,
        works_maintenance_service_heat=heating__system_maintenance__work,
        gas_network_maintenance_works=gas__network_maintenance__work,
        maintenance_repair_intrahouse_networks_equipment=repair__networks_engineering__equipment,
        maintenance_repair_structural_elements_buildings=repair__structural_elements__buildings,
        emergency_dispatch_service=emergency__dispatch_service, current_repair=maintenance,
        maintenance_other_common_property=maintenance__other_common__property,
        works_maintenance_local_area=works__maintenance_adjacent__territory, rate_ret=rate__ofreturn,
        base_lift=maintenance__ofoneelevator, mrot=mrot
    )

    arr = arr[:5]
    arr += ["...", "...", "...", "...", "..."]

    return Response({"board_size": boardSize, "data": arr})
