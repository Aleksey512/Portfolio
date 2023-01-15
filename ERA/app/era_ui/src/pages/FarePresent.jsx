import Layout from '../components/Layout';
import React, {useState} from 'react';
import screenLogin from '../images/ScreenLogin.png';
import screenNonDetailOrel1 from '../images/ScreenNonDetailOrel1.png';
import screenNonDetailOrel2 from '../images/ScreenNonDetailOrel2.png';
import exampleDetailOrel from '../images/exampleDetailOrel.png';
import exampleDetailOrel1 from '../images/exampleDetailOrel1.png';
import exampleDetailOrel2 from '../images/exampleDetailOrel2.png';
import ExcelScreenDetail from '../images/ExcelScreenDetail.png';
import {saveAs} from 'file-saver';
import {API_URL} from '../config';
import Slider from 'react-slick';
import 'loupe-js/dist/style.css';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
import {NavLink} from 'react-router-dom';
import Footer from '../components/Footer';

const FarePresent = () => {
    const settings = {
        dots: true,
        infinite: true,
        arrows: false,
        //autoplay: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
    };
    const [isDroppedMenu, setIsDroppedMenu] = useState(false);
    const [isInstructionActive, setIsInstructionActive] = useState(false);

    const activateInstruction = () => {
        setIsInstructionActive(!isInstructionActive);
    };

    const droppedMenu = () => {
        setIsDroppedMenu(!isDroppedMenu);
    };

    const getContractOffer = async () => {
        fetch(API_URL + '/file/contract_offer', {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        })
            .then((res) => res.blob())
            .then((result) => saveAs(result, 'Договор оферты.pdf'))
            .catch((err) => console.log('error'));
    };

    const zoomIn = (e) => {
    };

    const zoomOut = (e) => {
    };

    const SliderImage = (props) => {
        return (
            <Zoom>
                <img
                    src={props.imgSrc}
                    className='main__content-img'
                    alt='screenshot demo 3'
                    id='8'
                    onMouseMove={(e) => {
                        zoomIn(e);
                    }}
                    onMouseOut={(e) => {
                        zoomOut(e);
                    }}
                />
            </Zoom>
        );
    }

    const url_rutube = "https://rutube.ru/video/private/0338e882f6afd658915b50ecb9df5003/?p=9z8FqgTSQeGD5zhoqMjddg"

    return (
        <>
            <Layout title='ЭРА ЖКХ | ЭкспертРасчёт' content='Home page'/>
            <div className='main__menu'>
                <div
                    className='main__menu-button main__menu-button--active'
                    onClick={droppedMenu}
                >
                    Содержание
                </div>
                <div
                    className={
                        'main__menu-content ' +
                        (isDroppedMenu ? 'main__menu-content--active' : '')
                    }
                >
                    <ul className={'main__menu-list'}>
                        <li className='main__menu-list__item'>
                            <a className='main__menu-list__link' href='#2'>
                                О сервисе
                            </a>
                        </li>
                        <li className='main__menu-list__item'>
                            <a className='main__menu-list__link' href='#4'>
                                Возможности сервиса
                            </a>
                        </li>
                        <li className='main__menu-list__item'>
                            <a className='main__menu-list__link' href='#5'>
                                Стоимость услуги
                            </a>
                        </li>
                        <li className='main__menu-list__item'>
                            <a
                                className='main__menu-list__link'
                                href='#'
                                onClick={getContractOffer}
                            >
                                Договор – оферта
                            </a>
                        </li>
                        <li className='main__menu-list__item'>
                            <a
                                className='main__menu-list__link'
                                href='#6'
                                onClick={() => setIsInstructionActive(true)}
                            >
                                Краткая инструкция
                            </a>
                        </li>
                        <li className='main__menu-list__item'>
                            <a className='main__menu-list__link' href='#7'>
                                Вход в личный кабинет
                            </a>
                        </li>
                        <li className='main__menu-list__item'>
                            <a className='main__menu-list__link' href='#8'>
                                Страница сервиса
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
            <section className='main'>
                <div className='main__parallax main__parallax-1'>
                    <div className='main__parallax-1__content'>
                        <p className='main__content-top__slogan'>
                        </p>
                        <h1 className='main__content-top__title'>
                            Веб-сервис «ЭкспертРасчёт»
                        </h1>
                        <div className='main__content-top'>
                            <p className='main__content-paragraph main__content-top__descr'>
                                Разработан Инжиниринговым центром «Технологии цифровой среды»
                                Федерального государственного бюджетного образовательного
                                учреждения высшего образования «Орловский государственный
                                университет имени И.С. Тургенева».
                            </p>
                            <p className='main__content-paragraph main__content-top__certificate'>
                                Свидетельство о госрегистрации программы Федеральной службы по
                                интеллектуальной собственности № 2021680323
                            </p>
                        </div>
                    </div>
                </div>
                <div className='main__content main__content-2'>
                    <iframe
                        width="100%"
                        height="615"
                        src="https://rutube.ru/play/embed/0338e882f6afd658915b50ecb9df5003"
                        frameBorder="0"
                        allow="clipboard-write; autoplay"
                        webkitAllowFullScreen
                        mozallowfullscreen
                        allowFullScreen
                    />
                </div>
                <div className='main__parallax main__parallax-2'/>
                <div className='main__content main__content-2' id='2'>
                    <h2 className='main__content-title main__content-title-2'>
                        Обеспечим расчет на основе <br/> современных технологий <br/>{' '}
                        искусственного интеллекта
                    </h2>
                    <p className='main__content-paragraph'>
                        Как показывает практика, для домов конкретного типа состав и объем
                        обязательных работ и услуг могут существенно различаться. На это
                        влияют период эксплуатации, исполнение конструктивных элементов,
                        состав внутридомового инженерного оборудования, технических
                        устройств, а также объекты общего имущества, расположенные на
                        прилегающей территории многоквартирного дома.
                    </p>
                    <p className='main__content-paragraph'>
                        Веб-сервис «ЭкспертРасчёт» расчитает за Вас размер платы для любого
                        дома.
                    </p>
                </div>
                <div className='main__parallax main__parallax-3'/>
                <div className='main__content main__content-3'>
                    <h2 className='main__content-title'>Сервис «ЭкспертРасчёт»</h2>
                    <p className='main__content-paragraph'>
                        Разработан согласно требованиям Жилищного Кодекса РФ, Постановлениям
                        Правительства РФ <br/>№ 491, № 290, Правилам и нормами технической
                        эксплуатации жилищного фонда, утвержденными постановлением Госстроя
                        России № 170, положениям Приказа Минстроя РФ от 06.04. 2018 г.
                        N213/пр.
                    </p>
                    <p className='main__content-paragraph'>
                        Расчеты размеров платы за содержание и текущий ремонт общего
                        имущества проведены специалистами на более 1200 многоквартирных
                        жилых домах различного технического исполнения.
                    </p>
                    <p className='main__content-paragraph'>
                        В сервисе «ЭкспертРасчет» размер платы формируется автоматически,
                        исходя из его конструктивных и технических характеристик, и перечня
                        инженерного оборудования, входящего в состав общего имущества. При
                        необходимости учитываются расходы: содержание локальных котельных,
                        лифтового хозяйства, благоустройство прилегающей территории.
                    </p>
                </div>
                <div className='main__parallax main__parallax-4' id='4'/>
                <div className='main__content main__content-4'>
                    <h2 className='main__content-title main__content-title-4'>
                        С помощью веб-сервиса "ЭкспертРасчет" Вы сможете:
                    </h2>
                    <ul className='main__content-list'>
                        <li className='main__content-list__item'>
                            - рассчитать плату за содержание и ремонт общего имущества с
                            учетом возраста дома, конструктивных особенностей и степени
                            благоустройства;
                        </li>
                        <li className='main__content-list__item'>
                            - Сформировать обязательные группы затрат в составе платы.
                            Это затраты текущий ремонт, техническое обслуживание, технические осмотры,
                            аварийное обслуживание, санитарное содержание и благоустройство,
                            управление многоквартирным
                            домом, <span> в том числе затраты на информационные технологии;</span>
                        </li>
                        <li className='main__content-list__item'>
                            - внутри каждой группы детально расшифровать стоимость работ и услуг, которые должны быть
                            проведены на доме;
                        </li>
                        <li className='main__content-list__item'>
                            <span>- при необходимости скорректировать величину затрат в любой из групп;</span>
                        </li>
                        <li className='main__content-list__item'>
                            - рассчитать величину начислений по каждому виду работ за месяц,
                            год;
                        </li>
                        <li className='main__content-list__item'>
                            - сохранить результаты расчетов в базе данных;
                        </li>
                        <li className='main__content-list__item'>
                            - выгрузить данные в формате Excel для печати.
                        </li>
                    </ul>
                    {/* <div className='main__content-btn'>Демо доступ</div> */}
                </div>
                <div className='main__parallax main__parallax-5' id='5'/>
                <div className='main__content main__content-5'>
                    <h2 className='main__content-title main__content-title-5'>
                        Стоимость доступа к вэб-сервису «ЭкспертРасчет»
                    </h2>
                    <table className='main__content-table base-table'>
                        <thead className='base-table__head'>
                        <tr>
                            <th scope='col'>Организация</th>
                            <th scope='col'>
                                Срок действия
                                <br/> договора, мес.
                            </th>
                            <th scope='col'>
                                Стоимость,
                                <br/> руб/мес
                            </th>
                        </tr>
                        </thead>
                        <tbody className='base-table__body'>
                        <tr>
                            <td scope='row'>ТСЖ, ЖСК, ТСН</td>
                            <td>1</td>
                            <td>4500</td>
                        </tr>
                        <tr>
                            <td scope='row'>Управляющая компания</td>
                            <td>3-6</td>
                            <td>6000</td>
                        </tr>
                        <tr>
                            <td scope='row'>Орган власти муниципального образования</td>
                            <td>От 12</td>
                            <td>10000</td>
                        </tr>
                        </tbody>
                    </table>
                    <div className='main__undertable-buttons'>
                        <a className='main__content-btn' onClick={activateInstruction} href='#9'>
                            Краткая инструкция
                        </a>
                        <NavLink className='main__content-btn main__demo-btn' to='/services/fare/demo'>
                            Демо версия
                        </NavLink>
                    </div>
                </div>
                {isInstructionActive ? (
                    <>
                        <div className='main__parallax main__parallax-6' id='6'/>
                        <div className='main__content main__content-6 main__content-6--active'>
                            <h2 className='main__content-title main__content-title-6'>
                                Краткая инструкция «ЭкспертРасчет»
                            </h2>
                            <ul className='main__content-list'>
                                <li className='main__content0list__item'>
                                    При выполнении условий п.п. 4.1., 4.2. Договора-оферты для
                                    доступа к веб-сервису на Ваш электронный адрес будут
                                    отправлены логин/пароль, необходимые для дальнейшей
                                    авторизации в личном кабинете веб-сервиса.
                                </li>
                                <li className='main__content-list__item' id='7'>
                                    1. Нажмите кнопку «Вход»
                                </li>
                                <li className='main__content-list__item'>
                                    2. Если не зарегистрировались, то нажмите кнопку «Регистрация»
                                    (см.сноску)
                                </li>
                                <li className='main__content-list__item'>
                                    3. После регистрации нажмите кнопку «Вход»
                                </li>
                                <li className='main__content-list__item'>
                                    4. Введите полученные Логин и Пароль.
                                </li>
                                <li className='main__content-list__item'>
                                    5. При нажатии кнопки «Войти» Вы переходите в персональную
                                    рабочую зону Веб-сервиса.
                                </li>
                            </ul>

                            <Slider className='slider' {...settings}>
                                <table className='main__content-table base-table help-table'>
                                    <thead className='base-table__head'>
                                    <tr>
                                        <th scope='col' colSpan='3'>
                                            Форма для регистрации
                                        </th>
                                    </tr>
                                    </thead>
                                    <tbody className='base-table__body'>
                                    <tr>
                                        <td scope='row'>Е - mail</td>
                                        <td>+</td>
                                    </tr>
                                    <tr>
                                        <td scope='row'>Пароль</td>
                                        <td>+</td>
                                    </tr>
                                    <tr>
                                        <td scope='row'>Организация</td>
                                        <td>+</td>
                                    </tr>
                                    <tr>
                                        <td scope='row'>Фактич. адрес</td>
                                        <td>+</td>
                                    </tr>
                                    <tr>
                                        <td scope='row'>Контактное лицо (имя отчество)</td>
                                        <td>+</td>
                                    </tr>
                                    <tr>
                                        <td scope='row'>Тел., Скайп, Zoom</td>
                                        <td>+</td>
                                    </tr>
                                    </tbody>
                                </table>
                                <div className='slider__item'>
                                    <SliderImage imgSrc={screenLogin}/>
                                </div>
                                <div className='slider__item'>
                                    <SliderImage imgSrc={screenNonDetailOrel1}/>
                                </div>
                                <div className='slider__item'>
                                    <SliderImage imgSrc={screenNonDetailOrel2}/>
                                </div>
                                <div className='slider__item'>
                                    <SliderImage imgSrc={exampleDetailOrel1}/>
                                </div>
                                <div className='slider__item'>
                                    <SliderImage imgSrc={exampleDetailOrel2}/>
                                </div>
                                <div className='slider__item'>
                                    <SliderImage imgSrc={ExcelScreenDetail}/>
                                </div>
                            </Slider>
                        </div>
                    </>
                ) : (
                    ''
                )}
            </section>
            <Footer/>
        </>
    );
};

export default FarePresent;
