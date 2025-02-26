import React from 'react';
import { Form, Input, Select, Upload, Button } from 'antd';
const { Option } = Select;

const Registration = () => {
  const onFinish = (values) => {
    console.log('Registration values:', values);
  };

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Vehicle Registration</h1>
      <Form
        name="vehicleRegistration"
        onFinish={onFinish}
        layout="vertical"
      >
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4">Vehicle Information</h2>
          <Form.Item name="vehicleCategory" label="Vehicle Category">
            <Select>
              <Option value="car">Car</Option>
              <Option value="truck">Truck</Option>
              <Option value="motorcycle">Motorcycle</Option>
            </Select>
          </Form.Item>
          <Form.Item name="vehicleModel" label="Vehicle Model">
            <Input />
          </Form.Item>
          <Form.Item name="vehicleMake" label="Vehicle Make">
            <Input />
          </Form.Item>
          <Form.Item name="chassisNumber" label="Chassis Number">
            <Input />
          </Form.Item>
          <Form.Item name="yearOfManufacture" label="Year of Manufacture">
            <Input />
          </Form.Item>
          <Form.Item name="engineNumber" label="Engine Number">
            <Input />
          </Form.Item>
          <Form.Item name="vehicleImage" label="Vehicle Image">
            <Upload name="vehicleImage" listType="picture">
              <Button>Upload File (JPG, PNG, PDF, Max 3MB)</Button>
            </Upload>
          </Form.Item>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4">Owner Information</h2>
          {/* Add owner fields here */}
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4">Other Information</h2>
          {/* Add other fields here */}
        </div>

        <Form.Item>
          <Button type="primary" htmlType="submit" className="bg-green-600 mr-4">
            Submit
          </Button>
          <Button>Preview</Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Registration;