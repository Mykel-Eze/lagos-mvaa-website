/* eslint-disable no-unused-vars */
import React from 'react';
import { Layout } from 'antd';
import Hero from '../components/Hero';
import ServicesComponent from '../components/ServicesComponent';
const { Content } = Layout;

const Home = () => {
  return (
    <Layout id="homepage" className="min-h-screen">
      <Content>
        <Hero />
        
        <ServicesComponent />

      </Content>
    </Layout>
  );
};

export default Home;