from rest_framework.permissions import IsAuthenticated
from rest_framework import mixins
from rest_framework import viewsets

from RSO.api.serializers import *
from core.permissions import IsAdminOrReadOnly


class BaseViewSet(mixins.ListModelMixin,
                  mixins.RetrieveModelMixin,
                  mixins.CreateModelMixin,
                  mixins.UpdateModelMixin,
                  mixins.DestroyModelMixin,
                  viewsets.GenericViewSet):
    """
    Basic view model
    """

    def get_permissions(self):
        """
        Instantiates and returns the list of permissions that this view requires.
        """
        if self.action == 'destroy':
            permission_classes = [IsAdminOrReadOnly]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]


class WellAPIViewSet(BaseViewSet):
    queryset = Well.objects.all()
    serializer_class = WellSerializer


class WellRepairAPIViewSet(BaseViewSet):
    queryset = WellRepair.objects.all()
    serializer_class = WellRepairSerializers


class DynamicWellParametrsAPIViewSet(BaseViewSet):
    queryset = DynamicWellParametrs.objects.all()
    serializer_class = DynamicWellParametrsSerializer


class GeneralWellInformationAPIViewSet(BaseViewSet):
    queryset = GeneralWellInformation.objects.all()
    serializer_class = GeneralWellInformationSerializer


class TechnicalWellInformationAPIViewSet(BaseViewSet):
    queryset = TechnicalWellInformation.objects.all()
    serializer_class = TechnicalWellInformationSerializer


class ReinforcmentAPIViewSet(BaseViewSet):
    queryset = Reinforcment.objects.all()
    serializer_class = ReinforcmentSerializer


class ReinforcmentRepairAPIViewSet(BaseViewSet):
    queryset = ReinforcmentRepair.objects.all()
    serializer_class = ReinforcmentRepairSerializer


class ProcessPipeAPIViewSet(BaseViewSet):
    queryset = ProcessPipe.objects.all()
    serializer_class = ProcessPipeSerializer


class ControlDeviceAPIViewSet(BaseViewSet):
    queryset = ControlDevice.objects.all()
    serializer_class = ControlDeviceSerializer


class ControlDeviceValueAPIViewSet(BaseViewSet):
    queryset = ControlDeviceValue.objects.all()
    serializer_class = ControlDeviceValueSerializer


class LiftingPipeAPIViewSet(BaseViewSet):
    queryset = LiftingPipe.objects.all()
    serializer_class = LiftingPipeSerializer


class LiftingPipeRepairAPIViewSet(BaseViewSet):
    queryset = LiftingPipeRepair.objects.all()
    serializer_class = LiftingPipeRepairSerializer


class PumpAPIViewSet(BaseViewSet):
    queryset = Pump.objects.all()
    serializer_class = PumpSerializer


class PumpRepairAPIViewSet(BaseViewSet):
    queryset = PumpRepair.objects.all()
    serializer_class = PumpRepairSerializer


class FilterAPIViewSet(BaseViewSet):
    queryset = Filter.objects.all()
    serializer_class = FilterSerializer


class FilterRepairAPIViewSet(BaseViewSet):
    queryset = FilterRepair.objects.all()
    serializer_class = FilterRepairSerializer


class DebitAPIViewSet(BaseViewSet):
    queryset = Debit.objects.all()
    serializer_class = DebitSerializer


class GeoTechnicalSectionAPIViewSet(BaseViewSet):
    queryset = GeoTechnicalSection.objects.all()
    serializer_class = GeoTechnicalSectionSerialzier


class ChemicalCompositionOfWaterAPIViewSet(BaseViewSet):
    queryset = ChemicalCompositionOfWater.objects.all()
    serializer_class = ChemicalCompositionOfWaterSerializer


class ClearingWellAPIViewSet(BaseViewSet):
    queryset = ClearingWell.objects.all()
    serializer_class = ClearingWellSerializer


class WaterPumpingStationAPIViewSet(BaseViewSet):
    queryset = WaterPumpingStation.objects.all()
    serializer_class = WaterPumpingStationSerializer


class WaterPumpingStationPumpAPIViewSet(BaseViewSet):
    queryset = WaterPumpingStationPump.objects.all()
    serializer_class = WaterPumpingStationPumpSerializer


class WaterPumpingStationPumpRepairAPIViewSet(BaseViewSet):
    queryset = WaterPumpingStationPumpRepair.objects.all()
    serializer_class = WaterPumpingStationPumpRepairSerializer


class WaterPumpingStationPumpConventerAPIViewSet(BaseViewSet):
    queryset = WaterPumpingStationPumpConventer.objects.all()
    serializer_class = WaterPumpingStationPumpConventerSerializer


class WaterPumpingStationConventerRepairAPIViewSet(BaseViewSet):
    queryset = WaterPumpingStationConventerRepair.objects.all()
    serializer_class = WaterPumpingStationConventerRepairSerializer


class WaterTowerAPIViewSet(BaseViewSet):
    queryset = WaterTower.objects.all()
    serializer_class = WaterTowerSerializer


class WaterTowerRepairDataAPIViewSet(BaseViewSet):
    queryset = WaterTowerRepairData.objects.all()
    serializer_class = WaterTowerRepairDataSerializer


class WaterTowerTechnicalInformationAPIViewSet(BaseViewSet):
    queryset = WaterTowerTechnicalInformation.objects.all()
    serializer_class = WaterTowerTechnicalInformationSerializer


class WaterTankAPIViewSet(BaseViewSet):
    queryset = WaterTank.objects.all()
    serializer_class = WaterTankSerializer


class WaterTankRepairAPIViewSet(BaseViewSet):
    queryset = WaterTankRepair.objects.all()
    serializer_class = WaterTankRepairSerializer


class PrefabricateWaterPipelineAPIViewSet(BaseViewSet):
    queryset = PrefabricateWaterPipeline.objects.all()
    serializer_class = PrefabricateWaterPipelineSerializer


class SectionOfTheWaterPipelineAPIViewSet(BaseViewSet):
    queryset = SectionOfTheWaterPipeline.objects.all()
    serializer_class = SectionOfTheWaterPipelineSerializer
