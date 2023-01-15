import React, {useContext, useEffect, useState} from 'react';
import Layout from '../components/Layout';
import {saveAs} from 'file-saver';
import {AddressSuggestions} from 'react-dadata';
import 'react-dadata/dist/react-dadata.css';
import {API_URL, DADATA_TOKEN} from "../config";
import AuthContext from "../context/AuthContext";
import {useForm} from "react-hook-form";

const Fare = () => {
    // Проверка авторизации пользователя
    let {authTokens, logoutUser} = useContext(AuthContext);

    // Получаем данные о профиле
    let [profile, setProfile] = useState('');

    useEffect(() => {
        getProfile();
        getCalcDetailData();
    }, []);

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
        } else if (data["detail"] === "Учетные данные не были предоставлены.") {
            logoutUser();
        } else {
            alert("Произошла непредвиденная ошибка")
        }
    };

    // Получаем данные о сохраненных расчетах/детализациях
    let [calcDetailData, setCalcDetailData] = useState([]);

    let getCalcDetailData = async () => {
        let response = await fetch(API_URL + '/fare', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + String(authTokens.access),
            },
        });
        let data = await response.json();

        if (response.status === 200) {
            setCalcDetailData(data);
        } else if (data["detail"] === "Учетные данные не были предоставлены.") {
            logoutUser();
        } else {
            alert("Произошла непредвиденная ошибка")
        }
    };

    // Контроллер формы
    const {handleSubmit} = useForm({mode: 'onBlur',});

    // Дата
    let today = new Date();

    // Контроллеры страницы
    const [activeID, setActiveId] = useState('tabs-top__1');
    const [switchID, setSwitchID] = useState('Orel');
    const [saveDB, setSaveDB] = useState(true);

    // Переменный для отрисовки таблиц по расчетам
    const [russiaCalcTab, setRussiaCalcTab] = useState([])
    const [orelCalcTab, setOrelCalcTab] = useState([])
    const [orelDetailTab, setOrelDetailTab] = useState([])

    // Переменные для динамического изменения выходной таблицы
    const [changeTable, setChangeTable] = useState(false)
    const [tableChanged, setTableChanged] = useState(false)

    // Форма расчёта по России
    const [russiaCalcData, setRussiaCalcData] = useState({
        "type__ofwall": '1',
        "type__offoundation": '1',
        "type__ofoverlap": '1'
    });
    const [russiaCalcAddress, setRussiaCalcAddress] = useState("");
    // Форма расчёта по Орлу
    const [orelCalcData, setOrelCalcData] = useState({
        "type__ofwall": '1'
    });
    const [orelCalcAddress, setOrelCalcAddress] = useState("");
    // Форма детализации по Орлу
    const [orelDetailData, setOrelDetailData] = useState({
        "type__ofwall": '1'
    });
    const [orelDetailAddress, setOrelDetailAddress] = useState("");

    // Заполнение формы расчёта по России
    const russiaCalcSetData = (e) => {
        let name = e.target.name
        let value = e.target.value
        if (value !== "on") {
            setRussiaCalcData({...russiaCalcData, [name]: value});
        } else {
            if (russiaCalcData[name]) {
                setRussiaCalcData({...russiaCalcData, [name]: false});
            } else {
                setRussiaCalcData({...russiaCalcData, [name]: true});
            }
        }
    };
    // Заполнение формы расчёта по Орлу
    const orelCalcSetData = (e) => {
        let name = e.target.name
        let value = e.target.value
        if (value !== "on") {
            setOrelCalcData({...orelCalcData, [e.target.name]: e.target.value});
        } else {
            if (orelCalcData[name]) {
                setOrelCalcData({...orelCalcData, [name]: false});
            } else {
                setOrelCalcData({...orelCalcData, [name]: true});
            }
        }
    };
    // Заполнение формы детализации по Орлу
    const orelDetailSetData = (e) => {
        let name = e.target.name
        let value = e.target.value
        if (value !== "on") {
            setOrelDetailData({...orelDetailData, [name]: value});
        } else {
            if (orelDetailData[name]) {
                setOrelDetailData({...orelDetailData, [name]: false});
            } else {
                setOrelDetailData({...orelDetailData, [name]: true});
            }
        }
    };

    // Получение таблицы расчета по России из API
    const fetchRussiaCalc = async () => {
        setRussiaCalcData({...russiaCalcData, ["address"]: russiaCalcAddress["value"]})
        let response = await fetch(API_URL + '/fare/russia/calculation', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + String(authTokens.access)
            },
            body: JSON.stringify(russiaCalcData),
        })

        let data = await response.json();

        if (response.status === 200) {
            setRussiaCalcTab(data)
        } else if (data["detail"] === "Войдите заново в систему") {
            logoutUser();
        } else {
            alert(data["detail"]);
        }
    };
    // Получение excel файла расчета по России из API
    const fetchRussiaCalcExcel = async () => {
        fetch(API_URL + '/fare/russia/calculation/excel', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + String(authTokens.access)
            },
            body: JSON.stringify(russiaCalcData),
        })
            .then((res) => res.blob())
            .then((result) => saveAs(result, russiaCalcData["address"] + '.xlsx'))
            .catch((err) => console.log('error'));
    };
    // Сохранение расчета по России в базу данных
    const fetchRussiaCalcDB = async () => {
        let response = await fetch(API_URL + '/fare', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + String(authTokens.access)
            },
            body: JSON.stringify({
                type: "Россия (расчёт)",
                address: russiaCalcData.address,
                manage_org: profile[0]["manage_org"],
                date: String(today.getDate()).padStart(2, '0') + "." + String(today.getMonth() + 1).padStart(2, '0') + "." + String(today.getFullYear()),
                calculation_data: russiaCalcTab
            }),
        })

        let data = await response.json();

        if (response.status === 201) {
            alert("Расчёт успешно сохранён в базу данных")
        } else if (data["detail"] === "Войдите заново в систему") {
            logoutUser();
        } else {
            alert(data["detail"]);
        }
    };
    // Получение таблицы расчета по Орлу из API
    const fetchOrelCalc = async () => {
        let response = await fetch(API_URL + '/fare/orel/calculation', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + String(authTokens.access)
            },
            body: JSON.stringify({...orelCalcData, address: orelCalcAddress["value"], region: orelCalcAddress.data.region}),
        })

        let data = await response.json();

        if (response.status === 200) {
            setOrelCalcTab(data)
        } else if (data["detail"] === "Учетные данные не были предоставлены.") {
            logoutUser();
        } else {
            alert("Произошла ошибка");
        }
    };
    // Получение excel файла расчета по Орлу из API
    const fetchOrelCalcExcel = async () => {
        if (tableChanged) {
            fetch(API_URL + '/fare/orel/calculation/excel', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + String(authTokens.access)
                },
                body: JSON.stringify({
                    ...orelCalcData,
                    changed_arr: orelCalcTab.data,
                    board_size: orelCalcTab.board_size,
                    region: orelCalcAddress.data.region
                }),
            })
                .then((res) => res.blob())
                .then((result) => saveAs(result, orelCalcAddress["value"] + '.xlsx'))
                .catch((err) => console.log('error'));
        } else {
            fetch(API_URL + '/fare/orel/calculation/excel', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + String(authTokens.access)
                },
                body: JSON.stringify({...orelCalcData, address: orelCalcAddress["value"], region: orelCalcAddress.data.region}),
            })
                .then((res) => res.blob())
                .then((result) => saveAs(result, orelCalcAddress["value"] + '.xlsx'))
                .catch((err) => console.log('error'));
        }
    };
    // Сохранение расчета по Орлу в базу данных
    const fetchOrelCalcDB = async () => {
        let response = await fetch(API_URL + '/fare', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + String(authTokens.access)
            },
            body: JSON.stringify({
                type: "Орёл (расчёт)",
                address: orelCalcAddress["value"],
                manage_org: profile[0]["manage_org"],
                date: String(today.getDate()).padStart(2, '0') + "." + String(today.getMonth() + 1).padStart(2, '0') + "." + String(today.getFullYear()),
                calculation_data: orelCalcTab
            }),
        })

        let data = await response.json();

        if (response.status === 201) {
            alert("Расчёт успешно сохранён в базу данных")
        } else if (data["detail"] === "Войдите заново в систему") {
            logoutUser();
        } else {
            alert(data["detail"]);
        }
    };
    // Получение таблицы детализации по Орлу из API
    const fetchOrelDetail = async () => {
        let response = await fetch(API_URL + '/fare/orel/detail', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + String(authTokens.access)
            },
            body: JSON.stringify({...orelDetailData, address: orelDetailAddress["value"]}),
        })

        let data = await response.json();

        if (response.status === 200) {
            console.log(data)
            setOrelDetailTab(data)
        } else if (data["detail"] === "Учетные данные не были предоставлены.") {
            logoutUser();
        } else {
            alert("Произошла ошибка");
        }
    };
    // Получение excel файла детализации по Орлу из API
    const fetchOrelDetailExcel = async () => {
        fetch(API_URL + '/fare/orel/detail/excel', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + String(authTokens.access)
            },
            body: JSON.stringify(orelDetailData),
        })
            .then((res) => res.blob())
            .then((result) => saveAs(result, orelDetailAddress["value"] + '.xlsx'))
            .catch((err) => console.log('error'));
    };
    // Сохранение детализации по Орлу в базу данных
    const fetchOrelDetailDB = async () => {
        let response = await fetch(API_URL + '/fare', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + String(authTokens.access)
            },
            body: JSON.stringify({
                type: "Орёл (детализация)",
                address: orelDetailAddress["value"],
                manage_org: profile[0]["manage_org"],
                date: String(today.getDate()).padStart(2, '0') + "." + String(today.getMonth() + 1).padStart(2, '0') + "." + String(today.getFullYear()),
                calculation_data: orelDetailTab
            }),
        })

        let data = await response.json();

        if (response.status === 201) {
            alert("Расчёт успешно сохранён в базу данных")
        } else if (data["detail"] === "Войдите заново в систему") {
            logoutUser();
        } else {
            alert(data["detail"]);
        }
    };

    // Изменение таблицы пользвоателем
    const changeTableData = (e) => {
        setTableChanged(true)
        let value = parseFloat(e.target.value)
        let id = parseInt(e.target.name)
        let tab = orelCalcTab
        tab["data"][id]["v1"] = value
        tab["data"][id]["v2"] = value * parseFloat(orelCalcData["square__resid"])
        tab["data"][id]["v3"] = value * parseFloat(orelCalcData["square__resid"]) * 12
        setOrelCalcTab(tab)
    }
    const calcSumTabOrel = () => {
        let tab = orelCalcTab
        let summ = 0
        tab.data.map((array, index) => {
            summ += parseFloat(array.v1)
        })

        tab["board_size"] = summ
        setOrelCalcTab(tab)
    }

    return (
        <>
            <Layout title='ЭРА ЖКХ | Расчет/детализация платы' content='Fare'/>
            <section className='tabs'>
                <div className='container'>
                    <div className='tabs__top'>
                        <a
                            className={'tabs__top-item ' + (activeID === 'tabs-top__1' ? 'tabs__top-item--active' : '')}
                            href='#'
                            onClick={() => {
                                setActiveId('tabs-top__1')
                            }}
                        >
                            Расчет размера платы за содержание общего имущества
                        </a>
                        <a
                            className={'tabs__top-item ' + (activeID === 'tabs-top__2' ? 'tabs__top-item--active' : '')}
                            href='#'
                            onClick={() => {
                                setActiveId('tabs-top__2');
                            }}
                        >
                            Детализация платы за содержание общего имущества
                        </a>
                        <a
                            className={'tabs__top-item ' + (activeID === 'tabs-top__3' ? 'tabs__top-item--active' : '')}
                            href='#'
                            onClick={() => {
                                setActiveId('tabs-top__3');
                            }}
                        >
                            База данных расчетов
                        </a>
                    </div>
                    <div className='tabs__content'>
                        {/* <!----------Content-1-------------------------------------------------> */}

                        <div
                            className={'tabs__content-item ' + (activeID === 'tabs-top__1' ? 'tabs__content-item--active' : '')}
                            id='tab-1'
                        >
                            {/* Убираем Россию, потом как-нибудь вернем, не зря же я старался*/}
                            {/*<div className='tabs__content-switch'>*/}
                            {/*    <p className={'tabs__content-switch__text ' + (switchID === 'Russia' ? 'tabs__content-switch__text--active' : '')}>*/}
                            {/*        Россия*/}
                            {/*    </p>*/}
                            {/*    <label className='tabs__content-switch__label'>*/}
                            {/*        <input*/}
                            {/*            className='tabs__content-switch__input'*/}
                            {/*            type='checkbox'*/}
                            {/*            onClick={() => {*/}
                            {/*                switchID === 'Russia' ? setSwitchID('Orel') : setSwitchID('Russia');*/}
                            {/*            }}*/}
                            {/*        />*/}
                            {/*    </label>*/}
                            {/*    <p className={'tabs__content-switch__text ' + (switchID === 'Orel' ? 'tabs__content-switch__text--active' : '')}>*/}
                            {/*        Орел*/}
                            {/*    </p>*/}
                            {/*</div>*/}

                            <div className='pay-detail'>
                                {switchID === 'Russia' ? (
                                    <form className='pay-detail__form' onSubmit={handleSubmit(fetchRussiaCalc)}>
                                        <div className='wrapper-switch__1'>
                                            <div className='pay-detail__input-wrapper'>
                                                <label className='pay-detail__label'>
                                                    Адрес
                                                    <AddressSuggestions
                                                        token={DADATA_TOKEN}
                                                        type='text'
                                                        id='address'
                                                        className='pay-detail__input address'
                                                        name='address'
                                                        placeholder='Введите адрес'
                                                        value={russiaCalcAddress}
                                                        onChange={setRussiaCalcAddress}
                                                    />
                                                </label>
                                                <label className='pay-detail__label'>
                                                    Год ввода в эксплуатацию
                                                    <input
                                                        type='number'
                                                        className='pay-detail__input'
                                                        name='year__ofcommissioning'
                                                        min='1900'
                                                        max='2022'
                                                        step='1'
                                                        onChange={e => russiaCalcSetData(e)}
                                                    />
                                                </label>
                                                <label className='pay-detail__label'>
                                                    Количество этажей, в том числе подземных этажей
                                                    <input
                                                        type='number'
                                                        className='pay-detail__input'
                                                        name='number__floor'
                                                        min='0'
                                                        step='1'
                                                        onChange={e => russiaCalcSetData(e)}
                                                    />
                                                </label>
                                                <label className='pay-detail__label'>
                                                    Количество подземных этажей/подвал
                                                    <input
                                                        type='number'
                                                        className='pay-detail__input'
                                                        name='number__basement'
                                                        min='0'
                                                        step='1'
                                                        onChange={e => russiaCalcSetData(e)}
                                                    />
                                                </label>
                                                <label className='pay-detail__label'>
                                                    Количество подъездов
                                                    <input
                                                        type='number'
                                                        className='pay-detail__input'
                                                        name='number__entrance'
                                                        min='0'
                                                        step='1'
                                                        onChange={e => russiaCalcSetData(e)}
                                                    />
                                                </label>
                                                <label className='pay-detail__label'>
                                                    Количество квартир
                                                    <input
                                                        type='number'
                                                        className='pay-detail__input'
                                                        name='number__flat'
                                                        min='0'
                                                        step='1'
                                                        onChange={e => russiaCalcSetData(e)}
                                                    />
                                                </label>
                                                <label className='pay-detail__label'>
                                                    Количество проживающих
                                                    <input
                                                        type='number'
                                                        className='pay-detail__input'
                                                        name='number__people'
                                                        min='0'
                                                        step='1'
                                                        onChange={e => russiaCalcSetData(e)}
                                                    />
                                                </label>
                                                <label className='pay-detail__label'>
                                                    Площадь здания (многоквартирного дома), кв.м
                                                    <input
                                                        type='number'
                                                        className='pay-detail__input'
                                                        name='square__building'
                                                        min='0'
                                                        step='0.1'
                                                        onChange={e => russiaCalcSetData(e)}
                                                    />
                                                </label>
                                                <label className='pay-detail__label'>
                                                    Площадь жилых и нежилых помещений, кв.м
                                                    <input
                                                        type='number'
                                                        className='pay-detail__input'
                                                        name='square__resid-nonresid'
                                                        min='0'
                                                        step='0.1'
                                                        onChange={e => russiaCalcSetData(e)}
                                                    />
                                                </label>
                                                <label className='pay-detail__label'>
                                                    Площадь чердака, кв.м
                                                    <input
                                                        type='number'
                                                        className='pay-detail__input'
                                                        name='square__attic'
                                                        min='0'
                                                        step='0.1'
                                                        onChange={e => russiaCalcSetData(e)}
                                                    />
                                                </label>
                                                <label className='pay-detail__label'>
                                                    Площадь подвала, кв.м
                                                    <input
                                                        type='number'
                                                        className='pay-detail__input'
                                                        name='square__basement'
                                                        min='0'
                                                        step='0.1'
                                                        onChange={e => russiaCalcSetData(e)}
                                                    />
                                                </label>
                                                <label className='pay-detail__label'>
                                                    Площадь лестничных площадок и маршей, кв.м
                                                    <input
                                                        type='number'
                                                        className='pay-detail__input'
                                                        name='number__landing'
                                                        min='0'
                                                        step='0.1'
                                                        onChange={e => russiaCalcSetData(e)}
                                                    />
                                                </label>
                                                <label className='pay-detail__label'>
                                                    Количество загрузочных клапанов мусоропровода
                                                    <input
                                                        type='number'
                                                        className='pay-detail__input'
                                                        name='number__garbagevalves'
                                                        min='0'
                                                        step='1'
                                                        onChange={e => russiaCalcSetData(e)}
                                                    />
                                                </label>
                                                <label className='pay-detail__label'>
                                                    Количество лифтов
                                                    <input
                                                        type='number'
                                                        className='pay-detail__input'
                                                        name='number__elevator'
                                                        min='0'
                                                        step='1'
                                                        onChange={e => russiaCalcSetData(e)}
                                                    />
                                                </label>
                                                <label className='pay-detail__label'>
                                                    Площадь кабин лифтов
                                                    <input
                                                        type='number'
                                                        className='pay-detail__input'
                                                        name='square__elevatorcabin'
                                                        min='0'
                                                        step='0.1'
                                                        onChange={e => russiaCalcSetData(e)}
                                                    />
                                                </label>
                                                <label className='pay-detail__label'>
                                                    Норма прибыли % (доля за управление)
                                                    <input
                                                        type='number'
                                                        className='pay-detail__input'
                                                        name='rate__ofreturn'
                                                        min='0'
                                                        step='0.1'
                                                        onChange={e => russiaCalcSetData(e)}
                                                    />
                                                </label>
                                                <label className='pay-detail__label'>
                                                    Базовая ставка обслуживание 1-го лифта
                                                    <input
                                                        type='number'
                                                        className='pay-detail__input'
                                                        name='maintenance__ofoneelevator'
                                                        min='0'
                                                        step='1'
                                                        onChange={e => russiaCalcSetData(e)}
                                                    />
                                                </label>
                                                <label className='pay-detail__label'>
                                                    МРОТ
                                                    <input
                                                        type='number'
                                                        className='pay-detail__input'
                                                        name='mrot'
                                                        min='0'
                                                        step='1'
                                                        onChange={e => russiaCalcSetData(e)}
                                                    />
                                                </label>
                                                <div className='pay-detail__walltype-wrapper'>
                                                    <label className='pay-detail__label'>
                                                        Тип наружных стен
                                                        <select
                                                            className='pay-detail__walltype-select pay-detail__outwalltype-wrapper'
                                                            name='type__ofwall'
                                                            onChange={e => russiaCalcSetData(e)}
                                                        >
                                                            <option value='1'>Каменные (кирпичные)</option>
                                                            <option value='2'>Крупноблочные</option>
                                                            <option value='3'>Крупнопанельные</option>
                                                            <option value='4'>
                                                                Облегченной кладки из кирпича
                                                            </option>
                                                            <option value='5'>Из шлакоблоков</option>
                                                            <option value='6'>Из ракушечника</option>
                                                            <option value='7'>
                                                                Смешанные (кирпичные и деревянные)
                                                            </option>
                                                            <option value='8'>Сырцовые</option>
                                                            <option value='9'>Рубленные</option>
                                                            <option value='10'>Брусчатые</option>
                                                        </select>
                                                    </label>
                                                </div>
                                                <div
                                                    className='pay-detail__walltype-wrapper pay-detail__fundwalltype-wrapper'>
                                                    <label className='pay-detail__label'>
                                                        Тип фундамента
                                                        <select
                                                            className='pay-detail__walltype-select'
                                                            name='type__offoundation'
                                                            onChange={e => russiaCalcSetData(e)}
                                                        >
                                                            <option value='1'>Бетонные</option>
                                                            <option value='2'>Крупноблочные</option>
                                                            <option value='3'>Ленточные бутовые</option>
                                                            <option value='4'>
                                                                Облегченной кладки из кирпича
                                                            </option>
                                                            <option value='5'>Из шлакоблоков</option>
                                                            <option value='6'>Из ракушечника</option>
                                                            <option value='7'>
                                                                Смешанные (кирпичные и деревянные)
                                                            </option>
                                                            <option value='8'>Сырцовые</option>
                                                            <option value='9'>Рубленные</option>
                                                            <option value='10'>Брусчатые</option>
                                                        </select>
                                                    </label>
                                                </div>
                                                <div
                                                    className='pay-detail__walltype-wrapper pay-detail__lapwalltype-wrapper'>
                                                    <label className='pay-detail__label'>
                                                        Тип перекрытия
                                                        <select
                                                            className='pay-detail__walltype-select'
                                                            name='type__ofoverlap'
                                                            onChange={e => russiaCalcSetData(e)}
                                                        >
                                                            <option value='1'>Железобетонные</option>
                                                            <option value='2'>
                                                                Cмешанные (деревянные и железобетонные)
                                                            </option>
                                                            <option value='3'>Деревянные</option>
                                                            <option value='4'>
                                                                Каменные своды по металлическим балкам
                                                            </option>
                                                        </select>
                                                    </label>
                                                </div>
                                            </div>
                                            <p className='pay-detail__equipment-title'>
                                                Энергообеспечение (отметить)
                                            </p>
                                            <div
                                                className='pay-detail__equipment-wrapper pay-detail__electricity-wrapper'>
                                                <label className='pay-detail__label pay-detail__checkbox-label'>
                              <span className='pay-detail__checkbox-text'>
                                Централизованное отопление
                              </span>
                                                    <div className='pay-detail__checkbox-wrapper'>
                                                        <input
                                                            type='checkbox'
                                                            className='pay-detail__checkbox'
                                                            name='central__heating'
                                                            onChange={e => russiaCalcSetData(e)}
                                                        />
                                                        <span className='pay-detail__checkbox-span'/>
                                                    </div>
                                                </label>
                                                <label className='pay-detail__label pay-detail__checkbox-label'>
                              <span className='pay-detail__checkbox-text'>
                                Отопление и ГВС от АОГВ
                              </span>
                                                    <div className='pay-detail__checkbox-wrapper'>
                                                        <input
                                                            type='checkbox'
                                                            className='pay-detail__checkbox'
                                                            name='heating__gbs-and__aogv'
                                                            onChange={e => russiaCalcSetData(e)}
                                                        />
                                                        <span className='pay-detail__checkbox-span'/>
                                                    </div>
                                                </label>
                                                <label className='pay-detail__label pay-detail__checkbox-label'>
                              <span className='pay-detail__checkbox-text'>
                                Горячее водоснабжение
                              </span>
                                                    <div className='pay-detail__checkbox-wrapper'>
                                                        <input
                                                            type='checkbox'
                                                            className='pay-detail__checkbox'
                                                            name='hot__watersupply'
                                                            onChange={e => russiaCalcSetData(e)}
                                                        />
                                                        <span className='pay-detail__checkbox-span'/>
                                                    </div>
                                                </label>
                                                <label className='pay-detail__label pay-detail__checkbox-label'>
                              <span className='pay-detail__checkbox-text'>
                                Холодное водоснабжение
                              </span>
                                                    <div className='pay-detail__checkbox-wrapper'>
                                                        <input
                                                            type='checkbox'
                                                            className='pay-detail__checkbox'
                                                            name='cold__watersupply'
                                                            onChange={e => russiaCalcSetData(e)}
                                                        />
                                                        <span className='pay-detail__checkbox-span'/>
                                                    </div>
                                                </label>
                                                <label className='pay-detail__label pay-detail__checkbox-label'>
                              <span className='pay-detail__checkbox-text'>
                                Водоотведение
                              </span>
                                                    <div className='pay-detail__checkbox-wrapper'>
                                                        <input
                                                            type='checkbox'
                                                            className='pay-detail__checkbox'
                                                            name='drainage'
                                                            onChange={e => russiaCalcSetData(e)}
                                                        />
                                                        <span className='pay-detail__checkbox-span'/>
                                                    </div>
                                                </label>
                                                <label className='pay-detail__label pay-detail__checkbox-label'>
                              <span className='pay-detail__checkbox-text'>
                                Газоснабжение
                              </span>
                                                    <div className='pay-detail__checkbox-wrapper'>
                                                        <input
                                                            type='checkbox'
                                                            className='pay-detail__checkbox'
                                                            name='gas__supply'
                                                            onChange={e => russiaCalcSetData(e)}
                                                        />
                                                        <span className='pay-detail__checkbox-span'/>
                                                    </div>
                                                </label>
                                            </div>
                                            <p className='pay-detail__equipment-title'>
                                                Обязательные работы, услуги
                                            </p>
                                            <div
                                                className='pay-detail__equipment-wrapper pay-detail__electricity-wrapper'>
                                                <label className='pay-detail__label pay-detail__checkbox-label'>
                              <span className='pay-detail__checkbox-text'>
                                Подметание лестничных площадок и маршей
                              </span>
                                                    <div className='pay-detail__checkbox-wrapper'>
                                                        <input
                                                            type='checkbox'
                                                            className='pay-detail__checkbox'
                                                            name='sweeping__stairs'
                                                            onChange={e => russiaCalcSetData(e)}
                                                        />
                                                        <span className='pay-detail__checkbox-span'/>
                                                    </div>
                                                </label>
                                                <label className='pay-detail__label pay-detail__checkbox-label'>
                              <span className='pay-detail__checkbox-text'>
                                Подметание лестничных площадок и маршей с
                                предварительным их увлажнением
                              </span>
                                                    <div className='pay-detail__checkbox-wrapper'>
                                                        <input
                                                            type='checkbox'
                                                            className='pay-detail__checkbox'
                                                            name='sweeping__landings-with__moisture'
                                                            onChange={e => russiaCalcSetData(e)}
                                                        />
                                                        <span className='pay-detail__checkbox-span'/>
                                                    </div>
                                                </label>
                                                <label className='pay-detail__label pay-detail__checkbox-label'>
                              <span className='pay-detail__checkbox-text'>
                                Мытье лестничных площадок и маршей
                              </span>
                                                    <div className='pay-detail__checkbox-wrapper'>
                                                        <input
                                                            type='checkbox'
                                                            className='pay-detail__checkbox'
                                                            name='washing__stairs'
                                                            onChange={e => russiaCalcSetData(e)}
                                                        />
                                                        <span className='pay-detail__checkbox-span'/>
                                                    </div>
                                                </label>
                                                <label className='pay-detail__label pay-detail__checkbox-label'>
                              <span className='pay-detail__checkbox-text'>
                                Влажное подметание мест перед загрузочными камерами
                                мусоропровода
                              </span>
                                                    <div className='pay-detail__checkbox-wrapper'>
                                                        <input
                                                            type='checkbox'
                                                            className='pay-detail__checkbox'
                                                            name='wet__sweeping-places__nexttothe-garbage'
                                                            onChange={e => russiaCalcSetData(e)}
                                                        />
                                                        <span className='pay-detail__checkbox-span'/>
                                                    </div>
                                                </label>
                                                <label className='pay-detail__label pay-detail__checkbox-label'>
                              <span className='pay-detail__checkbox-text'>
                                Мытье окон
                              </span>
                                                    <div className='pay-detail__checkbox-wrapper'>
                                                        <input
                                                            type='checkbox'
                                                            className='pay-detail__checkbox'
                                                            name='window__washing'
                                                            onChange={e => russiaCalcSetData(e)}
                                                        />
                                                        <span className='pay-detail__checkbox-span'/>
                                                    </div>
                                                </label>
                                                <label className='pay-detail__label pay-detail__checkbox-label'>
                              <span className='pay-detail__checkbox-text'>
                                Иная работа по санитарной уборке подъездов и
                                лестничных клеток
                              </span>
                                                    <div className='pay-detail__checkbox-wrapper'>
                                                        <input
                                                            type='checkbox'
                                                            className='pay-detail__checkbox'
                                                            name='other__sanitationwork'
                                                            onChange={e => russiaCalcSetData(e)}
                                                        />
                                                        <span className='pay-detail__checkbox-span'/>
                                                    </div>
                                                </label>
                                                <label className='pay-detail__label pay-detail__checkbox-label'>
                              <span className='pay-detail__checkbox-text'>
                                Подметание кабин лифтов с предварительным их
                                увлажнением
                              </span>
                                                    <div className='pay-detail__checkbox-wrapper'>
                                                        <input
                                                            type='checkbox'
                                                            className='pay-detail__checkbox'
                                                            name='sweeping__elevators-with__moisture'
                                                            onChange={e => russiaCalcSetData(e)}
                                                        />
                                                        <span className='pay-detail__checkbox-span'/>
                                                    </div>
                                                </label>
                                                <label className='pay-detail__label pay-detail__checkbox-label'>
                              <span className='pay-detail__checkbox-text'>
                                Уборка чердачного помещения
                              </span>
                                                    <div className='pay-detail__checkbox-wrapper'>
                                                        <input
                                                            type='checkbox'
                                                            className='pay-detail__checkbox'
                                                            name='cleaning__attic'
                                                            onChange={e => russiaCalcSetData(e)}
                                                        />
                                                        <span className='pay-detail__checkbox-span'/>
                                                    </div>
                                                </label>
                                                <label className='pay-detail__label pay-detail__checkbox-label'>
                              <span className='pay-detail__checkbox-text'>
                                Уборка подвального помещения
                              </span>
                                                    <div className='pay-detail__checkbox-wrapper'>
                                                        <input
                                                            type='checkbox'
                                                            className='pay-detail__checkbox'
                                                            name='basement__cleaning'
                                                            onChange={e => russiaCalcSetData(e)}
                                                        />
                                                        <span className='pay-detail__checkbox-span'/>
                                                    </div>
                                                </label>
                                                <label className='pay-detail__label pay-detail__checkbox-label'>
                              <span className='pay-detail__checkbox-text'>
                                Содержание и ремонт лифтов
                              </span>
                                                    <div className='pay-detail__checkbox-wrapper'>
                                                        <input
                                                            type='checkbox'
                                                            className='pay-detail__checkbox'
                                                            name='maintenance__and-repair__elevators'
                                                            onChange={e => russiaCalcSetData(e)}
                                                        />
                                                        <span className='pay-detail__checkbox-span'/>
                                                    </div>
                                                </label>
                                                <label className='pay-detail__label pay-detail__checkbox-label'>
                              <span className='pay-detail__checkbox-text'>
                                Работы по содержанию мусоропровода
                              </span>
                                                    <div className='pay-detail__checkbox-wrapper'>
                                                        <input
                                                            type='checkbox'
                                                            className='pay-detail__checkbox'
                                                            name='waste__chute-maintenance__works'
                                                            onChange={e => russiaCalcSetData(e)}
                                                        />
                                                        <span className='pay-detail__checkbox-span'/>
                                                    </div>
                                                </label>
                                                <label className='pay-detail__label pay-detail__checkbox-label'>
                              <span className='pay-detail__checkbox-text'>
                                Работы по содержанию и обслуживанию системы
                                отопления
                              </span>
                                                    <div className='pay-detail__checkbox-wrapper'>
                                                        <input
                                                            type='checkbox'
                                                            className='pay-detail__checkbox'
                                                            name='heating__system-maintenance__work'
                                                            onChange={e => russiaCalcSetData(e)}
                                                        />
                                                        <span className='pay-detail__checkbox-span'/>
                                                    </div>
                                                </label>
                                                <label className='pay-detail__label pay-detail__checkbox-label'>
                              <span className='pay-detail__checkbox-text'>
                                Работы по обслуживанию газовых сетей
                              </span>
                                                    <div className='pay-detail__checkbox-wrapper'>
                                                        <input
                                                            type='checkbox'
                                                            className='pay-detail__checkbox'
                                                            name='gas__network-maintenance__work'
                                                            onChange={e => russiaCalcSetData(e)}
                                                        />
                                                        <span className='pay-detail__checkbox-span'/>
                                                    </div>
                                                </label>
                                                <label className='pay-detail__label pay-detail__checkbox-label'>
                              <span className='pay-detail__checkbox-text'>
                                Техническое обслуживание и ремонт внутридомовых
                                сетей и инженерного оборудования
                              </span>
                                                    <div className='pay-detail__checkbox-wrapper'>
                                                        <input
                                                            type='checkbox'
                                                            className='pay-detail__checkbox'
                                                            name='repair__networks-engineering__equipment'
                                                            onChange={e => russiaCalcSetData(e)}
                                                        />
                                                        <span className='pay-detail__checkbox-span'/>
                                                    </div>
                                                </label>
                                                <label className='pay-detail__label pay-detail__checkbox-label'>
                              <span className='pay-detail__checkbox-text'>
                                Техническое обслуживание и ремонт конструктивных
                                элементов зданий
                              </span>
                                                    <div className='pay-detail__checkbox-wrapper'>
                                                        <input
                                                            type='checkbox'
                                                            className='pay-detail__checkbox'
                                                            name='repair__structural-elements__buildings'
                                                            onChange={e => russiaCalcSetData(e)}
                                                        />
                                                        <span className='pay-detail__checkbox-span'/>
                                                    </div>
                                                </label>
                                                <label className='pay-detail__label pay-detail__checkbox-label'>
                              <span className='pay-detail__checkbox-text'>
                                Аварийно-диспетчерское обслуживание
                              </span>
                                                    <div className='pay-detail__checkbox-wrapper'>
                                                        <input
                                                            type='checkbox'
                                                            className='pay-detail__checkbox'
                                                            name='emergency__dispatch-service'
                                                            onChange={e => russiaCalcSetData(e)}
                                                        />
                                                        <span className='pay-detail__checkbox-span'/>
                                                    </div>
                                                </label>
                                                <label className='pay-detail__label pay-detail__checkbox-label'>
                              <span className='pay-detail__checkbox-text'>
                                Текущий ремонт (планово- предупредительный)
                              </span>
                                                    <div className='pay-detail__checkbox-wrapper'>
                                                        <input
                                                            type='checkbox'
                                                            className='pay-detail__checkbox'
                                                            name='maintenance'
                                                            onChange={e => russiaCalcSetData(e)}
                                                        />
                                                        <span className='pay-detail__checkbox-span'/>
                                                    </div>
                                                </label>
                                                <label className='pay-detail__label pay-detail__checkbox-label'>
                              <span className='pay-detail__checkbox-text'>
                                Содержание иного общего имущества
                              </span>
                                                    <div className='pay-detail__checkbox-wrapper'>
                                                        <input
                                                            type='checkbox'
                                                            className='pay-detail__checkbox'
                                                            name='maintenance__other-common__property'
                                                            onChange={e => russiaCalcSetData(e)}
                                                        />
                                                        <span className='pay-detail__checkbox-span'/>
                                                    </div>
                                                </label>
                                                <label className='pay-detail__label pay-detail__checkbox-label'>
                              <span className='pay-detail__checkbox-text'>
                                Работы по содержанию придомовой территории
                                (санитарное содержание и благоустройство)
                              </span>
                                                    <div className='pay-detail__checkbox-wrapper'>
                                                        <input
                                                            type='checkbox'
                                                            className='pay-detail__checkbox'
                                                            name='works__maintenance-adjacent__territory'
                                                            onChange={e => russiaCalcSetData(e)}
                                                        />
                                                        <span className='pay-detail__checkbox-span'/>
                                                    </div>
                                                </label>
                                            </div>
                                        </div>
                                        <button className='pay-detail__btn' name='detalisation__btn' type='submit'>
                                            РАСЧЁТ
                                        </button>
                                    </form>
                                ) : (
                                    <form className='pay-detail__form' onSubmit={handleSubmit(fetchOrelCalc)}>
                                        <div className='wrapper-switch__2'>
                                            <div className='pay-detail__input-wrapper'>
                                                <label className='pay-detail__label'>
                                                    Адрес
                                                    <AddressSuggestions
                                                        token={DADATA_TOKEN}
                                                        id='address'
                                                        type='text'
                                                        className='pay-detail__input address'
                                                        name='address'
                                                        placeholder='Введите адрес'
                                                        selectOnBlur={true}
                                                        inputProps={{required: true}}
                                                        // filterLocations={{region: "Орловская"}}
                                                        value={orelCalcAddress}
                                                        onChange={setOrelCalcAddress}
                                                        required
                                                    />
                                                </label>
                                                <label className='pay-detail__label'>
                                                    Количество квартир(комнат)
                                                    <input
                                                        type='number'
                                                        className='pay-detail__input'
                                                        name='apartments'
                                                        min='0'
                                                        step='1'
                                                        onChange={e => orelCalcSetData(e)}
                                                        required
                                                    />
                                                </label>
                                                <label className='pay-detail__label'>
                                                    Площадь МКД общая
                                                    <input
                                                        type='number'
                                                        className='pay-detail__input'
                                                        name='square__mkd'
                                                        min='0'
                                                        step='0.01'
                                                        onChange={e => orelCalcSetData(e)}
                                                        required
                                                    />
                                                </label>
                                                <label className='pay-detail__label'>
                                                    Площадь жилых помещений
                                                    <input
                                                        type='number'
                                                        className='pay-detail__input'
                                                        name='square__resid'
                                                        min='0'
                                                        step='0.01'
                                                        onChange={e => orelCalcSetData(e)}
                                                        required
                                                    />
                                                </label>
                                                <label className='pay-detail__label'>
                                                    Площадь нежилых помещений
                                                    <input
                                                        type='number'
                                                        className='pay-detail__input'
                                                        name='square__nonresid'
                                                        min='0'
                                                        step='0.01'
                                                        onChange={e => orelCalcSetData(e)}
                                                        required
                                                    />
                                                </label>
                                                <label className='pay-detail__label'>
                                                    Этажность
                                                    <input
                                                        type='number'
                                                        className='pay-detail__input'
                                                        name='number__offloor'
                                                        min='0'
                                                        step='1'
                                                        onChange={e => orelCalcSetData(e)}
                                                        required
                                                    />
                                                </label>
                                                <label className='pay-detail__label'>
                                                    Год ввода в эксплуатацию
                                                    <input
                                                        type='number'
                                                        className='pay-detail__input'
                                                        name='year__ofcommissioning'
                                                        min='1900'
                                                        max='2022'
                                                        step='1'
                                                        onChange={e => orelCalcSetData(e)}
                                                        required
                                                    />
                                                </label>
                                                <div className='pay-detail__walltype-wrapper'>
                                                    <label className='pay-detail__label'>
                                                        Типы стен
                                                        <select
                                                            multiplename='pay-detail__walltype-select'
                                                            className='pay-detail__walltype-select'
                                                            name='type__ofwall'
                                                            onChange={e => orelCalcSetData(e)}
                                                        >
                                                            <option value='1'>Монолитные или кирпичные</option>
                                                            <option value='1.25'>Железобетонные</option>
                                                            <option value='1.5'>Из прочих материалов</option>
                                                        </select>
                                                    </label>
                                                </div>
                                            </div>
                                            <p className='pay-detail__equipment-title'>
                                                Оборудование и благоустройство (отметить)
                                            </p>
                                            <div className='pay-detail__equipment-wrapper'>
                                                <label className='pay-detail__label pay-detail__checkbox-label'>
                                                  <span className='pay-detail__checkbox-text'>
                                                    Подвал
                                                  </span>
                                                    <div className='pay-detail__checkbox-wrapper'>
                                                        <input
                                                            type='checkbox'
                                                            className='pay-detail__checkbox'
                                                            name='basement'
                                                            onChange={e => orelCalcSetData(e)}
                                                        />
                                                        <span className='pay-detail__checkbox-span'/>
                                                    </div>
                                                </label>
                                                <label className='pay-detail__label pay-detail__checkbox-label'>
                                                  <span className='pay-detail__checkbox-text'>
                                                    Холодное водоснабжение
                                                  </span>
                                                    <div className='pay-detail__checkbox-wrapper'>
                                                        <input
                                                            type='checkbox'
                                                            className='pay-detail__checkbox'
                                                            name='cold__watersupply'
                                                            onChange={e => orelCalcSetData(e)}
                                                        />
                                                        <span className='pay-detail__checkbox-span'/>
                                                    </div>
                                                </label>
                                                <label className='pay-detail__label pay-detail__checkbox-label'>
                                                  <span className='pay-detail__checkbox-text'>
                                                    Центральное отопление
                                                  </span>
                                                    <div className='pay-detail__checkbox-wrapper'>
                                                        <input
                                                            type='checkbox'
                                                            className='pay-detail__checkbox'
                                                            name='central__heating'
                                                            onChange={e => orelCalcSetData(e)}
                                                        />
                                                        <span className='pay-detail__checkbox-span'/>
                                                    </div>
                                                </label>
                                                <label className='pay-detail__label pay-detail__checkbox-label'>
                                                  <span className='pay-detail__checkbox-text'>
                                                    Водоотведение
                                                  </span>
                                                    <div className='pay-detail__checkbox-wrapper'>
                                                        <input
                                                            type='checkbox'
                                                            className='pay-detail__checkbox'
                                                            name='drainage'
                                                            onChange={e => orelCalcSetData(e)}
                                                        />
                                                        <span className='pay-detail__checkbox-span'/>
                                                    </div>
                                                </label>
                                                <label className='pay-detail__label pay-detail__checkbox-label'>
                              <span className='pay-detail__checkbox-text'>
                                Горячее водоснабжение
                              </span>
                                                    <div className='pay-detail__checkbox-wrapper'>
                                                        <input
                                                            type='checkbox'
                                                            className='pay-detail__checkbox'
                                                            name='hot__watersupply'
                                                            onChange={e => orelCalcSetData(e)}
                                                        />
                                                        <span className='pay-detail__checkbox-span'/>
                                                    </div>
                                                </label>
                                                <label className='pay-detail__label pay-detail__checkbox-label'>
                              <span className='pay-detail__checkbox-text'>
                                Газоснабжение
                              </span>
                                                    <div className='pay-detail__checkbox-wrapper'>
                                                        <input
                                                            type='checkbox'
                                                            className='pay-detail__checkbox'
                                                            name='gas__supply'
                                                            onChange={e => orelCalcSetData(e)}
                                                        />
                                                        <span className='pay-detail__checkbox-span'/>
                                                    </div>
                                                </label>
                                                <label className='pay-detail__label pay-detail__checkbox-label'>
                              <span className='pay-detail__checkbox-text'>
                                Лифты
                              </span>
                                                    <div className='pay-detail__checkbox-wrapper'>
                                                        <input
                                                            type='checkbox'
                                                            className='pay-detail__checkbox'
                                                            name='elevators'
                                                            onChange={e => orelCalcSetData(e)}
                                                        />
                                                        <span className='pay-detail__checkbox-span'/>
                                                    </div>
                                                </label>
                                                <label className='pay-detail__label pay-detail__checkbox-label'>
                              <span className='pay-detail__checkbox-text'>
                                Мусоропровод
                              </span>
                                                    <div className='pay-detail__checkbox-wrapper'>
                                                        <input
                                                            type='checkbox'
                                                            className='pay-detail__checkbox'
                                                            name='garbage__chute'
                                                            onChange={e => orelCalcSetData(e)}
                                                        />
                                                        <span className='pay-detail__checkbox-span'/>
                                                    </div>
                                                </label>
                                                <label className='pay-detail__label pay-detail__checkbox-label'>
                              <span className='pay-detail__checkbox-text'>
                                Локальная котельная
                              </span>
                                                    <div className='pay-detail__checkbox-wrapper'>
                                                        <input
                                                            type='checkbox'
                                                            className='pay-detail__checkbox'
                                                            name='local__boilerhouse'
                                                            onChange={e => orelCalcSetData(e)}
                                                        />
                                                        <span className='pay-detail__checkbox-span'/>
                                                    </div>
                                                </label>
                                                <label className='pay-detail__label pay-detail__checkbox-label'>
                              <span className='pay-detail__checkbox-text'>
                                Внутридомовой бойлер
                              </span>
                                                    <div className='pay-detail__checkbox-wrapper'>
                                                        <input
                                                            type='checkbox'
                                                            className='pay-detail__checkbox'
                                                            name='domestic__boiler'
                                                            onChange={e => orelCalcSetData(e)}
                                                        />
                                                        <span className='pay-detail__checkbox-span'/>
                                                    </div>
                                                </label>
                                                <label className='pay-detail__label pay-detail__checkbox-label'>
                              <span className='pay-detail__checkbox-text'>
                                Детская и/или спортивная площадка
                              </span>
                                                    <div className='pay-detail__checkbox-wrapper'>
                                                        <input
                                                            type='checkbox'
                                                            className='pay-detail__checkbox'
                                                            name='playground'
                                                            onChange={e => orelCalcSetData(e)}
                                                        />
                                                        <span className='pay-detail__checkbox-span'/>
                                                    </div>
                                                </label>
                                                <label className='pay-detail__label pay-detail__checkbox-label'>
                              <span className='pay-detail__checkbox-text'>
                                Внутридомовые рециркуляционные насосы горячего
                                водоснабжения
                              </span>
                                                    <div className='pay-detail__checkbox-wrapper'>
                                                        <input
                                                            type='checkbox'
                                                            className='pay-detail__checkbox'
                                                            name='hot__water-pumps'
                                                            onChange={e => orelCalcSetData(e)}
                                                        />
                                                        <span className='pay-detail__checkbox-span'/>
                                                    </div>
                                                </label>
                                                <label className='pay-detail__label pay-detail__checkbox-label'>
                              <span className='pay-detail__checkbox-text'>
                                Внутридомовая пожарная или пожарно-охранная
                                сигнализация
                              </span>
                                                    <div className='pay-detail__checkbox-wrapper'>
                                                        <input
                                                            type='checkbox'
                                                            className='pay-detail__checkbox'
                                                            name='fire__alarm'
                                                            onChange={e => orelCalcSetData(e)}
                                                        />
                                                        <span className='pay-detail__checkbox-span'/>
                                                    </div>
                                                </label>
                                                <label className='pay-detail__label pay-detail__checkbox-label'>
                              <span className='pay-detail__checkbox-text'>
                                Внутридомовая автоматизированная система
                                коммерческого учета электроэнергии и (или)
                                теплоснабжения и (или) горячего водоснабжения и
                                (или) холодного водоснабжения
                              </span>
                                                    <div className='pay-detail__checkbox-wrapper'>
                                                        <input
                                                            type='checkbox'
                                                            className='pay-detail__checkbox'
                                                            name='water__supply-metering__system'
                                                            onChange={e => orelCalcSetData(e)}
                                                        />
                                                        <span className='pay-detail__checkbox-span'/>
                                                    </div>
                                                </label>
                                                <label className='pay-detail__label pay-detail__checkbox-label'>
                              <span className='pay-detail__checkbox-text'>
                                Узел(узлы) учета и (или) система автоматического
                                регулирования (АСКУЭ)
                              </span>
                                                    <div className='pay-detail__checkbox-wrapper'>
                                                        <input
                                                            type='checkbox'
                                                            className='pay-detail__checkbox'
                                                            name='automatic__control-system'
                                                            onChange={e => orelCalcSetData(e)}
                                                        />
                                                        <span className='pay-detail__checkbox-span'/>
                                                    </div>
                                                </label>
                                                <label className='pay-detail__label pay-detail__checkbox-label'>
                              <span className='pay-detail__checkbox-text'>
                                Уборка лестничных клеток
                              </span>
                                                    <div className='pay-detail__checkbox-wrapper'>
                                                        <input
                                                            type='checkbox'
                                                            className='pay-detail__checkbox'
                                                            name='staircase__cleaning'
                                                            onChange={e => orelCalcSetData(e)}
                                                        />
                                                        <span className='pay-detail__checkbox-span'/>
                                                    </div>
                                                </label>
                                            </div>
                                        </div>
                                        <button className='pay-detail__btn' name='detalisation__btn' type='submit'>
                                            РАСЧЁТ
                                        </button>
                                    </form>
                                )}
                                {switchID === 'Orel' && (
                                    <>
                                        <br/>
                                        {orelCalcTab.length !== 0 && (
                                            <>
                                                <table className='base-table detalisation-table' id="orel_detail_table">
                                                    <thead className='base-table__head'>
                                                    <tr>
                                                        <th scope='col' colSpan='2'>
                                                            Адрес: {orelCalcAddress.value}
                                                        </th>
                                                        <th scope='col'>
                                                            Размер платы: {orelCalcTab.board_size.toFixed(3)}
                                                        </th>
                                                        <th colSpan='2' scope='col'>
                                                            Дата: {String(today.getDate()).padStart(2, '0')}
                                                            .{String(today.getMonth() + 1).padStart(2, '0')}
                                                            .{today.getFullYear()}
                                                        </th>
                                                    </tr>
                                                    <tr>
                                                        <th rowSpan='2' scope='col'>
                                                            № п/п
                                                        </th>
                                                        <th rowSpan='2' scope='col'>
                                                            Наименование работ и услуг
                                                        </th>
                                                        <th rowSpan='2' scope='col'>
                                                            Cтоимость работ (услуг) по содержанию общего
                                                            имущества на 1 кв.м
                                                        </th>
                                                        <th colSpan='2' scope='col'>
                                                            Начислено
                                                        </th>
                                                    </tr>
                                                    <tr className='monthyear'>
                                                        <th scope='col'>Месяц</th>
                                                        <th scope='col'>Год</th>
                                                    </tr>
                                                    </thead>
                                                    <tbody className='base-table__body'>
                                                    {orelCalcTab.data.map((array, index) => {
                                                        let change = false
                                                        if (changeTable) {
                                                            if (array.name.startsWith("1.1.")) {
                                                                change = true
                                                            }
                                                            if (array.name.startsWith("2.1.")) {
                                                                change = true
                                                            }
                                                            if (array.name.startsWith("2.2.")) {
                                                                change = true
                                                            }
                                                            if (array.name.startsWith("2.3.")) {
                                                                change = true
                                                            }
                                                            if (array.name.startsWith("2.4.")) {
                                                                change = true
                                                            }
                                                        }
                                                        return (
                                                            <tr>
                                                                <th scope='row'>{array.category}</th>
                                                                <td>{array.name}</td>
                                                                <td>
                                                                    {change ? (
                                                                        <input
                                                                            type='number'
                                                                            className='pay-detail__input'
                                                                            name={index}
                                                                            min='0'
                                                                            step='0.001'
                                                                            placeholder={parseFloat(array.v1).toFixed(3)}
                                                                            onChange={e => changeTableData(e)}
                                                                        />
                                                                    ) : (
                                                                        parseFloat(array.v1).toFixed(3)
                                                                    )}
                                                                </td>
                                                                <td>{parseFloat(array.v2).toFixed(2)}</td>
                                                                <td>{parseFloat(array.v3).toFixed(2)}</td>
                                                            </tr>
                                                        );
                                                    })}
                                                    <tr>
                                                        <th scope='row'>Итого</th>
                                                        <td/>
                                                        <td>{orelCalcTab.board_size.toFixed(3)}</td>
                                                        <td>
                                                            {(orelCalcTab.board_size * orelCalcData["square__resid"]).toFixed(2)}
                                                        </td>
                                                        <td>
                                                            {(orelCalcTab.board_size * orelCalcData["square__resid"] * 12).toFixed(2)}
                                                        </td>
                                                    </tr>
                                                    </tbody>
                                                </table>
                                                <br/>
                                                <div className="main__undertable-buttons">
                                                    <button className='pay-detail__btn' name='detalisation__btn'
                                                            onClick={() => (
                                                                setChangeTable(!changeTable), calcSumTabOrel()
                                                            )}>
                                                        {changeTable ? (
                                                            "Сохранить изменения"
                                                        ) : (
                                                            "Изменить таблицу"
                                                        )}
                                                    </button>
                                                    <button className='pay-detail__btn' name='detalisation__btn'
                                                            onClick={handleSubmit(fetchOrelCalcExcel)}>
                                                        Сохранить в формате Excel
                                                    </button>
                                                    <button className='pay-detail__btn' name='detalisation__btn'
                                                            onClick={handleSubmit(fetchOrelCalcDB)}>
                                                        Сохранить в базу данных
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </>
                                )}

                                {switchID === 'Russia' && (
                                    <>
                                        <br/>
                                        {russiaCalcTab.length !== 0 && (
                                            <>
                                                <table className='base-table detalisation-table'>
                                                    <thead className='base-table__head'>
                                                    <tr>
                                                        <th scope='col'>
                                                            Адрес: {russiaCalcData["address"]}
                                                        </th>
                                                        <th scope='col'>
                                                            Размер платы: {russiaCalcTab.board_size}
                                                        </th>
                                                        <th colSpan='2' scope='col'>
                                                            Дата: {String(today.getDate()).padStart(2, '0')}
                                                            .{String(today.getMonth() + 1).padStart(2, '0')}
                                                            .{today.getFullYear()}
                                                        </th>
                                                    </tr>
                                                    <tr>
                                                        <th rowSpan='2' scope='col'>
                                                            Наименование работ и услуг
                                                        </th>
                                                        <th rowSpan='2' scope='col'>
                                                            Cтоимость работ (услуг) по содержанию общего
                                                            имущества на 1 кв.м
                                                        </th>
                                                        <th colSpan='2' scope='col'>
                                                            Периодичность
                                                        </th>
                                                    </tr>
                                                    </thead>
                                                    <tbody className='base-table__body'>
                                                    {russiaCalcTab.data.map((array, index) => {
                                                        return (
                                                            <tr>
                                                                <th scope='row'>{array[0]}</th>
                                                                <td>{array[2]}</td>
                                                                <td>{array[3]}</td>
                                                            </tr>
                                                        );
                                                    })}
                                                    </tbody>
                                                </table>
                                                <br/>
                                                <button className='pay-detail__btn' name='detalisation__btn'
                                                        onClick={handleSubmit(fetchRussiaCalcExcel)}>
                                                    Сохранить в формате Excel
                                                </button>
                                                <button className='pay-detail__btn' name='detalisation__btn'
                                                        onClick={handleSubmit(fetchRussiaCalcDB)}>
                                                    Сохранить в базу данных
                                                </button>
                                            </>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* <!-----Content-2----------------------------------------------------> */}

                    <div
                        className={
                            'tabs__content-item ' +
                            (activeID === 'tabs-top__2' ? 'tabs__content-item--active' : '')
                        }
                        id='tab-2'
                    >
                        <div className='pay-detail'>
                            <form className='pay-detail__form' onSubmit={handleSubmit(fetchOrelDetail)}>
                                <div className='pay-detail__input-wrapper'>
                                    <label className='pay-detail__label'>
                                        Адрес
                                        <AddressSuggestions
                                            token={DADATA_TOKEN}
                                            type='text'
                                            id='address'
                                            className='pay-detail__input address'
                                            name='address'
                                            placeholder='Введите адрес'
                                            value={orelDetailAddress}
                                            onChange={setOrelDetailAddress}
                                            required
                                        />
                                    </label>
                                    <label className='pay-detail__label'>
                                        Размер платы
                                        <input
                                            type='number'
                                            className='pay-detail__input'
                                            name='board__size'
                                            min='0'
                                            step='0.01'
                                            onChange={e => orelDetailSetData(e)}
                                        />
                                    </label>
                                    <label className='pay-detail__label'>
                                        Площадь МКД общая
                                        <input
                                            type='number'
                                            className='pay-detail__input'
                                            name='square__mkd'
                                            min='0'
                                            step='0.01'
                                            onChange={e => orelDetailSetData(e)}
                                        />
                                    </label>
                                    <label className='pay-detail__label'>
                                        Площадь жилых помещений
                                        <input
                                            type='number'
                                            className='pay-detail__input'
                                            name='square__resid'
                                            min='0'
                                            step='0.01'
                                            onChange={e => orelDetailSetData(e)}
                                        />
                                    </label>
                                    <label className='pay-detail__label'>
                                        Площадь нежилых помещений
                                        <input
                                            type='number'
                                            className='pay-detail__input'
                                            name='square__nonresid'
                                            min='0'
                                            step='0.01'
                                            onChange={e => orelDetailSetData(e)}
                                        />
                                    </label>
                                    <label className='pay-detail__label'>
                                        Этажность
                                        <input
                                            type='number'
                                            className='pay-detail__input'
                                            name='number__offloor'
                                            min='0'
                                            step='1'
                                            onChange={e => orelDetailSetData(e)}
                                        />
                                    </label>
                                    <label className='pay-detail__label'>
                                        Год ввода в эксплуатацию
                                        <input
                                            type='number'
                                            className='pay-detail__input'
                                            name='year__ofcommissioning'
                                            min='1900'
                                            max='2022'
                                            step='1'
                                            onChange={e => orelDetailSetData(e)}
                                        />
                                    </label>
                                    <div className='pay-detail__walltype-wrapper'>
                                        <label className='pay-detail__label'>
                                            Типы стен
                                            <select
                                                multiplename='pay-detail__walltype-select'
                                                className='pay-detail__walltype-select'
                                                name='type__ofwall'
                                                onChange={e => orelDetailSetData(e)}
                                            >
                                                <option value='1'>Монолитные или кирпичные</option>
                                                <option value='1.25'>Железобетонные</option>
                                                <option value='1.5'>Из прочих материалов</option>
                                            </select>
                                        </label>
                                    </div>
                                </div>
                                <p className='pay-detail__equipment-title'>
                                    Оборудование и благоустройство (отметить)
                                </p>
                                <div className='pay-detail__equipment-wrapper'>
                                    <label className='pay-detail__label pay-detail__checkbox-label'>
                    <span className='pay-detail__checkbox-text'>
                      Холодное водоснабжение
                    </span>
                                        <div className='pay-detail__checkbox-wrapper'>
                                            <input
                                                type='checkbox'
                                                className='pay-detail__checkbox'
                                                name='cold__watersupply'
                                                onChange={e => orelDetailSetData(e)}
                                            />
                                            <span className='pay-detail__checkbox-span'/>
                                        </div>
                                    </label>
                                    <label className='pay-detail__label pay-detail__checkbox-label'>
                    <span className='pay-detail__checkbox-text'>
                      Центральное отопление
                    </span>
                                        <div className='pay-detail__checkbox-wrapper'>
                                            <input
                                                type='checkbox'
                                                className='pay-detail__checkbox'
                                                name='central__heating'
                                                onChange={e => orelDetailSetData(e)}
                                            />
                                            <span className='pay-detail__checkbox-span'/>
                                        </div>
                                    </label>
                                    <label className='pay-detail__label pay-detail__checkbox-label'>
                    <span className='pay-detail__checkbox-text'>
                      Водоотведение
                    </span>
                                        <div className='pay-detail__checkbox-wrapper'>
                                            <input
                                                type='checkbox'
                                                className='pay-detail__checkbox'
                                                name='drainage'
                                                onChange={e => orelDetailSetData(e)}
                                            />
                                            <span className='pay-detail__checkbox-span'/>
                                        </div>
                                    </label>
                                    <label className='pay-detail__label pay-detail__checkbox-label'>
                    <span className='pay-detail__checkbox-text'>
                      Горячее водоснабжение
                    </span>
                                        <div className='pay-detail__checkbox-wrapper'>
                                            <input
                                                type='checkbox'
                                                className='pay-detail__checkbox'
                                                name='hot__watersupply'
                                                onChange={e => orelDetailSetData(e)}
                                            />
                                            <span className='pay-detail__checkbox-span'/>
                                        </div>
                                    </label>
                                    <label className='pay-detail__label pay-detail__checkbox-label'>
                    <span className='pay-detail__checkbox-text'>
                      Газоснабжение
                    </span>
                                        <div className='pay-detail__checkbox-wrapper'>
                                            <input
                                                type='checkbox'
                                                className='pay-detail__checkbox'
                                                name='gas__supply'
                                                onChange={e => orelDetailSetData(e)}
                                            />
                                            <span className='pay-detail__checkbox-span'/>
                                        </div>
                                    </label>
                                    <label className='pay-detail__label pay-detail__checkbox-label'>
                                        <span className='pay-detail__checkbox-text'>Лифты</span>
                                        <div className='pay-detail__checkbox-wrapper'>
                                            <input
                                                type='checkbox'
                                                className='pay-detail__checkbox'
                                                name='elevators'
                                                onChange={e => orelDetailSetData(e)}
                                            />
                                            <span className='pay-detail__checkbox-span'/>
                                        </div>
                                    </label>
                                    <label className='pay-detail__label pay-detail__checkbox-label'>
                    <span className='pay-detail__checkbox-text'>
                      Мусоропровод
                    </span>
                                        <div className='pay-detail__checkbox-wrapper'>
                                            <input
                                                type='checkbox'
                                                className='pay-detail__checkbox'
                                                name='garbage__chute'
                                                onChange={e => orelDetailSetData(e)}
                                            />
                                            <span className='pay-detail__checkbox-span'/>
                                        </div>
                                    </label>
                                    <label className='pay-detail__label pay-detail__checkbox-label'>
                    <span className='pay-detail__checkbox-text'>
                      Локальная котельня
                    </span>
                                        <div className='pay-detail__checkbox-wrapper'>
                                            <input
                                                type='checkbox'
                                                className='pay-detail__checkbox'
                                                name='local__boilerhouse'
                                                onChange={e => orelDetailSetData(e)}
                                            />
                                            <span className='pay-detail__checkbox-span'/>
                                        </div>
                                    </label>
                                    <label className='pay-detail__label pay-detail__checkbox-label'>
                    <span className='pay-detail__checkbox-text'>
                      Внутридомовой бойлер
                    </span>
                                        <div className='pay-detail__checkbox-wrapper'>
                                            <input
                                                type='checkbox'
                                                className='pay-detail__checkbox'
                                                name='domestic__boiler'
                                                onChange={e => orelDetailSetData(e)}
                                            />
                                            <span className='pay-detail__checkbox-span'/>
                                        </div>
                                    </label>
                                    <label className='pay-detail__label pay-detail__checkbox-label'>
                    <span className='pay-detail__checkbox-text'>
                      Детская и/или спортивная площадка
                    </span>
                                        <div className='pay-detail__checkbox-wrapper'>
                                            <input
                                                type='checkbox'
                                                className='pay-detail__checkbox'
                                                name='playground'
                                                onChange={e => orelDetailSetData(e)}
                                            />
                                            <span className='pay-detail__checkbox-span'/>
                                        </div>
                                    </label>
                                    <label className='pay-detail__label pay-detail__checkbox-label'>
                    <span className='pay-detail__checkbox-text'>
                      Внутридомовые рециркуляционные насосы горячего
                      водоснабжения
                    </span>
                                        <div className='pay-detail__checkbox-wrapper'>
                                            <input
                                                type='checkbox'
                                                className='pay-detail__checkbox'
                                                name='hot__water-pumps'
                                                onChange={e => orelDetailSetData(e)}
                                            />
                                            <span className='pay-detail__checkbox-span'/>
                                        </div>
                                    </label>
                                    <label className='pay-detail__label pay-detail__checkbox-label'>
                    <span className='pay-detail__checkbox-text'>
                      Внутридомовая пожарная или пожарно-охранная сигнализация
                    </span>
                                        <div className='pay-detail__checkbox-wrapper'>
                                            <input
                                                type='checkbox'
                                                className='pay-detail__checkbox'
                                                name='fire__alarm'
                                                onChange={e => orelDetailSetData(e)}
                                            />
                                            <span className='pay-detail__checkbox-span'/>
                                        </div>
                                    </label>
                                    <label className='pay-detail__label pay-detail__checkbox-label'>
                    <span className='pay-detail__checkbox-text'>
                      Внутридомовая автоматизированная система коммерческого
                      учета электроэнергии и (или) теплоснабжения и (или)
                      горячего водоснабжения и (или) холодного водоснабжения
                    </span>
                                        <div className='pay-detail__checkbox-wrapper'>
                                            <input
                                                type='checkbox'
                                                className='pay-detail__checkbox'
                                                name='water__supply-metering__system'
                                                onChange={e => orelDetailSetData(e)}
                                            />
                                            <span className='pay-detail__checkbox-span'/>
                                        </div>
                                    </label>
                                    <label className='pay-detail__label pay-detail__checkbox-label'>
                    <span className='pay-detail__checkbox-text'>
                      Узел(узлы) учета и (или) система автоматического
                      регулирования (АСКУЭ)
                    </span>
                                        <div className='pay-detail__checkbox-wrapper'>
                                            <input
                                                type='checkbox'
                                                className='pay-detail__checkbox'
                                                name='automatic__control-system'
                                                onChange={e => orelDetailSetData(e)}
                                            />
                                            <span className='pay-detail__checkbox-span'/>
                                        </div>
                                    </label>
                                    <label className='pay-detail__label pay-detail__checkbox-label'>
                    <span className='pay-detail__checkbox-text'>
                      Уборка лестничных клеток
                    </span>
                                        <div className='pay-detail__checkbox-wrapper'>
                                            <input
                                                type='checkbox'
                                                className='pay-detail__checkbox'
                                                name='staircase__cleaning'
                                                onChange={e => orelDetailSetData(e)}
                                            />
                                            <span className='pay-detail__checkbox-span'/>
                                        </div>
                                    </label>
                                </div>
                                <button className='pay-detail__btn' name='detalisation__btn'>
                                    ДЕТАЛИЗАЦИЯ
                                </button>
                            </form>
                            {orelDetailTab.length !== 0 && (
                                <>
                                    <br/>
                                    <table className='base-table detalisation-table'>
                                        <thead className='base-table__head'>
                                        <tr>
                                            <th scope='col' colSpan='2'>
                                                Адрес: {orelDetailAddress.value}
                                            </th>
                                            <th scope='col'>
                                                Размер платы: {orelDetailTab["board_size"]}
                                            </th>
                                            <th colSpan='2' scope='col'>
                                                Дата: {String(today.getDate()).padStart(2, '0')}
                                                .{String(today.getMonth() + 1).padStart(2, '0')}
                                                .{today.getFullYear()}
                                            </th>
                                        </tr>
                                        <tr>
                                            <th rowSpan='2' scope='col'>
                                                № п/п
                                            </th>
                                            <th rowSpan='2' scope='col'>
                                                Наименование работ и услуг
                                            </th>
                                            <th rowSpan='2' scope='col'>
                                                Cтоимость работ (услуг) по содержанию общего
                                                имущества на 1 кв.м
                                            </th>
                                            <th colSpan='2' scope='col'>
                                                Начислено
                                            </th>
                                        </tr>
                                        <tr className='monthyear'>
                                            <th scope='col'>Месяц</th>
                                            <th scope='col'>Год</th>
                                        </tr>
                                        </thead>
                                        <tbody className='base-table__body'>
                                        {orelDetailTab.data.map((array, index) => {
                                            return (
                                                <tr>
                                                    <th scope='row'>{array.category}</th>
                                                    <td>{array.name}</td>
                                                    <td>{array.v1}</td>
                                                    <td>{array.v2}</td>
                                                    <td>{array.v3}</td>
                                                </tr>
                                            );
                                        })}
                                        <tr>
                                            <th scope='row'>Итого</th>
                                            <td/>
                                            <td>{orelDetailTab["board_size"].toFixed(3)}</td>
                                            <td>
                                                {(orelDetailTab["board_size"] * orelDetailData["square__resid"]).toFixed(2)}
                                            </td>
                                            <td>
                                                {(orelDetailTab["board_size"] * orelDetailData["square__resid"] * 12).toFixed(2)}
                                            </td>
                                        </tr>
                                        </tbody>
                                    </table>
                                    <br/>
                                    <button className='pay-detail__btn' name='detalisation__btn'
                                            onClick={handleSubmit(fetchOrelDetailExcel)}>
                                        Сохранить в формате Excel
                                    </button>
                                    <button className='pay-detail__btn' name='detalisation__btn'
                                            onClick={handleSubmit(fetchOrelDetailDB)}>
                                        Сохранить в базу данных
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    {/* <!------------Content-3-------------------------------------------------------------> */}

                    <div
                        className={
                            'tabs__content-item tabs__content-item__table ' +
                            (activeID === 'tabs-top__3' ? 'tabs__content-item--active' : '')
                        }
                        id='tab-3'
                    >
                        {calcDetailData.length !== 0 ? (
                            <table className='base-table'>
                                <thead className='base-table__head'>
                                <tr>
                                    <th scope='col'>№</th>
                                    <th scope='col'>Тип расчета/детализации</th>
                                    <th scope='col'>Адрес</th>
                                    <th scope='col'>Дата</th>
                                    <th scope='col'>Подробнее</th>
                                </tr>
                                </thead>
                                <tbody className='base-table__body'>
                                {calcDetailData.map((item, index) => {
                                    return (
                                        <tr>
                                            <th scope='row'>{index + 1}</th>
                                            <td>{item.type}</td>
                                            <td>{item.address}</td>
                                            <td>{item.date}</td>
                                            <td>
                                                <a className='base-table__body-link' href='#'>
                                                    <svg
                                                        width='24'
                                                        height='24'
                                                        viewBox='0 0 24 24'
                                                        fill='none'
                                                        xmlns='http://www.w3.org/2000/svg'
                                                    >
                                                        <path
                                                            d='M7 14C8.10457 14 9 13.1046 9 12C9 10.8954 8.10457 10 7 10C5.89543 10 5 10.8954 5 12C5 13.1046 5.89543 14 7 14Z'
                                                            fill='#000'
                                                        />
                                                        <path
                                                            d='M14 12C14 13.1046 13.1046 14 12 14C10.8954 14 10 13.1046 10 12C10 10.8954 10.8954 10 12 10C13.1046 10 14 10.8954 14 12Z'
                                                            fill='#000'
                                                        />
                                                        <path
                                                            d='M17 14C18.1046 14 19 13.1046 19 12C19 10.8954 18.1046 10 17 10C15.8954 10 15 10.8954 15 12C15 13.1046 15.8954 14 17 14Z'
                                                            fill='#000'
                                                        />
                                                        <path
                                                            fillRule='evenodd'
                                                            clipRule='evenodd'
                                                            d='M24 12C24 18.6274 18.6274 24 12 24C5.37258 24 0 18.6274 0 12C0 5.37258 5.37258 0 12 0C18.6274 0 24 5.37258 24 12ZM22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z'
                                                            fill='#000'
                                                        />
                                                    </svg>
                                                </a>
                                            </td>
                                        </tr>
                                    )
                                })}
                                </tbody>
                            </table>
                        ) : ""}

                    </div>
                </div>
            </section>
        </>
    );
}

export default Fare;
