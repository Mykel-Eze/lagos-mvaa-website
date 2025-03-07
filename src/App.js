// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
import ProtectedRoute from './components/ProtectedRoute';

import './index.css';
import './assets/css/fonts.css';
import './assets/css/styles.css';
import './assets/css/header.css';
import './assets/css/home.css';
import './assets/css/auth.css';
import './assets/css/footer.css';
import './assets/css/vehicle-registeration.css';

function App() {
  return (
    <Router>
      <div id="app-wrapper" className="flex flex-col min-h-screen">
        <Header />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Registration />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/services" element={<Services />} />
            <Route path="/services/number-plate-services" element={<NumberPlateServices />} />
            <Route path="/services/new-plate-id-steps" element={<NewPlateIdSteps />} />
            <Route path="/services/get-new-plate-id" element={<GetNewPlateId />} />
            <Route path="/services/vehicle-registration" element={<VehicleRegistration />} />
            <Route path="/services/other-agencies" element={<OtherAgencyDepartments />} />
          </Route>
        </Routes>

        {/* Toast Container */}
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
    </Router>
  );
}

export default App;