// src/pages/TransactionDetail.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { fetchTransaction, initializeTransaction } from '../services/api';
import BillingLayout from '../layouts/BillingLayout';
import OrderStatusBadge from '../components/OrderStatusBadge';

// ── Helpers ──────────────────────────────────────────────────────────────────

// const formatAmount = (amount, currency = 'NGN') => {
//     const symbol = currency === 'NGN' ? '₦' : currency;
//     const num = parseFloat(amount);
//     if (isNaN(num)) return `${symbol}—`;
//     return `${symbol}${num.toLocaleString('en-NG', {
//         minimumFractionDigits: 2, maximumFractionDigits: 2,
//     })}`;
// };

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

/** Copy text to clipboard with feedback */
const copyToClipboard = (text, label = 'Copied!') => {
    navigator.clipboard?.writeText(text).then(() => {
        // minimal visual feedback via title attribute; toast not imported here
    });
    void label;
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

// ── Page ─────────────────────────────────────────────────────────────────────
export default function TransactionDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [ order, setOrder ] = useState(null);
    const [ isLoading, setLoading ] = useState(true);
    const [ error, setError ] = useState(null);
    const [ isResuming, setResuming ] = useState(false);
    const [ resumeError, setResumeError ] = useState(null);

    const handleResumePayment = async () => {
        setResuming(true);
        setResumeError(null);
        try {
            const res = await initializeTransaction(order.order_id);
            const payload = res?.data ?? res;
            const redirectUrl = typeof payload === 'string' ? payload : payload?.authorizationUrl;
            if (!redirectUrl) throw new Error('No payment link was returned. Please try again.');
            window.location.href = redirectUrl;
        } catch (err) {
            setResumeError(err?.error || err?.message || 'Could not resume payment. Please try again.');
            setResuming(false);
        }
    };

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

    return (
        <BillingLayout
            title={service}
            description={`Order ${order.order_id}`}
            backTo="/transactions"
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
                    {order.receipt_status === 'CONFIRMED' && (
                        <button
                            className="billing-pay-btn"
                            onClick={handleResumePayment}
                            disabled={isResuming}
                        >
                            {isResuming ? 'Redirecting…' : 'Resume Payment'}
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

                {resumeError && (
                    <p style={{ color: '#dc2626', fontSize: 13, marginTop: 10 }}>{resumeError}</p>
                )}

            </div>
        </BillingLayout>
    );
}
