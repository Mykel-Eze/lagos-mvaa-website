import React from 'react';
import PlateServiceCard from '../components/PlateServiceCard';
import ServicesLayout from '../components/ServicesLayout';

const NumberOfServices = () => {
  return (
    <ServicesLayout
      title="Number Plate Services"
      description="Find vehicle related services like verify VIN, pay VIS etc."
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <PlateServiceCard 
          title="Get New Plate ID" 
          description="REGISTER FOR A LAGOS STATE NEW VEHICLE PLATE NUMBER" 
          image="plate-new.jpg"
          link="/services/new-plate-id-steps"
        />
        <PlateServiceCard 
          title="Reprint Old Plate ID" 
          description="REGISTER FOR A LAGOS STATE NEW VEHICLE PLATE NUMBER" 
          image="plate-old.jpg"
          link="/#"
        />
        <PlateServiceCard 
          title="Customized Plate ID" 
          description="REGISTER FOR A LAGOS STATE NEW VEHICLE PLATE NUMBER" 
          image="plate-custom.jpg"
          link="/#"
        />
      </div>
    </ServicesLayout>
  );
};

export default NumberOfServices;