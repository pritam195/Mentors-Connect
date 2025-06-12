import React from 'react';
import './Footer.css';
import { FaLinkedin, FaTwitter, FaEnvelope, FaPhone } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">

        <div className="footer-brand">
          <h2>MargDarshak</h2>
          <p>Empowering careers through mentorship and guidance.</p>
        </div>

        <div className="footer-links">
          <h4>Explore</h4>
          <ul>
            <li><a href="#">Home</a></li>
            <li><a href="#">Mentors</a></li>
            <li><a href="#">Chats</a></li>
            <li><a href="#">Book a Session</a></li>
          </ul>
        </div>

        <div className="footer-contact">
          <h4>Contact Us</h4>
          <p><FaEnvelope className="icon" /> connect@margdarshak.in</p>
          <p><FaPhone className="icon" /> +91 98765 43210</p>
        </div>

        <div className="footer-social">
          <h4>Follow Us</h4>
          <div className="social-icons">
            <a href="#"><FaLinkedin /></a>
            <a href="#"><FaTwitter /></a>
          </div>
        </div>

      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} MargDarshak • Guiding Futures, Creating Leaders.</p>
      </div>
    </footer>
  );
};

export default Footer;
