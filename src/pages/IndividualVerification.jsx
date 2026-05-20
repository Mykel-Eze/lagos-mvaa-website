import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Spin } from 'antd';
import { LoadingOutlined, CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import { verifyNIN, verifyPayerId, createPayerId, submitVerification } from '../services/api';

// ── Helpers ──────────────────────────────────────────────────────────────────

const STATUS = { IDLE: 'idle', LOADING: 'loading', SUCCESS: 'success', ERROR: 'error' };

const mapSex = (gender) => {
    if (!gender) return '';
    const g = gender.toLowerCase();
    if (g === 'm' || g === 'male') return 'Male';
    if (g === 'f' || g === 'female') return 'Female';
    return gender;
};

function InfoCard({ label, value }) {
    return (
        <div className="verification-info-card">
            <span className="verification-info-label">{label}</span>
            <span className="verification-info-value">{value || '—'}</span>
        </div>
    );
}

function VerifyField({ id, label, placeholder, value, onChange, status, onVerify, hint, children }) {
    return (
        <div className="verification-field-group">
            <label htmlFor={id} className="verification-field-label">{label}</label>
            <div className="verification-field-row">
                <input
                    id={id}
                    type="text"
                    className={`verification-input${status === STATUS.SUCCESS ? ' verified' : status === STATUS.ERROR ? ' errored' : ''}`}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    disabled={status === STATUS.SUCCESS}
                />
                <button
                    onClick={onVerify}
                    disabled={!value || status === STATUS.LOADING || status === STATUS.SUCCESS}
                    className="verification-verify-btn"
                >
                    {status === STATUS.LOADING ? (
                        <Spin indicator={<LoadingOutlined style={{ fontSize: 14, color: '#fff' }} spin />} />
                    ) : status === STATUS.SUCCESS ? (
                        <CheckCircleFilled style={{ color: '#fff' }} />
                    ) : (
                        'Verify'
                    )}
                </button>
                {status === STATUS.SUCCESS && (
                    <CheckCircleFilled className="verification-status-icon success" />
                )}
                {status === STATUS.ERROR && (
                    <CloseCircleFilled className="verification-status-icon error" />
                )}
            </div>
            {hint && <p className="verification-field-hint">{hint}</p>}
            {children}
        </div>
    );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function IndividualVerification() {
    const navigate = useNavigate();
    const [ user, setUser ] = useState(null);

    const [ nin, setNin ] = useState('');
    const [ ninStatus, setNinStatus ] = useState(STATUS.IDLE);
    const [ ninResult, setNinResult ] = useState(null);

    const [ payerId, setPayerId ] = useState('');
    const [ payerStatus, setPayerStatus ] = useState(STATUS.IDLE);
    const [ payerResult, setPayerResult ] = useState(null);

    const [ showCreateForm, setShowCreateForm ] = useState(false);
    const [ createLoading, setCreateLoading ] = useState(false);
    const [ createTitle, setCreateTitle ] = useState('');
    const [ createMaritalStatus, setCreateMaritalStatus ] = useState('');
    const [ createMiddleName, setCreateMiddleName ] = useState('');

    const [ submitting, setSubmitting ] = useState(false);

    useEffect(() => {
        const raw = Cookies.get('user');
        if (!raw) { navigate('/login'); return; }
        const parsed = JSON.parse(raw);
        const userData = parsed.data || parsed.user || parsed;
        setUser(userData);
        if (userData.is_verified) navigate('/services');
    }, [ navigate ]);

    const handleVerifyNIN = async () => {
        if (!nin.trim()) return;
        setNinStatus(STATUS.LOADING);
        try {
            const res = await verifyNIN(
                nin.trim(),
                user?.firstName || user?.firstname || '',
                user?.lastName || user?.lastname || ''
            );
            setNinResult(res.data);
            setNinStatus(STATUS.SUCCESS);
            setCreateMiddleName(res.data?.middlename || '');
            toast.success('NIN verified successfully!');
        } catch (err) {
            setNinStatus(STATUS.ERROR);
            toast.error(err?.error || err?.message || err?.details || 'NIN verification failed. Please check and try again.');
        }
    };

    const handleVerifyPayerId = async () => {
        if (!payerId.trim()) return;
        setPayerStatus(STATUS.LOADING);
        try {
            const res = await verifyPayerId(payerId.trim());
            setPayerResult(res.data);
            setPayerStatus(STATUS.SUCCESS);
            toast.success('Payer ID verified successfully!');
        } catch (err) {
            setPayerStatus(STATUS.ERROR);
            toast.error(err?.error || err?.message || err?.details || 'Payer ID verification failed. Please check and try again.');
        }
    };

    const handleCreatePayerId = async () => {
        if (!createTitle) { toast.error('Please select your title.'); return; }
        if (!createMaritalStatus) { toast.error('Please select your marital status.'); return; }
        if (!createMiddleName.trim()) { toast.error('Please enter your middle name.'); return; }

        setCreateLoading(true);
        try {
            const res_addr = ninResult?.residence;
            const address = res_addr
                ? [ res_addr.address1, res_addr.town, res_addr.lga, res_addr.state ].filter(Boolean).join(', ')
                : user?.address?.street || '';

            const dto = {
                type: 'Individual',
                title: createTitle,
                sex: mapSex(ninResult?.gender),
                maritalStatus: createMaritalStatus,
                firstName: ninResult?.firstname || user?.firstName || user?.firstname || '',
                lastName: ninResult?.lastname || user?.lastName || user?.lastname || '',
                middleName: createMiddleName,
                dateOfBirth: ninResult?.birthdate || '',
                phoneNumber: ninResult?.phone || user?.phone || '',
                email: user?.email || '',
                address,
                ninNumber: nin.trim(),
            };

            const res = await createPayerId(dto);
            const pid = res.data?.Pid || res.data?.pid || res.data?.PID || res.data?.payerId || res.Pid || res.pid;
            if (!pid) throw new Error('No Payer ID returned from server.');

            toast.success('Payer ID created successfully!');
            setShowCreateForm(false);
            setPayerId(pid);

            // Auto-verify the newly created Payer ID
            setPayerStatus(STATUS.LOADING);
            try {
                const verifyRes = await verifyPayerId(pid);
                setPayerResult(verifyRes.data);
                setPayerStatus(STATUS.SUCCESS);
                toast.success('Payer ID verified!');
            } catch {
                setPayerStatus(STATUS.IDLE);
                toast.info('Payer ID created — please click Verify to confirm it.');
            }
        } catch (err) {
            const details = Array.isArray(err?.details) ? err.details.join(', ') : null;
            toast.error(details || err?.error || err?.message || 'Failed to create Payer ID. Please try again.');
        } finally {
            setCreateLoading(false);
        }
    };

    const allVerified = ninStatus === STATUS.SUCCESS && payerStatus === STATUS.SUCCESS;

    const handleSubmit = async () => {
        if (!allVerified) return;
        setSubmitting(true);
        try {
            const pid = payerResult?.Pid || payerResult?.pid || payerId;
            await submitVerification(user?.email, {
                nin: nin.trim(),
                payerId: pid,
            });
            toast.success('Account verified! Welcome.');
            navigate('/services');
        } catch (err) {
            toast.error(err?.error || 'Could not complete verification. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    if (!user) return null;

    const fullName = [ user.firstName || user.firstname, user.lastName || user.lastname ].filter(Boolean).join(' ') || '—';
    const address = user.address
        ? `${user.address.street || ''}, ${user.address.lga || ''}, ${user.address.state || ''}`.replace(/^,\s*/, '')
        : '—';

    return (
        <div className="verification-page">
            <div className="verification-container">
                {/* Header */}
                <div className="verification-header">
                    <div className="verification-badge individual">Individual</div>
                    <h1 className="verification-title">Identity Verification</h1>
                    <p className="verification-subtitle">
                        Verify your identity to access all MVAA services. Your details below are from your registration and cannot be edited here.
                    </p>
                </div>

                {/* Read-only profile info */}
                <div className="verification-section">
                    <h2 className="verification-section-title">Your Profile Details</h2>
                    <div className="verification-info-grid">
                        <InfoCard label="Full Name" value={fullName} />
                        <InfoCard label="Email" value={user.email} />
                        <InfoCard label="Phone" value={user.phone} />
                        <InfoCard label="Address" value={address} />
                    </div>
                </div>

                {/* NIN Verification */}
                <div className="verification-section">
                    <h2 className="verification-section-title">
                        National Identification Number (NIN)
                        {ninStatus === STATUS.SUCCESS && <CheckCircleFilled className="section-check" />}
                    </h2>
                    <p className="verification-section-desc">
                        Enter your 11-digit NIN. We'll match it against your registered name.
                    </p>
                    <VerifyField
                        id="nin-input"
                        label="NIN"
                        placeholder="Enter your 11-digit NIN"
                        value={nin}
                        onChange={e => { setNin(e.target.value); if (ninStatus !== STATUS.IDLE) setNinStatus(STATUS.IDLE); }}
                        status={ninStatus}
                        onVerify={handleVerifyNIN}
                    />
                    {ninResult && ninStatus === STATUS.SUCCESS && (
                        <div className="verification-result-card">
                            <div className="verification-result-row">
                                <span>Name</span>
                                <span>{[ ninResult.firstname, ninResult.middlename, ninResult.lastname ].filter(Boolean).join(' ')}</span>
                            </div>
                            <div className="verification-result-row">
                                <span>Date of Birth</span>
                                <span>{ninResult.birthdate || '—'}</span>
                            </div>
                            <div className="verification-result-row">
                                <span>Phone</span>
                                <span>{ninResult.phone || '—'}</span>
                            </div>
                            {ninResult.residence && (
                                <div className="verification-result-row">
                                    <span>Registered Address</span>
                                    <span>{[ ninResult.residence.address1, ninResult.residence.town, ninResult.residence.state ].filter(Boolean).join(', ')}</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Payer ID Verification */}
                <div className="verification-section">
                    <h2 className="verification-section-title">
                        Payer ID
                        {payerStatus === STATUS.SUCCESS && <CheckCircleFilled className="section-check" />}
                    </h2>
                    <p className="verification-section-desc">
                        Enter your Lagos State Payer ID (e.g. N-191005) to link your tax profile.
                    </p>
                    <VerifyField
                        id="payer-id-input"
                        label="Payer ID"
                        placeholder="e.g. N-191005"
                        value={payerId}
                        onChange={e => { setPayerId(e.target.value); if (payerStatus !== STATUS.IDLE) setPayerStatus(STATUS.IDLE); }}
                        status={payerStatus}
                        onVerify={handleVerifyPayerId}
                    >
                        <div className="create-payer-link">
                            Don't have a Payer ID?{' '}
                            {ninStatus !== STATUS.SUCCESS ? (
                                <span style={{ color: '#9ca3af', fontSize: 12 }}>Verify your NIN first to create one.</span>
                            ) : (
                                <button
                                    type="button"
                                    className="create-payer-toggle"
                                    onClick={() => setShowCreateForm(v => !v)}
                                >
                                    {showCreateForm ? 'Cancel' : 'Create one here →'}
                                </button>
                            )}
                        </div>

                        {showCreateForm && ninStatus === STATUS.SUCCESS && (
                            <div className="create-payer-form">
                                <p className="create-payer-form-desc">
                                    Your NIN details will be used to register your Payer ID. Fill in the additional fields below.
                                </p>

                                <div className="create-payer-selects">
                                    <div className="create-payer-select-group">
                                        <label htmlFor="create-title">Title <span style={{ color: '#ef4444' }}>*</span></label>
                                        <select
                                            id="create-title"
                                            name="create-title"
                                            value={createTitle}
                                            onChange={e => setCreateTitle(e.target.value)}
                                            className="verification-input"
                                            style={{ height: 40, flex: 'auto' }}
                                        >
                                            <option value="">Select title</option>
                                            <option value="Mr">Mr</option>
                                            <option value="Mrs">Mrs</option>
                                            <option value="Miss">Miss</option>
                                            <option value="Dr">Dr</option>
                                            <option value="Prof">Prof</option>
                                            <option value="Engr">Engr</option>
                                            <option value="Chief">Chief</option>
                                        </select>
                                    </div>
                                    <div className="create-payer-select-group">
                                        <label htmlFor="create-marital-status">Marital Status <span style={{ color: '#ef4444' }}>*</span></label>
                                        <select
                                            id="create-marital-status"
                                            name="create-marital-status"
                                            value={createMaritalStatus}
                                            onChange={e => setCreateMaritalStatus(e.target.value)}
                                            className="verification-input"
                                            style={{ height: 40, flex: 'auto' }}
                                        >
                                            <option value="">Select status</option>
                                            <option value="Single">Single</option>
                                            <option value="Married">Married</option>
                                            <option value="Divorced">Divorced</option>
                                            <option value="Widowed">Widowed</option>
                                        </select>
                                    </div>
                                </div>

                                {!ninResult?.middlename && (
                                    <div className="create-payer-select-group" style={{ marginBottom: 14 }}>
                                        <label htmlFor="create-middle-name">Middle Name <span style={{ color: '#ef4444' }}>*</span></label>
                                        <input
                                            id="create-middle-name"
                                            name="create-middle-name"
                                            type="text"
                                            className="verification-input"
                                            placeholder="Enter your middle name"
                                            value={createMiddleName}
                                            style={{ height: 40, flex: 'auto' }}
                                            onChange={e => setCreateMiddleName(e.target.value)}
                                        />
                                    </div>
                                )}

                                <div className="create-payer-preview">
                                    <div className="create-payer-row"><span>Name</span><span>{[ ninResult?.firstname, createMiddleName || ninResult?.middlename, ninResult?.lastname ].filter(Boolean).join(' ') || '—'}</span></div>
                                    <div className="create-payer-row"><span>Date of Birth</span><span>{ninResult?.birthdate || '—'}</span></div>
                                    <div className="create-payer-row"><span>Phone</span><span>{ninResult?.phone || user?.phone || '—'}</span></div>
                                    <div className="create-payer-row"><span>Email</span><span>{user?.email || '—'}</span></div>
                                    <div className="create-payer-row"><span>NIN</span><span>{nin}</span></div>
                                </div>

                                <button
                                    type="button"
                                    className="verification-complete-btn"
                                    style={{ marginTop: 12, width: '100%' }}
                                    onClick={handleCreatePayerId}
                                    disabled={createLoading}
                                >
                                    {createLoading
                                        ? <Spin indicator={<LoadingOutlined style={{ fontSize: 14, color: '#fff' }} spin />} />
                                        : 'Create Payer ID'}
                                </button>
                            </div>
                        )}
                    </VerifyField>

                    {payerResult && payerStatus === STATUS.SUCCESS && (
                        <div className="verification-result-card">
                            <div className="verification-result-row">
                                <span>Full Name</span>
                                <span>{payerResult.Fullname || '—'}</span>
                            </div>
                            <div className="verification-result-row">
                                <span>Payer ID</span>
                                <span>{payerResult.Pid || '—'}</span>
                            </div>
                            <div className="verification-result-row">
                                <span>State</span>
                                <span>{payerResult.State || '—'}</span>
                            </div>
                            <div className="verification-result-row">
                                <span>Status</span>
                                <span className="result-status-badge">{payerResult.Status || '—'}</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Complete Verification */}
                {allVerified && (
                    <div className="verification-complete-section">
                        <div className="verification-complete-banner">
                            <CheckCircleFilled style={{ color: '#108A00', fontSize: 22, marginRight: 8 }} />
                            All checks passed! You may now complete your verification.
                        </div>
                        <button
                            onClick={handleSubmit}
                            disabled={submitting}
                            className="verification-complete-btn"
                        >
                            {submitting ? (
                                <Spin indicator={<LoadingOutlined style={{ fontSize: 16, color: '#fff' }} spin />} />
                            ) : (
                                'Complete Verification'
                            )}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
