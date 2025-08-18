import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './views/Home/Inicio';
import Profile from './views/Docentes/Profile.jsx';

import CardVerticalProfile from './Components/ProfileCardVertical.jsx';
import CardHorizontalProfile from './Components/ProfileCardHrizontal.jsx';
import ViewSubmit from './views/Submit/ViewSubmit.jsx';
import ViewCouter from './views/Counter/ViewCounter.jsx';


import ViewExample from './Components/graphics/viewExample.jsx';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/teacher/:id" element={<Profile/>} />
        <Route path="/view" element={<ViewExample/>} />
        <Route path="/submit" element={<ViewSubmit/>} />
        <Route path="/submit/:id" element={<ViewSubmit/>} />
        <Route path="/realtime" element={<ViewCouter/>} />

      </Routes>
    </Router>
  );
};

export default App;
