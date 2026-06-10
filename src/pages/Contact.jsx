// src/pages/Contact.jsx
import React from 'react';
import { Layout } from 'antd';
import Footer from '../components/Footer';

const { Content } = Layout;

// Contact details are placeholders — replace with the real values when available.
const CONTACT_DETAILS = [
  { label: 'Address', value: 'Lagos State MVAA Head Office, Lagos, Nigeria' },
  { label: 'Phone', value: '+234 000 000 0000' },
  { label: 'Email', value: 'info@lagosmvaa.ng' },
  { label: 'Office Hours', value: 'Monday – Friday, 8:00 AM – 5:00 PM' },
];

const Contact = () => {
  return (
    <Layout id="contact-page" className="min-h-screen">
      <Content>
        <section className="py-[80px]">
          <div className="container">
            <div className="title-txts text-center mb-[48px]">
              <h1>Contact Us</h1>
              <p>Get in touch with the Lagos State Motor Vehicle Administration Agency</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-[800px] mx-auto">
              {CONTACT_DETAILS.map(({ label, value }) => (
                <div
                  key={label}
                  className="border border-gray-200 rounded-lg p-6 bg-white"
                >
                  <div className="font-semibold text-gray-500 mb-2">{label}</div>
                  <div className="text-lg">{value}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <Footer />
      </Content>
    </Layout>
  );
};

export default Contact;
