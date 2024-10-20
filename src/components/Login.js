import React, { useState } from 'react';
import { auth, RecaptchaVerifier } from '../firebase';
import { signInWithPhoneNumber } from 'firebase/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudSun } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

import '../layout/css/login.css'

const Login = () => {
    const [isValid, setIsValid] = useState(false)
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [confirmationResult, setConfirmationResult] = useState(null);
    const [error, setError] = useState('');
    const navegate = useNavigate();

    const register = () => {
        navegate('/registro')
    };
    const setupRecaptcha = () => {
        console.log('Setting up reCAPTCHA');
        if (!window.recaptchaVerifier) {
            window.recaptchaVerifier = new RecaptchaVerifier(auth,'recaptcha-container', {
                'size': 'invisible',
                'callback': (response) => {
                    console.log('reCAPTCHA entro');
                }
            }, auth);
        }
        console.log('reCAPTCHA configuracion conectada');
    };

    const validatePhoneNumber = (phoneNumber) => {
        const phoneRegex = /^\+[1-9]\d{1,14}$/;
        return phoneRegex.test(phoneNumber);
    };
    const requestOtp = () => {
        setError(''); // Limpiar cualquier error previo
        if (validatePhoneNumber(phone)) {
            setupRecaptcha();
            const appVerifier = window.recaptchaVerifier;
            signInWithPhoneNumber(auth, phone, appVerifier)
                .then((confirmationResult) => {
                    setConfirmationResult(confirmationResult);
                    console.log('OTP enviado');
                    setIsValid(true);
                })
                .catch((error) => {
                    setError('Error al enviar OTP: ' + error.message);
                    console.log(error);
                });
        } else {
            setError('Número de teléfono no válido. Por favor, ingresa un número de teléfono válido en formato internacional eje: +57.');
        }
    };

    const verifyOtp = () => {
        if (confirmationResult) {
            confirmationResult.confirm(otp)
                .then((result) => {
                    console.log('se verifico corectamente');
                    navegate('/home');

                })
                .catch((error) => {
                    setError('Error al verificar OTP: ' + error.message);
                    console.log(error);
                });
        } else {
            setError('Por favor solicita el OTP primero.');
        }
    };

    return (
        <div className="login-background">
            <div className="login-container">
                <div className="text-center mb-4">
                    <FontAwesomeIcon icon={faCloudSun} className="weather-icon" />
                    <h2 className="mt-2 text-primary">Login Clima</h2>
                </div>
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="form-control mb-3" placeholder="Número de celular" />
                <button onClick={requestOtp} className="btn btn-custom w-100 mb-3 text-white">Enviar OTP</button>
                {isValid ? (
                    <>
                        <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} className="form-control mb-3" placeholder="OTP" />
                        <button onClick={verifyOtp} className="btn btn-custom w-100 text-white">Verificar OTP</button>
                    </>
                ): (
                    <div></div>
                    )}

                <button onClick={register} className="Btn">
                </button>

                <div id="recaptcha-container"></div>
                {error && <p className="text-danger mt-3">{error}</p>}
            </div>
        </div>
    );
};

export default Login;
