import { useEffect, useMemo, useState } from "react";

import {
  Container,
  Row,
  Col,
  Card,
  Badge,
  Button,
  Spinner,
  Alert,
} from "react-bootstrap";

import {
  FiCalendar,
  FiUsers,
  FiDollarSign,
  FiHome,
  FiClock,
  FiXCircle,
  FiRefreshCw,
} from "react-icons/fi";

import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./MyBookings.css";

function MyBookings() {
  const navigate = useNavigate();
  const { authHeaders } = useAuth();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [statusFilter, setStatusFilter] =
    useState("All");

  // Temporary user id
  // Later real authenticated user id connect pannalam


  // ==========================================
  // FETCH BOOKINGS
  // ==========================================

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "http://localhost:5000/api/bookings",
        { headers: { ...authHeaders } }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Unable to load bookings."
        );
      }

      setBookings(result.data || []);
    } catch (err) {
      console.error(
        "Fetch Bookings Error:",
        err
      );

      setError(
        err.message ||
          "Unable to load bookings."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchBookings();
  }, []);

  // ==========================================
  // FILTER
  // ==========================================

  const filteredBookings = useMemo(() => {
    if (statusFilter === "All") {
      return bookings;
    }

    return bookings.filter(
      (booking) =>
        booking.status === statusFilter
    );
  }, [bookings, statusFilter]);

  // ==========================================
  // CANCEL BOOKING
  // ==========================================

  const handleCancelBooking = async (
    bookingId
  ) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this booking?"
    );

    if (!confirmCancel) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/bookings/${bookingId}/status`,
        {
          method: "PATCH",

          headers: {
            "Content-Type": "application/json",
            ...authHeaders,
          },

          body: JSON.stringify({
            status: "Cancelled",
            ownerMessage:
              "Booking cancelled by user.",
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Unable to cancel booking."
        );
      }

      setBookings((previousBookings) =>
        previousBookings.map(
          (booking) =>
            booking._id === bookingId
              ? result.data
              : booking
        )
      );

      alert(
        "Booking cancelled successfully."
      );
    } catch (err) {
      console.error(
        "Cancel Booking Error:",
        err
      );

      alert(
        err.message ||
          "Unable to cancel booking."
      );
    }
  };

  // ==========================================
  // STATUS CLASS
  // ==========================================

  const getStatusClass = (status) => {
    switch (status) {
      case "Approved":
        return "booking-status-approved";

      case "Rejected":
        return "booking-status-rejected";

      case "Cancelled":
        return "booking-status-cancelled";

      default:
        return "booking-status-pending";
    }
  };

  // ==========================================
  // DATE FORMAT
  // ==========================================

  const formatDate = (dateValue) => {
    if (!dateValue) {
      return "-";
    }

    return new Date(
      dateValue
    ).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="my-bookings-page">

        <Container fluid>

        {/* HEADER */}

        <div className="my-bookings-header">

          <div>

            <p className="my-bookings-small-title">
              USER PANEL
            </p>

            <h2>
              My Bookings
            </h2>

            <p>
              View and manage your SplitNest
              reservation requests.
            </p>

          </div>

          <Button
            className="browse-property-btn"
            onClick={() =>
              navigate("/properties")
            }
          >
            <FiHome />

            Browse Properties
          </Button>

        </div>

        {/* FILTER */}

        <div className="booking-filter-bar">

          <div className="filter-left">

            <Button
              className={
                statusFilter === "All"
                  ? "filter-btn active"
                  : "filter-btn"
              }
              onClick={() =>
                setStatusFilter("All")
              }
            >
              All
            </Button>

            <Button
              className={
                statusFilter === "Pending"
                  ? "filter-btn active"
                  : "filter-btn"
              }
              onClick={() =>
                setStatusFilter(
                  "Pending"
                )
              }
            >
              Pending
            </Button>

            <Button
              className={
                statusFilter === "Approved"
                  ? "filter-btn active"
                  : "filter-btn"
              }
              onClick={() =>
                setStatusFilter(
                  "Approved"
                )
              }
            >
              Approved
            </Button>

            <Button
              className={
                statusFilter === "Rejected"
                  ? "filter-btn active"
                  : "filter-btn"
              }
              onClick={() =>
                setStatusFilter(
                  "Rejected"
                )
              }
            >
              Rejected
            </Button>

            <Button
              className={
                statusFilter === "Cancelled"
                  ? "filter-btn active"
                  : "filter-btn"
              }
              onClick={() =>
                setStatusFilter(
                  "Cancelled"
                )
              }
            >
              Cancelled
            </Button>

          </div>

          <Button
            className="refresh-booking-btn"
            onClick={fetchBookings}
          >
            <FiRefreshCw />

            Refresh
          </Button>

        </div>

        {/* ERROR */}

        {error && (
          <Alert variant="danger">
            {error}
          </Alert>
        )}

        {/* LOADING */}

        {loading ? (

          <div className="booking-loading-state">

            <Spinner animation="border" />

            <p>
              Loading your bookings...
            </p>

          </div>

        ) : filteredBookings.length > 0 ? (

          <Row className="g-4">

            {filteredBookings.map(
              (booking) => (

                <Col
                  key={booking._id}
                  xl={4}
                  lg={6}
                  md={6}
                  sm={12}
                >

                  <Card className="my-booking-card">

                    <Card.Body>

                      {/* TOP */}

                      <div className="booking-card-top">

                        <div>

                          <h4>
                            {booking.propertyName}
                          </h4>

                          <p className="booking-id-text">
                            Booking ID:{" "}
                            {booking._id?.slice(
                              -6
                            )}
                          </p>

                        </div>

                        <Badge
                          className={`booking-status-badge ${getStatusClass(
                            booking.status
                          )}`}
                        >
                          {booking.status}
                        </Badge>

                      </div>

                      {/* DETAILS */}

                      <div className="booking-details-grid">

                        <div className="booking-detail-item">

                          <FiCalendar />

                          <div>

                            <span>
                              Check-In Date
                            </span>

                            <strong>
                              {formatDate(
                                booking.checkInDate
                              )}
                            </strong>

                          </div>

                        </div>

                        <div className="booking-detail-item">

                          <FiUsers />

                          <div>

                            <span>
                              Occupancy
                            </span>

                            <strong>
                              {booking.sharingType}
                            </strong>

                          </div>

                        </div>

                        <div className="booking-detail-item">

                          <FiDollarSign />

                          <div>

                            <span>
                              Total Due
                            </span>

                            <strong>
                              ₹
                              {Number(
                                booking.totalDue ||
                                  0
                              ).toLocaleString(
                                "en-IN"
                              )}
                            </strong>

                          </div>

                        </div>

                        <div className="booking-detail-item">

                          <FiClock />

                          <div>

                            <span>
                              Booked On
                            </span>

                            <strong>
                              {formatDate(
                                booking.createdAt
                              )}
                            </strong>

                          </div>

                        </div>

                      </div>

                      {/* OWNER MESSAGE */}

                      {booking.ownerMessage && (

                        <div className="owner-message-box">

                          <span>
                            Owner Message
                          </span>

                          <p>
                            {
                              booking.ownerMessage
                            }
                          </p>

                        </div>

                      )}

                      {/* ACTION */}

                      <div className="booking-actions">

                        {booking.status ===
                          "Pending" && (

                          <Button
                            className="cancel-booking-btn"
                            onClick={() =>
                              handleCancelBooking(
                                booking._id
                              )
                            }
                          >
                            <FiXCircle />

                            Cancel Booking
                          </Button>

                        )}

                        {booking.status ===
                          "Approved" && (

                          <div className="approved-message">

                            Booking Approved ✅

                          </div>

                        )}

                        {booking.status ===
                          "Rejected" && (

                          <div className="rejected-message">

                            Booking Rejected

                          </div>

                        )}

                        {booking.status ===
                          "Cancelled" && (

                          <div className="cancelled-message">

                            Booking Cancelled

                          </div>

                        )}

                      </div>

                    </Card.Body>

                  </Card>

                </Col>

              )
            )}

          </Row>

        ) : (

          <div className="booking-empty-state">

            <div className="empty-booking-icon">
              <FiHome />
            </div>

            <h3>
              No Bookings Found
            </h3>

            <p>
              You have not made any booking
              requests yet.
            </p>

            <Button
              className="browse-property-btn"
              onClick={() =>
                navigate("/properties")
              }
            >
              Browse Properties
            </Button>

          </div>

        )}

        </Container>

    </div>
  );
}

export default MyBookings;