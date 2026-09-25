import { useState, useEffect } from 'react';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiHome, FiUsers } from 'react-icons/fi';
import './Navbar.css';
import { useAuth } from '../../context/AuthContext';

function SplitNestNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [activeLink, setActiveLink] = useState('home');

  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, logout } = useAuth();

  // Handle scroll trigger for navbar shrink
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (targetId) => {
    const element = document.getElementById(targetId);
    if (element) {
      const navbarHeight = scrolled ? 64 : 72;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - navbarHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
      setActiveLink(targetId);
    }
  };

  // Smooth scroll handler with route awareness
  const handleNavLinkClick = (e, targetId) => {
    e.preventDefault();
    setExpanded(false);

    if (location.pathname !== '/') {
      // Navigate to landing page and pass the targetId in router state
      navigate('/', { state: { scrollTo: targetId } });
    } else {
      // If already on landing page, scroll directly
      scrollToSection(targetId);
    }
  };

  // Listen to router navigation state to trigger scrolls when arriving from another page
  useEffect(() => {
    if (location.pathname === '/' && location.state?.scrollTo) {
      const targetId = location.state.scrollTo;
      const timer = setTimeout(() => {
        scrollToSection(targetId);
        // Clear router state to avoid re-triggering on subsequent page events
        navigate('/', { replace: true, state: {} });
      }, 150);
      return () => clearTimeout(timer);
    } else if (location.pathname === '/') {
      // Determine active link based on scroll position or default
      setActiveLink('home');
    } else {
      // Deactivate landing anchors if on subpages
      setActiveLink('');
    }
  }, [location]);

  return (
    <Navbar
      expand="lg"
      fixed="top"
      expanded={expanded}
      onToggle={(isOpen) => setExpanded(isOpen)}
      className={`splitnest-navbar ${scrolled ? 'scrolled' : ''} ${
        expanded ? 'mobile-expanded' : ''
      }`}
    >
      <Container>
        {/* Custom Logo Mark (Link to /) */}
        <Navbar.Brand as={Link} to="/" onClick={() => setExpanded(false)} className="navbar-brand-link">
          <div className="logo-icon-container">
            <FiHome className="icon-home" />
            <div className="logo-split-line"></div>
            <FiUsers className="icon-users" />
          </div>
          <span className="logo-text-split">
            Split<span className="logo-text-nest">Nest</span>
          </span>
        </Navbar.Brand>

        {/* Animated Custom Hamburger Menu Toggle */}
        <Navbar.Toggle
          aria-controls="responsive-navbar-nav"
          className={`custom-navbar-toggler ${expanded ? 'expanded' : ''}`}
        >
          <span className="burger-icon">
            <span className="burger-line"></span>
            <span className="burger-line"></span>
            <span className="burger-line"></span>
          </span>
        </Navbar.Toggle>

        {/* Navbar Links and Action Buttons */}
        <Navbar.Collapse id="responsive-navbar-nav" className="navbar-collapse-custom">
          {/* Centered Navigation */}
          <Nav className="mx-auto navbar-nav-center">
            <Nav.Link
              href="#home"
              onClick={(e) => handleNavLinkClick(e, 'home')}
              className={`nav-link-custom ${activeLink === 'home' ? 'active' : ''}`}
            >
              Home
            </Nav.Link>
            <Nav.Link
              href="#features"
              onClick={(e) => handleNavLinkClick(e, 'features')}
              className={`nav-link-custom ${activeLink === 'features' ? 'active' : ''}`}
            >
              Features
            </Nav.Link>
            <Nav.Link
              href="#properties"
              onClick={(e) => handleNavLinkClick(e, 'properties')}
              className={`nav-link-custom ${activeLink === 'properties' ? 'active' : ''}`}
            >
              Properties
            </Nav.Link>
            <Nav.Link
              href="#about"
              onClick={(e) => handleNavLinkClick(e, 'about')}
              className={`nav-link-custom ${activeLink === 'about' ? 'active' : ''}`}
            >
              About
            </Nav.Link>
            <Nav.Link
              href="#contact"
              onClick={(e) => handleNavLinkClick(e, 'contact')}
              className={`nav-link-custom ${activeLink === 'contact' ? 'active' : ''}`}
            >
              Contact
            </Nav.Link>
          </Nav>

          {/* Button Group (Login + Register/Get Started as Links) */}
          <div className="navbar-buttons-group">
            {isLoggedIn ? (
              <>
                <Button
                  as={Link}
                  to="/dashboard"
                  variant="outline-light"
                  className="btn-login-custom"
                  onClick={() => setExpanded(false)}
                >
                  Dashboard
                </Button>
                <Button
                  className="btn-getstarted-custom"
                  onClick={() => {
                    setExpanded(false);
                    logout();
                    navigate('/');
                  }}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button
                  as={Link}
                  to="/login"
                  variant="outline-light"
                  className="btn-login-custom"
                  onClick={() => setExpanded(false)}
                >
                  Login
                </Button>
                <Button
                  as={Link}
                  to="/register"
                  className="btn-getstarted-custom"
                  onClick={() => setExpanded(false)}
                >
                  Register
                </Button>
              </>
            )}
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default SplitNestNavbar;
