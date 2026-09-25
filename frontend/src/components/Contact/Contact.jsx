import { useState } from 'react';
import { Container, Row, Col, Form } from 'react-bootstrap';
import { 
  FiMail, 
  FiPhone, 
  FiMapPin, 
  FiFacebook, 
  FiTwitter, 
  FiInstagram, 
  FiLinkedin,
  FiSend
} from 'react-icons/fi';
import './Contact.css';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Contact form submitted:', formData);
    // Add simple reset
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <section id="contact" className="contact-section">
      {/* Background glow blobs */}
      <div className="contact-glow-1"></div>
      <div className="contact-glow-2"></div>

      <Container>
        {/* Header Block */}
        <div className="contact-header text-center animate-fade-up">
          <div className="contact-tag">Get in Touch</div>
          <h2 className="contact-title">
            We are here to <span className="title-gradient">help you nest</span>
          </h2>
          <p className="contact-subtitle">
            Have questions, feedback, or need roommate assistance? Settle your queries instantly with our team.
          </p>
        </div>

        <Row className="g-5 justify-content-center">
          {/* Left Column: Form & Map */}
          <Col lg={7} className="animate-fade-up">
            <div className="contact-glass-card form-card">
              <h3 className="contact-card-title mb-4">Send a Message</h3>
              <Form onSubmit={handleSubmit} className="contact-form">
                <Row className="g-3">
                  <Col md={6}>
                    <Form.Group controlId="contactName">
                      <Form.Label className="contact-form-label">Name</Form.Label>
                      <Form.Control 
                        type="text" 
                        placeholder="Your Name" 
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="contact-form-input"
                        required 
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="contactEmail">
                      <Form.Label className="contact-form-label">Email Address</Form.Label>
                      <Form.Control 
                        type="email" 
                        placeholder="Your Email" 
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="contact-form-input"
                        required 
                      />
                    </Form.Group>
                  </Col>
                  <Col md={12}>
                    <Form.Group controlId="contactMessage">
                      <Form.Label className="contact-form-label">Message</Form.Label>
                      <Form.Control 
                        as="textarea" 
                        rows={4} 
                        placeholder="How can we help you?" 
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        className="contact-form-input text-area"
                        required 
                      />
                    </Form.Group>
                  </Col>
                  <Col md={12}>
                    <button type="submit" className="btn-contact-submit">
                      Send Message <FiSend className="send-icon" />
                    </button>
                  </Col>
                </Row>
              </Form>
            </div>

            {/* Google Map Placeholder (Styled grey-scale map with glass card coordinates) */}
            <div className="contact-map-wrapper mt-4">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3912.1795779034293!2d78.1402287758784!3d11.681665441991475!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3babf038f26a8dcb%3A0x8ba699c6b6c00cfd!2sFairlands%2C%20Salem%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin" 
                width="100%" 
                height="220" 
                style={{ border: 0 }} 
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="SplitNest Salem Office Map"
                className="contact-google-map"
              ></iframe>
              <div className="map-glass-badge">
                <span className="map-badge-dot"></span>
                <span>Salem Office</span>
              </div>
            </div>
          </Col>

          {/* Right Column: Contact Cards & Socials */}
          <Col lg={4} className="animate-fade-up delay-2 d-flex flex-column gap-4">
            {/* Info Card 1: Email */}
            <div className="contact-glass-card info-card">
              <div className="info-icon-circle bg-primary-light">
                <FiMail className="text-primary" />
              </div>
              <div className="info-text">
                <h4 className="info-title">Email Us</h4>
                <p className="info-detail"><a href="mailto:support@splitnest.com">support@splitnest.com</a></p>
                <span className="info-subtext">Replies within 24 hours</span>
              </div>
            </div>

            {/* Info Card 2: Phone */}
            <div className="contact-glass-card info-card">
              <div className="info-icon-circle bg-secondary-light">
                <FiPhone className="text-secondary" />
              </div>
              <div className="info-text">
                <h4 className="info-title">Call Us</h4>
                <p className="info-detail">+91 98765 43210</p>
                <span className="info-subtext">Mon - Sat • 9am - 6pm IST</span>
              </div>
            </div>

            {/* Info Card 3: Address */}
            <div className="contact-glass-card info-card">
              <div className="info-icon-circle bg-accent-light">
                <FiMapPin className="text-accent" />
              </div>
              <div className="info-text">
                <h4 className="info-title">Office</h4>
                <p className="info-detail">Fairlands, Salem, Tamil Nadu</p>
                <span className="info-subtext">Personal meetings by appointment</span>
              </div>
            </div>

            {/* Social Links Block */}
            <div className="contact-glass-card social-card mt-auto">
              <h4 className="info-title text-center mb-3">Connect on Socials</h4>
              <div className="contact-social-row">
                <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook"><FiFacebook /></a>
                <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter"><FiTwitter /></a>
                <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram"><FiInstagram /></a>
                <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn"><FiLinkedin /></a>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
}

export default Contact;
