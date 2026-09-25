import { Container, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiFileText } from 'react-icons/fi';
import '../Privacy/Privacy.css';

function Terms() {
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
                  <FiFileText className="display-4 text-teal" />
                </div>
                <h1 className="fw-bold text-dark-heading">Terms & Conditions</h1>
                <p className="text-muted small mt-2">Last updated: July 19, 2026</p>
              </div>

              <div className="policy-content text-muted">
                <h4 className="text-white fw-bold mt-4 mb-3">1. Agreement to Terms</h4>
                <p>
                  By accessing or using SplitNest co-living platform, you agree to comply with and be bound by these Terms & Conditions. If you disagree with any part of these terms, you must terminate your access immediately.
                </p>

                <h4 className="text-white fw-bold mt-4 mb-3">2. User Vetting & Authentication</h4>
                <p>
                  SplitNest requires all active occupants and property owners to provide accurate credentials and profile settings during registration. You are solely responsible for keeping your login credentials confidential.
                </p>

                <h4 className="text-white fw-bold mt-4 mb-3">3. Split Ledgers and Utility Payments</h4>
                <p>
                  All cost allocations, utility share estimations, and rent bills created inside SplitNest are computed based on details configured by the roommates. Roommates agree to settle pending splits on time to maintain a high Home Score.
                </p>

                <h4 className="text-white fw-bold mt-4 mb-3">4. Vetted Listings and Bookings</h4>
                <p>
                  Property descriptions, prices, location distance, and flatmate specifications are listed for representation. Bookings and reservations placed on the platform are escrowed and handled according to individual co-living agreements.
                </p>

                <h4 className="text-white fw-bold mt-4 mb-3">5. Termination & Disputes</h4>
                <p>
                  SplitNest reserves the right to suspend accounts that breach co-living rules or fail to pay splits. For ledger queries, please email us at <a href="mailto:support@splitnest.com" className="text-teal text-decoration-none">support@splitnest.com</a>.
                </p>
              </div>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Terms;
