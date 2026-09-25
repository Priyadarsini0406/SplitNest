import { Modal, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './LoginRequiredModal.css';

function LoginRequiredModal() {
  const { showAuthModal, closeAuthModal } = useAuth();
  const navigate = useNavigate();

  const handleLogin = () => {
    closeAuthModal();
    navigate('/login');
  };

  const handleRegister = () => {
    closeAuthModal();
    navigate('/register');
  };

  const handleClose = () => {
    closeAuthModal();
  };

  return (
    <Modal
      show={showAuthModal}
      onHide={handleClose}
      centered
      animation={true}
      dialogClassName="auth-required-modal-dialog"
      contentClassName="auth-required-modal-content"
    >
      <Modal.Header className="auth-required-modal-header border-0 pb-0 justify-content-center">
        <Modal.Title className="auth-required-modal-title fw-bold text-center">
          🔒 Login Required
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body className="auth-required-modal-body text-center py-4">
        <p className="auth-required-message">
          You need to login before booking a property. Please login or create an account to continue.
        </p>
      </Modal.Body>
      
      <Modal.Footer className="auth-required-modal-footer border-0 pt-0 d-flex flex-column gap-2 w-100">
        <Button 
          onClick={handleLogin} 
          className="btn-modal-primary w-100 py-2.5 fw-semibold"
        >
          Login
        </Button>
        <Button 
          onClick={handleRegister} 
          className="btn-modal-secondary w-100 py-2.5 fw-semibold"
        >
          Register
        </Button>
        <Button 
          onClick={handleClose} 
          variant="link" 
          className="btn-modal-close text-decoration-none mt-1 w-100 text-center"
        >
          Continue Browsing
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default LoginRequiredModal;
