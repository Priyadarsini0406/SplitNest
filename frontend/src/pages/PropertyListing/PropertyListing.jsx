import { useState, useMemo, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Badge, Dropdown, Pagination, Collapse, Modal, Tooltip, OverlayTrigger } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  FiHome,
  FiUsers,
  FiCompass,
  FiDollarSign,
  FiPlusCircle,
  FiBell,
  FiMessageSquare,
  FiSearch,
  // eslint-disable-next-line no-unused-vars
  FiUser,
  FiLogOut,
  FiSun,
  FiMoon,
  // eslint-disable-next-line no-unused-vars
  FiChevronDown,
  FiStar,
  // eslint-disable-next-line no-unused-vars
  FiTrendingUp,
  FiHeart,
  // eslint-disable-next-line no-unused-vars
  FiArrowRight,
  FiMenu,
  FiX,
  FiFilter,
  FiMapPin,
  // eslint-disable-next-line no-unused-vars
  FiCalendar,
  FiMic,
  // eslint-disable-next-line no-unused-vars
  FiInfo,
  // eslint-disable-next-line no-unused-vars
  FiShare2,
  // eslint-disable-next-line no-unused-vars
  FiCheckCircle,
  FiShield,
  FiGrid
} from 'react-icons/fi';
import './PropertyListing.css';

const API_ORIGIN =
  import.meta.env.VITE_API_ORIGIN ||
  `${window.location.protocol}//${window.location.hostname}:5000`;
const API_BASE_URL = `${API_ORIGIN}/api`;

