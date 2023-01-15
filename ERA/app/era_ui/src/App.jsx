import {Route, Routes} from 'react-router-dom';
import './scss/style.scss'

import ProtectedRoute from './utils/ProtectedRoute';
import {AuthProvider} from './context/AuthContext';

import Main from "./pages/Main";
import FarePresent from "./pages/FarePresent";
import Dashboard from './pages/Dashboard';
import LoginPage from './pages/LoginPage';
import FareDemo from './services/FareDemo';

import Fare from './services/Fare';
import Wear from "./services/Wear";
import DynamicValuesRSO from "./services/DynamicValuesRso";
import React from "react";
import BubbleiK from "./components/BubbleiK";
function App() {
    return (
        <>
            <div className='App'>
                <AuthProvider>
                    <Routes>
                        <Route path='/' element={<Main/>}/>
                        <Route path='/BubbleiK' element={<BubbleiK/>}/>

                        <Route path='/login' element={<LoginPage/>}/>
                        <Route path='/present/fare' element={<FarePresent/>}/>

                        <Route path='/services/fare/demo' element={<FareDemo/>}/>
                        <Route
                            path='/dashboard'
                            element={<ProtectedRoute>{<Dashboard/>}</ProtectedRoute>}
                        />
                        <Route
                            path='/services/fare'
                            element={<ProtectedRoute>{<Fare/>}</ProtectedRoute>}
                        />
                        <Route
                            path='/services/rso/dynamic'
                            element={<ProtectedRoute>{<DynamicValuesRSO />}</ProtectedRoute>}
                        />
                        <Route
                            path='/services/wear'
                            element={<ProtectedRoute>{<Wear/>}</ProtectedRoute>}
                        />
                    </Routes>

                </AuthProvider>

            </div>
        </>
    );
}

export default App;
