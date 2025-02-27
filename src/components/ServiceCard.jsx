/* eslint-disable no-unused-vars */
import React from 'react';
import { useNavigate } from 'react-router-dom';

const ServiceCard = ({ title, icon, link = "/", gridSpan = "", description }) => {
    const navigate = useNavigate();
  
    return (
        <div className={`service-card py-[36px] px-[44px] flex flex-col items-center hover:shadow-md cursor-pointer ${gridSpan}`}
            onClick={() => navigate(link)}>
            <div className="mb-4">
                <img 
                    src={require(`../assets/images/${icon}`)} 
                    alt={title} 
                    className="h-16 w-16 object-contain"
                />
            </div>
            <h3 className="font-semibold text-lg mt-[20px] mb-[26px]">{title}</h3>
            <p className="text-sm text-gray-600 text-center">
                {description}
            </p>
        </div>
    );
};

export default ServiceCard;