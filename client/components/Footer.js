import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';
import mcLogo from './images/logos/mastercard.svg';
import visaLogo from './images/logos/visa.svg';
import rupayLogo from './images/logos/rupay.svg';
import razorpayLogo from './images/logos/razorpay.svg';
import paypalLogo from './images/logos/paypal.svg';
import shiprocketLogo from './images/logos/Shiprocket.svg';
import bluedartLogo from './images/logos/bluedart.svg';

function Footer() {
return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-grid">
          {/* Categories */}
          <div className="footer-section">
            <h3>Categories</h3>
            <ul>
              <li><Link to="/caps">Caps</Link></li>
              <li><Link to="/tshirts">T-shirts</Link></li>
              <li><Link to="/kids">Kids</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div className="footer-section">
            <h3>Support</h3>
            <ul>
              <li><a href="/tracker">Order Tracker</a></li>
              <li><a href="/shipping-info">Shipping</a></li>
              <li><a href="/returns-policy">Returns</a></li>
              <li><a href="/contact-us">Contact Us</a></li>
            </ul>
          </div>

          {/* Payment Partners */}
          <div className="footer-section">
            <h3>Payment partners</h3>
            <div className="partner-logos">
              <div className="logo-row">
                <img src={mcLogo} alt="Mastercard" className="payment-logo" />
                <img src={visaLogo} alt="Visa" className="payment-logo" />
                <img src={rupayLogo} alt="RuPay" className="payment-logo" />
                <img src={razorpayLogo} alt="Razorpay" className="payment-logo" />
                <img src={paypalLogo} alt="PayPal" className="payment-logo" />
              </div>
            </div>
          </div>

          {/* Shipping Partners */}
          <div className="footer-section">
            <h3>Shipping partners</h3>
            <div className="partner-logos">
              <div className="logo-row">
                <img src={shiprocketLogo} alt="ShipRocket" className="shipping-logo" />
                <img src={bluedartLogo} alt="BlueDart" className="shipping-logo" />
              </div>
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="about-section">
          <h3>About Merch for Fans</h3>
          <p>
            Merch for Fans is your ultimate online destination for sports enthusiasts worldwide.
            Here, you'll discover an expansive collection of officially licensed merchandise
            for a vast array of sports, catering to fans of all ages and preferences.
            Beyond team apparel and fan gear, Merch for Fans offers unique customization options,
            allowing you to personalize t-shirts, hoodies, and more by uploading your own
            images for printing. We're committed to bringing every fan closer to the action with
            high-quality, authentic products that let you showcase your passion for your favorite teams and athletes.
          </p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <div className="footer-links">
            <a href="/terms-of-service">TERMS & CONDITIONS</a>
            <a href="/privacy-policy">PRIVACY POLICY</a>
            <a href="/cookie-policy">COOKIES</a>
          </div>
          <div className="copyright">
            <a href="/">© Merch for Fans 2025</a> 
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
