import React from 'react';
import { Button } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';

const EmailVerificationSuccessful = () => {
  return (
    <AuthLayout title="">
      <div className="text-center">
        {/* Success Icon */}
        <div className="mb-6">
          <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircleOutlined className="text-green-600 text-3xl" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Email Verified Successfully!
          </h2>
          <p className="text-gray-600">
            Your email address has been verified. You can now log in and continue.
          </p>
        </div>

        {/* Action Button */}
        <div className="space-y-3">
          <Button
            type="primary"
            className="w-full h-[43px] submit-btn text-white text-[12px] uppercase"
          >
            <Link to="/login" className="text-white hover:text-gray-100">
              GO TO LOGIN
            </Link>
          </Button>
        </div>

        {/* Support Link */}
        {/* <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Need help? 
            <a 
              href="mailto:support@licensetest.permit.org.ng" 
              className="text-green-600 hover:text-green-700 font-medium ml-1"
            >
              Contact Support
            </a>
          </p>
        </div> */}
      </div>
    </AuthLayout>
  );
};

export default EmailVerificationSuccessful;
