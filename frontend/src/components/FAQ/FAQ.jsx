import { Accordion, Container, Row, Col } from 'react-bootstrap';
import { FiChevronDown, FiHelpCircle } from 'react-icons/fi';
import './FAQ.css';

function SplitNestFAQ() {
  const faqs = [
    {
      eventKey: '0',
      question: 'How does roommate matching work?',
      answer: 'Our smart matching algorithm analyses your profile habits (cleanliness levels, work hours, guest policies, and hobbies) and calculates compatibility scores to match you with vetted housemates.'
    },
    {
      eventKey: '1',
      question: 'Is my rent payment secure on SplitNest?',
      answer: 'Yes, absolutely. All payments are processed through secure bank integrations and encrypted transaction gateways. Your rent share is directly transferred with automated ledger settlement updates.'
    },
    {
      eventKey: '2',
      question: 'How do I track shared expenses?',
      answer: 'Simply log any utility bills, groceries, or household supplies inside the expense tab. SplitNest splits the cost dynamically based on your custom room agreements and alerts roomies automatically.'
    },
    {
      eventKey: '3',
      question: 'Are properties listed on SplitNest verified?',
      answer: 'Yes. We require landlords to verify proof of property ownership and perform physical check-ins. Vetted listings receive a "Verified Nest" checkmark badge so you can book without anxiety.'
    },
    {
      eventKey: '4',
      question: 'What security measures do you have in place?',
      answer: 'All roommates undergo optional identity checks and profile reviews. We also protect communication with secure private chats and offer instant security deposit escrow options.'
    },
    {
      eventKey: '5',
      question: 'How do I manage my SplitNest account?',
      answer: 'You can update your co-living agreements, split shares, household chore schedules, and subscription settings directly from your profile settings dashboard at any time.'
    }
  ];

  return (
    <section id="faq" className="faq-section">
      {/* Background glow blobs */}
      <div className="faq-glow-1"></div>
      <div className="faq-glow-2"></div>

      <Container>
        {/* Header Block */}
        <div className="faq-header text-center animate-fade-up">
          <div className="faq-tag">Support</div>
          <h2 className="faq-title">
            Frequently asked <span className="title-gradient">questions</span>
          </h2>
          <p className="faq-subtitle">
            Find answers to commonly asked questions about listings, roommate safety, and splitting rent ledger balances.
          </p>
        </div>

        {/* Accordion Layout */}
        <Row className="justify-content-center animate-fade-up">
          <Col lg={9} md={11}>
            <Accordion defaultActiveKey="0" className="faq-accordion-custom">
              {faqs.map((faq) => (
                <Accordion.Item key={faq.eventKey} eventKey={faq.eventKey} className="faq-item-glass">
                  <Accordion.Header className="faq-header-custom">
                    <span className="faq-header-content">
                      <FiHelpCircle className="faq-question-icon" />
                      {faq.question}
                    </span>
                    <FiChevronDown className="faq-arrow-icon" />
                  </Accordion.Header>
                  <Accordion.Body className="faq-body-custom">
                    <p className="faq-answer-text">{faq.answer}</p>
                  </Accordion.Body>
                </Accordion.Item>
              ))}
            </Accordion>
          </Col>
        </Row>
      </Container>
    </section>
  );
}

export default SplitNestFAQ;
