import React from 'react';
import ServicesLayout from '../components/ServicesLayout';

const OtherAgencyDepartments = () => {
  return (
    <ServicesLayout
      title="Agency departments"
      description=""
    >
      <div className="agencies-container">
        <h1 className="agencies-link-header">Explore the Lagos State Motor Vehicle Administration Agency</h1>

        <div className="agency-link-block">
            <a href="/#" target="_blank" rel="noopener noreferrer">
                <div className="agency-block-title flex-div">
                    <span>Department of Number plate services</span>
                    <img src={require("../assets/images/black-arr.svg").default} alt="black-arr" />
                </div>
                <div className="agency-block-description">
                    View all the officers elected by lagosians this tenure.
                </div>
            </a>
        </div>
        <div className="agency-link-block">
            <a href="/#" target="_blank" rel="noopener noreferrer">
                <div className="agency-block-title flex-div">
                    <span>Department of Auto-dealers and Spare Parts</span>
                    <img src={require("../assets/images/black-arr.svg").default} alt="black-arr" />
                </div>
                <div className="agency-block-description">
                    A-Z index of Lagos Government Ministries, Departments & Agencies
                </div>
            </a>
        </div>
        <div className="agency-link-block">
            <a href="/#" target="_blank" rel="noopener noreferrer">
                <div className="agency-block-title flex-div">
                    <span>Road Worthiness Officers</span>
                    <img src={require("../assets/images/black-arr.svg").default} alt="black-arr" />
                </div>
                <div className="agency-block-description">
                    View all the Officers elected by lagosians this tenure.
                </div>
            </a>
        </div>
        <div className="agency-link-block">
            <a href="/#" target="_blank" rel="noopener noreferrer">
                <div className="agency-block-title flex-div">
                    <span>Supervisory Officers</span>
                    <img src={require("../assets/images/black-arr.svg").default} alt="black-arr" />
                </div>
                <div className="agency-block-description">
                    View all the Judiciary Officers appointed for this tenure.
                </div>
            </a>
        </div>
      </div>
    </ServicesLayout>
  );
};

export default OtherAgencyDepartments;