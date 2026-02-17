import React, { useState } from 'react';
import { Form, Input, Select, Button, DatePicker, Steps } from 'antd';
import { EyeOutlined, EyeInvisibleOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
// import countryCodes from '../data/countryCodes.json';
import lagosLGAs from '../data/lagosLGAs.json';
import LoadingSpinner from './LoadingSpinner';

const { Option } = Select;
const { Step } = Steps;

const CompanyRegistrationForm = ({ onSubmit, isLoading }) => {
    const [ form ] = Form.useForm();
    const [ currentStep, setCurrentStep ] = useState(0);
    const [ passwordVisible, setPasswordVisible ] = useState(false);
    const [ confirmPasswordVisible, setConfirmPasswordVisible ] = useState(false);

    // Steps configuration
    const steps = [
        {
            title: 'Company Info',
            content: 'company-info',
        },
        {
            title: 'Address & Contact',
            content: 'address-contact',
        },
        {
            title: 'Owner Details',
            content: 'owner-details',
        },
    ];

    const next = async () => {
        try {
            let fieldsToValidate = [];
            if (currentStep === 0) {
                fieldsToValidate = [ 'companyName', 'companyRCNumber', 'companyTIN', 'email', 'password', 'confirmPassword' ];
            } else if (currentStep === 1) {
                fieldsToValidate = [
                    'companyRepName', 'companyRepPhone', 'companyRepEmail',
                    'flatNumber', 'blockNumber', 'street', 'landmark',
                    'lga', 'state', 'utilityBillDescription', 'contactPhone'
                ];
            }

            await form.validateFields(fieldsToValidate);
            setCurrentStep(currentStep + 1);
        } catch (error) {
            // Validation failed
            console.log('Validation failed:', error);
        }
    };

    const prev = () => {
        setCurrentStep(currentStep - 1);
    };

    return (
        <div className="company-registration-form">
            {/* Stepper */}
            <Steps current={currentStep} className="mb-8" size="small">
                {steps.map((item) => (
                    <Step key={item.title} title={item.title} />
                ))}
            </Steps>

            <Form
                form={form}
                layout="vertical"
                onFinish={onSubmit}
                initialValues={{
                    state: "Lagos",
                    countryCode: "+234"
                }}
            >
                {/* Step 1: Company Info */}
                <div className={currentStep === 0 ? 'block' : 'hidden'}>
                    <div className="md:grid md:grid-cols-1 md:gap-4">
                        <Form.Item
                            label="Company Name"
                            name="companyName"
                            rules={[ { required: true, message: 'Please enter company name' } ]}
                            className="mb-4"
                        >
                            <Input placeholder="Enter company name" size="large" />
                        </Form.Item>
                    </div>

                    {/* RC Number & TIN */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Form.Item
                            label="RC Number"
                            name="companyRCNumber"
                            rules={[ { required: true, message: 'Please enter RC Number' } ]}
                            className="mb-4"
                        >
                            <Input placeholder="Enter RC Number" size="large" />
                        </Form.Item>

                        <Form.Item
                            label="TIN"
                            name="companyTIN"
                            rules={[ { required: true, message: 'Please enter TIN' } ]}
                            className="mb-4"
                        >
                            <Input placeholder="Enter Tax Identification Number" size="large" />
                        </Form.Item>
                    </div>

                    {/* Company Email */}
                    <Form.Item
                        label="Company Email"
                        name="email"
                        rules={[
                            { required: true, message: 'Please enter company email' },
                            { type: 'email', message: 'Please enter a valid email' },
                        ]}
                        className="mb-4"
                    >
                        <Input placeholder="Enter company email address" size="large" />
                    </Form.Item>

                    {/* Password */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Form.Item
                            label="Create Password"
                            name="password"
                            rules={[
                                { required: true, message: 'Please create a password' },
                                { min: 8, message: 'Password must be at least 8 characters' },
                            ]}
                            className="mb-4"
                        >
                            <Input.Password
                                placeholder="Create password"
                                size="large"
                                visibilityToggle={{
                                    visible: passwordVisible,
                                    onVisibleChange: setPasswordVisible,
                                }}
                                iconRender={(visible) =>
                                    visible ? <EyeOutlined /> : <EyeInvisibleOutlined />
                                }
                            />
                        </Form.Item>

                        <Form.Item
                            label="Confirm Password"
                            name="confirmPassword"
                            dependencies={[ 'password' ]}
                            rules={[
                                { required: true, message: 'Please confirm password' },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('password') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('Passwords do not match'));
                                    },
                                }),
                            ]}
                            className="mb-4"
                        >
                            <Input.Password
                                placeholder="Confirm password"
                                size="large"
                                visibilityToggle={{
                                    visible: confirmPasswordVisible,
                                    onVisibleChange: setConfirmPasswordVisible,
                                }}
                                iconRender={(visible) =>
                                    visible ? <EyeOutlined /> : <EyeInvisibleOutlined />
                                }
                            />
                        </Form.Item>
                    </div>
                </div>

                {/* Step 2: Address & Contact */}
                <div className={currentStep === 1 ? 'block' : 'hidden'}>
                    <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-100">
                        <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Representative Details</h3>
                        <Form.Item
                            label="Representative Name"
                            name="companyRepName"
                            rules={[ { required: true, message: 'Please enter representative name' } ]}
                            className="mb-4"
                        >
                            <Input placeholder="Enter representative full name" size="large" />
                        </Form.Item>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Form.Item
                                label="Rep. Phone"
                                name="companyRepPhone"
                                rules={[ { required: true, message: 'Please enter phone number' } ]}
                                className="mb-4"
                            >
                                <Input placeholder="Enter phone number" size="large" />
                            </Form.Item>

                            <Form.Item
                                label="Rep. Email"
                                name="companyRepEmail"
                                rules={[
                                    { required: true, message: 'Please enter email' },
                                    { type: 'email', message: 'Valid email required' }
                                ]}
                                className="mb-4"
                            >
                                <Input placeholder="Enter email address" size="large" />
                            </Form.Item>
                        </div>
                    </div>

                    <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Company Address</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Form.Item
                            label="Flat Number"
                            name="flatNumber"
                            rules={[ { required: true, message: 'Required' } ]}
                            className="mb-4"
                        >
                            <Input placeholder="Flat No." size="large" />
                        </Form.Item>
                        <Form.Item
                            label="Block Number"
                            name="blockNumber"
                            rules={[ { required: true, message: 'Required' } ]}
                            className="mb-4"
                        >
                            <Input placeholder="Block No." size="large" />
                        </Form.Item>
                    </div>

                    <Form.Item
                        label="Street"
                        name="street"
                        rules={[ { required: true, message: 'Please enter street address' } ]}
                        className="mb-4"
                    >
                        <Input placeholder="Enter street address" size="large" />
                    </Form.Item>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Form.Item
                            label="Landmark"
                            name="landmark"
                            rules={[ { required: true, message: 'Required' } ]}
                            className="mb-4"
                        >
                            <Input placeholder="Nearest Landmark" size="large" />
                        </Form.Item>

                        <Form.Item
                            label="LGA"
                            name="lga"
                            rules={[ { required: true, message: 'Please select LGA' } ]}
                            className="mb-4"
                        >
                            <Select
                                placeholder="Select LGA"
                                size="large"
                                showSearch
                            >
                                {lagosLGAs.lagosLGAs.map(lga => (
                                    <Option key={lga} value={lga}>{lga}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Form.Item
                            label="State"
                            name="state"
                            rules={[ { required: true, message: 'Required' } ]}
                            className="mb-4"
                        >
                            <Input disabled size="large" />
                        </Form.Item>
                        <Form.Item
                            label="Utility Bill Description"
                            name="utilityBillDescription"
                            rules={[ { required: true, message: 'Required' } ]}
                            className="mb-4"
                        >
                            <Input placeholder="e.g. EKEDC Bill" size="large" />
                        </Form.Item>
                    </div>

                    <Form.Item
                        label="Office Contact Phone"
                        name="contactPhone"
                        rules={[ { required: true, message: 'Required' } ]}
                        className="mb-4"
                    >
                        <Input placeholder="Office Phone" size="large" />
                    </Form.Item>
                </div>

                {/* Step 3: Owner Details */}
                <div className={currentStep === 2 ? 'block' : 'hidden'}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Form.Item name="ownerTitle" label="Title" rules={[ { required: true } ]} className="mb-4">
                            <Select placeholder="Title" size="large">
                                <Option value="Mr">Mr</Option>
                                <Option value="Mrs">Mrs</Option>
                                <Option value="Miss">Miss</Option>
                                <Option value="Chief">Chief</Option>
                                <Option value="Dr">Dr</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item name="ownerSurname" label="Surname" rules={[ { required: true } ]} className="mb-4">
                            <Input placeholder="Surname" size="large" />
                        </Form.Item>
                        <Form.Item name="ownerOtherName" label="Other Names" rules={[ { required: true } ]} className="mb-4">
                            <Input placeholder="Other Names" size="large" />
                        </Form.Item>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Form.Item name="ownerSex" label="Gender" rules={[ { required: true } ]} className="mb-4">
                            <Select placeholder="Gender" size="large">
                                <Option value="Male">Male</Option>
                                <Option value="Female">Female</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item name="ownerMaritalStatus" label="Marital Status" rules={[ { required: true } ]} className="mb-4">
                            <Select placeholder="Status" size="large">
                                <Option value="Single">Single</Option>
                                <Option value="Married">Married</Option>
                                <Option value="Divorced">Divorced</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item name="ownerDob" label="Date of Birth" rules={[ { required: true } ]} className="mb-4">
                            <DatePicker style={{ width: '100%' }} size="large" />
                        </Form.Item>
                    </div>

                    <Form.Item name="ownerPlaceOfBirth" label="Place of Birth" rules={[ { required: true } ]} className="mb-4">
                        <Input placeholder="City/State of Birth" size="large" />
                    </Form.Item>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Form.Item name="ownerNIN" label="NIN" rules={[ { required: true } ]} className="mb-4">
                            <Input placeholder="NIN" size="large" />
                        </Form.Item>
                        <Form.Item name="ownerDriverLicense" label="Driving License" className="mb-4">
                            <Input placeholder="License No." size="large" />
                        </Form.Item>
                        <Form.Item name="ownerPassport" label="Passport No." className="mb-4">
                            <Input placeholder="Passport No." size="large" />
                        </Form.Item>
                    </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-8 pt-4 border-t border-gray-100">
                    {currentStep > 0 && (
                        <Button
                            onClick={prev}
                            size="large"
                            icon={<LeftOutlined />}
                            className="flex items-center border-gray-300 text-gray-600 hover:text-green-700 hover:border-green-700 h-[43px]"
                        >
                            Previous
                        </Button>
                    )}

                    {currentStep < steps.length - 1 && (
                        <Button
                            type="primary"
                            onClick={next}
                            size="large"
                            className="ml-auto w-40 h-[43px] submit-btn text-white text-[12px] uppercase flex items-center justify-center"
                        >
                            Next <RightOutlined className="ml-2" />
                        </Button>
                    )}

                    {currentStep === steps.length - 1 && (
                        <Button
                            type="primary"
                            htmlType="submit"
                            className="ml-auto w-40 h-[43px] submit-btn text-white text-[12px] uppercase"
                            disabled={isLoading}
                        >
                            {isLoading ? <LoadingSpinner size="small" color="#ffffff" className="mx-auto" /> : "REGISTER COMPANY"}
                        </Button>
                    )}
                </div>

                {/* Login Link */}
                <div className="mt-6 text-center">
                    <span className="text-gray-600">Already have an account? </span>
                    <Link to="/login" className="text-green-600 font-medium">
                        Log In
                    </Link>
                </div>
            </Form>
        </div>
    );
};

export default CompanyRegistrationForm;
