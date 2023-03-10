import React, {useContext, useState} from 'react';
import {useForm} from 'react-hook-form';
import AuthContext from '../context/AuthContext';
import {API_URL, DADATA_TOKEN} from '../config';
import Layout from '../components/Layout';
import {NavLink} from 'react-router-dom';
import {AddressSuggestions, EmailSuggestions, FioSuggestions, PartySuggestions} from "react-dadata";
import Footer from '../components/Footer';

const LoginPage = () => {
    let {LoginUser} = useContext(AuthContext);

    const [switchAuth, setSwitchAuth] = useState('Login');
    const [sendRegister, setSendRegister] = useState(false);

    const [registerEmail, setRegisterEmail] = useState('');
    const [registerCompany, setRegisterCompany] = useState('');
    const [registerAddress, setRegisterAddress] = useState({
        value: ''
    });
    const [registerName, setRegisterName] = useState({
        value: ''
    });
    const [registerTele, setRegisterTele] = useState('');

    const registerCompanySetData = (e) => {
        setRegisterCompany(e.value)
        setRegisterAddress({value: e.data.address.value})
        setRegisterName({value: e.data.management.name})
    };

    const [authorizationData, setAuthorizationData] = useState({
        login: '',
        password: '',
    });

    const authorizationSetData = (e) => {
        setAuthorizationData({
            ...authorizationData,
            [e.target.name]: e.target.value,
        });
    };

    const onSubmitRegister = async (e) => {
        setSendRegister(true);

        let response = await fetch(API_URL + '/user/register/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: registerEmail.value,
                company: registerCompany,
                fio: registerName.value,
                address: registerAddress.value,
                tele: registerTele,
            }),
        });

        let data = await response.json();

        if (response.status === 200) {
            alert(data.res);
            setTimeout(reset, 3000);
        } else {
            alert('?????????????????? ????????????');
        }
        setSendRegister(false);
    };

    const {handleSubmit, reset} = useForm({mode: 'onBlur'});

    const onClickLogin = () => {
        const login = authorizationData.login;
        const password = authorizationData.password;
        LoginUser(login, password);
        reset();
    };

    return (
      <>
        <Layout title='?????? ?????? | ????????' content='Login page'>
        </Layout>
            <section className='login'>
                <div className='container'>
                    <div className='login__links '>
            <span
                className={
                    'login__link ' +
                    (switchAuth === 'Login' ? 'login__link--active' : '')
                }
                onClick={() => {
                    setSwitchAuth('Login');
                }}
            >
              ????????
            </span>
                        <span
                            className={
                                'login__link ' +
                                (switchAuth === 'Register' ? 'login__link--active' : '')
                            }
                            onClick={() => {
                                setSwitchAuth('Register');
                            }}
                        >
              ??????????????????????
            </span>
                    </div>
                    {switchAuth === 'Login' ? (
                        /* ??????????--------------------------------------- */
                        <form className='login__form' onSubmit={handleSubmit(onClickLogin)}>
                            <label className='login__label'>
                                ?????????????? ??????????
                                <input
                                    className='login__input'
                                    type='text'
                                    name='login'
                                    onChange={(e) => authorizationSetData(e)}
                                    placeholder='?????????????? ??????????'
                                    required
                                />
                            </label>
                            <label className='login__label'>
                                ?????????????? ????????????
                                <input
                                    className='login__input'
                                    type='password'
                                    name='password'
                                    onChange={(e) => authorizationSetData(e)}
                                    placeholder='?????????????? ????????????'
                                    required
                                />
                            </label>
                            <label className='login__label login__label-checkbox'/>
                            <NavLink className='login__error' to='!#' name='forgot__password'>
                                ???????????? ?????????????
                            </NavLink>
                            <button type='submit' className='login__btn'>
                                ??????????
                            </button>
                        </form>
                    ) : (
                        /* ??????????????????????--------------------------------------- */
                        <form
                            className='login__form'
                            onSubmit={handleSubmit(onSubmitRegister)}
                        >
                            <label className='login__label'>
                                ??????????
                                <EmailSuggestions
                                    token={DADATA_TOKEN}
                                    type='text'
                                    id='email'
                                    className='login__input'
                                    name='email'
                                    inputProps={{required: true}}
                                    value={registerEmail}
                                    onChange={setRegisterEmail}
                                    required
                                />
                            </label>
                            <label className='login__label'>
                                ???????????????? ?????????????????????? ??????????????????????
                                <PartySuggestions
                                    token={DADATA_TOKEN}
                                    type='text'
                                    id='address'
                                    className='login__input'
                                    name='address'
                                    selectOnBlur={true}
                                    inputProps={{required: true}}
                                    value={registerCompany}
                                    onChange={registerCompanySetData}
                                    required
                                />
                            </label>
                            <label className='login__label'>
                                ?????????????????????? ??????????
                                <AddressSuggestions
                                    token={DADATA_TOKEN}
                                    type='text'
                                    id='address'
                                    className='login__input'
                                    name='address'
                                    selectOnBlur={true}
                                    inputProps={{required: true}}
                                    value={registerAddress}
                                    onChange={setRegisterAddress}
                                    required
                                />
                            </label>
                            <label className='login__label'>
                                ???????????????????? ????????
                                <FioSuggestions
                                    token={DADATA_TOKEN}
                                    type='text'
                                    id='fio'
                                    className='login__input'
                                    name='fio'
                                    selectOnBlur={true}
                                    inputProps={{required: true}}
                                    value={registerName}
                                    onChange={setRegisterName}
                                    required
                                />
                            </label>
                            <label className='login__label'>
                                ??????????????, ??????????, Zoom
                                <input
                                    className='login__input'
                                    type='text'
                                    name='tele'
                                    value={registerTele}
                                    onChange={e => setRegisterTele(e.target.value)}
                                    placeholder='?????????????? ?????????? ????????????????/?????????? Skype/???????????? ???? Zoom'
                                    required
                                />
                            </label>
                            <label className='login__label login__label-checkbox'/>
                            {sendRegister === true ? (
                                <>
                                    <button className='login__btn' disabled>
                                        ????????????????
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button type='submit' className='login__btn'>
                                        ????????????????????????????????????
                                    </button>
                                </>
                            )}
                        </form>
                    )}
                </div>
            </section>
      </>
    );
};

export default LoginPage;
