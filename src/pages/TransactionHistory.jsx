// src/pages/TransactionHistory.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

import { fetchTransactions } from '../services/api';
import BillingLayout from '../layouts/BillingLayout';
import OrderStatusBadge from '../components/OrderStatusBadge';

// ── Helpers ──────────────────────────────────────────────────────────────────

const ALL_FILTERS = [ 'ALL', 'PENDING', 'CONFIRMED', 'FULFILLED', 'PROCESSED', 'FAILED', 'CANCELLED' ];

/** Format NGN amount string → "₦3,100.00" */
const formatAmount = (amount, currency = 'NGN') => {
  const symbol = currency === 'NGN' ? '₦' : currency;
  const num = parseFloat(amount);
  if (isNaN(num)) return `${symbol}—`;
  return `${symbol}${num.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

/** Format ISO date → "27 Mar 2026, 11:45 AM" */
const formatDate = (iso) => {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('en-NG', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
};

/** Convert revenueClientName enum → readable label */
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

// ── Skeleton loader ──────────────────────────────────────────────────────────
function SkeletonList() {
  return (
    <div className="billing-list">
      {[ ...Array(5) ].map((_, i) => (
        <div key={i} className="billing-skeleton-row" style={{ animationDelay: `${i * 0.1}s` }} />
      ))}
    </div>
  );
}

// ── Empty state ──────────────────────────────────────────────────────────────
function EmptyState({ filter }) {
  return (
    <div className="billing-empty">
      <div className="billing-empty-icon">🧾</div>
      <p className="billing-empty-title">
        {filter === 'ALL' ? 'No transactions yet' : `No ${filter.toLowerCase()} transactions`}
      </p>
      <p className="billing-empty-desc">
        {filter === 'ALL'
          ? 'Your payment history will appear here once you access a service.'
          : `You have no transactions with status "${filter}" at the moment.`}
      </p>
    </div>
  );
}

// ── Single row ───────────────────────────────────────────────────────────────
function TransactionRow({ order }) {
  const service = serviceLabel(order.revenue_module_metadata?.revenueClientName);
  return (
    <Link to={`/transactions/${order.order_id}`} className="billing-row">
      <div className="billing-row-left">
        <span className="billing-row-service">{service}</span>
        <span className="billing-row-id">{order.order_id}</span>
        <span className="billing-row-date">{formatDate(order.createdAt)}</span>
      </div>
      <div className="billing-row-right">
        <span className="billing-row-amount">
          {formatAmount(order.amount, order.currency)}
        </span>
        <OrderStatusBadge status={order.receipt_status} size="sm" />
        <span className="billing-row-gateway">{order.gateway}</span>
      </div>
    </Link>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function TransactionHistory() {
  const [ orders, setOrders ] = useState([]);
  const [ isLoading, setIsLoading ] = useState(true);
  const [ error, setError ] = useState(null);
  const [ activeFilter, setFilter ] = useState('ALL');

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetchTransactions();
      // API returns { data: [...] } or { data: { data: [...] } }
      const list = Array.isArray(res.data) ? res.data
        : Array.isArray(res.data?.data) ? res.data.data
          : [];
      // Sort newest first
      setOrders([ ...list ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch (err) {
      const msg = err?.error || err?.message || '';
      const isUserFacing = msg && msg.length < 120 && !/buffer|undefined|null|stack|at Object|at Array/i.test(msg);
      setError(isUserFacing ? msg : 'Failed to load transactions. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [ load ]);

  const filtered = activeFilter === 'ALL'
    ? orders
    : orders.filter(o => o.receipt_status === activeFilter);

  // Count per status for badge
  const counts = orders.reduce((acc, o) => {
    acc[ o.receipt_status ] = (acc[ o.receipt_status ] || 0) + 1;
    return acc;
  }, {});

  return (
    <BillingLayout
      title="Transaction History"
      description="View and manage all your MVAA service payments."
      backTo="/services"
    >
      <div className="billing-page">

        {/* ── Toolbar ───────────────────────────────────────────────────── */}
        <div className="billing-toolbar">
          <div className="billing-filter-group">
            {ALL_FILTERS.map(f => (
              <button
                key={f}
                className={`billing-filter-btn ${activeFilter === f ? 'active' : ''}`}
                onClick={() => setFilter(f)}
              >
                {f === 'ALL' ? 'All' : f.charAt(0) + f.slice(1).toLowerCase()}
                {f !== 'ALL' && counts[ f ] > 0 && (
                  <span className="billing-count-badge">{counts[ f ]}</span>
                )}
                {f === 'ALL' && orders.length > 0 && (
                  <span className="billing-count-badge">{orders.length}</span>
                )}
              </button>
            ))}
          </div>

          <button
            onClick={load}
            className="billing-secondary-btn"
            disabled={isLoading}
            title="Refresh"
          >
            <span style={{ fontSize: 14, lineHeight: 1 }}>↻</span>
            Refresh
          </button>
        </div>

        {/* ── Content ───────────────────────────────────────────────────── */}
        {isLoading ? (
          <SkeletonList />
        ) : error ? (
          <div className="billing-empty">
            <div className="billing-empty-icon">⚠️</div>
            <p className="billing-empty-title">Could not load transactions</p>
            <p className="billing-empty-desc">{error}</p>
            <button onClick={load} className="billing-pay-btn" style={{ marginTop: 16 }}>
              Try Again
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState filter={activeFilter} />
        ) : (
          <div className="billing-list">
            {filtered.map(order => (
              <TransactionRow key={order.order_id} order={order} />
            ))}
          </div>
        )}

      </div>
    </BillingLayout>
  );
}