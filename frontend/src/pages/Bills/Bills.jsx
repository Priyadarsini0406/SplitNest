import { Container, Row, Col } from 'react-bootstrap';
import './Bills.css';

function Bills() {
  return (
    <div className="bills-page-wrapper">
      <Container className="py-5">
        <Row className="justify-content-center text-center">
          <Col md={8}>
            <div className="bills-card-glass py-5 px-4">
              <h1 className="display-4 fw-bold mb-4 bills-heading">Bills</h1>
              <p className="lead bills-subtext">
                Welcome to the Bills page of SplitNest. This is a responsive starter layout.
              </p>
              <div className="bills-visual-stub my-4 d-flex align-items-center justify-content-center">
                <span>Bills Section Visual Placeholder</span>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Bills;
