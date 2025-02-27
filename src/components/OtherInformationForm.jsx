/* eslint-disable no-unused-vars */
import React from 'react';
import { Form, Input, Select, DatePicker, Upload, Checkbox, Radio } from 'antd';

const OtherInformationForm = () => {
    const normFile = (e) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    };
    
    return (
        <div className="grid md:grid-cols-2 gap-x-10 gap-y-6 vehicle-form-fields">
            <Form.Item label="Registration Purpose" name="registrationPurpose">
                <Select placeholder="Select registration purpose">
                    <Select.Option value="private">Private</Select.Option>
                    <Select.Option value="commercial">Commercial</Select.Option>
                    <Select.Option value="public">Public Transport</Select.Option>
                    <Select.Option value="government">Government</Select.Option>
                </Select>
            </Form.Item>
            
            <Form.Item label="Insurance Provider" name="insuranceProvider">
                <Select placeholder="Select insurance provider">
                    <Select.Option value="provider1">Provider 1</Select.Option>
                    <Select.Option value="provider2">Provider 2</Select.Option>
                    <Select.Option value="provider3">Provider 3</Select.Option>
                </Select>
            </Form.Item>
            
            <Form.Item label="Insurance Policy Number" name="policyNumber">
                <Input placeholder="Enter policy number" />
            </Form.Item>
            
            <Form.Item label="Insurance Expiry Date" name="insuranceExpiryDate">
                <DatePicker className="w-full" />
            </Form.Item>
            
            <Form.Item label="Previous Registration Number" name="previousRegistrationNumber">
                <Input placeholder="Enter previous registration number (if any)" />
            </Form.Item>
            
            <Form.Item label="Preferred Plate Number" name="preferredPlateNumber">
                <Input placeholder="Enter preferred plate number (optional)" />
            </Form.Item>
            
            <Form.Item
                label="Additional Documents"
                name="additionalDocuments"
                valuePropName="fileList"
                getValueFromEvent={normFile}
                className="md:col-span-2"
            >
                <Upload.Dragger
                    name="files"
                    action="/upload.do"
                    className="border-gray-300"
                    multiple
                >
                    <p className="text-green-600 font-medium">Upload files</p>
                    <p className="text-gray-400 text-xs">(JPG, PNG, PDF Max 5MB)</p>
                </Upload.Dragger>
            </Form.Item>
            
        </div>
    );
};

export default OtherInformationForm;