import { useMemo, useState } from "react";

import {
  Container,
  Row,
  Col,
  Card,
  ProgressBar,
  Badge,
  Button,
  Form,
  Toast,
  ToastContainer,
} from "react-bootstrap";

import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import {
  FiCompass,
  FiDollarSign,
  FiPlusCircle,
  FiCalendar,
  FiInfo,
  // eslint-disable-next-line no-unused-vars
  FiClock,
  FiStar,
  FiTrendingUp,
  FiHeart,
  FiArrowRight,
  FiRefreshCw,
  FiUsers,
  FiSearch,
} from "react-icons/fi";

import "./UserDashboard.css";

const SAMPLE_TIPS = [
  "Split utility bills immediately after payment to avoid confusion.",
  "Label shared fridge items or keep a designated shelf for each roommate.",
  "Agree on a chore chart early on to keep common areas clean and stress-free.",
  "Keep a digital log of all payments and upload receipts to prevent disputes.",
  "Establish quiet hours for weeknights to respect everyone's sleep schedules.",
  "Discuss guest policies and hosting overnight friends in advance.",
  "Buy bulk household supplies like toilet paper and dish soap collectively.",
  "Set up automatic monthly rent reminders or auto-pay to build a perfect Home Score.",
  "Have a monthly check-in chat to resolve roommate issues before they escalate.",
  "Install energy-saving bulbs and turn off appliances when leaving to lower utility costs."
];

const SAMPLE_QUOTES = [
  "Home isn't a place. It's the people you share it with.",
  "The strength of a home is in its connection, not just its walls.",
  "Shared living is less about sharing space and more about sharing moments.",
  "A clean home is a happy home, but a cooperative home is a peaceful one.",
  "Cooperation makes the dream work, especially in a shared home.",
  "Home is where our stories begin and our friendships grow.",
  "Great flatmates make a house feel like home."
];

const SAMPLE_PROPERTIES = [
  {
    id: 1,
    name: "Sri Sai Residency",
    location: "Fairlands, Salem",
    rent: 6500,
    availability: "Immediate",
    rating: 4.8,
    image: "/property_1.png",
    tag: "Trending"
  },
  {
    id: 2,
    name: "Green Nest PG",
    location: "Meyyanur, Salem",
    rent: 4500,
    availability: "Immediate",
    rating: 4.9,
    image: "/property_2.png",
    tag: "Top Rated"
  },
  {
    id: 3,
    name: "Royal Residency",
    location: "Hasthampatti, Salem",
    rent: 8000,
    availability: "Immediate",
    rating: 4.7,
    image: "/property_3.png",
    tag: "Popular"
  }
];

function UserDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [searchQuery, setSearchQuery] = useState("");

  const [currentTipIndex, setCurrentTipIndex] =
    useState(0);

  const [currentQuoteIndex, setCurrentQuoteIndex] =
    useState(0);

  const [profileProgress, setProfileProgress] =
    useState(80);

  const [profileCompleted, setProfileCompleted] =
    useState(false);

  const [calcTotal, setCalcTotal] =
    useState(12000);

  const [calcSplitCount, setCalcSplitCount] =
    useState(3);

  const [auditChore, setAuditChore] =
    useState(true);

  const [auditNoise, setAuditNoise] =
    useState(true);

  const [auditBills, setAuditBills] =
    useState(true);

  const [
    auditCommunication,
    setAuditCommunication,
  ] = useState(false);

  const [toastMessage, setToastMessage] =
    useState("");

  const [showToast, setShowToast] =
    useState(false);

  const triggerNotification = (message) => {
    setToastMessage(message);
    setShowToast(true);
  };

  const timeBasedGreeting = useMemo(() => {
    const hours = new Date().getHours();

    if (hours < 12) {
      return {
        text: "Good Morning",
        icon: "☀️",
      };
    }

    if (hours < 18) {
      return {
        text: "Good Afternoon",
        icon: "🌤️",
      };
    }

    return {
      text: "Good Evening",
      icon: "🌙",
    };
  }, []);

  const formattedDate = useMemo(() => {
    return new Date().toLocaleDateString(
      "en-US",
      {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }
    );
  }, []);

  const filteredProperties = useMemo(() => {
    const query = searchQuery
      .trim()
      .toLowerCase();

    if (!query) {
      return SAMPLE_PROPERTIES;
    }

    return SAMPLE_PROPERTIES.filter(
      (property) =>
        property.name
          .toLowerCase()
          .includes(query) ||
        property.location
          .toLowerCase()
          .includes(query)
    );
  }, [searchQuery]);

  const homeScore = useMemo(() => {
    let score = 60;

    if (auditChore) score += 10;
    if (auditNoise) score += 10;
    if (auditBills) score += 10;
    if (auditCommunication) score += 10;

    return score;
  }, [
    auditChore,
    auditNoise,
    auditBills,
    auditCommunication,
  ]);

  const handleShuffleTip = () => {
    setCurrentTipIndex(
      (previous) =>
        (previous + 1) %
        SAMPLE_TIPS.length
    );

    triggerNotification(
      "Pulled a fresh flatmate tip!"
    );
  };

  const handleShuffleQuote = () => {
    setCurrentQuoteIndex(
      (previous) =>
        (previous + 1) %
        SAMPLE_QUOTES.length
    );
  };

  const handleCompleteProfile = () => {
    setProfileProgress(100);
    setProfileCompleted(true);

    triggerNotification(
      "🎉 Profile successfully completed!"
    );
  };

  const handleQuickAction = (actionName) => {
    const routeMap = {
      "Browse Properties": "/properties",
      "Find Roommate": "/roommates",
      "Split Rent": "/rent",
      "Add Expense": "/expenses",
    };

    const route = routeMap[actionName];

    if (route) {
      navigate(route);
      return;
    }

    triggerNotification(
      `Executing Quick Action: ${actionName}`
    );
  };

  return (
    <div className="user-dashboard-page">

      <div className="user-dashboard-local-search">
        <FiSearch />

        <input
          type="text"
          placeholder="Search recent properties..."
          value={searchQuery}
          onChange={(event) =>
            setSearchQuery(event.target.value)
          }
        />

        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery("")}
          >
            Clear
          </button>
        )}
      </div>

      <Container
        fluid
        className="main-content-container animate-fade-in"
      >
{/* WELCOME SECTION + WEATHER SECTION */}
          <Row className="mb-4 align-items-stretch">
            <Col lg={8} md={12} className="mb-3 mb-lg-0">
              <div className="welcome-banner-card glass-card h-100 p-4 d-flex flex-column justify-content-between position-relative overflow-hidden">
                <div className="welcome-decor-circle"></div>
                <div className="welcome-content z-index-1">
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <span className="welcome-emoji">{timeBasedGreeting.icon}</span>
                    <h5 className="welcome-greet m-0">{timeBasedGreeting.text}, {user?.fullName || "SplitNest User"}</h5>
                  </div>
                  <h1 className="welcome-title fw-bold">Welcome Home!</h1>
                  <p className="welcome-subtitle">Let's make shared living easier today.</p>
                </div>
                <div className="welcome-date-badge z-index-1 align-self-start mt-3">
                  <FiCalendar className="date-icon" />
                  <span>{formattedDate}</span>
                </div>
              </div>
            </Col>

            {/* WEATHER CARD */}
            <Col lg={4} md={12}>
              <div className="weather-card glass-card h-100 p-4 d-flex flex-column justify-content-between text-white overflow-hidden">
                <div className="weather-bg-glow"></div>
                <div className="d-flex justify-content-between align-items-start z-index-1">
                  <div>
                    <h4 className="weather-location m-0">Salem</h4>
                    <span className="weather-country">Oregon, US</span>
                  </div>
                  <div className="weather-degree-wrapper text-end">
                    <h2 className="weather-temp m-0">29°C</h2>
                    <span className="weather-status">Sunny ☀️</span>
                  </div>
                </div>
                <div className="weather-footer z-index-1 mt-4 pt-2 border-top border-light-subtle">
                  <p className="weather-comment m-0">Perfect day for house hunting.</p>
                </div>
              </div>
            </Col>
          </Row>

          {/* GRID OF STATUS AND HOME AUDITS */}
          <Row className="mb-4">

            {/* HOME STATUS CARD */}
            <Col lg={4} md={6} className="mb-4 mb-lg-0">
              <div className="home-status-card glass-card p-4 h-100 d-flex flex-column justify-content-between">
                <div>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="card-custom-title m-0">🏡 Home Status</h5>
                    <Badge bg="success" className="custom-badge-online">Active Nest</Badge>
                  </div>

                  <div className="status-items-group mb-4">
                    <div className="status-item d-flex justify-content-between align-items-center py-2 border-bottom">
                      <span className="status-label d-flex align-items-center gap-2">
                        <span className="status-icon-box blue">🏡</span> Rent Status
                      </span>
                      <span className="status-value-badge paid">Paid</span>
                    </div>

                    <div className="status-item d-flex justify-content-between align-items-center py-2 border-bottom">
                      <span className="status-label d-flex align-items-center gap-2">
                        <span className="status-icon-box teal">💡</span> Bills Status
                      </span>
                      <span className="status-value-badge pending">Pending</span>
                    </div>

                    <div className="status-item d-flex justify-content-between align-items-center py-2">
                      <span className="status-label d-flex align-items-center gap-2">
                        <span className="status-icon-box orange">👥</span> Roommate Requests
                      </span>
                      <span className="status-value-badge req-count">2 Pending</span>
                    </div>
                  </div>
                </div>

                {/* Score Section */}
                <div className="d-flex align-items-center justify-content-between pt-3 border-top border-light-subtle">
                  <div className="score-label-info">
                    <h6 className="m-0 fw-bold">⭐ Home Score</h6>
                    <p className="text-muted small m-0">Audit-backed rating</p>
                  </div>
                  <div className="circular-score-wrapper position-relative">
                    <svg width="70" height="70" viewBox="0 0 100 100" className="score-svg-circle">
                      <circle cx="50" cy="50" r="42" className="score-bg" />
                      <circle
                        cx="50"
                        cy="50"
                        r="42"
                        className="score-progress"
                        style={{ strokeDashoffset: 264 - (264 * homeScore) / 100 }}
                      />
                    </svg>
                    <span className="score-text-percent">{homeScore}%</span>
                  </div>
                </div>
              </div>
            </Col>

            {/* CREATIVE ELEMENT: ROOMMATE SCORE AUDITOR */}
            <Col lg={4} md={6} className="mb-4 mb-lg-0">
              <div className="score-auditor-card glass-card p-4 h-100 d-flex flex-column justify-content-between">
                <div>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h5 className="card-custom-title m-0">🎯 Score Auditor</h5>
                    <span className="text-muted small">Affects Home Score</span>
                  </div>
                  <p className="card-custom-subtitle mb-3 text-muted">Toggle your roommate habits checklist:</p>

                  <div className="audit-checklist">
                    <Form.Check
                      type="checkbox"
                      id="audit-chores"
                      label="Chores completed on schedule (+10%)"
                      checked={auditChore}
                      onChange={(e) => setAuditChore(e.target.checked)}
                      className="audit-checkbox mb-2"
                    />
                    <Form.Check
                      type="checkbox"
                      id="audit-noise"
                      label="Respected quiet hours (+10%)"
                      checked={auditNoise}
                      onChange={(e) => setAuditNoise(e.target.checked)}
                      className="audit-checkbox mb-2"
                    />
                    <Form.Check
                      type="checkbox"
                      id="audit-bills"
                      label="Settled shared bills (+10%)"
                      checked={auditBills}
                      onChange={(e) => setAuditBills(e.target.checked)}
                      className="audit-checkbox mb-2"
                    />
                    <Form.Check
                      type="checkbox"
                      id="audit-comm"
                      label="Proactive group chat check-ins (+10%)"
                      checked={auditCommunication}
                      onChange={(e) => setAuditCommunication(e.target.checked)}
                      className="audit-checkbox mb-2"
                    />
                  </div>
                </div>

                <div className="audit-card-footer pt-3 border-top border-light-subtle">
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="text-muted small">Habit Consistency:</span>
                    <span className="fw-semibold text-primary">{homeScore >= 80 ? 'Excellent' : 'Needs Work'}</span>
                  </div>
                </div>
              </div>
            </Col>

            {/* PROFILE COMPLETION SECTION */}
            <Col lg={4} md={12}>
              <div className="profile-completion-card glass-card p-4 h-100 d-flex flex-column justify-content-between">
                <div>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="card-custom-title m-0">👤 Profile Completion</h5>
                    {profileCompleted ? (
                      <Badge bg="success" className="complete-badge">100%</Badge>
                    ) : (
                      <Badge bg="warning" text="dark" className="pending-badge">Action Required</Badge>
                    )}
                  </div>
                  <p className="card-custom-subtitle text-muted mb-4">Complete your co-living bio to matching with higher-rated flatmates.</p>

                  <div className="progress-container mb-3">
                    <div className="d-flex justify-content-between text-muted small mb-1">
                      <span>Verification Progress</span>
                      <span className="fw-bold">{profileProgress}%</span>
                    </div>
                    <ProgressBar now={profileProgress} className="custom-dashboard-bar" />
                  </div>
                </div>

                <Button
                  onClick={handleCompleteProfile}
                  disabled={profileCompleted}
                  className={`btn-complete-profile mt-3 ${profileCompleted ? 'completed-glow' : ''}`}
                >
                  {profileCompleted ? 'Profile Verified ✓' : 'Complete Profile'}
                </Button>
              </div>
            </Col>
          </Row>

          {/* QUICK ACTIONS ROW */}
          <h4 className="section-grid-title mb-3">⚡ Quick Operations</h4>
          <Row className="mb-4 g-3">
            <Col lg={3} md={6}>
              <div className="quick-action-card glass-card p-3 d-flex align-items-center" onClick={() => handleQuickAction("Browse Properties")}>
                <div className="action-icon-circle blue">
                  <FiCompass />
                </div>
                <div className="action-texts">
                  <h6 className="action-title m-0">Browse Properties</h6>
                  <p className="action-desc m-0">Find new rooms</p>
                </div>
              </div>
            </Col>

            <Col lg={3} md={6}>
              <div className="quick-action-card glass-card p-3 d-flex align-items-center" onClick={() => handleQuickAction("Find Roommate")}>
                <div className="action-icon-circle teal">
                  <FiUsers />
                </div>
                <div className="action-texts">
                  <h6 className="action-title m-0">Find Roommate</h6>
                  <p className="action-desc m-0">Match profiles</p>
                </div>
              </div>
            </Col>

            <Col lg={3} md={6}>
              <div className="quick-action-card glass-card p-3 d-flex align-items-center" onClick={() => handleQuickAction("Split Rent")}>
                <div className="action-icon-circle accent">
                  <FiDollarSign />
                </div>
                <div className="action-texts">
                  <h6 className="action-title m-0">Split Rent</h6>
                  <p className="action-desc m-0">Divide room share</p>
                </div>
              </div>
            </Col>

            <Col lg={3} md={6}>
              <div className="quick-action-card glass-card p-3 d-flex align-items-center" onClick={() => handleQuickAction("Add Expense")}>
                <div className="action-icon-circle red">
                  <FiPlusCircle />
                </div>
                <div className="action-texts">
                  <h6 className="action-title m-0">Add Expense</h6>
                  <p className="action-desc m-0">Log utilities bill</p>
                </div>
              </div>
            </Col>
          </Row>

          {/* STATISTICS SECTION */}
          <Row className="mb-4 g-3">
            <Col lg={3} md={6}>
              <div className="stat-counter-card glass-card p-4 text-center">
                <span className="stat-label">Properties Viewed</span>
                <h2 className="stat-count count-blue mt-2">124</h2>
                <div className="stat-foot-trend text-success">
                  <FiTrendingUp /> <span>+12% this week</span>
                </div>
              </div>
            </Col>

            <Col lg={3} md={6}>
              <div className="stat-counter-card glass-card p-4 text-center">
                <span className="stat-label">Saved Properties</span>
                <h2 className="stat-count count-teal mt-2">18</h2>
                <div className="stat-foot-trend text-muted">
                  <span>Synced in Salem</span>
                </div>
              </div>
            </Col>

            <Col lg={3} md={6}>
              <div className="stat-counter-card glass-card p-4 text-center">
                <span className="stat-label">Monthly Expenses</span>
                <h2 className="stat-count count-accent mt-2">₹5,500</h2>
                <div className="stat-foot-trend text-danger">
                  <span>Due in 5 days</span>
                </div>
              </div>
            </Col>

            <Col lg={3} md={6}>
              <div className="stat-counter-card glass-card p-4 text-center">
                <span className="stat-label">Pending Rent</span>
                <h2 className="stat-count count-red mt-2">₹0</h2>
                <div className="stat-foot-trend text-success">
                  <span>Paid for July 🎉</span>
                </div>
              </div>
            </Col>
          </Row>

          {/* RECENT PROPERTIES & OTHER CARDS */}
          <Row className="mb-4">

            {/* RECENT PROPERTIES CARDS */}
            <Col lg={8} md={12} className="mb-4 mb-lg-0">
              <div className="recent-properties-section h-100">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h4 className="section-grid-title m-0">🏡 Recent Properties</h4>
                  <Button variant="link" className="view-all-link" onClick={() => navigate('/properties')}>
                    View All Properties <FiArrowRight />
                  </Button>
                </div>

                <Row className="g-3">
                  {filteredProperties.length > 0 ? (
                    filteredProperties.map((prop) => (
                      <Col md={4} key={prop.id}>
                        <Card className="property-premium-card glass-card h-100 overflow-hidden border-0">
                          <div className="card-img-wrapper position-relative">
                            <img src={prop.image} alt={prop.name} className="property-card-img" />
                            <Badge className="property-status-tag">{prop.tag}</Badge>
                            <button className="property-heart-btn" onClick={() => triggerNotification(`Added ${prop.name} to Saved List!`)}>
                              <FiHeart />
                            </button>
                          </div>
                          <Card.Body className="p-3 d-flex flex-column justify-content-between">
                            <div>
                              <div className="d-flex justify-content-between align-items-center mb-1">
                                <span className="property-card-location text-muted small">{prop.location}</span>
                                <span className="property-card-rating">
                                  <FiStar className="star-icon" /> {prop.rating}
                                </span>
                              </div>
                              <h5 className="property-card-name fw-bold mb-2">{prop.name}</h5>
                              <div className="d-flex justify-content-between align-items-center mb-3">
                                <span className="property-card-rent fw-semibold text-primary">₹{prop.rent} <small className="text-muted">/mo</small></span>
                                <Badge bg="light" text="dark" className="border property-card-avail">{prop.availability}</Badge>
                              </div>
                            </div>
                            <Button
                              className="btn-book-property w-100"
                              onClick={() => navigate(`/book/${prop.id}`)}
                            >
                              Book Now
                            </Button>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))
                  ) : (
                    <Col xs={12}>
                      <div className="text-center py-5 glass-card">
                        <h5 className="text-muted">No properties found matching "{searchQuery}"</h5>
                        <p className="text-muted small">Try searching another location or clear filter.</p>
                        <Button variant="outline-primary" size="sm" onClick={() => setSearchQuery('')}>Reset Search</Button>
                      </div>
                    </Col>
                  )}
                </Row>
              </div>
            </Col>

            {/* SIDE PANEL DETAILS: DAILY HOME TIP & QUOTE OF THE DAY */}
            <Col lg={4} md={12}>
              <div className="d-flex flex-column gap-3 h-100">

                {/* DAILY HOME TIP */}
                <div className="daily-tip-card glass-card p-4 d-flex flex-column justify-content-between">
                  <div>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h5 className="card-custom-title m-0">💡 Daily Home Tip</h5>
                      <button className="shuffle-btn-circular" onClick={handleShuffleTip} title="Shuffle New Tip">
                        <FiRefreshCw />
                      </button>
                    </div>
                    <div className="tip-quote-bubble">
                      <p className="tip-quote-content m-0">"{SAMPLE_TIPS[currentTipIndex]}"</p>
                    </div>
                  </div>
                  <div className="tip-card-footer mt-4 text-muted small d-flex align-items-center gap-2">
                    <FiInfo /> <span>Tip {currentTipIndex + 1} of {SAMPLE_TIPS.length}</span>
                  </div>
                </div>

                {/* QUOTE CARD */}
                <div className="quote-card glass-card p-4 d-flex flex-column justify-content-between text-white position-relative overflow-hidden">
                  <div className="quote-bg-pattern"></div>
                  <div>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <span className="quote-label-badge z-index-1">Quote of the Day</span>
                      <button className="quote-refresh z-index-1" onClick={handleShuffleQuote} title="Next Quote">
                        <FiRefreshCw />
                      </button>
                    </div>
                    <p className="quote-text z-index-1 fs-5 italic m-0">
                      "{SAMPLE_QUOTES[currentQuoteIndex]}"
                    </p>
                  </div>
                  <div className="quote-author z-index-1 text-end mt-3 text-light-emphasis small">
                    — SplitNest Co-living Insight
                  </div>
                </div>

              </div>
            </Col>
          </Row>

          {/* RECENT ACTIVITY & INTERACTIVE TOOLS SECTION */}
          <Row>
            {/* RECENT ACTIVITY TIMELINE */}
            <Col lg={6} md={12} className="mb-4 mb-lg-0">
              <div className="recent-activity-card glass-card p-4 h-100">
                <h5 className="card-custom-title mb-4">🕒 Recent Activity</h5>

                <div className="activity-timeline">
                  <div className="timeline-item">
                    <div className="timeline-marker icon-marker blue">
                      <FiCompass />
                    </div>
                    <div className="timeline-content">
                      <h6 className="timeline-title">Viewed Sri Sai Residency</h6>
                      <p className="timeline-subtitle text-muted">Salem rental matching your budget guidelines.</p>
                      <span className="timeline-timestamp">2 hours ago</span>
                    </div>
                  </div>

                  <div className="timeline-item">
                    <div className="timeline-marker icon-marker teal">
                      <FiHeart />
                    </div>
                    <div className="timeline-content">
                      <h6 className="timeline-title">Saved Green Nest PG</h6>
                      <p className="timeline-subtitle text-muted">Added Meyyanur, Salem location to bookmarks.</p>
                      <span className="timeline-timestamp">Yesterday</span>
                    </div>
                  </div>

                  <div className="timeline-item">
                    <div className="timeline-marker icon-marker orange">
                      <FiDollarSign />
                    </div>
                    <div className="timeline-content">
                      <h6 className="timeline-title">Paid July Rent</h6>
                      <p className="timeline-subtitle text-muted">Settled monthly invoice with Flatmate Ledger.</p>
                      <span className="timeline-timestamp">3 days ago</span>
                    </div>
                  </div>

                  <div className="timeline-item last">
                    <div className="timeline-marker icon-marker purple">
                      <FiUsers />
                    </div>
                    <div className="timeline-content">
                      <h6 className="timeline-title">Joined Room Alpha</h6>
                      <p className="timeline-subtitle text-muted">Accepted invite to flatmate shared channel.</p>
                      <span className="timeline-timestamp">5 days ago</span>
                    </div>
                  </div>
                </div>
              </div>
            </Col>

            {/* CREATIVE ELEMENT: RENT SPLIT CALCULATOR */}
            <Col lg={6} md={12}>
              <div className="calculator-card glass-card p-4 h-100 d-flex flex-column justify-content-between">
                <div>
                  <h5 className="card-custom-title mb-2">📊 Rent Split Calculator</h5>
                  <p className="card-custom-subtitle text-muted mb-4">Simulate how much each roommate needs to pay based on total monthly bills.</p>

                  <Row className="mb-3">
                    <Col xs={6}>
                      <Form.Group>
                        <Form.Label className="calc-input-label text-muted">Total Invoice Amount (₹)</Form.Label>
                        <Form.Control
                          type="number"
                          value={calcTotal}
                          onChange={(e) => setCalcTotal(Number(e.target.value))}
                          className="calc-form-input"
                        />
                      </Form.Group>
                    </Col>
                    <Col xs={6}>
                      <Form.Group>
                        <Form.Label className="calc-input-label text-muted">Flatmates Split Count</Form.Label>
                        <Form.Control
                          type="number"
                          min="1"
                          max="10"
                          value={calcSplitCount}
                          onChange={(e) => setCalcSplitCount(Math.max(1, Number(e.target.value)))}
                          className="calc-form-input"
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <div className="calc-result-area p-3 rounded text-center mb-2">
                    <span className="result-label text-muted">Estimated cost per roommate:</span>
                    <h2 className="result-amount fw-bold text-teal mt-1">
                      ₹{calcSplitCount > 0 ? (calcTotal / calcSplitCount).toFixed(2) : '0.00'}
                    </h2>
                  </div>
                </div>

                <div className="calc-footer d-flex gap-2">
                  <Button
                    className="btn-calc-action w-50"
                    variant="outline-primary"
                    onClick={() => { setCalcTotal(12000); setCalcSplitCount(3); }}
                  >
                    Reset
                  </Button>
                  <Button
                    className="btn-calc-action w-50 btn-solid-accent"
                    onClick={() => triggerNotification(`Cost logged: ₹${(calcTotal / calcSplitCount).toFixed(2)} split between ${calcSplitCount} roommates`)}
                  >
                    Log to Ledger
                  </Button>
                </div>
              </div>
            </Col>
          </Row>
      </Container>

      <ToastContainer
        position="bottom-end"
        className="p-3 z-index-toast"
      >
        <Toast
          onClose={() => setShowToast(false)}
          show={showToast}
          delay={3000}
          autohide
          className="glass-toast border-0 shadow"
        >
          <Toast.Header className="glass-toast-header border-0 text-white">
            <strong className="me-auto d-flex align-items-center gap-2">
              💡 SplitNest System
            </strong>
          </Toast.Header>

          <Toast.Body className="glass-toast-body text-white">
            {toastMessage}
          </Toast.Body>
        </Toast>
      </ToastContainer>

    </div>
  );
}

export default UserDashboard;