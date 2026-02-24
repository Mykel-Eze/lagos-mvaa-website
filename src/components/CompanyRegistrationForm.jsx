import React, { useState } from 'react';
import dayjs from 'dayjs';
import { Form, Input, Select, Button, DatePicker, Steps, Upload } from 'antd';
import {
    EyeOutlined, EyeInvisibleOutlined, LeftOutlined, RightOutlined, InboxOutlined,
    BankOutlined, UserOutlined, EnvironmentOutlined, IdcardOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import countryCodes from '../data/countryCodes.json';
import lagosLGAs from '../data/lagosLGAs.json';
import LoadingSpinner from './LoadingSpinner';

const { Option } = Select;
const { Step } = Steps;

// Reusable phone field with country-code dropdown (mirrors IndividualRegistrationForm)
function PhoneField({ namePrefix, form }) {
    const phoneField = `${namePrefix}Phone`;
    const codeField = `${namePrefix}CountryCode`;

    return (
        <div className="flex" id={`${namePrefix}-phone-field`}>
            <Form.Item name={codeField} noStyle initialValue="+234">
                <Select
                    size="large"
                    style={{ width: '100px', textAlign: 'center' }}
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                        (option?.data?.country?.toLowerCase() || '').includes(input.toLowerCase()) ||
                        (option?.data?.code?.toLowerCase() || '').includes(input.toLowerCase())
                    }
                    optionLabelProp="label"
                >
                    {countryCodes.countryCodes.map(country => (
                        <Select.Option
                            key={country.code}
                            value={country.code}
                            label={country.code}
                            data={country}
                        >
                            <div className="flex items-center">
                                <span>{country.code}</span>
                                <span className="ml-2 text-gray-500 text-xs">{country.country}</span>
                            </div>
                        </Select.Option>
                    ))}
                </Select>
            </Form.Item>
            <Form.Item
                name={phoneField}
                noStyle
                rules={[
                    { required: true, message: 'Please enter phone number' },
                    ({ getFieldValue }) => ({
                        validator(_, value) {
                            const code = getFieldValue(codeField);
                            if (code === '+234' && value && value.startsWith('0')) {
                                return Promise.reject(new Error('Remove the leading 0 — not needed with +234'));
                            }
                            return Promise.resolve();
                        },
                    }),
                ]}
            >
                <Input
                    placeholder="8100000000"
                    size="large"
                    className="ml-2 flex-1"
                    onBlur={(e) => {
                        const code = form.getFieldValue(codeField);
                        const val = e.target.value;
                        if (code === '+234' && val.startsWith('0')) {
                            form.setFieldsValue({ [ phoneField ]: val.slice(1) });
                            form.validateFields([ phoneField ]);
                        }
                    }}
                />
            </Form.Item>
        </div>
    );
}

