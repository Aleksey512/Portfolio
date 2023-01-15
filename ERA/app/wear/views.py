from rest_framework.decorators import api_view
from rest_framework.response import Response

from core.models import Profile
from wear.moduls.wearCalculation import *


@api_view(['POST'])
def type_selector(request):
    try:
        profile_info = Profile.objects.get(user=request.user.id)
    except:
        return Response({"detail": "Войдите заново в систему"})
    if profile_info.wear_access:
        floorNumber = int(request.data["floorNumber"])
        cellarSwitch = bool(int(request.data["cellarSwitch"])) if "cellarSwitch" in request.data else False
        outHouseSwitch = bool(int(request.data["outHouseSwitch"])) if "outHouseSwitch" in request.data else False
        mansardSwitch = bool(int(request.data["mansardSwitch"])) if "mansardSwitch" in request.data else False
        sewerSwitch = bool(int(request.data["sewerSwitch"])) if "sewerSwitch" in request.data else False
        garbageSwitch = bool(int(request.data["garbageSwitch"])) if "garbageSwitch" in request.data else False
        heatingSwitch = bool(int(request.data["heatingSwitch"])) if "heatingSwitch" in request.data else False
        cwsSwitch = bool(int(request.data["cwsSwitch"])) if "cwsSwitch" in request.data else False
        hwsSwitch = bool(int(request.data["hwsSwitch"])) if "hwsSwitch" in request.data else False
        electroSwitch = bool(int(request.data["electroSwitch"])) if "electroSwitch" in request.data else False
        maxVolume = int(request.data["MaxVolume"])
        foundationSelect = int(request.data["foundationSelect"])
        wallsSelect = int(request.data["wallsSelect"])
        slabsSelect = int(request.data["slabsSelect"])
        balconySelect = int(request.data["balconySelect"])
        roofSelect = int(request.data["roofSelect"])
        roofingSelect = int(request.data["roofingSelect"])
        outIdArray = TypeSelector(
            floorNumber, cellarSwitch, outHouseSwitch, mansardSwitch, maxVolume, foundationSelect, wallsSelect,
            slabsSelect,
            balconySelect, roofSelect, roofingSelect, sewerSwitch, garbageSwitch, heatingSwitch, cwsSwitch, hwsSwitch,
            electroSwitch
        )

        outNameArray = NameSelector(outIdArray)

        outDict = dict(zip(outIdArray, outNameArray))

        return Response({"data": outDict})
    else:
        return Response({"detail": "Нет доступа"})


@api_view(['POST'])
def form_data(request):
    try:
        profile_info = Profile.objects.get(user=request.user.id)
    except:
        return Response({"detail": "Войдите заново в систему"})
    if profile_info.wear_access:
        houseId = int(request.data["finalSelect"])

        return Response({
            "foundation_names": FoundationNames(houseId),
            "walls_names": WallsNames(houseId),
            "slabs_names": SlabsNames(houseId),
            "balcony_names": BalconyNames(houseId),
            "roof_names": RoofNames(houseId),
            "roofing_names": RoofingNames(houseId)
        })
    else:
        return Response({"detail": "Нет доступа"})


@api_view(['POST'])
def wear_calculation(request):
    try:
        profile_info = Profile.objects.get(user=request.user.id)
    except:
        return Response({"detail": "Войдите заново в систему"})
    if profile_info.wear_access:
        return Response({"data": WearCalculation(request)})
    else:
        return Response({"detail": "Нет доступа"})


@api_view(['POST'])
def form_data_engin_syst(request):
    try:
        profile_info = Profile.objects.get(user=request.user.id)
    except:
        return Response({"detail": "Войдите заново в систему"})
    if profile_info.wear_access:
        houseId = int(request.data["finalSelect"])
        return Response(EnginSystNames(houseId))
    else:
        return Response({"detail": "Нет доступа"})


@api_view(['POST'])
def final_calc(request):
    try:
        profile_info = Profile.objects.get(user=request.user.id)
    except:
        return Response({"detail": "Войдите заново в систему"})
    if profile_info.wear_access:
        houseId = int(request.data["finalSelect"])
        foundType = request.data["foundType"]
        foundation = float(request.data["foundation_wear"]) if "foundation_wear" in request.data else 0
        walls = float(request.data["walls_wear"]) if "walls_wear" in request.data else 0
        slabs = float(request.data["slabs_wear"]) if "slabs_wear" in request.data else 0
        balcony = float(request.data["balcony_wear"]) if "balcony_wear" in request.data else 0
        roof = float(request.data["roof_wear"]) if "roof_wear" in request.data else 0
        roofing = float(request.data["roofing_wear"]) if "roofing_wear" in request.data else 0
        hws = float(request.data["hws_wear"]) if "hws_wear" in request.data else 0
        heating = float(request.data["heating_wear"]) if "heating_wear" in request.data else 0
        cws = float(request.data["cws_wear"]) if "cws_wear" in request.data else 0
        sewer = float(request.data["sewer_wear"]) if "sewer_wear" in request.data else 0
        garbage = float(request.data["garbage_wear"]) if "garbage_wear" in request.data else 0
        electr = float(request.data["electr"]) if "electr" in request.data else 0
        volume = int(request.data["volume"])
        lift = bool(int(request.data["liftSwitch"]))
        mansard = request.data["mansardType"]

        return Response({"finalValue": FinalCalculation(
            id=houseId, foundation=foundation, walls=walls, slabs=slabs, balcony=balcony, roof=roof, roofing=roofing,
            hws=hws, heating=heating, cws=cws, sewer=sewer, garbage=garbage, electr=electr, volume=volume, lift=lift,
            mansard=mansard, foundType=foundType
        )})
    else:
        return Response({"detail": "Нет доступа"})
