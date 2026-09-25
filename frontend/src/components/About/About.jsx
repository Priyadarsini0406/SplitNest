import { Container, Row, Col } from 'react-bootstrap';
import { FiTarget, FiEye } from 'react-icons/fi';
import './About.css';

function About() {
  return (
    <section id="about" className="about-section">
      {/* Background glow blobs */}
      <div className="about-glow-1"></div>
      <div className="about-glow-2"></div>

      <Container>
        <Row className="align-items-center g-5">
          {/* Left Column: Mission, Vision & Context */}
          <Col lg={6} className="about-content-col animate-fade-up">
            <div className="about-header">
              <div className="about-tag">About SplitNest</div>
              <h2 className="about-title">
                Building nests that bring <span className="title-gradient">people together</span>
              </h2>
              <p className="about-subtitle">
                SplitNest was created by co-living veterans who understand first-hand the friction of shared households. From awkward rent reminders to dividing electricity bills, we knew there had to be a smarter way.
              </p>
            </div>

            {/* Mission & Vision Cards */}
            <Row className="g-4 about-grid">
              {/* Mission Card */}
              <Col sm={12} md={6} className="d-flex">
                <div className="about-glass-card">
                  <div className="about-icon-circle bg-primary-light">
                    <FiTarget className="text-primary" />
                  </div>
                  <h3 className="about-card-title">Our Mission</h3>
                  <p className="about-card-desc">
                    To foster community, clarity, and convenience in modern shared households, ensuring roomies focus on memories, not math.
                  </p>
                </div>
              </Col>

              {/* Vision Card */}
              <Col sm={12} md={6} className="d-flex">
                <div className="about-glass-card">
                  <div className="about-icon-circle bg-secondary-light">
                    <FiEye className="text-secondary" />
                  </div>
                  <h3 className="about-card-title">Our Vision</h3>
                  <p className="about-card-desc">
                    To become the global standard for shared living, simplifying roommate matching and expense settlements.
                  </p>
                </div>
              </Col>
            </Row>
          </Col>

          {/* Right Column: Illustration Placeholder */}
          <Col lg={6} className="about-image-col animate-fade-up delay-2">
            <div className="about-illustration-wrapper">
              <div className="about-orbit-ring"></div>
              <div className="about-img-container">
                <img 
                  src="/about_illustration.png" 
                  alt="SplitNest co-living unity illustration" 
                  className="about-illustration-img" 
                />
              </div>
              
              {/* Overlay Glass Badge */}
              <div className="about-floating-badge">
                <div className="badge-pulse"></div>
                <span>Est. 2026 • Salem TN</span>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
}

export default About;
