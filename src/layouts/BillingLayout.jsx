// src/layouts/BillingLayout.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * BillingLayout
 * Mirrors ServicesLayout in structure and class usage, but lives in its own
 * file for billing-specific pages (TransactionHistory, TransactionDetail, etc.).
 *
 * Props:
 *  - title       : string   — page heading
 *  - description : string   — optional subheading
 *  - backTo      : string   — explicit back path (defaults to browser history -1)
 *  - actions     : ReactNode — optional right-side header actions (e.g. a "Pay Now" button)
 *  - children    : ReactNode
 */
const BillingLayout = ({ children, title, description = '', backTo, actions }) => {
    const navigate = useNavigate();

    const handleBack = () => (backTo ? navigate(backTo) : navigate(-1));

    return (
        <main className="flex-grow bg-white px-6 py-8 mb-[50px]">
            <div className="max-w-6xl mx-auto">

                {/* Back Button */}
                <div className="flex-div gap-4">
                    <img src={require('../assets/images/back-arr.svg').default} alt="back-arrow" />
                    <button onClick={handleBack} className="back-btn">
                        BACK
                    </button>
                </div>

                {/* Title row + optional actions */}
                <div className="services-title-header py-4 flex-div justify-content-btw flex-wrap gap-4">
                    <div>
                        <h1>{title}</h1>
                        {description && <p>{description}</p>}
                    </div>
                    {actions && <div className="billing-layout-actions">{actions}</div>}
                </div>

                {/* Content */}
                {children}

            </div>
        </main>
    );
};

export default BillingLayout;