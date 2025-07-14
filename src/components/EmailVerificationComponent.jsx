import React from 'react';
import { Button } from 'antd';
import { MailOutlined, CheckCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner';

const EmailVerificationComponent = ({ 
  userEmail, 
  onResendVerification, 
  isResending, 
  resendTimer 
}) => {
  return (
    <div className="text-center">
      {/* Success Icon */}
      <div className="mb-6">
        <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <MailOutlined className="text-green-600 text-3xl" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Check Your Email
        </h2>
        <p className="text-gray-600">
          We've sent a verification link to your email address
        </p>
      </div>

      {/* Email Display */}
      {userEmail && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-600 mb-1">Verification email sent to:</p>
          <p className="font-semibold text-gray-800">{userEmail}</p>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
        <div className="flex items-start mb-3">
          <CheckCircleOutlined className="text-blue-600 mt-1 mr-2" />
          <div>
            <p className="text-sm font-medium text-blue-800">Next Steps:</p>
            <ol className="text-sm text-blue-700 mt-1 ml-4 list-decimal">
              <li>Check your email inbox for our verification message</li>
              <li>Click the verification link in the email</li>
              <li>You can now login</li>
            </ol>
          </div>
        </div>
      </div>

      {/* Spam Folder Warning */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <div className="flex items-start">
          <ExclamationCircleOutlined className="text-yellow-600 mt-1 mr-2" />
          <div className="text-left">
            <p className="text-sm font-medium text-yellow-800">
              Don't see the email?
            </p>
            <ul className="text-sm text-yellow-700 mt-1 ml-4 list-disc">
              <li>Check your spam or junk folder</li>
              <li>Make sure you entered the correct email address</li>
              <li>The email may take a few minutes to arrive</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <Button
          type="primary"
          onClick={onResendVerification}
          disabled={isResending || !userEmail || resendTimer > 0}
          className="w-full h-[43px] submit-btn text-white text-[12px] uppercase"
        >
          {isResending ? (
            <LoadingSpinner size="small" color="#ffffff" className="mx-auto" />
          ) : resendTimer > 0 ? (
            `RESEND IN ${resendTimer}S`
          ) : (
            "RESEND VERIFICATION EMAIL"
          )}
        </Button>

        {/* <Button
          type="default"
          className="w-full h-[43px] text-[12px] uppercase cancel-btn"
        >
          <Link to="/login" className="text-gray-600 hover:text-gray-800">
            BACK TO LOGIN
          </Link>
        </Button> */}
      </div>

      {/* Support Link */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500">
          Still having trouble? 
          <a 
            href="mailto:support@licensetest.permit.org.ng" 
            className="text-green-600 hover:text-green-700 font-medium ml-1"
          >
            Contact Support
          </a>
        </p>
      </div>
    </div>
  );
};

export default EmailVerificationComponent;