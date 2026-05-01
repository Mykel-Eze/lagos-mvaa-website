// src/pages/TransactionDetail.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Spin, Modal } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import { fetchTransaction, generateBillingReceipt, initializePayment } from '../services/api';
import BillingLayout from '../layouts/BillingLayout';
import OrderStatusBadge from '../components/OrderStatusBadge';

// ── Helpers ──────────────────────────────────────────────────────────────────

const formatAmount = (amount, currency = 'NGN') => {
    const symbol = currency === 'NGN' ? '₦' : currency;
    const num = parseFloat(amount);
    if (isNaN(num)) return `${symbol}—`;
    return `${symbol}${num.toLocaleString('en-NG', {
        minimumFractionDigits: 2, maximumFractionDigits: 2,
    })}`;
};

const formatDate = (iso) => {
    if (!iso) return '—';
    return new Date(iso).toLocaleString('en-NG', {
        day: 'numeric', month: 'long', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
    });
};

const serviceLabel = (name) => {
    const map = {
        NUMBER_PLATE_SERVICES: 'Number Plate Services',
        DRIVING_LICENSE: 'Driving Licence',
        VEHICLE_REGISTRATION: 'Vehicle Registration',
        AUTO_DEALER_SPARE_PARTS: 'AutoDealer & Spare Parts',
        HACKNEY_PERMIT: 'Hackney Permit',
        ROAD_WORTHINESS: 'Road Worthiness',
        THIRD_PARTY_INSURANCE: 'Third Party Insurance',
        INTERNATIONAL_DRIVING_LICENSE: 'International Driving Licence',
        TINTED_PERMIT: 'Tinted Permit',
    };
    return map[ name?.trim() ] || name || 'Service';
};

/** Can the user pay or proceed for this order? */
const isPayable = (status) => [ 'PENDING', 'CONFIRMED' ].includes(status?.toUpperCase());

/** Copy text to clipboard with feedback */
const copyToClipboard = (text, label = 'Copied!') => {
    navigator.clipboard?.writeText(text).then(() => toast.success(label));
};

// ── Detail Row ────────────────────────────────────────────────────────────────
function DetailRow({ label, value, mono = false, copyable = false }) {
    if (!value && value !== 0) return null;
    const displayVal = String(value);
    return (
        <div className="billing-detail-row">
            <span className="billing-detail-label">{label}</span>
            <span
                className={`billing-detail-value${mono ? ' mono' : ''}${copyable ? ' pointer' : ''}`}
                onClick={copyable ? () => copyToClipboard(displayVal, `${label} copied!`) : undefined}
                title={copyable ? 'Click to copy' : undefined}
                style={copyable ? { cursor: 'pointer', textDecoration: 'underline dotted #9ca3af' } : {}}
            >
                {displayVal}
                {copyable && (
                    <span style={{ marginLeft: 4, fontSize: 10, color: '#9ca3af' }}>⎘</span>
                )}
            </span>
        </div>
    );
}

