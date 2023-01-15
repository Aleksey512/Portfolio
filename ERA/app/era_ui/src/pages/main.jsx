import {NavLink} from "react-router-dom";
import Layout from "../components/Layout";
import React from "react";
import BubbleiK from "../components/BubbleiK";
import Footer from "../components/Footer";

const Main = () => {
    return(
    <>
        <BubbleiK/>
        <Layout title='ЭРА ЖКХ | Главная' content='Home page'/>
        <div className='ForJkx'>
            <div className="container">
                <div className="ForJkx__inner">
                    <h1 className="ForJkx__title1">Интеллектуальная платформа «ЭРА ЖКХ» - ваш партнёр в
                            мире технологий
                    </h1>
                    <h1 className="ForJkx__title2">Наши цифровые сервисы - современный подход к решению Ваших задач</h1>
                    <p className="ForJkx__describe">Цифровая платформа «ЭРА ЖКХ» предназначена для обработки, анализа и хранения необходимых и критически важных для работы предприятия данных.<br/>
        Сервисы системы включают максимально необходимый функционал для деятельности  компании коммунального хозяйства.<br/>
        Каждый из программных комплексов обеспечивает оптимальное управление бизнес-процессами компании в автоматическом режиме.</p>
                </div>
            </div>
        </div>
        <section className="ForJkx__textblock-1">
            <div className="container">
                <h1 className="ForJkx__title">Программные решения</h1>
                <div className="ForJkx__cards">
                    <div className="ForJkx__card">
                        <div className="ForJkx__card-content">
                            <h1 className="ForJkx__card-content__title">Программа «ЭкспертРасчет» - Расчет и детализация платы за содержание общего имущества многоквартирного жилого здания»</h1>
                            <p className="ForJkx__card-content__descr">Обеспечивает:<br/>расчёт размера оплаты; стоимости выполнения каждой из работ и услуг; формирование постатейного состава действующей оплаты собственников конкретного многоквартирного дома.</p>
                        </div>
                        <NavLink className="ForJkx__card-link" to='/present/fare'>
                            <input type="button" className="ForJkx__card-btn" value="Перейти к сервису"/>
                        </NavLink>
                    </div>
                    <div className="ForJkx__card">
                        <div className="ForJkx__card-content">
                            <h1 className="ForJkx__card-content__title">Программа «ВЗУконтроль» - Мониторинг динамических, химических параметров воды, технических параметров оборудования и систем Водозаборного узла.</h1>
                            <p className="ForJkx__card-content__descr">Три группы контроля: работа скважин, оборудования станции; почасовая производительность, объем и качество поданной питьевой воды в магистральный водовод.</p>
                        </div>
                        <NavLink className="ForJkx__card-link" to='/present/rso/dynamic'>
                            <input type="button" className="ForJkx__card-btn" value="В разработке"/>
                        </NavLink>
                    </div>
                    <div className="ForJkx__card">
                        <div className="ForJkx__card-content">
                            <h1 className="ForJkx__card-content__title">Программа «МКД износ» - Расчет износа жилого здания и его элементов методом итераций</h1>
                            <p className="ForJkx__card-content__descr">Объединяет экспертный метод и автоматизированную информационную среду для оценки и визуализации степени износа жилого фонда региона, а также каждого дома в отдельности с использованием ГИС ЖКХ</p>
                        </div>
                        <NavLink className="ForJkx__card-link" to='/present/wear'>
                            <input type="button" className="ForJkx__card-btn" value="В разработке"/>
                        </NavLink>
                    </div>
                    <div className="ForJkx__card">
                        <div className="ForJkx__card-content">
                            <h1 className="ForJkx__card-content__title">Программный комплекс «Единая распределенная диспетчерская службы на примере Орловской области»</h1>
                            <p className="ForJkx__card-content__descr">Единое региональное информационное пространство, аккумулирующее обращения населения, связанные с решением проблем  в сфере ЖКХ на территории региона, на основе распределенных информационных центров муниципальных образований</p>
                        </div>
                        <NavLink className="ForJkx__card-link" to='/present/ads'>
                            <input type="button" className="ForJkx__card-btn" value="В разработке"/>
                        </NavLink>
                    </div>
                </div>
            </div>
        </section>

        <section className="ForJkx__functional">
            <div className="container">
                <div className="ForJkx__functional-inner">
                    <h1 className="ForJkx__functional-title">Функционал платформы</h1>
                    <div className="ForJkx__functional-cards">
                        <div className="ForJkx__functional-card">
                            <p className="ForJkx__functional-card__text">
                                Платформа создается для организации цифрового управления объектами  коммунальной инфраструктуры  и жилищного фонда на основе открытого оперативного IT-взаимодействия участников  в едином информационном пространстве
                            </p>
                        </div>
                        <div className="ForJkx__functional-card">
                            <p className="ForJkx__functional-card__text">
                                Цифровая платформа «ЭРА ЖКХ» предлагается как региональный функционал единой федеральной информационной системы ГИС ЖКХ
                            </p>
                        </div>
                        <div className="ForJkx__functional-card">
                            <p className="ForJkx__functional-card__text">
                            Сервисы платформы включают максимально необходимый функционал для деятельности компании коммунального хозяйства. Каждый обеспечивает оптимальное управление бизнес-процессами компании в автоматическом режиме.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <Footer/>

    </>
    )
}

export default Main;