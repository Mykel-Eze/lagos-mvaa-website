// src/components/Header.jsx
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from '../assets/images/full-mvaa-logo.png';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { logout } from '../services/api';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // State for mobile menu
  const location = useLocation(); // Get the current location

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Close mobile menu
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Define the navigation items and their paths
  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/services', label: 'Services' },
    { path: '/contact', label: 'Contact' },
  ];

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout(); // This will also clear cookies
      toast.success('Logged out successfully');
      window.location.href = '/login'; // Redirect to login page
    } catch (error) {
      toast.error('Logout failed, but session cleared');
      window.location.href = '/login';
    }
  };

  // Check if the user is logged in by checking the session cookie
  const isLoggedIn = !!Cookies.get('portal_session_id');

  return (
    <>
      <header className="rel full-width">
        <div id="header-color-bars">
          <div style={{ backgroundColor: '#E83B50' }}></div>
          <div style={{ backgroundColor: '#4D8EFF' }}></div>
          <div style={{ backgroundColor: '#FFBB32' }}></div>
          <div style={{ backgroundColor: '#32C76D' }}></div>
        </div>

        <div id="sub-header">
          <div className="container">
            <div className="sub-header-item flex-div">
              <img src={require("../assets/images/call.svg").default} alt="call-icon" />
              <span className="bold-txt" style={{ fontWeight: '700' }}>07056557484</span>
            </div>
            <div className="sub-header-item flex-div">
              <img src={require("../assets/images/ig-x.svg").default} alt="ig-x-icon" />
              <span>@ lasgmvaa</span>
            </div>
            <div className="sub-header-item flex-div">
              <img src={require("../assets/images/mail.svg").default} alt="mail-icon" />
              <span>motorvehicle@lagosstate.gov.ng</span>
            </div>
            <div className="sub-header-item flex-div" style={{ fontWeight: '700' }}>
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
              <ul className="flex-div hidden-xs-sm mid-link">
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
              <ul className="flex-div hidden-xs-sm nav-btn-wrapper">
                {isLoggedIn ? (
                  <>
                    <li>
                      <button onClick={handleLogout} className="nav-btn">Logout</button>
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <Link to="/login" className="nav-btn">Login</Link>
                    </li>
                    <li>
                      <Link to="/register" className="pry-nav-btn flex div">
                        <span>Get Started</span>
                        <img src={require("../assets/images/arrow-1.svg").default} alt="arrow-icon" />
                      </Link>
                    </li>
                  </>
                )}
              </ul>
              {/* Mobile menu button (hamburger) */}
              <button className="visible-xs-sm white-txt focus:outline-none pointer" onClick={toggleMobileMenu}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" stroke="#108a00"></path>
                </svg>
              </button>
            </nav>
          </div>
          {/* Mobile menu (hidden by default, shown on click) */}
          <div className={`mobile-menu ${isMobileMenuOpen ? 'active py-4' : 'py-0'} pry-bg white-txt px-4`}>
            <ul className="space-y-4">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`block white-txt hover-scale pointer ${location.pathname === item.path ? 'active' : ''}`}
                    onClick={closeMobileMenu} // Close menu when a link is clicked
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <ul className="flex-div nav-btn-wrapper mt-5 mb-3">
              {isLoggedIn ? (
                <li>
                  <button onClick={handleLogout} className="nav-btn">Logout</button>
                </li>
              ) : (
                <>
                  <li>
                    <Link to="/login" className="nav-btn" onClick={closeMobileMenu}>Login</Link>
                  </li>
                  <li>
                    <Link to="/register" className="pry-nav-btn flex div" onClick={closeMobileMenu}>
                      <span>Get Started</span>
                      <img src={require("../assets/images/arrow-1.svg").default} alt="arrow-icon" />
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </header>
      {/* Overlay for mobile menu */}
      <div className={`nav-overlay ${isMobileMenuOpen ? 'active' : ''}`} onClick={closeMobileMenu}></div>
    </>
  );
};

export default Header;