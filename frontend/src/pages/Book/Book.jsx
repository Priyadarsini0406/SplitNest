import { useEffect, useMemo, useState } from "react";

import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Modal,
  Badge,
  Alert,
  Spinner,
} from "react-bootstrap";

import {
  useParams,
  useNavigate,
  Link,
} from "react-router-dom";

import {
  FiArrowLeft,
  FiCalendar,
  FiCheckCircle,
  FiCreditCard,
  FiUsers,
  FiUser,
  FiMapPin,
} from "react-icons/fi";

import { useAuth } from "../../context/AuthContext";

import "./Book.css";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  `${window.location.protocol}//${window.location.hostname}:5000/api`;

function Book() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    isLoggedIn,
    openAuthModal,
    userId,
    user,
    authHeaders,
  } = useAuth();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [checkInDate, setCheckInDate] = useState("");
  const [sharingType, setSharingType] = useState("double");
  const [splitLedgerEnabled, setSplitLedgerEnabled] = useState(true);

  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // ==========================================
  // FIND PROPERTY
  // ==========================================

  const [liveProperty, setLiveProperty] = useState(null);
  const [propertyLoading, setPropertyLoading] = useState(true);

  useEffect(() => {
    setPropertyLoading(true);
    fetch(`${API_BASE_URL}/public-properties/${id}`)
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.message || "Property not found");
        setLiveProperty(result.data || null);
      })
      .catch((err) => setError(err.message || "Unable to load property."))
      .finally(() => setPropertyLoading(false));
  }, [id]);

  const property = liveProperty;

  // ==========================================
  // AUTH CHECK
  // ==========================================

  useEffect(() => {
    if (!isLoggedIn && property) {
      openAuthModal({
        action: "book",
        propertyId: property._id || id,
        path: `/book/${property._id || id}`,
      });

      navigate("/", {
        replace: true,
      });
    }
  }, [
    isLoggedIn,
    navigate,
    openAuthModal,
    property,
  ]);

  // ==========================================
  // PROPERTY NOT FOUND
  // ==========================================

  if (propertyLoading) {
    return <div className="booking-page-wrapper d-flex align-items-center justify-content-center"><Spinner animation="border" /></div>;
  }

  if (!property) {
    return (
      <div className="booking-page-wrapper">
        <Container className="booking-container py-5">

          <Card className="booking-glass-card p-5 text-center">

            <h3 className="text-white mb-3">
              Property Not Found
            </h3>

            <p className="text-muted">
              The property you are trying to book
              does not exist.
            </p>

            <Button
              onClick={() =>
                navigate("/properties")
              }
            >
              Browse Properties
            </Button>

          </Card>

        </Container>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="booking-page-wrapper d-flex align-items-center justify-content-center">

        <Spinner animation="border" />

      </div>
    );
  }

  // ==========================================
  // COST CALCULATION
  // ==========================================

  const baseRent =
    Number(property.rent) || 0;

  const deposit =
    Number(property.deposit) || 0;

  const adminFee = 500;

  const estimatedUtilities = 1200;

  const totalDue =
    baseRent +
    deposit +
    adminFee;

  // ==========================================
  // VALIDATION
  // ==========================================

  const validateForm = () => {
    if (!fullName.trim()) {
      return "Please enter your full name.";
    }

    const cleanPhone =
      phone.replace(/\D/g, "");

    if (cleanPhone.length < 10) {
      return "Please enter a valid phone number.";
    }

    if (!checkInDate) {
      return "Please select a check-in date.";
    }

    const selectedDate =
      new Date(checkInDate);

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      return "Check-in date cannot be in the past.";
    }

    return "";
  };

  // ==========================================
  // BOOKING SUBMIT
  // ==========================================

  const handleBookingSubmit = async (event) => {
    event.preventDefault();

    setError("");

    const validationError =
      validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setSubmitting(true);

      const bookingData = {
        propertyId: String(property._id || id),

        propertyName: property.name,

        userId,
        ownerId: property.ownerId || null,

        fullName:
          fullName.trim(),

        email: user?.email || "",

        phone:
          phone.trim(),

        checkInDate,

        sharingType,

        splitLedgerEnabled,

        baseRent,

        deposit,

        adminFee,

        estimatedUtilities,

        totalDue,
      };

      const response = await fetch(
        `${API_BASE_URL}/bookings`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            ...authHeaders,
          },

          body: JSON.stringify(
            bookingData
          ),
        }
      );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Booking failed."
        );
      }

      console.log(
        "Booking saved successfully:",
        result.data
      );

      setShowSuccessModal(true);
    } catch (err) {
      console.error(
        "Booking Error:",
        err
      );

      setError(
        err.message ||
          "Unable to complete booking."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ==========================================
  // MODAL CLOSE
  // ==========================================

  const handleModalClose = () => {
    setShowSuccessModal(false);

    navigate("/my-bookings");
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="booking-page-wrapper">

      {/* BACKGROUND */}

      <div className="bg-glow bg-glow-primary"></div>

      <div className="bg-glow bg-glow-secondary"></div>


      <Container className="py-5 booking-container">

        {/* BACK */}

        <div className="mb-4">

          <Link
            to={`/property-details/${property._id || id}`}
            className="back-link d-inline-flex align-items-center gap-2 text-decoration-none"
          >
            <FiArrowLeft />

            Back to Details
          </Link>

        </div>


        <h1 className="fw-bold text-white mb-4">
          Complete Your Reservation
        </h1>


        {error && (
          <Alert variant="danger">
            {error}
          </Alert>
        )}


        <Row className="g-4">

          {/* =====================================
              LEFT SIDE
          ===================================== */}

          <Col lg={7}>

            <Card className="booking-glass-card border-0 p-4">

              <h4 className="text-white fw-bold mb-4">
                1. Occupant Information
              </h4>


              <Form
                onSubmit={
                  handleBookingSubmit
                }
              >

                <Row className="g-3 mb-4">

                  {/* NAME */}

                  <Col md={12}>

                    <Form.Group controlId="bookingName">

                      <Form.Label className="small text-light">
                        Full Name
                      </Form.Label>

                      <div className="input-with-icon-wrapper">

                        <FiUser className="input-field-icon" />

                        <Form.Control
                          type="text"

                          placeholder="Enter your full name"

                          value={fullName}

                          onChange={(e) =>
                            setFullName(
                              e.target.value
                            )
                          }

                          className="booking-custom-input"

                          required
                        />

                      </div>

                    </Form.Group>

                  </Col>


                  {/* PHONE */}

                  <Col md={12}>

                    <Form.Group controlId="bookingPhone">

                      <Form.Label className="small text-light">
                        Phone Number
                      </Form.Label>

                      <div className="input-with-icon-wrapper">

                        <FiUser className="input-field-icon" />

                        <Form.Control
                          type="tel"

                          placeholder="+91 XXXXX XXXXX"

                          value={phone}

                          onChange={(e) =>
                            setPhone(
                              e.target.value
                            )
                          }

                          className="booking-custom-input"

                          required
                        />

                      </div>

                    </Form.Group>

                  </Col>

                </Row>


                {/* LEASE */}

                <h4 className="text-white fw-bold mb-4">
                  2. Lease Details
                </h4>


                <Row className="g-3 mb-4">

                  {/* DATE */}

                  <Col md={6}>

                    <Form.Group controlId="bookingDate">

                      <Form.Label className="small text-light">
                        Preferred Check-In Date
                      </Form.Label>

                      <div className="input-with-icon-wrapper">

                        <FiCalendar className="input-field-icon" />

                        <Form.Control
                          type="date"

                          value={
                            checkInDate
                          }

                          onChange={(e) =>
                            setCheckInDate(
                              e.target.value
                            )
                          }

                          className="booking-custom-input"

                          required
                        />

                      </div>

                    </Form.Group>

                  </Col>


                  {/* SHARING */}

                  <Col md={6}>

                    <Form.Group controlId="bookingSharing">

                      <Form.Label className="small text-light">
                        Occupancy Selection
                      </Form.Label>

                      <div className="input-with-icon-wrapper">

                        <FiUsers className="input-field-icon" />

                        <Form.Select
                          value={
                            sharingType
                          }

                          onChange={(e) =>
                            setSharingType(
                              e.target.value
                            )
                          }

                          className="booking-custom-input"
                        >

                          {(property?.sharingOptions?.length
                            ? property.sharingOptions
                            : ["single", "double", "triple"]
                          ).map((option) => (
                            <option key={option} value={option}>
                              {option.charAt(0).toUpperCase() + option.slice(1)} {option === "single" ? "Occupancy" : "Sharing"}
                            </option>
                          ))}

                        </Form.Select>

                      </div>

                    </Form.Group>

                  </Col>

                </Row>


                {/* LEDGER */}

                <h4 className="text-white fw-bold mb-3">
                  3. SplitNest Co-Living Harmony
                </h4>


                <Form.Check
                  type="switch"

                  id="splitLedgerSwitch"

                  label="Enable Automatic Rent Splitting & Utility Ledger"

                  checked={
                    splitLedgerEnabled
                  }

                  onChange={(e) =>
                    setSplitLedgerEnabled(
                      e.target.checked
                    )
                  }

                  className="mb-4 text-light custom-switch-style"
                />


                {/* SUBMIT */}

                <Button
                  type="submit"

                  className="w-100 btn-confirm-booking py-3 fw-bold"

                  disabled={
                    submitting
                  }
                >

                  {
                    submitting
                      ? "Processing..."
                      : "Settle & Request Booking"
                  }

                  {!submitting && (

                    <FiCheckCircle className="ms-2" />

                  )}

                </Button>

              </Form>

            </Card>

          </Col>


          {/* =====================================
              RIGHT SIDE
          ===================================== */}

          <Col lg={5}>

            <Card className="booking-summary-card border-0 p-4 mb-4">

              <h4 className="text-white fw-bold mb-3">
                Nest Summary
              </h4>


              <div className="d-flex align-items-center gap-3 mb-4">

                <div className="summary-img-holder">

                  <img
                    src={
                      property.image ||
                      "https://placehold.co/500x350?text=SplitNest"
                    }

                    alt={
                      property.name
                    }
                  />

                </div>


                <div>

                  <h6 className="fw-bold text-white mb-1">

                    {
                      property.name
                    }

                  </h6>


                  <p className="text-muted small mb-0">

                    <FiMapPin className="text-teal me-1" />

                    {
                      property.location ||
                      property.area ||
                      "Salem"
                    }

                  </p>


                  <Badge
                    bg="light"

                    text="dark"

                    className="border mt-1"
                  >

                    {
                      property.type ||
                      "Property"
                    }

                  </Badge>

                </div>

              </div>


              <hr className="border-secondary-subtle my-3" />


              <h5 className="fw-bold text-white mb-3">
                Cost Summary Breakdown
              </h5>


              <div className="financial-breakdown text-muted small">

                <div className="d-flex justify-content-between mb-2">

                  <span>
                    Monthly Base Rent
                  </span>

                  <span className="text-white">

                    ₹
                    {
                      baseRent.toLocaleString(
                        "en-IN"
                      )
                    }

                  </span>

                </div>


                <div className="d-flex justify-content-between mb-2">

                  <span>
                    Refundable Security Deposit
                  </span>

                  <span className="text-white">

                    ₹
                    {
                      deposit.toLocaleString(
                        "en-IN"
                      )
                    }

                  </span>

                </div>


                <div className="d-flex justify-content-between mb-2">

                  <span>
                    One-time Setup & Admin Fee
                  </span>

                  <span className="text-white">

                    ₹
                    {
                      adminFee.toLocaleString(
                        "en-IN"
                      )
                    }

                  </span>

                </div>


                <div className="d-flex justify-content-between mb-2">

                  <span>
                    Estimated Monthly Utilities
                  </span>

                  <span className="text-white">

                    ₹
                    {
                      estimatedUtilities.toLocaleString(
                        "en-IN"
                      )
                    }

                  </span>

                </div>


                <hr className="border-secondary-subtle my-3" />


                <div className="d-flex justify-content-between align-items-baseline mb-2">

                  <span className="fw-bold text-white fs-6">
                    Initial Reservation Payment:
                  </span>


                  <div className="text-end">

                    <h3 className="fw-bold text-primary mb-0">

                      ₹
                      {
                        totalDue.toLocaleString(
                          "en-IN"
                        )
                      }

                    </h3>


                    <small className="text-muted d-block">
                      Includes rent + deposit +
                      setup fee
                    </small>

                  </div>

                </div>

              </div>


              <div className="secure-badge mt-4 p-3 rounded d-flex align-items-center gap-3">

                <FiCreditCard className="text-teal fs-4" />


                <div className="small text-muted">

                  <span className="fw-bold text-white d-block">
                    Secured SplitNest Reservation
                  </span>

                  Your booking details will be securely processed.

                </div>

              </div>

            </Card>

          </Col>

        </Row>

      </Container>


      {/* =====================================
          SUCCESS MODAL
      ===================================== */}

      <Modal
        show={
          showSuccessModal
        }

        onHide={
          handleModalClose
        }

        centered

        backdrop="static"

        contentClassName="success-modal-content"
      >

        <Modal.Body className="text-center p-5 text-white">

          <div className="success-icon-circle mb-4">

            <FiCheckCircle className="text-success display-2" />

          </div>


          <h2 className="fw-bold mb-3">
            Nest Reserved Successfully!
          </h2>


          <p className="text-muted mb-4 fs-6">

            Your reservation request for{" "}

            <strong>
              {
                property.name
              }
            </strong>{" "}

            has been saved successfully.

          </p>


          <Button
            onClick={
              handleModalClose
            }

            className="btn-confirm-booking w-100 py-3 fw-bold fs-5"
          >

            Go to Dashboard

          </Button>

        </Modal.Body>

      </Modal>

    </div>
  );
}

export default Book;