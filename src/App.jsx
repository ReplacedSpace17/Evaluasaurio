import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomeDocentes from './views/Docentes_home/Home.jsx';
import Profile from './views/Docentes/Profile.jsx';

import CardVerticalProfile from './Components/ProfileCardVertical.jsx';
import CardHorizontalProfile from './Components/ProfileCardHrizontal.jsx';
import ViewSubmit from './views/Submit/ViewSubmit.jsx';
import ViewCouter from './views/Counter/ViewCounter.jsx';
import Intro from './views/Intro/Intro.jsx';
import SplashScreen from './views/Loader/Loader.jsx';

import ViewExample from './Components/graphics/viewExample.jsx';

import useAnalytics from './hooks/useAnalytics.js';
import EstadisticasVisitas from './views/Visitas.jsx';
import HomeDocs from './views/Docs/HomeDocs.jsx';
import Menu from './views/Menu/Menu.jsx';
import HomeDepartamentos from './views/Departamentos_home/Home_departamentos.jsx';

import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

import Halloween from './views/Eventos/Halloween/Halloween.jsx';

const App = () => {
  const [loading, setLoading] = useState(true);

  if (loading) {
    return <SplashScreen onFinish={() => setLoading(false)} />;
  }

  return (
    <Router>
      {/** Hooks que dependen del Router */}
      <AnalyticsWrapper />

      <Routes>
        <Route path="/" element={<Intro />} />
        <Route path="/evaluaciones/docentes" element={<HomeDocentes />} />
        <Route path="/teacher/:id" element={<Profile />} />
        <Route path="/view" element={<ViewExample />} />
        <Route path="/submit" element={<ViewSubmit />} />
        <Route path="/submit/:id" element={<ViewSubmit />} />
        <Route path="/realtime" element={<ViewCouter />} />
        <Route path="/intro" element={<Intro />} />
        <Route path="/loader" element={<SplashScreen />} />
        <Route path="/admin" element={<EstadisticasVisitas />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/evaluaciones/departamentos" element={<HomeDepartamentos />} />
        <Route path="/docs" element={<HomeDocs />} />
        <Route path="/events/halloween" element={<Halloween />} />
      </Routes>
    </Router>
  );
};

const AnalyticsWrapper = () => {
  useAnalytics();
  return null;
};


export default App;
