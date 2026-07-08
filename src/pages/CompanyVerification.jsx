// src/pages/CompanyVerification.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Spin } from 'antd';
import { LoadingOutlined, CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons';
import { toast } from 'react-toastify';
import { verifyCAC, verifyBusinessNIN, verifyPayerId, createCompanyPayerId, getProfile } from '../services/api';

// ── Status constants ─────────────────────────────────────────────────────────
const STATUS = { IDLE: 'idle', LOADING: 'loading', SUCCESS: 'success', ERROR: 'error' };

// ── Company Payer ID creation ─────────────────────────────────────────────────
// The backend's create-company-payer-id endpoint validates rcNumber as a full CAC
// number with its prefix (e.g. "RC1234") — sending digits alone ("1234") fails with
// "company registration number is missing or malformed". BusinessType is submitted
// alongside it as the same RC/BN/IT prefix.
const BUSINESS_TYPES = [ 'RC', 'BN', 'IT' ];

const deriveBusinessType = (rcValue) => {
    const prefix = rcValue?.trim().toUpperCase().match(/^([A-Z]+)/)?.[ 1 ];
    return BUSINESS_TYPES.includes(prefix) ? prefix : '';
};

const normalizeRcNumber = (rcValue) => rcValue?.trim().toUpperCase() || '';

// ── Shared sub-components (mirror IndividualVerification pattern) ────────────

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
                {status === STATUS.SUCCESS && <CheckCircleFilled className="verification-status-icon success" />}
                {status === STATUS.ERROR && <CloseCircleFilled className="verification-status-icon error" />}
            </div>
            {hint && <p className="verification-field-hint">{hint}</p>}
            {children}
        </div>
    );
}

// ── Progress tracker ─────────────────────────────────────────────────────────
function ProgressTracker({ steps }) {
    return (
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '12px' }}>
            {steps.map(({ label, status }) => {
                const colours = {
                    [ STATUS.SUCCESS ]: { bg: '#f0fdf4', border: '#86efac', text: '#108A00', dot: '#108A00' },
                    [ STATUS.ERROR ]: { bg: '#fff5f5', border: '#fca5a5', text: '#dc2626', dot: '#dc2626' },
                    [ STATUS.LOADING ]: { bg: '#fffbeb', border: '#fcd34d', text: '#92400e', dot: '#f59e0b' },
                    [ STATUS.IDLE ]: { bg: '#f9fafb', border: '#e5e7eb', text: '#6b7280', dot: '#d1d5db' },
                };
                const c = colours[ status ] || colours[ STATUS.IDLE ];
                return (
                    <div
                        key={label}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '6px',
                            padding: '6px 12px', borderRadius: '999px',
                            border: `1.5px solid ${c.border}`, background: c.bg,
                            fontSize: '12px', fontWeight: 600, color: c.text,
                            fontFamily: 'Plus Jakarta Sans, sans-serif',
                            transition: 'all 0.2s',
                        }}
                    >
                        <span style={{
                            width: '8px', height: '8px', borderRadius: '50%',
                            background: c.dot, flexShrink: 0,
                        }} />
                        {status === STATUS.SUCCESS ? `✓ ${label}` : label}
                    </div>
                );
            })}
        </div>
    );
}

