// src/pages/AccountSettings.jsx
import React, { useState, useEffect } from 'react';
import { Form, Input, Select, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { getProfile, updateAccount } from '../services/api';
import { toast } from 'react-toastify';
import countryCodes from '../data/countryCodes.json';
import lagosLGAs from '../data/lagosLGAs.json';
import LoadingSpinner from '../components/LoadingSpinner';
import Cookies from 'js-cookie';
import ServicesLayout from '../layouts/ServicesLayout';

const { Option } = Select;

const AccountSettings = () => {
  const [ form ] = Form.useForm();
  const navigate = useNavigate();
  const [ isLoading, setIsLoading ] = useState(false);
  const [ isPageLoading, setIsPageLoading ] = useState(true);
  const [ hasChanges, setHasChanges ] = useState(false);
  const [ initialValues, setInitialValues ] = useState({});

  // Load user profile data
  useEffect(() => {
    const loadProfile = async () => {
      try {
        // First try to get cached data
        const cachedUserData = Cookies.get('user');
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
          // Parse phone number to separate country code and number
          const phoneMatch = userData.phone?.match(/^(\+\d{1,4})(.*)$/);
          const countryCode = phoneMatch ? phoneMatch[ 1 ] : '+234';
          const phoneNumber = phoneMatch ? phoneMatch[ 2 ] : userData.phone || '';

          const formData = {
            firstName: userData.firstName || '',
            lastName: userData.lastName || '',
            email: userData.email || '',
            countryCode: countryCode,
            phoneNumber: phoneNumber,
            street: userData.address?.street || '',
            lga: userData.address?.lga || '',
          };

          // console.log('Setting initial values:', formData);
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
      // Format the data for the API
      const updateData = {
        email: values.email,
        firstName: values.firstName,
        lastName: values.lastName,
        phone: values.countryCode + values.phoneNumber,
        address: {
          street: values.street,
          lga: values.lga,
          state: "Lagos",
        },
      };

      // Call the update API
      await updateAccount(values.email, updateData);

      // Update the user cookie with new data
      const existingUser = Cookies.get('user');
      const updatedUser = {
        ...(existingUser ? JSON.parse(existingUser) : {}),
        ...updateData,
      };
      Cookies.set('user', JSON.stringify(updatedUser), {
        secure: window.location.protocol === 'https:',
        sameSite: 'strict'
      });

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
          <h1 className="agencies-link-header">Profile Information</h1>

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
              {/* Name Fields */}
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

              {/* Phone Number */}
              <Form.Item label="Phone Number">
                <div className="flex">
                  <Form.Item
                    name="countryCode"
                    noStyle
                    initialValue="+234"
                  >
                    <Select
                      size="large"
                      style={{ width: '100px', textAlign: 'center' }}
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        (option?.data?.country?.toLowerCase() || '').includes(input.toLowerCase()) ||
                        (option?.data?.code?.toLowerCase() || '').includes(input.toLowerCase())
                      }
                      optionLabelProp="label"
                      className="rounded-md"
                    >
                      {countryCodes.countryCodes.map(country => (
                        <Select.Option
                          key={country.code}
                          value={country.code}
                          label={country.code}
                          data={country}
                        >
                          <div className="flex items-center">
                            <span>{country.code}</span>
                            <span className="ml-2 text-gray-500 text-xs">{country.country}</span>
                          </div>
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                  <Form.Item
                    name="phoneNumber"
                    noStyle
                    rules={[ { required: true, message: 'Please enter your phone number' } ]}
                  >
                    <Input
                      placeholder="8100000000"
                      size="large"
                      className="ml-2 flex-1 rounded-md"
                    />
                  </Form.Item>
                </div>
              </Form.Item>

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