import React, { useState } from 'react';
import '../layout/css/registro.css';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun } from '@fortawesome/free-solid-svg-icons';

const Registro = () => {
    const [nombre, setNombre] = useState('');
    const [apellidos, setApellidos] = useState('');
    const [correo, setCorreo] = useState('');
    const [numeroCelular, setNumeroCelular] = useState('');
    const [mensajeExito, setMensajeExito] = useState('');
    const [mensajeError, setMensajeError] = useState('');

    const registrarUsuario = async () => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, correo, 'passwordTemporal');
            const user = userCredential.user;
            await setDoc(doc(db, "users", user.uid), {
                nombre,
                apellidos,
                correo,
                numeroCelular
            });
            setMensajeExito('Registro exitoso');
            setNombre('');
            setApellidos('');
            setCorreo('');
            setNumeroCelular('');
            setMensajeError(''); // Limpiar cualquier mensaje de error
        } catch (error) {
            setMensajeError('El Usuario ya Existe');
            setMensajeExito('');

        }
    };

    return (
        <div className="form-background">
            <div className="form-container">
                <button onClick={() => window.history.back()} className="btn-Volver">Volver</button>
                <div className="text-center mb-4 text-title">
                    <FontAwesomeIcon icon={faSun} className="weather-icon text-title" />
                    <h2 className="mt-2">Registro de Usuario</h2>
                </div>
                {mensajeExito && <p className="text-success text-center">{mensajeExito}</p>}
                {mensajeError && <p className="text-danger text-center">{mensajeError}</p>}
                <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} className="form-control mb-3" placeholder="Nombre" />
                <input type="text" value={apellidos} onChange={(e) => setApellidos(e.target.value)} className="form-control mb-3" placeholder="Apellidos" />
                <input type="text" value={correo} onChange={(e) => setCorreo(e.target.value)} className="form-control mb-3" placeholder="Correo" />
                <input type="number" value={numeroCelular} onChange={(e) => setNumeroCelular(e.target.value)} className="form-control mb-3" placeholder="Número de Celular" />
                <button onClick={registrarUsuario} className="btn btn-custom w-100 text-white">Registrar</button>
            </div>
        </div>
    );
};

export default Registro;
