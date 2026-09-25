import {
  useState,
} from "react";

import {
  useNavigate,
  Link,
} from "react-router-dom";

import {
  FiUser,
  FiHome,
  FiMail,
  FiPhone,
  FiLock,
  FiEye,
  FiEyeOff,
  FiArrowLeft,
} from "react-icons/fi";

import {
  useAuth,
} from "../../context/AuthContext";

import "./Register.css";

function Register() {
  const navigate = useNavigate();

  // ==========================================
  // IMPORTANT FIX
  // ==========================================

  const {
    register,
  } = useAuth();

  // ==========================================
  // STATES
  // ==========================================

  const [role, setRole] =
    useState("user");

  const [fullName, setFullName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [
    agreedTerms,
    setAgreedTerms,
  ] = useState(false);

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  // ==========================================
  // VALIDATION
  // ==========================================

  const validateForm = () => {
    if (!fullName.trim()) {
      return "Please enter your full name.";
    }

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (
      !emailRegex.test(
        email.trim()
      )
    ) {
      return "Please enter a valid email address.";
    }

    const cleanPhone =
      phone.replace(/\D/g, "");

    if (
      cleanPhone.length !== 10
    ) {
      return "Please enter a valid 10 digit phone number.";
    }

    if (
      password.length < 6
    ) {
      return "Password must contain at least 6 characters.";
    }

    if (
      password !==
      confirmPassword
    ) {
      return "Passwords do not match.";
    }

    if (!agreedTerms) {
      return "Please accept Terms & Conditions and Privacy Policy.";
    }

    return "";
  };

  // ==========================================
  // REGISTER SUBMIT
  // ==========================================

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    const validationError =
      validateForm();

    if (validationError) {
      setError(
        validationError
      );

      return;
    }

    try {
      setLoading(true);

      const registerData = {
        fullName:
          fullName.trim(),

        email:
          email
            .trim()
            .toLowerCase(),

        phone:
          phone.trim(),

        password,

        role,
      };

      const result =
        await register(
          registerData
        );

      setSuccess(
        result.message ||
          "Account created successfully."
      );

      localStorage.setItem("splitnest_verify_email", registerData.email);
      localStorage.setItem("splitnest_verify_role", registerData.role);

      setTimeout(() => {
        navigate("/verify-email", {
          state: { email: registerData.email, role: registerData.role },
        });
      }, 500);
    } catch (err) {
      console.error(
        "Registration Error:",
        err
      );

      setError(
        err.message ||
          "Unable to create account."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="register-page">

      {/* ======================================
          LEFT VISUAL SIDE
      ====================================== */}

      <section className="register-visual">

        <div className="register-visual-overlay" />

        <div className="register-brand">

          <div className="register-logo-icon">
            <FiHome />
          </div>

          <span>
            SplitNest
          </span>

        </div>

        <div className="register-visual-content">

          <div className="visual-pill visual-pill-one">

            <span className="visual-pill-icon">
              ✓
            </span>

            <div>

              <small>
                VERIFIED LANDLORDS
              </small>

              <strong>
                100% Secure Nests
              </strong>

            </div>

          </div>

          <div className="register-main-art">
            <img
              src="/register_illustration.png"
              alt="SplitNest shared living illustration"
              className="register-main-illustration"
            />
          </div>

          <div className="visual-pill visual-pill-two">

            <span className="visual-pill-icon">
              <FiUser />
            </span>

            <div>

              <small>
                ROOMMATES FINDER
              </small>

              <strong>
                Compatible Matches
              </strong>

            </div>

          </div>

          <div className="visual-pill visual-pill-three">

            <span className="visual-pill-icon">
              ₹
            </span>

            <div>

              <small>
                UTILITIES LEDGER
              </small>

              <strong>
                Smart Cost Splitting
              </strong>

            </div>

          </div>

        </div>

      </section>


      {/* ======================================
          REGISTER FORM SIDE
      ====================================== */}

      <section className="register-form-section">

        <div className="register-card">

          <div className="register-small-icon">

            <FiHome />

            <FiUser />

          </div>

          <h1>
            Welcome Home
          </h1>

          <p className="register-subtitle">
            Create your account and
            discover smarter shared
            living.
          </p>

          {/* ROLE SELECTOR */}

          <div className="role-selector">

            <button
              type="button"
              className={
                role === "user"
                  ? "role-button active"
                  : "role-button"
              }
              onClick={() =>
                setRole("user")
              }
            >
              <FiUser />

              User
            </button>

            <button
              type="button"
              className={
                role === "owner"
                  ? "role-button active"
                  : "role-button"
              }
              onClick={() =>
                setRole("owner")
              }
            >
              <FiHome />

              Owner
            </button>

          </div>

          {/* ERROR */}

          {error && (
            <div className="register-alert register-error">
              {error}
            </div>
          )}

          {/* SUCCESS */}

          {success && (
            <div className="register-alert register-success">
              {success}
            </div>
          )}

          {/* FORM */}

          <form
            onSubmit={
              handleSubmit
            }
          >

            {/* FULL NAME */}

            <div className="register-field">

              <label>
                Full Name
              </label>

              <div className="register-input-wrapper">

                <FiUser />

                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) =>
                    setFullName(
                      e.target.value
                    )
                  }
                  disabled={loading}
                />

              </div>

            </div>

            {/* EMAIL */}

            <div className="register-field">

              <label>
                Email Address
              </label>

              <div className="register-input-wrapper">

                <FiMail />

                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) =>
                    setEmail(
                      e.target.value
                    )
                  }
                  disabled={loading}
                />

              </div>

            </div>

            {/* PHONE */}

            <div className="register-field">

              <label>
                Phone Number
              </label>

              <div className="register-input-wrapper">

                <FiPhone />

                <input
                  type="tel"
                  placeholder="Enter 10 digit phone number"
                  value={phone}
                  onChange={(e) =>
                    setPhone(
                      e.target.value
                    )
                  }
                  disabled={loading}
                />

              </div>

            </div>

            {/* PASSWORD */}

            <div className="register-field">

              <label>
                Password
              </label>

              <div className="register-input-wrapper">

                <FiLock />

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Create password"
                  value={password}
                  onChange={(e) =>
                    setPassword(
                      e.target.value
                    )
                  }
                  disabled={loading}
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                >

                  {showPassword
                    ? <FiEyeOff />
                    : <FiEye />}

                </button>

              </div>

            </div>

            {/* CONFIRM PASSWORD */}

            <div className="register-field">

              <label>
                Confirm Password
              </label>

              <div className="register-input-wrapper">

                <FiLock />

                <input
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Confirm password"
                  value={
                    confirmPassword
                  }
                  onChange={(e) =>
                    setConfirmPassword(
                      e.target.value
                    )
                  }
                  disabled={loading}
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword
                    )
                  }
                >

                  {showConfirmPassword
                    ? <FiEyeOff />
                    : <FiEye />}

                </button>

              </div>

            </div>

            {/* TERMS */}

            <label className="register-terms">

              <input
                type="checkbox"
                checked={
                  agreedTerms
                }
                onChange={(e) =>
                  setAgreedTerms(
                    e.target.checked
                  )
                }
              />

              <span>
                I agree to the{" "}

                <Link to="/terms">
                  Terms & Conditions
                </Link>

                {" "}and{" "}

                <Link to="/privacy">
                  Privacy Policy
                </Link>
              </span>

            </label>

            {/* BACK TO LOGIN */}

            <button
              type="button"
              className="back-login-btn"
              onClick={() =>
                navigate("/login")
              }
            >

              <FiArrowLeft />

              Back to Login

            </button>

            {/* SUBMIT */}

            <button
              type="submit"
              className="register-submit-btn"
              disabled={loading}
            >

              {loading
                ? "Creating Account..."
                : "🏠 Create My Nest"}

            </button>

          </form>

          <p className="register-login-text">

            Already have an account?{" "}

            <Link to="/login">
              Login
            </Link>

          </p>

        </div>

      </section>

    </div>
  );
}

export default Register;