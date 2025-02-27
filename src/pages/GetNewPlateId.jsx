import React from 'react';
import ServicesLayout from '../components/ServicesLayout';
import { Form, Input, Select, Upload, Button } from 'antd';
import { useNavigate } from 'react-router-dom';

const GetNewPlateId = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  
  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };
  
  const handleSubmit = (values) => {
    // Submit form data and navigate to vehicle registration page
    console.log('Form values:', values);
    navigate('/services/vehicle-registration');
  };

  return (
    <ServicesLayout
      title="Get New Plate ID"
      description=""
    >
      <div className="get-new-plate-form-wrapper">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="max-w-lg mx-auto"
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
            label="Department" 
            name="department"
            rules={[{ required: true, message: 'Please select your department' }]}
            className="mb-6"
          >
            <Select placeholder="Select your department" size="large">
              <Select.Option value="finance">Finance</Select.Option>
              <Select.Option value="operations">Operations</Select.Option>
              <Select.Option value="admin">Administration</Select.Option>
              <Select.Option value="technical">Technical</Select.Option>
            </Select>
          </Form.Item>
          
          <Form.Item 
            label="Registration Number" 
            name="registrationNumber"
            rules={[{ required: true, message: 'Please enter registration number' }]}
            className="mb-6"
          >
            <Input placeholder="Enter registration number" size="large" />
          </Form.Item>
          
          <Form.Item 
            label=" "
            name="document"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            className="mb-6"
          >
            <Upload.Dragger  name="files" action="/upload.do">
              <p className="text-green-600 font-medium">Upload file</p>
              <p className="text-gray-400 text-xs">(JPG, PNG, PDF Max 3MB)</p>
            </Upload.Dragger>
          </Form.Item>
          
          <Form.Item className="mt-12">
            <Button 
              type="primary" 
              htmlType="submit" 
              className="w-full h-12 submit-btn"
            >
              SUBMIT
            </Button>
          </Form.Item>
        </Form>
      </div>
    </ServicesLayout>
  );
};

export default GetNewPlateId;