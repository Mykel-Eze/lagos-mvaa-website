// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Services from './pages/Services';
import Registration from './pages/Registration';
import Home from './pages/Home';
import NumberPlateServices from './pages/NumberPlateServices';
import NewPlateIdSteps from './pages/NewPlateIdSteps';
import GetNewPlateId from './pages/GetNewPlateId';
import VehicleRegistration from './pages/VehicleRegistration';
import OtherAgencyDepartments from './pages/OtherAgencyDepartments';

import './index.css';
import './assets/css/fonts.css'
import './assets/css/styles.css'
import './assets/css/header.css'
import './assets/css/home.css'
import './assets/css/auth.css'
import './assets/css/footer.css'
import './assets/css/vehicle-registeration.css'


function App() {
  return (
    <Router>
      <div id="app-wrapper" className="flex flex-col min-h-screen">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/services" element={<Services />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/services/number-plate-services" element={<NumberPlateServices />} />
          <Route path="/services/new-plate-id-steps" element={<NewPlateIdSteps />} />
          <Route path="/services/get-new-plate-id" element={<GetNewPlateId />} />
          <Route path="/services/vehicle-registration" element={<VehicleRegistration />} />
          <Route path="/services/other-agencies" element={<OtherAgencyDepartments />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;