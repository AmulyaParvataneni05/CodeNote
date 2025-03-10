import React from "react";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <p className="info-footer">&copy; 2025 CODENOTE. All rights reserved.</p>
    </footer>
  );
}

export default Footer;

{/*import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaGithub, FaLinkedinIn } from 'react-icons/fa';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <h3>CodeNote</h3>
        <p>Empowering developers & students to save and share their code.</p>

        <ul className="social-links">
          <li><Link to="#"><FaFacebookF /></Link></li>
          <li><Link to="#"><FaTwitter /></Link></li>
          <li><Link to="#"><FaGithub /></Link></li>
          <li><Link to="#"><FaLinkedinIn /></Link></li>
        </ul>

        <p className="copyright">© {new Date().getFullYear()} CodeNote. All Rights Reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;*/}
