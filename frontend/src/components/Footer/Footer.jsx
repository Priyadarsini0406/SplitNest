import { Container, Row, Col } from 'react-bootstrap';
import { 
  FiHome, 
  FiUsers, 
  FiFacebook, 
  FiTwitter, 
  FiInstagram, 
  FiLinkedin,
  FiMail,
  FiPhone,
  FiMapPin,
  FiSend
} from 'react-icons/fi';
import './Footer.css';
import { Link, useNavigate, useLocation } from 'react-router-dom';

function SplitNestFooter() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    console.log('Newsletter subscription submitted');
  };

  const handleSmoothScroll = (e, targetId) => {
    e.preventDefault();
    if (location.pathname !== '/') {
      navigate('/', { state: { scrollTo: targetId } });
    } else {
      const element = document.getElementById(targetId);
      if (element) {
        const offset = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }
  };

  return (
    <footer className="splitnest-footer">
      <Container>
        {/* Upper Footer: Branding, Links, Features, Subscription */}
        <Row className="gy-5 pb-5 border-bottom border-secondary-subtle">
          
          {/* Column 1: Branding & Socials */}
          <Col lg={4} md={12} className="footer-brand-col">
            <div className="footer-logo">
              <div className="logo-icon-box">
                <FiHome className="icon-home" />
                <div className="logo-split-line"></div>
                <FiUsers className="icon-users" />
              </div>
              <span className="logo-text">
                Split<span className="logo-accent">Nest</span>
              </span>
            </div>
            <p className="footer-tagline">
              Discover verified properties, connect with trusted roommates, split utilities, and manage co-living effortlessly.
            </p>
            <div className="footer-social-links">
              <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook"><FiFacebook /></a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter"><FiTwitter /></a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram"><FiInstagram /></a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn"><FiLinkedin /></a>
            </div>
          </Col>

          {/* Column 2: Quick Links */}
          <Col lg={2} md={4} sm={6} xs={6}>
            <h4 className="footer-heading">Quick Links</h4>
            <ul className="footer-links-list">
              <li><a href="#home" onClick={(e) => handleSmoothScroll(e, 'home')}>Home</a></li>
              <li><a href="#features" onClick={(e) => handleSmoothScroll(e, 'features')}>Features</a></li>
              <li><a href="#properties" onClick={(e) => handleSmoothScroll(e, 'properties')}>Properties</a></li>
              <li><a href="#about" onClick={(e) => handleSmoothScroll(e, 'about')}>About</a></li>
              <li><a href="#contact" onClick={(e) => handleSmoothScroll(e, 'contact')}>Contact</a></li>
              <li><Link to="/privacy">Privacy Policy</Link></li>
              <li><Link to="/terms">Terms & Conditions</Link></li>
              <li><a href="#faq" onClick={(e) => handleSmoothScroll(e, 'faq')}>FAQ</a></li>
            </ul>
          </Col>

          {/* Column 3: Features */}
          <Col lg={2} md={4} sm={6} xs={6}>
            <h4 className="footer-heading">Features</h4>
            <ul className="footer-links-list">
              <li><a href="#features">Cost Splitting</a></li>
              <li><a href="#features">Roommate Finder</a></li>
              <li><a href="#features">Expense Tracker</a></li>
              <li><a href="#features">Bill Manager</a></li>
              <li><a href="#features">Secure Chat</a></li>
            </ul>
          </Col>

          {/* Column 4: Contact & Subscription */}
          <Col lg={4} md={4} sm={12} className="footer-subscribe-col">
            <h4 className="footer-heading">Contact Information</h4>
            <ul className="footer-contact-list">
              <li>
                <FiMail className="contact-icon" />
                <a href="mailto:support@splitnest.com">support@splitnest.com</a>
              </li>
              <li>
                <FiPhone className="contact-icon" />
                <span>+91 98765 43210</span>
              </li>
              <li>
                <FiMapPin className="contact-icon" />
                <span>Fairlands, Salem, Tamil Nadu</span>
              </li>
            </ul>

            <h4 className="footer-heading mt-4">Stay Updated</h4>
            <form onSubmit={handleNewsletterSubmit} className="footer-newsletter-form">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="newsletter-input" 
                required 
              />
              <button type="submit" className="newsletter-btn" aria-label="Subscribe">
                <FiSend />
              </button>
            </form>
          </Col>

        </Row>

        {/* Lower Footer: Copyright */}
        <div className="footer-lower pt-4">
          <Row className="align-items-center">
            <Col md={6} className="text-center text-md-start">
              <p className="copyright-text">
                © {new Date().getFullYear()} SplitNest. All rights reserved. Made for co-living harmony.
              </p>
            </Col>
            <Col md={6} className="text-center text-md-end mt-3 mt-md-0">
              <div className="footer-policy-links">
                <Link to="/privacy">Privacy Policy</Link>
                <span className="bullet-dot"></span>
                <Link to="/terms">Terms & Conditions</Link>
              </div>
            </Col>
          </Row>
        </div>
      </Container>
    </footer>
  );
}

export default SplitNestFooter;
