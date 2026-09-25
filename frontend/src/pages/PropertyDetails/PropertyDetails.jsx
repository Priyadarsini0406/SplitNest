import { useState, useEffect } from 'react';
import { Container, Row, Col, Badge, Card, Button, Form, ProgressBar, Modal, Toast, ToastContainer } from 'react-bootstrap';
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
  FiShield,
  FiWifi,
  FiLoader,
  FiActivity,
  FiClock,
  FiThumbsUp,
  FiCheck
} from 'react-icons/fi';
import { PROPERTIES_DATA } from '../../data/properties';
import { useAuth } from '../../context/AuthContext';
import './PropertyDetails.css';

// Reviews Data
const REVIEWS_DATA = [
  {
    id: 1,
    name: "Arvind Swamy",
    avatar: "A",
    rating: 5,
    duration: "Stayed 1 year",
    date: "June 2026",
    text: "Excellent co-living experience. The water supply is continuous, and the internet speed is outstanding for work-from-home setups. Very clean neighbourhood.",
    helpful: 12
  },
  {
    id: 2,
    name: "Malini R.",
    avatar: "M",
    rating: 5,
    duration: "Stayed 8 months",
    date: "May 2026",
    text: "Very safe area for women. The safety scores are accurate, and there are good CCTV coverage and secure locks. The owner is very responsive.",
    helpful: 8
  },
  {
    id: 3,
    name: "Deepak Kumar",
    avatar: "D",
    rating: 4,
    duration: "Stayed 6 months",
    date: "April 2026",
    text: "Perfect location near Sona College of Technology. It takes less than 10 minutes to walk. Rent splitting via SplitNest ledger makes bill payments hassle-free.",
    helpful: 5
  },
  {
    id: 4,
    name: "Karthik Raja",
    avatar: "K",
    rating: 5,
    duration: "Stayed 1.5 years",
    date: "March 2026",
    text: "Highly recommend this PG. The electricity backup is consistent, and the study area is quiet. The flatmates are friendly and cooperative.",
    helpful: 15
  },
  {
    id: 5,
    name: "Sandhya Nair",
    avatar: "S",
    rating: 5,
    duration: "Stayed 10 months",
    date: "January 2026",
    text: "Clean, spacious and fully furnished house. The laundry area is well maintained, and the kitchen amenities are complete. Had an amazing stay.",
    helpful: 9
  },
  {
    id: 6,
    name: "Vignesh S.",
    avatar: "V",
    rating: 4,
    duration: "Stayed 1 year",
    date: "December 2025",
    text: "Excellent proximity to Salem Junction and local bus stand. Reaching nearby landmarks is straightforward, and the monthly splits are very transparent.",
    helpful: 6
  }
];

function PropertyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn, openAuthModal, pendingAction, clearPendingAction } = useAuth();

  // Find matching property
  const property = PROPERTIES_DATA.find(p => p.id === Number(id)) || PROPERTIES_DATA[0];

  // Component States
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isFullscreenGallery, setIsFullscreenGallery] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [helpfulReviews, setHelpfulReviews] = useState({});
  
  // Schedule visit modal
  const [showVisitModal, setShowVisitModal] = useState(false);
  const [visitDate, setVisitDate] = useState('');
  const [visitTime, setVisitTime] = useState('10:00');

  // Contact Owner State
  const [showOwnerDetails, setShowOwnerDetails] = useState(false);

  // Toast systems
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setShowToast(true);
  };

  // Realistic Salem-focused gallery images
  const galleryImages = [
    property.image,
    '/property_2.png',
    '/property_3.png',
    '/property_1.png',
    '/property_2.png'
  ];

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

  // Auth protection check
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
      triggerToast(`💬 Direct ledger channel opening with ${property.owner.name}.`);
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

  const handleHelpfulClick = (reviewId) => {
    setHelpfulReviews(prev => ({
      ...prev,
      [reviewId]: !prev[reviewId]
    }));
  };

  // Cost calculator variables
  const baseRent = property.rent;
  const electricity = 600;
  const water = 200;
  const internet = 700;
  const food = 3000;
  const transportation = 800;
  const maintenance = 300;
  const totalCost = baseRent + electricity + water + internet + food + transportation + maintenance;

  return (
    <div className="property-details-page-wrapper">
      {/* Ambient gradient backgrounds */}
      <div className="bg-glow bg-glow-primary"></div>
      <div className="bg-glow bg-glow-secondary"></div>

      <Container className="py-4 property-details-container">
        
        {/* Back Link */}
        <div className="mb-4">
          <Link to="/" className="back-link d-inline-flex align-items-center gap-2 text-decoration-none">
            <FiArrowLeft /> Back to Directory
          </Link>
        </div>

        {/* SECTION 1: PREMIUM IMAGE GALLERY */}
        <section className="mb-5 animate-fade-in">
          <Row className="g-3">
            {/* Active Hero Image */}
            <Col lg={8} className="position-relative">
              <div className="gallery-hero-image-wrapper">
                <img 
                  src={galleryImages[activeImageIndex]} 
                  alt={`${property.name} hero`} 
                  className="gallery-hero-image"
                  onClick={() => setIsFullscreenGallery(true)}
                />
                
                {/* Floating Badges */}
                <div className="gallery-floating-badges">
                  <Badge className="badge-verified-item d-flex align-items-center gap-1">
                    <FiShield /> Verified Property
                  </Badge>
                  <Badge className="badge-trending-item d-flex align-items-center gap-1">
                    🔥 Trending
                  </Badge>
                  <Badge className="badge-premium-item d-flex align-items-center gap-1">
                    ⭐ Premium Listing
                  </Badge>
                </div>
              </div>
            </Col>
            
            {/* Thumbnails list */}
            <Col lg={4}>
              <div className="gallery-thumbnails-grid">
                {galleryImages.slice(1).map((img, idx) => (
                  <div 
                    key={idx} 
                    className={`gallery-thumb-item ${activeImageIndex === idx + 1 ? 'active' : ''}`}
                    onClick={() => setActiveImageIndex(idx + 1)}
                  >
                    <img src={img} alt={`thumbnail ${idx + 1}`} />
                    {idx === 3 && (
                      <div className="gallery-thumb-overlay" onClick={(e) => { e.stopPropagation(); setIsFullscreenGallery(true); }}>
                        <span>+ View Fullscreen</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Col>
          </Row>
        </section>

        <Row className="g-4">
          {/* LEFT CONTENT COLUMNS (OVERVIEW, MAP, RECOMMENDATION, SAFETY, AMENITIES, REVIEWS) */}
          <Col lg={8}>
            
            {/* SECTION 2: PROPERTY OVERVIEW */}
            <section className="mb-4">
              <Card className="details-glass-card border-0 p-4 animate-slide-up">
                <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-3">
                  <div>
                    <div className="d-flex align-items-center gap-2 mb-2">
                      <h1 className="property-main-title display-6 fw-bold m-0">{property.name}</h1>
                      <Badge bg="success" className="vetted-badge-item d-flex align-items-center gap-1">
                        <FiCheck /> Verified
                      </Badge>
                    </div>
                    <p className="text-muted d-flex align-items-center gap-2 mb-0">
                      <FiMapPin className="text-teal" /> {property.location} (Salem, Tamil Nadu)
                    </p>
                  </div>
                  <div className="rating-summary text-end">
                    <div className="rating-number text-warning fw-bold fs-4 d-flex align-items-center gap-1 justify-content-end">
                      <FiStar className="fill-warning" /> {property.rating}
                    </div>
                    <span className="small text-muted">({property.reviews} verified reviews)</span>
                  </div>
                </div>

                <Row className="g-3 my-3 overview-metrics-grid">
                  <Col xs={6} md={3}>
                    <div className="overview-metric-box p-3 rounded text-center">
                      <span className="text-muted d-block small mb-1">Monthly Rent</span>
                      <span className="fw-bold text-primary fs-5">{property.price}</span>
                    </div>
                  </Col>
                  <Col xs={6} md={3}>
                    <div className="overview-metric-box p-3 rounded text-center">
                      <span className="text-muted d-block small mb-1">Deposit</span>
                      <span className="fw-semibold text-dark-heading fs-5">₹{property.deposit}</span>
                    </div>
                  </Col>
                  <Col xs={6} md={3}>
                    <div className="overview-metric-box p-3 rounded text-center">
                      <span className="text-muted d-block small mb-1">Available From</span>
                      <span className="fw-semibold text-teal fs-5">{property.availability}</span>
                    </div>
                  </Col>
                  <Col xs={6} md={3}>
                    <div className="overview-metric-box p-3 rounded text-center">
                      <span className="text-muted d-block small mb-1">Property ID</span>
                      <span className="fw-semibold text-dark-heading fs-5">SN-{100 + property.id}</span>
                    </div>
                  </Col>
                </Row>

                <div className="d-flex gap-3 flex-wrap my-3">
                  <div className="feature-item-pill px-3 py-2 rounded">
                    <strong>Config:</strong> {property.roomType}
                  </div>
                  <div className="feature-item-pill px-3 py-2 rounded">
                    <strong>Type:</strong> {property.type}
                  </div>
                  <div className="feature-item-pill px-3 py-2 rounded">
                    <strong>Furnishing:</strong> {property.furnished}
                  </div>
                </div>

                <hr className="my-4 border-secondary-subtle" />

                {/* Modern Action Buttons */}
                <div className="d-flex gap-3 flex-wrap">
                  <Button 
                    className="btn-booking-primary px-5 py-3 fw-bold flex-grow-1"
                    onClick={handleBookNow}
                  >
                    🏡 Book Now
                  </Button>
                  <Button 
                    variant="outline-secondary" 
                    className="btn-booking-action px-4 py-3 fw-semibold d-flex align-items-center justify-content-center gap-2"
                    onClick={handleSaveToggle}
                  >
                    <FiHeart className={isSaved ? "fill-danger text-danger" : ""} />
                    {isSaved ? "Saved" : "Save Property"}
                  </Button>
                  <Button 
                    variant="outline-secondary" 
                    className="btn-booking-action px-4 py-3 fw-semibold d-flex align-items-center justify-content-center gap-2"
                    onClick={handleScheduleVisit}
                  >
                    <FiCalendar /> Schedule Visit
                  </Button>
                </div>
              </Card>
            </section>

            {/* SECTION 4: SPLITNEST RECOMMENDATION */}
            <section className="mb-4">
              <Card className="details-glass-card recommendation-card border-0 p-4">
                <div className="recommendation-badge-title mb-3">🤖 SPLITNEST RECOMMENDATION</div>
                <h4 className="text-white fw-bold mb-3">Perfect Fit for Students & Professionals</h4>
                <p className="text-white-50 mb-4">
                  This property is highly recommended for students studying at Sona College and young professionals working in Salem. The locality offers excellent transport connectivity, supermarkets, restaurants, hospitals and a peaceful residential environment.
                </p>
                <div className="d-flex gap-2 flex-wrap">
                  <span className="badge-rec-pill">🎓 Student Friendly</span>
                  <span className="badge-rec-pill">💼 Professional Friendly</span>
                  <span className="badge-rec-pill">🚌 Near New Bus Stand</span>
                  <span className="badge-rec-pill">🏫 Near Sona College</span>
                  <span className="badge-rec-pill">🛡 Safe Area</span>
                  <span className="badge-rec-pill">📶 High-Speed WiFi</span>
                </div>
              </Card>
            </section>

            {/* SECTION 7: AMENITIES */}
            <section className="mb-4">
              <Card className="details-glass-card border-0 p-4">
                <h4 className="text-dark-heading fw-bold mb-4">🏡 Amenities & Perks</h4>
                <Row className="g-3 amenities-grid">
                  {[
                    "WiFi", "Parking", "Kitchen", "Laundry", "Power Backup", 
                    "Lift", "Balcony", "24x7 Water Supply", "CCTV", "Security", 
                    "Washing Machine", "Refrigerator", "Dining Area", "Study Table", "Water Heater"
                  ].map((amenity, i) => (
                    <Col key={i} xs={6} sm={4} md={3}>
                      <div className="amenity-item-box p-3 rounded d-flex flex-column align-items-center justify-content-center text-center">
                        <div className="amenity-icon-wrapper mb-2">
                          {amenity === "WiFi" && <FiWifi />}
                          {amenity === "Parking" && <FiHome />}
                          {amenity === "CCTV" && <FiShield />}
                          {amenity === "Security" && <FiShield />}
                          {amenity === "Power Backup" && <FiActivity />}
                          {amenity === "Water Heater" && <FiClock />}
                          {/* fallback general icon */}
                          {!["WiFi", "Parking", "CCTV", "Security", "Power Backup", "Water Heater"].includes(amenity) && <FiCheckCircle />}
                        </div>
                        <span className="text-muted small fw-medium">{amenity}</span>
                      </div>
                    </Col>
                  ))}
                </Row>
              </Card>
            </section>

            {/* SECTION 6: SAFETY SCORE */}
            <section className="mb-4">
              <Card className="details-glass-card border-0 p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h4 className="text-dark-heading fw-bold m-0">🛡 Safety Score</h4>
                  <div className="safety-badge-large text-end">
                    <span className="display-6 fw-bold text-success">9.4</span>
                    <span className="text-muted font-secondary fs-5"> / 10</span>
                  </div>
                </div>

                <div className="d-flex align-items-center gap-2 mb-4 text-success fw-semibold small">
                  <FiCheckCircle /> Verified Safe Area (Fairlands, Salem)
                </div>

                <div className="safety-metrics-list">
                  {[
                    { label: "CCTV Coverage", value: 92 },
                    { label: "Street Lighting", value: 95 },
                    { label: "Women's Safety", value: 96 },
                    { label: "Security Guard", value: 90 },
                    { label: "Neighbourhood rating", value: 94 }
                  ].map((metric, i) => (
                    <div key={i} className="safety-progress-row mb-3">
                      <div className="d-flex justify-content-between mb-1 small text-muted">
                        <span>{metric.label}</span>
                        <span className="fw-semibold text-dark-heading">{metric.value}%</span>
                      </div>
                      <div className="custom-progress-bar-track">
                        <div className="custom-progress-bar-fill" style={{ width: `${metric.value}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </section>

            {/* SECTION 3: LOCATION */}
            <section className="mb-4">
              <Card className="details-glass-card border-0 p-4">
                <h4 className="text-dark-heading fw-bold mb-3">📍 Location Information</h4>
                <p className="text-muted d-flex align-items-center gap-2 mb-4">
                  <FiMapPin className="text-teal" /> Fairlands, Salem, Tamil Nadu
                </p>

                {/* Google Map Mockup */}
                <div className="map-placeholder-widget mb-4 rounded d-flex flex-column align-items-center justify-content-center text-center p-5">
                  <div className="map-radar-pulse mb-3"></div>
                  <h6 className="fw-bold text-dark-heading mb-1">SplitNest Geolocation Active</h6>
                  <p className="text-muted small max-width-300">Approximated zone around Sona College of Technology, Fairlands, Salem</p>
                </div>

                <h5 className="fw-bold text-dark-heading mb-3">Nearby Landmarks & Transit Time</h5>
                <Row className="g-3">
                  {[
                    { name: "Sona College of Technology", time: "8 mins walk" },
                    { name: "Salem Junction Railway Station", time: "10 mins drive" },
                    { name: "New Bus Stand", time: "5 mins drive" },
                    { name: "Reliance Smart Supermarket", time: "3 mins walk" },
                    { name: "Kauvery Hospital", time: "6 mins walk" },
                    { name: "Five Roads", time: "4 mins drive" }
                  ].map((landmark, i) => (
                    <Col key={i} sm={6}>
                      <div className="landmark-transit-box p-3 rounded d-flex justify-content-between align-items-center">
                        <span className="text-muted small">{landmark.name}</span>
                        <Badge bg="light" text="dark" className="border small text-teal fw-semibold">
                          <FiClock className="me-1" /> {landmark.time}
                        </Badge>
                      </div>
                    </Col>
                  ))}
                </Row>
              </Card>
            </section>

            {/* SECTION 9: REVIEWS */}
            <section className="mb-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="text-dark-heading fw-bold m-0">⭐ Roommate Reviews</h4>
                <span className="text-muted small">6 Verified stays</span>
              </div>
              
              <Row className="g-3">
                {REVIEWS_DATA.map((rev) => (
                  <Col key={rev.id} md={6}>
                    <Card className="details-glass-card border-0 p-4 h-100 d-flex flex-column justify-content-between">
                      <div>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <div className="d-flex align-items-center gap-2">
                            <div className="review-avatar">
                              {rev.avatar}
                            </div>
                            <div>
                              <h6 className="fw-bold text-dark-heading mb-0">{rev.name}</h6>
                              <small className="text-muted small">{rev.duration} &bull; {rev.date}</small>
                            </div>
                          </div>
                          <div className="review-rating text-warning d-flex align-items-center gap-1">
                            <FiStar className="fill-warning" /> <span>{rev.rating}.0</span>
                          </div>
                        </div>
                        <p className="text-muted small review-text-body">"{rev.text}"</p>
                      </div>
                      
                      <div className="d-flex justify-content-end align-items-center border-top pt-3 mt-3">
                        <Button 
                          variant="link" 
                          className="helpful-btn-review d-flex align-items-center gap-1 text-decoration-none small text-teal"
                          onClick={() => handleHelpfulClick(rev.id)}
                        >
                          <FiThumbsUp /> 
                          <span>
                            {helpfulReviews[rev.id] ? "Helpful (Liked)" : `Helpful (${rev.helpful})`}
                          </span>
                        </Button>
                      </div>
                    </Card>
                  </Col>
                ))}
              </Row>
            </section>

          </Col>

          {/* RIGHT COLUMN (COST CALCULATOR, OWNER PROFILE) */}
          <Col lg={4}>
            <div className="sticky-sidebar-details">
              
              {/* SECTION 5: MONTHLY COST CALCULATOR */}
              <Card className="checkout-widget-card border-0 p-4 mb-4">
                <h4 className="text-dark-heading fw-bold mb-4">💰 Cost Calculator</h4>
                
                <div className="calc-table mb-4">
                  <div className="calc-row d-flex justify-content-between mb-2">
                    <span className="text-muted small">Base Rent</span>
                    <span className="text-dark-heading small fw-semibold">₹{baseRent}</span>
                  </div>
                  <div className="calc-row d-flex justify-content-between mb-2">
                    <span className="text-muted small">Electricity (approx)</span>
                    <span className="text-dark-heading small fw-semibold">₹{electricity}</span>
                  </div>
                  <div className="calc-row d-flex justify-content-between mb-2">
                    <span className="text-muted small">Water supply</span>
                    <span className="text-dark-heading small fw-semibold">₹{water}</span>
                  </div>
                  <div className="calc-row d-flex justify-content-between mb-2">
                    <span className="text-muted small">High-Speed WiFi</span>
                    <span className="text-dark-heading small fw-semibold">₹{internet}</span>
                  </div>
                  <div className="calc-row d-flex justify-content-between mb-2">
                    <span className="text-muted small">Mess & Food (opt)</span>
                    <span className="text-dark-heading small fw-semibold">₹{food}</span>
                  </div>
                  <div className="calc-row d-flex justify-content-between mb-2">
                    <span className="text-muted small">Transportation</span>
                    <span className="text-dark-heading small fw-semibold">₹{transportation}</span>
                  </div>
                  <div className="calc-row d-flex justify-content-between mb-2">
                    <span className="text-muted small">Maintenance</span>
                    <span className="text-dark-heading small fw-semibold">₹{maintenance}</span>
                  </div>

                  <hr className="border-secondary-subtle my-3" />

                  <div className="calc-total-box p-3 rounded d-flex justify-content-between align-items-center">
                    <span className="fw-semibold text-dark-heading">Estimated Monthly:</span>
                    <h3 className="fw-bold text-teal m-0">₹{totalCost}</h3>
                  </div>
                </div>

                <div className="text-center text-muted small italic">
                  "Estimated expenses may vary depending on your lifestyle."
                </div>
              </Card>

              {/* SECTION 8: OWNER PROFILE */}
              <Card className="details-glass-card border-0 p-4">
                <h4 className="text-dark-heading fw-bold mb-4">👤 Host Details</h4>
                <div className="d-flex align-items-center gap-3 mb-4">
                  <div className="owner-avatar-large">
                    {property.owner.name.charAt(0)}
                  </div>
                  <div>
                    <div className="d-flex align-items-center gap-1 mb-1">
                      <h6 className="fw-bold text-dark-heading m-0">{property.owner.name}</h6>
                      <Badge bg="success" className="owner-vetted-badge px-1 py-0.5">Vetted</Badge>
                    </div>
                    <span className="text-muted small">Member since 2024</span>
                  </div>
                </div>

                {!showOwnerDetails ? (
                  <div className="d-flex flex-column gap-2 text-center">
                    <p className="small text-muted mb-2">Host contact info is protected. Verification check required.</p>
                    <Button 
                      variant="outline-primary"
                      className="py-2.5 fw-semibold"
                      onClick={handleContactOwner}
                    >
                      Verify & Reveal Contact
                    </Button>
                  </div>
                ) : (
                  <div className="owner-unlocked-details p-3 rounded text-muted small mb-3">
                    <div className="d-flex align-items-center gap-2 mb-2">
                      <FiPhone className="text-teal" /> <span>{property.owner.phone}</span>
                    </div>
                    <div className="d-flex align-items-center gap-2 mb-2">
                      <FiMail className="text-teal" /> <span>{property.owner.email}</span>
                    </div>
                    <div className="d-flex justify-content-between mt-2 pt-2 border-top border-secondary-subtle">
                      <span>Response Rate:</span>
                      <span className="text-teal fw-semibold">98% / 10 mins</span>
                    </div>
                  </div>
                )}

                <div className="d-flex flex-column gap-2 mt-3">
                  <Button 
                    className="btn-booking-secondary py-2.5 fw-semibold d-flex align-items-center justify-content-center gap-2"
                    onClick={handleChatWithOwner}
                  >
                    <FiMessageSquare /> Send Chat Message
                  </Button>
                </div>
              </Card>

            </div>
          </Col>
        </Row>

        {/* SECTION 10: BOTTOM CALL TO ACTION */}
        <section className="mt-5 mb-4">
          <Card className="bottom-cta-banner border-0 p-5 text-center text-white">
            <h2 className="display-6 fw-bold mb-3">Ready to Visit This Property?</h2>
            <p className="text-white-50 mb-4 max-width-600 mx-auto">
              Schedule an in-person visit with our local representative in Salem or secure your reservation instantly via our secure co-living escrow ledger.
            </p>
            <div className="d-flex gap-3 justify-content-center flex-wrap">
              <Button 
                onClick={handleBookNow} 
                className="btn-confirm-booking px-5 py-3 fw-bold fs-5"
              >
                🏡 Book Now
              </Button>
              <Button 
                onClick={handleScheduleVisit} 
                className="btn-booking-secondary px-5 py-3 fw-bold fs-5"
                style={{ background: 'rgba(20, 184, 166, 0.25)', borderColor: '#14b8a6', color: '#fff' }}
              >
                📅 Schedule Visit
              </Button>
              <Button 
                onClick={handleSaveToggle} 
                className="btn-booking-action px-5 py-3 fw-semibold fs-5"
              >
                <FiHeart className={isSaved ? "fill-danger text-danger me-1" : "me-1"} />
                {isSaved ? "Saved" : "Save Property"}
              </Button>
            </div>
          </Card>
        </section>

      </Container>

      {/* LIGHTBOX FULLSCREEN GALLERY MODAL */}
      <Modal 
        show={isFullscreenGallery} 
        onHide={() => setIsFullscreenGallery(false)} 
        centered 
        size="lg"
        contentClassName="gallery-lightbox-modal-content"
      >
        <Modal.Header closeButton className="border-0 pb-0 text-white"></Modal.Header>
        <Modal.Body className="p-4 text-center">
          <div className="lightbox-hero-wrapper mb-4">
            <img src={galleryImages[activeImageIndex]} alt="lightbox active" className="lightbox-hero" />
          </div>
          <div className="d-flex gap-2 justify-content-center overflow-auto py-1">
            {galleryImages.map((img, idx) => (
              <div 
                key={idx} 
                className={`lightbox-thumb-item ${activeImageIndex === idx ? 'active' : ''}`}
                onClick={() => setActiveImageIndex(idx)}
              >
                <img src={img} alt={`lightbox thumb ${idx}`} />
              </div>
            ))}
          </div>
        </Modal.Body>
      </Modal>

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

      {/* TOAST SYSTEM */}
      <ToastContainer position="bottom-end" className="p-3 z-index-toast">
        <Toast onClose={() => setShowToast(false)} show={showToast} delay={3000} autohide className="glass-toast border-0 shadow">
          <Toast.Header className="glass-toast-header border-0 text-white">
            <strong className="me-auto d-flex align-items-center gap-2">💡 SplitNest System</strong>
          </Toast.Header>
          <Toast.Body className="glass-toast-body text-white">{toastMsg}</Toast.Body>
        </Toast>
      </ToastContainer>

    </div>
  );
}

export default PropertyDetails;
