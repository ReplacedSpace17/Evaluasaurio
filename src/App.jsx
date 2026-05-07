import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Intro from './features/Intro/pages/Intro.jsx';
import SplashScreen from './components/loader/Loader.jsx';
import useAnalytics from './hooks/useAnalytics.js';

import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import "react-datepicker/dist/react-datepicker.css";


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
