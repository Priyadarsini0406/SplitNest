import { Container, Row, Col } from 'react-bootstrap';
import { 
  FiShield, 
  FiUsers, 
  FiDollarSign, 
  FiCreditCard, 
  FiMessageSquare, 
  FiHeart,
  FiHome,
  FiLock,
  FiKey
} from 'react-icons/fi';
import './WhyChoose.css';

function SplitNestWhyChoose() {
  const advantages = [
    {
      icon: <FiShield />,
      title: 'Verified Properties',
      description: 'We vet every listing and landlord to ensure you find a secure space without risk of scams.',
      colorClass: 'adv-indigo'
    },
    {
      icon: <FiUsers />,
      title: 'Smart Roommate Matching',
      description: 'Connect with roommates based on lifestyle habits, clean preferences, work hours, and hobbies.',
      colorClass: 'adv-teal'
    },
    {
      icon: <FiDollarSign />,
      title: 'Easy Rent Splitting',
      description: 'Calculate customizable rent shares, manage direct deposits, and record monthly ledger balances.',
      colorClass: 'adv-indigo'
    },
    {
      icon: <FiCreditCard />,
      title: 'Expense & Bill Tracking',
      description: 'Log joint utility contributions, house supplies, and groceries dynamically with instant settles.',
      colorClass: 'adv-amber'
    },
    {
      icon: <FiMessageSquare />,
      title: 'Secure Chat',
      description: 'Direct end-to-end encrypted messaging system with housemates, prospective roommates, and landlords.',
      colorClass: 'adv-teal'
    },
    {
      icon: <FiHeart />,
      title: 'Safe & Trusted Community',
      description: 'Optional profile identity verifications and background checks to guarantee household safety.',
      colorClass: 'adv-amber'
    }
  ];

  return (
    <section id="why-choose" className="why-choose-section">
      {/* Background glowing blobs */}
      <div className="why-glow-1"></div>
      <div className="why-glow-2"></div>

      <Container>
        <Row className="align-items-center g-5">
          {/* Left Column: Graphic Illustration and Glass Cards */}
          <Col lg={6} className="why-graphic-col order-2 order-lg-1 animate-fade-up">
            <div className="why-illustration-container">
              {/* Pulsing orbit path */}
              <div className="why-orbit-ring"></div>
              
              {/* Glow center */}
              <div className="why-glow-center"></div>

              {/* Main generated PNG illustration */}
              <div className="why-image-wrapper">
                <img 
                  src="/why_choose.png" 
                  alt="Why Choose SplitNest co-living illustration" 
                  className="why-illustration-img"
                />
              </div>

              {/* Floating Glassmorphic cards */}
              <div className="why-glass-card why-card-secure">
                <div className="why-icon-box bg-success-light">
                  <FiLock className="text-success" />
                </div>
                <div className="why-card-content">
                  <span className="why-label">Vetted Profiles</span>
                  <p className="why-value">100% Secure</p>
                </div>
              </div>

              <div className="why-glass-card why-card-trust">
                <div className="why-icon-box bg-primary-light">
                  <FiKey className="text-primary" />
                </div>
                <div className="why-card-content">
                  <span className="why-label">Move-In Rate</span>
                  <p className="why-value">Smooth Settle</p>
                </div>
              </div>

              {/* Small floating utility bubbles */}
              <div className="why-bubble bubble-home">
                <FiHome />
              </div>
              <div className="why-bubble bubble-heart">
                <FiHeart />
              </div>
            </div>
          </Col>

          {/* Right Column: Advantages Grid */}
          <Col lg={6} className="why-content-col order-1 order-lg-2">
            {/* Header */}
            <div className="why-header animate-fade-up">
              <div className="why-tag">Why choose us</div>
              <h2 className="why-title">
                Smart living built around <span className="title-gradient">trust & clarity</span>
              </h2>
              <p className="why-subtitle">
                SplitNest removes the awkward math and anxiety from roommate sharing, letting you focus on building a home.
              </p>
            </div>

            {/* Advantages list */}
            <Row className="g-4 advantages-list">
              {advantages.map((adv, index) => (
                <Col key={index} sm={12} md={6} className="d-flex">
                  <div className={`advantage-item animate-fade-up delay-${(index % 3) + 1}`}>
                    <div className={`advantage-icon-wrapper ${adv.colorClass}`}>
                      {adv.icon}
                    </div>
                    <h3 className="advantage-title">{adv.title}</h3>
                    <p className="advantage-description">{adv.description}</p>
                  </div>
                </Col>
              ))}
            </Row>
          </Col>
        </Row>
      </Container>
    </section>
  );
}

export default SplitNestWhyChoose;
