from rest_framework import routers
from RSO.api.views import *
from RSO import views

router = routers.SimpleRouter()

# Скважина
router.register(r'api/RSO/well', WellAPIViewSet, basename='well')
router.register(r'api/RSO/wellrepair', WellRepairAPIViewSet, basename='wellrepair')
router.register(r'api/RSO/dynamicwellparametrs', DynamicWellParametrsAPIViewSet, basename='dynamicwellparametrs')
router.register(r'api/RSO/generalwellinformation', GeneralWellInformationAPIViewSet, basename='generalwellinformation')
router.register(r'api/RSO/technicalwellinformation', TechnicalWellInformationAPIViewSet,
                basename='technicalwellinformation')
router.register(r'api/RSO/reinforcment', ReinforcmentAPIViewSet, basename='reinforcment')
router.register(r'api/RSO/reinforcmentrepair', ReinforcmentRepairAPIViewSet, basename='reinforcmentrepair')
router.register(r'api/RSO/processpipe', ProcessPipeAPIViewSet, basename='processpipe')
router.register(r'api/RSO/controldevice', ControlDeviceAPIViewSet, basename='controldevice')
router.register(r'api/RSO/controldevicevalue', ControlDeviceValueAPIViewSet, basename='controldevicevalue')
router.register(r'api/RSO/liftingpipe', LiftingPipeAPIViewSet, basename='liftingpipe')
router.register(r'api/RSO/liftingpiperepair', LiftingPipeRepairAPIViewSet, basename='liftingpiperepair')
router.register(r'api/RSO/pump', PumpAPIViewSet, basename='pump')
router.register(r'api/RSO/pumprepair', PumpRepairAPIViewSet, basename='pumprepair')
router.register(r'api/RSO/filter', FilterAPIViewSet, basename='filter')
router.register(r'api/RSO/filterrepair', FilterRepairAPIViewSet, basename='filterrepair')
router.register(r'api/RSO/debit', DebitAPIViewSet, basename='debit')
router.register(r'api/RSO/geotechnicalsection', GeoTechnicalSectionAPIViewSet, basename='geotechnicalsection')
router.register(r'api/RSO/chemicalcompositionofwater', ChemicalCompositionOfWaterAPIViewSet,
                basename='chemicalcompositionofwater')
router.register(r'api/RSO/clearingwell', ClearingWellAPIViewSet, basename='clearingwell')

# ВЗУ
router.register(r'api/RSO/waterpumpingstation', WaterPumpingStationAPIViewSet, basename='waterpumpingstation')
router.register(r'api/RSO/waterpumpingstationpump', WaterPumpingStationPumpAPIViewSet,
                basename='waterpumpingstationpump')
router.register(r'api/RSO/waterpumpingstationpumprepair', WaterPumpingStationPumpRepairAPIViewSet,
                basename='waterpumpingstationpumprepair')
router.register(r'api/RSO/waterpumpingstationpumpconventer', WaterPumpingStationPumpConventerAPIViewSet,
                basename='waterpumpingstationpumpconventer')
router.register(r'api/RSO/waterpumpingstationconventerrepair', WaterPumpingStationConventerRepairAPIViewSet,
                basename='waterpumpingstationconventerrepair')

# Водонапорная башня
router.register(r'api/RSO/watertower', WaterTowerAPIViewSet, basename='watertower')
router.register(r'api/RSO/watertowerrepairdata', WaterTowerRepairDataAPIViewSet, basename='watertowerrepairdata')
router.register(r'api/RSO/watertowertechnicalinformation', WaterTowerTechnicalInformationAPIViewSet,
                basename='watertowertechnicalinformation')

# Резервуар
router.register(r'api/RSO/watertank', WaterTankAPIViewSet, basename='watertank')
router.register(r'api/RSO/watertankrepair', WaterTankRepairAPIViewSet, basename='watertankrepair')

# Сборный водовод
router.register(r'api/RSO/prefabricatewaterpipeline', PrefabricateWaterPipelineAPIViewSet,
                basename='prefabricatewaterpipeline')
router.register(r'api/RSO/sectionofthewaterpipeline', SectionOfTheWaterPipelineAPIViewSet,
                basename='sectionofthewaterpipeline')

urlpatterns = []

urlpatterns += router.urls
