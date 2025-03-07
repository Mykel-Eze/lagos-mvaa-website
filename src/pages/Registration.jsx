import React, { useState } from 'react';
import { Form, Input, Button } from 'antd';
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import { register } from '../services/api';
import { toast } from 'react-toastify';

const Registration = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleSubmit = async (values) => {
    try {
      // Format the address object as required by the API
      const userData = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        phone: values.phone,
        address: {
          street: values.street,
          city: values.city,
          state: values.state,
          postalCode: values.postalCode,
          country: values.country,
        },
        password: values.password,
      };

      // Call the register API
      await register(userData);
      toast.success('Registration successful!');
      navigate('/login'); // Redirect to the login page
    } catch (error) {
      toast.error(error.error || 'Registration failed. Please try again.');
    }
  };

  return (
    <AuthLayout title="Get Started">
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        {/* First Name */}
        <Form.Item
          label="First Name"
          name="firstName"
          rules={[{ required: true, message: 'Please enter your first name' }]}
          className="mb-6"
        >
          <Input placeholder="Enter your first name" size="large" />
        </Form.Item>

        {/* Last Name */}
        <Form.Item
          label="Last Name"
          name="lastName"
          rules={[{ required: true, message: 'Please enter your last name' }]}
          className="mb-6"
        >
          <Input placeholder="Enter your last name" size="large" />
        </Form.Item>

        {/* Email Address */}
        <Form.Item
          label="Email Address"
          name="email"
          rules={[
            { required: true, message: 'Please enter your email address' },
            { type: 'email', message: 'Please enter a valid email address' },
          ]}
          className="mb-6"
        >
          <Input placeholder="Enter your email address" size="large" />
        </Form.Item>

        {/* Phone Number */}
        <Form.Item
          label="Phone Number"
          name="phone"
          rules={[{ required: true, message: 'Please enter your phone number' }]}
          className="mb-6"
        >
          <Input placeholder="Enter your phone number" size="large" />
        </Form.Item>

        {/* Address Fields */}
        <Form.Item
          label="Street"
          name="street"
          rules={[{ required: true, message: 'Please enter your street address' }]}
          className="mb-6"
        >
          <Input placeholder="Enter your street address" size="large" />
        </Form.Item>

        <Form.Item
          label="City"
          name="city"
          rules={[{ required: true, message: 'Please enter your city' }]}
          className="mb-6"
        >
          <Input placeholder="Enter your city" size="large" />
        </Form.Item>

        <Form.Item
          label="State"
          name="state"
          rules={[{ required: true, message: 'Please enter your state' }]}
          className="mb-6"
        >
          <Input placeholder="Enter your state" size="large" />
        </Form.Item>

        <Form.Item
          label="Postal Code"
          name="postalCode"
          rules={[{ required: true, message: 'Please enter your postal code' }]}
          className="mb-6"
        >
          <Input placeholder="Enter your postal code" size="large" />
        </Form.Item>

        <Form.Item
          label="Country"
          name="country"
          rules={[{ required: true, message: 'Please enter your country' }]}
          className="mb-6"
        >
          <Input placeholder="Enter your country" size="large" />
        </Form.Item>

        {/* Password */}
        <Form.Item
          label="Create Password"
          name="password"
          rules={[
            { required: true, message: 'Please create a password' },
            { min: 8, message: 'Password must be at least 8 characters' },
          ]}
          className="mb-8"
        >
          <Input.Password
            placeholder="Create a password"
            size="large"
            visibilityToggle={{
              visible: passwordVisible,
              onVisibleChange: setPasswordVisible,
            }}
            iconRender={(visible) =>
              visible ? <EyeOutlined /> : <EyeInvisibleOutlined />
            }
          />
        </Form.Item>

        {/* Submit Button */}
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="w-full h-[43px] submit-btn text-white text-[12px] uppercase"
          >
            CREATE ACCOUNT
          </Button>
        </Form.Item>

        {/* Login Link */}
        <div className="mt-4 text-center">
          <span className="text-gray-600">Already have an account? </span>
          <Link to="/login" className="text-green-600 font-medium">
            Log In
          </Link>
        </div>
      </Form>
    </AuthLayout>
  );
};

export default Registration;