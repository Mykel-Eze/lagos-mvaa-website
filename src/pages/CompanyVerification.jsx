// src/pages/CompanyVerification.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Spin } from 'antd';
import { LoadingOutlined, CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import { verifyCAC, verifyBusinessNIN, verifyBusinessTIN, verifyPayerId, createPayerId, submitVerification } from '../services/api';

// ── Status constants ─────────────────────────────────────────────────────────
const STATUS = { IDLE: 'idle', LOADING: 'loading', SUCCESS: 'success', ERROR: 'error' };

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

    // TIN
    const [ tin, setTin ] = useState('');
    const [ tinStatus, setTinStatus ] = useState(STATUS.IDLE);
    const [ tinResult, setTinResult ] = useState(null);

    // Payer ID
    const [ payerId, setPayerId ] = useState('');
    const [ payerStatus, setPayerStatus ] = useState(STATUS.IDLE);
    const [ payerResult, setPayerResult ] = useState(null);

    const [ showCreateForm, setShowCreateForm ] = useState(false);
    const [ createLoading, setCreateLoading ] = useState(false);

    const [ submitting, setSubmitting ] = useState(false);

    useEffect(() => {
        const raw = Cookies.get('user');
        if (!raw) { navigate('/login'); return; }

        let userData = (() => {
            try {
                const parsed = JSON.parse(raw);
                return parsed.data || parsed.user || parsed;
            } catch { return null; }
        })();

        if (!userData) { navigate('/login'); return; }

        // Merge localStorage company profile (fallback, same pattern as AccountSettings)
        const companyRaw = localStorage.getItem('company_profile');
        if (companyRaw) {
            try { userData = { ...JSON.parse(companyRaw), ...userData }; } catch { /* ignore */ }
        }

        if (userData.is_verified) { navigate('/services'); return; }

        setCompany(userData);
    }, [ navigate ]);

    // ── Handlers ────────────────────────────────────────────────────────────────

    const handleVerifyCAC = async () => {
        if (!cac.trim()) return;
        setCacStatus(STATUS.LOADING);
        try {
            const res = await verifyCAC(cac.trim());
            setCacResult(res.data);
            setCacStatus(STATUS.SUCCESS);
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

    const handleVerifyTIN = async () => {
        if (!tin.trim()) return;
        setTinStatus(STATUS.LOADING);
        try {
            const res = await verifyBusinessTIN(tin.trim());
            setTinResult(res.data);
            setTinStatus(STATUS.SUCCESS);
            toast.success('TIN verified successfully!');
        } catch (err) {
            setTinStatus(STATUS.ERROR);
            toast.error(err?.error || err?.details || 'TIN verification failed.');
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
        setCreateLoading(true);
        try {
            const dto = {
                Fullname: company?.companyName || '',
                Email: company?.email || '',
                Phone: company?.companyRepPhone || '',
                State: 'Lagos',
                RcNumber: company?.companyRCNumber || '',
                Tin: company?.companyTIN || '',
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
            toast.error(err?.error || err?.message || 'Failed to create Payer ID. Please try again.');
        } finally {
            setCreateLoading(false);
        }
    };

    const allVerified =
        cacStatus === STATUS.SUCCESS &&
        ninStatus === STATUS.SUCCESS &&
        tinStatus === STATUS.SUCCESS &&
        payerStatus === STATUS.SUCCESS;

    const handleSubmit = async () => {
        if (!allVerified) return;
        setSubmitting(true);
        try {
            await submitVerification(company?.email);
            toast.success('Company account verified! Welcome.');
            navigate('/services');
        } catch (err) {
            toast.error(err?.error || 'Could not complete verification. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    if (!company) return null;

    const progressSteps = [
        { label: 'CAC', status: cacStatus },
        { label: 'Owner NIN', status: ninStatus },
        { label: 'TIN', status: tinStatus },
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
                        Complete all four steps below — your registration details are shown for reference.
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
                        <InfoCard label="TIN" value={company.companyTIN} />
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
                        It will be matched against the owner name provided during registration.
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

                {/* ── Step 3: TIN ────────────────────────────────────────────────── */}
                <div className="verification-section">
                    <h2 className="verification-section-title">
                        Step 3 — Tax Identification Number (TIN)
                        {tinStatus === STATUS.SUCCESS && <CheckCircleFilled className="section-check" />}
                    </h2>
                    <p className="verification-section-desc">
                        Enter your Federal Inland Revenue Service (FIRS) Tax Identification Number.
                    </p>
                    <VerifyField
                        id="tin-input"
                        label="TIN"
                        placeholder="e.g. 08120451-1001"
                        value={tin}
                        onChange={e => { setTin(e.target.value); if (tinStatus !== STATUS.IDLE) setTinStatus(STATUS.IDLE); }}
                        status={tinStatus}
                        onVerify={handleVerifyTIN}
                    />
                    {tinResult && tinStatus === STATUS.SUCCESS && (
                        <ResultCard rows={[
                            { label: 'Taxpayer Name', value: tinResult.taxpayerName },
                            { label: 'TIN', value: tinResult.tin },
                            { label: 'CAC Reg No', value: tinResult.cacRegNo },
                            { label: 'Tax Office', value: tinResult.taxOffice },
                            { label: 'Entity Type', value: tinResult.entityType },
                        ]} />
                    )}
                </div>

                {/* ── Step 4: Payer ID ───────────────────────────────────────────── */}
                <div className="verification-section">
                    <h2 className="verification-section-title">
                        Step 4 — Payer ID
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
                            <button
                                type="button"
                                className="create-payer-toggle"
                                onClick={() => setShowCreateForm(v => !v)}
                            >
                                {showCreateForm ? 'Cancel' : 'Create one here →'}
                            </button>
                        </div>
                        {showCreateForm && (
                            <div className="create-payer-form">
                                <p className="create-payer-form-desc">
                                    We'll register a Payer ID for your company using your account details. Review and confirm below.
                                </p>
                                <div className="create-payer-preview">
                                    <div className="create-payer-row"><span>Company Name</span><span>{company?.companyName || '—'}</span></div>
                                    <div className="create-payer-row"><span>Email</span><span>{company?.email || '—'}</span></div>
                                    <div className="create-payer-row"><span>Phone</span><span>{company?.companyRepPhone || '—'}</span></div>
                                    <div className="create-payer-row"><span>RC Number</span><span>{company?.companyRCNumber || '—'}</span></div>
                                    <div className="create-payer-row"><span>TIN</span><span>{company?.companyTIN || '—'}</span></div>
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
                            All four checks passed! You may now complete your company verification.
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