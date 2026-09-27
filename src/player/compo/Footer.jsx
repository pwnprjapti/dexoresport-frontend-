import { Link } from 'react-router-dom';
import { 
  FaDiscord, 
  FaInstagram, 
  FaYoutube, 
  FaTwitter, 
  FaTelegramPlane,
  FaWhatsapp
} from 'react-icons/fa';
import './Footer.css';
import { useTenant } from '../../context/TenantContext.jsx';

export default function Footer() {
  const { isTenant, tenant } = useTenant();

  const handleSubscribe = (e) => {
    e.preventDefault();
    alert(`Thank you for subscribing to ${isTenant && tenant ? tenant.organizationName : 'Dexor Esport'} updates!`);
  };

  const orgName = isTenant && tenant?.organizationName ? tenant.organizationName : 'Dexor Esport';
  const orgDesc = isTenant && tenant?.about ? tenant.about : "India's ultimate esports tournament arena. Organize, join, and conquer competitive matches for real cash payouts.";
  const orgLogo = isTenant && tenant?.branding?.logo ? tenant.branding.logo : "https://res.cloudinary.com/dnfhwfbmq/image/upload/v1777614927/1000076765-removebg-preview_momgvo.png";

  const youtubeUrl = isTenant && (tenant?.socialLinks?.youtube || tenant?.youtube_channel);
  const discordUrl = isTenant && (tenant?.socialLinks?.discord || tenant?.discord);
  const instagramUrl = isTenant && (tenant?.socialLinks?.instagram || tenant?.instagram);
  const whatsappUrl = isTenant && (tenant?.socialLinks?.whatsapp || tenant?.whatsapp_group);

  return (
    <footer className="footer-container">
      <div className="footer-glow-top"></div>
      
      <div className="footer-content">
        {/* Brand & Slogan Section */}
        <div className="footer-section brand-section">
          {orgLogo ? (
            <img 
              className="footer-logo" 
              src={orgLogo} 
              alt={orgName} 
              style={{ maxHeight: '50px', objectFit: 'contain' }}
            />
          ) : (
            <h2 style={{ color: '#00f0ff', margin: '0 0 10px 0', fontSize: '24px' }}>{orgName}</h2>
          )}
          <h3 className="footer-slogan">{orgName.toUpperCase()} <span>OFFICIAL ARENA</span></h3>
          <p className="footer-desc">
            {orgDesc}
          </p>
          <div className="footer-socials">
            {discordUrl ? (
              <a href={discordUrl} target="_blank" rel="noopener noreferrer" className="social-icon discord"><FaDiscord /></a>
            ) : (
              <a href="https://discord.gg" target="_blank" rel="noopener noreferrer" className="social-icon discord"><FaDiscord /></a>
            )}
            {instagramUrl ? (
              <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="social-icon instagram"><FaInstagram /></a>
            ) : (
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon instagram"><FaInstagram /></a>
            )}
            {youtubeUrl ? (
              <a href={youtubeUrl} target="_blank" rel="noopener noreferrer" className="social-icon youtube"><FaYoutube /></a>
            ) : (
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="social-icon youtube"><FaYoutube /></a>
            )}
            {whatsappUrl && (
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="social-icon whatsapp" style={{ color: '#25D366' }}><FaWhatsapp /></a>
            )}
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
          <h4 className="section-title">Support & Rules</h4>
          <ul className="footer-links">
            <li><Link to="/contact">Support Center</Link></li>
            <li><Link to="/terms">Terms & Fair Play</Link></li>
            <li><Link to="/privacy">Privacy Policy</Link></li>
            <li><Link to="/rules">Anti-Cheat Rules</Link></li>
          </ul>
        </div>

        {/* Newsletter Section */}
        <div className="footer-section newsletter-section">
          <h4 className="section-title">Match Alerts</h4>
          <p className="newsletter-text">Subscribe to get notifications about upcoming massive prize-pool tournaments from {orgName}!</p>
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
        <p>&copy; {new Date().getFullYear()} {orgName}. All Rights Reserved.</p>
        <p className="dev-credit">
          {isTenant ? "Powered by Dexor Multi-Tenant Esports Infrastructure" : "Designed for BGMI Warriors."}
        </p>
      </div>
    </footer>
  );
}
