import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const VerifyEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const inputRefs = useRef([]);

  const emailFromState = location.state?.email || "";
  const queryParams = new URLSearchParams(location.search);
  const emailFromQuery = queryParams.get("email") || "";
  const roleFromState = location.state?.role || "";
  const roleFromQuery = queryParams.get("role") || "";
  const role = ["user", "owner"].includes(roleFromState || roleFromQuery)
    ? roleFromState || roleFromQuery
    : localStorage.getItem("splitnest_verify_role") || "user";

  const [email, setEmail] = useState(emailFromState || emailFromQuery);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [timer, setTimer] = useState(60);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (timer <= 0) {
      return;
    }

    const interval = setInterval(() => {
      setTimer((currentTimer) => currentTimer - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const handleOtpChange = (index, value) => {
    const numericValue = value.replace(/\D/g, "");

    if (!numericValue) {
      const updatedOtp = [...otp];
      updatedOtp[index] = "";
      setOtp(updatedOtp);
      return;
    }

    const updatedOtp = [...otp];
    updatedOtp[index] = numericValue.slice(-1);
    setOtp(updatedOtp);

    if (index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    setError("");
    setMessage("");
  };

  const handleKeyDown = (index, event) => {
    if (event.key === "Backspace") {
      if (!otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }

    if (event.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (event.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (event) => {
    event.preventDefault();

    const pastedValue = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    if (!pastedValue) {
      return;
    }

    const updatedOtp = ["", "", "", "", "", ""];

    pastedValue.split("").forEach((number, index) => {
      updatedOtp[index] = number;
    });

    setOtp(updatedOtp);

    const nextFocusIndex = Math.min(pastedValue.length, 5);
    inputRefs.current[nextFocusIndex]?.focus();

    setError("");
    setMessage("");
  };

  const verifyEmail = async (event) => {
    event.preventDefault();

    setError("");
    setMessage("");

    const verificationCode = otp.join("");

    if (!email.trim()) {
      setError("Email address is required.");
      return;
    }

    if (verificationCode.length !== 6) {
      setError("Please enter the complete 6-digit verification code.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API_BASE_URL}/auth/verify-email`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim().toLowerCase(),
            code: verificationCode,
            role,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to verify your email."
        );
      }

      setVerified(true);
      setMessage(
        data.message ||
          "Email verified successfully. Redirecting to login..."
      );

      setTimeout(() => {
        navigate("/login", {
          replace: true,
          state: {
            email: email.trim().toLowerCase(),
            role,
            message: "Email verified successfully. Please login.",
          },
        });
      }, 2000);
    } catch (requestError) {
      setError(
        requestError.message ||
          "Something went wrong while verifying the email."
      );

      setOtp(["", "", "", "", "", ""]);

      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    } finally {
      setLoading(false);
    }
  };

  const resendVerificationCode = async () => {
    setError("");
    setMessage("");

    if (!email.trim()) {
      setError("Enter your email address before requesting a new code.");
      return;
    }

    try {
      setResendLoading(true);

      const response = await fetch(
        `${API_BASE_URL}/auth/resend-verification`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim().toLowerCase(),
            role,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to resend verification code."
        );
      }

      setMessage(
        data.message ||
          "A new verification code has been sent to your email."
      );

      setOtp(["", "", "", "", "", ""]);
      setTimer(60);

      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);

      if (data.devVerificationCode) {
        console.log(
          "Development verification code:",
          data.devVerificationCode
        );
      }
    } catch (requestError) {
      setError(
        requestError.message ||
          "Something went wrong while resending the code."
      );
    } finally {
      setResendLoading(false);
    }
  };

  const maskEmail = (emailValue) => {
    if (!emailValue || !emailValue.includes("@")) {
      return emailValue;
    }

    const [name, domain] = emailValue.split("@");

    if (name.length <= 2) {
      return `${name[0] || ""}***@${domain}`;
    }

    return `${name.slice(0, 2)}${"*".repeat(
      Math.max(name.length - 2, 3)
    )}@${domain}`;
  };

  return (
    <div style={styles.page}>
      <div style={styles.backgroundCircleOne} />
      <div style={styles.backgroundCircleTwo} />

      <div style={styles.card}>
        <button
          type="button"
          onClick={() => navigate("/register")}
          style={styles.backButton}
        >
          ← Back
        </button>

        <div style={styles.iconWrapper}>
          {verified ? "✓" : "✉"}
        </div>

        <h1 style={styles.title}>
          {verified ? "Email Verified" : "Verify Your Email"}
        </h1>

        <p style={styles.description}>
          {verified
            ? "Your account has been activated successfully."
            : "We sent a 6-digit verification code to your email address."}
        </p>

        {!verified && email && (
          <p style={styles.emailText}>{maskEmail(email)}</p>
        )}

        {!verified && (
          <form onSubmit={verifyEmail}>
            {!emailFromState && !emailFromQuery && (
              <div style={styles.formGroup}>
                <label style={styles.label}>Email Address</label>

                <input
                  type="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setError("");
                    setMessage("");
                  }}
                  placeholder="Enter your email address"
                  style={styles.emailInput}
                  disabled={loading || resendLoading}
                />
              </div>
            )}

            <div style={styles.otpContainer} onPaste={handlePaste}>
              {otp.map((number, index) => (
                <input
                  key={index}
                  ref={(element) => {
                    inputRefs.current[index] = element;
                  }}
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={1}
                  value={number}
                  onChange={(event) =>
                    handleOtpChange(index, event.target.value)
                  }
                  onKeyDown={(event) =>
                    handleKeyDown(index, event)
                  }
                  disabled={loading || resendLoading}
                  style={{
                    ...styles.otpInput,
                    borderColor: number
                      ? "#6c63ff"
                      : "rgba(255,255,255,0.16)",
                  }}
                />
              ))}
            </div>

            {error && (
              <div style={styles.errorMessage}>{error}</div>
            )}

            {message && (
              <div style={styles.successMessage}>{message}</div>
            )}

            <button
              type="submit"
              disabled={loading || otp.join("").length !== 6}
              style={{
                ...styles.verifyButton,
                opacity:
                  loading || otp.join("").length !== 6 ? 0.6 : 1,
                cursor:
                  loading || otp.join("").length !== 6
                    ? "not-allowed"
                    : "pointer",
              }}
            >
              {loading ? "Verifying..." : "Verify Email"}
            </button>

            <div style={styles.resendSection}>
              <span style={styles.resendText}>
                Didn&apos;t receive the code?
              </span>

              {timer > 0 ? (
                <span style={styles.timerText}>
                  Resend in {timer}s
                </span>
              ) : (
                <button
                  type="button"
                  onClick={resendVerificationCode}
                  disabled={resendLoading}
                  style={styles.resendButton}
                >
                  {resendLoading
                    ? "Sending..."
                    : "Resend Code"}
                </button>
              )}
            </div>

            <p style={styles.helpText}>
              Check your spam or promotions folder if you cannot find
              the email.
            </p>
          </form>
        )}

        {verified && (
          <button
            type="button"
            onClick={() => navigate("/login")}
            style={styles.verifyButton}
          >
            Go to Login
          </button>
        )}
      </div>
    </div>
  );
};

const styles = {
  page: {
    position: "relative",
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px",
    overflow: "hidden",
    background:
      "linear-gradient(135deg, #090c1b 0%, #15112f 45%, #071421 100%)",
    fontFamily:
      "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },

  backgroundCircleOne: {
    position: "absolute",
    width: "420px",
    height: "420px",
    top: "-160px",
    left: "-120px",
    borderRadius: "50%",
    background:
      "radial-gradient(circle, rgba(108,99,255,0.45), transparent 68%)",
    filter: "blur(8px)",
  },

  backgroundCircleTwo: {
    position: "absolute",
    width: "420px",
    height: "420px",
    right: "-130px",
    bottom: "-160px",
    borderRadius: "50%",
    background:
      "radial-gradient(circle, rgba(0,212,255,0.32), transparent 68%)",
    filter: "blur(10px)",
  },

  card: {
    position: "relative",
    zIndex: 1,
    width: "100%",
    maxWidth: "520px",
    padding: "38px",
    borderRadius: "28px",
    background: "rgba(13, 18, 39, 0.82)",
    border: "1px solid rgba(255,255,255,0.12)",
    boxShadow: "0 30px 90px rgba(0,0,0,0.45)",
    backdropFilter: "blur(24px)",
    WebkitBackdropFilter: "blur(24px)",
    color: "#ffffff",
    textAlign: "center",
  },

  backButton: {
    position: "absolute",
    top: "22px",
    left: "24px",
    border: "none",
    background: "transparent",
    color: "#aeb8d4",
    fontSize: "14px",
    cursor: "pointer",
  },

  iconWrapper: {
    width: "78px",
    height: "78px",
    margin: "8px auto 22px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "24px",
    background:
      "linear-gradient(135deg, rgba(108,99,255,0.95), rgba(0,212,255,0.85))",
    boxShadow: "0 15px 40px rgba(108,99,255,0.35)",
    fontSize: "34px",
    fontWeight: "800",
  },

  title: {
    margin: "0 0 12px",
    fontSize: "30px",
    fontWeight: "800",
    letterSpacing: "-0.5px",
  },

  description: {
    margin: "0 auto",
    maxWidth: "390px",
    color: "#aeb8d4",
    fontSize: "15px",
    lineHeight: "1.7",
  },

  emailText: {
    margin: "14px 0 25px",
    color: "#62dcff",
    fontSize: "15px",
    fontWeight: "700",
  },

  formGroup: {
    marginTop: "24px",
    textAlign: "left",
  },

  label: {
    display: "block",
    marginBottom: "9px",
    color: "#dce3f6",
    fontSize: "14px",
    fontWeight: "600",
  },

  emailInput: {
    width: "100%",
    boxSizing: "border-box",
    padding: "14px 16px",
    borderRadius: "13px",
    border: "1px solid rgba(255,255,255,0.14)",
    outline: "none",
    background: "rgba(255,255,255,0.06)",
    color: "#ffffff",
    fontSize: "15px",
  },

  otpContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    margin: "30px 0 24px",
  },

  otpInput: {
    width: "52px",
    height: "60px",
    borderRadius: "14px",
    border: "1px solid",
    outline: "none",
    background: "rgba(255,255,255,0.06)",
    color: "#ffffff",
    textAlign: "center",
    fontSize: "24px",
    fontWeight: "800",
    transition: "0.2s ease",
  },

  verifyButton: {
    width: "100%",
    marginTop: "10px",
    padding: "15px 20px",
    border: "none",
    borderRadius: "14px",
    background:
      "linear-gradient(135deg, #6c63ff 0%, #00b8e6 100%)",
    color: "#ffffff",
    fontSize: "16px",
    fontWeight: "800",
    boxShadow: "0 14px 30px rgba(72, 92, 255, 0.28)",
    cursor: "pointer",
  },

  resendSection: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "8px",
    marginTop: "22px",
  },

  resendText: {
    color: "#98a4c1",
    fontSize: "14px",
  },

  timerText: {
    color: "#62dcff",
    fontSize: "14px",
    fontWeight: "700",
  },

  resendButton: {
    border: "none",
    padding: 0,
    background: "transparent",
    color: "#62dcff",
    fontSize: "14px",
    fontWeight: "800",
    cursor: "pointer",
  },

  errorMessage: {
    marginBottom: "14px",
    padding: "12px 14px",
    borderRadius: "11px",
    border: "1px solid rgba(255,89,110,0.25)",
    background: "rgba(255,89,110,0.1)",
    color: "#ff8b9b",
    fontSize: "14px",
  },

  successMessage: {
    marginBottom: "14px",
    padding: "12px 14px",
    borderRadius: "11px",
    border: "1px solid rgba(54,211,153,0.25)",
    background: "rgba(54,211,153,0.1)",
    color: "#6ee7b7",
    fontSize: "14px",
  },

  helpText: {
    margin: "20px 0 0",
    color: "#71809f",
    fontSize: "12px",
    lineHeight: "1.6",
  },
};

export default VerifyEmail;