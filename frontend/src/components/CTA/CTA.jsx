import { Container, Row, Col } from 'react-bootstrap';
import { FiArrowRight } from 'react-icons/fi';
import './CTA.css';
import { useNavigate } from 'react-router-dom';

function SplitNestCTA() {
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

  const handleGetStartedClick = () => {
    navigate('/register');
  };

  return (
    <section className="cta-section">
      <Container>
        <Row className="justify-content-center">
          <Col lg={10} className="animate-fade-up">
            {/* Main Gradient Card */}
            <div className="cta-card-gradient">
              {/* Floating decorative shapes */}
              <div className="cta-shape cta-shape-1"></div>
              <div className="cta-shape cta-shape-2"></div>
              <div className="cta-shape cta-shape-3"></div>
              
              {/* Soft glow centers */}
              <div className="cta-glow-dot"></div>

              {/* Content Box */}
              <div className="cta-card-content text-center">
                <h2 className="cta-heading">Ready to simplify shared living?</h2>
                <p className="cta-subheading">
                  Join SplitNest today and experience smarter room sharing, rent management, and hassle-free living.
                </p>

                {/* Buttons block */}
                <div className="cta-btn-group">
                  <button 
                    className="btn-cta-primary"
                    onClick={handleGetStartedClick}
                  >
                    Get Started <FiArrowRight className="cta-arrow" />
                  </button>
                  <button 
                    className="btn-cta-secondary"
                    onClick={handleExploreClick}
                  >
                    Explore Properties
                  </button>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
}

export default SplitNestCTA;
