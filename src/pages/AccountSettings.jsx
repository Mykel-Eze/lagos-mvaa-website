// src/pages/AccountSettings.jsx
import React, { useState, useEffect } from 'react';
import { Form, Input, Select, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { getProfile, updateAccount } from '../services/api';
import { toast } from 'react-toastify';
import lagosLGAs from '../data/lagosLGAs.json';
import LoadingSpinner from '../components/LoadingSpinner';
import ServicesLayout from '../layouts/ServicesLayout';

const { Option } = Select;

const AccountSettings = () => {
  const [ form ] = Form.useForm();
  const navigate = useNavigate();
  const [ isLoading, setIsLoading ] = useState(false);
  const [ isPageLoading, setIsPageLoading ] = useState(true);
  const [ hasChanges, setHasChanges ] = useState(false);
  const [ initialValues, setInitialValues ] = useState({});
  const [ isCompany, setIsCompany ] = useState(false);
  const [ verificationDetails, setVerificationDetails ] = useState({ nin: '', payerId: '', isVerified: false });
  // Full address from the backend profile — preserved so company updates can resend
  // fields the form doesn't edit (blockNumber, email, utilityBill, …).
  const [ loadedAddress, setLoadedAddress ] = useState({});
  // Full companyOwner from the profile — preserved so updates keep owner fields
  // (title, dob, NIN, …) we don't expose for editing.
  const [ loadedCompanyOwner, setLoadedCompanyOwner ] = useState({});

  // Load user profile data
  useEffect(() => {
    const loadProfile = async () => {
      try {
        // First try to get cached data
        const cachedUserData = sessionStorage.getItem('user');
        let userData = null;

        if (cachedUserData) {
          const parsed = JSON.parse(cachedUserData);
          userData = parsed.data || parsed.user || parsed;
        }

        // Try to get fresh data from the server
        try {
          const profileResponse = await getProfile();
          userData = profileResponse.data || profileResponse.user || profileResponse;
        } catch (error) {
          console.warn('Failed to fetch fresh profile data:', error);

          // Check if it's an authentication error
          if (error.status === 403 || error.status === 401) {
            toast.error('Session expired. Please login again.');
            navigate('/login');
            return;
          }

          // If we don't have cached data either, show error
          if (!userData) {
            toast.error('Unable to load profile data. Please try refreshing the page.');
            return;
          }

          // Show warning that we're using cached data
          toast.warning('Using cached profile data. Some information may be outdated.');
        }

        if (userData) {
          // Detect company account via user_type cookie (most reliable)
          const userType = sessionStorage.getItem('user_type');
          const companyAccount = userType === 'company';
          setIsCompany(companyAccount);

          // Company fields come from the backend profile (no client-side PII cache).

          const formData = {
            // Individuals edit first & last name separately; companies use a single rep name.
            firstName: companyAccount ? '' : (userData.firstName || ''),
            lastName: companyAccount ? '' : (userData.lastName || ''),
            name: companyAccount ? (userData.companyRepName || '').trim() : '',
            // Company owner name — editable for company accounts.
            ownerFirstName: companyAccount ? (userData.companyOwner?.firstName || '') : '',
            ownerLastName: companyAccount ? (userData.companyOwner?.surname || '') : '',
            email: userData.email || '',
            // Phone is only editable/saved for individual accounts.
            phone: companyAccount ? '' : (userData.phone || ''),
            street: userData.address?.street || '',
            lga: userData.address?.lga || '',
            // Company address fields — editable and required by the company update endpoint
            flatNumber: companyAccount ? (userData.address?.flatNumber || '') : '',
            landmark: companyAccount ? (userData.address?.landmark || '') : '',
            contactPhone: companyAccount ? (userData.address?.contactPhone || '') : '',
            // Company-specific (read-only, only set for company accounts)
            companyName: companyAccount ? (userData.companyName || '') : '',
            // Show the verified CAC (RC) / TIN values once verified, overriding signup values.
            companyRCNumber: companyAccount ? (userData.entityId?.rcNumber || userData.companyRCNumber || '') : '',
            companyTIN: companyAccount ? (userData.tinEntityId?.tin || userData.companyTIN || '') : '',
          };

          // Keep the full address & owner so a company update can resend fields we don't edit here.
          setLoadedAddress(userData.address || {});
          setLoadedCompanyOwner(userData.companyOwner || {});

          setVerificationDetails({
            nin: companyAccount ? (userData.companyOwner?.entityId?.nin || '') : (userData.entityId?.nin || ''),
            payerId: userData.payerId || '',
            isVerified: !!userData.is_verified,
          });

          setInitialValues(formData);
          form.setFieldsValue(formData);
        } else {
          toast.error('No user data found. Please login again.');
          navigate('/login');
        }
      } catch (error) {
        console.error('Failed to load profile data:', error);
        toast.error('Failed to load profile data');
        navigate('/login');
      } finally {
        setIsPageLoading(false);
      }
    };

    loadProfile();
  }, [ form, navigate ]);

  // Monitor form changes
  const handleFormChange = () => {
    const currentValues = form.getFieldsValue();
    const changed = Object.keys(currentValues).some(key =>
      currentValues[ key ] !== initialValues[ key ]
    );
    setHasChanges(changed);
  };

  const handleSubmit = async (values) => {
    setIsLoading(true);
    try {
      // The company update endpoint validates a fuller address (flatNumber, landmark,
      // contactPhone, email). Send those for company accounts, merging over the loaded
      // address so fields we don't edit here (blockNumber, utilityBill, …) are preserved.
      const address = isCompany
        ? {
            ...loadedAddress,
            street: values.street,
            lga: values.lga,
            state: 'Lagos',
            flatNumber: values.flatNumber,
            landmark: values.landmark,
            contactPhone: values.contactPhone,
            email: loadedAddress.email || values.email,
          }
        : {
            street: values.street,
            lga: values.lga,
            state: 'Lagos',
          };

      // The two endpoints accept different shapes. The company endpoint rejects
      // individual-only fields (firstName/lastName/phone) and companyRepPhone — its
      // whitelist accepts companyRepName (from the single Name field) and address. The
      // contact phone is edited via address.contactPhone instead. Individuals keep the
      // separate firstName/lastName/phone their endpoint requires.
      // The companyOwner update DTO accepts only a specific set of fields. Build it from an
      // allowlist so extra profile fields (otherName, entityId — the NIN verification blob,
      // …) don't trip the backend's strict whitelist. First/last name come from the form;
      // the rest are preserved from the loaded profile.
      const OWNER_FIELDS = [
        'title', 'sex', 'maritalStatus', 'dob', 'placeOfBirth',
        'nationalIdentificationNumber', 'driverLicenseNumber', 'passportNumber',
      ];
      const companyOwner = {
        firstName: (values.ownerFirstName || '').trim(),
        surname: (values.ownerLastName || '').trim(),
      };
      OWNER_FIELDS.forEach((k) => {
        if (loadedCompanyOwner[k] !== undefined && loadedCompanyOwner[k] !== null) {
          companyOwner[k] = loadedCompanyOwner[k];
        }
      });

      const updateData = isCompany
        ? {
            companyRepName: (values.name || '').trim(),
            companyOwner,
            address,
          }
        : {
            email: values.email,
            firstName: values.firstName,
            lastName: values.lastName,
            phone: values.phone,
            address,
          };

      // Call the update API
      await updateAccount(values.email, updateData);

      // Re-fetch the full profile so sessionStorage stays complete — the update response
      // omits some fields and can return companyOwner: null.
      try { await getProfile(); } catch { /* non-fatal */ }

      // Update initial values to reflect the saved state
      setInitialValues(values);
      setHasChanges(false);

      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Update account error:', error);
      const msg = error.exception_message ?
        (Array.isArray(error.exception_message)
          ? error.exception_message.join('\n')
          : error.exception_message)
        : 'Failed to update profile. Please try again.';
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    form.setFieldsValue(initialValues);
    setHasChanges(false);
  };

  if (isPageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <ServicesLayout title="Settings">
      <div className="account-settings-container">
        {/* Profile Information Section */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h1 className="agencies-link-header">Profile Information</h1>
            {/* Verified identity summary — shown on the right once fully verified */}
            {verificationDetails.isVerified && (verificationDetails.nin || verificationDetails.payerId) && (
              <div className="text-right text-sm text-gray-700 py-4">
                {verificationDetails.nin && (
                  <div className="sec-color">
                    <span className="text-gray-400 mr-2">NIN:</span>
                    <span className="font-semibold">{verificationDetails.nin}</span>
                  </div>
                )}
                {verificationDetails.payerId && (
                  <div className="sec-color">
                    <span className="text-gray-400 mr-2">Payer ID:</span>
                    <span className="font-semibold">{verificationDetails.payerId}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            onValuesChange={handleFormChange}
            className="space-y-6 settings-wrapper"
            initialValues={initialValues}
          >
            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-1 gap-x-10 max-w-4xl">
              {/* Name — company shows rep name + owner name; individuals show first/last */}
              {isCompany ? (
                <>
                  <Form.Item
                    label="Owner First Name"
                    name="ownerFirstName"
                    rules={[ { required: true, message: "Please enter the owner's first name" } ]}
                  >
                    <Input
                      placeholder="Enter the business owner's first name"
                      size="large"
                      className="rounded-md"
                    />
                  </Form.Item>

                  <Form.Item
                    label="Owner Last Name"
                    name="ownerLastName"
                    rules={[ { required: true, message: "Please enter the owner's last name" } ]}
                  >
                    <Input
                      placeholder="Enter the business owner's last name"
                      size="large"
                      className="rounded-md"
                    />
                  </Form.Item>

                  <Form.Item
                    label="Company Rep Name"
                    name="name"
                    rules={[ { required: true, message: 'Please enter the company representative name' } ]}
                  >
                    <Input
                      placeholder="Enter the company representative name"
                      size="large"
                      className="rounded-md"
                    />
                  </Form.Item>
                </>
              ) : (
                <>
                  <Form.Item
                    label="First Name"
                    name="firstName"
                    rules={[ { required: true, message: 'Please enter your first name' } ]}
                  >
                    <Input
                      placeholder="Enter your first name"
                      size="large"
                      className="rounded-md"
                    />
                  </Form.Item>

                  <Form.Item
                    label="Last Name"
                    name="lastName"
                    rules={[ { required: true, message: 'Please enter your last name' } ]}
                  >
                    <Input
                      placeholder="Enter your last name"
                      size="large"
                      className="rounded-md"
                    />
                  </Form.Item>
                </>
              )}

              {/* Email Address */}
              <Form.Item
                label="Email Address"
                name="email"
                rules={[
                  { required: true, message: 'Please enter your email address' },
                  { type: 'email', message: 'Please enter a valid email address' },
                ]}
              >
                <Input
                  placeholder="Enter your email address"
                  size="large"
                  className="rounded-md"
                  disabled // Email should not be editable as it's used as identifier
                />
              </Form.Item>

              {/* Phone Number — only editable/saved for individual accounts */}
              {!isCompany && (
                <Form.Item
                  label="Phone Number"
                  name="phone"
                  rules={[ { required: true, message: 'Please enter your phone number' } ]}
                >
                  <Input
                    placeholder="+2348100000000"
                    size="large"
                    className="rounded-md"
                  />
                </Form.Item>
              )}

              {/* Address Fields */}
              <Form.Item
                label="Street"
                name="street"
                rules={[ { required: true, message: 'Please enter your street address' } ]}
              >
                <Input
                  placeholder="Enter your street address"
                  size="large"
                  className="rounded-md"
                />
              </Form.Item>

              <Form.Item
                label="LGA"
                name="lga"
                rules={[ { required: true, message: 'Please select your LGA' } ]}
              >
                <Select
                  placeholder="Select your LGA"
                  size="large"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    (option?.children || '').toLowerCase().includes(input.toLowerCase())
                  }
                  className="rounded-md"
                >
                  {lagosLGAs.lagosLGAs.map(lga => (
                    <Option key={lga} value={lga}>
                      {lga}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </div>

            {/* Company address — required by the company update endpoint */}
            {isCompany && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-1 gap-x-10 max-w-4xl">
                <Form.Item
                  label="Flat Number"
                  name="flatNumber"
                  rules={[
                    { required: true, message: 'Please enter your flat number' },
                    { min: 2, message: 'Flat number must be at least 2 characters' },
                  ]}
                >
                  <Input placeholder="Enter flat number" size="large" className="rounded-md" />
                </Form.Item>

                <Form.Item
                  label="Landmark"
                  name="landmark"
                  rules={[
                    { required: true, message: 'Please enter a nearby landmark' },
                    { min: 2, message: 'Landmark must be at least 2 characters' },
                  ]}
                >
                  <Input placeholder="Enter a nearby landmark" size="large" className="rounded-md" />
                </Form.Item>

                <Form.Item
                  label="Contact Phone"
                  name="contactPhone"
                  rules={[ { required: true, message: 'Please enter a contact phone number' } ]}
                >
                  <Input placeholder="+2348100000000" size="large" className="rounded-md" />
                </Form.Item>
              </div>
            )}

            {/* NIN & Payer ID appear in the header summary; CAC/TIN are in Company Details below. */}

            {/* Company-specific fields */}
            {isCompany && (
              <>
                <h3 className="text-base font-semibold text-gray-700 mt-4 mb-2">Company Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-1 gap-x-10 max-w-4xl">
                  <Form.Item label="Company Name" name="companyName">
                    <Input size="large" disabled className="rounded-md" />
                  </Form.Item>
                  <Form.Item label="RC Number" name="companyRCNumber">
                    <Input size="large" disabled className="rounded-md" />
                  </Form.Item>
                  <Form.Item label="TIN" name="companyTIN">
                    <Input size="large" disabled className="rounded-md" />
                  </Form.Item>
                </div>
              </>
            )}

            <div className="settings-button-wrapper">
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Button
                  onClick={handleCancel}
                  htmlType="button"
                  className="w-full sm:w-[125px] h-[43px] cancel-btn text-[12px] uppercase"
                  disabled={!hasChanges}
                >
                  CANCEL
                </Button>

                <Button
                  htmlType="submit"
                  className="w-full sm:w-[230px] h-[43px] btn-hover-bold submit-btn text-white text-[12px] uppercase"
                  disabled={!hasChanges || isLoading}
                >
                  {isLoading ? (
                    <LoadingSpinner size="small" color="#ffffff" className="mx-auto" />
                  ) : (
                    "SAVE CHANGES"
                  )}
                </Button>
              </div>
            </div>
          </Form>
        </div>
      </div>
    </ServicesLayout>
  );
};

export default AccountSettings;
