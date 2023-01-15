import React, {useContext, useEffect, useState} from 'react';
import AuthContext from '../context/AuthContext';
import Layout from '../components/Layout';
import {API_URL} from "../config";

const Dashboard = () => {
    let [profile, setProfile] = useState('');
    let {authTokens, logoutUser} = useContext(AuthContext);

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
        } else if (data["detail"] === "Учетные данные не были предоставлены.") {
            logoutUser();
        } else {
            alert("Произошла непредвиденная ошибка")
        }
    };

    return (
        <Layout title='ЭРА ЖКХ | Личный кабинет' content='Dashboard page'>
            <>
                <h1>Личный кабинет</h1>
                <p>Данные</p>
                {profile != '' ? (
                    <ul>
                        <li>Имя: {profile[0]["first_name"]}</li>
                        <li>Фамилия: {profile[0]["last_name"]}</li>
                        <li>Управляющая организация: {profile[0]["manage_org"]}</li>
                        <li>Должность: {profile[0]["job_title"]}</li>
                        <li>Доступ к 'Расчёт/детализация платы за управление
                            МКД': {profile[0]["fare_access"] ? "Есть" : "Отсутсвует"}</li>
                        <li>Дата последнего платежа: {profile[0]["last_payment"]}</li>
                    </ul>
                ) : (
                    <h1>
                        Загрузка...
                    </h1>
                )}

            </>
        </Layout>
    );
};

export default Dashboard;
