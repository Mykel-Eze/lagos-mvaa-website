// src/components/OrderStatusBadge.jsx

/**
 * OrderStatusBadge
 * Renders a colour-coded pill badge for WeightedOrderEntity receipt_status.
 * Statuses: PENDING | CONFIRMED | FULFILLED | PROCESSED | FAILED | CANCELLED
 */
const STATUS_CONFIG = {
    PENDING: {
        bg: '#fffbeb', border: '#fcd34d', color: '#92400e', label: 'Pending',
    },
    CONFIRMED: {
        bg: '#eff6ff', border: '#93c5fd', color: '#1d4ed8', label: 'Confirmed',
    },
    FULFILLED: {
        bg: '#f0fdf4', border: '#86efac', color: '#108A00', label: 'Fulfilled',
    },
    PROCESSED: {
        bg: '#ecfdf5', border: '#6ee7b7', color: '#1C3F3A', label: 'Processed',
    },
    FAILED: {
        bg: '#fff5f5', border: '#fca5a5', color: '#dc2626', label: 'Failed',
    },
    CANCELLED: {
        bg: '#f9fafb', border: '#d1d5db', color: '#6b7280', label: 'Cancelled',
    },
};

const OrderStatusBadge = ({ status, size = 'md' }) => {
    const config = STATUS_CONFIG[ status?.toUpperCase() ] || {
        bg: '#f9fafb', border: '#d1d5db', color: '#6b7280', label: status || 'Unknown',
    };

    const sizeStyles = {
        sm: { fontSize: '10px', padding: '2px 8px' },
        md: { fontSize: '12px', padding: '3px 10px' },
        lg: { fontSize: '13px', padding: '5px 14px' },
    };

    return (
        <span
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                fontWeight: 700,
                letterSpacing: '0.04em',
                borderRadius: '999px',
                border: `1.5px solid ${config.border}`,
                background: config.bg,
                color: config.color,
                whiteSpace: 'nowrap',
                ...sizeStyles[ size ],
            }}
        >
            {/* Status dot */}
            <span
                style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: config.color,
                    flexShrink: 0,
                }}
            />
            {config.label}
        </span>
    );
};

export default OrderStatusBadge;