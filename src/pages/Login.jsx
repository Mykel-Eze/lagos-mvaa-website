import React from 'react';
import { Form, Input, Button } from 'antd';

const LoginForm = () => {
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
          label="Portal Type"
          rules={[{ required: true, message: 'Please select a portal type!' }]}
        >
          <div className="flex space-x-4">
            <input type="radio" id="user" name="portal" value="user" defaultChecked />
            <label htmlFor="user">User Portal</label>
            <input type="radio" id="admin" name="portal" value="admin" />
            <label htmlFor="admin">Admin Portal</label>
          </div>
        </Form.Item>

        {/*
          For Admin Portal, add Department dropdown
          For User Portal, remove Department
        */}
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
          <Button type="primary" htmlType="submit" block className="bg-green-600">
            Log In
          </Button>
          <p className="text-center mt-4 text-gray-600">
            Don’t have an account? <a href="/signup" className="text-green-600">Sign Up</a>
          </p>
        </Form.Item>
      </Form>
    </div>
  );
};

export default LoginForm;