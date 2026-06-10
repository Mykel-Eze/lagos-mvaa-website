// src/components/ServicesComponent.jsx
import React from 'react';
import ServiceCard from './ServiceCard';
import { toast } from 'react-toastify';
import { issueServiceToken } from '../services/api';

// Mapping of service app names to their external module entry URLs
const SERVICE_URL_MAP = {
  NUMBER_PLATE_SERVICES: 'https://mvaa-portal.netlify.app/auth/shared-user',
  AUTO_DEALER_SPARE_PARTS: 'https://mvatvtlagos.com/mvaa-app/verify-session',
};

const getUserCookie = () => {
  try { return JSON.parse(sessionStorage.getItem('user') || '{}'); } catch { return {}; }
};

const ServicesComponent = () => {
  const handleServiceClick = async (appName, appId) => {
    // Guard: not authenticated
    const sessionId = sessionStorage.getItem('portal_session_id');
    if (!sessionId) {
      window.location.href = '/login';
      return;
    }

    // Guard: account must be verified before accessing any service
    const user = getUserCookie();
    const isVerified = user.is_verified ?? user.isVerified ?? false;
    if (!isVerified) {
      const userType = sessionStorage.getItem('user_type') || 'individual';
      const verifyPath = userType === 'company' ? '/verify/company' : '/verify/individual';
      toast.error('Please complete your account verification before accessing services.', { autoClose: 4000 });
      setTimeout(() => { window.location.href = verifyPath; }, 1500);
      return;
    }

    const targetUrl = SERVICE_URL_MAP[ appName ] || 'https://default.module1url.com';

    // Store the app_id for the external module's reference.
    sessionStorage.setItem('portal_app_id', appId);

    // Hand off via the v2 session handshake instead of attaching our session credential to
    // the third-party URL. issueServiceToken authenticates the same way as our v1 calls (the
    // session header) and returns the target `url` with a short-lived (180s) one-time token
    // appended — we navigate there, so the third party only ever receives the disposable
    // token, never our session.
    const userType = sessionStorage.getItem('user_type') || 'individual';
    try {
      const data = await issueServiceToken({ email: user.email || '', url: targetUrl, userType });
      if (!data?.url) throw new Error('Could not start the service session.');
      window.location.href = data.url;
    } catch (err) {
      toast.error(err?.error || err?.details || err?.message || 'Could not connect to the service. Please try again.');
    }
  };

  const isVerified = !!(getUserCookie().is_verified ?? getUserCookie().isVerified ?? false);

  return (
    <section id="services-section">
      <div className="container rel">
        <div className="title-txts text-center mb-[62px]">
          <h1>Services</h1>
          <p>Lagos State VEHICLE services and information</p>
        </div>

        <div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 service-card-grid gap-x-6 gap-y-8"
          style={!isVerified ? { opacity: 0.55, filter: 'grayscale(0.4)' } : undefined}
        >
          <ServiceCard
            title="Number Plate Services"
            icon="plateNo.png"
            description="Find vehicle related services like verify VIN, pay VIS etc permit"
            app_id="e520d3f23008eba1fdb472898d918028c495"
            onClick={() => handleServiceClick('NUMBER_PLATE_SERVICES', 'e520d3f23008eba1fdb472898d918028c495')}
          />
          <ServiceCard
            title="AutoDealer and Spare Part"
            icon="jacket.png"
            description="Find vehicle related services like verify VIN, pay VIS etc permit"
            app_id="9dd1dda32a635879fb7fdd617629189111b0"
            onClick={() => handleServiceClick('AUTO_DEALER_SPARE_PARTS', '9dd1dda32a635879fb7fdd617629189111b0')}
          />
        </div>
      </div>
    </section>
  );
};

export default ServicesComponent;
