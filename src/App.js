// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Header from './components/Header';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Registration from './pages/Registration';
import EmailVerificationSuccessful from './pages/EmailVerificationSuccessful';

import Dashboard from './pages/Dashboard';
import Services from './pages/Services';
import Home from './pages/Home';
import NumberPlateServices from './pages/NumberPlateServices';
import NewPlateIdSteps from './pages/NewPlateIdSteps';
import GetNewPlateId from './pages/GetNewPlateId';
import VehicleRegistration from './pages/VehicleRegistration';
import OtherAgencyDepartments from './pages/OtherAgencyDepartments';
import ProtectedRoute from './components/ProtectedRoute';

import AccountSettings from './pages/AccountSettings';
import IndividualVerification from './pages/IndividualVerification';
import CompanyVerification from './pages/CompanyVerification';

// Billing pages
import TransactionHistory from './pages/TransactionHistory';
import TransactionDetail from './pages/TransactionDetail';
import PaymentReturnHandler from './pages/PaymentReturnHandler';

import './index.css';
import './assets/css/fonts.css';
import './assets/css/styles.css';
import './assets/css/header.css';
import './assets/css/home.css';
import './assets/css/auth.css';
import './assets/css/footer.css';
import './assets/css/vehicle-registeration.css';
import './assets/css/verification.css';
import './assets/css/billing.css';

function App() {
  return (
    <Router>
      <div id="app-wrapper" className="flex flex-col min-h-screen">
        <Header />
        <Routes>
          {/* ── Public Routes ──────────────────────────────────────── */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/verification-successful" element={<EmailVerificationSuccessful />} />

          {/*
            Payment callback — intentionally public so gateways can redirect
            here without an active cookie session. Auth state is validated
            inside PaymentReturnHandler via the transaction reference.
          */}
          <Route path="/payment/callback" element={<PaymentReturnHandler />} />

          {/* ── Protected Routes ───────────────────────────────────── */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/services" element={<Services />} />
            <Route path="/services/number-plate-services" element={<NumberPlateServices />} />
            <Route path="/services/new-plate-id-steps" element={<NewPlateIdSteps />} />
            <Route path="/services/get-new-plate-id" element={<GetNewPlateId />} />
            <Route path="/services/vehicle-registration" element={<VehicleRegistration />} />
            <Route path="/services/other-agencies" element={<OtherAgencyDepartments />} />

            <Route path="/account-settings" element={<AccountSettings />} />
            <Route path="/verify/individual" element={<IndividualVerification />} />
            <Route path="/verify/company" element={<CompanyVerification />} />

            {/* Billing */}
            <Route path="/transactions" element={<TransactionHistory />} />
            <Route path="/transactions/:id" element={<TransactionDetail />} />
          </Route>
        </Routes>

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