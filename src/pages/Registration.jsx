import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import IndividualRegistrationForm from '../components/IndividualRegistrationForm';
import CompanyRegistrationForm from '../components/CompanyRegistrationForm';
import EmailVerificationComponent from '../components/EmailVerificationComponent';
import { register, registerCompany, resendVerificationEmail } from '../services/api';
import { toast } from 'react-toastify';

const Registration = () => {
  const navigate = useNavigate();
  const [ isLoading, setIsLoading ] = useState(false);
  const [ showVerification, setShowVerification ] = useState(false);
  const [ userEmail, setUserEmail ] = useState('');
  const [ isResending, setIsResending ] = useState(false);
  const [ resendTimer, setResendTimer ] = useState(0);
  const [ activeTab, setActiveTab ] = useState('individual'); // 'individual' or 'company'

  // Timer effect for resend button
  useEffect(() => {
    let interval;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer(timer => timer - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [ resendTimer ]);

  const handleIndividualSubmit = async (values) => {
    setIsLoading(true);
    try {
      // Format the address object as required by the API
      const userData = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        phone: values.countryCode + values.phoneNumber,
        address: {
          street: values.street,
          lga: values.lga,
          state: "Lagos",
        },
        password: values.password,
      };

      // Call the register API
      await register(userData);

      // Store email and show verification component
      setUserEmail(values.email);
      setShowVerification(true);
      setResendTimer(59); // Start 59 seconds timer

      toast.success('Registration successful! Please check your email to verify your account.');
    } catch (error) {
      console.error(error)
      const msg = error.exception_message ? Array.isArray(error.exception_message)
        ? error.exception_message.join('\n') : error.exception_message : error.message || 'Registration failed. Please try again.';
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompanySubmit = async (values) => {
    setIsLoading(true);
    try {
      const companyData = {
        companyName: values.companyName,
        companyRCNumber: values.companyRCNumber,
        companyTIN: values.companyTIN,
        companyRepName: values.companyRepName,
        companyRepPhone: values.companyRepPhone,
        companyRepEmail: values.companyRepEmail,
        address: {
          flatNumber: values.flatNumber,
          blockNumber: values.blockNumber,
          street: values.street,
          landmark: values.landmark,
          lga: values.lga,
          state: "Lagos", // Defaulting to Lagos based on UI
          contactPhone: values.contactPhone,
          email: values.email,
          utilityBillDescription: values.utilityBillDescription
        },
        companyOwner: {
          title: values.ownerTitle,
          surname: values.ownerSurname,
          otherName: values.ownerOtherName,
          sex: values.ownerSex,
          maritalStatus: values.ownerMaritalStatus,
          dob: values.ownerDob ? values.ownerDob.format('YYYY-MM-DD') : null,
          placeOfBirth: values.ownerPlaceOfBirth,
          nationalIdentificationNumber: values.ownerNIN,
          driverLicenseNumber: values.ownerDriverLicense,
          passportNumber: values.ownerPassport
        },
        password: values.password,
        email: values.email
      };

      await registerCompany(companyData);

      setUserEmail(values.email);
      setShowVerification(true);
      setResendTimer(59);

      toast.success('Company Registration successful! Please check email to verify.');

    } catch (error) {
      console.error(error)
      const msg = error.exception_message ? Array.isArray(error.exception_message)
        ? error.exception_message.join('\n') : error.exception_message : error.message || 'Registration failed.';
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!userEmail) {
      toast.error('Email address not found. Please try registering again.');
      return;
    }

    setIsResending(true);
    try {
      await resendVerificationEmail(userEmail);
      toast.success('Verification email sent! Please check your inbox.');
      setResendTimer(59); // Reset timer
    } catch (error) {
      toast.error('Failed to resend verification email. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <AuthLayout title={showVerification ? "Verify Your Email" : "Get Started"}>
      {showVerification ? (
        <EmailVerificationComponent
          userEmail={userEmail}
          onResendVerification={handleResendVerification}
          isResending={isResending}
          resendTimer={resendTimer}
        />
      ) : (
        <>
          {/* Tabs */}
          <div className="flex border-b border-gray-200 mb-6">
            <button
              className={`flex-1 py-2 px-4 text-center font-medium focus:outline-none ${activeTab === 'individual'
                  ? 'text-green-700 border-b-2 border-green-700'
                  : 'text-gray-500 hover:text-gray-700'
                }`}
              onClick={() => setActiveTab('individual')}
            >
              Individual
            </button>
            <button
              className={`flex-1 py-2 px-4 text-center font-medium focus:outline-none ${activeTab === 'company'
                  ? 'text-green-700 border-b-2 border-green-700'
                  : 'text-gray-500 hover:text-gray-700'
                }`}
              onClick={() => setActiveTab('company')}
            >
              Company
            </button>
          </div>

          {activeTab === 'individual' ? (
            <IndividualRegistrationForm
              onSubmit={handleIndividualSubmit}
              isLoading={isLoading}
            />
          ) : (
            <CompanyRegistrationForm
              onSubmit={handleCompanySubmit}
              isLoading={isLoading}
            />
          )}
        </>
      )}
    </AuthLayout>
  );
};

export default Registration;