const resolvePropertyImage = (image) => {
  if (!image) return 'https://placehold.co/900x650?text=SplitNest+Property';
  if (/^https?:\/\//i.test(image) || image.startsWith('data:image/')) return image;
  return `${API_ORIGIN}${image.startsWith('/') ? image : `/${image}`}`;
};

// Nearby locations list
const LOCATIONS = ["All", "Fairlands, Salem", "Five Roads, Salem", "Hasthampatti, Salem", "Alagapuram, Salem", "Meyyanur, Salem", "Suramangalam, Salem", "Gorimedu, Salem"];

// Lifestyle Vibe quick filter tags
const LIFESTYLE_TAGS = [
  { id: 'all', label: 'All Lifestyles', icon: '✨' },
  { id: 'studious', label: 'Studious & Quiet', icon: '📚' },
  { id: 'social', label: 'Social & Outgoing', icon: '🎉' },
  { id: 'clean', label: 'Cleanliness First', icon: '🧹' },
  { id: 'night', label: 'Night Owls', icon: '🦉' },
  { id: 'pet', label: 'Pet Lovers', icon: '🐾' }
];

// Complete 8 properties dataset
const PROPERTIES_DATA = [
  {
    id: 1,
    name: "Sri Sai Residency",
    location: "Fairlands, Salem",
    distance: "500m from Sona College",
    rent: 6500,
    deposit: 15000,
    propertyType: "Men's PG",
    roomType: "Double Sharing",
    availability: "Available Immediately",
    rating: 4.9,
    verified: true,
    matchScore: 96,
    image: "/property_1.png",
    vibe: "studious",
    amenities: ["WiFi", "AC", "Laundry", "Power Backup"],
    parking: true,
    pets: false,
    furnished: "Furnished",
    gender: "Male",
    flatmates: [
      { name: "Vijay D.", bio: "Sona Tech student, quiet" },
      { name: "Karthik M.", bio: "Professional, coffee lover" }
    ]
  },
  {
    id: 2,
    name: "Green Nest PG",
    location: "Hasthampatti, Salem",
    distance: "1.2 km from Government Arts College",
    rent: 4500,
    deposit: 10000,
    propertyType: "Women's PG",
    roomType: "Triple Sharing",
    availability: "Immediate",
    rating: 4.8,
    verified: true,
    matchScore: 89,
    image: "/property_2.png",
    vibe: "social",
    amenities: ["WiFi", "Laundry", "Power Backup"],
    parking: false,
    pets: false,
    furnished: "Semi-Furnished",
    gender: "Female",
    flatmates: [
      { name: "Priya K.", bio: "Arts student, friendly" }
    ]
  },
  {
    id: 3,
    name: "Royal Residency",
    location: "Alagapuram, Salem",
    distance: "1.5 km from Sona College",
    rent: 9000,
    deposit: 25000,
    propertyType: "Shared Apartment",
    roomType: "Private Room",
    availability: "Aug 15",
    rating: 4.7,
    verified: true,
    matchScore: 92,
    image: "/property_3.png",
    vibe: "clean",
    amenities: ["WiFi", "AC", "Power Backup", "Gym"],
    parking: true,
    pets: true,
    furnished: "Furnished",
    gender: "Any",
    flatmates: [], sharingOptions: ['double'], totalBeds: 1, availableBeds: 1
  },
  {
    id: 4,
    name: "Tulasi Homes",
    location: "Meyyanur, Salem",
    distance: "1.0 km from Salem New Bus Stand",
    rent: 7500,
    deposit: 20000,
    propertyType: "Independent House",
    roomType: "Private Room",
    availability: "Immediate",
    rating: 4.9,
    verified: true,
    matchScore: 95,
    image: "/property_1.png",
    vibe: "pet",
    amenities: ["WiFi", "AC", "Laundry", "Parking"],
    parking: true,
    pets: true,
    furnished: "Furnished",
    gender: "Any",
    flatmates: [
      { name: "Arun R.", bio: "Working professional, owns a cat" }
    ]
  },
  {
    id: 5,
    name: "Lake View Residency",
    location: "Gorimedu, Salem",
    distance: "1.8 km from Periyar University",
    rent: 5500,
    deposit: 12000,
    propertyType: "Student Hostel",
    roomType: "Double Sharing",
    availability: "Immediate",
    rating: 4.6,
    verified: false,
    matchScore: 84,
    image: "/property_2.png",
    vibe: "studious",
    amenities: ["WiFi", "Laundry"],
    parking: true,
    pets: false,
    furnished: "Unfurnished",
    gender: "Any",
    flatmates: [
      { name: "Suresh L.", bio: "Periyar Univ student" }
    ]
  },
  {
    id: 6,
    name: "Sona Student Residency",
    location: "Suramangalam, Salem",
    distance: "2.5 km from Salem Junction",
    rent: 6000,
    deposit: 15000,
    propertyType: "Student Hostel",
    roomType: "Single Sharing",
    availability: "Immediate",
    rating: 4.5,
    verified: true,
    matchScore: 91,
    image: "/property_3.png",
    vibe: "studious",
    amenities: ["WiFi", "Laundry"],
    parking: false,
    pets: false,
    furnished: "Semi-Furnished",
    gender: "Male",
    flatmates: [
      { name: "Dinesh T.", bio: "CS student, quiet" }
    ]
  },
  {
    id: 7,
    name: "Five Roads Residency",
    location: "Five Roads, Salem",
    distance: "500m from D Mart",
    rent: 11000,
    deposit: 30000,
    propertyType: "Shared Apartment",
    roomType: "Private Room",
    availability: "Immediate",
    rating: 4.9,
    verified: true,
    matchScore: 97,
    image: "/property_1.png",
    vibe: "clean",
    amenities: ["WiFi", "AC", "Laundry", "Gym", "Parking"],
    parking: true,
    pets: true,
    furnished: "Furnished",
    gender: "Any",
    flatmates: [
      { name: "Raja B.", bio: "Consultant at IT Park, clean" }
    ]
  },
  {
    id: 8,
    name: "Fairlands Elite Homes",
    location: "Fairlands, Salem",
    distance: "800m from Sona College",
    rent: 12000,
    deposit: 35000,
    propertyType: "Family House",
    roomType: "Private Room",
    availability: "Immediate",
    rating: 4.6,
    verified: true,
    matchScore: 88,
    image: "/property_2.png",
    vibe: "social",
    amenities: ["WiFi", "AC", "Laundry", "Power Backup"],
    parking: true,
    pets: false,
    furnished: "Semi-Furnished",
    gender: "Any",
    flatmates: [
      { name: "Madhavan M.", bio: "Engineer, friendly" }
    ]
  }
];

function PropertyListing() {
  const navigate = useNavigate();
  const { isLoggedIn, openAuthModal, pendingAction, clearPendingAction, logout, userRole } = useAuth();
  const [liveProperties, setLiveProperties] = useState([]);
  const featuredProperty = liveProperties[0] || null;

  // Layout & Theme states
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  

  useEffect(() => {
    fetch(`${API_BASE_URL}/public-properties`)
      .then(r => r.json().then(x => ({ ok: r.ok, x })))
      .then(({ok,x}) => {
        if (!ok) return;
        const mapped = (x.data || []).map(p => ({
          id: p._id, ownerId: p.ownerId, name: p.name, location: `${p.area}, Salem`,
          distance: 'Salem city', rent: Number(p.rent || 0), deposit: Number(p.deposit || 0),
          propertyType: p.type, roomType: p.type === 'Room' ? 'Private Room' : p.type,
          availability: 'Available', rating: 4.5, verified: true, matchScore: 85,
          image: resolvePropertyImage(p.image), vibe: 'clean',
          amenities: p.amenities || [], description: p.description || 'Owner-listed room available for booking.', parking: (p.amenities || []).includes('Parking'), pets: false,
          furnished: (p.amenities || []).includes('Furnished') ? 'Furnished' : 'Semi-Furnished', gender: 'Any', flatmates: [], sharingOptions: p.sharingOptions || ['double'], totalBeds: p.totalBeds || 1, availableBeds: p.availableBeds ?? p.totalBeds ?? 1
        }));
        setLiveProperties(mapped);
      })
      .catch(() => {});
  }, []);

    // Interactive Filters states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [selectedVibe, setSelectedVibe] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);

  // Advanced filters state
  const [filterMaxBudget, setFilterMaxBudget] = useState(15000);
  const [filterPropType, setFilterPropType] = useState('All');
  const [filterRoomType, setFilterRoomType] = useState('All');
  const [filterFurnishing, setFilterFurnishing] = useState('All');
  const [filterGender, setFilterGender] = useState('Any');
  const [filterMaxDistance, setFilterMaxDistance] = useState(4);
  const [filterParking, setFilterParking] = useState(false);
  const [filterPets, setFilterPets] = useState(false);
  const [filterAmenities, setFilterAmenities] = useState([]);

  // Wishlist/Favorites
  const [favorites, setFavorites] = useState([1, 4, 7]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const propertiesPerPage = 6;

  // Interactive rent split modal (creative elements)
  const [selectedSplitProp, setSelectedSplitProp] = useState(null);
  const [customSplitPeople, setCustomSplitPeople] = useState(3);
  const [electricityShare, setElectricityShare] = useState(1500);
  // eslint-disable-next-line no-unused-vars
  const [wifiShare, setWifiShare] = useState(500);

  // Toast systems
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setShowToast(true);
    window.clearTimeout(window.__splitNestToastTimer);
    window.__splitNestToastTimer = window.setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  // Toggle favorites
  const toggleFavorite = (id) => {
    if (!isLoggedIn) {
      openAuthModal({ action: 'favorite', propertyId: id, path: '/properties' });
      return;
    }
    if (favorites.includes(id)) {
      setFavorites(favorites.filter(fav => fav !== id));
      triggerToast("Removed property from saved wishlist.");
    } else {
      setFavorites([...favorites, id]);
      triggerToast("💖 Added to saved wishlist!");
    }
  };

  const handleCompareClick = (id) => {
    if (!isLoggedIn) {
      openAuthModal({ action: 'compare', propertyId: id, path: '/properties' });
    } else {
      triggerToast("💖 Property added to comparison list!");
    }
  };

  const handleBookNow = (prop) => {
    if (userRole === 'owner') { triggerToast('Owners create/manage rooms. Booking is available for user accounts.'); return; }
    if (!isLoggedIn) {
      openAuthModal({ action: 'book', propertyId: prop.id, path: `/book/${prop.id}` });
    } else {
      navigate(`/book/${prop.id}`);
    }
  };

  // Resume actions after redirect back from login
  useEffect(() => {
    if (isLoggedIn && pendingAction) {
      if (pendingAction.action === 'favorite' && pendingAction.path === '/properties') {
        const { propertyId } = pendingAction;
        if (!favorites.includes(propertyId)) {
          setFavorites(prev => [...prev, propertyId]);
          triggerToast("💖 Added to saved wishlist!");
        }
        clearPendingAction();
      } else if (pendingAction.action === 'compare' && pendingAction.path === '/properties') {
        triggerToast("💖 Property added to comparison list!");
        clearPendingAction();
      }
    }
  }, [isLoggedIn, pendingAction, clearPendingAction, favorites]);

  // Reset advanced filters
  const handleResetFilters = () => {
    setFilterMaxBudget(1500);
    setFilterPropType('All');
    setFilterRoomType('All');
    setFilterFurnishing('All');
    setFilterGender('Any');
    setFilterMaxDistance(4);
    setFilterParking(false);
    setFilterPets(false);
    setFilterAmenities([]);
    setSelectedLocation('All');
    setSelectedVibe('all');
    setSearchQuery('');
    triggerToast("Filters successfully reset.");
  };

  // Handle amenities checkbox selection
  const handleAmenityCheck = (amenity) => {
    if (filterAmenities.includes(amenity)) {
      setFilterAmenities(filterAmenities.filter(a => a !== amenity));
    } else {
      setFilterAmenities([...filterAmenities, amenity]);
    }
  };

  // Filter and Sort properties
  const processedProperties = useMemo(() => {
    let result = [...liveProperties];

    // 1. Search Query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.location.toLowerCase().includes(query) ||
        p.propertyType.toLowerCase().includes(query) ||
        p.roomType.toLowerCase().includes(query)
      );
    }

    // 2. City Location Chips filter
    if (selectedLocation !== 'All') {
      const city = selectedLocation.split(',')[0];
      result = result.filter(p => p.location.includes(city));
    }

    // 3. Vibe Tags filter
    if (selectedVibe !== 'all') {
      result = result.filter(p => p.vibe === selectedVibe);
    }

    // 4. Budget filter
    result = result.filter(p => p.rent <= filterMaxBudget);

    // 5. Property Type filter
    if (filterPropType !== 'All') {
      result = result.filter(p => p.propertyType === filterPropType);
    }

    // 6. Room Type filter
    if (filterRoomType !== 'All') {
      result = result.filter(p => p.roomType === filterRoomType);
    }

    // 7. Furnishing filter
    if (filterFurnishing !== 'All') {
      result = result.filter(p => p.furnished === filterFurnishing);
    }

    // 8. Gender Preference filter
    if (filterGender !== 'Any') {
      result = result.filter(p => p.gender === 'Any' || p.gender === filterGender);
    }

    // 9. Distance filter (parsing distance float)
    result = result.filter(p => {
      const distVal = parseFloat(p.distance);
      return isNaN(distVal) || distVal <= filterMaxDistance;
    });

    // 10. Parking & Pets filter
    if (filterParking) result = result.filter(p => p.parking === true);
    if (filterPets) result = result.filter(p => p.pets === true);

    // 11. Custom amenities selection
    if (filterAmenities.length > 0) {
      result = result.filter(p =>
        filterAmenities.every(a => p.amenities.includes(a))
      );
    }

    // Sorting Logic
    if (sortBy === 'lowest-price') {
      result.sort((a, b) => a.rent - b.rent);
    } else if (sortBy === 'highest-rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'nearest') {
      result.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
    } else {
      // Default: newest (by ID reversed)
      result.sort((a, b) => b.id - a.id);
    }

    return result;
  }, [liveProperties, searchQuery, selectedLocation, selectedVibe, filterPropType, filterRoomType, filterFurnishing, filterGender, filterParking, filterPets, filterAmenities, sortBy, filterMaxBudget, filterMaxDistance]);

  // Paginated properties slice
  const paginatedProperties = useMemo(() => {
    const startIndex = (currentPage - 1) * propertiesPerPage;
    return processedProperties.slice(startIndex, startIndex + propertiesPerPage);
  }, [processedProperties, currentPage]);

  const totalPages = Math.ceil(processedProperties.length / propertiesPerPage);

  // Trigger page change
  const handlePageChange = (pageNo) => {
    setCurrentPage(pageNo);
    window.scrollTo({ top: 350, behavior: 'smooth' });
  };

  // Reset pagination if filtered list changes
  useEffect(() => {
    setCurrentPage(1);
  }, [processedProperties.length]);

  return (
    <>
        <Container fluid className="px-4 py-4 main-content-container animate-fade-in">
          
          {/* 1. PAGE HEADER */}
          <div className="page-heading-block mb-4 glass-card p-4 d-flex justify-content-between align-items-center">
            <div className="header-text">
              <h1 className="display-6 fw-bold m-0 text-dark-heading">🏡 Explore Properties</h1>
              <p className="text-muted m-0 mt-1">Find verified homes that match your lifestyle and budget.</p>
            </div>
            <div className="header-badge-count d-none d-sm-block">
              <Badge bg="primary" className="p-2 fs-6">{processedProperties.length} Properties Matching</Badge>
            </div>
          </div>

          {/* OWNER-LISTED FEATURED PROPERTY */}
          {featuredProperty && (
          <Card className="featured-banner-card glass-card border-0 mb-4 p-0 overflow-hidden">
            <Row className="g-0">
              <Col lg={6} className="featured-img-col position-relative">
                <img src={featuredProperty.image} alt={featuredProperty.name} className="featured-banner-img" />
                <Badge bg="danger" className="featured-badge">FEATURED PROPERTY</Badge>
                <div className="featured-compatibility-badge">
                  <FiUsers className="me-1" /> {featuredProperty.matchScore}% Match Score
                </div>
              </Col>
              <Col lg={6} className="d-flex flex-column justify-content-between p-4">
                <div>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="text-muted small"><FiMapPin /> {featuredProperty.location} • {featuredProperty.distance}</span>
                    <span className="property-card-rating">
                      <FiStar className="star-icon" /> {featuredProperty.rating}
                    </span>
                  </div>
                  <h3 className="featured-title fw-bold text-dark-heading mb-2">{featuredProperty.name}</h3>
                  <p className="featured-desc text-muted mb-3">{featuredProperty.description}</p>
                  
                  <div className="featured-amenities mb-4">
                    {featuredProperty.amenities.slice(0, 4).map((a, i) => (
                      <span key={i} className="featured-amenity-tag">{a}</span>
                    ))}
                  </div>
                </div>

                <div className="featured-footer border-top pt-3 d-flex justify-content-between align-items-center">
                  <div className="featured-price">
                    <span className="rent-lbl small text-muted d-block">Monthly rent:</span>
                    <span className="rent-val fs-4 fw-bold text-primary">₹{featuredProperty.rent} <small className="fs-6 text-muted">/mo</small></span>
                  </div>
                  <div className="featured-actions d-flex gap-2">
                    <Button 
                      variant="outline-primary"
                      onClick={() => setSelectedSplitProp(featuredProperty)}
                    >
                      Split Calculator
                    </Button>
                    <Button 
                      className="btn-book-action"
                      onClick={() => handleBookNow(featuredProperty)}
                    >
                      Book Now
                    </Button>
                  </div>
                </div>
              </Col>
            </Row>
          </Card>
          )}

          {!featuredProperty && (
            <Card className="glass-card border-0 mb-4 p-5 text-center">
              <h4 className="text-dark-heading">No owner properties available</h4>
              <p className="text-muted mb-0">An owner must add and activate a property before users can book it.</p>
            </Card>
          )}

          {/* LIFESTYLE QUICK MATCH VIBE SELECTOR (Creative Special UI element) */}
          <div className="vibe-selector-card glass-card p-3 mb-4">
            <h6 className="vibe-section-title mb-2 text-muted uppercase small font-secondary">✨ Filter Roommate Lifestyles:</h6>
            <div className="vibe-tags-row d-flex gap-2 overflow-auto py-1">
              {LIFESTYLE_TAGS.map((tag) => (
                <button
                  key={tag.id}
                  className={`vibe-chip-btn ${selectedVibe === tag.id ? 'active' : ''}`}
                  onClick={() => setSelectedVibe(tag.id)}
                >
                  <span className="vibe-icon">{tag.icon}</span>
                  <span className="vibe-label">{tag.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* SEARCH, SORTING & COLLAPSIBLE FILTERS TRIGGER */}
          <div className="search-filter-wrapper mb-4">
            <Row className="g-3">
              <Col lg={7} md={12}>
                {/* 2. SEARCH BAR */}
                <div className="main-search-bar glass-card p-2 d-flex align-items-center">
                  <FiSearch className="search-box-icon text-muted ms-2" />
                  <input 
                    type="text" 
                    placeholder="Search by city, locality, college, company or landmark..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-box-input flex-grow-1"
                  />
                  <button className="voice-mic-btn-ui" title="Voice Search (UI Demonstration)" onClick={() => triggerToast("Listening (Simulation Mode Only)")}>
                    <FiMic />
                  </button>
                  {searchQuery && (
                    <button className="search-box-clear" onClick={() => setSearchQuery('')}>
                      <FiX />
                    </button>
                  )}
                </div>
              </Col>

              <Col lg={3} md={6} xs={12}>
                {/* 5. SORTING */}
                <div className="sorting-selector-block glass-card p-2 h-100 d-flex align-items-center justify-content-between">
                  <span className="text-muted small ms-1">Sort:</span>
                  <Form.Select 
                    value={sortBy} 
                    onChange={(e) => setSortBy(e.target.value)}
                    className="sort-dropdown-custom"
                  >
                    <option value="newest">Newest Listed</option>
                    <option value="lowest-price">Lowest Price</option>
                    <option value="highest-rating">Highest Rating</option>
                    <option value="nearest">Nearest to Campus</option>
                  </Form.Select>
                </div>
              </Col>

              <Col lg={2} md={6} xs={12}>
                <Button 
                  onClick={() => setShowFilters(!showFilters)} 
                  aria-expanded={showFilters}
                  className="filter-toggle-btn w-100 h-100 py-3"
                >
                  <FiFilter className="me-2" />
                  {showFilters ? 'Hide Filters' : 'Show Filters'}
                </Button>
              </Col>
            </Row>
          </div>

          {/* 3. FILTER PANEL */}
          <Collapse in={showFilters}>
            <div className="mb-4">
              <Card className="filter-panel-card glass-card p-4 border-0">
                <h5 className="filter-panel-title mb-4 fw-bold text-dark-heading">🔍 Refine Property Options</h5>
                <Row className="g-3">
                  
                  {/* Budget Slider */}
                  <Col md={3} sm={6}>
                    <Form.Group>
                      <Form.Label className="filter-label text-muted d-flex justify-content-between">
                        <span>Max Budget</span>
                        <span className="fw-semibold text-primary">${filterMaxBudget}</span>
                      </Form.Label>
                      <Form.Range 
                        min="3000" 
                        max="15000" 
                        step="500" 
                        value={filterMaxBudget}
                        onChange={(e) => setFilterMaxBudget(Number(e.target.value))}
                        className="custom-range-slider"
                      />
                      <div className="d-flex justify-content-between text-muted small mt-1">
                        <span>₹3,000</span>
                        <span>₹15,000</span>
                      </div>
                    </Form.Group>
                  </Col>

                  {/* Property Type */}
                  <Col md={3} sm={6}>
                    <Form.Group>
                      <Form.Label className="filter-label text-muted">Property Type</Form.Label>
                      <Form.Select 
                        value={filterPropType} 
                        onChange={(e) => setFilterPropType(e.target.value)}
                        className="filter-select"
                      >
                        <option value="All">All Types</option>
                        <option value="Apartment">Apartment</option>
                        <option value="House">House</option>
                        <option value="Villa">Villa</option>
                        <option value="Studio">Studio</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  {/* Room Type */}
                  <Col md={3} sm={6}>
                    <Form.Group>
                      <Form.Label className="filter-label text-muted">Room Type</Form.Label>
                      <Form.Select 
                        value={filterRoomType} 
                        onChange={(e) => setFilterRoomType(e.target.value)}
                        className="filter-select"
                      >
                        <option value="All">All Rooms</option>
                        <option value="Private Room">Private Room</option>
                        <option value="Shared Room">Shared Room</option>
                        <option value="Entire Flat">Entire Flat</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  {/* Furnishing */}
                  <Col md={3} sm={6}>
                    <Form.Group>
                      <Form.Label className="filter-label text-muted">Furnishing</Form.Label>
                      <Form.Select 
                        value={filterFurnishing} 
                        onChange={(e) => setFilterFurnishing(e.target.value)}
                        className="filter-select"
                      >
                        <option value="All">All Options</option>
                        <option value="Furnished">Fully Furnished</option>
                        <option value="Semi-Furnished">Semi-Furnished</option>
                        <option value="Unfurnished">Unfurnished</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  {/* Gender Preference */}
                  <Col md={3} sm={6}>
                    <Form.Group>
                      <Form.Label className="filter-label text-muted">Roommate Gender</Form.Label>
                      <Form.Select 
                        value={filterGender} 
                        onChange={(e) => setFilterGender(e.target.value)}
                        className="filter-select"
                      >
                        <option value="Any">Co-ed / Any</option>
                        <option value="Male">Male Flat Only</option>
                        <option value="Female">Female Flat Only</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  {/* Distance Slider */}
                  <Col md={3} sm={6}>
                    <Form.Group>
                      <Form.Label className="filter-label text-muted d-flex justify-content-between">
                        <span>Max Campus Distance</span>
                        <span className="fw-semibold text-primary">{filterMaxDistance} km</span>
                      </Form.Label>
                      <Form.Range 
                        min="1" 
                        max="5" 
                        step="0.5" 
                        value={filterMaxDistance}
                        onChange={(e) => setFilterMaxDistance(Number(e.target.value))}
                        className="custom-range-slider"
                      />
                      <div className="d-flex justify-content-between text-muted small mt-1">
                        <span>1 km</span>
                        <span>5 km</span>
                      </div>
                    </Form.Group>
                  </Col>

                  {/* Date Picker */}
                  <Col md={3} sm={6}>
                    <Form.Group>
                      <Form.Label className="filter-label text-muted">Available From</Form.Label>
                      <Form.Control type="date" className="filter-date-input" />
                    </Form.Group>
                  </Col>

                  {/* Parking & Pets */}
                  <Col md={3} sm={6} className="d-flex flex-column justify-content-center">
                    <Form.Check 
                      type="switch" 
                      id="filter-parking-switch" 
                      label="Parking Space Required" 
                      checked={filterParking}
                      onChange={(e) => setFilterParking(e.target.checked)}
                      className="filter-switch mb-2"
                    />
                    <Form.Check 
                      type="switch" 
                      id="filter-pets-switch" 
                      label="Pet Friendly Flats Only" 
                      checked={filterPets}
                      onChange={(e) => setFilterPets(e.target.checked)}
                      className="filter-switch"
                    />
                  </Col>
                </Row>

                {/* Custom Amenities selection */}
                <div className="amenities-selection-block mt-4 border-top pt-3">
                  <h6 className="small fw-semibold text-muted mb-3">Amenities Required:</h6>
                  <div className="d-flex flex-wrap gap-3">
                    {["WiFi", "AC", "Gym", "Laundry", "Power Backup", "Balcony"].map((amenity) => (
                      <Form.Check
                        key={amenity}
                        type="checkbox"
                        id={`amenity-check-${amenity}`}
                        label={amenity}
                        checked={filterAmenities.includes(amenity)}
                        onChange={() => handleAmenityCheck(amenity)}
                        className="amenity-checkbox"
                      />
                    ))}
                  </div>
                </div>

                <div className="filter-footer-actions d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
                  <Button variant="outline-danger" onClick={handleResetFilters}>
                    Reset Filters
                  </Button>
                  <Button 
                    className="btn-apply-filters"
                    onClick={() => {
                      setShowFilters(false);
                      triggerToast("Applied custom search filters.");
                    }}
                  >
                    Apply Filters
                  </Button>
                </div>
              </Card>
            </div>
          </Collapse>

          {/* 7. NEARBY LOCATIONS scrolling list */}
          <div className="nearby-locations-wrapper mb-4">
            <h6 className="location-title text-muted mb-2 uppercase small font-secondary">📍 Quick Location Filter:</h6>
            <div className="location-scroller d-flex gap-2 py-1 overflow-auto">
              {LOCATIONS.map((loc) => (
                <button
                  key={loc}
                  className={`location-chip ${selectedLocation === loc ? 'active' : ''}`}
                  onClick={() => setSelectedLocation(loc)}
                >
                  <FiMapPin className="me-1" />
                  {loc}
                </button>
              ))}
            </div>
          </div>

          {/* 4. PROPERTY CARDS GRID */}
          <Row className="g-4 mb-4">
            {paginatedProperties.length > 0 ? (
              paginatedProperties.map((prop) => (
                <Col xl={4} lg={6} md={6} key={prop.id}>
                  <Card className="property-premium-card glass-card border-0 h-100 overflow-hidden d-flex flex-column justify-content-between">
                    
                    {/* Image Block */}
                    <div className="property-img-holder position-relative">
                      <img 
                        src={prop.image} 
                        alt={prop.name} 
                        className="property-grid-img" 
                        onClick={() => navigate(`/property-details/${prop.id}`)}
                        style={{ cursor: 'pointer' }}
                      />
                      
                      {/* Top float elements */}
                      <div className="card-badge-row position-absolute top-0 w-100 p-3 d-flex justify-content-between align-items-center">
                        <div>
                          {prop.verified && (
                            <Badge bg="success" className="verified-badge-custom d-inline-flex align-items-center gap-1">
                              <FiShield /> Verified
                            </Badge>
                          )}
                        </div>
                        <div className="d-flex gap-2">
                          <button 
                            className="btn-glass-icon"
                            onClick={() => handleCompareClick(prop.id)}
                            style={{
                              background: 'rgba(30, 27, 75, 0.45)',
                              border: '1px solid rgba(255, 255, 255, 0.1)',
                              color: '#fff',
                              borderRadius: '50%',
                              width: '36px',
                              height: '36px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              backdropFilter: 'blur(8px)',
                              transition: 'all 0.2s ease',
                              padding: 0
                            }}
                            title="Compare Property"
                          >
                            <FiGrid />
                          </button>
                          <button 
                            className={`card-fav-heart-btn ${favorites.includes(prop.id) ? 'active' : ''}`}
                            onClick={() => toggleFavorite(prop.id)}
                          >
                            <FiHeart />
                          </button>
                        </div>
                      </div>

                      {/* Bottom float elements */}
                      <div className="card-info-floats position-absolute bottom-0 w-100 p-3 d-flex justify-content-between align-items-end">
                        <Badge bg="light" text="dark" className="room-type-float-tag">{prop.roomType}</Badge>
                        
                        {/* Unique Compatibility Badge */}
                        <div className="roommate-compat-score-badge">
                          👥 {prop.matchScore}% Match
                        </div>
                      </div>
                    </div>

                    {/* Content Block */}
                    <Card.Body className="p-3">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <div>
                          <span className="prop-city-loc text-muted small"><FiMapPin /> {prop.location}</span>
                          <h5 
                            className="prop-card-title fw-bold text-dark-heading m-0 mt-1"
                            onClick={() => navigate(`/property-details/${prop.id}`)}
                            style={{ cursor: 'pointer' }}
                          >
                            {prop.name}
                          </h5>
                        </div>
                        <span className="prop-rating-tag">
                          <FiStar className="star-icon" /> {prop.rating}
                        </span>
                      </div>

                      <p className="prop-dist-label text-muted small mb-3">{prop.distance}</p>

                      <div className="prop-finance-row d-flex justify-content-between align-items-center border-bottom pb-3 mb-3">
                        <div className="finance-col">
                          <span className="lbl text-muted small d-block">Monthly Rent:</span>
                          <span className="val fw-bold text-primary">₹{prop.rent}<small className="text-muted small">/mo</small></span>
                        </div>
                        <div className="finance-col text-end">
                          <span className="lbl text-muted small d-block">Security Deposit:</span>
                          <span className="val fw-semibold text-dark">₹{prop.deposit}</span>
                        </div>
                      </div>

                      {/* Flatmate Quick Bios details */}
                      <div className="flatmates-preview-area mb-3">
                        <span className="text-muted small d-block mb-1">Existing Flatmates:</span>
                        <div className="d-flex gap-1 align-items-center">
                          {prop.flatmates.length > 0 ? (
                            prop.flatmates.map((fm, i) => (
                              <OverlayTrigger
                                key={i}
                                placement="top"
                                overlay={<Tooltip id={`tooltip-fm-${prop.id}-${i}`}>{fm.bio}</Tooltip>}
                              >
                                <div className="flatmate-circle-badge font-secondary">
                                  {fm.name.charAt(0)}
                                </div>
                              </OverlayTrigger>
                            ))
                          ) : (
                            <span className="text-muted small italic">Vacant (no roommates yet)</span>
                          )}
                          <span className="text-muted small ms-auto fw-medium text-capitalize">{prop.vibe} group</span>
                        </div>
                      </div>
                    </Card.Body>

                    {/* Action Block */}
                    <Card.Footer className="bg-transparent border-0 p-3 pt-0 d-flex gap-2">
                      <Button 
                        variant="outline-primary"
                        className="btn-details w-50"
                        onClick={() => setSelectedSplitProp(prop)}
                      >
                        Split Info
                      </Button>
                      <Button 
                        className="btn-book-action w-50"
                        onClick={() => handleBookNow(prop)}
                      >
                        Book Now
                      </Button>
                    </Card.Footer>

                  </Card>
                </Col>
              ))
            ) : (
              <Col xs={12}>
                <div className="text-center py-5 glass-card">
                  <h4 className="text-muted mb-2">No matching properties found</h4>
                  <p className="text-muted">Adjust filters, clear search terms, or try another location chip.</p>
                  <Button variant="outline-primary" onClick={handleResetFilters}>Clear Filters</Button>
                </div>
              </Col>
            )}
          </Row>

          {/* 8. PAGINATION */}
          {totalPages > 1 && (
            <div className="d-flex justify-content-center mt-5">
              <Pagination className="rounded-pagination">
                <Pagination.Prev 
                  disabled={currentPage === 1} 
                  onClick={() => handlePageChange(currentPage - 1)}
                />
                {Array.from({ length: totalPages }).map((_, index) => (
                  <Pagination.Item
                    key={index + 1}
                    active={currentPage === index + 1}
                    onClick={() => handlePageChange(index + 1)}
                  >
                    {index + 1}
                  </Pagination.Item>
                ))}
                <Pagination.Next 
                  disabled={currentPage === totalPages} 
                  onClick={() => handlePageChange(currentPage + 1)}
                />
              </Pagination>
            </div>
          )}

        </Container>

        {/* TOAST SYSTEM */}
        <Modal 
          show={showToast} 
          onHide={() => setShowToast(false)}
          size="sm"
          centered
          className="system-toast-modal"
          backdrop={false}
        >
          <div className="toast-modal-body p-3 text-center">
            <span className="fw-semibold text-white">💡 {toastMsg}</span>
          </div>
        </Modal>

        {/* CREATIVE POPUP: RENT SPLIT CALCULATOR FOR SPECIFIC PROPERTY */}
        <Modal 
          show={selectedSplitProp !== null} 
          onHide={() => setSelectedSplitProp(null)}
          centered
          className="glass-modal-rent-split"
        >
          {selectedSplitProp && (
            <>
              <Modal.Header closeButton className="border-0">
                <Modal.Title className="fw-bold font-heading text-dark-heading">
                  📊 Rent Split Breakdown - {selectedSplitProp.name}
                </Modal.Title>
              </Modal.Header>
              <Modal.Body className="px-4 pb-4">
                <p className="text-muted small mb-3">Calculate estimated sharing shares between roommates including variables.</p>
                
                <div className="invoice-sim-block p-3 rounded mb-3">
                  <div className="d-flex justify-content-between mb-1">
                    <span>Base Rent:</span>
                    <span className="fw-semibold">₹{selectedSplitProp.rent}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-1">
                    <span>Electricity / Power Shared:</span>
                    <span className="fw-semibold">₹{electricityShare}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-1">
                    <span>WiFi / Broadband Shared:</span>
                    <span className="fw-semibold">₹{wifiShare}</span>
                  </div>
                  <div className="d-flex justify-content-between border-top pt-2 mt-2 fw-bold text-primary">
                    <span>Total Monthly:</span>
                    <span>₹{selectedSplitProp.rent + electricityShare + wifiShare}</span>
                  </div>
                </div>

                <Form.Group className="mb-3">
                  <Form.Label className="text-muted small d-flex justify-content-between">
                    <span>Flatmates Split Size:</span>
                    <span className="fw-bold">{customSplitPeople} people</span>
                  </Form.Label>
                  <Form.Range 
                    min="1" 
                    max="6" 
                    value={customSplitPeople}
                    onChange={(e) => setCustomSplitPeople(Number(e.target.value))}
                    className="custom-range-slider"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="text-muted small">Estimated Electricity bill total (₹)</Form.Label>
                  <Form.Control 
                    type="number" 
                    value={electricityShare} 
                    onChange={(e) => setElectricityShare(Number(e.target.value))}
                    className="sim-input"
                  />
                </Form.Group>

                <div className="per-person-result p-3 text-center rounded mb-4">
                  <span className="text-muted small d-block">Estimated Share per flatmate:</span>
                  <h2 className="display-6 fw-bold text-teal m-0 mt-1">
                    ₹{((selectedSplitProp.rent + electricityShare + wifiShare) / customSplitPeople).toFixed(2)}
                  </h2>
                </div>

                <div className="d-flex gap-2">
                  <Button variant="outline-primary" className="w-50" onClick={() => setSelectedSplitProp(null)}>
                    Close
                  </Button>
                  <Button 
                    className="btn-apply-filters w-50" 
                    onClick={() => {
                      const perPerson = ((selectedSplitProp.rent + electricityShare + wifiShare) / customSplitPeople).toFixed(2);
                      localStorage.setItem(
                        'splitnest_last_split',
                        JSON.stringify({
                          propertyId: selectedSplitProp.id,
                          propertyName: selectedSplitProp.name,
                          people: customSplitPeople,
                          electricity: electricityShare,
                          wifi: wifiShare,
                          perPerson,
                          savedAt: new Date().toISOString(),
                        })
                      );
                      setSelectedSplitProp(null);
                      window.setTimeout(() => {
                        triggerToast(`Cost split saved: ₹${perPerson} per person.`);
                      }, 150);
                    }}
                  >
                    Sync to Group
                  </Button>
                </div>
              </Modal.Body>
            </>
          )}
        </Modal>

    </>
  );
}

export default PropertyListing;