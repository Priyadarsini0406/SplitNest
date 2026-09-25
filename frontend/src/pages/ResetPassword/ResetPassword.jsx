import { useState } from "react";
import { Container, Form, Alert, Button } from "react-bootstrap";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ||
  `${window.location.protocol}//${window.location.hostname}:5000/api`;

function ResetPassword() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: params.get("email"),
          role: params.get("role") || "user",
          token: params.get("token"),
          password,
        }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Unable to reset password");
      setMessage(result.message);
      setTimeout(() => navigate("/login"), 1200);
    } catch (requestError) {
      setError(requestError.message || "Unable to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5" style={{ maxWidth: 520 }}>
      <div className="p-4 bg-white rounded shadow-sm">
        <h2>Set New Password</h2>
        <p>Choose a new SplitNest password.</p>
        {message && <Alert variant="success">{message}</Alert>}
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={submit}>
          <Form.Control className="mb-3" type="password" placeholder="New password" value={password} onChange={(e) => setPassword(e.target.value)} minLength={6} required />
          <Form.Control className="mb-3" type="password" placeholder="Confirm password" value={confirm} onChange={(e) => setConfirm(e.target.value)} minLength={6} required />
          <Button type="submit" className="w-100" disabled={loading}>
            {loading ? "Resetting..." : "Reset Password"}
          </Button>
        </Form>
        <Link to="/login" className="d-block text-center mt-3">Back to Login</Link>
      </div>
    </Container>
  );
}

export default ResetPassword;
