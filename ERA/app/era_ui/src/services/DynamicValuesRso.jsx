import React, {useContext, useEffect, useState} from 'react';
import {API_URL} from '../config';
import Layout from '../components/Layout';
import AuthContext from '../context/AuthContext';
import {useForm} from 'react-hook-form';


const DynamicValuesRSO = () => {
  useEffect(() => {
    getProfile();
    fetchSmena();
    fetchOperInfo();
  }, []);

  let {authTokens, logoutUser} = useContext(AuthContext);
  // Получаем данные о профиле
  let [profile, setProfile] = useState('');


  let getProfile = async () => {
    let response = await fetch(API_URL + '/user/profile/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + String(authTokens.access),
      },
    });
    let data = await response.json();

    if (response.status === 200) {
      setProfile(data);
      setJobTitle(data[0].job_title);
    } else if (data["detail"] === "Учетные данные не были предоставлены.") {
      logoutUser();
    } else {
      alert("Ошибка авторицации, обновите страницу")
    }
  };

  let [jobTitle, setJobTitle] = useState('');
  let [chooseWPSBtn, setChooseWPSBtn] = useState(false);
  let [waterPumpingStationId, setWaterPumpingStationId] = useState();
  let [uploadWaterPumpingStation, setUploadWaterPumpingStation] = useState();
  let [chooseSmena, setChooseSmena] = useState(1);
  let [enterFullName, setEnterFullName] = useState('');
  let [waterPumpingStation, setWaterPumpingStation] = useState([]);
  let [failureId, setFailureId] = useState('wells');
  let [postFailureId, setPostFailureId] = useState('wells');
  let [postRepairWellId, setPostRepairWellId] = useState(-1);
  let [waterPumpingStationById, setWaterPumpingStationById] = useState([]);
  let [smens, setSmens] = useState([]);
  let [pumpsVZU, setPumpsVZU] = useState([]);
  let [prefabricateWaterPipeline, setPrefabricateWaterPipeline] = useState([]);
  let [sectionOfTheWaterPipeline, setSectionOfTheWaterPipeline] = useState([]);
  let [wells, setWells] = useState([]);
  let [pumps, setPumps] = useState([]);
  let [wellRepair, setWellRepair] = useState([]);
  let [waterPumpingStationPumpRepair, setWaterPumpingStationPumpRepair] = useState([]);
  let [generalWellInfo, setGeneralWellInfo] = useState([]);

  let [operInfoAll, setOperInfoAll] = useState(false);
  let [dynamicAll, setDynamicAll] = useState(false);
  let [chlorineAll, setChlorineAll] = useState(false);
  let [failureAll, setFailureAll] = useState(false);

  let [postDynamicValuesData, setPostDynamicValuesData] = useState({});

  let [postChlorineData, setPostChlorineData] = useState({});

  let [postRepairWellData, setPostRepairWellData] = useState({});
  let [postRepairPumpVZUData, setPostRepairPumpVZUData] = useState({});
  let [chooseTypeOfRepair, setChooseTypeOfRepair] = useState('По току');
  let [chooseTypeOfRepairPumpVZU, setChooseTypeOfRepairPumpVZU] = useState('Шум, стук');
  let [chooseTypeStatusWell, setChooseTypeStatusWell] = useState('В работе');
  let [chooseBrokenDevice, setChooseBrokenDevice] = useState('КИПиА');

  let [postWaterLevelInReseruar, setPostWaterLevelInReseruar] = useState({});

  let [dynamicValuesBtn, setDynamicValuesBtn] = useState(false);
  let [postDynamicValuesBtn, setPostDynamicValuesBtn] = useState(false);
  let [postChangeDynamicTypeBtn, setPostChangeDynamicTypeBtn] = useState(false);
  let [closeSmenaBtn, setCloseSmenaBtn] = useState(false);
  let [chlorineBtn, setChlorineBtn] = useState(false);
  let [postChlorineBtn, setPostChlorineBtn] = useState(false);
  let [failureBtn, setFailureBtn] = useState(false);
  let [postFailureBtn, setPostFailureBtn] = useState(false);


  let [operInfo, setOperInfo] = useState([]); //Вся оперативная инфа
  let [dynamicSettings, setDynamicSettings] = useState([]); //Все динамические параметры вывод
  let [chlorine, setChlorine] = useState([]); //Весь хлор вывод
  let [dispatcherDynamicSettings, setDispatcherDynamicSettings] = useState([]);
  let [dispatcherChlorine, setDispatcherChlorine] = useState([]);
  let [date, setDate] = useState('');
  let [dispatcher, setDispatcher] = ([]);


  const {handleSubmit} = useForm({mode: 'onBlur'});


  const postDynamicValuesSetData = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    if (e.target.type === "number") {
      value = parseFloat(value)
    }
    setPostDynamicValuesData({...postDynamicValuesData, [name]: value,});
  }

  const postChlorineSetData = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    if (e.target.type === "number") {
      value = parseFloat(value)
    }
    if (value !== 'on') {
      setPostChlorineData({...postChlorineData, [name]: value});

    } else {
      if (postChlorineData[name]) {
        setPostChlorineData({...postChlorineData, [name]: false});
      } else {
        setPostChlorineData({...postChlorineData, [name]: true});
      }
    }
  }

  const postRepairWellSetData = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    if (e.target.type === "number") {
      value = parseInt(value)
    }
    setPostRepairWellData({...postRepairWellData, [name]: value,});
  }

  const postRepairPumpVZUSetData = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    if (e.target.type === "number") {
      value = parseInt(value)
    }
    setPostRepairPumpVZUData({...postRepairPumpVZUData, [name]: value,});
  }

  const addPostWaterLevelinReseruarArray = (e) => {
    setPostWaterLevelInReseruar({...postWaterLevelInReseruar, [e.target.name]: parseFloat(e.target.value)});
  }

  //Получаем все ВЗУ
  const fetchWaterPumpingStation = async () => {
    let response = await fetch(API_URL + '/RSO/waterpumpingstation/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + String(authTokens.access),
      },
    });

    let data = await response.json();

    if (response.status === 200) {
      setWaterPumpingStation(data);
      if (smens.length !== 0) {
        setWaterPumpingStationById(smens[0].water_pumping_station)
      } else {
        setWaterPumpingStationId(data[0].id)
      }
    }
  }

  const fetchWaterPumpingStationById = async () => {
    let response = await fetch(API_URL + '/RSO/waterpumpingstation/' + waterPumpingStationId + '/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + String(authTokens.access),
      },
    });

    let data = await response.json();

    if (response.status === 200) {
      setWaterPumpingStationById(data);
      data.water_pumping_station_pump.map((item, index) => {
        fetchOnLink(item, setPumpsVZU, pumpsVZU, 'water_pumping_station_pump_repair');
      })
      data.prefabricate_water_pipeline.map((item, index) => {
        fetchOnLink(item, setPrefabricateWaterPipeline, prefabricateWaterPipeline, "section_of_the_water_pipeline");
      })


    } else {
    }
  }

  const fetchOnLink = async (item, setter, getter, key, key1, key2) => {
    let normArr = getter;
    let response = await fetch(item, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + String(authTokens.access),
      },
    });

    let data = await response.json();

    if (response.status === 200) {
      normArr.push(data);
      setter(normArr);
    } else {
    }
    if (key === "section_of_the_water_pipeline") {
      data.section_of_the_water_pipeline.map((item, index) => {
        fetchOnLink(item, setSectionOfTheWaterPipeline, sectionOfTheWaterPipeline, "wells");
      })
    } else if (key === "wells") {
      data.wells.map((item, index) => {
        fetchOnLink(item, setWells, wells, "last_well_repair", "general_well_information", "pumps");
      })
    } else if (key === "last_well_repair") {
      if (data.status === "В ремонте") {
        item = data.last_well_repair
        fetchOnLink(item, setWellRepair, wellRepair);
      }
    } else if (key === "water_pumping_station_pump_repair") {
      if (data.status === "В ремонте") {
        item = data.last_water_pumping_station_pump_repair
        fetchOnLink(item, setWaterPumpingStationPumpRepair, waterPumpingStationPumpRepair);
      }
    } else if (key === "pump_repair") {
      if (data.status === "В ремонте") {
        data.pump_repair.map((item, index) => {
          fetchOnLink(item, setWellRepair, wellRepair);
        })
      }
    }
    if (key1 === "general_well_information") {
      item = data.general_well_information
      fetchOnLink(item, setGeneralWellInfo, generalWellInfo);
    }
    if (key2 === "pumps") {
      item = data.pumps
      fetchOnLink(item, setPumps, pumps, "pump_repair");
    }

  }

  const fetchSmena = async () => {
    let response = await fetch(API_URL + '/RsoDynamic/smena/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + String(authTokens.access),
      },
    });

    let data = await response.json();

    if (data.length !== 0) {
      if (response.status === 200) {
        setSmens(data);
        setWaterPumpingStationId(data[0].water_pumping_station);
        fetchDynamicValues()
        fetchChlorine()
      } else {
      }
    } else {
      fetchWaterPumpingStation();
    }
  }

  const fetchPostSmena = async () => {
    let response = await fetch(API_URL + '/RsoDynamic/smena/', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + String(authTokens.access),
      },
      body: JSON.stringify({
        shift_number: chooseSmena,
        fullname: enterFullName,
        water_pumping_station: waterPumpingStationId
      }),
    });

    let data = await response.json();
    if (response.status === 201) {
      alert('Смена успешно создана')
      setSmens(data);
      fetchDynamicValues();
      fetchChlorine();
    } else {
      alert('Невозможно создать смену');
    }
  }

  const fetchPostDispatcherDynamicSettings = async () => {
    let response = await fetch(API_URL + '/RsoDynamic/waterpumpingstation/' + waterPumpingStationId + '/dispatcher/dynamicsettings/' + date, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + String(authTokens.access),
      },
    });

    let data = await response.json();
    if (response.status === 200) {
      alert('Динамические параметры получены')
      setDispatcherDynamicSettings(data)
    } else {
      alert('Не удалось получить динамические параметры');
    }
  }

  const fetchPostDispatcherChlorine = async () => {
    let response = await fetch(API_URL + '/RsoDynamic/waterpumpingstation/' + waterPumpingStationId + '/dispatcher/chlorine/' + date, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + String(authTokens.access),
      },
    });

    let data = await response.json();
    if (response.status === 200) {
      alert('Хлор получен')
      setDispatcherChlorine(data)
    } else {
      alert('Не удалось получить хлор');
    }
  }

  const fetchPutCloseSmena = async () => {
    let response = await fetch(API_URL + '/RsoDynamic/smena/' + smens[0].id + '/', {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + String(authTokens.access),
      },
      body: JSON.stringify({flag_complete: true, water_pumping_station: smens[0].water_pumping_station}),
    });

    if (response.status === 200) {
      alert('Смена успешно закрыта')
    } else {
      alert('Ошибка при закрытии смены');
    }
  };

  const fetchDynamicValues = () => {
    smens[0].dynamic_settings.map((item, index) => {
      fetchOnLink(item, setDynamicSettings, dynamicSettings);
    })
  }

  const fetchChlorine = () => {
    smens[0].chlorine.map((item, index) => {
      fetchOnLink(item, setChlorine, chlorine);
    })
  }

  const fetchOperInfo = async () => {
    let response = await fetch(API_URL + '/RsoDynamic/operationalinformation/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + String(authTokens.access),
      },
    });

    let data = await response.json();

    if (response.status === 200) {
      setOperInfo(data);
    } else {
    }
  }

  const fetchPostDynamicValues = async () => {
    let response = await fetch(API_URL + '/RsoDynamic/dynamicsettings/', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + String(authTokens.access),
      },
      body: JSON.stringify({
        ...postDynamicValuesData,
        smena_id: smens[0].id,
        water_level_in_reseruar: Object.values(postWaterLevelInReseruar)
      }),
    });

    if (response.status === 201) {
      alert('Почасовые показатели успешно переданы')
    } else {
      alert('Ошибка в передачи почасовых показателей');
    }
  };

  const fetchPostClorine = async () => {
    let response = await fetch(API_URL + '/RsoDynamic/chlorine/', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + String(authTokens.access),
      },
      body: JSON.stringify({...postChlorineData, smena_id: smens[0].id}),
    });

    if (response.status === 201) {
      alert('Хлор успешно передан')
    } else {
      alert('Ошибка в передачи хлора');
    }
  };

  const fetchPostRepairWell = async () => {
    let response = await fetch(API_URL + '/RSO/wellrepair/', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + String(authTokens.access),
      },
      body: JSON.stringify({
        ...postRepairWellData,
        shift_number: smens[0].shift_number,
        fullname: smens[0].fullname,
        type_of_repair: chooseTypeOfRepair,
        well: postRepairWellId,
        broken: chooseBrokenDevice
      }),
    });

        if (response.status === 201) {
            alert('Запись ремонта скважины успешно передана')
        } else {
            alert('Ошибка в передаче записи ремонта скважины');
        }
    };

    const fetchPostChangeWellStatus = async (id) => {
      let ownerId, Coordinates, sectionWaterPipeline;
      wells.map((item, index) => {
        if (item.id === id) {
          ownerId = item.owner_id;
          Coordinates = item.coordinates;
          sectionWaterPipeline = item.section_water_pipeline;
        }
      })
      let response = await fetch(API_URL + '/RSO/well/' + id + '/', {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + String(authTokens.access),
        },
        body: JSON.stringify({
          status: chooseTypeStatusWell,
          owner_id: ownerId,
          coordinates: Coordinates,
          section_water_pipeline: sectionWaterPipeline
        }),
      });

      if (response.status === 200) {
        alert('Статус насоса успешно изменен')
      } else {
        alert('Невозможно изменить статус насоса');
      }
    };

    const fetchPostRepairPumpVZU = async () => {
        let response = await fetch(API_URL + '/RSO/waterpumpingstationpumprepair/', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + String(authTokens.access),
          },
          body: JSON.stringify({
            ...postRepairPumpVZUData,
            shift_number: smens[0].shift_number,
            water_pumping_station_pump: postRepairWellId,
            fullname: smens[0].fullname,
            type_of_repair: chooseTypeOfRepairPumpVZU,
            broken: chooseBrokenDevice
          }),
        });

        if (response.status === 201) {
            alert('Запись ремонта насоса на ВЗУ успешно передана')
        } else {
            alert('Ошибка в передачи записи ремонта насоса на ВЗУ');
        }
    };

    const fetchPostChangePumpVZUStatus = async (id) => {
      let waterPumpingStation, efficiencyPump, pumpPressuere;
      pumpsVZU.map((item, index) => {
        if (item.id === id) {
          waterPumpingStation = item.water_pumping_station;
          efficiencyPump = item.efficiency_pump;
          pumpPressuere = item.pump_pressuere;
        }
      })
      let response = await fetch(API_URL + '/RSO/waterpumpingstationpump/' + id + '/', {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + String(authTokens.access),
        },
        body: JSON.stringify({
          status: chooseTypeStatusWell,
          water_pumping_station: waterPumpingStation,
          efficiency_pump: efficiencyPump,
          pump_pressuere: pumpPressuere
        }),
      });

      if (response.status === 200) {
        alert('Статус насоса на ВЗУ успешно сменен')
      } else {
        alert('Статус насоса на ВЗУ сменить не удалось');
      }
    };

  const hideAll = () => {
    setOperInfoAll(false);
    setDynamicAll(false);
    setChlorineAll(false);
    setFailureAll(false);
  }

  const clearStatusWellsHooks = () => {
    setPostFailureId('wells');
    setPostRepairWellId(-1);
    setChooseTypeStatusWell('В работе');
    setChooseTypeOfRepair('По току');
    setChooseTypeOfRepairPumpVZU('Шум, стук');
    setChooseBrokenDevice('КИПиА');
  }

  const isVisibleOperInfoAll = () => {
    hideAll();
    clearStatusWellsHooks();
    setOperInfoAll(!operInfoAll);
  }

  const isVisibleDynamicAll = () => {
    hideAll();
    clearStatusWellsHooks();
    setDynamicAll(!dynamicAll);
  }

  const isVisibleChlorineAll = () => {
    hideAll();
    clearStatusWellsHooks();
    setChlorineAll(!chlorineAll);
  }

  const isVisibleFailureAll = () => {
    hideAll();
    clearStatusWellsHooks();
    setFailureAll(!failureAll);
  }

  const isVisibleDynamicValues = () => {
    setDynamicValuesBtn(!dynamicValuesBtn);
    setPostDynamicValuesBtn(false);
    setPostChangeDynamicTypeBtn(false);
    setCloseSmenaBtn(false);
  }

  const isVisiblePostDynamicValues = () => {
    setPostDynamicValuesBtn(!postDynamicValuesBtn);
    setDynamicValuesBtn(false);
    setPostChangeDynamicTypeBtn(false);
    setCloseSmenaBtn(false);
  }

  const isVisibleCloseSmena = () => {
    setDynamicValuesBtn(false);
    setPostDynamicValuesBtn(false);
    setPostChangeDynamicTypeBtn(false);
    setCloseSmenaBtn(!closeSmenaBtn);
  }

  const isVisiblePostChangeDynamicType = () => {
    setDynamicValuesBtn(false);
    setPostDynamicValuesBtn(false);
    setCloseSmenaBtn(false);
    setPostChangeDynamicTypeBtn(!postChangeDynamicTypeBtn);
  }

  const isVisibleChlorine = () => {
    setChlorineBtn(!chlorineBtn);
    setPostChlorineBtn(false);
  }

  const isVisiblePostChlorine = () => {
    setPostChlorineBtn(!postChlorineBtn);
    setChlorineBtn(false);
  }

  const isVisibleFailure = () => {
    setFailureBtn(!failureBtn);
    setPostFailureBtn(false);
  }

  const isVisiblePostFailure = () => {
    setPostFailureBtn(!postFailureBtn);
    setFailureBtn(false);
  }

  return (
      <>
        <Layout title='ЭРА ЖКХ | Рсо динамика' content='Fare'/>
        {jobTitle === "Работник" ? (
            <div className="dynamicValuesRso__content">
              {smens.length === 0 ? (
                  <>
                    <h4 className='dynamicValuesRso__changeWPS-title'>Выберите ВЗУ: </h4>
                    {waterPumpingStation.length !== 0 ? (
                        <>
                          <div className="dynamicValuesRso__chooseSmensBox">
                            <form className='dynamicValuesRso__changeWPS-form'>
                              <select className='dynamicValuesRso__changeWPS-select'
                                      onChange={e => (setWaterPumpingStationId(parseInt(e.target.value)))}>
                                {waterPumpingStation.map((item, index) => {
                                  return (
                                      <option className='dynamicValuesRso__changeWPS-option'
                                              value={item.id}>{item.street}</option>
                                  )
                                })}

                              </select>
                            </form>
                          </div>


                          <h4 className='dynamicValuesRso__changeWPS-title'>Выберите смену: </h4>
                          <div className="dynamicValuesRso__chooseSmensBox">

                            <form className="dynamicValuesRso__changeWPS-form">
                              <select className="dynamicValuesRso__changeWPS-select"
                                      onChange={e => setChooseSmena(parseInt(e.target.value))}>
                                <option className="dynamicValuesRso__changeWPS-option" value="1">1</option>
                                <option className="dynamicValuesRso__changeWPS-option" value="2">2</option>
                              </select>
                            </form>

                          </div>


                          <h4 className='dynamicValuesRso__changeWPS-title'>Введите ФИО: </h4>
                          <div className="dynamicValuesRso__chooseSmensBox">

                            <form className="dynamicValuesRso__changeWPS-form">
                              <input className='pay-detail__input dynamicValuesRso__input-new' type="text"
                                     placeholder='Ваше ФИО' onChange={e => setEnterFullName(e.target.value)}/>
                            </form>
                          </div>


                          {waterPumpingStationById !== "" && chooseSmena !== "" && enterFullName !== "" ? (
                              <>
                                <div className="dynamicValuesRso__chooseSmensBox">
                                  <input className='dynamicValuesRso__changeWPS-btn' type="button"
                                         value="Подтвердить"
                                         onClick={() => (setChooseWPSBtn(true), fetchWaterPumpingStationById(), fetchPostSmena())}/>
                                </div>
                              </>
                          ) : (
                              ""
                          )}
                        </>
                    ) : (
                        "ВЗУ не добавлены"
                    )}
                  </>
              ) : (
                  <>
                    {waterPumpingStationById.length === 0 ? (
                        <div className="dynamicValuesRso__chooseSmensBox">
                          <input className='dynamicValuesRso__changeWPS-btn' type="button" value="Продолжить =>"
                                 onClick={() => (fetchWaterPumpingStationById(), fetchDynamicValues(), fetchChlorine())}/>
                        </div>
                    ) : (
                        ""
                    )}
                  </>
              )}

              {smens.length !== 0 && waterPumpingStationById.length !== 0 ? (
                  <>
                    <div className="dynamicValuesRso__tabs">
                      <a
                          type="button"
                          className={"dynamicValuesRso__tab " + (operInfoAll ? 'dynamicValuesRso__tab--active' : "")}
                          onClick={isVisibleOperInfoAll}
                      >
                        Оперативная информация
                      </a>
                      <a
                          type="button"
                          className={"dynamicValuesRso__tab " + (dynamicAll ? 'dynamicValuesRso__tab--active' : "")}
                          onClick={isVisibleDynamicAll}
                      >
                        Почасовые показатели
                      </a>
                      <a
                          type="button"
                          className={"dynamicValuesRso__tab " + (chlorineAll ? 'dynamicValuesRso__tab--active' : "")}
                          onClick={isVisibleChlorineAll}
                      >
                        Хлор
                      </a>
                      <a
                          type="button"
                          className={"dynamicValuesRso__tab " + (failureAll ? 'dynamicValuesRso__tab--active' : "")}
                          onClick={isVisibleFailureAll}
                      >
                        Отказы оборудования
                      </a>
                    </div>

                    {operInfoAll ? (
                        <>
                          <h1 className='dynamicValuesRso__title'>Вывод оперативной информации</h1>
                          <table className='dynamicValuesRso-table'>
                            <thead>
                            <tr>
                              <th rowSpan='2'>
                                Дата/Смена
                              </th>
                              <th rowSpan='2'>
                                Дежурная смена, ФИО
                              </th>
                              <th rowSpan='2'>
                                Время, час
                              </th>
                              <th colSpan='4'>
                                Насосы, машинный зал, N
                              </th>
                              <th colSpan='4'>
                                Скважины, N
                              </th>
                            </tr>
                            <tr>
                              <th>
                                В работе
                              </th>
                              <th>
                                В резерве
                              </th>
                              <th>
                                Ремонт
                              </th>
                              <th>
                                Причина ремонта
                              </th>
                              <th>
                                В работе
                              </th>
                              <th>
                                В резерве
                              </th>
                              <th>
                                Ремонт
                              </th>
                              <th>
                                Причина ремонта
                              </th>
                            </tr>
                            </thead>
                            <tbody>
                            {smens.map((item, index) => {
                              return (
                                  <tr>
                                    <td>
                                      {item.date} / {item.shift_number}
                                    </td>
                                    <td>
                                      {item.fullname}
                                    </td>
                                    <td>
                                      {item.time.substring(0, 8)}
                                    </td>
                                    <td>
                                      {pumpsVZU.length !== 0 ? (
                                          <>
                                            {pumpsVZU.map((item1, index1) => {
                                              if (item1.status === "В работе") {
                                                return (
                                                    <>
                                                      {pumpsVZU[index1].number_of_line};&nbsp;
                                                    </>
                                                )
                                              }
                                            })}
                                          </>
                                      ) : (
                                          ""
                                      )}

                                    </td>
                                    <td>
                                      {pumpsVZU.map((item1, index1) => {
                                        if (item1.status === "В резерве") {
                                          return (
                                              <>
                                                {pumpsVZU[index1].number_of_line};&nbsp;
                                              </>
                                          )
                                        }
                                      })}
                                    </td>
                                    <td>
                                      {pumpsVZU.map((item1, index1) => {
                                        if (item1.status === "В ремонте") {
                                          return (
                                              <>
                                                {pumpsVZU[index1].number_of_line};&nbsp;
                                              </>
                                          )
                                        }
                                      })}
                                    </td>
                                    <td>
                                      Пока пусто
                                    </td>
                                    <td>
                                      {wells.map((item1, index1) => {
                                        if (item1.status == "В работе") {
                                          return (
                                              <>
                                                {wells[index1].number_well};&nbsp;
                                              </>
                                          )
                                        }
                                      })}
                                    </td>
                                    <td>
                                      {wells.map((item1, index1) => {
                                        if (item1.status == "В резерве") {
                                          return (
                                              <>
                                                {wells[index1].number_well};&nbsp;
                                              </>
                                          )
                                        }
                                      })}
                                    </td>
                                    <td>
                                      {wells.map((item1, index1) => {
                                        if (item1.status == "В ремонте") {
                                          return (
                                              <>
                                                {wells[index1].number_well};&nbsp;
                                              </>
                                          )
                                        }
                                      })}
                                    </td>
                                    <td>
                                      Пока пусто
                                    </td>
                                  </tr>
                              )
                            })}
                            </tbody>
                          </table>
                        </>
                    ) : (
                        ""
                    )}


                    {dynamicAll ? (
                            <>
                              <div className="dynamicValuesRso__changetype">
                                <input
                                    className='dynamicValuesRso__dynamicValuesBtn'
                                    type="button"
                                    value={dynamicValuesBtn ? 'Скрыть вывод почасовых показателей' : 'Показать вывод почасовых показателей'}
                                    onClick={isVisibleDynamicValues}
                                />
                                <input
                                    className='dynamicValuesRso__dynamicValuesBtn'
                                    type="button"
                                    value={postDynamicValuesBtn ? 'Скрыть ввод почасовых показателей' : 'Показать ввод почасовых показателей'}
                                    onClick={isVisiblePostDynamicValues}
                                />
                                <input
                                    className='dynamicValuesRso__dynamicValuesBtn'
                                    type="button"
                                    value={postChangeDynamicTypeBtn ? 'Скрыть смену статуса' : 'Показать смену статуса'}
                                    onClick={isVisiblePostChangeDynamicType}
                                />
                                <input
                                    className='dynamicValuesRso__dynamicValuesBtn'
                                    type="button"
                                    value='Закрыть смену'
                                    onClick={isVisibleCloseSmena}
                                />
                              </div>
                              {dynamicValuesBtn ? (
                                  <>
                                    <h1 className='dynamicValuesRso__title'>Вывод почасовых показателей</h1>
                                    <table className='dynamicValuesRso-table'>
                                      <thead>
                                      <tr>
                                        <th rowSpan='2'>Дата/Смена</th>
                                        <th rowSpan='2'>Время, час</th>
                                        <th rowSpan='2'>Давление, кг/см2</th>
                                        <th colSpan='2'>Уровень воды в резервуаре, м</th>
                                        <th rowSpan='2'>Нагрузка, А</th>
                                        <th rowSpan='2'>Напряжение, В</th>
                                        <th rowSpan='2'>Насосы в работе</th>
                                        <th colSpan='2'>Часовой расход, м3</th>
                                        <th rowSpan='2'>Наличие пломб на РЧВ, шт</th>
                                        <th rowSpan='2'>Примечание</th>
                                      </tr>
                                      <tr>
                                        <th>№1</th>
                                        <th>№2</th>
                                        <th>Оперативная</th>
                                        <th>Средняя за час</th>
                                      </tr>
                                      </thead>
                                      {dynamicSettings.length !== 0 ? (
                                          <>
                                            <tbody>
                                            {dynamicSettings.map((item, index) => {
                                              return (
                                                  <>
                                                    <tr>
                                                      <td>
                                                        {smens[0].date}/
                                                        {smens[0].shift_number}
                                                      </td>
                                                      <td>
                                                        {item.time.substring(0, 8)}
                                                      </td>
                                                      <td>
                                                        {item.pressure}
                                                      </td>
                                                      {item.water_level_in_reseruar.map((item2, index2) => {
                                                        return (
                                                            <>
                                                              <td>
                                                                {item2}
                                                              </td>
                                                              {item.water_level_in_reseruar.length === 1 ? (
                                                                  <td>

                                                                  </td>
                                                              ) : ("")}
                                                            </>
                                                        )
                                                      })}
                                                      <td>
                                                        {item.current}
                                                      </td>
                                                      <td>
                                                        {item.voltage}
                                                      </td>
                                                      <td>
                                                        {item.pump_in_work.map((item2, index2) => {
                                                          return (
                                                              <>
                                                                {item2};&nbsp;
                                                              </>
                                                          )
                                                        })}
                                                      </td>
                                                      <td>
                                                        {item.max_consumption}
                                                      </td>
                                                      <td>
                                                        {item.min_consumption}
                                                      </td>
                                                      <td>
                                                        {item.presence_plomb}
                                                      </td>
                                                      <td>
                                                        {item.note}
                                                      </td>
                                                    </tr>
                                                  </>
                                              )
                                            })}
                                            </tbody>
                                          </>
                                      ) : (
                                          "Нет динамических параметров"
                                      )}
                                    </table>
                                  </>
                              ) : (
                                  ""
                              )}

                              {postDynamicValuesBtn ? (
                                  <>
                                    <h1 className='dynamicValuesRso__title'>Ввод почасовых показателей</h1>
                                    <div className="dynamicValuesRso__input-wrapper">
                                      <form className="dynamicValuesRso__form">
                                        <label className='pay-detail__label dynamicValuesRso__label'>
                                          Давление, кг/см2
                                          <input
                                              type='number'
                                              className='pay-detail__input dynamicValuesRso__input'
                                              name='pressure'
                                              min='0'
                                              step='0.01'
                                              onChange={(e) => postDynamicValuesSetData(e)}
                                              required
                                          />
                                        </label>
                                        <label className='pay-detail__label dynamicValuesRso__label'>
                                          Уровнь воды в первом резервуаре
                                          <input
                                              className="pay-detail__input dynamicValuesRso__input"
                                              id={'water_level_in_reseruar1'}
                                              type="number"
                                              min='0'
                                              step='0.01'
                                              placeholder='Уровень воды в резервуаре'
                                              name={'water_level_in_reseruar1'}
                                              onChange={(e) => addPostWaterLevelinReseruarArray(e)}
                                              required/>
                                        </label>
                                        <label className='pay-detail__label dynamicValuesRso__label'>
                                          Уровнь воды во втором резервуаре
                                          <input
                                              className="pay-detail__input dynamicValuesRso__input"
                                              id={'water_level_in_reseruar2'}
                                              type="number"
                                              min='0'
                                              step='0.1'
                                              placeholder='Уровень воды в резервуаре'
                                              name={'water_level_in_reseruar2'}
                                              onChange={(e) => addPostWaterLevelinReseruarArray(e)}
                                          />
                                        </label>
                                        <label className='pay-detail__label dynamicValuesRso__label'>
                                          Нагрузка, А
                                          <input
                                              type='number'
                                              className='pay-detail__input dynamicValuesRso__input'
                                              name='current'
                                              min='0'
                                              step='0.01'
                                              onChange={(e) => postDynamicValuesSetData(e)}
                                              required
                                          />
                                        </label>
                                        <label className='pay-detail__label dynamicValuesRso__label'>
                                          Напряжение, В
                                          <input
                                              type='number'
                                              className='pay-detail__input dynamicValuesRso__input'
                                              name='voltage'
                                              min='0'
                                              step='0.01'
                                              onChange={(e) => postDynamicValuesSetData(e)}
                                              required
                                          />
                                        </label>
                                        <label className='pay-detail__label dynamicValuesRso__label'>
                                          Часовой расход(оперативный)
                                          <input
                                              type='number'
                                              className='pay-detail__input dynamicValuesRso__input'
                                              name='min_consumption'
                                              min='0'
                                              step='0.01'
                                              onChange={(e) => postDynamicValuesSetData(e)}
                                              required
                                          />
                                        </label>
                                        <label className='pay-detail__label dynamicValuesRso__label'>
                                          Часовой расход (средний за час)
                                          <input
                                              type='number'
                                              className='pay-detail__input dynamicValuesRso__input'
                                              name='max_consumption'
                                              min='0'
                                              step='0.01'
                                              onChange={(e) => postDynamicValuesSetData(e)}
                                              required
                                          />
                                        </label>
                                        <label className='pay-detail__label dynamicValuesRso__label'>
                                          Наличие пломб на РЧВ, шт
                                          <input
                                              type='number'
                                              className='pay-detail__input dynamicValuesRso__input'
                                              name='presence_plomb'
                                              min='0'
                                              step='0.01'
                                              onChange={(e) => postDynamicValuesSetData(e)}
                                              required
                                          />
                                        </label>
                                        <label className='pay-detail__label dynamicValuesRso__label'>
                                          Примечание
                                          <input
                                              type='string'
                                              className='pay-detail__input dynamicValuesRso__input'
                                              name='note'
                                              min='0'
                                              step='0.01'
                                              onChange={(e) => postDynamicValuesSetData(e)}
                                              required
                                          />
                                        </label>

                                        <input
                                            className='dynamicValuesRso__btn'
                                            name='detalisation__btn'
                                            type='button'
                                            onClick={handleSubmit(fetchPostDynamicValues)}
                                            value="Сохранить"
                                        />

                                      </form>
                                    </div>
                                  </>
                              ) : (
                                  ""
                              )}

                              {postChangeDynamicTypeBtn ? (
                                  <>
                                    <h1 className='dynamicValuesRso__title'>Смена статуса</h1>
                                    <div className="dynamicValuesRso__changeType-container">
                                      <div className="dynamicValuesRso__changeType-forms">
                                        <form className="dynamicValuesRso__changeWPS-form">
                                          <label className='pay-detail__label dynamicValuesRso__label'>
                                            Выберите объект:
                                            <select className='dynamicValuesRso__changeWPS-select'
                                                    onChange={e => setPostFailureId(e.target.value)}>
                                              <option
                                                  className='dynamicValuesRso__changeWPS-option'
                                                  value={'wells'}>
                                                Скважина
                                              </option>
                                              <option
                                                  className='dynamicValuesRso__changeWPS-option'
                                                  value={'waterTank'}>
                                                Резервуар
                                              </option>
                                              <option
                                                  className='dynamicValuesRso__changeWPS-option'
                                                  value={'pipelineTechnicalLine'}>
                                                Техн. линия-трубопровод
                                              </option>
                                              <option
                                                  className='dynamicValuesRso__changeWPS-option'
                                                  value={'pumpingStation'}>
                                                Насосная станция
                                              </option>
                                            </select>
                                          </label>
                                        </form>

                                        {postFailureId === "wells" ? (
                                            <>
                                              <form className='dynamicValuesRso__changeWPS-form'>
                                                <select className='dynamicValuesRso__changeWPS-select'
                                                        onChange={e => setPostRepairWellId(parseInt(e.target.value))}>
                                                  <option
                                                      className='dynamicValuesRso__changeWPS-option'
                                                      value={-1}>
                                                    Не выбрано
                                                  </option>
                                                  {wells.map((item, index) => {
                                                    return (
                                                        <>
                                                          <option
                                                              className='dynamicValuesRso__changeWPS-option'
                                                              value={item.id}>
                                                            № {item.number_well} [{item.status}]
                                                          </option>
                                                        </>
                                                    )
                                                  })}
                                                </select>
                                              </form>

                                              {postRepairWellId >= 0 ? (
                                                  <form className="dynamicValuesRso__changeWPS-form">
                                                    <select className="dynamicValuesRso__changeWPS-select"
                                                            onChange={e => (setChooseTypeStatusWell(e.target.value))}>
                                                      <option
                                                          className='dynamicValuesRso__changeWPS-option'
                                                          value='В работе'>
                                                        В работе
                                                      </option>
                                                      <option
                                                          className='dynamicValuesRso__changeWPS-option'
                                                          value='В резерве'>
                                                        В резерве
                                                      </option>
                                                    </select>
                                                    <input
                                                        className='dynamicValuesRso__btn'
                                                        name='detalisation__btn'
                                                        type='button'
                                                        onClick={e => (fetchPostChangeWellStatus(postRepairWellId), clearStatusWellsHooks())}
                                                        value="Сохранить"
                                                    />
                                                  </form>
                                              ) : (
                                                  ""
                                              )}
                                            </>
                                        ) : (
                                            ""
                                        )}

                                        {postFailureId === "pumpingStation" ? (
                                            <>
                                              <form className='dynamicValuesRso__changeWPS-form'>
                                                <select className='dynamicValuesRso__changeWPS-select'
                                                        onChange={e => setPostRepairWellId(parseInt(e.target.value))}>
                                                  <option
                                                      className='dynamicValuesRso__changeWPS-option'
                                                      value={-1}>
                                                    Не выбрано
                                                  </option>
                                                  {pumpsVZU.map((item, index) => {
                                                    return (
                                                        <>
                                                          <option
                                                              className='dynamicValuesRso__changeWPS-option'
                                                              value={item.id}>
                                                            № {item.number_of_line} [{item.status}]
                                                          </option>
                                                        </>
                                                    )
                                                  })}
                                                </select>
                                              </form>
                                              {postRepairWellId >= 0 ? (
                                                  <form className="dynamicValuesRso__changeWPS-form">
                                                    <select className="dynamicValuesRso__changeWPS-select"
                                                            onChange={e => (setChooseTypeStatusWell(e.target.value))}>
                                                      <option
                                                          className='dynamicValuesRso__changeWPS-option'
                                                          value='В работе'>
                                                        В работе
                                                      </option>
                                                      <option
                                                          className='dynamicValuesRso__changeWPS-option'
                                                          value='В резерве'>
                                                        В резерве
                                                      </option>
                                                    </select>
                                                    <input
                                                        className='dynamicValuesRso__btn'
                                                        name='detalisation__btn'
                                                        type='button'
                                                        onClick={e => (fetchPostChangePumpVZUStatus(postRepairWellId), clearStatusWellsHooks())}
                                                        value="Сохранить"
                                                    />
                                                  </form>
                                              ) : (
                                                  ""
                                              )}
                                            </>
                                        ) : (
                                            ""
                                        )}
                                      </div>
                                    </div>
                                  </>
                              ) : (
                                  ""
                              )}

                              {closeSmenaBtn ? (
                                  <>
                                    <h1 className='dynamicValuesRso__title'>Закрытие смены</h1>
                                    <div className="dynamicValuesRso__changeType-container">
                                      <div className="dynamicValuesRso__changeType-forms">
                                        <form className="dynamicValuesRso__closeSmena-form ">
                                          <input
                                              className='dynamicValuesRso__dynamicValuesBtn'
                                              type="button"
                                              value='Подтвердить'
                                              onClick={fetchPutCloseSmena}
                                          />
                                        </form>
                                      </div>
                                    </div>
                                  </>
                              ) : (
                                  ""
                              )}
                            </>
                        )
                        : ("")
                    }

                    {chlorineAll ? (
                        <>
                          <div className="dynamicValuesRso__changetype">
                            <input
                                className='dynamicValuesRso__dynamicValuesBtn'
                                type="button"
                                value={chlorineBtn ? 'Скрыть вывод хлора' : 'Показать вывод хлора'}
                                onClick={isVisibleChlorine}
                            />
                            <input
                                className='dynamicValuesRso__dynamicValuesBtn'
                                type="button"
                                value={postChlorineBtn ? 'Скрыть ввод хлора' : 'Показать ввод хлора'}
                                onClick={isVisiblePostChlorine}
                            />
                          </div>

                          {chlorineBtn ? (
                              <>
                                <h1 className='dynamicValuesRso__title'>Вывод хлора</h1>
                                <table className='dynamicValuesRso-table'>
                                  <thead>
                                  <tr>
                                    <th rowSpan='2'>Дата, смена</th>
                                    <th rowSpan='2'>Время, час</th>
                                    <th colSpan='2'>Доза хлора</th>
                                    <th rowSpan='2'>Расход реагента</th>
                                    <th rowSpan='2'>Примечание</th>
                                  </tr>
                                  <tr>
                                    <th>мин</th>
                                    <th>макс</th>
                                  </tr>
                                  </thead>
                                  {chlorine.length !== 0 ? (
                                      <>
                                        <tbody>
                                        {chlorine.map((item, index) => {
                                          return (
                                              <tr>
                                                <td>
                                                  {item.date}/
                                                  {smens[0].shift_number}
                                                </td>
                                                <td>
                                                  {item.time.substring(0, 8)}
                                                </td>
                                                <td>
                                                  {item.min_chlorine}
                                                </td>
                                                <td>
                                                  {item.max_chlorine}
                                                </td>
                                                <td>
                                                  {item.reagent_consumption}
                                                </td>
                                                <td>
                                                  {item.note}
                                                </td>
                                              </tr>
                                          )
                                        })}
                                        </tbody>
                                      </>
                                  ) : (
                                      "Массив пуст"
                                  )}
                                </table>
                              </>
                          ) : (
                              ""
                          )}


                          {postChlorineBtn ? (
                              <>
                                <h1 className='dynamicValuesRso__title'>Ввод хлора</h1>
                                <div className="dynamicValuesRso__input-wrapper">
                                  <form className="dynamicValuesRso__form"
                                        onSubmit={handleSubmit(fetchPostClorine)}>
                                    <label className='pay-detail__label dynamicValuesRso__label'>
                                      Доза хлора (мин.)
                                      <input
                                          type='number'
                                          className='pay-detail__input dynamicValuesRso__input'
                                          name='min_chlorine'
                                          min='0'
                                          step='0.01'
                                          onChange={(e) => postChlorineSetData(e)}
                                          required
                                      />
                                    </label>
                                    <label className='pay-detail__label dynamicValuesRso__label'>
                                      Доза хлора (макс.)
                                      <input
                                          type='number'
                                          className='pay-detail__input dynamicValuesRso__input'
                                          name='max_chlorine'
                                          min='0'
                                          step='0.01'
                                          onChange={(e) => postChlorineSetData(e)}
                                          required
                                      />
                                    </label>
                                    <label className='pay-detail__label dynamicValuesRso__label'>
                                      Расход реагента
                                      <input
                                          type='number'
                                          className='pay-detail__input dynamicValuesRso__input'
                                          name='reagent_consumption'
                                          min='0'
                                          step='0.01'
                                          onChange={(e) => postChlorineSetData(e)}
                                          required
                                      />
                                    </label>
                                    <label className='pay-detail__label dynamicValuesRso__label'>
                                      Примечание
                                      <input
                                          type='string'
                                          className='pay-detail__input dynamicValuesRso__input'
                                          name='note'
                                          min='0'
                                          step='0.01'
                                          onChange={(e) => postChlorineSetData(e)}
                                          required
                                      />
                                    </label>

                                    <button
                                        className='dynamicValuesRso__btn'
                                        name='detalisation__btn'
                                        type='submit'
                                    >
                                      Сохранить
                                    </button>
                                  </form>
                                </div>
                              </>
                          ) : (
                              ""
                          )}
                        </>
                    ) : (
                        ""
                    )}

                    {failureAll ? (
                        <>
                          <div className="dynamicValuesRso__changetype">
                            <input
                                className='dynamicValuesRso__dynamicValuesBtn'
                                type="button"
                                value={failureBtn ? 'Скрыть вывод отказов оборудования' : 'Показать вывод отказов оборудования'}
                                onClick={isVisibleFailure}
                            />
                            <input
                                className='dynamicValuesRso__dynamicValuesBtn'
                                type="button"
                                value={postFailureBtn ? 'Скрыть ввод отказов оборудования' : 'Показать ввод отказов оборудования'}
                                onClick={isVisiblePostFailure}
                            />
                          </div>

                          {failureBtn ? (
                              <>
                                <h1 className='dynamicValuesRso__title'>Вывод отказов оборудования</h1>
                                <table className='dynamicValuesRso-table'>
                                  <thead>
                                  <tr>
                                    <th>
                                      Дата
                                    </th>
                                    <th>
                                      Дежурная смена, ФИО
                                    </th>
                                    <th>
                                      Время, час
                                    </th>
                                    <th>
                                      № Объекта
                                    </th>
                                    <th>
                                      Наименование объекта
                                    </th>
                                    <th>
                                      Сломанное оборудование
                                    </th>
                                    <th>
                                      Вид отказа
                                    </th>
                                    <th>
                                      *Проведенные работы
                                    </th>
                                  </tr>
                                  </thead>
                                  <tbody>
                                  {wellRepair.length !== 0 ? (
                                      wellRepair.map((item, index) => {
                                        return (
                                            <>
                                              <tr>
                                                <td>
                                                  {item.date_of_repair} / {item.shift_number}
                                                </td>
                                                <td>
                                                  {item.fullname}
                                                </td>
                                                <td>
                                                  {item.time.substring(0, 8)}
                                                </td>
                                                <td>
                                                  {wells.map((item1, index1) => {//Временные костыли----------------------------
                                                    return (
                                                        <>
                                                          {item1.id === item.well ? (
                                                              <>
                                                                {item1.number_well}
                                                              </>
                                                          ) : (
                                                              ""
                                                          )}
                                                        </>
                                                    )
                                                  })}
                                                </td>
                                                <td>
                                                  Скважина
                                                </td>
                                                <td>
                                                  {item.broken}
                                                </td>
                                                <td>
                                                  {item.type_of_repair}
                                                </td>
                                                <td>
                                                  {item.note}
                                                </td>
                                              </tr>
                                            </>
                                        )
                                      })
                                  ) : (
                                      "Нет скважин в ремонте"
                                  )}

                                  {waterPumpingStationPumpRepair.length !== 0 ? (
                                      waterPumpingStationPumpRepair.map((item, index) => {
                                        return (
                                            <>
                                              <tr>
                                                <td>
                                                  {item.date_of_repair} / {item.shift_number}
                                                </td>
                                                <td>
                                                  {item.fullname}
                                                </td>
                                                <td>
                                                  {item.time.substring(0, 8)}
                                                </td>
                                                <td>
                                                  {pumpsVZU.map((item1, index1) => {
                                                    return (
                                                        <>
                                                          {item1.id === item.water_pumping_station_pump ? (
                                                              <>
                                                                {item1.number_of_line}
                                                              </>
                                                          ) : (
                                                              ""
                                                          )}
                                                        </>
                                                    )
                                                  })}
                                                </td>
                                                <td>
                                                  Насос на ВЗУ
                                                </td>
                                                <td>
                                                  {item.broken}
                                                </td>
                                                <td>
                                                  {item.type_of_repair}
                                                </td>
                                                <td>
                                                  {item.note}
                                                </td>
                                              </tr>
                                            </>
                                        )
                                      })
                                  ) : (
                                      "Нет насосов на ВЗУ в ремонте"
                                  )}
                                  </tbody>
                                </table>

                              </>
                          ) : (
                              ""
                          )}

                          {postFailureBtn ? (
                              <>
                                <h1 className='dynamicValuesRso__title'>Ввод отказов оборудования</h1>
                                <form className='dynamicValuesRso__changeWPS-form'>
                                  <select className='dynamicValuesRso__changeWPS-select'
                                          onChange={e => setPostFailureId(e.target.value)}>
                                    <option
                                        className='dynamicValuesRso__changeWPS-option'
                                        value={'wells'}>
                                      Скважина
                                    </option>
                                    <option
                                        className='dynamicValuesRso__changeWPS-option'
                                        value={'waterTank'}>
                                      Резервуар
                                    </option>
                                    <option
                                        className='dynamicValuesRso__changeWPS-option'
                                        value={'pipelineTechnicalLine'}>
                                      Техн. линия-трубопровод
                                    </option>
                                    <option
                                        className='dynamicValuesRso__changeWPS-option'
                                        value={'pumpingStation'}>
                                      Насосная станция
                                    </option>
                                  </select>
                                </form>
                                {postFailureId === "wells" ? (
                                    <>
                                      <form className='dynamicValuesRso__changeWPS-form'>
                                        <select className='dynamicValuesRso__changeWPS-select'
                                                onChange={e => (setChooseTypeStatusWell('В ремонте'), setPostRepairWellId(parseInt(e.target.value)))}>
                                          <option
                                              className='dynamicValuesRso__changeWPS-option'
                                              value={-1}>
                                            Не выбрано
                                          </option>
                                          {wells.map((item, index) => {
                                            return (
                                                <>
                                                  {item.status !== "В ремонте" ? (
                                                      <option
                                                          className='dynamicValuesRso__changeWPS-option'
                                                          value={item.id}>
                                                        № {item.number_well} [{item.status}]
                                                      </option>
                                                  ) : (
                                                      ""
                                                  )}
                                                </>
                                            )
                                          })}
                                        </select>
                                      </form>
                                      {postRepairWellId >= 0 ? (
                                          <>
                                            <form className="dynamicValuesRso__form-repair">
                                              <label className='pay-detail__label dynamicValuesRso__label'>
                                                Сломанное устройство
                                                <select className='dynamicValuesRso__changeWPS-select'
                                                        onChange={e => setChooseBrokenDevice(e.target.value)}>
                                                  <option
                                                      className='dynamicValuesRso__changeWPS-option'
                                                      value='КИПиА'>
                                                    КИПиА
                                                  </option>
                                                  <option
                                                      className='dynamicValuesRso__changeWPS-option'
                                                      value='Запорная арматура'>
                                                    Запорная арматура
                                                  </option>
                                                  <option
                                                      className='dynamicValuesRso__changeWPS-option'
                                                      value='Агрегат насосный'>
                                                    Агрегат насосный
                                                  </option>
                                                </select>
                                              </label>
                                            </form>
                                            <form className="dynamicValuesRso__form-repair">
                                              <label className='pay-detail__label dynamicValuesRso__label'>
                                                Вид отказа оборудования
                                                <select className='dynamicValuesRso__changeWPS-select'
                                                        onChange={e => (setChooseTypeOfRepair(e.target.value), setChooseTypeStatusWell('В ремонте'))}>
                                                  <option
                                                      className='dynamicValuesRso__changeWPS-option'
                                                      value='По току'>
                                                    По току
                                                  </option>
                                                  <option
                                                      className='dynamicValuesRso__changeWPS-option'
                                                      value='По напряжению'>
                                                    По напряжению
                                                  </option>
                                                  <option
                                                      className='dynamicValuesRso__changeWPS-option'
                                                      value='Нет сети'>
                                                    Нет сети
                                                  </option>
                                                  <option
                                                      className='dynamicValuesRso__changeWPS-option'
                                                      value='Инцидент'>
                                                    Инцидент
                                                  </option>
                                                </select>
                                              </label>
                                              <label className='pay-detail__label dynamicValuesRso__label'>
                                                Проведенные работы
                                                <input
                                                    type='text'
                                                    className='pay-detail__input dynamicValuesRso__input'
                                                    name='note'
                                                    onChange={(e) => postRepairWellSetData(e)}
                                                    required
                                                />
                                              </label>
                                              <input
                                                  className='dynamicValuesRso__btn'
                                                  name='detalisation__btn'
                                                  type='button'
                                                  onClick={e => (fetchPostRepairWell(), fetchPostChangeWellStatus(postRepairWellId), clearStatusWellsHooks())}
                                                  value="Сохранить"
                                              />
                                            </form>
                                          </>
                                      ) : (
                                          ""
                                      )}
                                    </>
                                ) : (
                                    ""
                                )}
                                {postFailureId === "pumpingStation" ? (
                                    <>
                                      <form className='dynamicValuesRso__changeWPS-form'>
                                        <select className='dynamicValuesRso__changeWPS-select'
                                                onChange={e => (setChooseTypeStatusWell('В ремонте'), setPostRepairWellId(parseInt(e.target.value)))}>
                                          <option
                                              className='dynamicValuesRso__changeWPS-option'
                                              value={-1}>
                                            Не выбрано
                                          </option>
                                          {pumpsVZU.map((item, index) => {
                                            return (
                                                <>
                                                  {item.status !== "В ремонте" ? (
                                                      <option
                                                          className='dynamicValuesRso__changeWPS-option'
                                                          value={item.id}>
                                                        № {item.number_of_line} [{item.status}]
                                                      </option>
                                                  ) : (
                                                      ""
                                                  )}
                                                </>
                                            )
                                          })}
                                        </select>
                                      </form>
                                      {postRepairWellId >= 0 ? (
                                          <>
                                            <form className="dynamicValuesRso__form-repair">
                                              <label className='pay-detail__label dynamicValuesRso__label'>
                                                Сломанное устройство
                                                <select className='dynamicValuesRso__changeWPS-select'
                                                        onChange={e => setChooseBrokenDevice(e.target.value)}>
                                                  <option
                                                      className='dynamicValuesRso__changeWPS-option'
                                                      value='КИПиА'>
                                                    КИПиА
                                                  </option>
                                                  <option
                                                      className='dynamicValuesRso__changeWPS-option'
                                                      value='Запорная арматура'>
                                                    Запорная арматура
                                                  </option>
                                                  <option
                                                      className='dynamicValuesRso__changeWPS-option'
                                                      value='Агрегат насосный'>
                                                    Агрегат насосный
                                                  </option>
                                                </select>
                                              </label>
                                            </form>
                                            <form className="dynamicValuesRso__form-repair">
                                              <label className='pay-detail__label dynamicValuesRso__label'>
                                                Вид отказа оборудования
                                                <select className='dynamicValuesRso__changeWPS-select'
                                                        onChange={e => (setChooseTypeOfRepairPumpVZU(e.target.value), setChooseTypeStatusWell('В ремонте'))}>
                                                  <option
                                                      className='dynamicValuesRso__changeWPS-option'
                                                      value='Шум, стук'>
                                                    Шум, стук
                                                  </option>
                                                  <option
                                                      className='dynamicValuesRso__changeWPS-option'
                                                      value='Вибрация повыш.'>
                                                    Вибрация повыш.
                                                  </option>
                                                  <option
                                                      className='dynamicValuesRso__changeWPS-option'
                                                      value='Температура > 70гр.'>
                                                    Температура больше 70гр.
                                                  </option>
                                                  <option
                                                      className='dynamicValuesRso__changeWPS-option'
                                                      value='Дым, изоляция'>
                                                    Дым, изоляция
                                                  </option>
                                                  <option
                                                      className='dynamicValuesRso__changeWPS-option'
                                                      value='Мех. повреждения'>
                                                    Мех. повреждения
                                                  </option>
                                                  <option
                                                      className='dynamicValuesRso__changeWPS-option'
                                                      value='Несчастный случай'>
                                                    Несчастный случай
                                                  </option>
                                                </select>
                                              </label>
                                              <label className='pay-detail__label dynamicValuesRso__label'>
                                                Проведенные работы
                                                <input
                                                    type='text'
                                                    className='pay-detail__input dynamicValuesRso__input'
                                                    name='note'
                                                    onChange={(e) => postRepairPumpVZUSetData(e)}
                                                    required
                                                />
                                              </label>
                                              <input
                                                  className='dynamicValuesRso__btn'
                                                  name='detalisation__btn'
                                                  type='button'
                                                  onClick={e => (fetchPostRepairPumpVZU(), fetchPostChangePumpVZUStatus(postRepairWellId), clearStatusWellsHooks())}
                                                  value="Сохранить"
                                              />
                                            </form>
                                          </>
                                      ) : (
                                          ""
                                      )}
                                    </>
                                ) : (
                                    ""
                                )}
                              </>
                          ) : (
                              ""
                          )}

                        </>
                    ) : (
                        ""
                    )}

                  </>
              ) : (
                  ""
              )}
                </div>
            ) : (
            <>
              <div className="dynamicValuesRso__content">
                <h4 className='dynamicValuesRso__changeWPS-title'>Выберите ВЗУ: </h4>
                {waterPumpingStation.length !== 0 ? (
                    <>
                      <div className="dynamicValuesRso__chooseSmensBox">
                        <form className='dynamicValuesRso__changeWPS-form'>
                          <select className='dynamicValuesRso__changeWPS-select'
                                  onChange={e => (setWaterPumpingStationId(parseInt(e.target.value)))}>
                            {waterPumpingStation.map((item, index) => {
                              return (
                                  <option className='dynamicValuesRso__changeWPS-option'
                                          value={item.id}>{item.street}</option>
                              )
                            })}

                          </select>
                        </form>
                      </div>

                      <h4 className='dynamicValuesRso__changeWPS-title'>Введите дату: </h4>
                      <div className="dynamicValuesRso__chooseSmensBox">

                        <form className="dynamicValuesRso__changeWPS-form">
                          <input className='pay-detail__input dynamicValuesRso__input-new' type="date"
                                 onChange={e => setDate(e.target.value)}/>
                        </form>
                      </div>


                      {waterPumpingStationById !== "" && date !== "" ? (
                          <>
                            <div className="dynamicValuesRso__chooseSmensBox">
                              <input className='dynamicValuesRso__changeWPS-btn' type="button" value="Подтвердить"
                                     onClick={() => (setChooseWPSBtn(true), fetchWaterPumpingStationById(), fetchPostDispatcherDynamicSettings(), fetchPostDispatcherChlorine())}/>
                            </div>
                            {waterPumpingStationById.length !== 0 ? (
                                <div className="dynamicValuesRso__tabs">
                                  <a
                                      type="button"
                                      className={"dynamicValuesRso__tab " + (operInfoAll ? 'dynamicValuesRso__tab--active' : "")}
                                      onClick={isVisibleOperInfoAll}
                                  >
                                    Оперативная информация
                                  </a>
                                  <a
                                      type="button"
                                      className={"dynamicValuesRso__tab " + (dynamicAll ? 'dynamicValuesRso__tab--active' : "")}
                                      onClick={isVisibleDynamicAll}
                                  >
                                    Почасовые показатели
                                  </a>
                                  <a
                                      type="button"
                                      className={"dynamicValuesRso__tab " + (chlorineAll ? 'dynamicValuesRso__tab--active' : "")}
                                      onClick={isVisibleChlorineAll}
                                  >
                                    Хлор
                                  </a>
                                  <a
                                      type="button"
                                      className={"dynamicValuesRso__tab " + (failureAll ? 'dynamicValuesRso__tab--active' : "")}
                                      onClick={isVisibleFailureAll}
                                  >
                                    Отказы оборудования
                                  </a>
                                </div>
                            ) : (
                                ""
                            )}

                            {operInfoAll ? (
                                <>
                                  <h1 className='dynamicValuesRso__title'>Вывод оперативной информации</h1>
                                  <table className='dynamicValuesRso-table'>
                                    <thead>
                                    <tr>
                                      <th colSpan='4'>
                                        Насосы, машинный зал, N
                                      </th>
                                      <th colSpan='4'>
                                        Скважины, N
                                      </th>
                                    </tr>
                                    <tr>
                                      <th>
                                        В работе
                                      </th>
                                      <th>
                                        В резерве
                                      </th>
                                      <th>
                                        Ремонт
                                      </th>
                                      <th>
                                        Причина ремонта
                                      </th>
                                      <th>
                                        В работе
                                      </th>
                                      <th>
                                        В резерве
                                      </th>
                                      <th>
                                        Ремонт
                                      </th>
                                      <th>
                                        Причина ремонта
                                      </th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr>
                                      <td>
                                        {pumpsVZU.length !== 0 ? (
                                            <>
                                              {pumpsVZU.map((item1, index1) => {
                                                if (item1.status === "В работе") {
                                                  return (
                                                      <>
                                                        {pumpsVZU[index1].number_of_line};&nbsp;
                                                      </>
                                                  )
                                                }
                                              })}
                                            </>
                                        ) : (
                                            ""
                                        )}

                                      </td>
                                      <td>
                                        {pumpsVZU.map((item1, index1) => {
                                          if (item1.status === "В резерве") {
                                            return (
                                                <>
                                                  {pumpsVZU[index1].number_of_line};&nbsp;
                                                </>
                                            )
                                          }
                                        })}
                                      </td>
                                      <td>
                                        {pumpsVZU.map((item1, index1) => {
                                          if (item1.status === "В ремонте") {
                                            return (
                                                <>
                                                  {pumpsVZU[index1].number_of_line};&nbsp;
                                                </>
                                            )
                                          }
                                        })}
                                      </td>
                                      <td>
                                        Пока пусто
                                      </td>
                                      <td>
                                        {wells.map((item1, index1) => {
                                          if (item1.status == "В работе") {
                                            return (
                                                <>
                                                  {wells[index1].number_well};&nbsp;
                                                </>
                                            )
                                          }
                                        })}
                                      </td>
                                      <td>
                                        {wells.map((item1, index1) => {
                                          if (item1.status == "В резерве") {
                                            return (
                                                <>
                                                  {wells[index1].number_well};&nbsp;
                                                </>
                                            )
                                          }
                                        })}
                                      </td>
                                      <td>
                                        {wells.map((item1, index1) => {
                                          if (item1.status == "В ремонте") {
                                            return (
                                                <>
                                                  {wells[index1].number_well};&nbsp;
                                                </>
                                            )
                                          }
                                        })}
                                      </td>
                                      <td>
                                        Пока пусто
                                      </td>
                                    </tr>
                                    </tbody>
                                  </table>
                                </>
                            ) : (
                                ""
                            )}

                            {dynamicAll ? (
                                <>
                                  <h1 className='dynamicValuesRso__title'>Вывод почасовых показателей</h1>
                                  <table className='dynamicValuesRso-table'>
                                    <thead>
                                    <tr>
                                      <th rowSpan='2'>Давление, кг/см2</th>
                                      <th colSpan='2'>Уровень воды в резервуаре, м</th>
                                      <th rowSpan='2'>Нагрузка, А</th>
                                      <th rowSpan='2'>Напряжение, В</th>
                                      <th rowSpan='2'>Насосы в работе</th>
                                      <th colSpan='2'>Часовой расход, м3</th>
                                      <th rowSpan='2'>Наличие пломб на РЧВ, шт</th>
                                      <th rowSpan='2'>Примечание</th>
                                    </tr>
                                    <tr>
                                      <th>№1</th>
                                      <th>№2</th>
                                      <th>Оперативная</th>
                                      <th>Средняя за час</th>
                                    </tr>
                                    </thead>
                                    {dispatcherDynamicSettings !== 0 ? (
                                        <>
                                          <tbody>
                                          {dispatcherDynamicSettings.map((item, index) => {
                                            return (
                                                <>
                                                  <tr>
                                                    <td>
                                                      {item.pressure}
                                                    </td>
                                                    {item.water_level_in_reseruar.map((item2, index2) => {
                                                      return (
                                                          <>
                                                            <td>
                                                              {item2}
                                                            </td>
                                                            {item.water_level_in_reseruar.length === 1 ? (
                                                                <td>

                                                                </td>
                                                            ) : ("")}
                                                          </>
                                                      )
                                                    })}
                                                    <td>
                                                      {item.current}
                                                    </td>
                                                    <td>
                                                      {item.voltage}
                                                    </td>
                                                    <td>
                                                      {item.pump_in_work.map((item2, index2) => {
                                                        return (
                                                            <>
                                                              {item2};&nbsp;
                                                            </>
                                                        )
                                                      })}
                                                    </td>
                                                    <td>
                                                      {item.max_consumption}
                                                    </td>
                                                    <td>
                                                      {item.min_consumption}
                                                    </td>
                                                    <td>
                                                      {item.presence_plomb}
                                                    </td>
                                                    <td>
                                                      {item.note}
                                                    </td>
                                                  </tr>
                                                </>
                                            )
                                          })}
                                          </tbody>
                                        </>
                                    ) : (
                                        "Нет динамических параметров"
                                    )}
                                  </table>
                                </>
                            ) : (
                                ""
                            )}

                            {chlorineAll ? (
                                <>
                                  <h1 className='dynamicValuesRso__title'>Вывод хлора</h1>
                                  <table className='dynamicValuesRso-table'>
                                    <thead>
                                    <tr>
                                      <th colSpan='2'>Доза хлора</th>
                                      <th rowSpan='2'>Расход реагента</th>
                                      <th rowSpan='2'>Примечание</th>
                                    </tr>
                                    <tr>
                                      <th>мин</th>
                                      <th>макс</th>
                                    </tr>
                                    </thead>
                                    {dispatcherChlorine.length !== 0 ? (
                                        <>
                                          <tbody>
                                          {dispatcherChlorine.map((item, index) => {
                                            return (
                                                <tr>
                                                  <td>
                                                    {item.min_chlorine}
                                                  </td>
                                                  <td>
                                                    {item.max_chlorine}
                                                  </td>
                                                  <td>
                                                    {item.reagent_consumption}
                                                  </td>
                                                  <td>
                                                    {item.note}
                                                  </td>
                                                </tr>
                                            )
                                          })}
                                          </tbody>
                                        </>
                                    ) : (
                                        "Массив пуст"
                                    )}
                                  </table>
                                </>
                            ) : (
                                ""
                            )}

                            {failureAll ? (
                                <>
                                  <h1 className='dynamicValuesRso__title'>Вывод отказов оборудования</h1>
                                  <table className='dynamicValuesRso-table'>
                                    <thead>
                                    <tr>
                                      <th>
                                        Дата
                                      </th>
                                      <th>
                                        Дежурная смена, ФИО
                                      </th>
                                      <th>
                                        Время, час
                                      </th>
                                      <th>
                                        № Объекта
                                      </th>
                                      <th>
                                        Наименование объекта
                                      </th>
                                      <th>
                                        Сломанное оборудование
                                      </th>
                                      <th>
                                        Вид отказа
                                      </th>
                                      <th>
                                        *Проведенные работы
                                      </th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {wellRepair.length !== 0 ? (
                                        wellRepair.map((item, index) => {
                                          return (
                                              <>
                                                <tr>
                                                  <td>
                                                    {item.date_of_repair} / {item.shift_number}
                                                  </td>
                                                  <td>
                                                    {item.fullname}
                                                  </td>
                                                  <td>
                                                    {item.time.substring(0, 8)}
                                                  </td>
                                                  <td>
                                                    {wells.map((item1, index1) => {//Временные костыли----------------------------
                                                      return (
                                                          <>
                                                            {item1.id === item.well ? (
                                                                <>
                                                                  {item1.number_well}
                                                                </>
                                                            ) : (
                                                                ""
                                                            )}
                                                          </>
                                                      )
                                                    })}
                                                  </td>
                                                  <td>
                                                    Скважина
                                                  </td>
                                                  <td>
                                                    {item.broken}
                                                  </td>
                                                  <td>
                                                    {item.type_of_repair}
                                                  </td>
                                                  <td>
                                                    {item.note}
                                                  </td>
                                                </tr>
                                              </>
                                          )
                                        })
                                    ) : (
                                        "Нет скважин в ремонте"
                                    )}

                                    {waterPumpingStationPumpRepair.length !== 0 ? (
                                        waterPumpingStationPumpRepair.map((item, index) => {
                                          return (
                                              <>
                                                <tr>
                                                  <td>
                                                    {item.date_of_repair} / {item.shift_number}
                                                  </td>
                                                  <td>
                                                    {item.fullname}
                                                  </td>
                                                  <td>
                                                    {item.time.substring(0, 8)}
                                                  </td>
                                                  <td>
                                                    {pumpsVZU.map((item1, index1) => {
                                                      return (
                                                          <>
                                                            {item1.id === item.water_pumping_station_pump ? (
                                                                <>
                                                                  {item1.number_of_line}
                                                                </>
                                                            ) : (
                                                                ""
                                                            )}
                                                          </>
                                                      )
                                                    })}
                                                  </td>
                                                  <td>
                                                    Насос на ВЗУ
                                                  </td>
                                                  <td>
                                                    {item.broken}
                                                  </td>
                                                  <td>
                                                    {item.type_of_repair}
                                                  </td>
                                                  <td>
                                                    {item.note}
                                                  </td>
                                                </tr>
                                              </>
                                          )
                                        })
                                    ) : (
                                        "Нет насосов на ВЗУ в ремонте"
                                    )}
                                    </tbody>
                                  </table>
                                </>
                            ) : (
                                ""
                            )}

                          </>
                      ) : (
                          ""
                      )}
                    </>
                ) : (
                    "ВЗУ не добавлены"
                )}
              </div>
                </>
            )}
        </>
    )

}

export default DynamicValuesRSO;