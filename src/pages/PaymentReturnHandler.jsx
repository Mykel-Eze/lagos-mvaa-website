// src/pages/PaymentReturnHandler.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { verifyTransaction } from '../services/api';

/**
 * PaymentReturnHandler
 * Route: /payment/callback
 *
 * Payment gateways redirect back here after the user completes (or cancels) a
 * payment. We read the reference from the query string, call verifyTransaction,
 * and show a clear success / failure screen.
 *
 * Query params supported:
 *   Paystack / Credo : ?reference=xxx  or  ?trxref=xxx
 *   Flutterwave      : ?transaction_id=xxx  or  ?tx_ref=xxx
 *   Pay4it           : ?ref=xxx
 *   Generic fallback : ?ref=xxx
 */

const STAGE = { VERIFYING: 'verifying', SUCCESS: 'success', FAILED: 'failed', NO_REF: 'no_ref' };

const formatAmount = (amount, currency = 'NGN') => {
    if (!amount && amount !== 0) return null;
    const symbol = currency === 'NGN' ? '₦' : currency;
    const num = typeof amount === 'number' ? amount : parseFloat(amount);
    if (isNaN(num)) return null;
    return `${symbol}${(num / 100).toLocaleString('en-NG', {
        minimumFractionDigits: 2, maximumFractionDigits: 2,
    })}`;
};

export default function PaymentReturnHandler() {
    const [ searchParams ] = useSearchParams();
    const navigate = useNavigate();
    const [ stage, setStage ] = useState(STAGE.VERIFYING);
    const [ txData, setTxData ] = useState(null);
    const [ ref, setRef ] = useState(null);

    useEffect(() => {
        // Extract reference from any of the supported gateway query param names
        const reference =
            searchParams.get('reference') ||
            searchParams.get('trxref') ||
            searchParams.get('tx_ref') ||
            searchParams.get('transaction_id') ||
            searchParams.get('ref');

        if (!reference) {
            setStage(STAGE.NO_REF);
            return;
        }

        setRef(reference);

        const verify = async () => {
            try {
                const res = await verifyTransaction(reference);
                const data = res?.data || res;
                // status === 0 is success for Pay4it; treat any truthy "data" as success
                // Paystack returns status: "success", Flutterwave returns status: "successful"
                const txStatus = String(data?.status ?? '').toLowerCase();
                const isSuccess =
                    data?.status === 0 ||
                    txStatus === 'success' ||
                    txStatus === 'successful' ||
                    txStatus === 'paid';

                setTxData(data);
                setStage(isSuccess ? STAGE.SUCCESS : STAGE.FAILED);
            } catch (err) {
                setTxData({ error: err?.error || err?.message || 'Verification request failed.' });
                setStage(STAGE.FAILED);
            }
        };

        verify();
    }, [ searchParams ]);

    // ── Verifying ──────────────────────────────────────────────────────────────
    if (stage === STAGE.VERIFYING) {
        return (
            <div className="payment-return-page">
                <div className="payment-return-card">
                    <div className="payment-return-icon">⏳</div>
                    <h2 className="payment-return-title">Verifying Payment</h2>
                    <p className="payment-return-subtitle">
                        Please wait while we confirm your payment with the gateway…
                    </p>
                    <Spin indicator={<LoadingOutlined style={{ fontSize: 32, color: '#1C3F3A' }} spin />} />
                </div>
            </div>
        );
    }

    // ── No reference ──────────────────────────────────────────────────────────
    if (stage === STAGE.NO_REF) {
        return (
            <div className="payment-return-page">
                <div className="payment-return-card">
                    <div className="payment-return-icon">🔍</div>
                    <h2 className="payment-return-title">No Reference Found</h2>
                    <p className="payment-return-subtitle">
                        No payment reference was found in this URL. If you just completed a
                        payment, you can check your transaction history for the latest status.
                    </p>
                    <div className="payment-return-actions">
                        <button className="billing-pay-btn" onClick={() => navigate('/transactions')}>
                            View Transactions
                        </button>
                        <Link to="/services" className="billing-secondary-btn" style={{ justifyContent: 'center' }}>
                            Back to Services
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // ── Success ────────────────────────────────────────────────────────────────
    if (stage === STAGE.SUCCESS) {
        const amountDisplay = formatAmount(
            txData?.debitedAmount ?? txData?.transAmount,
            txData?.currencyCode
        );
        return (
            <div className="payment-return-page">
                <div className="payment-return-card">
                    <div className="payment-return-icon">✅</div>
                    <h2 className="payment-return-title success">Payment Successful!</h2>
                    <p className="payment-return-subtitle">
                        Your payment has been confirmed.
                        {amountDisplay && ` A total of ${amountDisplay} was processed.`}
                    </p>

                    {ref && (
                        <div className="payment-return-ref">
                            <span>Payment Reference</span>
                            {ref}
                        </div>
                    )}

                    {txData?.transRef && (
                        <div className="payment-return-ref">
                            <span>Transaction Reference</span>
                            {txData.transRef}
                        </div>
                    )}

                    <div className="payment-return-actions">
                        <button className="billing-pay-btn" onClick={() => navigate('/transactions')}>
                            View Transaction History
                        </button>
                        <Link to="/services" className="billing-secondary-btn" style={{ justifyContent: 'center' }}>
                            Back to Services
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // ── Failed ─────────────────────────────────────────────────────────────────
    return (
        <div className="payment-return-page">
            <div className="payment-return-card">
                <div className="payment-return-icon">❌</div>
                <h2 className="payment-return-title failed">Payment Failed</h2>
                <p className="payment-return-subtitle">
                    We could not confirm your payment. This could be due to a cancellation,
                    insufficient funds, or a network issue. Your order has not been cancelled —
                    you can retry payment from your transaction history.
                </p>

                {ref && (
                    <div className="payment-return-ref">
                        <span>Reference Attempted</span>
                        {ref}
                    </div>
                )}

                {txData?.error && (
                    <div style={{
                        padding: '10px 14px', borderRadius: 8, marginBottom: 16,
                        background: '#fff5f5', border: '1px solid #fca5a5',
                        color: '#dc2626', fontSize: 13, textAlign: 'left',
                    }}>
                        {txData.error}
                    </div>
                )}

                <div className="payment-return-actions">
                    <button className="billing-pay-btn" onClick={() => navigate('/transactions')}>
                        Retry Payment
                    </button>
                    <Link to="/services" className="billing-secondary-btn" style={{ justifyContent: 'center' }}>
                        Back to Services
                    </Link>
                </div>
            </div>
        </div>
    );
}