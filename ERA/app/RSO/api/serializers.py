from rest_framework import serializers
from RSO.models import *


class WellSerializer(serializers.ModelSerializer):
    dynamic_well_parametrs = serializers.HyperlinkedRelatedField(
        view_name='dynamicwellparametrs-detail',
        read_only=True
    )
    general_well_information = serializers.HyperlinkedRelatedField(
        view_name='generalwellinformation-detail',
        read_only=True,
    )
    technical_well_information = serializers.HyperlinkedRelatedField(
        view_name='technicalwellinformation-detail',
        read_only=True,
    )
    reinforcments = serializers.HyperlinkedRelatedField(
        many=True,
        view_name='reinforcment-detail',
        read_only=True,
    )
    process_pipes = serializers.HyperlinkedRelatedField(
        many=True,
        view_name='processpipe-detail',
        read_only=True,
    )
    control_devices = serializers.HyperlinkedRelatedField(
        many=True,
        view_name='controldevice-detail',
        read_only=True,
    )
    lifting_pipes = serializers.HyperlinkedRelatedField(
        many=True,
        view_name='liftingpipe-detail',
        read_only=True,
    )
    pumps = serializers.HyperlinkedRelatedField(
        view_name='pump-detail',
        read_only=True,
    )
    filters = serializers.HyperlinkedRelatedField(
        many=True,
        view_name='filter-detail',
        read_only=True,
    )
    debits = serializers.HyperlinkedRelatedField(
        many=True,
        view_name='debit-detail',
        read_only=True,
    )
    geo_technical_sections = serializers.HyperlinkedRelatedField(
        many=True,
        view_name='geotechnicalsection-detail',
        read_only=True,
    )
    chemical_compositions_of_water = serializers.HyperlinkedRelatedField(
        many=True,
        view_name='chemicalcompositionofwater-detail',
        read_only=True,
    )
    clearing_wells = serializers.HyperlinkedRelatedField(
        many=True,
        view_name='clearingwell-detail',
        read_only=True,
    )
    status = serializers.ChoiceField(choices=("В ремонте", "В резерве", "В работе"))
    last_well_repair = serializers.HyperlinkedRelatedField(
        view_name='wellrepair-detail',
        read_only=True,
    )
    number_well = serializers.IntegerField(read_only=True, source="general_well_information.number_well")

    class Meta:
        model = Well
        fields = "__all__"


class WellRepairSerializers(serializers.ModelSerializer):
    number_well = serializers.IntegerField(read_only=True, source="well.general_well_information.number_well")

    class Meta:
        model = WellRepair
        fields = "__all__"


class DynamicWellParametrsSerializer(serializers.ModelSerializer):
    class Meta:
        model = DynamicWellParametrs
        fields = "__all__"


class GeneralWellInformationSerializer(serializers.ModelSerializer):
    class Meta:
        model = GeneralWellInformation
        fields = "__all__"


class TechnicalWellInformationSerializer(serializers.ModelSerializer):
    class Meta:
        model = TechnicalWellInformation
        fields = "__all__"


class ReinforcmentSerializer(serializers.ModelSerializer):
    last_reinforcment_repair = serializers.HyperlinkedRelatedField(
        view_name='reinforcmentrepair-detail',
        read_only=True,
    )

    class Meta:
        model = Reinforcment
        fields = "__all__"


class ReinforcmentRepairSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReinforcmentRepair
        fields = "__all__"


class ProcessPipeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProcessPipe
        fields = "__all__"


class ControlDeviceSerializer(serializers.ModelSerializer):
    values_of_control_device = serializers.HyperlinkedRelatedField(
        many=True,
        view_name='controldevicevalue-detail',
        read_only=True,
    )

    class Meta:
        model = ControlDevice
        fields = "__all__"


class ControlDeviceValueSerializer(serializers.ModelSerializer):
    class Meta:
        model = ControlDeviceValue
        fields = "__all__"


class LiftingPipeSerializer(serializers.ModelSerializer):
    last_lifting_pipe_repair = serializers.HyperlinkedRelatedField(
        view_name='liftingpiperepair-detail',
        read_only=True,
    )

    class Meta:
        model = LiftingPipe
        fields = "__all__"


class LiftingPipeRepairSerializer(serializers.ModelSerializer):
    class Meta:
        model = LiftingPipeRepair
        fields = '__all__'


class PumpSerializer(serializers.ModelSerializer):
    last_pump_repair = serializers.HyperlinkedRelatedField(
        view_name='pumprepair-detail',
        read_only=True,
    )

    class Meta:
        model = Pump
        fields = "__all__"


class PumpRepairSerializer(serializers.ModelSerializer):
    class Meta:
        model = PumpRepair
        fields = '__all__'


