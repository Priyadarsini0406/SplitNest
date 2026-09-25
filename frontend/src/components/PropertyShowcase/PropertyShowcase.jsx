import { useState, useEffect } from 'react';
import { Container, Row, Col, Badge } from 'react-bootstrap';
import { 
  FiMapPin, 
  FiHeart, 
  FiStar, 
  FiHome,
  FiArrowRight
} from 'react-icons/fi';
import './PropertyShowcase.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { PROPERTIES_DATA } from '../../data/properties';

function SplitNestPropertyShowcase() {
  const navigate = useNavigate();
  const { isLoggedIn, openAuthModal, pendingAction, clearPendingAction } = useAuth();
  
  // Showcase properties (first 6 items)
  const properties = PROPERTIES_DATA.slice(0, 6);

  // Working interactive favorites state
  const [favorites, setFavorites] = useState({});

  // Auto-favorite when arriving back from login
  useEffect(() => {
    if (isLoggedIn && pendingAction && pendingAction.action === 'favorite') {
      const { propertyId } = pendingAction;
      setFavorites(prev => ({
        ...prev,
        [propertyId]: true
      }));
      clearPendingAction();
    }
  }, [isLoggedIn, pendingAction, clearPendingAction]);

  const toggleFavorite = (id) => {
    if (!isLoggedIn) {
      openAuthModal({ action: 'favorite', propertyId: id, path: '/' });
      return;
    }
    setFavorites(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleBookNow = (prop) => {
    if (!isLoggedIn) {
      openAuthModal({ action: 'book', propertyId: prop.id, path: `/book/${prop.id}` });
    } else {
      navigate(`/book/${prop.id}`);
    }
  };

  const handleViewDetails = (id) => {
    navigate(`/property-details/${id}`);
  };

  return (
    <section id="properties" className="property-section">
      {/* Background radial soft glows */}
      <div className="prop-glow-1"></div>
      <div className="prop-glow-2"></div>

      <Container>
        {/* Header Block */}
        <div className="property-header text-center animate-fade-up">
          <div className="prop-tag">Featured listings</div>
          <h2 className="prop-title">
            Vetted spaces for <span className="title-gradient">modern roommates</span>
          </h2>
          <p className="prop-subtitle">
            Explore beautiful properties equipped with smart locks, shared lounges, and split ledger facilities.
          </p>
        </div>

        {/* Properties Grid */}
        <Row className="g-4 property-grid">
          {properties.map((prop, idx) => (
            <Col key={prop.id} sm={12} md={6} lg={4} className="d-flex">
              <div className={`property-card animate-fade-up delay-${(idx % 3) + 1}`}>
                
                {/* Image Wrapper */}
                <div className="property-image-wrapper">
                  <img 
                    src={prop.image} 
                    alt={prop.title} 
                    className="property-image"
                    onClick={() => handleViewDetails(prop.id)}
                    style={{ cursor: 'pointer' }}
                  />
                  {/* Status Badge */}
                  <Badge 
                    className={`property-status-badge badge-${prop.statusType}`}
                  >
                    <span className="badge-dot"></span>
                    {prop.status}
                  </Badge>

                  {/* Favorite Button */}
                  <button 
                    className={`property-fav-btn ${favorites[prop.id] ? 'favorited' : ''}`}
                    onClick={() => toggleFavorite(prop.id)}
                    aria-label="Add to favorites"
                  >
                    <FiHeart className="fav-icon" />
                  </button>

                  {/* Property Type Floating Badge */}
                  <div className="property-type-tag">
                    <FiHome style={{ marginRight: '4px' }} /> {prop.type}
                  </div>
                </div>

                {/* Card Content body */}
                <div className="property-card-body d-flex flex-column justify-content-between">
                  <div>
                    {/* Rating Block */}
                    <div className="property-rating">
                      <FiStar className="star-icon" />
                      <span className="rating-val">{prop.rating}</span>
                      <span className="reviews-count">({prop.reviews} reviews)</span>
                    </div>

                    {/* Title & Location */}
                    <h3 
                      className="property-card-title"
                      onClick={() => handleViewDetails(prop.id)}
                      style={{ cursor: 'pointer' }}
                    >
                      {prop.title}
                    </h3>
                    <div className="property-location">
                      <FiMapPin className="location-icon" />
                      <span>{prop.location}</span>
                    </div>

                    {/* View Details Link */}
                    <div className="mt-2 text-start">
                      <span 
                        className="text-teal fw-semibold view-details-link-action" 
                        style={{ cursor: 'pointer', fontSize: '0.9rem', color: '#14b8a6' }}
                        onClick={() => handleViewDetails(prop.id)}
                      >
                        View Details &rarr;
                      </span>
                    </div>
                  </div>

                  {/* Footer Area: Price & Action */}
                  <div className="property-card-footer mt-3">
                    <div className="price-box">
                      <span className="price-value">{prop.price}</span>
                      <span className="price-label">/ room / mo</span>
                    </div>
                    <button 
                      className="btn-book-now"
                      onClick={() => handleBookNow(prop)}
                    >
                      Book Now <FiArrowRight className="book-arrow" />
                    </button>
                  </div>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
}

export default SplitNestPropertyShowcase;
