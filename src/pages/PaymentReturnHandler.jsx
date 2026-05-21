// src/pages/PaymentReturnHandler.jsx
import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

/**
 * PaymentReturnHandler
 * Route: /payment/callback
 *
 * Payment gateways redirect back here after the user completes (or cancels) a
 * payment. Redirects the user to their transaction history after a brief delay
 * so they can check the latest payment status there.
 */
export default function PaymentReturnHandler() {
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => navigate('/transactions'), 4000);
        return () => clearTimeout(timer);
    }, [ navigate ]);

    return (
        <div className="payment-return-page">
            <div className="payment-return-card">
                <div className="payment-return-icon">✅</div>
                <h2 className="payment-return-title">Payment Submitted</h2>
                <p className="payment-return-subtitle">
                    Your payment has been submitted to the gateway. You will be redirected
                    to your transaction history shortly to check the latest status.
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
