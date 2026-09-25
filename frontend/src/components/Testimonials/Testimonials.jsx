import { Carousel, Container, Row, Col } from 'react-bootstrap';
import { FiStar } from 'react-icons/fi';
import './Testimonials.css';

function SplitNestTestimonials() {
  const reviews = [
    {
      id: 1,
      initials: 'SJ',
      name: 'Sarah Jenkins',
      occupation: 'Graduate Student',
      colorClass: 'avatar-teal',
      rating: 5,
      text: 'SplitNest completely changed my university housing experience. Splitting utilities and paying rent through the digital ledger saved us from so many awkward calculations!'
    },
    {
      id: 2,
      initials: 'AR',
      name: 'Alex Rivera',
      occupation: 'Software Engineer',
      colorClass: 'avatar-indigo',
      rating: 5,
      text: 'I was anxious about finding a roommate when relocating to Salem. The matching system paired me with Mike based on shared habits, and we became instant friends.'
    },
    {
      id: 3,
      initials: 'MC',
      name: 'Mike Chen',
      occupation: 'Product Designer',
      colorClass: 'avatar-amber',
      rating: 5,
      text: 'The interface is beautiful and extremely intuitive. Managing our chore schedule calendar and tracking monthly utility settlements in one screen makes co-living a breeze!'
    },
    {
      id: 4,
      initials: 'JT',
      name: 'Jessica Taylor',
      occupation: 'Medical Professional',
      colorClass: 'avatar-teal',
      rating: 5,
      text: 'Finding verified rental properties with vetted landlords was my top priority. SplitNest ensured 100% security, making my lease application smooth and stress-free.'
    }
  ];

  return (
    <section id="testimonials" className="testimonials-section">
      {/* Ambient background glows */}
      <div className="testi-glow-1"></div>
      <div className="testi-glow-2"></div>

      <Container>
        {/* Header Block */}
        <div className="testimonials-header text-center animate-fade-up">
          <div className="testi-tag">Testimonials</div>
          <h2 className="testi-title">
            Loved by <span className="title-gradient">modern flatmates</span>
          </h2>
          <p className="testi-subtitle">
            See how thousands of roommates are co-living in absolute harmony using SplitNest.
          </p>
        </div>

        {/* Testimonials Carousel */}
        <Row className="justify-content-center animate-fade-up">
          <Col lg={8} md={10}>
            <Carousel 
              controls={false}
              indicators={true}
              interval={5000}
              pause="hover"
              className="testi-carousel"
            >
              {reviews.map((rev) => (
                <Carousel.Item key={rev.id}>
                  <div className="testi-card-glass">
                    {/* Quotation Marks Graphic in background */}
                    <div className="quote-mark-back">“</div>

                    {/* Star Rating */}
                    <div className="testi-stars">
                      {[...Array(rev.rating)].map((_, i) => (
                        <FiStar key={i} className="testi-star-icon" />
                      ))}
                    </div>

                    {/* Review text */}
                    <p className="testi-text">"{rev.text}"</p>

                    {/* Profile avatar metadata */}
                    <div className="testi-profile">
                      <div className={`testi-avatar ${rev.colorClass}`}>
                        {rev.initials}
                      </div>
                      <div className="testi-meta">
                        <h4 className="testi-name">{rev.name}</h4>
                        <span className="testi-occupation">{rev.occupation}</span>
                      </div>
                    </div>
                  </div>
                </Carousel.Item>
              ))}
            </Carousel>
          </Col>
        </Row>
      </Container>
    </section>
  );
}

export default SplitNestTestimonials;
