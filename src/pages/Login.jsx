// src/pages/Login.jsx
import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Radio, Select } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import { login } from '../services/api';
import { toast } from 'react-toastify';
import LoadingSpinner from '../components/LoadingSpinner';
import Cookies from 'js-cookie';

const Login = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  // Check for email verification success
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const verified = urlParams.get('verified');
    
    if (verified === 'true') {
      toast.success('Email verification successful! You can now log in.');
      // Clean up the URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [location]);

  // Redirect if already logged in
  useEffect(() => {
    if (Cookies.get('portal_session_id')) {
      navigate('/services');
    }
  }, [navigate]);

  const handleSubmit = async (values) => {
    setIsLoading(true);
    try {
      const { email, password } = values;
      
      const response = await login(email, password);
      
      if (response.user) {
        console.log('Login response:', response);
      }
      
      toast.success('Login successful!');
      navigate('/services');
    } catch (error) {
      setIsLoading(false);
      toast.error(error.error || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout title="Login">
      {/* Login Form */}
      <Form 
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Form.Item 
          label="Email Address" 
          name="email"
          rules={[
            { required: true, message: 'Please enter your email address' },
            { type: 'email', message: 'Please enter a valid email address' }
          ]}
          className="mb-4"
        >
          <Input size="large" />
        </Form.Item>
        
        <Form.Item 
          label="Password" 
          name="password"
          rules={[{ required: true, message: 'Please enter your password' }]}
          className="mb-2"
        >
          <Input.Password
            size="large"
            iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
          />
        </Form.Item>
        
        <div className="mb-12">
          <Link to="/forgot-password" className="sec-color hover:text-green-700 font-bold">
            Forgot Password?
          </Link>
        </div>
        
        <Form.Item>
          <Button 
            type="primary" 
            htmlType="submit" 
            className="w-full h-[43px] submit-btn text-white text-[12px] uppercase"
            disabled={isLoading}
          >
            {isLoading ? <LoadingSpinner size="small" color="#ffffff" className="mx-auto" /> : "LOG IN"}
          </Button>
        </Form.Item>
        
        <div className="text-center mt-4 text-gray-600">
          Don't have an account? 
          <Link to="/register" className="font-bold sec-color hover:text-green-700 ml-1">
            Sign Up
          </Link>
        </div>
      </Form>
    </AuthLayout>
  );
};

export default Login;