import { Container, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiShield } from 'react-icons/fi';
import './Privacy.css';

function Privacy() {
  return (
    <div className="policy-page-wrapper">
      <div className="bg-glow bg-glow-primary"></div>
      <div className="bg-glow bg-glow-secondary"></div>

      <Container className="py-5 policy-container">
        <div className="mb-4">
          <Link to="/" className="back-link d-inline-flex align-items-center gap-2 text-decoration-none">
            <FiArrowLeft /> Back to Home
          </Link>
        </div>

        <Row className="justify-content-center">
          <Col lg={9}>
            <Card className="policy-glass-card border-0 p-5">
              <div className="text-center mb-5">
                <div className="policy-icon-wrapper mb-3">
                  <FiShield className="display-4 text-teal" />
                </div>
                <h1 className="fw-bold text-dark-heading">Privacy Policy</h1>
                <p className="text-muted small mt-2">Last updated: July 19, 2026</p>
              </div>

              <div className="policy-content text-muted">
                <h4 className="text-white fw-bold mt-4 mb-3">1. Information We Collect</h4>
                <p>
                  At SplitNest, we collect information that identifies, relates to, describes, or is reasonably capable of being associated with you. This includes details like your full name, email address, phone number, role type (roommate or property owner), and lease transactions ledger logged on the platform.
                </p>

                <h4 className="text-white fw-bold mt-4 mb-3">2. How We Use Your Information</h4>
                <p>
                  We process your data to match you with compatible roommates, secure co-living properties, split rents, handle utility bills, provide support, and audit roommate scores dynamically. We never sell your data to third parties.
                </p>

                <h4 className="text-white fw-bold mt-4 mb-3">3. Data Security & Ledger Protection</h4>
                <p>
                  SplitNest implements multi-layered encryption protocols for all financial splitting ledger logs and chat messages. Financial transactions and roommate vetting details are isolated in secure environments to ensure compliance and data safety.
                </p>

                <h4 className="text-white fw-bold mt-4 mb-3">4. Cookies and Tracking</h4>
                <p>
                  We utilize cookies to maintain session states (such as remembering your login authentication status) and enhance interactive browsing settings across the landing and dashboard panels.
                </p>

                <h4 className="text-white fw-bold mt-4 mb-3">5. Contact Us</h4>
                <p>
                  If you have questions about this privacy statement, contact us at <a href="mailto:privacy@splitnest.com" className="text-teal text-decoration-none">privacy@splitnest.com</a>.
                </p>
              </div>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Privacy;
