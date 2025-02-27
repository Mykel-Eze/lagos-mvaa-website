import React, { useState } from 'react';
import { Form, Input, Button } from 'antd';
import { Link } from 'react-router-dom';

const LoginForm = () => {
  const [isAdmin, setIsAdmin] = useState(false);

  const onFinish = (values) => {
    console.log('Login values:', values);
  };

  return (
    <div className="container mx-auto p-6 max-w-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
      <Form
        name="login"
        onFinish={onFinish}
        layout="vertical"
        className="login-form"
      >
        <Form.Item
          name="portalType"
          label=""
        >
          <div className="flex space-x-4">
            {/* Custom radio button styles */}
            <div className="flex w-full">
              <label 
                className={`
                  flex-1 py-2 px-4 border border-gray-300 rounded-md cursor-pointer text-center font-medium
                  ${!isAdmin ? 'bg-green-500 text-white border-green-500' : 'bg-white text-gray-700'}
                  transition-all duration-200 ease-in-out
                `}
                onClick={() => setIsAdmin(false)}
              >
                <div className="flex items-center justify-center space-x-2">
                  
                    <div className="w-4 h-4 rounded-full bg-white flex items-center justify-center border-cst">
                        {!isAdmin && (
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        )}
                    </div>
                  <input
                    type="radio"
                    id="user"
                    name="portal"
                    value="user"
                    checked={!isAdmin}
                    onChange={() => setIsAdmin(false)}
                    defaultChecked
                    className="hidden"
                  />
                  <span>USER PORTAL</span>
                </div>
              </label>
              
              <label 
                className={`
                  flex-1 py-2 px-4 border border-gray-300 rounded-md cursor-pointer text-center font-medium ml-4
                  ${isAdmin ? 'bg-green-500 text-white border-green-500' : 'bg-white text-gray-700'}
                  transition-all duration-200 ease-in-out
                `}
                onClick={() => setIsAdmin(true)}
              >
                <div className="flex items-center justify-center space-x-2">
                  
                    <div className="w-4 h-4 rounded-full bg-white flex items-center justify-center border-cst">
                        {isAdmin && (
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        )}
                    </div>
                  
                  <input
                    type="radio"
                    id="admin"
                    name="portal"
                    value="admin"
                    checked={isAdmin}
                    onChange={() => setIsAdmin(true)}
                    className="hidden"
                  />
                  <span>ADMIN PORTAL</span>
                </div>
              </label>
            </div>
          </div>
        </Form.Item>

        {/* Only show Department dropdown for Admin portal */}
        {isAdmin && (
          <Form.Item
            name="department"
            label="Department"
            rules={[{ required: true, message: 'Please select a department!' }]}
          >
            <select className="w-full p-2 border rounded">
              <option value="">Select Department</option>
              <option value="numberPlate">Number Plate Services</option>
              <option value="autoDealers">Auto-Dealers and Spare Parts</option>
              <option value="roadWorthiness">Road Worthiness Officers</option>
              <option value="supervisory">Supervisory Officers</option>
            </select>
          </Form.Item>
        )}

        <Form.Item
          name="email"
          label="Email Address"
          rules={[{ required: true, message: 'Please input your email!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="password"
          label="Password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item>
          <a href="/#" className="text-green-600">Forgot Password?</a>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block className="submit-btn">
            Log In
          </Button>

          {/* Only show Sign Up notice for User portal */}
          {!isAdmin && (
            <p className="text-center mt-4 text-gray-600">
              Don't have an account? <Link to="/register" className="sec-color">Sign Up</Link>
            </p>
          )}
        </Form.Item>
      </Form>
    </div>
  );
};

export default LoginForm;