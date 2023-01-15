import React, {useContext, useEffect, useState} from 'react';
import Layout from '../components/Layout';
import 'react-dadata/dist/react-dadata.css';
import {API_URL, DADATA_TOKEN} from '../config';
import AuthContext from '../context/AuthContext';
import {useForm} from 'react-hook-form';
import {AddressSuggestions} from "react-dadata";
import {saveAs} from 'file-saver';

const Wear = () => {
    // Проверка авторизации пользователя
    let {authTokens, logoutUser} = useContext(AuthContext);

    // Получаем данные о профиле
    let [profile, setProfile] = useState('');

    useEffect(() => {
        getProfile();
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
        } else if (data['detail'] === 'Учетные данные не были предоставлены.') {
            logoutUser();
        } else {
            alert('Произошла непредвиденная ошибка');
        }
    };

    useEffect(() => {
        getWearDetailData();
    }, []);

    // Получение данных о всех расчетах износа
    let getWearDetailData = async () => {
        let response = await fetch(API_URL + '/wear', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + String(authTokens.access),
            },
        });
        let data = await response.json();

        if (response.status === 200) {
            setTab(data);
        } else if (data['detail'] === 'Учетные данные не были предоставлены.') {
            logoutUser();
        } else {
            alert('Произошла непредвиденная ошибка');
        }
    };

    // Контроллер формы
    const {handleSubmit} = useForm({mode: 'onBlur'});

    // Дата
    let today = new Date();

    // Контроллеры страницы
    const [activeID, setActiveId] = useState('tabs-top__1');

    // Переменный для отрисовки таблиц по расчетам
    const [tab, setTab] = useState([]);
    // Хуки типов домов (несколько[], итоговый())
    const [typeHouse, setTypeHouse] = useState([]);
    const [finalTypeHouse, setFinalTypeHouse] = useState();

    // Форма расчёта для определенения типа дома
    const [typeSelectorData, setTypeSelectorData] = useState({
        foundationSelect: 1,
        wallsSelect: 1,
        slabsSelect: 1,
        balconySelect: 0,
        roofSelect: 1,
        roofingSelect: 1,
        mansardType: 0,
    });
    // Адрес
    const [typeSelectorAddress, setTypeSelectorAddress] = useState('');
    // Получение необходимых полей для заполнения
    const [formData, setFormData] = useState([]);
    const [formDataEnginSyst, setFormDataEnginSyst] = useState([]);
    // Заполенные формы для расчетов
    const [formAll, setFormAll] = useState({});
    // Вычисление износа каждого элемента
    const [calculationsData, setCalculationsData] = useState({});
    // Расчет износа всего здания
    const [finalCalc, setFinalCalc] = useState(0);
    // Площадь элементов здания
    const [squareAll, setSquareAll] = useState(0);

    // Заполнение формы опредления типа дома
    const typeSelectorSetData = (e) => {
        let name = e.target.name;
        let value = e.target.value;
        if (value !== 'on') {
            setTypeSelectorData({...typeSelectorData, [name]: value});
        } else {
            if (typeSelectorData[name]) {
                setTypeSelectorData({...typeSelectorData, [name]: false});
            } else {
                setTypeSelectorData({...typeSelectorData, [name]: true});
            }
        }
    };
    // Заполнение форм расчета износа отдельноых элементов
    const formAllSetData = (e) => {
        let name = e.target.name;
        let value = e.target.value;
        setFormAll({...formAll, [name]: value});

    };

    // Получение возможных типов домов (0, 1 или >1)
    const fetchTypeSelector = async () => {
        let response = await fetch(API_URL + '/wear/type_selector', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + String(authTokens.access),
            },
            body: JSON.stringify(typeSelectorData),
        });

        let data = await response.json();

        if (data["data"].length === 0) {
            alert("Не удалось определить тип дома, повторите ввод")
        } else {
            if (response.status === 200) {
                setTypeHouse(data["data"]);
                setFinalTypeHouse(data["data"][0]["id"])
                setSquareAll(typeSelectorData["MaxVolume"])
            } else if (data['detail'] === 'Войдите заново в систему') {
                logoutUser();
            } else {
                alert(data['detail']);
            }
        }
    };
    // Скачивание списка для заполнения
    const fetchDownloadList = async () => {
        fetch(API_URL + '/wear/download_list', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + String(authTokens.access),
            },
            body: JSON.stringify({
                "finalSelect": finalTypeHouse
            }),
        })
            .then((res) => res.blob())
            .then((result) => saveAs(result, 'Данные для расчета износа ' + typeSelectorAddress.value + '.docx'))
            .catch((err) => console.log('error'));
    };
    // Получение названия вводимых полей для типа дома
    const fetchFormData = async () => {
        let response = await fetch(API_URL + '/wear/form_data', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + String(authTokens.access),
            },
            body: JSON.stringify({
                "finalSelect": finalTypeHouse
            }),
        });

        let data = await response.json();

        // if (data["data"].length === 0) {
        //     alert("Проверьте правильность ввода данных")
        // }

        if (response.status === 200) {
            setFormData(data);
        } else if (data['detail'] === 'Войдите заново в систему') {
            logoutUser();
        } else {
            alert(data['detail']);
        }

        let response1 = await fetch(API_URL + '/wear/form_data/engine', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + String(authTokens.access),
            },
            body: JSON.stringify({
                "finalSelect": finalTypeHouse
            }),
        });

        let data1 = await response1.json();

        // if (data["data"].length === 0) {
        //     alert("Проверьте правильность ввода данных")
        // }

        if (response.status === 200) {
            setFormDataEnginSyst(data1);
        } else if (data['detail'] === 'Войдите заново в систему') {
            logoutUser();
        } else {
            alert(data['detail']);
        }
    };
    // Расчет элементов
    const fetchCalculationsData = async (str) => {
        let response = await fetch(API_URL + '/wear/wear_calculation', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + String(authTokens.access),
            },
            body: JSON.stringify(formAll),
        });

        let data = await response.json();

        if (data["data"] === -1) {
            alert("Проверьте правильность ввода, сумма площадей элементов износа не должны быть больше площади элемента")
        } else {
            if (response.status === 200) {
                setFormAll({})
                setCalculationsData({...calculationsData, [str]: data.data})
                // setSquareAll(squareAll - formAll["elementVolume"])
            } else if (data['detail'] === 'Войдите заново в систему') {
                logoutUser();
            } else {
                alert(data['detail']);
            }
        }
    };
    // Получение возможных типов домов (0, 1 или >1)
    const fetchFinalCalc = async () => {
        let response = await fetch(API_URL + '/wear/final_calc', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + String(authTokens.access),
            },
            body: JSON.stringify({...formAll, ...typeSelectorData, finalSelect: finalTypeHouse, ...calculationsData}),
        });

        let data = await response.json();

        if (response.status === 200) {
            setFinalCalc(data["finalValue"]);
        } else if (data['detail'] === 'Войдите заново в систему') {
            logoutUser();
        } else {
            alert(data['detail']);
        }
    };
    // Сохранение данных расчета в БД
    const fetchSaveCalcDB = async () => {
        let response = await fetch(API_URL + '/wear', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + String(authTokens.access),
            },
            body: JSON.stringify({
                address: typeSelectorAddress.value,
                manage_org: profile[0]['manage_org'],
                calculation_data: {...formAll, ...typeSelectorData, finalSelect: finalTypeHouse, ...calculationsData},
                finalCalc: finalCalc,
                date: String(today.getDate()).padStart(2, '0') +
                    '.' +
                    String(today.getMonth() + 1).padStart(2, '0') +
                    '.' +
                    String(today.getFullYear())
            }),
        });

        let data = await response.json();

        if (response.status === 201) {
            alert("Данные успешно сохранены в базу данных");
        } else if (data['detail'] === 'Войдите заново в систему') {
            logoutUser();
        } else {
            alert(data['detail']);
        }
    };

    // Вывод формы заполнения для общих данных
    const formForWearCalc = (nameForArr, titleName, arrWear) => {
        return (
            <form
                className='pay-detail__form'
                onSubmit={handleSubmit(() => fetchCalculationsData(nameForArr))}
            >
                <label className='pay-detail__label'>
                    {titleName}
                    {(Object.keys(formAll).indexOf("elementVolume") !== -1) ? (
                        <>
                            {parseFloat(formAll["elementVolume"]) > squareAll ? (
                                <strong> Площадь элемента не может быть больше площади здания</strong>
                            ) : ('')}
                        </>
                    ) : (
                        ''
                    )}
                    <input
                        type='number'
                        className='pay-detail__input'
                        name="elementVolume"
                        min='0'
                        step='0.01'
                        max={squareAll}
                        onChange={(e) => formAllSetData(e)}
                        required
                    />
                </label>
                {formData[arrWear].map((item, index) => {
                    return (
                        <>
                            <p>{item}</p>
                            <div className='pay-detail__input-wrapper-wear'>
                                <label className='pay-detail__label-wear'>
                                    Площадь{(Object.keys(formAll).indexOf('elementS' + (index + 1)) !== -1) ? (
                                    <>
                                        {parseFloat(formAll['elementS' + (index + 1)]) > formAll["elementVolume"] ? (
                                            <strong> Площадь повреждения не может быть больше площади элемента</strong>
                                        ) : ('')}
                                    </>
                                ) : (
                                    ''
                                )}
                                    <input
                                        type='number'
                                        className='pay-detail__input'
                                        name={'elementS' + (index + 1)}
                                        min='0'
                                        step='0.01'
                                        max={(Object.keys(formAll).indexOf("elementVolume") !== -1) ? formAll["elementVolume"] : (typeSelectorData["MaxVolume"])}
                                        onChange={(e) => formAllSetData(e)}
                                        required
                                    />
                                </label>
                                <label className='pay-detail__label-wear'>
                                    Оценка износа элемента
                                    <input
                                        type='number'
                                        className='pay-detail__input'
                                        name={'elementL' + (index + 1)}
                                        min='0'
                                        max='100'
                                        step='0.01'
                                        onChange={(e) => formAllSetData(e)}
                                        required
                                    />
                                </label>
                            </div>
                        </>
                    )
                })}
                <div className='main__buttons'>
                    <button
                        className='pay-detail__btn'
                        name='detalisation__btn'
                        type='button'
                        onClick={removeStep}
                    >
                        Назад
                    </button>
                    <button
                        className='pay-detail__btn'
                        name='detalisation__btn'
                        type='submit'
                    >
                        Далее
                    </button>
                </div>
            </form>
        )
    }
    // Вывод формы заполнения для инжереных сетей
    const formForWearEnginCalc = (nameForArr, titleName, arrWear) => {
        return (
            <form
                className='pay-detail__form'
                onSubmit={handleSubmit(() => fetchCalculationsData(nameForArr))}
            >
                <label className='pay-detail__label'>
                    {titleName}
                    <input
                        type='number'
                        className='pay-detail__input'
                        name="elementVolume"
                        min='0'
                        step='0.01'
                        max={squareAll}
                        onChange={(e) => formAllSetData(e)}
                        required
                    />
                </label>
                {formDataEnginSyst[arrWear].map((item, index) => {
                    return (
                        <>
                            <p>{item}</p>
                            <div className='pay-detail__input-wrapper-wear'>
                                <label className='pay-detail__label-wear'>
                                    Площадь{(Object.keys(formAll).indexOf('elementS' + (index + 1)) !== -1) ? (
                                    <>
                                        {parseFloat(formAll['elementS' + (index + 1)]) > formAll["elementVolume"] ? (
                                            <strong> Площадь повреждения не может быть больше площади элемента</strong>
                                        ) : ('')}
                                    </>
                                ) : (
                                    ''
                                )}
                                    <input
                                        type='number'
                                        className='pay-detail__input'
                                        name={'elementS' + (index + 1)}
                                        min='0'
                                        max={(Object.keys(formAll).indexOf("elementVolume") !== -1) ? formAll["elementVolume"] : (typeSelectorData["MaxVolume"])}
                                        step='0.01'
                                        onChange={(e) => formAllSetData(e)}
                                        required
                                    />
                                </label>
                                <label className='pay-detail__label-wear'>
                                    Оценка износа элемента
                                    <input
                                        type='number'
                                        className='pay-detail__input'
                                        name={'elementL' + (index + 1)}
                                        min='0'
                                        max='100'
                                        step='0.01'
                                        onChange={(e) => formAllSetData(e)}
                                        required
                                    />
                                </label>
                            </div>
                        </>
                    )
                })}
                <div className='main__buttons'>
                    <button
                        className='pay-detail__btn'
                        name='detalisation__btn'
                        type='button'
                        onClick={removeStep}
                    >
                        Назад
                    </button>
                    <button
                        className='pay-detail__btn'
                        name='detalisation__btn'
                        type='submit'
                    >
                        Далее
                    </button>
                </div>
            </form>
        )
    }
    // Возвращение к прошлому шагу для заполнения форм общих данных и инженерных сетей
    const removeStep = () => {
        let dict = {...calculationsData}
        if (Object.keys(calculationsData).indexOf("garbage_wear") !== -1) {
            delete dict["garbage_wear"]
        } else if (Object.keys(calculationsData).indexOf("electr") !== -1) {
            delete dict["electr"]
        } else if (Object.keys(calculationsData).indexOf("sewer_wear") !== -1) {
            delete dict["sewer_wear"]
        } else if (Object.keys(calculationsData).indexOf("cws_wear") !== -1) {
            delete dict["cws_wear"]
        } else if (Object.keys(calculationsData).indexOf("heating_wear") !== -1) {
            delete dict["heating_wear"]
        } else if (Object.keys(calculationsData).indexOf("hws_wear") !== -1) {
            delete dict["hws_wear"]
        } else if (Object.keys(calculationsData).indexOf("roofing_wear") !== -1) {
            delete dict["roofing_wear"]
        } else if (Object.keys(calculationsData).indexOf("roof_wear") !== -1) {
            delete dict["roof_wear"]
        } else if (Object.keys(calculationsData).indexOf("balcony_wear") !== -1) {
            delete dict["balcony_wear"]
        } else if (Object.keys(calculationsData).indexOf("slabs_wear") !== -1) {
            delete dict["slabs_wear"]
        } else if (Object.keys(calculationsData).indexOf("walls_wear") !== -1) {
            delete dict["walls_wear"]
        } else if (Object.keys(calculationsData).indexOf("garbage_wear") !== -1) {
            delete dict["garbage_wear"]
        } else if (Object.keys(calculationsData).indexOf("foundation_wear") !== -1) {
            delete dict["foundation_wear"]
        } else {
            setFormData([])
            setFormDataEnginSyst([])
        }
        setCalculationsData(dict)
    }
    return (
        <>
            <Layout title='ЭРА ЖКХ | Расчет износа' content='Fare'/>
            <section className='tabs-wear'>
                <div className='container'>
                    <div className='tabs-wear__top'>
                        <a
                            className={
                                'tabs-wear__top-item ' +
                                (activeID === 'tabs-top__1' ? 'tabs__top-item--active' : '')
                            }
                            href='#'
                            onClick={() => {
                                setActiveId('tabs-top__1');
                            }}
                        >
                            Расчет износа
                        </a>
                        <a
                            className={
                                'tabs-wear__top-item ' +
                                (activeID === 'tabs-top__2' ? 'tabs__top-item--active' : '')
                            }
                            href='#'
                            onClick={() => {
                                setActiveId('tabs-top__2');
                            }}
                        >
                            База данных износа
                        </a>
                    </div>
                    <div className='tabs__content'>
                        {/* <!----------Content-1-------------------------------------------------> */}

                        <div
                            className={
                                'tabs__content-item ' +
                                (activeID === 'tabs-top__1' ? 'tabs__content-item--active' : '')
                            }
                            id='tab-1'
                        >
                            <div className='pay-detail'>
                                {(typeHouse.length === 0) ? (
                                    <form
                                        className='pay-detail__form'
                                        onSubmit={handleSubmit(fetchTypeSelector)}
                                    >
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
                                                        value={typeSelectorAddress}
                                                        onChange={setTypeSelectorAddress}
                                                        selectOnBlur={true}
                                                        inputProps={{required: true}}
                                                    />
                                                </label>
                                                <label className='pay-detail__label'>
                                                    Этажность
                                                    <input
                                                        type='number'
                                                        className='pay-detail__input'
                                                        name='floorNumber'
                                                        min='0'
                                                        step='1'
                                                        onChange={(e) => typeSelectorSetData(e)}
                                                        required
                                                    />
                                                </label>
                                                <label className='pay-detail__label'>
                                                    Площадь здания
                                                    <input
                                                        type='number'
                                                        className='pay-detail__input'
                                                        name='MaxVolume'
                                                        min='0'
                                                        step='0.01'
                                                        onChange={(e) => typeSelectorSetData(e)}
                                                        required
                                                    />
                                                </label>
                                                <div className='pay-detail__walltype-wrapper'>
                                                    <label className='pay-detail__label'>
                                                        Тип фундамента
                                                        <select
                                                            className='pay-detail__walltype-select pay-detail__outwalltype-wrapper'
                                                            name='foundationSelect'
                                                            onChange={(e) => typeSelectorSetData(e)}
                                                        >
                                                            <option value='1'>Столбчатые деревянные с забиркой</option>
                                                            <option value='2'>Столбчатые каменные с кирпичным цоколем
                                                            </option>
                                                            <option value='3'>Ленточные каменные</option>
                                                            <option value='4'>Ленточные каменные крупноблочные</option>
                                                            <option value='5'>Бетонные и железобетонные</option>
                                                            <option value='6'>Свайные столбчатые каменные, бетонные и
                                                                железобетонные
                                                            </option>
                                                        </select>
                                                    </label>
                                                </div>
                                                <div className='pay-detail__walltype-wrapper'>
                                                    <label className='pay-detail__label'>
                                                        Тип стен
                                                        <select
                                                            className='pay-detail__walltype-select pay-detail__outwalltype-wrapper'
                                                            name='wallsSelect'
                                                            onChange={(e) => typeSelectorSetData(e)}
                                                        >
                                                            <option value='1'>Стены деревянные, сборно-щитовые</option>
                                                            <option value='2'>Стены деревянные каркасные</option>
                                                            <option value='3'>Стены рубленые из бревен и брусчатые
                                                            </option>
                                                            <option value='4'>Стены деревянные рубленные, каркасные и
                                                                брусчатые с наружной облицовкой кирпичом
                                                            </option>
                                                            <option value='5'>Стены кирпичные</option>
                                                            <option value='6'>Стены кирпичные с облицовкой керамическими
                                                                блоками и плитками
                                                            </option>
                                                            <option value='7'>Стены из мелких блоков, искусственных и
                                                                естественных камней
                                                            </option>
                                                            <option value='8'>Стены из крупноразмерных блоков и
                                                                однослойных несущих панелей
                                                            </option>
                                                            <option value='9'>Стены из слоистых железобетонных панелей
                                                            </option>
                                                            <option value='10'>Стены из несущих панелей</option>
                                                        </select>
                                                    </label>
                                                </div>
                                                <div className='pay-detail__walltype-wrapper'>
                                                    <label className='pay-detail__label'>
                                                        Тип перекрытий
                                                        <select
                                                            className='pay-detail__walltype-select pay-detail__outwalltype-wrapper'
                                                            name='slabsSelect'
                                                            onChange={(e) => typeSelectorSetData(e)}
                                                        >
                                                            <option value='1'>Перекрытия деревянные неоштукатуренные
                                                            </option>
                                                            <option value='2'>Перекрытия деревянные оштукатуренные
                                                            </option>
                                                            <option value='3'>Перекрытия из кирпичных сводов по стальным
                                                                балкам
                                                            </option>
                                                            <option value='4'>Перекрытия из двухскорлупных
                                                                железобетонных прокатных панелей
                                                            </option>
                                                            <option value='5'>Перекрытия из сборного железобетонного
                                                                настила
                                                            </option>
                                                            <option value='6'>Перекрытия из сборных и монолитных
                                                                сплошных плит
                                                            </option>
                                                            <option value='7'>Монолитные и сборные железобетонные балки
                                                                покрытий и перекрытий
                                                            </option>
                                                        </select>
                                                    </label>
                                                </div>
                                                <div className='pay-detail__walltype-wrapper'>
                                                    <label className='pay-detail__label'>
                                                        Тип балконов
                                                        <select
                                                            className='pay-detail__walltype-select pay-detail__outwalltype-wrapper'
                                                            name='balconySelect'
                                                            onChange={(e) => typeSelectorSetData(e)}
                                                        >
                                                            <option value='0'>Выберите при необходимости</option>
                                                            <option value='1'>Сборные железобетонные детали лоджий
                                                            </option>
                                                            <option value='2'>Балконы, козырьки</option>
                                                        </select>
                                                    </label>
                                                </div>
                                                <div className='pay-detail__walltype-wrapper'>
                                                    <label className='pay-detail__label'>
                                                        Тип крыши
                                                        <select
                                                            className='pay-detail__walltype-select pay-detail__outwalltype-wrapper'
                                                            name='roofSelect'
                                                            onChange={(e) => typeSelectorSetData(e)}
                                                        >
                                                            <option value='1'>Крыши деревянные</option>
                                                            <option value='2'>Крыши железобетонные сборные (чердачные)
                                                            </option>
                                                            <option value='3'>Крыши совмещенные из сборных
                                                                железобетонных слоистых панелей
                                                            </option>
                                                        </select>
                                                    </label>
                                                </div>
                                                <div className='pay-detail__walltype-wrapper'>
                                                    <label className='pay-detail__label'>
                                                        Тип кровли
                                                        <select
                                                            className='pay-detail__walltype-select pay-detail__outwalltype-wrapper'
                                                            name='roofingSelect'
                                                            onChange={(e) => typeSelectorSetData(e)}
                                                        >
                                                            <option value='1'>Кровли рулонные</option>
                                                            <option value='2'>Кровли мастичные</option>
                                                            <option value='3'>Кровли стальные</option>
                                                            <option value='4'>Кровли из асбестоцементных листов</option>
                                                            <option value='5'>Кровли черепичные</option>
                                                            <option value='6'>Кровли драночные</option>
                                                            <option value='7'>Кровли тесовые</option>
                                                        </select>
                                                    </label>
                                                </div>
                                                <div className='pay-detail__walltype-wrapper'>
                                                    <label className='pay-detail__label'>
                                                        Вид мансарды
                                                        <select
                                                            className='pay-detail__walltype-select pay-detail__outwalltype-wrapper'
                                                            name='mansardType'
                                                            onChange={(e) => typeSelectorSetData(e)}
                                                        >
                                                            <option value='0'>Выберите при необходимости</option>
                                                            <option value='1'>С теплоизоляцией</option>
                                                            <option value='2'>Без теплоизоляции</option>
                                                        </select>
                                                    </label>
                                                </div>
                                            </div>
                                            <p className='pay-detail__equipment-title'>
                                                Прочие характеристики (отметить)
                                            </p>
                                            <div
                                                className='pay-detail__equipment-wrapper pay-detail__electricity-wrapper'>
                                                <label className='pay-detail__label pay-detail__checkbox-label'>
                                                    <span className='pay-detail__checkbox-text'>
                                                        Наличие подвала
                                                    </span>
                                                    <div className='pay-detail__checkbox-wrapper'>
                                                        <input
                                                            type='checkbox'
                                                            className='pay-detail__checkbox'
                                                            name='cellarSwitch'
                                                            onChange={(e) => typeSelectorSetData(e)}
                                                        />
                                                        <span className='pay-detail__checkbox-span'/>
                                                    </div>
                                                </label>
                                                <label className='pay-detail__label pay-detail__checkbox-label'>
                                                    <span className='pay-detail__checkbox-text'>
                                                        Наличие пристройки
                                                    </span>
                                                    <div className='pay-detail__checkbox-wrapper'>
                                                        <input
                                                            type='checkbox'
                                                            className='pay-detail__checkbox'
                                                            name='outHouseSwitch'
                                                            onChange={(e) => typeSelectorSetData(e)}
                                                        />
                                                        <span className='pay-detail__checkbox-span'/>
                                                    </div>
                                                </label>
                                                <label className='pay-detail__label pay-detail__checkbox-label'>
                                                    <span className='pay-detail__checkbox-text'>
                                                        Наличие мансарды
                                                    </span>
                                                    <div className='pay-detail__checkbox-wrapper'>
                                                        <input
                                                            type='checkbox'
                                                            className='pay-detail__checkbox'
                                                            name='mansardSwitch'
                                                            onChange={(e) => typeSelectorSetData(e)}
                                                        />
                                                        <span className='pay-detail__checkbox-span'/>
                                                    </div>
                                                </label>
                                                <label className='pay-detail__label pay-detail__checkbox-label'>
                                                    <span className='pay-detail__checkbox-text'>
                                                        Наличие канализации
                                                    </span>
                                                    <div className='pay-detail__checkbox-wrapper'>
                                                        <input
                                                            type='checkbox'
                                                            className='pay-detail__checkbox'
                                                            name='sewerSwitch'
                                                            onChange={(e) => typeSelectorSetData(e)}
                                                        />
                                                        <span className='pay-detail__checkbox-span'/>
                                                    </div>
                                                </label>
                                                <label className='pay-detail__label pay-detail__checkbox-label'>
                                                    <span className='pay-detail__checkbox-text'>
                                                        Наличие мусоропровода
                                                    </span>
                                                    <div className='pay-detail__checkbox-wrapper'>
                                                        <input
                                                            type='checkbox'
                                                            className='pay-detail__checkbox'
                                                            name='garbageSwitch'
                                                            onChange={(e) => typeSelectorSetData(e)}
                                                        />
                                                        <span className='pay-detail__checkbox-span'/>
                                                    </div>
                                                </label>
                                                <label className='pay-detail__label pay-detail__checkbox-label'>
                                                    <span className='pay-detail__checkbox-text'>
                                                        Наличие центрального отопления (ЦО)
                                                    </span>
                                                    <div className='pay-detail__checkbox-wrapper'>
                                                        <input
                                                            type='checkbox'
                                                            className='pay-detail__checkbox'
                                                            name='heatingSwitch'
                                                            onChange={(e) => typeSelectorSetData(e)}
                                                        />
                                                        <span className='pay-detail__checkbox-span'/>
                                                    </div>
                                                </label>
                                                <label className='pay-detail__label pay-detail__checkbox-label'>
                                                    <span className='pay-detail__checkbox-text'>
                                                        Наличие холодного водоснабжения
                                                    </span>
                                                    <div className='pay-detail__checkbox-wrapper'>
                                                        <input
                                                            type='checkbox'
                                                            className='pay-detail__checkbox'
                                                            name='cwsSwitch'
                                                            onChange={(e) => typeSelectorSetData(e)}
                                                        />
                                                        <span className='pay-detail__checkbox-span'/>
                                                    </div>
                                                </label>
                                                <label className='pay-detail__label pay-detail__checkbox-label'>
                                                    <span className='pay-detail__checkbox-text'>
                                                        Наличие горячего водоснабжения
                                                    </span>
                                                    <div className='pay-detail__checkbox-wrapper'>
                                                        <input
                                                            type='checkbox'
                                                            className='pay-detail__checkbox'
                                                            name='hwsSwitch'
                                                            onChange={(e) => typeSelectorSetData(e)}
                                                        />
                                                        <span className='pay-detail__checkbox-span'/>
                                                    </div>
                                                </label>
                                                <label className='pay-detail__label pay-detail__checkbox-label'>
                                                    <span className='pay-detail__checkbox-text'>
                                                        Наличие электропроводки
                                                    </span>
                                                    <div className='pay-detail__checkbox-wrapper'>
                                                        <input
                                                            type='checkbox'
                                                            className='pay-detail__checkbox'
                                                            name='electroSwitch'
                                                            onChange={(e) => typeSelectorSetData(e)}
                                                        />
                                                        <span className='pay-detail__checkbox-span'/>
                                                    </div>
                                                </label>
                                                <label className='pay-detail__label pay-detail__checkbox-label'>
                                                    <span className='pay-detail__checkbox-text'>
                                                        Наличие лифта
                                                    </span>
                                                    <div className='pay-detail__checkbox-wrapper'>
                                                        <input
                                                            type='checkbox'
                                                            className='pay-detail__checkbox'
                                                            name='liftSwitch'
                                                            onChange={(e) => typeSelectorSetData(e)}
                                                        />
                                                        <span className='pay-detail__checkbox-span'/>
                                                    </div>
                                                </label>
                                            </div>
                                        </div>
                                        <div className='main__buttons'>
                                            <button
                                                className='pay-detail__btn'
                                                name='detalisation__btn'
                                                type='submit'
                                            >
                                                Далее
                                            </button>
                                            <button
                                                className='pay-detail__btn'
                                                type='reset'
                                                onClick={() => (
                                                    setTypeSelectorData({
                                                        foundationSelect: 1,
                                                        wallsSelect: 1,
                                                        slabsSelect: 1,
                                                        balconySelect: 0,
                                                        roofSelect: 1,
                                                        roofingSelect: 1,
                                                        mansardType: 0,
                                                    }), setTypeSelectorAddress('')
                                                )}
                                            >
                                                Очистить ввод
                                            </button>
                                        </div>
                                    </form>
                                ) : (
                                    <>
                                        {(formData.length === 0 && formDataEnginSyst.length === 0) ? (
                                            <form
                                                className='pay-detail__form'
                                                onSubmit={handleSubmit(fetchFormData)}
                                            >
                                                <div className='wrapper-switch__1'>
                                                    <div className='pay-detail__walltype-wrapper'>
                                                        <label className='pay-detail__label'>
                                                            Уточните тип дома
                                                            <select
                                                                className='pay-detail__walltype-select pay-detail__outwalltype-wrapper'
                                                                name='typeHouse'
                                                                onChange={(e) => setFinalTypeHouse(e.target.value)}
                                                            >
                                                                {typeHouse.map((item, index) => {
                                                                    return (
                                                                        <option value={item.id}>{item.name}</option>
                                                                    )
                                                                })}
                                                            </select>
                                                        </label>
                                                    </div>
                                                </div>
                                                <div className='main__buttons'>
                                                    <button
                                                        className='pay-detail__btn'
                                                        name='detalisation__btn'
                                                        type='button'
                                                        onClick={() => (
                                                            setTypeHouse([]),
                                                                setTypeSelectorData({
                                                                    foundationSelect: 1,
                                                                    wallsSelect: 1,
                                                                    slabsSelect: 1,
                                                                    balconySelect: 0,
                                                                    roofSelect: 1,
                                                                    roofingSelect: 1,
                                                                    mansardType: 0,
                                                                }), setTypeSelectorAddress('')
                                                        )}
                                                    >
                                                        Назад
                                                    </button>
                                                    <button
                                                        className='pay-detail__btn'
                                                        name='detalisation__btn'
                                                        type='submit'
                                                    >
                                                        Далее
                                                    </button>
                                                    <button
                                                        className='pay-detail__btn'
                                                        name='detalisation__btn'
                                                        type='button'
                                                        onClick={fetchDownloadList}
                                                    >
                                                        Скачать список для заполнения
                                                    </button>
                                                </div>
                                            </form>
                                        ) : (
                                            <>
                                                {(Object.keys(calculationsData).indexOf("foundation_wear") === -1 && Object.keys(formData).indexOf("foundation_names") !== -1) ? (
                                                    <>
                                                        {formForWearCalc("foundation_wear", "Площадь фундамента", "foundation_names")}
                                                    </>
                                                ) : (
                                                    <>
                                                        {(Object.keys(calculationsData).indexOf("walls_wear") === -1 && Object.keys(formData).indexOf("walls_names") !== -1) ? (
                                                            <>
                                                                {formForWearCalc("walls_wear", "Площадь стен", "walls_names")}
                                                            </>
                                                        ) : (
                                                            <>
                                                                {(Object.keys(calculationsData).indexOf("slabs_wear") === -1 && Object.keys(formData).indexOf("slabs_names") !== -1) ? (
                                                                    <>
                                                                        {formForWearCalc("slabs_wear", "Площадь перекрытий", "slabs_names")}
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        {(Object.keys(calculationsData).indexOf("balcony_wear") === -1 && Object.keys(formData).indexOf("balcony_names") !== -1) ? (
                                                                            <>
                                                                                {formForWearCalc("balcony_wear", "Площадь балкона", "balcony_names")}
                                                                            </>
                                                                        ) : (
                                                                            <>
                                                                                {(Object.keys(calculationsData).indexOf("roof_wear") === -1 && Object.keys(formData).indexOf("roof_names") !== -1) ? (
                                                                                    <>
                                                                                        {formForWearCalc("roof_wear", "Площадь крыши", "roof_names")}
                                                                                    </>
                                                                                ) : (
                                                                                    <>
                                                                                        {(Object.keys(calculationsData).indexOf("roofing_wear") === -1 && Object.keys(formData).indexOf("roof_names") !== -1) ? (
                                                                                            <>
                                                                                                {formForWearCalc("roofing_wear", "Площадь кровли", "roofing_names")}
                                                                                            </>
                                                                                        ) : (
                                                                                            <>
                                                                                                {(Object.keys(calculationsData).indexOf("hws_wear") === -1 && Object.keys(formDataEnginSyst).indexOf("hws") !== -1) ? (
                                                                                                    <>
                                                                                                        {formForWearEnginCalc("hws_wear", "Горячее водоснабжение", "hws")}
                                                                                                    </>
                                                                                                ) : (
                                                                                                    <>
                                                                                                        {(Object.keys(calculationsData).indexOf("heating_wear") === -1 && Object.keys(formDataEnginSyst).indexOf("centralHeating") !== -1) ? (
                                                                                                            <>
                                                                                                                {formForWearEnginCalc("heating_wear", "Центральное отопление", "centralHeating")}
                                                                                                            </>
                                                                                                        ) : (
                                                                                                            <>
                                                                                                                {(Object.keys(calculationsData).indexOf("cws_wear") === -1 && Object.keys(formDataEnginSyst).indexOf("cws") !== -1) ? (
                                                                                                                    <>
                                                                                                                        {formForWearEnginCalc("cws_wear", "Холодное водоснабжение", "cws")}
                                                                                                                    </>
                                                                                                                ) : (
                                                                                                                    <>
                                                                                                                        {(Object.keys(calculationsData).indexOf("sewer_wear") === -1 && Object.keys(formDataEnginSyst).indexOf("sewer") !== -1) ? (
                                                                                                                            <>
                                                                                                                                {formForWearEnginCalc("sewer_wear", "Канализация", "sewer")}
                                                                                                                            </>
                                                                                                                        ) : (
                                                                                                                            <>
                                                                                                                                {(Object.keys(calculationsData).indexOf("electr") === -1 && Object.keys(formDataEnginSyst).indexOf("electro") !== -1) ? (
                                                                                                                                    <>
                                                                                                                                        {formForWearEnginCalc("electr", "Электропроводка", "electro")}
                                                                                                                                    </>
                                                                                                                                ) : (
                                                                                                                                    <>
                                                                                                                                        {(Object.keys(calculationsData).indexOf("garbage_wear") === -1 && Object.keys(formDataEnginSyst).indexOf("garbageChute") !== -1) ? (
                                                                                                                                            <>
                                                                                                                                                {formForWearEnginCalc("garbage_wear", "Мусоропровод", "garbageChute")}
                                                                                                                                            </>
                                                                                                                                        ) : (
                                                                                                                                            <>
                                                                                                                                                {finalCalc === 0 ? (
                                                                                                                                                        <form
                                                                                                                                                            className='pay-detail__form'
                                                                                                                                                            onSubmit={handleSubmit(fetchFinalCalc)}
                                                                                                                                                        >
                                                                                                                                                            {Object.keys(calculationsData).map((item, index) => {
                                                                                                                                                                let name = ''

                                                                                                                                                                if (item === "foundation_wear") {
                                                                                                                                                                    name = "Износ фундамента:"
                                                                                                                                                                } else if (item === "walls_wear") {
                                                                                                                                                                    name = "Износ стен:"
                                                                                                                                                                } else if (item === "slabs_wear") {
                                                                                                                                                                    name = "Износ перекрытий:"
                                                                                                                                                                } else if (item === "roof_wear") {
                                                                                                                                                                    name = "Износ крыши:"
                                                                                                                                                                } else if (item === "roofing_wear") {
                                                                                                                                                                    name = "Износ кровли:"
                                                                                                                                                                } else if (item === "heating_wear") {
                                                                                                                                                                    name = "Износ системы отопления:"
                                                                                                                                                                } else if (item === "cws_wear") {
                                                                                                                                                                    name = "Износ системы холодного водоснабжения:"
                                                                                                                                                                } else if (item === "sewer_wear") {
                                                                                                                                                                    name = "Износ канализационной системы:"
                                                                                                                                                                } else if (item === "electr") {
                                                                                                                                                                    name = "Износ электросетей:"
                                                                                                                                                                } else if (item === "balcony_wear") {
                                                                                                                                                                    name = "Износ балконов:"
                                                                                                                                                                } else if (item === "hws_wear") {
                                                                                                                                                                    name = "Износ системы горячего водоснабжения:"
                                                                                                                                                                } else {
                                                                                                                                                                    name = "Износ мусоропровода:"
                                                                                                                                                                }

                                                                                                                                                                return (
                                                                                                                                                                    <p>{name} {calculationsData[item].toFixed(2)}%</p>
                                                                                                                                                                )
                                                                                                                                                            })}
                                                                                                                                                            <div
                                                                                                                                                                className='main__buttons'>
                                                                                                                                                                <button
                                                                                                                                                                    className='pay-detail__btn'
                                                                                                                                                                    name='detalisation__btn'
                                                                                                                                                                    type='button'
                                                                                                                                                                    onClick={removeStep}
                                                                                                                                                                >
                                                                                                                                                                    Назад
                                                                                                                                                                </button>
                                                                                                                                                                <button
                                                                                                                                                                    className='pay-detail__btn'
                                                                                                                                                                    name='detalisation__btn'
                                                                                                                                                                    type='submit'
                                                                                                                                                                >
                                                                                                                                                                    Далее
                                                                                                                                                                </button>
                                                                                                                                                            </div>
                                                                                                                                                        </form>
                                                                                                                                                    )
                                                                                                                                                    :
                                                                                                                                                    (
                                                                                                                                                        <form
                                                                                                                                                            className='pay-detail__form'
                                                                                                                                                            onSubmit={handleSubmit(fetchSaveCalcDB)}
                                                                                                                                                        >
                                                                                                                                                            {Object.keys(calculationsData).map((item, index) => {
                                                                                                                                                                let name = ''

                                                                                                                                                                if (item === "foundation_wear") {
                                                                                                                                                                    name = "Износ фундамента:"
                                                                                                                                                                } else if (item === "walls_wear") {
                                                                                                                                                                    name = "Износ стен:"
                                                                                                                                                                } else if (item === "slabs_wear") {
                                                                                                                                                                    name = "Износ перекрытий:"
                                                                                                                                                                } else if (item === "roof_wear") {
                                                                                                                                                                    name = "Износ крыши:"
                                                                                                                                                                } else if (item === "roofing_wear") {
                                                                                                                                                                    name = "Износ кровли:"
                                                                                                                                                                } else if (item === "heating_wear") {
                                                                                                                                                                    name = "Износ системы отопления:"
                                                                                                                                                                } else if (item === "cws_wear") {
                                                                                                                                                                    name = "Износ системы холодного водоснабжения:"
                                                                                                                                                                } else if (item === "sewer_wear") {
                                                                                                                                                                    name = "Износ канализационной системы:"
                                                                                                                                                                } else if (item === "electr") {
                                                                                                                                                                    name = "Износ электросетей:"
                                                                                                                                                                } else if (item === "balcony_wear") {
                                                                                                                                                                    name = "Износ балконов:"
                                                                                                                                                                } else if (item === "hws_wear") {
                                                                                                                                                                    name = "Износ системы горячего водоснабжения:"
                                                                                                                                                                } else {
                                                                                                                                                                    name = "Износ мусоропровода:"
                                                                                                                                                                }

                                                                                                                                                                return (
                                                                                                                                                                    <p>{name} {calculationsData[item].toFixed(2)}%</p>
                                                                                                                                                                )
                                                                                                                                                            })}
                                                                                                                                                            <h1>Общий
                                                                                                                                                                износ
                                                                                                                                                                здания: {finalCalc.toFixed(2)}%</h1>
                                                                                                                                                            <div
                                                                                                                                                                className='main__buttons'>
                                                                                                                                                                <button
                                                                                                                                                                    className='pay-detail__btn'
                                                                                                                                                                    name='detalisation__btn'
                                                                                                                                                                    type='submit'
                                                                                                                                                                >
                                                                                                                                                                    Сохранить
                                                                                                                                                                    расчет
                                                                                                                                                                    в
                                                                                                                                                                    базу
                                                                                                                                                                    данных
                                                                                                                                                                </button>
                                                                                                                                                            </div>
                                                                                                                                                        </form>
                                                                                                                                                    )
                                                                                                                                                }
                                                                                                                                            </>

                                                                                                                                        )}
                                                                                                                                    </>
                                                                                                                                )}
                                                                                                                            </>
                                                                                                                        )}
                                                                                                                    </>
                                                                                                                )}
                                                                                                            </>
                                                                                                        )}
                                                                                                    </>
                                                                                                )}
                                                                                            </>
                                                                                        )}
                                                                                    </>
                                                                                )}
                                                                            </>
                                                                        )}
                                                                    </>
                                                                )}
                                                            </>
                                                        )}
                                                    </>
                                                )}
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
                            'tabs__content-item tabs__content-item__table ' +
                            (activeID === 'tabs-top__2' ? 'tabs__content-item--active' : '')
                        }
                        id='tab-2'
                    >
                        {tab.length !== 0 ? (
                            <table className='base-table'>
                                <thead className='base-table__head'>
                                <tr>
                                    <th scope='col'>№</th>
                                    <th scope='col'>Адрес</th>
                                    <th scope='col'>Дата</th>
                                    <th scope='col'>Подробнее</th>
                                </tr>
                                </thead>
                                <tbody className='base-table__body'>
                                {tab.map((item, index) => {
                                    return (
                                        <tr>
                                            <th scope='row'>{index + 1}</th>
                                            <td>{item.address}</td>
                                            <td>{item.date}</td>
                                            <td>
                                                <a className='base-table__body-link' href='era_ui/src/services/Wear#'>
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
                                    );
                                })}
                                </tbody>
                            </table>
                        ) : (
                            ''
                        )}
                    </div>
                </div>
            </section>
        </>
    );
};

export default Wear;