// ── Pay Now Flow ─────────────────────────────────────────────────────────────
function PayNowModal({ order, open, onClose }) {
    const STEP = { IDLE: 0, BILLING: 1, INIT: 2, DONE: 3 };
    const [ step, setStep ] = useState(STEP.IDLE);
    const [ error, setError ] = useState(null);

    const steps = [
        { label: 'Generate billing receipt' },
        { label: 'Initialize payment gateway' },
        { label: 'Redirecting to checkout…' },
    ];

    const handlePay = async () => {
        setError(null);
        try {
            // Step 1: Billing receipt (moves status PENDING → CONFIRMED)
            setStep(STEP.BILLING);
            if (order.receipt_status === 'PENDING') {
                await generateBillingReceipt(order.order_id);
            }

            // Step 2: Initialize payment → get authorizationUrl
            setStep(STEP.INIT);
            const initRes = await initializePayment(order.order_id);
            const authUrl = initRes?.data?.data?.authorizationUrl;
            if (!authUrl) throw new Error('No payment URL returned. Please try again.');

            // Step 3: Redirect
            setStep(STEP.DONE);
            setTimeout(() => { window.location.href = authUrl; }, 600);
        } catch (err) {
            setStep(STEP.IDLE);
            const msg = err?.error || err?.message || 'Payment initialization failed.';
            setError(msg);
            toast.error(msg);
        }
    };

    const isProcessing = step > STEP.IDLE && step < STEP.DONE;

    return (
        <Modal
            open={open}
            onCancel={isProcessing ? undefined : onClose}
            closable={!isProcessing}
            maskClosable={!isProcessing}
            footer={null}
            centered
            title={null}
            width={460}
        >
            {/* Service header */}
            <div className="billing-modal-service-header">
                <div className="billing-modal-service-icon">💳</div>
                <p className="billing-modal-service-name">
                    {serviceLabel(order?.revenue_module_metadata?.revenueClientName)}
                </p>
                <p className="billing-modal-service-desc">
                    You are about to proceed with payment for this order.
                </p>
            </div>

            {/* Fee breakdown */}
            <div style={{ padding: '0 0 4px' }}>
                <div className="billing-modal-fee-row">
                    <span className="billing-modal-fee-label">Order ID</span>
                    <span className="billing-modal-fee-value" style={{ fontFamily: 'monospace', fontSize: 12 }}>
                        {order?.order_id}
                    </span>
                </div>
                <div className="billing-modal-fee-row">
                    <span className="billing-modal-fee-label">Gateway</span>
                    <span className="billing-modal-fee-value" style={{ textTransform: 'capitalize' }}>
                        {order?.gateway}
                    </span>
                </div>
                <div className="billing-modal-fee-row">
                    <span className="billing-modal-fee-label">Currency</span>
                    <span className="billing-modal-fee-value">{order?.currency || 'NGN'}</span>
                </div>
            </div>

            <div className="billing-modal-total-row">
                <span className="billing-modal-total-label">Total Amount</span>
                <span className="billing-modal-total-value">
                    {formatAmount(order?.amount, order?.currency)}
                </span>
            </div>

            {/* Steps progress */}
            {step > STEP.IDLE && (
                <div className="billing-modal-steps">
                    {steps.map((s, i) => {
                        const idx = i + 1;
                        const isDone = step > idx;
                        const isActive = step === idx;
                        return (
                            <div
                                key={s.label}
                                className={`billing-modal-step${isDone ? ' done' : isActive ? ' active' : ''}`}
                            >
                                <span className="billing-modal-step-dot">
                                    {isDone ? '✓' : isActive
                                        ? <Spin indicator={<LoadingOutlined style={{ fontSize: 10, color: '#fff' }} spin />} />
                                        : idx}
                                </span>
                                {s.label}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Error */}
            {error && (
                <div style={{
                    marginTop: 12, padding: '10px 14px', borderRadius: 8,
                    background: '#fff5f5', border: '1px solid #fca5a5',
                    color: '#dc2626', fontSize: 13,
                }}>
                    {error}
                </div>
            )}

            {/* Action buttons */}
            <div className="billing-action-bar" style={{ paddingTop: 20 }}>
                <button
                    className="billing-pay-btn"
                    onClick={handlePay}
                    disabled={isProcessing}
                    style={{ flex: 1 }}
                >
                    {isProcessing
                        ? <Spin indicator={<LoadingOutlined style={{ fontSize: 14, color: '#fff' }} spin />} />
                        : 'Proceed to Payment'}
                </button>
                {!isProcessing && (
                    <button className="billing-secondary-btn" onClick={onClose}>Cancel</button>
                )}
            </div>
        </Modal>
    );
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function TransactionDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [ order, setOrder ] = useState(null);
    const [ isLoading, setLoading ] = useState(true);
    const [ error, setError ] = useState(null);
    const [ payOpen, setPayOpen ] = useState(false);

    const load = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetchTransaction(id);
            setOrder(res.data || res);
        } catch (err) {
            setError(err?.error || 'Could not load this transaction.');
        } finally {
            setLoading(false);
        }
    }, [ id ]);

    useEffect(() => { load(); }, [ load ]);

    if (isLoading) {
        return (
            <BillingLayout title="Transaction Detail" backTo="/transactions">
                <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}>
                    <Spin indicator={<LoadingOutlined style={{ fontSize: 32, color: '#1C3F3A' }} spin />} />
                </div>
            </BillingLayout>
        );
    }

    if (error || !order) {
        return (
            <BillingLayout title="Transaction Detail" backTo="/transactions">
                <div className="billing-empty">
                    <div className="billing-empty-icon">⚠️</div>
                    <p className="billing-empty-title">Transaction not found</p>
                    <p className="billing-empty-desc">{error || 'This transaction does not exist.'}</p>
                    <button onClick={() => navigate('/transactions')} className="billing-pay-btn" style={{ marginTop: 16 }}>
                        Back to Transactions
                    </button>
                </div>
            </BillingLayout>
        );
    }

    const service = serviceLabel(order.revenue_module_metadata?.revenueClientName);
    const canPay = isPayable(order.receipt_status);

    return (
        <BillingLayout
            title={service}
            description={`Order ${order.order_id}`}
            backTo="/transactions"
            actions={
                canPay ? (
                    <button className="billing-pay-btn" onClick={() => setPayOpen(true)}>
                        Pay Now
                    </button>
                ) : null
            }
        >
            <div className="billing-page">

                {/* ── Amount Hero ─────────────────────────────────────────────── */}
                <div className="billing-amount-hero">
                    <p className="billing-amount-hero-label">Amount Due</p>
                    <p className="billing-amount-hero-value">
                        <span className="billing-amount-hero-currency">
                            {order.currency === 'NGN' ? '₦' : order.currency}
                        </span>
                        {parseFloat(order.amount || 0).toLocaleString('en-NG', {
                            minimumFractionDigits: 2, maximumFractionDigits: 2,
                        })}
                    </p>
                    <p className="billing-amount-hero-sub">
                        <OrderStatusBadge status={order.receipt_status} size="md" />
                    </p>
                </div>

                {/* ── Detail Grid ─────────────────────────────────────────────── */}
                <div className="billing-detail-grid">

                    {/* Order Info */}
                    <div className="billing-detail-card">
                        <p className="billing-detail-card-title">Order Information</p>
                        <DetailRow label="Order ID" value={order.order_id} mono copyable />
                        <DetailRow label="Status" value={order.receipt_status} />
                        <DetailRow label="Gateway" value={order.gateway} />
                        <DetailRow label="Currency" value={order.currency} />
                        <DetailRow label="Created" value={formatDate(order.createdAt)} />
                        <DetailRow label="Last Updated" value={formatDate(order.updatedAt)} />
                    </div>

                    {/* Payment Info */}
                    <div className="billing-detail-card">
                        <p className="billing-detail-card-title">Payment Details</p>
                        <DetailRow label="Payment Ref" value={order.payment_reference} mono copyable />
                        <DetailRow label="Gateway Ref" value={order.gateway_reference} mono copyable />
                        <DetailRow label="Processed" value={order.is_gateway_processed ? 'Yes' : 'No'} />
                    </div>

                    {/* Billing Metadata */}
                    {order.billing_metadata && (
                        <div className="billing-detail-card">
                            <p className="billing-detail-card-title">Billing Details</p>
                            <DetailRow label="Payer ID" value={order.billing_metadata.pid} />
                            <DetailRow label="Client Type" value={order.billing_metadata.billingClientType === 'C' ? 'Corporate' : 'Individual'} />
                            <DetailRow label="Agency Code" value={order.billing_metadata.agencyCode} />
                            <DetailRow label="Applied Date" value={order.billing_metadata.appliedDate} />
                            <DetailRow label="Assessment Ref" value={order.billing_metadata.assessmentReference} mono />
                            <DetailRow label="Country" value={order.billing_metadata.country} />
                            <DetailRow label="State" value={order.billing_metadata.state} />
                        </div>
                    )}

                    {/* Revenue Module */}
                    {order.revenue_module_metadata && (
                        <div className="billing-detail-card">
                            <p className="billing-detail-card-title">Service Module</p>
                            <DetailRow label="Service" value={service} />
                            <DetailRow label="Revenue Code" value={order.revenue_module_metadata.revenueCode} mono />
                            <DetailRow label="Client ID" value={order.revenue_module_metadata.revenueClientId} mono copyable />
                            {order.revenue_module_metadata.revenueProductDescription && (
                                <DetailRow label="Description"
                                    value={order.revenue_module_metadata.revenueProductDescription} />
                            )}
                        </div>
                    )}

                </div>

                {/* ── Action Bar ──────────────────────────────────────────────── */}
                <div className="billing-action-bar">
                    {canPay && (
                        <button className="billing-pay-btn" onClick={() => setPayOpen(true)}>
                            Pay Now — {formatAmount(order.amount, order.currency)}
                        </button>
                    )}
                    <button
                        className="billing-secondary-btn"
                        onClick={() => navigate('/transactions')}
                    >
                        ← All Transactions
                    </button>
                    <button
                        className="billing-secondary-btn"
                        onClick={load}
                        title="Refresh transaction status"
                    >
                        ↻ Refresh Status
                    </button>
                </div>

            </div>

            {/* Pay Now Modal */}
            {payOpen && (
                <PayNowModal
                    order={order}
                    open={payOpen}
                    onClose={() => { setPayOpen(false); load(); }}
                />
            )}
        </BillingLayout>
    );
}