class FilterSerializer(serializers.ModelSerializer):
    last_filter_repair = serializers.HyperlinkedRelatedField(
        view_name="filterrepair-detail",
        read_only=True,
    )

    class Meta:
        model = Filter
        fields = "__all__"


class FilterRepairSerializer(serializers.ModelSerializer):
    class Meta:
        model = Filter
        fields = "__all__"


class DebitSerializer(serializers.ModelSerializer):
    class Meta:
        model = Debit
        fields = "__all__"


class GeoTechnicalSectionSerialzier(serializers.ModelSerializer):
    class Meta:
        model = GeoTechnicalSection
        fields = "__all__"


class ChemicalCompositionOfWaterSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChemicalCompositionOfWater
        fields = "__all__"


class ClearingWellSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClearingWell
        fields = "__all__"


class WaterPumpingStationSerializer(serializers.ModelSerializer):
    water_pumping_station_pump = serializers.HyperlinkedRelatedField(
        many=True,
        view_name='waterpumpingstationpump-detail',
        read_only=True,
    )
    prefabricate_water_pipeline = serializers.HyperlinkedRelatedField(
        many=True,
        view_name='prefabricatewaterpipeline-detail',
        read_only=True,
    )
    filtered_smena = serializers.HyperlinkedRelatedField(
        many=True,
        read_only=True,
        view_name='smena-detail',
    )

    class Meta:
        model = WaterPumpingStation
        fields = "__all__"


class WaterPumpingStationPumpSerializer(serializers.ModelSerializer):
    """Сериализатор для ВЗУ"""
    water_pumping_station_pump_conventer = serializers.HyperlinkedRelatedField(
        many=True,
        view_name='waterpumpingstationpumpconventer-detail',
        read_only=True,
    )
    last_water_pumping_station_pump_repair = serializers.HyperlinkedRelatedField(
        view_name='waterpumpingstationpumprepair-detail',
        read_only=True,
    )

    class Meta:
        model = WaterPumpingStationPump
        fields = "__all__"


class WaterPumpingStationPumpRepairSerializer(serializers.ModelSerializer):
    class Meta:
        model = WaterPumpingStationPumpRepair
        fields = "__all__"


class WaterPumpingStationPumpConventerSerializer(serializers.ModelSerializer):
    water_pumping_station_conventer_repair = serializers.HyperlinkedRelatedField(
        many=True,
        view_name='waterpumpingstationconventerrepair-detail',
        read_only=True,
    )

    class Meta:
        model = WaterPumpingStationPumpConventer
        fields = "__all__"


class WaterPumpingStationConventerRepairSerializer(serializers.ModelSerializer):
    class Meta:
        model = WaterPumpingStationConventerRepair
        fields = "__all__"


class WaterTowerSerializer(serializers.ModelSerializer):
    water_tower_repair_data = serializers.HyperlinkedRelatedField(
        many=True,
        view_name='watertowerrepairdata-detail',
        read_only=True,
    )
    water_tower_technical_information = serializers.HyperlinkedRelatedField(
        view_name='watertowertechnicalinformation-detail',
        read_only=True
    )

    class Meta:
        model = WaterTower
        fields = "__all__"


class WaterTowerRepairDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = WaterTowerRepairData
        fields = "__all__"


class WaterTowerTechnicalInformationSerializer(serializers.ModelSerializer):
    water_tank = serializers.HyperlinkedRelatedField(
        many=True,
        view_name='waterpumpingstation-detail',
        read_only=True,
    )

    class Meta:
        model = WaterTowerTechnicalInformation
        fields = "__all__"


class WaterTankSerializer(serializers.ModelSerializer):
    water_tank_repair = serializers.HyperlinkedRelatedField(
        many=True,
        view_name='watertankrepair-detail',
        read_only=True,
    )

    class Meta:
        model = WaterTank
        fields = "__all__"


class WaterTankRepairSerializer(serializers.ModelSerializer):
    class Meta:
        model = WaterTankRepair
        fields = "__all__"


class PrefabricateWaterPipelineSerializer(serializers.ModelSerializer):
    section_of_the_water_pipeline = serializers.HyperlinkedRelatedField(
        many=True,
        view_name='sectionofthewaterpipeline-detail',
        read_only=True,
    )

    class Meta:
        model = PrefabricateWaterPipeline
        fields = "__all__"


class SectionOfTheWaterPipelineSerializer(serializers.ModelSerializer):
    wells = serializers.HyperlinkedRelatedField(
        many=True,
        view_name='well-detail',
        read_only=True,
    )

    class Meta:
        model = SectionOfTheWaterPipeline
        fields = "__all__"
