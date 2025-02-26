import React from 'react';
import { Card, Row, Col } from 'antd';

const Services = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Motor Vehicle Services</h1>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={8}>
          <Card title="Number Plate Services" className="shadow-md">
            Find vehicle-related services like verify VIN, pay VIS etc. permit.
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card title="Auto-Dealers and Spare Parts" className="shadow-md">
            Find vehicle-related services like verify VIN, pay VIS etc. permit.
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card title="Number Plate Services" className="shadow-md">
            Find vehicle-related services like verify VIN, pay VIS etc. permit.
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Services;