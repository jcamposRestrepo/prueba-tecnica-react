import React, { useEffect, useState } from "react";
import { LocationOn, ArrowForwardIos, ArrowBackIos, Cloud, WbSunny, Thermostat, Air, WaterDrop, WbSunnySharp,
    Schedule, Favorite, Explore, Settings, WbCloudy, HdrWeakTwoTone } from '@mui/icons-material';
import ThunderstormSharpIcon from '@mui/icons-material/ThunderstormSharp';
import iconClima1 from "../layout/img/116.svg";
import iconClima2 from "../layout/img/389.svg";
import axios from "axios";
import Grafic from './Grafic'
import {signOut} from "firebase/auth";
import {auth} from "../firebase";
import {useNavigate} from "react-router-dom";
import {OverlayTrigger} from "react-bootstrap";
import {Tooltip} from "@mui/material";

export default function Home() {
    const [weather, setWeather] = useState(null);
    const [error, setError] = useState(null);
    const [today, setToday] = useState('');
    const [weatherName, setWeatherName] = useState('Ibague');
    const [isEditing, setIsEditing] = useState(false);
    const [tempWeatherName, setTempWeatherName] = useState('Ibague');
    const [time, setTime] = useState('');
    const navegate = useNavigate();

    const renderTooltip = (props) => (
        <Tooltip id="button-tooltip" {...props}>
            Cerrar Session
        </Tooltip>
    );
    const capitalize = (str) => {
        if (!str) return '';
        // Si la palabra está toda en mayúsculas se ajusta
        if (str === str.toUpperCase()) {
            return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
        }
        // Si la primera letra ya está en mayúscula la deja como esta
        if (str.charAt(0) === str.charAt(0).toUpperCase()) {
            return str;
        }
        // si esta en minuscula la ajusta con la primera en mayuscula
        return str.charAt(0).toUpperCase() + str.slice(1);
    };
    const kelvinToCelsius = (kelvin) => {
        return Math.floor(kelvin - 273.15);
    };
    const feelsLike = (kelvin) => {
        return Math.floor(kelvin - 273.15); // Convierte y redondea a dos decimales
    };
    const formatTime = (date) => {
        let hours = date.getHours();
        let minutes = date.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        const strTime = hours + ':' + minutes + ' ' + ampm;
        return strTime;
    };
    const handleSpanClick = () => {
        setIsEditing(true);
    };

    const handleInputChange = (e) => {
        setTempWeatherName(e.target.value);
    };

    const handleInputBlur = () => {
        setIsEditing(false);
        setWeatherName(capitalize(tempWeatherName));
    };

    const fetchWeather = (city) => {
        const apiKey = 'b88b88c577c13c91f95487a6ca2fc2b2'; // Reemplaza con tu clave API
        const date = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDate = date.toLocaleDateString('es-ES', options); // Cambia 'es-ES' por tu configuración local si lo prefieres en otro idioma.
        setToday(formattedDate);
        setTime(formatTime(date));

        axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`)
            .then(response => {
                setWeather(response.data);
                setError(null);
                setWeatherName(response.data.name);
            })
            .catch(error => {
                setError('Ciudad no encontrada: ' + error);
                setWeather(null);
            });
    };
     const sessionOff = () => {
         signOut(auth).then(() => {
             console.log("Sesión cerrada exitosamente");
             navegate('/')
         }).catch(error => {
             console.log("Error al cerrar sesión", error);
         });
     }

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchWeather(weatherName);
        }, 1000);

        return () => clearTimeout(delayDebounceFn);
    }, [fetchWeather,weatherName]);
    if (error) return (
        <>
            <input className="form-control"
                   type="text"
                   value={tempWeatherName}
                   onChange={handleInputChange}
                   onBlur={handleInputBlur}
                   autoFocus
            />
            <div>Ciudad no encontrada</div>
        </>
    );
    if (!weather) return <div>Cargando...</div>;
    return (
        <div className={`container-fluid p-4 ${weather.weather[0].main === 'Clear' ? 'bg-clear' : 'bg-cloudy'}`}>
            <div className="row">
                <div className="col-12 row">
                    <div className="col-10 fs-2">
                        {isEditing ? (
                            <input className="form-control"
                                   type="text"
                                   value={tempWeatherName}
                                   onChange={handleInputChange}
                                   onBlur={handleInputBlur}
                                   autoFocus
                            />
                        ) : (
                            <span className="location" onClick={handleSpanClick}>
                                <LocationOn className="iconLocation" /> {weatherName} <ArrowForwardIos />
                            </span>
                        )}
                    </div>
                    <div className="col-2 text-center desktop-only">
                        <OverlayTrigger
                            placement="bottom"
                            delay={{ show: 250, hide: 400 }}
                            overlay={renderTooltip}
                        >
                            <button className="sesion" onClick={sessionOff}>
                            </button>
                        </OverlayTrigger>
                    </div>
                </div>
                <div className="col-12 row p-0 m-0 textJusti">
                    <div className="col.sm-12 col-md-8 col-lg-8 row">
                        <div className="col-12 pt-5">
                            <h2 className="font-temp">{weather.weather[0].description}</h2>
                        </div>
                        <div className="col-12 pt-5">
                            <h2 className="font-temp" >{kelvinToCelsius(weather.main.temp)}°C</h2>
                            <p>{today}</p>
                        </div>
                    </div>
                    <div className="col.sm-12 col-md-4 col-lg-4 row">
                        <div className="col-12 text-center">
                            <img className="iconClima" src={weather.weather[0].main === 'Clear' ? iconClima1 : iconClima2} alt="clima" />
                        </div>
                    </div>
                </div>
                <div className="col-12 row m-0 p-0">
                    <div className="col-sm-12 col-md-2 col-lg-1 row mobile-only">
                        <div className={`col-12 text-center ${weather.weather[0].main === 'Clear' ? 'bg-iten-clear' : 'bg-item-cloud'}`}>
                            <div className="col col-md-12 col-lg-12 mb-4 mobile-only">

                                <OverlayTrigger
                                    placement="bottom"
                                    delay={{ show: 250, hide: 400 }}
                                    overlay={renderTooltip}
                                >
                                    <button className="sesion" onClick={sessionOff}>
                                    </button>
                                </OverlayTrigger>

                            </div>
                            <div className="col-sm col-md-12 col-lg-12">
                                {weather.weather[0].main === 'Clear' ? (<Cloud className="fontItem" />) : (<WbSunny className="fontItem" />)}
                                <p>{weather.weather[0].main}</p>
                            </div>
                            <div className="col-sm col-md-12 col-lg-12">
                                <Explore className="fontItem" />
                                <p>explore</p>
                            </div>
                            <div className="col-sm col-md-12 col-lg-12">
                                <LocationOn className="fontItem" />
                                <p>cities</p>
                            </div>
                            <div className="col-sm col-md-12 col-lg-12">
                                <Settings className="fontItem" />
                                <p>settings</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-7 col-sm-12 col-lg-8 row mx-2">
                        <div className={`col-12 row p-3 m-1 mobile-only ${weather.weather[0].main === 'Clear' ? 'bg-iten-clear' : 'bg-item-cloud'}`}>
                            <div className="col-12 fs-2">
                                <Favorite /> Activities in your area
                            </div>
                            <div className="col-12 row m-0 p-0">
                                <div className="col imagen1 border">
                                    <span className="spanImagen">500m away</span>
                                </div>
                                <div className="col imagen2 border">
                                    <span className="spanImagen">1.5km away</span>
                                </div>
                                <div className="col imagen3 border">
                                    <span className="spanImagen">3km away</span>
                                </div>
                                <div className="col imagen4 border">
                                    <span className="spanImagen">2km away</span>
                                </div>
                            </div>
                        </div>
                        <div className={`col-12 my-2 ${weather.weather[0].main === 'Clear' ? 'bg-iten-clear' : 'bg-item-cloud'}`}>
                            <Schedule /> 24-hour forecast
                            <Grafic/>
                        </div>
                    </div>
                    <div className={`col-md-3 col-sm-12 col-lg-3 row mx-1 ${weather.weather[0].main === 'Clear' ? 'bg-iten-clear' : 'bg-item-cloud'}`}>
                        <div className="col-12 row p-0 m-0 text-center">
                            <div className="col-1">
                                <ArrowBackIos/>
                            </div>
                            <div className="col-2">
                                FRI
                                <p><WbCloudy className="fs-2"/></p>
                            </div>
                            <div className="col-2">
                                SAT
                                <p><WbSunnySharp className="fs-2"/></p>
                            </div>
                            <div className="col-2">
                                SUN
                                <p><ThunderstormSharpIcon className="fs-1"/></p>
                            </div>
                            <div className="col-2">
                                MON
                                <p><HdrWeakTwoTone className="fs-2"/></p>
                            </div>
                            <div className="col-2">
                                TUES
                                <p><ThunderstormSharpIcon className="fs-2"/></p>
                            </div>
                            <div className="col-1">
                                <ArrowForwardIos/>
                            </div>
                        </div>
                        <div className="col-12 text-center">{time}</div>
                        <div className="col-12 row m-0 p-0">
                            <div className="col-12">AIR CONDITION</div>
                            <div className="col-12">
                                <Thermostat/>Real Feel
                                <p className="mx-4">{feelsLike(weather.main.feels_like)}°</p>
                            </div>
                            <div className="col-12">
                                <Air/> Wind
                                <p className="mx-4">{weather.wind.speed} km/hr</p>
                            </div>
                            <div className="col-12">
                                <WaterDrop/> Chance of rain
                                <p className="mx-4">{weather.main.humidity}%</p>
                            </div>
                            <div className="col-12">
                                <WbSunnySharp/> UV Index
                                <p className="mx-4">{weather.visibility}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
