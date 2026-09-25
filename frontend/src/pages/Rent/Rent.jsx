import { Container, Row, Col } from 'react-bootstrap';
import './Rent.css';

function Rent() {
  return (
    <div className="rent-page-wrapper">
      <Container className="py-5">
        <Row className="justify-content-center text-center">
          <Col md={8}>
            <div className="rent-card-glass py-5 px-4">
              <h1 className="display-4 fw-bold mb-4 rent-heading">Rent</h1>
              <p className="lead rent-subtext">
                Welcome to the Rent page of SplitNest. This is a responsive starter layout.
              </p>
              <div className="rent-visual-stub my-4 d-flex align-items-center justify-content-center">
                <span>Rent Section Visual Placeholder</span>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Rent;
