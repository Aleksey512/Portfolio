import React, {useContext, useState} from 'react';
import {Link, NavLink} from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import logo from "../images/logo.svg";
import BubbleiK from "./BubbleiK";
const Header = () => {
    let {user, logoutUser} = useContext(AuthContext);

    const [isDroppedMenu, setIsDroppedMenu] = useState(false);
    const [isMenuActive, isMenuActiveSet] = useState(false);

    const menuActive = () => {
        isMenuActiveSet(!isMenuActive);
    };

    const droppedMenu = () => {
        setIsDroppedMenu(!isDroppedMenu);
    };

    const authLinks = (
        <>
            <li>
                <div className='menu__list-box'>
                    <div
                        className={
                            'menu__list-container ' +
                            (isDroppedMenu ? 'menu__list-container--active' : '')
                        }
                    >
                        <div className='menu__option'>
                            <input
                                className='menu__input'
                                type='radio'
                                id='serv1'
                                name='services'
                            />
                            <NavLink className='menu__navlink' to='/services/fare'>
                                Расчет - обоснование платы
                            </NavLink>
                        </div>
                        <div className='menu__option'>
                            <input
                                className='menu__input'
                                type='radio'
                                id='serv2'
                                name='services'
                            />
                            <NavLink className='menu__navlink' to='/services/wear'>
                                Расчет износа
                            </NavLink>
                        </div>
                        <div className='menu__option'>
                            <input
                                className='menu__input'
                                type='radio'
                                id='serv3'
                                name='services'
                            />
                            <NavLink className='menu__navlink' to='/services/ads'>
                                АДС
                            </NavLink>
                        </div>
                        <div className='menu__option'>
                            <input
                                className='menu__input'
                                type='radio'
                                id='serv4'
                                name='services'
                            />
                            <NavLink className='menu__navlink' to='/services/rso/dynamic'>
                                РСО Динамик
                            </NavLink>
                        </div>
                    </div>
                    <div className='menu__selected' onClick={droppedMenu}>
                        Сервисы
                    </div>
                </div>
            </li>
        </>
    );

    const authHeaderLinks = (
        <ul className='header__list'>
            <li className='header__list-item'>
                <NavLink className='header__list-link' to='/dashboard'>
                    Личный кабинет
                </NavLink>
            </li>
            <li className='header__list-item'>
                <a className='header__list-link' href="" onClick={logoutUser}>
                    Выход
                </a>
            </li>
        </ul>
    );

    const guestLinks = (
        <>
        </>
    );

    const guestHeaderLinks = (
        <ul className='header__list'>
            <li className='header__list-item'>
                <NavLink className='header__list-link' to='/login'>
                    Написать
                </NavLink>
            </li>
            <li className='header__list-item'>
                <NavLink className='header__list-link' to='/login'>
                    Вход
                </NavLink>
            </li>
        </ul>
    );

    return (
    <>

        <div className='top'>
            <header className='header'>
                <div className='container'>
                    <div className='header__inner'>
                        <button
                            onClick={menuActive}
                            className={
                                'menu__btn ' + (isMenuActive ? 'menu__btn--active' : '')
                            }
                        >
                            <svg
                                width='24px'
                                height='24px'
                                viewBox='0 0 24 24'
                                xmlns='http://www.w3.org/2000/svg'
                            >
                                <path
                                    fill='none'
                                    stroke='#fff'
                                    stroke-width='2'
                                    d='M2,19 L22,19 M2,5 L22,5 M2,12 L22,12'
                                />
                            </svg>
                        </button>

                        <div className='logo__box'>
                            <Link className='logo__link' to='/'>
                                <img src={logo} alt='logo'/>
                            </Link>
                        </div>
                        <div className=''/>
                        {user ? authHeaderLinks : guestHeaderLinks}
                    </div>
                </div>
            </header>

            <div className={'menu ' + (isMenuActive ? 'menu--active' : '')}>
                <ui className='menu-list'>
                    <li>
                        <NavLink className='menu-list__link' to='/'>
                            Главная
                        </NavLink>
                    </li>
                    {user ? authLinks : guestLinks}
                    <li>
                        <NavLink className='menu-list__link' to='/news'>
                            Новости
                        </NavLink>
                    </li>
                    <li>
                        <NavLink className='menu-list__link' to='/about'>
                            О платформе
                        </NavLink>
                    </li>
                </ui>
            </div>
        </div>
        </>
    );
};

export default Header;
