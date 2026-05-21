// src/components/ServicesComponent.jsx
import React from 'react';
import ServiceCard from './ServiceCard';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';

// Mapping of service app names to their external module entry URLs
const SERVICE_URL_MAP = {
  NUMBER_PLATE_SERVICES: 'https://mvaa-portal.netlify.app/auth/shared-user',
  AUTO_DEALER_SPARE_PARTS: 'https://mvatvtlagos.com/mvaa-app/verify-session',
};

const getUserCookie = () => {
  try { return JSON.parse(Cookies.get('user') || '{}'); } catch { return {}; }
};

const ServicesComponent = () => {
  const handleServiceClick = (appName, appId) => {
    // Guard: not authenticated
    const sessionId = Cookies.get('portal_session_id');
    if (!sessionId) {
      window.location.href = '/login';
      return;
    }

    // Guard: account must be verified before accessing any service
    const user = getUserCookie();
    const isVerified = user.is_verified ?? user.isVerified ?? false;
    if (!isVerified) {
      const userType = Cookies.get('user_type') || 'individual';
      const verifyPath = userType === 'company' ? '/verify/company' : '/verify/individual';
      toast.error('Please complete your account verification before accessing services.', { autoClose: 4000 });
      setTimeout(() => { window.location.href = verifyPath; }, 1500);
      return;
    }

    const baseUrl = SERVICE_URL_MAP[ appName ] || 'https://default.module1url.com';

    // Store the app_id cookie for the external module's reference
    Cookies.set('portal_app_id', appId, {
      secure: window.location.protocol === 'https:',
      sameSite: 'strict',
    });

    window.location.href = `${baseUrl}?portal_session_id=${sessionId}&portal_app_id=${appId}`;
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
