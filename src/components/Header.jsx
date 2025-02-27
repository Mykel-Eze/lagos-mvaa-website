// src/components/Header.js
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from '../assets/images/full-mvaa-logo.png';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation(); // Get the current location

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Define the navigation items and their paths
  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/services', label: 'Services' },
    { path: '/contact', label: 'Contact' },
  ];

  return (
    <header className="rel full-width">
      <div id="header-color-bars">
        <div style={{backgroundColor: '#E83B50'}}></div>
        <div style={{backgroundColor: '#4D8EFF'}}></div>
        <div style={{backgroundColor: '#FFBB32'}}></div>
        <div style={{backgroundColor: '#32C76D'}}></div>
      </div>

      <div id="sub-header">
        <div className="container">
            <div className="sub-header-item flex-div">
                <img src={require("../assets/images/call.svg").default} alt="call-icon" />
                <span className="bold-txt" style={{fontWeight: '700'}}>07056557484</span>
            </div>
            <div className="sub-header-item flex-div">
                <img src={require("../assets/images/ig-x.svg").default} alt="ig-x-icon" />
                <span>@ lasgmvaa</span>
            </div>
            <div className="sub-header-item flex-div">
                <img src={require("../assets/images/mail.svg").default} alt="mail-icon" />
                <span>motorvehicle@lagosstate.gov.ng</span>
            </div>
            <div className="sub-header-item flex-div" style={{fontWeight: '700'}}>
                <b className="uppercase">TOll-free emergency:</b>
                <span className="bold-txt">767</span> 
                <span> | </span>
                <span className="bold-txt">112</span> 
            </div>
        </div>
      </div>

      <div id="main-header">
        <div className="container">
            <nav className="nav flex-div justify-content-btw">
                <Link to="/" className="nav-logo">
                    <img src={Logo} alt="Lagos MVAA Logo" />
                </Link>
                <ul className="flex-div hidden-xs mid-link">
                    {navItems.map((item) => (
                        <li key={item.path}>
                            <Link
                                to={item.path}
                                className={`${location.pathname === item.path ? 'active' : ''}`}
                            >
                                {item.label}
                                </Link>
                        </li>
                    ))}
                </ul>
                <ul className="flex-div hidden-xs nav-btn-wrapper">
                    <li>
                        <Link to="/login" className="nav-btn">Login</Link>
                    </li>
                    <li>
                        <Link to="/get-started" className="pry-nav-btn flex div">
                            <span>Get Started</span>
                            <img src={require("../assets/images/arrow-1.svg").default} alt="arrow-icon" />
                        </Link>
                    </li>
                </ul>
                {/* Mobile menu button (hamburger) */}
                <button className="md:hidden white-txt focus:outline-none pointer" onClick={toggleMobileMenu}>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
                    </svg>
                </button>
            </nav>
        </div>
        {/* Mobile menu (hidden by default, shown on click) */}
        <div className={`mobile-menu ${isMobileMenuOpen ? 'active' : ''} visible-xs pry-bg white-txt p-4`}>
            <ul className="space-y-4">
                {navItems.map((item) => (
                    <li key={item.path}>
                    <Link
                        to={item.path}
                        className={`block white-txt hover-scale pointer ${location.pathname === item.path ? 'active' : ''}`}
                        onClick={toggleMobileMenu}
                    >
                        {item.label}
                    </Link>
                    </li>
                ))}
                <li>
                    <Link to="/login" className="block white-bg black-txt px-4 py-2 rounded text-center pointer" onClick={toggleMobileMenu}>Login</Link>
                </li>
                <li>
                    <Link to="/get-started" className="block sec-bg white-txt px-4 py-2 rounded text-center pointer" onClick={toggleMobileMenu}>Get Started</Link>
                </li>
            </ul>
        </div>
      </div>
    </header>
  );
};

export default Header;