import { Container, Row, Col } from 'react-bootstrap';
import './Room.css';

function Room() {
  return (
    <div className="room-page-wrapper">
      <Container className="py-5">
        <Row className="justify-content-center text-center">
          <Col md={8}>
            <div className="room-card-glass py-5 px-4">
              <h1 className="display-4 fw-bold mb-4 room-heading">Room</h1>
              <p className="lead room-subtext">
                Welcome to the Room page of SplitNest. This is a responsive starter layout.
              </p>
              <div className="room-visual-stub my-4 d-flex align-items-center justify-content-center">
                <span>Room Section Visual Placeholder</span>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Room;
