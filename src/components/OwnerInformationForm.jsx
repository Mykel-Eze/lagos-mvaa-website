/* eslint-disable no-unused-vars */
import React from 'react';
import { Form, Input, Select, DatePicker, Upload } from 'antd';

const OwnerInformationForm = () => {
    const normFile = (e) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    };
    
    return (
        <div className="grid md:grid-cols-2 gap-x-10 gap-y-6 vehicle-form-fields">
            <Form.Item label="Full Name" name="fullName">
                <Input placeholder="Enter full name" />
            </Form.Item>
            
            <Form.Item label="ID Number" name="idNumber">
                <Input placeholder="Enter ID number" />
            </Form.Item>
            
            <Form.Item label="Phone Number" name="phoneNumber">
                <Input placeholder="Enter phone number" />
            </Form.Item>
            
            <Form.Item label="Email Address" name="emailAddress">
                <Input placeholder="Enter email address" />
            </Form.Item>
            
            <Form.Item label="Date of Birth" name="dateOfBirth">
                <DatePicker className="w-full" />
            </Form.Item>
            
            <Form.Item label="Gender" name="gender">
                <Select placeholder="Select gender">
                    <Select.Option value="male">Male</Select.Option>
                    <Select.Option value="female">Female</Select.Option>
                    <Select.Option value="other">Other</Select.Option>
                </Select>
            </Form.Item>
            
            <Form.Item label="Residential Address" name="residentialAddress" className="md:col-span-2">
                <Input.TextArea rows={3} placeholder="Enter residential address" />
            </Form.Item>
            
            <Form.Item
                label="ID Document"
                name="idDocument"
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

export default OwnerInformationForm;