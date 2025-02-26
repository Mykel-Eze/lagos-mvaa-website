/* eslint-disable no-unused-vars */
import React from 'react';
import { Layout, Menu, Card } from 'antd';
const { Content } = Layout;

const Dashboard = () => {
  return (
    <Layout className="min-h-screen">
      <Content className="p-6">
        <h1 className="text-2xl font-bold mb-6">Agency Departments</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card title="Department of Number Plate Services" className="shadow-md">
            View All The Officers Elected By Lagosians This Tenure.
          </Card>
          <Card title="Department of Auto-Dealers and Spare Parts" className="shadow-md">
            A-Z Index of Lagos Government Ministries, Departments & Agencies.
          </Card>
          <Card title="Road Worthiness Officers" className="shadow-md">
            View All The Officers Elected By Lagosians This Tenure.
          </Card>
          <Card title="Supervisory Officers" className="shadow-md">
            View All The Judiciary Officers Appointed For This Tenure.
          </Card>
        </div>
      </Content>
    </Layout>
  );
};

export default Dashboard;