const CompanyRegistrationForm = ({ onSubmit, isLoading }) => {
    const [ form ] = Form.useForm();
    const [ currentStep, setCurrentStep ] = useState(0);
    const [ passwordVisible, setPasswordVisible ] = useState(false);
    const [ confirmPasswordVisible, setConfirmPasswordVisible ] = useState(false);

    // 4 steps with icons only
    const steps = [
        { icon: <BankOutlined />, title: 'Company Info' },
        { icon: <UserOutlined />, title: 'Rep Details' },
        { icon: <EnvironmentOutlined />, title: 'Address' },
        { icon: <IdcardOutlined />, title: 'Owner' },
    ];

    const next = async () => {
        try {
            let fieldsToValidate = [];
            if (currentStep === 0) {
                fieldsToValidate = [ 'companyName', 'companyRCNumber', 'companyTIN', 'email', 'password', 'confirmPassword' ];
            } else if (currentStep === 1) {
                fieldsToValidate = [ 'companyRepName', 'repPhone', 'companyRepEmail' ];
            } else if (currentStep === 2) {
                fieldsToValidate = [
                    'flatNumber', 'blockNumber', 'street', 'landmark',
                    'lga', 'state', 'utilityBillFile', 'contactPhone',
                ];
            }
            await form.validateFields(fieldsToValidate);
            setCurrentStep(currentStep + 1);
        } catch (error) {
            console.log('Validation failed:', error);
        }
    };

    const prev = () => setCurrentStep(currentStep - 1);

    return (
        <div className="company-registration-form">
            {/* Stepper — icons only so labels fit on one row */}
            <Steps current={currentStep} className="mb-8" size="small">
                {steps.map((item) => (
                    <Step key={item.title} icon={item.icon} title={item.title} />
                ))}
            </Steps>

            <Form
                form={form}
                layout="vertical"
                onFinish={onSubmit}
                initialValues={{
                    state: 'Lagos',
                    repCountryCode: '+234',
                    contactCountryCode: '+234',
                }}
            >
                {/* ── Step 1: Company Info ── */}
                <div className={currentStep === 0 ? 'block' : 'hidden'}>
                    <Form.Item
                        label="Company Name"
                        name="companyName"
                        rules={[ { required: true, message: 'Please enter company name' } ]}
                        className="mb-4"
                    >
                        <Input placeholder="Enter company name" size="large" />
                    </Form.Item>

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

                    <Form.Item
                        label="Create Password"
                        name="password"
                        rules={[
                            { required: true, message: 'Please create a password' },
                            { min: 8, message: 'Password must be at least 8 characters' },
                            {
                                pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/,
                                message: 'Must include uppercase, lowercase, number, and symbol',
                            },
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

                {/* ── Step 2: Representative Details ── */}
                <div className={currentStep === 1 ? 'block' : 'hidden'}>
                    <Form.Item
                        label="Representative Full Name"
                        name="companyRepName"
                        rules={[ { required: true, message: 'Please enter representative name' } ]}
                        className="mb-4"
                    >
                        <Input placeholder="Enter representative full name" size="large" />
                    </Form.Item>

                    <Form.Item label="Rep. Phone" className="mb-4">
                        <PhoneField namePrefix="rep" form={form} />
                    </Form.Item>

                    <Form.Item
                        label="Rep. Email"
                        name="companyRepEmail"
                        rules={[
                            { required: true, message: 'Please enter email' },
                            { type: 'email', message: 'Valid email required' },
                        ]}
                        className="mb-4"
                    >
                        <Input placeholder="Enter email address" size="large" />
                    </Form.Item>
                </div>

                {/* ── Step 3: Company Address ── */}
                <div className={currentStep === 2 ? 'block' : 'hidden'}>
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

                    <Form.Item
                        label="Street"
                        name="street"
                        rules={[ { required: true, message: 'Please enter street address' } ]}
                        className="mb-4"
                    >
                        <Input placeholder="Enter street address" size="large" />
                    </Form.Item>

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
                        <Select placeholder="Select LGA" size="large" showSearch>
                            {lagosLGAs.lagosLGAs.map(lga => (
                                <Option key={lga} value={lga}>{lga}</Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="State"
                        name="state"
                        rules={[ { required: true, message: 'Required' } ]}
                        className="mb-4"
                    >
                        <Input disabled size="large" />
                    </Form.Item>

                    <Form.Item
                        label="Office Contact Phone"
                        className="mb-4"
                    >
                        <PhoneField namePrefix="contact" form={form} />
                    </Form.Item>

                    <Form.Item
                        label="Utility Bill"
                        name="utilityBillFile"
                        rules={[ { required: true, message: 'Please upload a utility bill' } ]}
                        className="mb-4"
                    >
                        <Upload.Dragger
                            name="utilityBill"
                            accept="image/*,.pdf"
                            maxCount={1}
                            beforeUpload={() => false}
                        >
                            <p className="ant-upload-drag-icon"><InboxOutlined /></p>
                            <p className="ant-upload-text" style={{ fontSize: 13 }}>Click or drag file here</p>
                            <p className="ant-upload-hint" style={{ fontSize: 12 }}>PNG, JPG or PDF — max 5 MB</p>
                        </Upload.Dragger>
                    </Form.Item>
                </div>

                {/* ── Step 4: Owner Details ── */}
                <div className={currentStep === 3 ? 'block' : 'hidden'}>
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

                    <Form.Item name="ownerDob" label="Date of Birth" rules={[
                        { required: true, message: 'Date of birth is required' },
                        () => ({
                            validator(_, value) {
                                if (!value) return Promise.resolve();
                                const today = new Date();
                                const dob = value.toDate();
                                let age = today.getFullYear() - dob.getFullYear();
                                const m = today.getMonth() - dob.getMonth();
                                if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
                                if (age < 18) {
                                    return Promise.reject(new Error('Owner must be at least 18 years old'));
                                }
                                return Promise.resolve();
                            },
                        }),
                    ]} className="mb-4">
                        <DatePicker
                            style={{ width: '100%' }}
                            size="large"
                            defaultPickerValue={dayjs().subtract(18, 'year')}
                            disabledDate={(current) => {
                                const maxDob = new Date();
                                maxDob.setFullYear(maxDob.getFullYear() - 18);
                                return current && current.toDate() > maxDob;
                            }}
                        />
                    </Form.Item>

                    <Form.Item name="ownerPlaceOfBirth" label="Place of Birth" rules={[ { required: true } ]} className="mb-4">
                        <Input placeholder="City/State of Birth" size="large" />
                    </Form.Item>

                    <Form.Item name="ownerDriverLicense" label="Driving License" className="mb-4">
                        <Input placeholder="License No." size="large" />
                    </Form.Item>

                    <Form.Item name="ownerPassport" label="Passport No." className="mb-4">
                        <Input placeholder="Passport No." size="large" />
                    </Form.Item>
                </div>

                {/* ── Navigation ── */}
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
                            {isLoading ? <LoadingSpinner size="small" color="#ffffff" className="mx-auto" /> : 'REGISTER COMPANY'}
                        </Button>
                    )}
                </div>

                {/* Login Link */}
                <div className="mt-6 text-center">
                    <span className="text-gray-600">Already have an account? </span>
                    <Link to="/login" className="text-green-600 font-medium">Log In</Link>
                </div>
            </Form>
        </div>
    );
};

export default CompanyRegistrationForm;
