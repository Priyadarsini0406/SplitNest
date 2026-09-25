import { useState } from "react";
import { Container, Form, Alert } from "react-bootstrap";
import { Link, useSearchParams } from "react-router-dom";
import { FiHome, FiUsers, FiMail, FiArrowLeft } from "react-icons/fi";
import "./ForgotPassword.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ||
  `${window.location.protocol}//${window.location.hostname}:5000/api`;

function ForgotPassword() {
  const [searchParams] = useSearchParams();
  const role = ["user", "owner"].includes(searchParams.get("role"))
    ? searchParams.get("role")
    : "user";
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [devResetUrl, setDevResetUrl] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");
    setDevResetUrl("");
    setLoading(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/auth/forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
            role,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Unable to send reset link.");
      }

      setMessage(result.message);

      if (result.devResetUrl) {
        setDevResetUrl(result.devResetUrl);
      }
    } catch (err) {
      console.error("Forgot Password Error:", err);

      if (err.name === "TypeError") {
        setError(
          "Cannot connect to backend. Please make sure the backend server is running."
        );
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-page-container">
      <div className="forgot-bg-glow"></div>

      <Container className="d-flex align-items-center justify-content-center min-vh-100">
        <div className="forgot-card-wrapper animate-slide-up">
          <div className="forgot-roof-line"></div>

          <div className="forgot-glass-card p-5">
            <div className="forgot-logo-block text-center mb-4">
              <Link to="/" className="forgot-logo-link">
                <div className="forgot-logo-mark">
                  <FiHome className="brand-icon-home" />
                  <div className="brand-split-line"></div>
                  <FiUsers className="brand-icon-users" />
                </div>
              </Link>
            </div>

            <h2 className="forgot-title text-center">
              Reset Password
            </h2>

            <p className="forgot-subtitle text-center mb-4">
              Enter your registered email. SplitNest will send a password reset
              link for your {role === "owner" ? "Owner" : "User"} account.
            </p>

            {message && (
              <Alert variant="success">
                {message}
              </Alert>
            )}

            {error && (
              <Alert variant="danger">
                {error}
              </Alert>
            )}

            {devResetUrl && (
              <Alert variant="warning">
                Gmail SMTP is not configured yet.
                <br />
                <a
                  href={devResetUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Open Reset Link
                </a>
              </Alert>
            )}

            <Form onSubmit={handleSubmit}>
              <Form.Group
                className="mb-4"
                controlId="forgotEmail"
              >
                <Form.Label className="forgot-label">
                  Email Address
                </Form.Label>

                <div className="forgot-input-wrapper">
                  <FiMail className="forgot-input-icon" />

                  <Form.Control
                    type="email"
                    placeholder="name@example.com"
                    className="forgot-custom-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </Form.Group>

              <button
                type="submit"
                className="btn-forgot-submit mb-3"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </button>

              <Link
                to="/login"
                className="btn-forgot-back-outline"
              >
                <FiArrowLeft className="back-arrow-icon" />
                &nbsp;Back to Login
              </Link>
            </Form>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default ForgotPassword;