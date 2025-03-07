// src/components/Hero.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
  const isLoggedIn = localStorage.getItem('access_token'); // Check if the user is logged in

  return (
    <section id="hero-section">
      <div className="container rel">
        <div className="hero-txts title-txts">
          <h1>
            Lagos State Motor Vehicle Administration Agency Services
          </h1>
          <p>
            Making it easier to have quick access to Lagos State VEHICLE services and information
          </p>
        </div>

        {!isLoggedIn && (
          <ul className="flex-div hidden-xs nav-btn-wrapper">
            <li>
              <Link to="/register" className="pry-nav-btn flex div">
                <span>Get Started</span>
                <img src={require("../assets/images/arrow-1.svg").default} alt="arrow-icon" />
              </Link>
            </li>
            <li>
              <Link to="/login" className="nav-btn">Login</Link>
            </li>
          </ul>
        )}
      </div>
    </section>
  );
};

export default Hero;