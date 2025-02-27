/* eslint-disable no-unused-vars */
import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../assets/images/full-mvaa-logo-2.png';

const Footer = () => {
  return (
    <footer className="py-[30px]">
        <div className="container">
            <div className="footer-top-section flex-div justify-between py-[35px]">
                <Link to="/" className="footer-logo">
                    <img src={Logo} alt="Lagos MVAA Logo" />
                </Link>

                <div className="social-links">
                    <a href="http://instagram.com" target="_blank" rel="noopener noreferrer">
                        <img src={require("../assets/images/ig-1.svg").default} alt="instagram" className="social-icon" />
                    </a>
                    <a href="http://x.com" target="_blank" rel="noopener noreferrer">
                        <img src={require("../assets/images/x-1.svg").default} alt="x" className="social-icon" />
                    </a>
                    <a href="http://facebook.com" target="_blank" rel="noopener noreferrer">
                        <img src={require("../assets/images/fb-1.svg").default} alt="facebook" className="social-icon" />
                    </a>
                    <a href="http://linkedin.com" target="_blank" rel="noopener noreferrer">
                        <img src={require("../assets/images/ln-1.svg").default} alt="linkedin" className="social-icon" />
                    </a>
                </div>
            </div>

            <div className="footer-links-wrapper py-[50px]">
                <div className="footer-link-block">
                    <div className="footer-link-header">Government</div>
                    <ul className="footer-links">
                        <li>
                            <a href="/#">
                                <img src={require("../assets/images/green-arrow.svg").default} alt="green-arrow" />
                                <span>Lorem Ipspum</span>
                            </a>
                        </li>
                        <li>
                            <a href="/#">
                                <img src={require("../assets/images/green-arrow.svg").default} alt="green-arrow" />
                                <span>Lorem Ipspum</span>
                            </a>
                        </li>
                        <li>
                            <a href="/#">
                                <img src={require("../assets/images/green-arrow.svg").default} alt="green-arrow" />
                                <span>Lorem Ipspum</span>
                            </a>
                        </li>
                        <li>
                            <a href="/#">
                                <img src={require("../assets/images/green-arrow.svg").default} alt="green-arrow" />
                                <span>Lorem Ipspum</span>
                            </a>
                        </li>
                    </ul>
                </div>
                <div className="footer-link-block">
                    <div className="footer-link-header">Quick Services</div>
                    <ul className="footer-links">
                        <li>
                            <a href="/#">
                                <img src={require("../assets/images/green-arrow.svg").default} alt="green-arrow" />
                                <span>Lorem Ipspum</span>
                            </a>
                        </li>
                        <li>
                            <a href="/#">
                                <img src={require("../assets/images/green-arrow.svg").default} alt="green-arrow" />
                                <span>Lorem Ipspum</span>
                            </a>
                        </li>
                        <li>
                            <a href="/#">
                                <img src={require("../assets/images/green-arrow.svg").default} alt="green-arrow" />
                                <span>Lorem Ipspum</span>
                            </a>
                        </li>
                        <li>
                            <a href="/#">
                                <img src={require("../assets/images/green-arrow.svg").default} alt="green-arrow" />
                                <span>Lorem Ipspum</span>
                            </a>
                        </li>
                    </ul>
                </div>
                <div className="footer-link-block">
                    <div className="footer-link-header">Safety & Emergencies</div>
                    <ul className="footer-links">
                        <li>
                            <a href="/#">
                                <img src={require("../assets/images/green-arrow.svg").default} alt="green-arrow" />
                                <span>Lorem Ipspum</span>
                            </a>
                        </li>
                        <li>
                            <a href="/#">
                                <img src={require("../assets/images/green-arrow.svg").default} alt="green-arrow" />
                                <span>Lorem Ipspum</span>
                            </a>
                        </li>
                        <li>
                            <a href="/#">
                                <img src={require("../assets/images/green-arrow.svg").default} alt="green-arrow" />
                                <span>Lorem Ipspum</span>
                            </a>
                        </li>
                        <li>
                            <a href="/#">
                                <img src={require("../assets/images/green-arrow.svg").default} alt="green-arrow" />
                                <span>Lorem Ipspum</span>
                            </a>
                        </li>
                    </ul>
                </div>
                <div className="footer-link-block">
                    <div className="footer-link-header">Help & support</div>
                    <ul className="footer-links">
                        <li>
                            <a href="/#">
                                <img src={require("../assets/images/green-arrow.svg").default} alt="green-arrow" />
                                <span>Lorem Ipspum</span>
                            </a>
                        </li>
                        <li>
                            <a href="/#">
                                <img src={require("../assets/images/green-arrow.svg").default} alt="green-arrow" />
                                <span>Lorem Ipspum</span>
                            </a>
                        </li>
                        <li>
                            <a href="/#">
                                <img src={require("../assets/images/green-arrow.svg").default} alt="green-arrow" />
                                <span>Lorem Ipspum</span>
                            </a>
                        </li>
                        <li>
                            <a href="/#">
                                <img src={require("../assets/images/green-arrow.svg").default} alt="green-arrow" />
                                <span>Lorem Ipspum</span>
                            </a>
                        </li>
                    </ul>
                </div>
                <div className="footer-link-block">
                    <div className="footer-link-header">Feedback</div>
                    <ul className="footer-links">
                        <li>
                            <a href="/#">
                                <img src={require("../assets/images/green-arrow.svg").default} alt="green-arrow" />
                                <span>Lorem Ipspum</span>
                            </a>
                        </li>
                        <li>
                            <a href="/#">
                                <img src={require("../assets/images/green-arrow.svg").default} alt="green-arrow" />
                                <span>Lorem Ipspum</span>
                            </a>
                        </li>
                        <li>
                            <a href="/#">
                                <img src={require("../assets/images/green-arrow.svg").default} alt="green-arrow" />
                                <span>Lorem Ipspum</span>
                            </a>
                        </li>
                        <li>
                            <a href="/#">
                                <img src={require("../assets/images/green-arrow.svg").default} alt="green-arrow" />
                                <span>Lorem Ipspum</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="footer-bottom-section flex-div justify-between">
                <div className="footer-copyright">
                    © Copyright 2025, All Rights Reserved <span className="p-2">|</span> Lagos State MVAA
                </div>
                <div className="footer-copyright-2">
                    <span className="sec-color">Powered by</span> - Lagos State MOTOR VEHICLE ADMINISTRATION AGENCY
                </div>
            </div>
        </div>
    </footer>
  );
};

export default Footer;