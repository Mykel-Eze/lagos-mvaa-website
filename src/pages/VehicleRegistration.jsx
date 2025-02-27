import React from 'react';
import { Form, Button, Collapse } from 'antd';
import { UpOutlined, DownOutlined } from '@ant-design/icons';
import ServicesLayout from '../components/ServicesLayout';
import VehicleInformationForm from '../components/VehicleInformationForm';
import OtherInformationForm from '../components/OtherInformationForm';
import OwnerInformationForm from '../components/OwnerInformationForm';

const { Panel } = Collapse;
// const { Title } = Typography;

const VehicleRegistration = () => {
  const [form] = Form.useForm();

  return (
    <ServicesLayout
      title="Get New Plate ID"
      description=""
    >
        <Form
          form={form}
          layout="vertical"
          className="mt-6"
          id="vehicle-registration-form"
        >
          <Collapse 
            defaultActiveKey={['1']}
            expandIcon={({ isActive }) => isActive ? <UpOutlined /> : <DownOutlined />}
            className="mb-4"
          >
            <Panel 
              header={<span className="font-bold text-[24px]">Vehicle Information</span>} 
              key="1"
              className="bg-white"
            >
              <VehicleInformationForm />
            </Panel>
          </Collapse>
          
          <Collapse 
            expandIcon={({ isActive }) => isActive ? <UpOutlined /> : <DownOutlined />}
            className="mb-4"
          >
            <Panel 
              header={<span className="font-bold text-[24px]">Owner Information</span>} 
              key="1"
              className="bg-white"
            >
              <OwnerInformationForm />
            </Panel>
          </Collapse>
          
          <Collapse 
            expandIcon={({ isActive }) => isActive ? <UpOutlined /> : <DownOutlined />}
            className="mb-4"
          >
            <Panel 
              header={<span className="font-bold text-[24px]">Other Information</span>} 
              key="1"
              className="bg-white"
            >
              <OtherInformationForm />
            </Panel>
          </Collapse>

          <ul className="flex-div justify-center nav-btn-wrapper mt-12 mb-10">
              <li>
                  <Button className="nav-btn">Preview</Button>
              </li>
              <li>
                  <Button className="pry-nav-btn flex div">
                      <span>Submit</span>
                      <img src={require("../assets/images/arrow-1.svg").default} alt="arrow-icon" />
                  </Button>
              </li>
          </ul>
        </Form>
    </ServicesLayout>
  );
};

export default VehicleRegistration;