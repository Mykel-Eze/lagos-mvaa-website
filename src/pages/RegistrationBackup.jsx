import React, { useState } from 'react';
import { Form, Input, Button, Select } from 'antd';
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
      await register(values);
      toast.success('Registration successful!');
      navigate('/login');
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
        <Form.Item 
          label="Full Name" 
          name="fullName"
          rules={[{ required: true, message: 'Please enter your full name' }]}
          className="mb-6"
        >
          <Input placeholder="Enter your full name" size="large" />
        </Form.Item>
        
        <Form.Item 
          label="Email Address" 
          name="email"
          rules={[
            { required: true, message: 'Please enter your email address' },
            { type: 'email', message: 'Please enter a valid email address' }
          ]}
          className="mb-6"
        >
          <Input placeholder="Enter your email address" size="large" />
        </Form.Item>
        
        <Form.Item 
          label="Phone Number" 
          className="mb-6"
        >
          <div className="flex">
            <Form.Item
              name="countryCode"
              noStyle
              initialValue="+234"
            >
              <Select size="large" style={{ width: '100px', textAlign: 'center' }}>
                <Select.Option value="+234">
                  +234
                </Select.Option>
                <Select.Option value="+1">+1</Select.Option>
                <Select.Option value="+44">+44</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="phoneNumber"
              noStyle
              rules={[{ required: true, message: 'Please enter your phone number' }]}
            >
              <Input placeholder="8100000000" size="large" className="ml-2 flex-1" />
            </Form.Item>
          </div>
        </Form.Item>
        
        <Form.Item 
          label="Create Password" 
          name="password"
          rules={[
            { required: true, message: 'Please create a password' },
            { min: 8, message: 'Password must be at least 8 characters' }
          ]}
          className="mb-8"
        >
          <Input.Password 
            placeholder="Create a password" 
            size="large"
            visibilityToggle={{ 
              visible: passwordVisible, 
              onVisibleChange: setPasswordVisible 
            }}
            iconRender={visible => visible ? <EyeOutlined /> : <EyeInvisibleOutlined />}
          />
        </Form.Item>
        
        <Form.Item>
          <Button 
            type="primary" 
            htmlType="submit" 
            className="w-full h-[43px] submit-btn text-white text-[12px] uppercase"
          >
            CREATE ACCOUNT
          </Button>
        </Form.Item>
        
        <div className="mt-4 text-center">
          <span className="text-gray-600">Already have an account? </span>
          <Link to="/login" className="text-green-600 font-medium">Log In</Link>
        </div>
      </Form>
    </AuthLayout>
  );
};

export default Registration;