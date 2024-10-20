import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Registro from './components/Registro';
import Login from './components/Login';
import CambiarNumero from './components/CambiarNumero';
import Home from './components/Home';
import './App.css';

function App() {
  return (
      <Router>
          <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/login" element={<Login/>} />
              <Route path="/home" element={<Home />} />
              <Route path="/registro" element={<Registro />} />
              <Route path="/cambiar-numero" element={<CambiarNumero/>} />
          </Routes>
      </Router>

  );
}

export default App;
