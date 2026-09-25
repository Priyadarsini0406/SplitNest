import { useState, useEffect } from 'react';
import { Container, Row, Col, Badge, Card, Button, ListGroup, Toast, ToastContainer, Modal, Form } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  FiArrowLeft, 
  FiMapPin, 
  FiHeart, 
  FiStar, 
  FiCalendar, 
  FiUser, 
  FiCheckCircle, 
  FiDollarSign, 
  FiInfo, 
  FiMessageSquare, 
  FiHome, 
  FiGrid,
  FiPhone,
  FiMail,
  FiShield
} from 'react-icons/fi';
import { PROPERTIES_DATA } from '../../data/properties';
import { useAuth } from '../../context/AuthContext';
import './Property.css';

function Property() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn, openAuthModal, pendingAction, clearPendingAction } = useAuth();
  
  // Find current property
  const property = PROPERTIES_DATA.find(p => p.id === Number(id)) || PROPERTIES_DATA[0];

  // Component states
  const [isSaved, setIsSaved] = useState(false);
  const [showOwnerDetails, setShowOwnerDetails] = useState(false);
  const [showVisitModal, setShowVisitModal] = useState(false);
  const [visitDate, setVisitDate] = useState('');
  const [visitTime, setVisitTime] = useState('10:00');
  
  // Toast notifications
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setShowToast(true);
  };

  // Resume actions after redirect back from login
  useEffect(() => {
    if (isLoggedIn && pendingAction && pendingAction.propertyId === property.id) {
      const action = pendingAction.action;
      if (action === 'save') {
        setIsSaved(true);
        triggerToast("Saved to your list! 💖");
        clearPendingAction();
      } else if (action === 'compare') {
        triggerToast("Property added to comparative analysis list! 📊");
        clearPendingAction();
      } else if (action === 'schedule') {
        setShowVisitModal(true);
        clearPendingAction();
      } else if (action === 'contact') {
        setShowOwnerDetails(true);
        triggerToast("Owner contact details unlocked!");
        clearPendingAction();
      } else if (action === 'chat') {
        triggerToast(`Starting secure conversation channel with ${property.owner.name}...`);
        clearPendingAction();
      }
    }
  }, [isLoggedIn, pendingAction, property, clearPendingAction]);

  // Auth check helper
  const handleProtectedAction = (actionName, successHandler) => {
    if (!isLoggedIn) {
      openAuthModal({ 
        action: actionName, 
        propertyId: property.id, 
        path: `/property-details/${property.id}` 
      });
    } else {
      successHandler();
    }
  };

  const handleSaveToggle = () => {
    handleProtectedAction('save', () => {
      setIsSaved(!isSaved);
      triggerToast(isSaved ? "Removed from saved wishlist." : "Property saved to your wishlist! 💖");
    });
  };

  const handleCompare = () => {
    handleProtectedAction('compare', () => {
      triggerToast("Property added to comparative analysis list! 📊");
    });
  };

  const handleScheduleVisit = () => {
    handleProtectedAction('schedule', () => {
      setShowVisitModal(true);
    });
  };

  const handleConfirmVisit = (e) => {
    e.preventDefault();
    setShowVisitModal(false);
    triggerToast(`📅 Visit request submitted for ${visitDate} at ${visitTime}!`);
  };

  const handleContactOwner = () => {
    handleProtectedAction('contact', () => {
      setShowOwnerDetails(true);
      triggerToast("Owner contact details unlocked!");
    });
  };

  const handleChatWithOwner = () => {
    handleProtectedAction('chat', () => {
      triggerToast(`💬 Connecting with owner ${property.owner.name}. Direct ledger channels opening...`);
    });
  };

  const handleBookNow = () => {
    if (!isLoggedIn) {
      openAuthModal({ 
        action: 'book', 
        propertyId: property.id, 
        path: `/book/${property.id}` 
      });
    } else {
      navigate(`/book/${property.id}`);
    }
  };

  return (
    <div className="property-details-page-wrapper">
      {/* Background soft gradients */}
      <div className="bg-glow bg-glow-primary"></div>
      <div className="bg-glow bg-glow-secondary"></div>

      <Container className="py-5 property-details-container">
        
        {/* Navigation row */}
        <div className="mb-4">
          <Link to="/" className="back-link d-inline-flex align-items-center gap-2 text-decoration-none">
            <FiArrowLeft /> Back to Home
          </Link>
        </div>

        <Row className="g-4">
          {/* LEFT COLUMN: Media Showcase & Info details */}
          <Col lg={8}>
            
            {/* Visual Image Banner with overlay details */}
            <div className="property-details-image-holder position-relative mb-4">
              <img src={property.image} alt={property.name} className="property-main-img" />
              <Badge bg="danger" className="details-featured-badge">
                <FiHome className="me-1" /> {property.type}
              </Badge>
              <div className="details-score-badge">
                👥 {property.matchScore}% Match
              </div>
            </div>

            {/* Core Info Box */}
            <Card className="details-glass-card border-0 mb-4 p-4">
              <div className="d-flex justify-content-between align-items-start mb-3 flex-wrap gap-2">
                <div>
                  <h1 className="display-6 fw-bold text-dark-heading mb-2">{property.name}</h1>
                  <p className="text-muted d-flex align-items-center gap-2 mb-0">
                    <FiMapPin className="text-teal" /> {property.location} &bull; {property.distance}
                  </p>
                </div>
                <div className="rating-badge-large text-end">
                  <div className="stars d-flex align-items-center gap-1 justify-content-end text-warning fw-semibold fs-5">
                    <FiStar className="fill-warning" /> {property.rating}
                  </div>
                  <span className="small text-muted">{property.reviews} reviews</span>
                </div>
              </div>

              <hr className="my-4 border-secondary-subtle" />

              {/* Property Details Description */}
              <h4 className="text-dark-heading fw-bold mb-3">About this Space</h4>
              <p className="property-long-desc text-muted mb-4">{property.description}</p>
              
              <div className="d-flex gap-3 flex-wrap">
                <div className="spec-badge p-3 rounded text-center flex-grow-1">
                  <span className="text-muted d-block small">Furnished Status</span>
                  <span className="fw-semibold text-dark-heading">{property.furnished}</span>
                </div>
                <div className="spec-badge p-3 rounded text-center flex-grow-1">
                  <span className="text-muted d-block small">Room Config</span>
                  <span className="fw-semibold text-dark-heading">{property.roomType}</span>
                </div>
                <div className="spec-badge p-3 rounded text-center flex-grow-1">
                  <span className="text-muted d-block small">Allowed Genders</span>
                  <span className="fw-semibold text-dark-heading">{property.gender || "Any"}</span>
                </div>
              </div>
            </Card>

            {/* Amenities Section */}
            <Card className="details-glass-card border-0 mb-4 p-4">
              <h4 className="text-dark-heading fw-bold mb-3">Amenities & Perks</h4>
              <Row className="g-3">
                {property.amenities.map((a, i) => (
                  <Col key={i} xs={6} md={4} className="d-flex align-items-center gap-2">
                    <FiCheckCircle className="text-teal flex-shrink-0" />
                    <span className="text-muted">{a}</span>
                  </Col>
                ))}
              </Row>
            </Card>

            {/* Roommate Section */}
            <Card className="details-glass-card border-0 mb-4 p-4">
              <h4 className="text-dark-heading fw-bold mb-3">Current Nest Flatmates</h4>
              {property.flatmates.length > 0 ? (
                <Row className="g-3">
                  {property.flatmates.map((fm, i) => (
                    <Col key={i} md={6}>
                      <div className="flatmate-detail-card p-3 rounded d-flex align-items-center gap-3">
                        <div className="flatmate-avatar-large">
                          {fm.name.charAt(0)}
                        </div>
                        <div>
                          <h6 className="fw-bold text-dark-heading mb-1">{fm.name}</h6>
                          <p className="text-muted small mb-0">{fm.bio}</p>
                        </div>
                      </div>
                    </Col>
                  ))}
                </Row>
              ) : (
                <div className="p-4 rounded border border-dashed text-center text-muted">
                  🏡 No roommates have claimed rooms in this nest yet. Book first to form your group!
                </div>
              )}
            </Card>

          </Col>

          {/* RIGHT COLUMN: Glass Checkout Widget */}
          <Col lg={4}>
            <div className="sticky-sidebar">
              <Card className="checkout-widget-card border-0 p-4 mb-4">
                
                {/* Pricing Area */}
                <div className="mb-4">
                  <span className="text-muted small">Monthly Rent</span>
                  <div className="d-flex align-items-baseline gap-2">
                    <h2 className="display-5 fw-bold text-primary mb-0">{property.price}</h2>
                    <span className="text-muted">/ room / mo</span>
                  </div>
                </div>

                {/* Additional Cost details */}
                <ListGroup className="list-group-flush border-0 bg-transparent mb-4">
                  <ListGroup.Item className="d-flex justify-content-between align-items-center px-0 py-2 border-0 bg-transparent">
                    <span className="text-muted d-flex align-items-center gap-1"><FiDollarSign /> Refundable Deposit</span>
                    <span className="fw-semibold text-dark-heading">₹{property.deposit}</span>
                  </ListGroup.Item>
                  <ListGroup.Item className="d-flex justify-content-between align-items-center px-0 py-2 border-0 bg-transparent">
                    <span className="text-muted d-flex align-items-center gap-1"><FiCalendar /> Availability</span>
                    <span className="fw-semibold text-teal">{property.availability}</span>
                  </ListGroup.Item>
                  <ListGroup.Item className="d-flex justify-content-between align-items-center px-0 py-2 border-0 bg-transparent">
                    <span className="text-muted d-flex align-items-center gap-1"><FiShield /> Verification Code</span>
                    <span className="text-success fw-semibold">SN-VETTED</span>
                  </ListGroup.Item>
                </ListGroup>

                {/* Core booking & compare buttons */}
                <div className="d-flex flex-column gap-3 mb-4">
                  <Button 
                    className="btn-booking-primary py-3 fw-bold fs-5"
                    onClick={handleBookNow}
                  >
                    Book Now
                  </Button>
                  
                  <Row className="g-2">
                    <Col xs={6}>
                      <Button 
                        variant="outline-secondary" 
                        className="btn-booking-action w-100 py-2 d-flex align-items-center justify-content-center gap-1"
                        onClick={handleSaveToggle}
                      >
                        <FiHeart className={isSaved ? "fill-danger text-danger" : ""} />
                        {isSaved ? "Saved" : "Save"}
                      </Button>
                    </Col>
                    <Col xs={6}>
                      <Button 
                        variant="outline-secondary" 
                        className="btn-booking-action w-100 py-2 d-flex align-items-center justify-content-center gap-1"
                        onClick={handleCompare}
                      >
                        <FiGrid /> Compare
                      </Button>
                    </Col>
                  </Row>

                  <Button 
                    className="btn-booking-secondary py-2.5 fw-semibold d-flex align-items-center justify-content-center gap-2"
                    onClick={handleScheduleVisit}
                  >
                    <FiCalendar /> Schedule Visit
                  </Button>
                </div>

                <hr className="my-4 border-secondary-subtle" />

                {/* Owner info */}
                <div>
                  <h5 className="fw-bold text-dark-heading mb-3">Host Information</h5>
                  
                  {!showOwnerDetails ? (
                    <div className="d-flex flex-column gap-2">
                      <p className="small text-muted mb-2">Unlock owner contact verification for secure direct leasing.</p>
                      <Button 
                        variant="outline-primary"
                        onClick={handleContactOwner}
                        className="py-2 fw-semibold"
                      >
                        Unlock Contact Info
                      </Button>
                    </div>
                  ) : (
                    <div className="owner-profile p-3 rounded">
                      <div className="d-flex align-items-center gap-3 mb-3">
                        <div className="owner-avatar">
                          {property.owner.name.charAt(0)}
                        </div>
                        <div>
                          <h6 className="fw-bold text-dark-heading mb-0">{property.owner.name}</h6>
                          <small className="text-warning fw-semibold">★ {property.owner.rating} Rated Owner</small>
                        </div>
                      </div>
                      <div className="d-flex flex-column gap-2 text-muted small">
                        <div className="d-flex align-items-center gap-2">
                          <FiPhone className="text-teal" /> <span>{property.owner.phone}</span>
                        </div>
                        <div className="d-flex align-items-center gap-2">
                          <FiMail className="text-teal" /> <span>{property.owner.email}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <Button 
                    variant="link"
                    className="w-100 text-center text-teal fw-semibold mt-3 text-decoration-none d-flex align-items-center justify-content-center gap-2"
                    onClick={handleChatWithOwner}
                  >
                    <FiMessageSquare /> Chat with Owner
                  </Button>
                </div>

              </Card>
            </div>
          </Col>
        </Row>
      </Container>

      {/* TOAST SYSTEM */}
      <ToastContainer position="bottom-end" className="p-3 z-index-toast">
        <Toast onClose={() => setShowToast(false)} show={showToast} delay={3500} autohide className="glass-toast border-0 shadow">
          <Toast.Header className="glass-toast-header border-0 text-white">
            <strong className="me-auto d-flex align-items-center gap-2">💡 SplitNest System</strong>
          </Toast.Header>
          <Toast.Body className="glass-toast-body text-white">{toastMessage || toastMsg}</Toast.Body>
        </Toast>
      </ToastContainer>

      {/* SCHEDULE VISIT MODAL */}
      <Modal show={showVisitModal} onHide={() => setShowVisitModal(false)} centered contentClassName="visit-modal-content">
        <Modal.Header closeButton className="border-0 pb-0 text-white">
          <Modal.Title className="fw-bold">📅 Schedule a Nest Visit</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-white">
          <Form onSubmit={handleConfirmVisit}>
            <Form.Group className="mb-3" controlId="visitDateInput">
              <Form.Label className="small text-muted">Select Date</Form.Label>
              <Form.Control 
                type="date" 
                required 
                value={visitDate}
                onChange={(e) => setVisitDate(e.target.value)}
                className="visit-custom-input"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="visitTimeInput">
              <Form.Label className="small text-muted">Select Time Slot</Form.Label>
              <Form.Control 
                type="time" 
                required 
                value={visitTime}
                onChange={(e) => setVisitTime(e.target.value)}
                className="visit-custom-input"
              />
            </Form.Group>
            <Button type="submit" className="w-100 btn-modal-primary mt-2">
              Request Visit Time
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

    </div>
  );
}

export default Property;