// ── Result Card ──────────────────────────────────────────────────────────────
function ResultCard({ rows, statusBadge }) {
    return (
        <div className="verification-result-card">
            {rows.map(({ label, value, badge }) => (
                <div className="verification-result-row" key={label}>
                    <span>{label}</span>
                    {badge
                        ? <span className={`result-status-badge ${value === 'ACTIVE' || value === 'SUCCESS' ? 'active' : 'inactive'}`}>{value}</span>
                        : <span>{value || '—'}</span>
                    }
                </div>
            ))}
        </div>
    );
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function CompanyVerification() {
    const navigate = useNavigate();
    const [ company, setCompany ] = useState(null);

    // CAC
    const [ cac, setCac ] = useState('');
    const [ cacStatus, setCacStatus ] = useState(STATUS.IDLE);
    const [ cacResult, setCacResult ] = useState(null);

    // Business Owner NIN
    const [ nin, setNin ] = useState('');
    const [ ninStatus, setNinStatus ] = useState(STATUS.IDLE);
    const [ ninResult, setNinResult ] = useState(null);

    // Payer ID
    const [ payerId, setPayerId ] = useState('');
    const [ payerStatus, setPayerStatus ] = useState(STATUS.IDLE);
    const [ payerResult, setPayerResult ] = useState(null);

    const [ showCreateForm, setShowCreateForm ] = useState(false);
    const [ createLoading, setCreateLoading ] = useState(false);
    const [ createBusinessType, setCreateBusinessType ] = useState('');
    const [ createIndustry, setCreateIndustry ] = useState('');
    const [ createAddressNo, setCreateAddressNo ] = useState('');
    const [ createAddress, setCreateAddress ] = useState('');

    const [ submitting, setSubmitting ] = useState(false);

    useEffect(() => {
        const raw = sessionStorage.getItem('user');
        if (!raw) { navigate('/login'); return; }

        let userData = (() => {
            try {
                const parsed = JSON.parse(raw);
                return parsed.data || parsed.user || parsed;
            } catch { return null; }
        })();

        if (!userData) { navigate('/login'); return; }

        // Company details (incl. owner name used for the business-NIN check) come from the
        // backend profile — no client-side PII cache.

        if (userData.is_verified) { navigate('/services'); return; }

        setCompany(userData);

        // For each step: if already verified, prefill the verified value, mark it done and
        // rebuild its result card; otherwise fall back to the value captured at signup.
        const ninRecord = userData.companyOwner?.entityId;
        if (ninRecord?.nin) {
            setNin(ninRecord.nin);
            setNinResult(ninRecord);
            setNinStatus(STATUS.SUCCESS);
        } else {
            setNin(userData.companyOwner?.nationalIdentificationNumber || '');
        }

        if (userData.entityId?.rcNumber) {
            setCac(userData.entityId.rcNumber);
            setCacResult(userData.entityId);
            setCacStatus(STATUS.SUCCESS);
            setCreateBusinessType(deriveBusinessType(userData.entityId.rcNumber));
        } else {
            setCac(userData.companyRCNumber || '');
        }

        setCreateAddressNo(userData.address?.flatNumber || '');
        setCreateAddress(
            [ userData.address?.street, userData.address?.landmark, userData.address?.lga ]
                .filter(Boolean)
                .join(', ')
        );

        if (userData.payerId) {
            setPayerId(userData.payerId);
            setPayerStatus(STATUS.SUCCESS);
        }
    }, [ navigate ]);

    // ── Handlers ────────────────────────────────────────────────────────────────

    const handleVerifyCAC = async () => {
        if (!cac.trim()) return;
        setCacStatus(STATUS.LOADING);
        try {
            const res = await verifyCAC(cac.trim());
            setCacResult(res.data);
            setCacStatus(STATUS.SUCCESS);
            setCreateBusinessType(prev => prev || deriveBusinessType(res.data?.rcNumber));
            toast.success('CAC verified successfully!');
        } catch (err) {
            setCacStatus(STATUS.ERROR);
            toast.error(
                err?.error || err?.details ||
                'CAC verification failed. Check the registration number format (e.g. RC1234).'
            );
        }
    };

    const handleVerifyNIN = async () => {
        if (!nin.trim()) return;
        setNinStatus(STATUS.LOADING);
        try {
            // Owner name is sourced from the company profile (companyOwner).
            const ownerFirstName = company?.companyOwner?.firstName || '';
            const ownerLastName = company?.companyOwner?.surname || '';
            const res = await verifyBusinessNIN(nin.trim(), ownerFirstName, ownerLastName);
            setNinResult(res.data);
            setNinStatus(STATUS.SUCCESS);
            toast.success('Business owner NIN verified!');
        } catch (err) {
            setNinStatus(STATUS.ERROR);
            toast.error(err?.error || err?.details || 'NIN verification failed.');
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
            toast.error(err?.error || err?.details || 'Payer ID verification failed.');
        }
    };

    const handleCreatePayerId = async () => {
        if (cacStatus !== STATUS.SUCCESS) { toast.error('Please verify your CAC registration first.'); return; }
        if (!createBusinessType) { toast.error('Please select a business type.'); return; }
        if (!createIndustry.trim()) { toast.error('Please enter the company\'s industry.'); return; }
        if (!createAddressNo.trim()) { toast.error('Please enter the address number.'); return; }
        if (!createAddress.trim()) { toast.error('Please enter the company address.'); return; }

        setCreateLoading(true);
        try {
            const dto = {
                type: 'C', // C = Corporate (backend expects 'N' | 'C' | 'J')
                rcNumber: normalizeRcNumber(cacResult?.rcNumber || cac),
                BusinessType: createBusinessType,
                CompanyName: cacResult?.companyName || company?.companyName || '',
                Industry: createIndustry.trim(),
                phoneNumber: company?.companyRepPhone || '',
                email: company?.email || '',
                addressNo: createAddressNo.trim(),
                address: createAddress.trim(),
            };

            const res = await createCompanyPayerId(dto);
            const pid = res.data?.IssuerId || res.data?.payerId?.issuerId ||
                res.data?.Pid || res.data?.pid || res.data?.PID;
            if (!pid) throw new Error('No Payer ID returned from server.');

            toast.success('Payer ID created successfully!');
            setShowCreateForm(false);
            setPayerId(pid);

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

    const allVerified =
        cacStatus === STATUS.SUCCESS &&
        ninStatus === STATUS.SUCCESS &&
        payerStatus === STATUS.SUCCESS;

    const handleSubmit = async () => {
        if (!allVerified) return;
        setSubmitting(true);
        try {
            // CAC/NIN/Payer ID verification already persisted the records (and flipped
            // isVerified) on the backend — refresh the cached profile so the rest of
            // the app sees the up-to-date CAC/NIN/Payer ID/verified status.
            await getProfile();
            toast.success('Company account verified! Welcome.');
            navigate('/services');
        } catch (err) {
            toast.error(err?.error || 'Could not refresh your profile. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    if (!company) return null;

    const progressSteps = [
        { label: 'CAC', status: cacStatus },
        { label: 'Owner NIN', status: ninStatus },
        { label: 'Payer ID', status: payerStatus },
    ];

    return (
        <div className="verification-page">
            <div className="verification-container">

                {/* ── Header ─────────────────────────────────────────────────────── */}
                <div className="verification-header">
                    <div className="verification-badge company">Corporate</div>
                    <h1 className="verification-title">Company Verification</h1>
                    <p className="verification-subtitle">
                        Verify your company's identity to unlock all MVAA business services.
                        Complete all three steps below — your registration details are shown for reference.
                    </p>
                    <ProgressTracker steps={progressSteps} />
                </div>

                {/* ── Company Profile Read-only ───────────────────────────────────── */}
                <div className="verification-section">
                    <h2 className="verification-section-title">Company Details</h2>
                    <p className="verification-section-desc">
                        Details from your registration. Contact support if anything is incorrect.
                    </p>
                    <div className="verification-info-grid">
                        <InfoCard label="Company Name" value={company.companyName} />
                        <InfoCard label="Email" value={company.email} />
                        <InfoCard label="RC Number" value={company.companyRCNumber} />
                        <InfoCard label="Rep Name" value={company.companyRepName} />
                        <InfoCard label="Rep Phone" value={company.companyRepPhone} />
                    </div>
                </div>

                {/* ── Step 1: CAC ────────────────────────────────────────────────── */}
                <div className="verification-section">
                    <h2 className="verification-section-title">
                        Step 1 — CAC Registration
                        {cacStatus === STATUS.SUCCESS && <CheckCircleFilled className="section-check" />}
                    </h2>
                    <p className="verification-section-desc">
                        Enter your Corporate Affairs Commission registration number to confirm your company's legal standing.
                        This must be verified before a Payer ID can be created.
                    </p>
                    <VerifyField
                        id="cac-input"
                        label="CAC Registration Number"
                        placeholder="e.g. RC1234"
                        value={cac}
                        onChange={e => { setCac(e.target.value); if (cacStatus !== STATUS.IDLE) setCacStatus(STATUS.IDLE); }}
                        status={cacStatus}
                        onVerify={handleVerifyCAC}
                        hint="Accepted formats: RC1234, BN1234, IT1234, etc."
                    />
                    {cacResult && cacStatus === STATUS.SUCCESS && (
                        <ResultCard rows={[
                            { label: 'Company Name', value: cacResult.companyName },
                            { label: 'RC Number', value: cacResult.rcNumber },
                            { label: 'Classification', value: cacResult.classification },
                            {
                                label: 'Registration Date', value: cacResult.registrationDate
                                    ? new Date(cacResult.registrationDate).toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' })
                                    : '—'
                            },
                            { label: 'Status', value: cacResult.status, badge: true },
                        ]} />
                    )}
                </div>

                {/* ── Step 2: Business Owner NIN ─────────────────────────────────── */}
                <div className="verification-section">
                    <h2 className="verification-section-title">
                        Step 2 — Business Owner NIN
                        {ninStatus === STATUS.SUCCESS && <CheckCircleFilled className="section-check" />}
                    </h2>
                    <p className="verification-section-desc">
                        Enter the 11-digit National Identification Number of the registered business owner.
                        It will be matched against the owner name from your company profile.
                    </p>
                    <VerifyField
                        id="nin-input"
                        label="Owner NIN"
                        placeholder="Enter 11-digit NIN"
                        value={nin}
                        onChange={e => { setNin(e.target.value); if (ninStatus !== STATUS.IDLE) setNinStatus(STATUS.IDLE); }}
                        status={ninStatus}
                        onVerify={handleVerifyNIN}
                    />
                    {ninResult && ninStatus === STATUS.SUCCESS && (
                        <ResultCard rows={[
                            { label: 'Name', value: [ ninResult.firstname, ninResult.middlename, ninResult.lastname ].filter(Boolean).join(' ') },
                            { label: 'Date of Birth', value: ninResult.birthdate },
                            { label: 'Phone', value: ninResult.phone },
                            { label: 'LGA', value: ninResult.residence?.lga },
                            { label: 'State', value: ninResult.residence?.state },
                        ]} />
                    )}
                </div>

                {/* ── Step 3: Payer ID ───────────────────────────────────────────── */}
                <div className="verification-section">
                    <h2 className="verification-section-title">
                        Step 3 — Payer ID
                        {payerStatus === STATUS.SUCCESS && <CheckCircleFilled className="section-check" />}
                    </h2>
                    <p className="verification-section-desc">
                        Enter your Lagos State Revenue Service Payer ID to link your company's tax profile.
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
                            {cacStatus !== STATUS.SUCCESS ? (
                                <span style={{ color: '#9ca3af', fontSize: 12 }}>Verify your CAC registration first (Step 1) to create one.</span>
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
                        {showCreateForm && cacStatus === STATUS.SUCCESS && (
                            <div className="create-payer-form">
                                <p className="create-payer-form-desc">
                                    Your verified CAC details will be used to register the company Payer ID. Fill in the additional fields below.
                                </p>
                                <div className="create-payer-selects">
                                    <div className="create-payer-select-group">
                                        <label htmlFor="co-create-business-type">Business Type <span style={{ color: '#ef4444' }}>*</span></label>
                                        <select
                                            id="co-create-business-type"
                                            name="co-create-business-type"
                                            value={createBusinessType}
                                            onChange={e => setCreateBusinessType(e.target.value)}
                                            className="verification-input"
                                            style={{ height: 40, flex: 'auto' }}
                                        >
                                            <option value="">Select business type</option>
                                            {BUSINESS_TYPES.map(bt => <option key={bt} value={bt}>{bt}</option>)}
                                        </select>
                                    </div>
                                    <div className="create-payer-select-group">
                                        <label htmlFor="co-create-industry">Industry <span style={{ color: '#ef4444' }}>*</span></label>
                                        <input
                                            id="co-create-industry"
                                            name="co-create-industry"
                                            type="text"
                                            className="verification-input"
                                            placeholder="e.g. Construction"
                                            value={createIndustry}
                                            style={{ height: 40, flex: 'auto' }}
                                            onChange={e => setCreateIndustry(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="create-payer-selects">
                                    <div className="create-payer-select-group">
                                        <label htmlFor="co-create-address-no">Address No <span style={{ color: '#ef4444' }}>*</span></label>
                                        <input
                                            id="co-create-address-no"
                                            name="co-create-address-no"
                                            type="text"
                                            className="verification-input"
                                            placeholder="e.g. 73"
                                            value={createAddressNo}
                                            style={{ height: 40, flex: 'auto' }}
                                            onChange={e => setCreateAddressNo(e.target.value)}
                                        />
                                    </div>
                                    <div className="create-payer-select-group">
                                        <label htmlFor="co-create-address">Address <span style={{ color: '#ef4444' }}>*</span></label>
                                        <input
                                            id="co-create-address"
                                            name="co-create-address"
                                            type="text"
                                            className="verification-input"
                                            placeholder="e.g. Samuel Ladoke Akintola Boulevard"
                                            value={createAddress}
                                            style={{ height: 40, flex: 'auto' }}
                                            onChange={e => setCreateAddress(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="create-payer-preview">
                                    <div className="create-payer-row"><span>Company Name</span><span>{cacResult?.companyName || company?.companyName || '—'}</span></div>
                                    <div className="create-payer-row"><span>RC Number</span><span>{normalizeRcNumber(cacResult?.rcNumber || cac) || '—'}</span></div>
                                    <div className="create-payer-row"><span>Business Type</span><span>{createBusinessType || '—'}</span></div>
                                    <div className="create-payer-row"><span>Phone</span><span>{company?.companyRepPhone || '—'}</span></div>
                                    <div className="create-payer-row"><span>Email</span><span>{company?.email || '—'}</span></div>
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
                        <ResultCard rows={[
                            { label: 'Full Name', value: payerResult.Fullname },
                            { label: 'Payer ID', value: payerResult.Pid },
                            { label: 'State', value: payerResult.State },
                            { label: 'Status', value: payerResult.Status, badge: true },
                        ]} />
                    )}
                </div>

                {/* ── Complete Verification ──────────────────────────────────────── */}
                {allVerified && (
                    <div className="verification-complete-section">
                        <div className="verification-complete-banner">
                            <CheckCircleFilled style={{ color: '#108A00', fontSize: 22, marginRight: 8 }} />
                            All three checks passed! You may now complete your company verification.
                        </div>
                        <button
                            onClick={handleSubmit}
                            disabled={submitting}
                            className="verification-complete-btn"
                        >
                            {submitting ? (
                                <Spin indicator={<LoadingOutlined style={{ fontSize: 16, color: '#fff' }} spin />} />
                            ) : (
                                'Complete Company Verification'
                            )}
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
}