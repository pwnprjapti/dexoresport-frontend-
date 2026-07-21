import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaDiscord, 
  FaInstagram, 
  FaYoutube, 
  FaTwitter, 
  FaTelegramPlane 
} from 'react-icons/fa';
import './Footer.css';

export default function Footer() {
  const handleSubscribe = (e) => {
    e.preventDefault();
    alert('Thank you for subscribing to Dexor Esport newsletter!');
  };

  return (
    <footer className="footer-container">
      <div className="footer-glow-top"></div>
      
      <div className="footer-content">
        {/* Brand & Slogan Section */}
        <div className="footer-section brand-section">
          <img 
            className="footer-logo" 
            src="https://res.cloudinary.com/dnfhwfbmq/image/upload/v1777614927/1000076765-removebg-preview_momgvo.png" 
            alt="Dexor Esport" 
          />
          <h3 className="footer-slogan">COMPETE. WIN. <span>LEGACY.</span></h3>
          <p className="footer-desc">
            India's ultimate tournament platform for BGMI champions. Organize, join, and conquer esports arenas for real cash payouts.
          </p>
          <div className="footer-socials">
            <a href="https://discord.gg" target="_blank" rel="noopener noreferrer" className="social-icon discord"><FaDiscord /></a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon instagram"><FaInstagram /></a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="social-icon youtube"><FaYoutube /></a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-icon twitter"><FaTwitter /></a>
            <a href="https://telegram.org" target="_blank" rel="noopener noreferrer" className="social-icon telegram"><FaTelegramPlane /></a>
          </div>
        </div>

        {/* Quick Links Section */}
        <div className="footer-section links-section">
          <h4 className="section-title">Navigation</h4>
          <ul className="footer-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/tournaments">Tournaments</Link></li>
            <li><Link to="/leaderboard">Leaderboard</Link></li>
            <li><Link to="/blog">Blog</Link></li>
          </ul>
        </div>

        {/* Support Section */}
        <div className="footer-section links-section">
          <h4 className="section-title">Support</h4>
          <ul className="footer-links">
            <li><Link to="/contact">Contact Us</Link></li>
            <li><Link to="/terms">Terms & Conditions</Link></li>
            <li><Link to="/privacy">Privacy Policy</Link></li>
            <li><Link to="/rules">Tournament Rules</Link></li>
          </ul>
        </div>

        {/* Newsletter Section */}
        <div className="footer-section newsletter-section">
          <h4 className="section-title">Stay Updated</h4>
          <p className="newsletter-text">Subscribe to get notifications about upcoming massive prize-pool tournaments!</p>
          <form className="newsletter-form" onSubmit={handleSubscribe}>
            <input 
              type="email" 
              placeholder="Enter your email" 
              required 
              className="newsletter-input"
            />
            <button type="submit" className="newsletter-btn">Subscribe</button>
          </form>
        </div>
      </div>

      {/* Footer Bottom Bar */}
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Dexor Esport. All Rights Reserved.</p>
        <p className="dev-credit">Designed for BGMI Warriors.</p>
      </div>
    </footer>
  );
}
