/* eslint-disable no-unused-vars */
import React from 'react';
import ServiceCard from './ServiceCard';
import Cookies from 'js-cookie';

// Mapping of app_id to service URLs
const serviceUrlMap = {
  NUMBER_PLATE_SERVICES: 'https://mvaa-portal.netlify.app/auth/shared-user',
  AUTO_DEALER_SPARE_PARTS: 'https://mvatvtlagos.com/mvaa-app/verify-session',
  // VEHICLE_REGISTRATION: 'https://registration.module1url.com/',
  // DRIVING_LICENSE: 'https://drivinglicense.module1url.com/',
  // HACKNEY_PERMIT: 'https://hackney.module1url.com/',
  // ROAD_WORTHINESS: 'https://roadworthiness.module1url.com/',
  // THIRD_PARTY_INSURANCE: 'https://insurance.module1url.com/',
  // INTERNATIONAL_DRIVING_LICENSE: 'https://intldrivinglicense.module1url.com/',
  // TINTED_PERMIT: 'https://tintedpermit.module1url.com/',
};

const ServicesComponent = () => {
  const handleServiceClick = (appName, appId) => {
    // Get the session ID from cookies
    const sessionId = Cookies.get('portal_session_id');

    // Guard: redirect to login if not authenticated
    if (!sessionId) {
      window.location.href = '/login';
      return;
    }

    // Set the portal_app_id cookie
    Cookies.set('portal_app_id', appId, {
      secure: window.location.protocol === 'https:',
      sameSite: 'strict',
    });

    // Get the base URL for the service
    const baseUrl = serviceUrlMap[ appName ] || 'https://default.module1url.com';

    // Construct the redirect URL and navigate
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
          <ServiceCard
            title="AutoDealer and Spare Part"
            icon="jacket.png"
            description="Find vehicle related services like verify VIN, pay VIS etc permit"
            app_id="9dd1dda32a635879fb7fdd617629189111b0"
            onClick={() => handleServiceClick('AUTO_DEALER_SPARE_PARTS', '9dd1dda32a635879fb7fdd617629189111b0')}
          />
          {/* <ServiceCard
            title="Car Registration"
            icon="steering.png"
            description="Find vehicle related services like verify VIN, pay VIS etc permit"
            app_id="VEHICLE_REGISTRATION"
            onClick={() => handleServiceClick('VEHICLE_REGISTRATION')}
          />
          <ServiceCard
            title="Driving License"
            icon="plateNo.png"
            description="Find vehicle related services like verify VIN, pay VIS etc permit"
            app_id="DRIVING_LICENSE"
            onClick={() => handleServiceClick('DRIVING_LICENSE')}
          />
          <ServiceCard
            title="Hackney Permit"
            icon="hackney.png"
            description="Find vehicle related services like verify VIN, pay VIS etc permit"
            app_id="HACKNEY_PERMIT"
            onClick={() => handleServiceClick('HACKNEY_PERMIT')}
          />
          <ServiceCard
            title="Road Worthiness"
            icon="steering.png"
            description="Find vehicle related services like verify VIN, pay VIS etc permit"
            app_id="ROAD_WORTHINESS"
            onClick={() => handleServiceClick('ROAD_WORTHINESS')}
          />
          <ServiceCard
            title="Third Party Insurance"
            icon="plateNo.png"
            description="Find vehicle related services like verify VIN, pay VIS etc permit"
            app_id="THIRD_PARTY_INSURANCE"
            onClick={() => handleServiceClick('THIRD_PARTY_INSURANCE')}
          />
          <ServiceCard
            title="Int'l Driving License"
            icon="jacket.png"
            description="Find vehicle related services like verify VIN, pay VIS etc permit"
            app_id="INTERNATIONAL_DRIVING_LICENSE"
            onClick={() => handleServiceClick('INTERNATIONAL_DRIVING_LICENSE')}
          />
          <ServiceCard
            title="Tinted Permit"
            icon="steering.png"
            description="Find vehicle related services like verify VIN, pay VIS etc permit"
            app_id="TINTED_PERMIT"
            onClick={() => handleServiceClick('TINTED_PERMIT')}
          />
          <ServiceCard
            title="Number Plate Services"
            icon="keke.png"
            description="Find vehicle related services like verify VIN, pay VIS etc permit"
            app_id="NUMBER_PLATE_SERVICES"
            onClick={() => handleServiceClick('NUMBER_PLATE_SERVICES')}
          />
          <ServiceCard
            title="Number Plate Services"
            icon="hackney.png"
            description="Find vehicle related services like verify VIN, pay VIS etc permit"
            app_id="NUMBER_PLATE_SERVICES"
            onClick={() => handleServiceClick('NUMBER_PLATE_SERVICES')}
          /> */}
        </div>
      </div>
    </section>
  );
};

export default ServicesComponent;