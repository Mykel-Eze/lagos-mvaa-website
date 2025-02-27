import React from 'react';
import ServicesLayout from '../components/ServicesLayout';
import { Link } from 'react-router-dom';

const NewPlateIdSteps = () => {
  return (
    <ServicesLayout
      title="How do I get a new plate ID"
      description=""
    >
      <div className="plate-steps">
        <div className="plate-step-block">
            <div className="plate-step-number">01</div>
            <div className="plate-step-details">
                <div className="plate-step-title">Number Plate Services</div>
                <ul className="plate-step-txts">
                    <li>Find vehicle related services like verify VIN, pay VIS etc  permit</li>
                    <li>Find vehicle related services like verify VIN, pay VIS etc  permit</li>
                    <li>Find vehicle related services like verify VIN, pay VIS etc  permit</li>
                </ul>
            </div>
        </div>
        <div className="plate-step-block">
            <div className="plate-step-number">02</div>
            <div className="plate-step-details">
                <div className="plate-step-title">Number Plate Services</div>
                <ul className="plate-step-txts">
                    <li>Find vehicle related services like verify VIN, pay VIS etc  permit</li>
                    <li>Find vehicle related services like verify VIN, pay VIS etc  permit</li>
                </ul>
                <div className="mt-4">
                    <Link to="/services/get-new-plate-id" className="get-started-btn-2">Get Started</Link>
                </div>
            </div>
        </div>
        <div className="plate-step-block">
            <div className="plate-step-number">03</div>
            <div className="plate-step-details">
            </div>
        </div>
      </div>
    </ServicesLayout>
  );
};

export default NewPlateIdSteps;