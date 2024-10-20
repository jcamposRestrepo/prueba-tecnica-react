import React, { useState } from 'react';
import { auth, RecaptchaVerifier, signInWithPhoneNumber } from '../firebase';

const CambiarNumero = () => {
    const [nuevoNumeroCelular, setNuevoNumeroCelular] = useState('');

    const cambiarNumero = async () => {
        const user = auth.currentUser;
        if (!user) return console.error("Ningún usuario está autenticado");

        const recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {}, auth);
        try {
            const confirmationResult = await signInWithPhoneNumber(auth, nuevoNumeroCelular, recaptchaVerifier);
            const codigo = prompt('Introduce el código OTP para verificar tu nuevo número de celular');
            await confirmationResult.confirm(codigo);
            await user.updatePhoneNumber(confirmationResult.verificationId);
            console.log("Número de celular actualizado");
        } catch (error) {
            console.error("Error actualizando el número de celular: ", error);
        }
    };

    return (
        <div>
            <input type="text" value={nuevoNumeroCelular} onChange={e => setNuevoNumeroCelular(e.target.value)} placeholder="Nuevo Número de Celular" />
            <div id="recaptcha-container"></div>
            <button onClick={cambiarNumero}>Cambiar Número</button>
        </div>
    );
};

export default CambiarNumero;
