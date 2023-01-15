import {createContext, useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import {API_URL} from "../config";

const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({children}) => {
    let navigate = useNavigate();
    let [user, setUser] = useState(
        localStorage.getItem('authTokens')
            ? jwt_decode(localStorage.getItem('authTokens'))
            : null
    );
    let [authTokens, setAuthTokens] = useState(
        localStorage.getItem('authTokens')
            ? JSON.parse(localStorage.getItem('authTokens'))
            : null
    );

    let [loading, setLoading] = useState(true);

    let LoginUser = async (name, password) => {
        let response = await fetch(API_URL + '/user/token/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },

            body: JSON.stringify({
                username: name,
                password: password,
            }),
        });

        let data = await response.json();

        if (response.status === 200) {
            setAuthTokens(data);
            setUser(jwt_decode(data.access));
            localStorage.setItem('authTokens', JSON.stringify(data));
            navigate('/', {replace: true});
        } else {
            alert('Проверьте правильность введённых данных');
        }
        console.log('data:', data);
        console.log('response:', response);
    };

    let logoutUser = () => {
        setAuthTokens(null);
        setUser(null);
        localStorage.removeItem('authTokens');
    };

    let updateToken = async e => {
        console.log('Update token called');
        let response = await fetch(API_URL + '/user/token/refresh/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({refresh: authTokens.refresh}),
        });
        let data = await response.json();

        if (response.status === 200) {
            setAuthTokens(data);
            setUser(jwt_decode(data.access));
            localStorage.setItem('authTokens', JSON.stringify(data));
        } else {
            logoutUser();
        }
    };

    let contextData = {
        user: user,
        authTokens: authTokens,
        LoginUser: LoginUser,
        logoutUser: logoutUser,
    };

    useEffect(() => {
        let fourMinutes = 1000 * 60 * 4;

        let interval = setInterval(() => {
            if (authTokens) {
                updateToken();
            }
        }, fourMinutes);
        return () => clearInterval(interval);
    }, [authTokens, loading]);

    return (
        <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>
    );
};
