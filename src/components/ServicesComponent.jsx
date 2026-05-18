// src/components/ServicesComponent.jsx
import React, { useState } from 'react';
import ServiceCard from './ServiceCard';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import { issueServiceToken } from '../services/api';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

// Mapping of service app names to their external module entry URLs
const SERVICE_URL_MAP = {
  NUMBER_PLATE_SERVICES: 'https://mvaa-portal.netlify.app/auth/shared-user',
  AUTO_DEALER_SPARE_PARTS: 'https://mvatvtlagos.com/mvaa-app/verify-session',
};

const ServicesComponent = () => {
  const [ loadingService, setLoadingService ] = useState(null);

  const handleServiceClick = async (appName, appId) => {
    // Guard: not authenticated
    const sessionId = Cookies.get('portal_session_id');
    if (!sessionId) {
      window.location.href = '/login';
      return;
    }

    // Guard: prevent double-click while a redirect is in-flight
    if (loadingService) return;

    const userEmail = (() => {
      try { return JSON.parse(Cookies.get('user') || '{}').email || ''; } catch { return ''; }
    })();
    const userType = Cookies.get('user_type') || 'individual';
    const baseUrl = SERVICE_URL_MAP[ appName ] || 'https://default.module1url.com';

    setLoadingService(appName);

    try {
      /**
       * SECURE REDIRECT — replaces the previous pattern of passing raw
       * portal_session_id in the query string (a security exposure).
       *
       * Flow:
       *  1. Portal calls /v2/session/auth/issuetoken → receives a one-time
       *     token (OHT) that expires in 180 seconds.
       *  2. Portal redirects the user to the external module URL with only
       *     the short-lived OHT — never the raw session cookie.
       *  3. The external module calls /v2/session/auth/connect/{oht} to
       *     exchange it for its own handshake_token.
       *
       * If issuetoken fails (e.g. network error), we fall back to a direct
       * redirect with a minimal query string so the user is never stranded.
       */
      const res = await issueServiceToken({
        email: userEmail,
        sid: sessionId,
        targetUrl: baseUrl,
        userType,
      });

      // Store the app_id cookie for the external module's reference
      Cookies.set('portal_app_id', appId, {
        secure: window.location.protocol === 'https:',
        sameSite: 'strict',
      });

      // The backend can return a pre-built redirect URL or just the oht
      const redirectUrl = res.url || `${baseUrl}?token=${res.oht}&portal_app_id=${appId}`;
      window.location.href = redirectUrl;

    } catch (err) {
      console.error('issueServiceToken failed, attempting fallback redirect:', err);
      toast.warning(
        'Secure token generation failed — using direct session redirect.',
        { autoClose: 3000 }
      );
      // Fallback: pass session ID directly (same as previous behaviour)
      // This should only happen if the v2 session endpoint is unavailable.
      const fallbackUrl = `${baseUrl}?portal_session_id=${sessionId}&portal_app_id=${appId}`;
      window.location.href = fallbackUrl;
    } finally {
      setLoadingService(null);
    }
  };

  return (
    <section id="services-section">
      <div className="container rel">
        <div className="title-txts text-center mb-[62px]">
          <h1>Services</h1>
          <p>Lagos State VEHICLE services and information</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 service-card-grid gap-x-6 gap-y-8">

          {/* Number Plate Services — available to all authenticated users */}
          <ServiceCard
            title="Number Plate Services"
            icon="plateNo.png"
            description="Find vehicle related services like verify VIN, pay VIS etc permit"
            app_id="e520d3f23008eba1fdb472898d918028c495"
            loading={loadingService === 'NUMBER_PLATE_SERVICES'}
            onClick={() => handleServiceClick('NUMBER_PLATE_SERVICES', 'e520d3f23008eba1fdb472898d918028c495')}
          />
          <ServiceCard
            title="AutoDealer and Spare Part"
            icon="jacket.png"
            description="Find vehicle related services like verify VIN, pay VIS etc permit"
            app_id="9dd1dda32a635879fb7fdd617629189111b0"
            loading={loadingService === 'AUTO_DEALER_SPARE_PARTS'}
            onClick={() => handleServiceClick('AUTO_DEALER_SPARE_PARTS', '9dd1dda32a635879fb7fdd617629189111b0')}
          />

          {/* AutoDealer and Spare Parts — company accounts only */}
          {/* {isCompany && (
            <ServiceCard
              title="AutoDealer and Spare Part"
              icon="jacket.png"
              description="Find vehicle related services like verify VIN, pay VIS etc permit"
              app_id="9dd1dda32a635879fb7fdd617629189111b0"
              loading={loadingService === 'AUTO_DEALER_SPARE_PARTS'}
              onClick={() => handleServiceClick('AUTO_DEALER_SPARE_PARTS', '9dd1dda32a635879fb7fdd617629189111b0')}
            />
          )} */}

        </div>

        {/* Redirect spinner overlay */}
        {loadingService && (
          <div style={{
            position: 'fixed', inset: 0, background: 'rgba(28,63,58,0.55)',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            zIndex: 9999, gap: 16,
          }}>
            <Spin indicator={<LoadingOutlined style={{ fontSize: 40, color: '#fff' }} spin />} />
            <p style={{
              color: '#fff', fontFamily: 'Plus Jakarta Sans, sans-serif',
              fontSize: 15, fontWeight: 600, letterSpacing: '0.04em',
            }}>
              Generating secure session…
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ServicesComponent;