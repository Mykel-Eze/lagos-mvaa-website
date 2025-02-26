// src/components/Header.js
import React, { useEffect } from 'react';

const Header = () => {
  useEffect(() => {
    // Initialize MaterializeCSS sidenav
    const elems = document.querySelectorAll('.sidenav');
    if (elems.length > 0) {
      window.M.Sidenav.init(elems, {});
    }
  }, []); // Empty dependency array means this runs once on mount

  return (
    <nav className="nav-wrapper green darken-3" style={{ padding: '0 20px' }}>
      <div className="container">
        <div className="row">
          <div className="col s12 m6 l6">
            <a href="/" className="brand-logo white-text">
              <img src="/logo.png" alt="MVAA Logo" className="responsive-img" style={{ height: '40px', marginRight: '10px' }} />
              Lagos State MVAA (Motor Vehicle Administration Agency)
            </a>
          </div>
          <div className="col s12 m6 l6">
            <ul className="right hide-on-med-and-down">
              <li><a href="/" className="white-text">Home</a></li>
              <li><a href="/services" className="white-text">Services</a></li>
              <li><a href="/contact" className="white-text">Contact</a></li>
              <li><a href="/login" className="btn white black-text">Login</a></li>
              <li><a href="/get-started" className="btn green white-text">Get Started</a></li>
            </ul>
            <ul className="sidenav" id="mobile-nav">
              <li><a href="/" className="white-text">Home</a></li>
              <li><a href="/services" className="white-text">Services</a></li>
              <li><a href="/contact" className="white-text">Contact</a></li>
              <li><a href="/login" className="white-text">Login</a></li>
              <li><a href="/get-started" className="white-text">Get Started</a></li>
            </ul>
            <a href="/#" data-target="mobile-nav" className="sidenav-trigger right hide-on-large-only">
              <i className="material-icons white-text">menu</i>
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;