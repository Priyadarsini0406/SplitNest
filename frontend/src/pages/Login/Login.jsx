import { useState, useEffect } from 'react';
import { Container, Row, Col, Form } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  FiHome, 
  FiUsers, 
  FiMail, 
  FiLock, 
  FiEye, 
  FiEyeOff, 
  FiCreditCard, 
  FiCalendar, 
  FiCompass,
  FiUser,
  FiDollarSign,
  FiBell
} from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { FaMicrosoft } from 'react-icons/fa';
import './Login.css';

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, userRole, login, pendingAction, clearPendingAction } = useAuth();
  
  useEffect(() => {
    if (isLoggedIn) {
      navigate(userRole === 'owner' ? '/owner-dashboard' : '/dashboard');
    }
  }, [isLoggedIn, userRole, navigate]);
  
  const [role, setRole] = useState('user'); // 'user' or 'owner'
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [authError, setAuthError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    try {
      setSubmitting(true);
      const loggedUser = await login({ email: email.trim(), password, role });
      if (pendingAction && pendingAction.path) {
        const redirectPath = pendingAction.path;
        clearPendingAction();
        navigate(redirectPath);
      } else if (location.state && location.state.redirectTo) {
        navigate(location.state.redirectTo);
      } else {
        navigate(loggedUser.role === 'owner' ? '/owner-dashboard' : '/dashboard');
      }
    } catch (error) {
      setAuthError(error.message || 'Unable to sign in');
    } finally { setSubmitting(false); }
  };

  return (
    <div className="login-page-container">
      {/* Dynamic Background Elements for Right Side & Behind Card */}
      <div className="bg-glow bg-glow-primary"></div>
      <div className="bg-glow bg-glow-secondary"></div>

      <Container fluid className="p-0 h-100">
        <Row className="g-0 h-100">
          
          {/* LEFT SIDE (60%): Interactive Startups Illustration & Graphics */}
          <Col lg={7} className="login-graphic-column d-none d-lg-flex">
            {/* Glowing spots */}
            <div className="graphic-glow-1"></div>
            <div className="graphic-glow-2"></div>
            <div className="graphic-glow-3"></div>

            {/* Connecting curved lines (SVG Overlay) */}
            <svg className="svg-connecting-lines" viewBox="0 0 800 600" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M 150 150 C 300 100, 500 200, 650 150" stroke="rgba(255,255,255,0.15)" strokeWidth="2" strokeDasharray="6,6" />
              <path d="M 120 450 C 250 500, 480 320, 680 480" stroke="rgba(255,255,255,0.15)" strokeWidth="2" strokeDasharray="6,6" />
              <path d="M 680 150 C 650 300, 690 400, 680 480" stroke="rgba(255,255,255,0.15)" strokeWidth="2" strokeDasharray="6,6" />
            </svg>

            <div className="graphic-content-wrapper">
              {/* Central Premium Generated Illustration */}
              <div className="illustration-holder-shadow animate-float-y">
                <img 
                  src="/login_illustration.png" 
                  alt="SplitNest Co-living & Rent Splitting Illustration" 
                  className="graphic-illustration-image"
                />
              </div>

              {/* FLOATING GLASSMAPPING OVERLAY CARDS */}
              
              {/* Card 1: Rent Split Graph info (Top-Left) */}
              <div className="floating-glass-card card-rent-split float-delay-1">
                <div className="card-icon-round bg-success-glow">
                  <FiDollarSign />
                </div>
                <div className="card-text-block">
                  <span className="card-lbl">Rent Splitting</span>
                  <p className="card-val">Ledger Active</p>
                </div>
              </div>

              {/* Card 2: Property details badge (Bottom-Left) */}
              <div className="floating-glass-card card-nest-status float-delay-2">
                <div className="card-icon-round bg-primary-glow">
                  <FiCompass />
                </div>
                <div className="card-text-block">
                  <span className="card-lbl">Active Nest</span>
                  <p className="card-val">Fairlands, Salem</p>
                </div>
              </div>

              {/* Card 3: New notification message bubble (Top-Right) */}
              <div className="floating-glass-card card-notify float-delay-3">
                <div className="card-icon-round bg-accent-glow">
                  <FiBell />
                </div>
                <div className="card-text-block">
                  <span className="card-lbl">Notification</span>
                  <p className="card-val">Sarah sent rent share</p>
                </div>
              </div>

              {/* Floating Decorative Icon Bubbles */}
              <div className="bubble-dec bubble-credit-card float-delay-2">
                <FiCreditCard />
              </div>
              <div className="bubble-dec bubble-calendar float-delay-1">
                <FiCalendar />
              </div>
              <div className="bubble-dec bubble-home-icon float-delay-3">
                <FiHome />
              </div>
            </div>
          </Col>

          {/* RIGHT SIDE (40%): Premium Login card */}
          <Col lg={5} md={12} className="login-form-column d-flex align-items-center justify-content-center">
            
            {/* Header branding overlay (Logo & Home button to /) */}
            <div className="login-top-logo animate-fade-in">
              <Link to="/" className="login-logo-link" aria-label="Go to Home">
                <div className="login-logo-mark">
                  <FiHome className="brand-icon-home" />
                  <div className="brand-split-line"></div>
                  <FiUsers className="brand-icon-users" />
                </div>
              </Link>
            </div>

            <div className="login-glass-card animate-slide-up">
              
              {/* Title & subtitle block */}
              <div className="login-header-group text-center">
                <h2 className="login-card-title">Welcome Back</h2>
                <p className="login-card-subtitle">
                  {role === 'user' 
                    ? 'Find your next home and manage shared living effortlessly.' 
                    : 'Manage properties, vet tenants, and receive rent settlements smoothly.'
                  }
                </p>
              </div>

              {/* ROLE SELECTOR CARDS */}
              <div className="role-selector-wrapper">
                {/* User Role */}
                <div 
                  className={`role-toggle-card ${role === 'user' ? 'active' : ''}`}
                  onClick={() => setRole('user')}
                >
                  <div className="role-icon-box">
                    <FiUser />
                  </div>
                  <span className="role-name">User</span>
                </div>

                {/* Property Owner Role */}
                <div 
                  className={`role-toggle-card ${role === 'owner' ? 'active' : ''}`}
                  onClick={() => setRole('owner')}
                >
                  <div className="role-icon-box">
                    <FiHome />
                  </div>
                  <span className="role-name">Owner</span>
                </div>
              </div>

              {/* LOGIN FORM */}
              <Form onSubmit={handleLoginSubmit} className="login-form-fields mt-4">
                {authError && <div className="alert alert-danger py-2">{authError}</div>}
                
                {/* Email Field */}
                <Form.Group className="mb-3" controlId="loginEmail">
                  <Form.Label className="login-input-label">Email Address</Form.Label>
                  <div className="input-with-icon">
                    <FiMail className="input-icon-left" />
                    <Form.Control 
                      type="email" 
                      placeholder="name@example.com" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="login-custom-input"
                      required 
                    />
                  </div>
                </Form.Group>

                {/* Password Field */}
                <Form.Group className="mb-3" controlId="loginPassword">
                  <Form.Label className="login-input-label">Password</Form.Label>
                  <div className="input-with-icon">
                    <FiLock className="input-icon-left" />
                    <Form.Control 
                      type={showPassword ? "text" : "password"} 
                      placeholder="••••••••" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="login-custom-input password-input"
                      required 
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowPassword(!showPassword)} 
                      className="password-toggle-btn"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                </Form.Group>

                {/* Remember & Forgot options */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <Form.Check 
                    type="checkbox" 
                    id="rememberMeCheckbox"
                    label="Remember me"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="login-remember-check"
                  />
                  <Link to={`/forgot-password?role=${role}`} className="login-forgot-link">
                    Forgot Password?
                  </Link>
                </div>

                {/* Submit button */}
                <button type="submit" className="btn-login-gradient-submit" disabled={submitting}>
                  {submitting ? "Signing In..." : "Sign In"}
                </button>

              </Form>

              {/* Create account navigation footer */}
              <div className="login-card-footer text-center mt-4">
                <span>New to SplitNest? </span>
                <Link to="/register" className="register-link-accent">
                  Create an Account
                </Link>
              </div>

            </div>

          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Login;
