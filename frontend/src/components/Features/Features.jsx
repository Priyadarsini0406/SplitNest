import { Container, Row, Col } from 'react-bootstrap';
import { 
  FiShield, 
  FiUsers, 
  FiDollarSign, 
  FiCreditCard, 
  FiFileText, 
  FiMessageSquare 
} from 'react-icons/fi';
import './Features.css';

function SplitNestFeatures() {
  const featuresList = [
    {
      icon: <FiShield />,
      title: 'Verified Properties',
      description: 'Browse hand-picked, vetted properties with complete documentation and transparent pricing.',
      colorClass: 'feat-indigo'
    },
    {
      icon: <FiUsers />,
      title: 'Roommate Matching',
      description: 'Connect with verified roommates that match your lifestyle habits, preferences, and cleanliness standards.',
      colorClass: 'feat-teal'
    },
    {
      icon: <FiDollarSign />,
      title: 'Rent Splitting',
      description: 'Automatically split monthly rent among flatmates with customized share options and instant ledger logs.',
      colorClass: 'feat-indigo'
    },
    {
      icon: <FiCreditCard />,
      title: 'Expense Tracker',
      description: 'Log shared bills, groceries, and utilities on the go, with calculations calculated down to the cent.',
      colorClass: 'feat-amber'
    },
    {
      icon: <FiFileText />,
      title: 'Bill Management',
      description: 'Schedule utility payments, set automatic reminders, and settle debts instantly via digital payment methods.',
      colorClass: 'feat-teal'
    },
    {
      icon: <FiMessageSquare />,
      title: 'Secure Chat',
      description: 'Communicate directly with your housemates, landlords, or prospective renters in a private, encrypted chat room.',
      colorClass: 'feat-amber'
    }
  ];

  return (
    <section id="features" className="features-section">
      {/* Ambient glows inside features */}
      <div className="features-glow-1"></div>
      <div className="features-glow-2"></div>

      <Container>
        {/* Header Block */}
        <div className="features-header text-center animate-fade-up">
          <div className="features-tag">Features</div>
          <h2 className="features-title">
            Everything you need for <span className="title-gradient">harmonious living</span>
          </h2>
          <p className="features-subtitle">
            SplitNest provides all the tools required to find, share, and manage your co-living spaces smoothly.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <Row className="g-4 features-grid">
          {featuresList.map((feat, index) => (
            <Col key={index} sm={12} md={6} lg={4} className="d-flex">
              <div className={`feature-card animate-fade-up delay-${(index % 3) + 1}`}>
                {/* Glow Overlay */}
                <div className="card-glow-overlay"></div>
                
                {/* Icon Wrapper */}
                <div className={`feature-icon-wrapper ${feat.colorClass}`}>
                  {feat.icon}
                </div>

                {/* Card Content */}
                <h3 className="feature-card-title">{feat.title}</h3>
                <p className="feature-card-desc">{feat.description}</p>
                
                {/* Subtle Card Footer Line */}
                <div className="card-accent-bar"></div>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
}

export default SplitNestFeatures;
