import React from 'react';
import ServiceCard from './ServiceCard';
import Cookies from 'js-cookie';
// import { toast } from 'react-toastify';

// Mapping of app names to service redirect URLs
const serviceUrlMap = {
  NUMBER_PLATE_SERVICES: 'https://mvaa-portal.netlify.app/auth/shared-user',
  AUTO_DEALER_SPARE_PARTS: 'https://mvatvtlagos.com/mvaa-app/verify-session',
};

const ServicesComponent = () => {
  // Read user type from cookie set at login time
  const isCompany = Cookies.get('user_type') === 'company';

  const handleServiceClick = (appName, appId) => {
    // Guard: redirect to login if not authenticated
    const sessionId = Cookies.get('portal_session_id');
    if (!sessionId) {
      window.location.href = '/login';
      return;
    }

    // TODO: re-enable verification enforcement when ready
    // if (!isVerified) {
    //   toast.error('Please complete your account verification before accessing services.', {
    //     autoClose: 4000,
    //   });
    //   setTimeout(() => { window.location.href = verifyPath; }, 1500);
    //   return;
    // }

    // Set the portal_app_id cookie for downstream use
    Cookies.set('portal_app_id', appId, {
      secure: window.location.protocol === 'https:',
      sameSite: 'strict',
    });

    // Construct redirect URL and navigate
    const baseUrl = serviceUrlMap[ appName ] || 'https://default.module1url.com';
    const redirectUrl = `${baseUrl}?portal_session_id=${sessionId}&portal_app_id=${appId}`;
    window.location.href = redirectUrl;
  };

  return (
    <section id="services-section">
      <div className="container rel">
        <div className="title-txts text-center mb-[62px]">
          <h1>Services</h1>
          <p>Lagos State VEHICLE services and information</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 service-card-grid gap-x-6 gap-y-8">
          <ServiceCard
            title="Number Plate Services"
            icon="plateNo.png"
            description="Find vehicle related services like verify VIN, pay VIS etc permit"
            app_id="e520d3f23008eba1fdb472898d918028c495"
            onClick={() => handleServiceClick('NUMBER_PLATE_SERVICES', 'e520d3f23008eba1fdb472898d918028c495')}
          />
          {/* <ServiceCard
            title="AutoDealer and Spare Part"
            icon="jacket.png"
            description="Find vehicle related services like verify VIN, pay VIS etc permit"
            app_id="9dd1dda32a635879fb7fdd617629189111b0"
            onClick={() => handleServiceClick('AUTO_DEALER_SPARE_PARTS', '9dd1dda32a635879fb7fdd617629189111b0')}
          /> */}

          {/* Auto Dealer card — only visible to company users */}
          {isCompany && (
            <ServiceCard
              title="AutoDealer and Spare Part"
              icon="jacket.png"
              description="Find vehicle related services like verify VIN, pay VIS etc permit"
              app_id="9dd1dda32a635879fb7fdd617629189111b0"
              onClick={() => handleServiceClick('AUTO_DEALER_SPARE_PARTS', '9dd1dda32a635879fb7fdd617629189111b0')}
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default ServicesComponent;