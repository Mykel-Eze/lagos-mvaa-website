/* eslint-disable no-unused-vars */
import React from 'react';
import { Form, Input, Select, DatePicker, Upload } from 'antd';

const VehicleInformationForm = () => {
    const normFile = (e) => {
        if (Array.isArray(e)) {
        return e;
        }
        return e?.fileList;
    };
  
    return (
        <div className="grid md:grid-cols-2 gap-x-10 gap-y-6 vehicle-form-fields">
            <Form.Item label="Vehicle Category" name="vehicleCategory">
                <Select placeholder="Select vehicle category">
                <Select.Option value="sedan">Sedan</Select.Option>
                <Select.Option value="suv">SUV</Select.Option>
                <Select.Option value="truck">Truck</Select.Option>
                </Select>
            </Form.Item>
            
            <Form.Item label="Vehicle Model" name="vehicleModel">
                <Input placeholder="Enter vehicle model" />
            </Form.Item>
            
            <Form.Item label="Vehicle Make" name="vehicleMake">
                <Select placeholder="Select vehicle make">
                <Select.Option value="toyota">Toyota</Select.Option>
                <Select.Option value="honda">Honda</Select.Option>
                <Select.Option value="ford">Ford</Select.Option>
                </Select>
            </Form.Item>
            
            <Form.Item label="Chassis Number" name="chassisNumber">
                <Input placeholder="Enter chassis number" />
            </Form.Item>
            
            <Form.Item label="Year of Manufacture" name="yearOfManufacture">
                <DatePicker className="w-full" picker="year" />
            </Form.Item>
            
            <Form.Item label="Engine Number" name="engineNumber">
                <Input placeholder="Enter engine number" />
            </Form.Item>
            
            <Form.Item 
                label="Vehicle Image" 
                name="vehicleImage"
                valuePropName="fileList"
                getValueFromEvent={normFile}
                className="md:col-span-2"
            >
                <Upload.Dragger 
                name="files" 
                action="/upload.do"
                className="border-gray-300"
                >
                <p className="text-green-600 font-medium">Upload file</p>
                <p className="text-gray-400 text-xs">(JPG, PNG, PDF Max 3MB)</p>
                </Upload.Dragger>
            </Form.Item>
        </div>
    );
};

export default VehicleInformationForm;