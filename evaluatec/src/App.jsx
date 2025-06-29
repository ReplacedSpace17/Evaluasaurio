import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './views/Home/Inicio';
import Profile_Teacher from './views/Docentes/Perfil';
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/docente/:id" element={<Profile_Teacher/>} />
      </Routes>
    </Router>
  );
};

export default App;
