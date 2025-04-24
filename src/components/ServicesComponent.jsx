/* eslint-disable no-unused-vars */
import React from 'react';
import ServiceCard from './ServiceCard';

const ServicesComponent = () => {
  return (
    <section id="services-section">
        <div className="container rel">
            <div className="title-txts text-center mb-[62px]">
                <h1>Motor Vehicle  Services</h1>
                <p>Lagos State VEHICLE services and information</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 service-card-grid gap-x-6 gap-y-8">
                <ServiceCard 
                    title="Number Plate Services" 
                    icon="plateNo.png" 
                    link="/services/number-plate-services" 
                    description="Find vehicle related services like verify VIN, pay VIS etc  permit"
                    app_id={"NUMBER_PLATE_SERVICES"}
                />
                <ServiceCard 
                    title="AutoDealer and Spare Part" 
                    icon="jacket.png" 
                    link="/register"
                    description="Find vehicle related services like verify VIN, pay VIS etc  permit"
                    app_id={"AUTO_DEALER_SPARE_PARTS"}
                />
                <ServiceCard 
                    title="Car Registration" 
                    icon="steering.png" 
                    link="/register"
                    description="Find vehicle related services like verify VIN, pay VIS etc  permit"
                    app_id={"VEHICLE_REGISTRATION"}
                />
                <ServiceCard 
                    title="Driving License" 
                    icon="plateNo.png" 
                    link="/register"
                    description="Find vehicle related services like verify VIN, pay VIS etc  permit"
                    app_id={"DRIVING_LICENSE"}
                />
                <ServiceCard 
                    title="Hackney Permit" 
                    icon="hackney.png"  
                    link="/register"
                    description="Find vehicle related services like verify VIN, pay VIS etc  permit"
                    app_id={"HACKNEY_PERMIT"}
                />
                <ServiceCard 
                    title="Road Worthiness" 
                    icon="steering.png" 
                    link="/register"
                    description="Find vehicle related services like verify VIN, pay VIS etc  permit"
                    app_id={"ROAD_WORTHINESS"}
                />
                <ServiceCard 
                    title="Third Party Insurance" 
                    icon="plateNo.png" 
                    link="/register"
                    description="Find vehicle related services like verify VIN, pay VIS etc  permit"
                    app_id={"THIRD_PARTY_INSURANCE"}
                />
                <ServiceCard 
                    title="Int'l Driving License" 
                    icon="jacket.png" 
                    link="/register"
                    description="Find vehicle related services like verify VIN, pay VIS etc  permit"
                    app_id={"INTERNATIONAL_DRIVING_LICENSE"}
                />
                <ServiceCard 
                    title="Tinted Permit" 
                    icon="steering.png" 
                    link="/register"
                    description="Find vehicle related services like verify VIN, pay VIS etc  permit"
                    app_id={"TINTED_PERMIT"}
                />
                <ServiceCard 
                    title="Number Plate Services" 
                    icon="keke.png" 
                    link="/register"
                    description="Find vehicle related services like verify VIN, pay VIS etc  permit"
                    app_id={"NUMBER_PLATE_SERVICES"}
                />
                <ServiceCard 
                    title="Number Plate Services" 
                    icon="hackney.png" 
                    link="/register"
                    description="Find vehicle related services like verify VIN, pay VIS etc  permit"
                    app_id={"NUMBER_PLATE_SERVICES"}
                />
            </div>
        </div>
    </section>
  );
};

export default ServicesComponent;