import React, {useContext, useEffect, useState} from 'react';
import {useForm} from 'react-hook-form';
import {API_URL} from '../config';
import AuthContext from '../context/AuthContext';
import JSONViewer from 'react-json-viewer';

const RSO = () => {
    useEffect(() => {
        //При обновлении страницы сразу выводятся эти поля
        // getOwnerId();
        // getWells();
        fetchOwner();
        // getReinforcment();
        // getWell();
        // getGeneralWellInformation();
        // getWellCoordinate();
        // getControlDevice();
    }, []);

    const {handleSubmit} = useForm({mode: 'onBlur'});

    let {authTokens, logoutUser} = useContext(AuthContext); //Подрубаем автоконтекст

    //Хуки для API cо скважиной
    //<
    let [owner, setOwner] = useState([]); //Владелец скважины
    let [ownerId, setOwnerId] = useState([]); //Владелец скважины по id
    let [wellCoordinate, setWellCoordinate] = useState([]); //Координаты скважины
    let [wellCoordinateId, setWellCoordinateId] = useState([]); //Координаты скважины по id
    //--
    let [wells, setWells] = useState([]); //Общая инфа о скважине
    let [wellId, setWellId] = useState([]); //Общая инфа о скважинах по id
    let [wellFromOwner, setWellFromOwner] = useState([]); //Общая инфа о скважинах по id
    //>
    let [controlDevice, setControlDevice] = useState([]); //Прибор контроля и учета
    let [controlDeviceId, setControlDeviceId] = useState([]); //Прибор контроля и учета c id
    //>>
    let [controlDeviceValue, setControlDeviceValue] = useState([]); //Показания приборов контроля и учета
    let [controlDeviceValueId, setControlDeviceValueId] = useState([]); //Показания приборов контроля и учета по id
    //>
    let [dynamicWellParametrs, setDynamicWellParametrs] = useState([]); //Динамические параметры
    let [dynamicWellParametrsId, setDynamicWellParametrsId] = useState([]); //Динамические параметры c id
    let [dynamicWellParametrsBtn, setDynamicWellParametrsBtn] = useState(false);
    let [reinforcment, setReinforcment] = useState([]); //Арматура
    let [reinforcmentId, setReinforcmentId] = useState([]); //Арматура по id
    let [reinforcmentBtn, setReinforcmentBtn] = useState(false);
    //>>
    let [reinforcmentRepair, setReinforcmentRepair] = useState([]); //Ремонт/замена арматуры на скважине
    let [reinforcmentRepairId, setReinforcmentRepairId] = useState([]); //Ремонт/замена арматуры на скважине по id
    let [reinforcmentRepairBtn, setReinforcmentRepairBtn] = useState(false);
    //>
    let [processPipe, setProcessPipe] = useState([]); //Труба тех обвязки
    let [processPipeId, setProcessPipeId] = useState([]); //Труба тех обвязки по id
    let [liftingPipe, setLiftingPipe] = useState([]); //Водоподъемная труба
    let [liftingPipeId, setLiftingPipeId] = useState([]); //Водоподъемная труба по id
    //>>
    let [liftingPipeRepair, setLiftingPipeRepair] = useState([]); //Ремонт/замена водоподъемной трубы на скважине
    let [liftingPipeRepairId, setLiftingPipeRepairId] = useState([]); //Ремонт/замена водоподъемной трубы на скважине по id
    //>
    let [pump, setPump] = useState([]); //Насос на скважине
    let [pumpId, setPumpId] = useState([]); //Насос на скважине по id
    //>>
    let [pumpRepair, setPumpRepair] = useState([]); //Ремонт/замена насосов на скважине
    let [pumpRepairId, setPumpRepairId] = useState([]); //Ремонт/замена насосов на скважине по id
    //>
    let [filter, setFilter] = useState([]); //Фильтр на скважине
    let [filterId, setFilterId] = useState([]); //Фильтр на скважине по id
    let [geoTechnicalSection, setGeoTechnicalSection] = useState([]); //ГеологоРазрез
    let [geoTechnicalSectionId, setGeoTechnicalSectionId] = useState([]); //ГеологоРазрез по id
    let [chemicalCompositiOnofWater, setChemicalCompositiOnofWater] = useState(
        []
    ); //Химический состав
    let [chemicalCompositiOnofWaterId, setChemicalCompositiOnofWaterId] =
        useState([]); //Химический состав
    let [debit, setDebit] = useState([]); //Дебит
    let [debitId, setDebitId] = useState([]); //Дебит по id
    let [generalWellInformation, setGeneralWellInformation] = useState([]); //Главная инфа о скважине
    let [generalWellInformationId, setGeneralWellInformationId] = useState([]); //Главная инфа о скважине
    let [generalWellInformationBtn, setGeneralWellInformationBtn] = useState(false);
    let [technicalWellInformation, setTechnicalWellInformation] = useState([]); //Техническая инфа о скважине по id
    let [technicalWellInformationId, setTechnicalWellInformationId] = useState(
        []
    ); //Техническая инфа о скважине по id
    let [technicalWellInformationBtn, setTechnicalWellInformationBtn] = useState(false);
    let [clearingWell, setClearingWell] = useState([]); //Чистка скважины
    let [clearingWellId, setClearingWellId] = useState([]); //Чистка скважины по id

    //Хуки для API c тем, к чему привязана скважина

    //Хуки для API с ВНС
    let [waterPumpingStation, setWaterpumpingstation] = useState([]); //Водопроводно-насосная станция(ВНС)
    let [waterPumpingStationId, setWaterpumpingstationId] = useState([]); //Водопроводно-насосная станция(ВНС) по id
    //>
    let [waterPumpingStationPump, setWaterPumpingStationPump] = useState([]); //Насосы на ВНС
    let [waterPumpingStationPumpId, setWaterPumpingStationPumpId] = useState([]); //Насосы на ВНС по id
    //>>
    let [waterPumpingStationPumpRepair, setWaterPumpingStationPumpRepair] =
        useState([]); //Ремонт/замена насосов на ВНС
    let [waterPumpingStationPumpRepairId, setWaterPumpingStationPumpRepairId] =
        useState([]); //Ремонт/замена насосов на ВНС по id
    let [waterPumpingStationPumpConventer, setWaterPumpingStationPumpConventer] =
        useState([]); //Частотные преобразователи на ВНС
    let [
        waterPumpingStationPumpConventerId,
        setWaterPumpingStationPumpConventerId,
    ] = useState([]); //Частотные преобразователи на ВНС по id
    //>>>
    let [
        waterPumpingStationConventerRepair,
        setWaterPumpingStationConventerRepair,
    ] = useState([]); //Ремонт частотного преобразователя на ВНС
    let [
        waterPumpingStationConventerRepairId,
        setWaterPumpingStationConventerRepairId,
    ] = useState([]); //Ремонт частотного чет там на ВНС id
    //>
    let [waterTank, setWaterTank] = useState([]); //Резервуар
    let [waterTankId, setWaterTankId] = useState([]); //Резервуар по id
    //>>
    let [waterTankRepair, setWaterTankRepair] = useState(''); //Ремонт/замена резервуара
    let [waterTankRepairId, setWaterTankRepairId] = useState(''); //Ремонт/замена резервуара по id
    //>
    let [prefabricateWaterPipeline, setPrefabricateWaterPipeline] = useState([]); //Сборный водовод
    let [prefabricateWaterPipelineId, setPrefabricateWaterPipelineId] = useState(
        []
    ); //Сборный водовод по id
    //>>
    let [sectionOfTheWaterPipeLine, setSectionOfTheWaterPipeLine] = useState([]); //Участок сборного водовода
    let [sectionOfTheWaterPipeLineId, setSectionOfTheWaterPipeLineId] = useState(
        []
    ); //Участок сборного водовода

    //Хуки для айдишников
    //Скважина
    let [ownerIdId, setOwnerIdId] = useState(''); //id владельца скважины
    let [wellCoordinateIdId, setWellCoordinateIdId] = useState(''); //id координат скважины
    //>
    let [wellIdId, setWellIdId] = useState(''); //id скважины
    //>>
    let [controlDeviceIdId, setControlDeviceIdId] = useState(''); //id прибора контроля и учета
    //>>>
    let [controlDeviceValueIdId, setControlDeviceValueIdId] = useState(''); //id контроля прибора контроля и учета
    //>>
    let [dynamicWellParametrsIdId, setDynamicWellParametrsIdId] = useState(''); //id для динамических параметров
    let [reinforcmentIdId, setReinforcmentIdId] = useState(''); //id для арматуры
    //>>>
    let [reinforcmentRepairIdId, setReinforcmentRepairIdId] = useState(''); //id для ремонта арматуры
    //>>
    let [processPipeIdId, setProcessPipeIdId] = useState(''); //id трубы тех обвязки
    let [liftingPipeIdId, liftingPipeIdid] = useState(''); //id водоподъемной трубы
    //>>>
    let [liftingPipeRepairIdId, setLiftingPipeRepairIdId] = useState(''); //id ремонта водоподъемной трубы
    //>>
    let [pumpIdId, setPumpIdId] = useState(''); //id насоса на скважине
    //>>>
    let [pumpRepairIdId, setPumpRepairIdId] = useState(''); //id ремонта насоса на скважине
    //>>
    let [filterIdId, setFilterIdID] = useState(''); //id фильтра на скважине
    let [geoTechnicalSectionIdId, setGeoTechnicalSectionIdId] = useState(''); //id геологоРазреза
    let [сhemicalCompositiOnofWaterIdId, setChemicalCompositiOnofWaterIdId] =
        useState(''); //id по хим составу
    let [debitIdId, setDebitIdId] = useState(''); //id по дебиту
    let [generalWellInformationIdId, setGeneralWellInformationIdId] =
        useState(''); //id по главной инфе о скважине
    let [technicalWellInformationIdId, setTechnicalWellInformationIdId] =
        useState(''); //id по технической инфе о скважине
    let [clearingWellIdId, setClearingWellIdId] = useState(''); //id по чистке скважины

    //ВНС
    let [waterPumpingStationIdId, setWaterPumpingStationIdId] = useState(''); //id на ВНС
    //>
    let [waterPumpingStationPumpIdId, setWaterPumpingStationPumpIdId] =
        useState(''); //id насосов на ВНС
    //>>
    let [
        waterPumpingStationPumpRepairIdId,
        setWaterPumpingStationPumpRepairIdId,
    ] = useState(''); //id по ремонту насосов на ВНС
    let [
        waterPumpingStationPumpConventerIdId,
        setWaterPumpingStationPumpConventerIdId,
    ] = useState(''); //id по частотному преобразователю на ВНС
    //>>>
    let [
        waterPumpingStationConventerRepairIdId,
        setWaterPumpingStationConventerRepairIdId,
    ] = useState(''); //id по ремонту частотного чет там ВНС
    //>
    let [waterTankIdId, setWaterTankIdId] = useState('');
    //>>
    let [waterTankRepairIdId, setWaterTankRepairIdId] = useState('');
    //>
    let [prefabricateWaterPipelineIdId, setPrefabricateWaterPipelineIdId] =
        useState(''); //id по сборному водоводу
    //>>
    let [sectionOfTheWaterPipeLineIdId, setSectionOfTheWaterPipeLineIdId] =
        useState(''); //id участка сборного водовода

    //А теперь выводим все это дело()()()()()()()()()()()()()()()()()()()()()()()()()()()

    let responseStatus = (APIFunc, response, data) => {
        //Проверка на авторизованность пользователя
        if (response.status === 200) {
            APIFunc(data);
        } else if (data['detail'] === 'Учетные данные не были предоставлены.') {
            logoutUser();
        } else {
            alert('Произошла непредвиденная ошибка');
        }
    };

    let responseStatusArr = (APIFunc, response, data, APIData, id) => {
        //Проверка на авторизованность пользователя
        if (response.status === 200) {
            APIFunc({...APIData, [id]: data});
        } else if (data['detail'] === 'Учетные данные не были предоставлены.') {
            logoutUser();
        } else {
            alert('Произошла непредвиденная ошибка');
        }
    };

    //API c прибором контроля и учета
    let getControlDevice = async () => {
        let response = await fetch(API_URL + '/RSO/well/' + wellIdId, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + String(authTokens.access),
            },
        });

        let data = await response.json();

        responseStatus(setControlDevice, response, data);
    };


    // ТУТ НАЧИНАЕТСЯ ДАНЁК

    //const [ownerWellData, setOwnerWellData] = useState([]);
    //const [wellLinkData, setWellLinkData] = useState([]);

    const fetchOwner = async () => {
        let response = await fetch(API_URL + '/RSO/owner/1/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + String(authTokens.access),
            },
        });

        let data = await response.json();

        if (response.status === 200) {
            setWellFromOwner(data)
        } else {
            alert("Что-то пошло не так")
        }
    }

    const fetchOnLink = async (e, setter) => {
        let response = await fetch(e.target.name, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + String(authTokens.access),
            },
        });

        let data = await response.json();

        if (response.status === 200) {
            setter(data)
        } else {
            alert("Что-то пошло не так")
        }

        if (e.target.name.includes("api/RSO/well")) {
            let response1 = await fetch(API_URL + "/RSO/wellcoordinate/" + data["coordinates"], {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + String(authTokens.access),
                },
            });

            let data1 = await response1.json();

            if (response.status === 200) {
                setWellCoordinateId(data1)
            }

            let response2 = await fetch(API_URL + "/RSO/sectionofthewaterpipeline/" + data["section_water_pipeline"], {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + String(authTokens.access),
                },
            });

            let data2 = await response2.json();

            if (response.status === 200) {
                setSectionOfTheWaterPipeLineId(data2)
            }
        }
    }

    const hideAllWellTables = () => {
        setGeneralWellInformationBtn(false);
        setDynamicWellParametrsBtn(false);
        setTechnicalWellInformationBtn(false);
        setReinforcmentBtn(false);
        setReinforcmentRepairBtn(false);
    }

    return (
        <>
            {/*<Layout title='ЭРА ЖКХ | РСО' content='RSO page' />*/}
            <div className='rsoadmin__page'>
                <div className='container'>
                    <div className='rsoadmin__content'>
                        <h1 className='rsoadmin__content-top__title'>
                            Добро пожаловать в панель управления РСО
                        </h1>
                        <h4 className='rsoadmin__content-top__descr'>
                            Ниже представлены все скважины, которыми владеет организация:
                        </h4>


                        {wellFromOwner.length !== 0 ? (
                            <>
                                <div className="rsoadmin__wells-wrapper">
                                    {wellFromOwner["wells"].map((item, index) => {
                                        return (
                                            <input
                                                className='rsoadmin__ownerwells-input__wells'
                                                type="button"
                                                value={"Скважина " + index}
                                                name={item}
                                                onClick={e => (fetchOnLink(e, setWells), hideAllWellTables())}/>
                                        )
                                    })}
                                </div>
                            </>
                        ) : (
                            <>не робит</>
                        )}


                        {/* Скважины */}
                        {wells.length !== 0 ? (
                            <>
                                <table className="base-table rsoadmin__table">
                                    <tbody>
                                    <tr>
                                        <td>ID скважины в бд:</td>
                                        <td>{wells.id}</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            Координаты
                                        </td>
                                        <td>
                                            {wellCoordinateId["coordinate_northern_latitude"]} с.ш. <br/> {wellCoordinateId["coordinates_eastern_longitude"]} в.д.
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            Участок сборного водовода
                                        </td>
                                        <td>
                                            Протяженность: {sectionOfTheWaterPipeLineId["length"]} <br/>
                                            Номер участка: {sectionOfTheWaterPipeLineId["plot_number"]} <br/>
                                            Диаметр данного участка <br/>трубопровода,
                                            мм: {sectionOfTheWaterPipeLineId["section_diametr"]}<br/>
                                            ID сборного водовода: {sectionOfTheWaterPipeLineId["water_pipeline"]}<br/>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            Динамические параметры
                                        </td>
                                        <td>
                                            {wells["dynamic_well_parametrs"] != null ? (
                                                <input
                                                    className='rsoadmin__table-input'
                                                    type="button"
                                                    value="Подробнее"
                                                    name={wells["dynamic_well_parametrs"]}
                                                    onClick={e => (fetchOnLink(e, setDynamicWellParametrsId), setDynamicWellParametrsBtn(true))}/>
                                            ) : (
                                                "Здесь пока пусто"
                                            )}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            Главные параметры скважины
                                        </td>
                                        <td>
                                            {wells["general_well_information"] != null ? (
                                                <input
                                                    className='rsoadmin__table-input'
                                                    type="button"
                                                    value="Подробнее"
                                                    name={wells["general_well_information"]}
                                                    onClick={e => (fetchOnLink(e, setGeneralWellInformationId), setGeneralWellInformationBtn(true))}/>
                                            ) : (
                                                "Пока здесь пусто"
                                            )}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            Техническая информация о скважине
                                        </td>
                                        <td>
                                            {wells["technical_well_information"] != null ? (
                                                <input
                                                    className='rsoadmin__table-input'
                                                    type="button"
                                                    value="Подробнее"
                                                    name={wells["technical_well_information"]}
                                                    onClick={e => (fetchOnLink(e, setTechnicalWellInformationId), setTechnicalWellInformationBtn(true))}/>
                                            ) : (
                                                "Здесь пока пусто"
                                            )}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            Арматура
                                        </td>
                                        <td>
                                            {wells["reinforcments"].length !== 0 ? (
                                                <>
                                                    {wells["reinforcments"].map((item, index) => {
                                                        return (
                                                            <input
                                                                className='rsoadmin__table-input'
                                                                type="button"
                                                                value={"Арматура " + index}
                                                                name={item}
                                                                onClick={e => (fetchOnLink(e, setReinforcmentId), setReinforcmentBtn(true))}/>
                                                        )
                                                    })}
                                                </>
                                            ) : (
                                                "Здесь пока пусто"
                                            )}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            Труба тех обвязки
                                        </td>
                                        <td>
                                            {wells["process_pipes"].length !== 0 ? (
                                                <>
                                                    {wells["process_pipes"].map((item, index) => {
                                                        return (
                                                            <input
                                                                className='rsoadmin__table-input'
                                                                type="button"
                                                                value={"Труба технологической обвязки " + index}
                                                                name={item}
                                                                onClick={e => fetchOnLink(e, setProcessPipeId)}/>
                                                        )
                                                    })}
                                                </>
                                            ) : (
                                                "Здесь пока пусто"
                                            )}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            Контролирующие девайсы
                                        </td>
                                        <td>
                                            {wells["control_devices"].length !== 0 ? (
                                                <>
                                                    {wells["control_device"].map((item, index) => {
                                                        return (
                                                            <input
                                                                className="rsoadmin__table-input"
                                                                type="button"
                                                                value={"Контролирующий девайс " + index}
                                                                name={item}
                                                                onClick={e => fetchOnLink(e, setControlDeviceId)}/>
                                                        )
                                                    })}
                                                </>
                                            ) : (
                                                "Здесь пока пусто"
                                            )}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            Трубы
                                        </td>
                                        <td>
                                            {wells["lifting_pipes"].length !== 0 ? (
                                                <>
                                                    {wells["lifting_pipes"].map((item, index) => {
                                                        return (
                                                            <input
                                                                className="rsoadmin__table-input"
                                                                type="button"
                                                                name={item}
                                                                value={"Труба " + index}
                                                                onClick={e => fetchOnLink(e, setLiftingPipeId)}
                                                            />
                                                        )
                                                    })}
                                                </>
                                            ) : (
                                                "Здесь пока пусто"
                                            )}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            Насосы
                                        </td>
                                        <td>
                                            {wells["pumps"].length !== 0 ? (
                                                <>
                                                    {wells["pumps"].map((item, index) => {
                                                        return (
                                                            <input
                                                                className="rsoadmin__table-input"
                                                                type="button"
                                                                name={item}
                                                                value={"Помпа № " + index}
                                                                onClick={e => fetchOnLink(e, setPumpId)}
                                                            />
                                                        )
                                                    })}
                                                </>
                                            ) : (
                                                "Здесь пока пусто"
                                            )}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            Фильтры
                                        </td>
                                        <td>
                                            {wells["filters"].length !== 0 ? (
                                                <>
                                                    {wells["filters"].map((item, index) => {
                                                        return (
                                                            <input
                                                                className="rsoadmin__table-input"
                                                                type="button"
                                                                name={item}
                                                                value={"Фильтр " + index}
                                                                onClick={e => fetchOnLink(e, setFilterId)}
                                                            />
                                                        )
                                                    })}
                                                </>
                                            ) : (
                                                "Здесь пока пусто"
                                            )}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            Дебит
                                        </td>
                                        <td>
                                            {wells["debits"].length !== 0 ? (
                                                <>
                                                    {wells["debits"].map((item, index) => {
                                                        return (
                                                            <input
                                                                className="rsoadmin__table-input"
                                                                type="button"
                                                                name={item}
                                                                value={"Дебит № " + index}
                                                                onClick={e => fetchOnLink(e, setDebitId)}
                                                            />
                                                        )
                                                    })}
                                                </>
                                            ) : (
                                                "Здесь пока пусто"
                                            )}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            Гео-техническая секция
                                        </td>
                                        <td>
                                            {wells["geo_technical_sections"].length !== 0 ? (
                                                <>
                                                    {wells["geo_technical_sections"].map((item, index) => {
                                                        return (
                                                            <input
                                                                className="rsoadmin__table-input"
                                                                type="button"
                                                                value={"Гео-техническая секция №" + index}
                                                                name={item}
                                                                onClick={e => fetchOnLink(e, setGeoTechnicalSectionId)}/>
                                                        )
                                                    })}
                                                </>
                                            ) : (
                                                "Здесь пока пусто"
                                            )}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            Химический состав воды
                                        </td>
                                        <td>
                                            {wells["chemical_compositions_of_water"].length !== 0 ? (
                                                <>
                                                    {wells["chemical_compositions_of_water"].map((item, index) => {
                                                        return (
                                                            <input
                                                                className="rsoadmin__table-input"
                                                                type="button"
                                                                value={"Химия, у меня по ней 5 была " + index}
                                                                name={item}
                                                                onClick={e => fetchOnLink(e, setChemicalCompositiOnofWaterId)}/>
                                                        )
                                                    })}
                                                </>
                                            ) : (
                                                "Здесь пока пусто"
                                            )}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            Хлорирование
                                        </td>
                                        <td>
                                            {wells["clearing_wells"].length !== 0 ? (
                                                <>
                                                    {wells["clearing_wells"].map((item, index) => {
                                                        return (
                                                            <input
                                                                className="rsoadmin__table-input"
                                                                type="button"
                                                                value={"Хлорирование " + index}
                                                                name={item}
                                                                onClick={e => fetchOnLink(e, setClearingWellId)}/>
                                                        )
                                                    })}
                                                </>
                                            ) : (
                                                "Здесь пока пусто"
                                            )}
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                            </>
                        ) : (
                            <>Ждем пока кто-то кликнет на скважину</>
                        )}


                        {/* Динамические параметры */}
                        {dynamicWellParametrsBtn ? (
                            <>
                                {dynamicWellParametrsId.length !== 0 ? (
                                    <table className="base-table rsoadmin__table">
                                        <tr>
                                            <td>
                                                ID скважины
                                            </td>
                                            <td>
                                                {dynamicWellParametrsId["well_id"] !== null ? (
                                                    <>
                                                        {dynamicWellParametrsId.well_id}
                                                    </>
                                                ) : (
                                                    "Здесь пока пусто"
                                                )}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                Статический уровень скважины, м
                                            </td>
                                            <td>
                                                {dynamicWellParametrsId["static_well_level"] !== null ? (
                                                    <>
                                                        {dynamicWellParametrsId.static_well_level}
                                                    </>
                                                ) : (
                                                    "Здесь пока пусто"
                                                )}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                Динамический уровень скважины, м
                                            </td>
                                            <td>
                                                {dynamicWellParametrsId["dynamic_well_level"] !== null ? (
                                                    <>
                                                        {dynamicWellParametrsId.dynamic_well_level}
                                                    </>
                                                ) : (
                                                    "Здесь пока пусто"
                                                )}
                                            </td>
                                        </tr>
                                    </table>
                                ) : (
                                    ""
                                )}
                            </>
                        ) : (
                            ""
                        )}


                        {/* Главаня ифна */}
                        {generalWellInformationBtn ? (
                            <>
                                {generalWellInformationId.length !== 0 ? (
                                    <table className="base-table rsoadmin__table">
                                        <tr>
                                            <td>
                                                ID скважины
                                            </td>
                                            <td>
                                                {generalWellInformationId["well_id"] !== null ? (
                                                    <>
                                                        {generalWellInformationId.well_id}
                                                    </>
                                                ) : (
                                                    "Здесь пока пусто"
                                                )}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                Тип собственности
                                            </td>
                                            <td>
                                                {generalWellInformationId["type_of_property"] !== null ? (
                                                    <>
                                                        {generalWellInformationId.type_of_property}
                                                    </>
                                                ) : (
                                                    "Здесь пока пусто"
                                                )}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                Субъект
                                            </td>
                                            <td>
                                                {generalWellInformationId["area"] !== null ? (
                                                    <>
                                                        {generalWellInformationId.area}
                                                    </>
                                                ) : (
                                                    "Здесь пока пусто"
                                                )}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                Район
                                            </td>
                                            <td>
                                                {generalWellInformationId["district"] !== null ? (
                                                    <>
                                                        {generalWellInformationId.district}
                                                    </>
                                                ) : (
                                                    "Здесь пока пусто"
                                                )}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                Город
                                            </td>
                                            <td>
                                                {generalWellInformationId["city"] !== null ? (
                                                    <>
                                                        {generalWellInformationId.city}
                                                    </>
                                                ) : (
                                                    "Здесь пока пусто"
                                                )}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                Населенный пункт
                                            </td>
                                            <td>
                                                {generalWellInformationId["location"] !== null ? (
                                                    <>
                                                        {generalWellInformationId.location}
                                                    </>
                                                ) : (
                                                    "Здесь пока пусто"
                                                )}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                Улица
                                            </td>
                                            <td>
                                                {generalWellInformationId["street"] !== null ? (
                                                    <>
                                                        {generalWellInformationId.street}
                                                    </>
                                                ) : (
                                                    "Здесь пока пусто"
                                                )}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                Дом
                                            </td>
                                            <td>
                                                {generalWellInformationId["house"] !== null ? (
                                                    <>
                                                        {generalWellInformationId.house}
                                                    </>
                                                ) : (
                                                    "Здесь пока пусто"
                                                )}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                Номер скважины
                                            </td>
                                            <td>
                                                {generalWellInformationId["number_well"] !== null ? (
                                                    <>
                                                        {generalWellInformationId.number_well}
                                                    </>
                                                ) : (
                                                    "Здесь пока пусто"
                                                )}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                Абсолбтная отметка устья
                                            </td>
                                            <td>
                                                {generalWellInformationId["absolute_mark_of_the_wellhead"] !== null ? (
                                                    <>
                                                        {generalWellInformationId.absolute_mark_of_the_wellhead}
                                                    </>
                                                ) : (
                                                    "Здесь пока пусто"
                                                )}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                Глубина
                                            </td>
                                            <td>
                                                {generalWellInformationId["deep"] !== null ? (
                                                    <>
                                                        {generalWellInformationId.deep}
                                                    </>
                                                ) : (
                                                    "Здесь пока пусто"
                                                )}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                Количество слоев
                                            </td>
                                            <td>
                                                {generalWellInformationId["numbers_of_layers"] !== null ? (
                                                    <>
                                                        {generalWellInformationId.numbers_of_layers}
                                                    </>
                                                ) : (
                                                    "Здесь пока пусто"
                                                )}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                Назначение
                                            </td>
                                            <td>
                                                {generalWellInformationId["purpose_well"] !== null ? (
                                                    <>
                                                        {generalWellInformationId.purpose_well}
                                                    </>
                                                ) : (
                                                    "Здесь пока пусто"
                                                )}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                Информация о пользовании
                                            </td>
                                            <td>
                                                {generalWellInformationId["usage_information"] !== null ? (
                                                    <>
                                                        {generalWellInformationId.usage_information}
                                                    </>
                                                ) : (
                                                    "Здесь пока пусто"
                                                )}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                Лицензия на право пользования
                                            </td>
                                            <td>
                                                {generalWellInformationId["usage_license"] !== null ? (
                                                    <>
                                                        {generalWellInformationId.usage_license}
                                                    </>
                                                ) : (
                                                    "Здесь пока пусто"
                                                )}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                Фото объекта
                                            </td>
                                            <td>
                                                {generalWellInformationId["photo_objcect"] !== null ? (
                                                    <>
                                                        {generalWellInformationId.photo_objcect}
                                                    </>
                                                ) : (
                                                    "Здесь пока пусто"
                                                )}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                Схема объекта
                                            </td>
                                            <td>
                                                {generalWellInformationId["scheme_object"] !== null ? (
                                                    <>
                                                        {generalWellInformationId.scheme_object}
                                                    </>
                                                ) : (
                                                    "Здесь пока пусто"
                                                )}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                Речной бассейн
                                            </td>
                                            <td>
                                                {generalWellInformationId["river_basin"] !== null ? (
                                                    <>
                                                        {generalWellInformationId.river_basin}
                                                    </>
                                                ) : (
                                                    "Здесь пока пусто"
                                                )}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                Водохозяйственный участок
                                            </td>
                                            <td>
                                                {generalWellInformationId["water_managment_region"] !== null ? (
                                                    <>
                                                        {generalWellInformationId.water_managment_region}
                                                    </>
                                                ) : (
                                                    "Здесь пока пусто"
                                                )}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                Бассейн подземных вод
                                            </td>
                                            <td>
                                                {generalWellInformationId["underground_water_pool"] !== null ? (
                                                    <>
                                                        {generalWellInformationId.underground_water_pool}
                                                    </>
                                                ) : (
                                                    "Здесь пока пусто"
                                                )}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                Месторождение подземных вод
                                            </td>
                                            <td>
                                                {generalWellInformationId["underground_water_deposit"] !== null ? (
                                                    <>
                                                        {generalWellInformationId.underground_water_deposit}
                                                    </>
                                                ) : (
                                                    "Здесь пока пусто"
                                                )}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                Водоностный горизонт
                                            </td>
                                            <td>
                                                {generalWellInformationId["water_bearing_horizon"] !== null ? (
                                                    <>
                                                        {generalWellInformationId.water_bearing_horizon}
                                                    </>
                                                ) : (
                                                    "Здесь пока пусто"
                                                )}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                Положение в рельефе
                                            </td>
                                            <td>
                                                {generalWellInformationId["position_in_relief"] !== null ? (
                                                    <>
                                                        {generalWellInformationId.position_in_relief}
                                                    </>
                                                ) : (
                                                    "Здесь пока пусто"
                                                )}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                Водопользователь
                                            </td>
                                            <td>
                                                {generalWellInformationId["water_user"] !== null ? (
                                                    <>
                                                        {generalWellInformationId.water_user}
                                                    </>
                                                ) : (
                                                    "Здесь пока пусто"
                                                )}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                Организация, проводившая бурение
                                            </td>
                                            <td>
                                                {generalWellInformationId["drilling_organization"] !== null ? (
                                                    <>
                                                        {generalWellInformationId.drilling_organization}
                                                    </>
                                                ) : (
                                                    "Здесь пока пусто"
                                                )}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                Дата проведения бурения
                                            </td>
                                            <td>
                                                {generalWellInformationId["drilling_start_date"] !== null ? (
                                                    <>
                                                        {generalWellInformationId.drilling_start_date}
                                                    </>
                                                ) : (
                                                    "Здесь пока пусто"
                                                )}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                Дата окончания бурения
                                            </td>
                                            <td>
                                                {generalWellInformationId["drilling_end_date"] !== null ? (
                                                    <>
                                                        {generalWellInformationId.drilling_end_date}
                                                    </>
                                                ) : (
                                                    "Здесь пока пусто"
                                                )}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                Тип павильона
                                            </td>
                                            <td>
                                                {generalWellInformationId["type_of_pavilion"] !== null ? (
                                                    <>
                                                        {generalWellInformationId.type_of_pavilion}
                                                    </>
                                                ) : (
                                                    "Здесь пока пусто"
                                                )}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                Конструкция павильона
                                            </td>
                                            <td>
                                                {generalWellInformationId["construction_of_pavilion"] !== null ? (
                                                    <>
                                                        {generalWellInformationId.construction_of_pavilion}
                                                    </>
                                                ) : (
                                                    "Здесь пока пусто"
                                                )}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                Инвентарный номер павильона
                                            </td>
                                            <td>
                                                {generalWellInformationId["inv_number_of_pavilion"] !== null ? (
                                                    <>
                                                        {generalWellInformationId.inv_number_of_pavilion}
                                                    </>
                                                ) : (
                                                    "Здесь пока пусто"
                                                )}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                Дата подписания приемо-сдаточного акта
                                            </td>
                                            <td>
                                                {generalWellInformationId["date_of_signing_the_acceptance_certificate"] !== null ? (
                                                    <>
                                                        {generalWellInformationId.date_of_signing_the_acceptance_certificate}
                                                    </>
                                                ) : (
                                                    "Здесь пока пусто"
                                                )}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                Дата запуска скважины в эксплуатацию
                                            </td>
                                            <td>
                                                {generalWellInformationId["well_commissioning_date"] !== null ? (
                                                    <>
                                                        {generalWellInformationId.well_commissioning_date}
                                                    </>
                                                ) : (
                                                    "Здесь пока пусто"
                                                )}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                Дата тампонирования
                                            </td>
                                            <td>
                                                {generalWellInformationId["well_plugging_date"] !== null ? (
                                                    <>
                                                        {generalWellInformationId.well_plugging_date}
                                                    </>
                                                ) : (
                                                    "Здесь пока пусто"
                                                )}
                                            </td>
                                        </tr>
                                    </table>
                                ) : (
                                    ""
                                )}
                            </>
                        ) : (
                            ""
                        )}

                        {/* Техническая инфа */}
                        {technicalWellInformationBtn ? (
                            <>
                                {technicalWellInformationId.length !== 0 ? (
                                    <table className="base-table rsoadmin__table">
                                        <tr>
                                            <td>
                                                ID скважины
                                            </td>
                                            <td>
                                                {technicalWellInformationId["well_id"] !== null ? (
                                                    <>
                                                        {technicalWellInformationId.well_id}
                                                    </>
                                                ) : (
                                                    "Здесь пока пусто"
                                                )}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                Диаметр обсадной трубы
                                            </td>
                                            <td>
                                                {technicalWellInformationId["diametr_casing_pipe"] !== null ? (
                                                    <>
                                                        {technicalWellInformationId.diametr_casing_pipe}
                                                    </>
                                                ) : (
                                                    "Здесь пока пусто"
                                                )}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                Количество арматуры
                                            </td>
                                            <td>
                                                {technicalWellInformationId["amount_of_reinforcment"] !== null ? (
                                                    <>
                                                        {technicalWellInformationId.amount_of_reinforcment}
                                                    </>
                                                ) : (
                                                    "Здесь пока пусто"
                                                )}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                Количество приборов контроля и учета
                                            </td>
                                            <td>
                                                {technicalWellInformationId["amount_of_control_device"] !== null ? (
                                                    <>
                                                        {technicalWellInformationId.amount_of_control_device}
                                                    </>
                                                ) : (
                                                    "Здесь пока пусто"
                                                )}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                Количество фильтров
                                            </td>
                                            <td>
                                                {technicalWellInformationId["amount_of_filter"] !== null ? (
                                                    <>
                                                        {technicalWellInformationId.amount_of_filter}
                                                    </>
                                                ) : (
                                                    "Здесь пока пусто"
                                                )}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                Количество насосов
                                            </td>
                                            <td>
                                                {technicalWellInformationId["amount_of_pump"] !== null ? (
                                                    <>
                                                        {technicalWellInformationId.amount_of_pump}
                                                    </>
                                                ) : (
                                                    "Здесь пока пусто"
                                                )}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                Количество водоподъемных труб
                                            </td>
                                            <td>
                                                {technicalWellInformationId["amount_of_lifting_pipe"] !== null ? (
                                                    <>
                                                        {technicalWellInformationId.amount_of_lifting_pipe}
                                                    </>
                                                ) : (
                                                    "Здесь пока пусто"
                                                )}
                                            </td>
                                        </tr>
                                    </table>
                                ) : (
                                    ""
                                )}
                            </>
                        ) : (
                            ""
                        )}


                        {/* Арматуры */}
                        {reinforcmentBtn ? (
                            <>
                                {reinforcmentId.length !== 0 ? (
                                    <table className="base-table rsoadmin__table">
                                        <tr>
                                            <td>
                                                ID арматуры
                                            </td>
                                            <td>
                                                {reinforcmentId["id"] !== null ? (
                                                    <>
                                                        {reinforcmentId.id}
                                                    </>
                                                ) : (
                                                    "Здесь пока пусто"
                                                )}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                Ремонт арматуры
                                            </td>
                                            <td>
                                                {reinforcmentId["reinforcment_repair"] !== null ? (
                                                    <>
                                                        <input
                                                            className='rsoadmin__table-input__reinforcment-repair'
                                                            type="button"
                                                            value="Подробнее"
                                                            name={reinforcmentId["reinforcment_repair"]}
                                                            onClick={e => (fetchOnLink(e, setReinforcmentRepairId), setReinforcmentRepairBtn(true))}/>
                                                    </>
                                                ) : (
                                                    "Здесь пока пусто"
                                                )}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                Наименование арматуры
                                            </td>
                                            <td>
                                                {reinforcmentId["reinforcment_name"] !== null ? (
                                                    <>
                                                        {reinforcmentId.reinforcment_name}
                                                    </>
                                                ) : (
                                                    "Здесь пока пусто"
                                                )}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                Тип арматуры
                                            </td>
                                            <td>
                                                {reinforcmentId["reinforcment_type"] !== null ? (
                                                    <>
                                                        {reinforcmentId.reinforcment_type}
                                                    </>
                                                ) : (
                                                    "Здесь пока пусто"
                                                )}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                Условный диаметр
                                            </td>
                                            <td>
                                                {reinforcmentId["nominal_diametr"] !== null ? (
                                                    <>
                                                        {reinforcmentId.nominal_diametr}
                                                    </>
                                                ) : (
                                                    "Здесь пока пусто"
                                                )}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                Масса единицы, кг.
                                            </td>
                                            <td>
                                                {reinforcmentId["weight"] !== null ? (
                                                    <>
                                                        {reinforcmentId.weight}
                                                    </>
                                                ) : (
                                                    "Здесь пока пусто"
                                                )}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                Вид привода
                                            </td>
                                            <td>
                                                {reinforcmentId["driver_type"] !== null ? (
                                                    <>
                                                        {reinforcmentId.driver_type}
                                                    </>
                                                ) : (
                                                    "Здесь пока пусто"
                                                )}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                Год изготовления
                                            </td>
                                            <td>
                                                {reinforcmentId["year_of_manufacture"] !== null ? (
                                                    <>
                                                        {reinforcmentId.year_of_manufacture}
                                                    </>
                                                ) : (
                                                    "Здесь пока пусто"
                                                )}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                ID скважины
                                            </td>
                                            <td>
                                                {reinforcmentId["well_id"] !== null ? (
                                                    <>
                                                        {reinforcmentId.well_id}
                                                    </>
                                                ) : (
                                                    "Здесь пока пусто"
                                                )}
                                            </td>
                                        </tr>
                                    </table>
                                ) : (
                                    ""
                                )}
                            </>
                        ) : (
                            ""
                        )}


                        {/* Ремонт арматуры > */}

                        {reinforcmentRepairBtn ? (
                            <>
                                {reinforcmentRepairId !== 0 ? (
                                    <table className="base-table rsoadmin__table">
                                        <tr>
                                            <td>
                                                ID починки
                                            </td>
                                            <td>
                                                {reinforcmentRepairId["id"] != null ? (
                                                    <>
                                                        {reinforcmentRepairId.id}
                                                    </>
                                                ) : (
                                                    "Здесь пока пусто"
                                                )}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                Дата последнего ремонта
                                            </td>
                                            <td>
                                                {reinforcmentRepairId["date_of_last_repair"] != null ? (
                                                    <>
                                                        {reinforcmentRepairId.date_of_last_repair}
                                                    </>
                                                ) : (
                                                    "Здесь пока пусто"
                                                )}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                Вид последнего ремонта
                                            </td>
                                            <td>
                                                {reinforcmentRepairId["type_of_last_repair"] != null ? (
                                                    <>
                                                        {reinforcmentRepairId.type_of_last_repair}
                                                    </>
                                                ) : (
                                                    "Здесь пока пусто"
                                                )}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                Дата последнего технического обслуживания
                                            </td>
                                            <td>
                                                {reinforcmentRepairId["date_of_last_maintenance"] != null ? (
                                                    <>
                                                        {reinforcmentRepairId.date_of_last_maintenance}
                                                    </>
                                                ) : (
                                                    "Здесь пока пусто"
                                                )}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                Вид последнего технического обслуживания
                                            </td>
                                            <td>
                                                {reinforcmentRepairId["type_of_last_maintenance"] != null ? (
                                                    <>
                                                        {reinforcmentRepairId.type_of_last_maintenance}
                                                    </>
                                                ) : (
                                                    "Здесь пока пусто"
                                                )}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                Дата технического осмотра
                                            </td>
                                            <td>
                                                {reinforcmentRepairId["date_of_technical_inspection"] != null ? (
                                                    <>
                                                        {reinforcmentRepairId.date_of_technical_inspection}
                                                    </>
                                                ) : (
                                                    "Здесь пока пусто"
                                                )}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                Арматура
                                            </td>
                                            <td>
                                                {reinforcmentRepairId["reinforcment"] != null ? (
                                                    <>
                                                        {reinforcmentRepairId.reinforcment}
                                                    </>
                                                ) : (
                                                    "Здесь пока пусто"
                                                )}
                                            </td>
                                        </tr>
                                    </table>
                                ) : (
                                    ""
                                )}
                            </>
                        ) : (
                            ""
                        )}


                        <JSONViewer json={liftingPipeId}/>
                        <JSONViewer json={pumpId}/>
                        <JSONViewer json={geoTechnicalSectionId}/>
                        <JSONViewer json={clearingWellId}/>
                    </div>
                </div>
            </div>
            {/* <h4>Арматуры</h4>
      <JSONViewer
        json={reinforcment}
      />
      <form onSubmit={handleSubmit(getWellId)}>
        <input type="text"
          className="wellInput"
          name="well"
          placeholder='Введите id скважины'
          onChange={(e) => setWellIdId(e.target.value)}
        />
        <button type="submit"></button>
      </form>
      <h4>Скважина по id</h4>
      <JSONViewer
        json={wellId}
      />
      <h4>Общая инфа о скважине с ссылками на техническую, главную и т.д.</h4>
      <JSONViewer
        json={well}
      />
      <h4>Главная инфа о скважине</h4>
      <JSONViewer 
        json={generalWellInformation}
      />      
      <h4>Координаты скважины</h4>
      <JSONViewer
        json={wellCoordinate}
      />       */}
        </>
    );
};

export default RSO;
