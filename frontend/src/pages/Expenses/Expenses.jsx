import { Container, Row, Col } from 'react-bootstrap';
import './Expenses.css';

function Expenses() {
  return (
    <div className="expenses-page-wrapper">
      <Container className="py-5">
        <Row className="justify-content-center text-center">
          <Col md={8}>
            <div className="expenses-card-glass py-5 px-4">
              <h1 className="display-4 fw-bold mb-4 expenses-heading">Expenses</h1>
              <p className="lead expenses-subtext">
                Welcome to the Expenses page of SplitNest. This is a responsive starter layout.
              </p>
              <div className="expenses-visual-stub my-4 d-flex align-items-center justify-content-center">
                <span>Expenses Section Visual Placeholder</span>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Expenses;
