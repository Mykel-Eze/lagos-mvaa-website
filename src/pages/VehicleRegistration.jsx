import React from 'react';
import { Form, Input, Select, DatePicker, Upload, Button, Collapse } from 'antd';
import { UpOutlined, DownOutlined, ArrowRightOutlined, } from '@ant-design/icons';
import ServicesLayout from '../components/ServicesLayout';

const { Panel } = Collapse;
// const { Title } = Typography;

const VehicleRegistration = () => {
  const [form] = Form.useForm();
  
  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  return (
    <ServicesLayout
      title="Get New Plate ID"
      description=""
    >
        <Form
          form={form}
          layout="vertical"
          className="mt-6"
        >
          <Collapse 
            defaultActiveKey={['1']}
            expandIcon={({ isActive }) => isActive ? <UpOutlined /> : <DownOutlined />}
            className="mb-4"
          >
            <Panel 
              header={<span className="font-medium text-lg">Vehicle Information</span>} 
              key="1"
              className="bg-white"
            >
              <div className="grid grid-cols-2 gap-8">
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
                  className="col-span-2"
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
            </Panel>
          </Collapse>
          
          <Collapse 
            expandIcon={({ isActive }) => isActive ? <UpOutlined /> : <DownOutlined />}
            className="mb-4"
          >
            <Panel 
              header={<span className="font-medium text-lg">Owner Information</span>} 
              key="1"
              className="bg-white"
            >
              {/* Owner information form fields would go here */}
            </Panel>
          </Collapse>
          
          <Collapse 
            expandIcon={({ isActive }) => isActive ? <UpOutlined /> : <DownOutlined />}
            className="mb-4"
          >
            <Panel 
              header={<span className="font-medium text-lg">Other Information</span>} 
              key="1"
              className="bg-white"
            >
              {/* Other information form fields would go here */}
            </Panel>
          </Collapse>
          
          <div className="flex justify-end space-x-4 mt-8">
            <Button>PREVIEW</Button>
            <Button type="primary" className="bg-green-600" icon={<ArrowRightOutlined />}>
              SUBMIT
            </Button>
          </div>
        </Form>
    </ServicesLayout>
  );
};

export default VehicleRegistration;