// src/components/Header.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from '../assets/images/full-mvaa-logo-3.png';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { logout } from '../services/api';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const location = useLocation();
  const dropdownRef = useRef(null);

  // Get user data from cookies
  useEffect(() => {
    const userCookie = Cookies.get('user');
    if (userCookie) {
      try {
        const parsedUser = JSON.parse(userCookie);
        setUserData(parsedUser);
      } catch (error) {
        console.error('Error parsing user cookie:', error);
      }
    }

    const handleStorageChange = () => {
      const userCookie = Cookies.get('user');
      if (userCookie) {
        try {
          const parsedUser = JSON.parse(userCookie);
          setUserData(parsedUser);
        } catch (error) {
          console.error('Error parsing user cookie:', error);
        }
      }
    };

    // Listen for cookie changes
    const interval = setInterval(handleStorageChange, 500);
    
    return () => clearInterval(interval);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsUserDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Generate user initials for avatar
  const getUserInitials = (user) => {
    if (!user) return 'U';
    
    const firstName = user.firstName || user.firstName || '';
    const lastName = user.lastName || user.lastName || '';
    
    if (firstName && lastName) {
      return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
    } else if (firstName) {
      return firstName.charAt(0).toUpperCase();
    } else if (user.email) {
      return user.email.charAt(0).toUpperCase();
    }
    
    return 'U';
  };

  // Get user display name
  const getUserDisplayName = (user) => {
    if (!user) return 'User';
    
    const firstName = user.firstName || user.firstName || '';
    const lastName = user.lastName || user.lastName || '';
    
    if (firstName && lastName) {
      return `${firstName} ${lastName}`;
    } else if (firstName) {
      return firstName;
    } else if (user.email) {
      return user.email;
    }
    
    return 'User';
  };

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Close mobile menu
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Toggle user dropdown
  const toggleUserDropdown = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen);
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
      await logout();
      
      toast.success('Logged out successfully');
      
      window.location.href = '/login';
      
    } catch (error) {
      console.error('Logout error in handleLogout:', error);
      toast.error('Logout failed, but session cleared');
      
      // Even if logout fails, redirect to login
      setTimeout(() => {
        window.location.href = '/login';
      }, 1000);
    }
  };

  // Check if the user is logged in by checking the session cookie
  const isLoggedIn = !!Cookies.get('portal_session_id');

  return (
    <>
      <header className="rel full-width">
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
                  <li className="relative" ref={dropdownRef}>
                    <div className="flex items-center space-x-3">
                      {/* User Avatar and Name */}
                      <button
                        onClick={toggleUserDropdown}
                        className="nav-dropdown-btn flex items-center space-x-2 hover:bg-gray-100 rounded-lg px-3 py-2 transition-colors duration-200"
                      >
                        {/* Avatar */}
                        <div className="nav-avatar w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                          {getUserInitials(userData)}
                        </div>
                        {/* User Name */}
                        <span className="nav-user-name text-gray-700 hidden md:block">
                          {getUserDisplayName(userData)}
                        </span>
                        {/* Dropdown Arrow */}
                        <svg
                          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                            isUserDropdownOpen ? 'rotate-180' : ''
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>

                      {/* Dropdown Menu */}
                      {isUserDropdownOpen && (
                        <div className="nav-droppdown-style absolute right-0 top-full mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                          {/* <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
                            <p className="font-medium">{getUserDisplayName(userData)}</p>
                            <p className="text-gray-500 text-xs">{userData?.email}</p>
                          </div> */}
                          <Link
                            to="/account-settings"
                            className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                            onClick={() => setIsUserDropdownOpen(false)}
                          >
                            <div className="flex items-center">
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              Account Settings
                            </div>
                          </Link>
                          <button
                            onClick={handleLogout}
                            className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 transition-colors duration-200"
                          >
                            <div className="flex items-center">
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                              </svg>
                              Logout
                            </div>
                          </button>
                        </div>
                      )}
                    </div>
                  </li>
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

              {/* Mobile menu button */}
              <div className="flex flex-row items-center space-x-2 visible-xs-sm">
                {isLoggedIn ? (
                  /* Mobile User Avatar */
                  <>
                    <button
                      onClick={toggleMobileMenu}
                      className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-semibold text-sm"
                    >
                      {getUserInitials(userData)}
                    </button>
               
                    <button className="white-txt focus:outline-none pointer" onClick={toggleMobileMenu}>
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" stroke="#108a00"></path>
                      </svg>
                    </button>
                  </>
                ) : 
                  /* Mobile Hamburger Menu */
                  <button className="white-txt focus:outline-none pointer" onClick={toggleMobileMenu}>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" stroke="#108a00"></path>
                    </svg>
                  </button>
                }
              </div>
              
            </nav>
          </div>

          {/* Mobile menu */}
          <div className={`mobile-menu ${isMobileMenuOpen ? 'active py-4' : 'py-0'} pry-bg white-txt px-4`}>
            {/* Mobile User Info */}
            {isLoggedIn && userData && (
              <div className="border-b border-green-700 pb-3 mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-800 rounded-full flex items-center justify-center text-white font-semibold">
                    {getUserInitials(userData)}
                  </div>
                  <div>
                    <p className="font-medium">{getUserDisplayName(userData)}</p>
                    <p className="text-green-200 text-sm">{userData?.email}</p>
                  </div>
                </div>
              </div>
            )}

            <ul className="space-y-4">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`block white-txt hover-scale pointer ${location.pathname === item.path ? 'active' : ''}`}
                    onClick={closeMobileMenu}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            <ul className="flex-div nav-btn-wrapper mt-5 mb-3">
              {isLoggedIn ? (
                <>
                  <li>
                    <Link to="/account-settings" className="pry-nav-btn" onClick={closeMobileMenu}>
                      Account Settings
                    </Link>
                  </li>
                  <li>
                    <button onClick={handleLogout} className="nav-btn text-white">Logout</button>
                  </li>
                </>
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