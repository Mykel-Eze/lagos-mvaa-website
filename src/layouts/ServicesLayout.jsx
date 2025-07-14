import React from 'react';
import { useNavigate } from 'react-router-dom';

const ServicesLayout = ({ children, title, description="" }) => {
  const goBack = useNavigate();

  return (
    <main className="flex-grow bg-white px-6 py-8 mb-[50px]">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <div className="flex-div gap-4">
          <img src={require("../assets/images/back-arr.svg").default} alt="back-arrow" />
          <button onClick={() => goBack(-1)} className="back-btn">
            BACK
          </button>
        </div>

        {/* Title and Description */}
        <div className="services-title-header py-4">
          <h1>{title}</h1>
          <p>{description}</p>
        </div>

        {/* Content */}
        {children}
      </div>
    </main>
  );
};

export default ServicesLayout;