import { Container, Row, Col } from 'react-bootstrap';
import { 
  FiArrowRight, 
  FiShield, 
  FiCheckCircle, 
  FiCreditCard, 
  FiCalendar, 
  FiMapPin, 
  FiDollarSign,
  FiCheck,
  FiHome,
  FiUsers
} from 'react-icons/fi';
import './Hero.css';
import { useNavigate } from 'react-router-dom';

function SplitNestHero() {
  const navigate = useNavigate();

  const handleExploreClick = () => {
    const element = document.getElementById('properties');
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const handleJoinNowClick = () => {
    navigate('/register');
  };
  return (
    <section id="home" className="hero-section">
      {/* Ambient Pulsing Glow Blobs */}
      <div className="glow-blob glow-blob-primary"></div>
      <div className="glow-blob glow-blob-secondary"></div>
      <div className="glow-blob glow-blob-accent"></div>

      <Container>
        <Row className="align-items-center">
          {/* Left Column: Heading & Content */}
          <Col lg={6} className="hero-content-col animate-fade-up delay-1">
            {/* Live Indicator Tagline */}
            <div className="hero-badge animate-fade-up delay-1">
              <span className="hero-badge-dot"></span>
              <span>Smart Roommate Matching & Rent Splitting</span>
            </div>

            {/* Main Heading */}
            <h1 className="hero-heading animate-fade-up delay-2">
              Find. Share.<br />
              <span className="hero-heading-gradient">Live Together.</span>
            </h1>

            {/* Subtitle */}
            <p className="hero-subtitle animate-fade-up delay-3">
              Discover verified rental properties, connect with trusted roommates, split rent, and manage shared living.
            </p>

            {/* Call to Actions */}
            <div className="hero-btn-group animate-fade-up delay-4">
              <button 
                className="btn-primary-gradient"
                onClick={handleExploreClick}
              >
                Explore Properties <FiArrowRight className="btn-icon" />
              </button>
              <button 
                className="btn-outline-interactive"
                onClick={handleJoinNowClick}
              >
                Join Now
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="hero-trust-indicators animate-fade-up delay-5">
              <div className="trust-item">
                <FiShield className="trust-icon" />
                <span>Verified Listings & Roommates</span>
              </div>
              <div className="trust-item">
                <FiCheckCircle className="trust-icon" />
                <span>Instant Rent & Bill Splitting</span>
              </div>
            </div>
          </Col>

          {/* Right Column: Custom Illustration with Overlay Glass Cards */}
          <Col lg={6} className="hero-illustration-col animate-fade-up delay-3">
            <div className="illustration-wrapper">
              {/* Spinning Outer Orbit Ring */}
              <div className="illustration-back-ring"></div>
              
              {/* Soft Radial Glow behind the illustration */}
              <div className="illustration-glow-center"></div>

              {/* Main Custom Generated Illustration */}
              <div className="main-illustration-container" style={{ width: "390px", height: "390px", maxWidth: "72vw", maxHeight: "72vw" }}>
                <img 
                  src="/hero_illustration.png" 
                  alt="SplitNest Modern Co-living Illustration" 
                  className="hero-illustration-image"
                  style={{ objectFit: "cover", objectPosition: "center" }}
                />
              </div>

              {/* FLOATING GLASS CARDS (Positioned relative to wrapper) */}
              
              {/* Card 1: Rent Payment (Top-Left) */}
              <div className="glass-card card-payment">
                <div className="glass-icon-circle bg-success-light">
                  <FiCheck className="text-success" />
                </div>
                <div className="glass-card-text">
                  <span className="glass-card-label">Rent Status</span>
                  <p className="glass-card-value">Paid: 3/3 Roomies</p>
                </div>
              </div>

              {/* Card 2: Wallet Card (Bottom-Left) */}
              <div className="glass-card card-wallet-glow">
                <div className="glass-icon-circle bg-primary-light">
                  <FiCreditCard className="text-primary" />
                </div>
                <div className="glass-card-text">
                  <span className="glass-card-label">Nest Wallet</span>
                  <p className="glass-card-value">$1,850.00</p>
                </div>
              </div>

              {/* Card 3: Calendar Chores (Top-Right) */}
              <div className="glass-card card-chore-glow">
                <div className="glass-icon-circle bg-accent-light">
                  <FiCalendar className="text-accent" />
                </div>
                <div className="glass-card-text">
                  <span className="glass-card-label">Next Chore</span>
                  <p className="glass-card-value">Alex: Clean Kitchen</p>
                </div>
              </div>

              {/* Card 4: Location (Bottom-Right) */}
              <div className="glass-card card-location-glow">
                <div className="glass-icon-circle bg-secondary-light">
                  <FiMapPin className="text-secondary" />
                </div>
                <div className="glass-card-text">
                  <span className="glass-card-label">Active Nest</span>
                  <p className="glass-card-value">Fairlands PG, Salem</p>
                </div>
              </div>

              {/* Floating elements representing apartment / roommate utilities */}
              <div className="floating-bubble bubble-pin">
                <FiMapPin />
              </div>
              <div className="floating-bubble bubble-home">
                <FiHome />
              </div>
              <div className="floating-bubble bubble-users">
                <FiUsers />
              </div>
              <div className="floating-bubble bubble-dollar">
                <FiDollarSign />
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
}

export default SplitNestHero;
