import { useEffect, useState, useRef } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { 
  FiUsers, 
  FiHome, 
  FiCreditCard, 
  FiSmile 
} from 'react-icons/fi';
import './Statistics.css';

// Lightweight, high-performance local Counter component
function AnimatedCounter({ end, duration = 2000, suffix = "" }) {
  const [count, setCount] = useState(0);
  const countRef = useRef(false);
  const elementRef = useRef(null);

  useEffect(() => {
    let observer;
    
    // Intersection Observer to trigger counting when card scrolls into view
    if (elementRef.current) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && !countRef.current) {
              countRef.current = true;
              startCounting();
            }
          });
        },
        { threshold: 0.1 }
      );
      observer.observe(elementRef.current);
    }

    const startCounting = () => {
      let startTimestamp = null;
      const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        setCount(Math.floor(progress * end));
        if (progress < 1) {
          window.requestAnimationFrame(step);
        } else {
          setCount(end);
        }
      };
      window.requestAnimationFrame(step);
    };

    return () => {
      if (observer && elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [end, duration]);

  const formatNumber = (num) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(0) + 'K';
    }
    return num;
  };

  return <span ref={elementRef}>{formatNumber(count)}{suffix}</span>;
}

function SplitNestStatistics() {
  const statsList = [
    {
      icon: <FiUsers />,
      endVal: 10000,
      suffix: '+',
      title: 'Happy Users',
      description: 'Roommates and renters connected successfully.',
      gradientClass: 'grad-indigo'
    },
    {
      icon: <FiHome />,
      endVal: 5000,
      suffix: '+',
      title: 'Verified Properties',
      description: 'Fully vetted rooms and apartments listed.',
      gradientClass: 'grad-teal'
    },
    {
      icon: <FiCreditCard />,
      endVal: 25000,
      suffix: '+',
      title: 'Rent Transactions',
      description: 'Transactions processed securely and on time.',
      gradientClass: 'grad-indigo-teal'
    },
    {
      icon: <FiSmile />,
      endVal: 99,
      suffix: '%',
      title: 'Satisfaction Rate',
      description: 'Users reporting a smooth shared living experience.',
      gradientClass: 'grad-amber'
    }
  ];

  return (
    <section className="stats-section">
      {/* Ambient background blur circles */}
      <div className="stats-bg-glow-1"></div>
      <div className="stats-bg-glow-2"></div>

      <Container>
        <Row className="g-4 justify-content-center stats-grid">
          {statsList.map((stat, idx) => (
            <Col key={idx} xs={12} sm={6} lg={3} className="d-flex justify-content-center">
              <div className={`stats-card animate-fade-up delay-${(idx % 4) + 1} ${stat.gradientClass}`}>
                {/* Soft Glass Glow layer */}
                <div className="stats-glass-backing"></div>
                
                {/* Content Overlay */}
                <div className="stats-card-body">
                  <div className="stats-icon-circle">
                    {stat.icon}
                  </div>
                  <h3 className="stats-counter-value">
                    <AnimatedCounter end={stat.endVal} suffix={stat.suffix} />
                  </h3>
                  <h4 className="stats-card-title">{stat.title}</h4>
                  <p className="stats-card-desc">{stat.description}</p>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
}

export default SplitNestStatistics;
