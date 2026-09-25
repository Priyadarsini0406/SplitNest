import { Container, Row, Col } from 'react-bootstrap';
import { 
  FiSearch, 
  FiUserPlus, 
  FiDollarSign, 
  FiTrendingUp, 
  FiHome 
} from 'react-icons/fi';
import './HowItWorks.css';

function SplitNestHowItWorks() {
  const steps = [
    {
      number: '01',
      icon: <FiSearch />,
      title: 'Search Property',
      description: 'Discover verified spaces optimized for co-living, filtered by lease type, rooms, and budget.'
    },
    {
      number: '02',
      icon: <FiUserPlus />,
      title: 'Join Room',
      description: 'Apply to active listings or send roommate requests to verified profiles that align with your lifestyle.'
    },
    {
      number: '03',
      icon: <FiDollarSign />,
      title: 'Split Rent',
      description: 'Set up transparent rental shares and split utility contributions dynamically among housemates.'
    },
    {
      number: '04',
      icon: <FiTrendingUp />,
      title: 'Track Expenses',
      description: 'Upload digital receipts, log household utility bills, and monitor real-time group balances effortlessly.'
    },
    {
      number: '05',
      icon: <FiHome />,
      title: 'Move In',
      description: 'Sign the shared digital agreements, settle security deposits securely, and start living in perfect harmony.'
    }
  ];

  return (
    <section id="how-it-works" className="how-it-works-section">
      {/* Background ambient lighting */}
      <div className="hiw-glow-top"></div>
      <div className="hiw-glow-bottom"></div>

      <Container>
        {/* Header Block */}
        <div className="how-it-works-header text-center animate-fade-up">
          <div className="hiw-tag">Workflow</div>
          <h2 className="hiw-title">
            Simple steps to <span className="title-gradient">nest comfortably</span>
          </h2>
          <p className="hiw-subtitle">
            From the initial search to settling into your new room, we make shared living completely stress-free.
          </p>
        </div>

        {/* Timeline Component */}
        <div className="timeline-container animate-fade-up">
          {/* Main central connecting track/line */}
          <div className="timeline-line">
            <div className="timeline-line-progress"></div>
          </div>

          <Row className="timeline-row justify-content-center">
            {steps.map((step, index) => (
              <Col key={index} lg={2} md={12} className="timeline-col">
                <div className={`timeline-node-card delay-${index + 1}`}>
                  {/* Step Number Badge */}
                  <div className="step-number-container">
                    <span className="step-num-text">{step.number}</span>
                  </div>

                  {/* Connecting Dot Node on the line */}
                  <div className="timeline-connector-dot">
                    <div className="connector-dot-inner"></div>
                  </div>

                  {/* Content Glass Card */}
                  <div className="timeline-card-content">
                    <div className="step-icon-wrapper">
                      {step.icon}
                    </div>
                    <h3 className="step-title">{step.title}</h3>
                    <p className="step-desc">{step.description}</p>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      </Container>
    </section>
  );
}

export default SplitNestHowItWorks;
