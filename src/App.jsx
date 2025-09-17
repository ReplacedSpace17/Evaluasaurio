import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './views/Home/Inicio';
import Profile from './views/Docentes/Profile.jsx';

import CardVerticalProfile from './Components/ProfileCardVertical.jsx';
import CardHorizontalProfile from './Components/ProfileCardHrizontal.jsx';
import ViewSubmit from './views/Submit/ViewSubmit.jsx';
import ViewCouter from './views/Counter/ViewCounter.jsx';
import IntroSlides from './views/Intro/Intro.jsx';
import SplashScreen from './views/Loader/Loader.jsx';

import ViewExample from './Components/graphics/viewExample.jsx';

import useAnalytics from './hooks/useAnalytics.js';

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
        <Route path="/" element={<Home />} />
        <Route path="/teacher/:id" element={<Profile />} />
        <Route path="/view" element={<ViewExample />} />
        <Route path="/submit" element={<ViewSubmit />} />
        <Route path="/submit/:id" element={<ViewSubmit />} />
        <Route path="/realtime" element={<ViewCouter />} />
        <Route path="/intro" element={<IntroSlides />} />
        <Route path="/loader" element={<SplashScreen />} />
      </Routes>
    </Router>
  );
};

const AnalyticsWrapper = () => {
  useAnalytics();
  return null;
};


export default App;
