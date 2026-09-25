/* eslint-disable react-hooks/set-state-in-effect */
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  FaBuilding,
  FaCheckCircle,
  FaCalendarCheck,
  FaRupeeSign,
  FaEdit,
  FaPlus,
  FaCheck,
  FaTimes,
  FaSyncAlt,
  FaArrowRight,
} from "react-icons/fa";

import {
  useNavigate,
} from "react-router-dom";

import {
  useAuth,
} from "../../context/AuthContext";

import OwnerDashboardLayout from
  "../../components/OwnerDashboardLayout/OwnerDashboardLayout";

import "./OwnerDashboard.css";

const API_URL =
  "http://localhost:5000/api";

function OwnerDashboard() {

  const navigate =
    useNavigate();

  const {
    user,
    token,
    authHeaders,
  } = useAuth();

  // ==========================================
  // STATES
  // ==========================================

  const [
    properties,
    setProperties,
  ] = useState([]);

  const [
    bookings,
    setBookings,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  const [
    updatingBookingId,
    setUpdatingBookingId,
  ] = useState(null);

  // ==========================================
  // AUTH HEADERS
  // ==========================================

  const getAuthHeaders =
    useCallback(() => {

      if (
        authHeaders &&
        Object.keys(authHeaders)
          .length > 0
      ) {

        return {
          ...authHeaders,
        };

      }

      if (token) {

        return {
          Authorization:
            `Bearer ${token}`,
        };

      }

      return {};

    }, [
      authHeaders,
      token,
    ]);

  // ==========================================
  // LOAD DASHBOARD DATA
  // ==========================================

  const loadDashboard =
    useCallback(async () => {

      try {

        setLoading(true);

        setError("");

        const headers =
          getAuthHeaders();

        const [
          propertyResponse,
          bookingResponse,
        ] =
          await Promise.all([

            fetch(
              `${API_URL}/properties`,
              {
                method: "GET",

                headers: {
                  ...headers,
                },
              }
            ),

            fetch(
              `${API_URL}/bookings`,
              {
                method: "GET",

                headers: {
                  ...headers,
                },
              }
            ),

          ]);

        // --------------------------------------
        // PROPERTY RESPONSE
        // --------------------------------------

        let propertyResult = {};

        try {

          propertyResult =
            await propertyResponse.json();

        } catch {

          throw new Error(
            "Invalid property server response."
          );

        }

        if (!propertyResponse.ok) {

          throw new Error(
            propertyResult.message ||
              "Unable to load properties."
          );

        }

        // --------------------------------------
        // BOOKING RESPONSE
        // --------------------------------------

        let bookingResult = {};

        try {

          bookingResult =
            await bookingResponse.json();

        } catch {

          throw new Error(
            "Invalid booking server response."
          );

        }

        if (!bookingResponse.ok) {

          throw new Error(
            bookingResult.message ||
              "Unable to load bookings."
          );

        }

        // --------------------------------------
        // SET DATA
        // --------------------------------------

        const propertyData =
          Array.isArray(
            propertyResult.data
          )
            ? propertyResult.data
            : Array.isArray(
                propertyResult.properties
              )
            ? propertyResult.properties
            : [];

        const bookingData =
          Array.isArray(
            bookingResult.data
          )
            ? bookingResult.data
            : Array.isArray(
                bookingResult.bookings
              )
            ? bookingResult.bookings
            : [];

        setProperties(
          propertyData
        );

        setBookings(
          bookingData
        );

      } catch (err) {

        console.error(
          "Owner Dashboard Error:",
          err
        );

        setError(
          err.message ||
            "Unable to load owner dashboard."
        );

      } finally {

        setLoading(false);

      }

    }, [
      getAuthHeaders,
    ]);

  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {

    loadDashboard();

  }, [
    loadDashboard,
  ]);

  // ==========================================
  // ACTIVE PROPERTIES
  // ==========================================

  const activeProperties =
    useMemo(() => {

      return properties.filter(
        (property) =>
          String(
            property.status ||
              ""
          ).toLowerCase() ===
          "active"
      ).length;

    }, [
      properties,
    ]);

  // ==========================================
  // PENDING BOOKINGS
  // ==========================================

  const pendingBookings =
    useMemo(() => {

      return bookings.filter(
        (booking) =>
          String(
            booking.status ||
              "Pending"
          ).toLowerCase() ===
          "pending"
      );

    }, [
      bookings,
    ]);

  // ==========================================
  // MONTHLY REVENUE
  // ==========================================

  const monthlyRevenue =
    useMemo(() => {

      return bookings

        .filter(
          (booking) => {

            const status =
              String(
                booking.status ||
                  ""
              ).toLowerCase();

            return (
              status ===
                "approved" ||
              status ===
                "accepted"
            );

          }
        )

        .reduce(
          (
            total,
            booking
          ) => {

            const rent =
              Number(
                booking.baseRent ||
                  booking.rent ||
                  booking.property
                    ?.rent ||
                  0
              );

            return (
              total +
              (Number.isNaN(rent)
                ? 0
                : rent)
            );

          },
          0
        );

    }, [
      bookings,
    ]);

  // ==========================================
  // UPDATE BOOKING STATUS
  // ==========================================

  const updateBookingStatus =
    async (
      bookingId,
      status
    ) => {

      if (!bookingId) {

        alert(
          "Booking ID not found."
        );

        return;

      }

      const action =
        status === "Approved"
          ? "accept"
          : "reject";

      const confirmed =
        window.confirm(
          `Are you sure you want to ${action} this booking request?`
        );

      if (!confirmed) {

        return;

      }

      try {

        setUpdatingBookingId(
          bookingId
        );

        const response =
          await fetch(
            `${API_URL}/bookings/${bookingId}/status`,
            {
              method:
                "PATCH",

              headers: {

                "Content-Type":
                  "application/json",

                ...getAuthHeaders(),

              },

              body:
                JSON.stringify({
                  status,
                }),
            }
          );

        let result = {};

        try {

          result =
            await response.json();

        } catch {

          throw new Error(
            "Invalid server response."
          );

        }

        if (!response.ok) {

          throw new Error(
            result.message ||
              "Unable to update booking."
          );

        }

        const updatedBooking =
          result.data ||
          result.booking;

        setBookings(
          (
            previousBookings
          ) =>
            previousBookings.map(
              (booking) => {

                if (
                  booking._id !==
                  bookingId
                ) {

                  return booking;

                }

                if (
                  updatedBooking
                ) {

                  return {
                    ...booking,
                    ...updatedBooking,
                  };

                }

                return {
                  ...booking,
                  status,
                };

              }
            )
        );

      } catch (err) {

        console.error(
          "Booking Update Error:",
          err
        );

        alert(
          err.message ||
            "Unable to update booking."
        );

      } finally {

        setUpdatingBookingId(
          null
        );

      }

    };

  // ==========================================
  // DATE FORMAT
  // ==========================================

  const formatDate = (
    date
  ) => {

    if (!date) {

      return "Not specified";

    }

    const parsedDate =
      new Date(date);

    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {

      return "Not specified";

    }

    return parsedDate
      .toLocaleDateString(
        "en-IN",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }
      );

  };

  // ==========================================
  // USER NAME
  // ==========================================

  const ownerName =
    user?.fullName ||
    user?.name ||
    "Owner";

  // ==========================================
  // UI
  // ==========================================

  return (

    <OwnerDashboardLayout>

      <div className="owner-dashboard-page">

        {/* ==================================
            HEADER
        ================================== */}

        <div className="owner-dashboard-header">

          <div>

            <p className="owner-dashboard-small-title">
              OWNER PANEL
            </p>

            <h1>
              Owner Dashboard
            </h1>

            <p className="owner-dashboard-subtitle">

              Welcome back,{" "}

              <strong>
                {ownerName}
              </strong>

              . Manage your properties
              and booking requests.

            </p>

          </div>

          <div className="owner-dashboard-header-actions">

            <button
              type="button"
              className="owner-refresh-btn"
              onClick={
                loadDashboard
              }
            >

              <FaSyncAlt />

              Refresh

            </button>

            <button
              type="button"
              className="owner-add-btn"
              onClick={() =>
                navigate(
                  "/add-property"
                )
              }
            >

              <FaPlus />

              Add Property

            </button>

          </div>

        </div>

        {/* ==================================
            ERROR
        ================================== */}

        {error && (

          <div className="owner-dashboard-error">

            <span>
              {error}
            </span>

            <button
              type="button"
              onClick={
                loadDashboard
              }
            >
              Try Again
            </button>

          </div>

        )}

        {/* ==================================
            LOADING
        ================================== */}

        {loading ? (

          <div className="owner-dashboard-loading">

            <div className="owner-dashboard-spinner" />

            <p>
              Loading owner dashboard...
            </p>

          </div>

        ) : (

          <>

            {/* ==================================
                OVERVIEW CARDS
            ================================== */}

            <div className="owner-overview-grid">

              {/* TOTAL */}

              <div className="owner-overview-card">

                <div className="owner-overview-icon total">

                  <FaBuilding />

                </div>

                <div>

                  <span>
                    Total Properties
                  </span>

                  <strong>
                    {
                      properties.length
                    }
                  </strong>

                </div>

              </div>

              {/* ACTIVE */}

              <div className="owner-overview-card">

                <div className="owner-overview-icon active">

                  <FaCheckCircle />

                </div>

                <div>

                  <span>
                    Active Properties
                  </span>

                  <strong>
                    {
                      activeProperties
                    }
                  </strong>

                </div>

              </div>

              {/* BOOKINGS */}

              <div className="owner-overview-card">

                <div className="owner-overview-icon booking">

                  <FaCalendarCheck />

                </div>

                <div>

                  <span>
                    Booking Requests
                  </span>

                  <strong>
                    {
                      pendingBookings.length
                    }
                  </strong>

                </div>

              </div>

              {/* REVENUE */}

              <div className="owner-overview-card">

                <div className="owner-overview-icon revenue">

                  <FaRupeeSign />

                </div>

                <div>

                  <span>
                    Monthly Revenue
                  </span>

                  <strong>

                    ₹
                    {monthlyRevenue
                      .toLocaleString(
                        "en-IN"
                      )}

                  </strong>

                </div>

              </div>

            </div>

            {/* ==================================
                RECENT PROPERTIES
            ================================== */}

            <section className="owner-dashboard-section">

              <div className="owner-section-header">

                <div>

                  <h2>
                    Recent Properties
                  </h2>

                  <p>
                    Your recently added
                    properties.
                  </p>

                </div>

                <button
                  type="button"
                  className="owner-view-all-btn"
                  onClick={() =>
                    navigate(
                      "/my-properties"
                    )
                  }
                >

                  View All

                  <FaArrowRight />

                </button>

              </div>

              {properties.length ===
              0 ? (

                <div className="owner-empty-state">

                  <div className="owner-empty-icon">

                    <FaBuilding />

                  </div>

                  <h3>
                    No Properties Yet
                  </h3>

                  <p>
                    Add your first room or
                    property to start
                    receiving bookings.
                  </p>

                  <button
                    type="button"
                    className="owner-empty-add-btn"
                    onClick={() =>
                      navigate(
                        "/add-property"
                      )
                    }
                  >

                    <FaPlus />

                    Add Property

                  </button>

                </div>

              ) : (

                <div className="owner-properties-grid">

                  {properties
                    .slice(0, 4)
                    .map(
                      (
                        property
                      ) => (

                        <article
                          className="owner-property-card"
                          key={
                            property._id
                          }
                        >

                          <div className="owner-property-image">

                            <img
                              src={
                                property.image ||
                                property.imageUrl ||
                                "https://placehold.co/600x360?text=SplitNest+Property"
                              }
                              alt={
                                property.name ||
                                "Property"
                              }
                              onError={(
                                event
                              ) => {

                                event.currentTarget.src =
                                  "https://placehold.co/600x360?text=SplitNest+Property";

                              }}
                            />

                            <span
                              className={`owner-property-status ${
                                String(
                                  property.status ||
                                    ""
                                ).toLowerCase() ===
                                "active"
                                  ? "active"
                                  : "inactive"
                              }`}
                            >

                              {property.status ||
                                "Inactive"}

                            </span>

                          </div>

                          <div className="owner-property-body">

                            <h3>
                              {property.name ||
                                "Property"}
                            </h3>

                            <p>
                              {property.area ||
                                "Salem"}
                            </p>

                            <div className="owner-property-footer">

                              <strong>

                                ₹
                                {Number(
                                  property.rent ||
                                    0
                                ).toLocaleString(
                                  "en-IN"
                                )}

                                <small>
                                  / month
                                </small>

                              </strong>

                              <button
                                type="button"
                                onClick={() =>
                                  navigate(
                                    `/edit-property/${property._id}`
                                  )
                                }
                              >

                                <FaEdit />

                                Edit

                              </button>

                            </div>

                          </div>

                        </article>

                      )
                    )}

                </div>

              )}

            </section>

            {/* ==================================
                RECENT BOOKING REQUESTS
            ================================== */}

            <section className="owner-dashboard-section">

              <div className="owner-section-header">

                <div>

                  <h2>
                    Recent Booking Requests
                  </h2>

                  <p>
                    Review your latest tenant
                    booking requests.
                  </p>

                </div>

                <div className="owner-booking-header-right">

                  {pendingBookings.length >
                    0 && (

                    <span className="owner-pending-badge">

                      {
                        pendingBookings.length
                      }{" "}

                      Pending

                    </span>

                  )}

                  <button
                    type="button"
                    className="owner-view-all-btn"
                    onClick={() =>
                      navigate(
                        "/owner-bookings"
                      )
                    }
                  >

                    View All

                    <FaArrowRight />

                  </button>

                </div>

              </div>

              {bookings.length ===
              0 ? (

                <div className="owner-empty-state booking-empty">

                  <div className="owner-empty-icon">

                    <FaCalendarCheck />

                  </div>

                  <h3>
                    No Booking Requests
                  </h3>

                  <p>
                    New tenant booking requests
                    will appear here.
                  </p>

                </div>

              ) : (

                <div className="owner-booking-table-wrapper">

                  <table className="owner-booking-table">

                    <thead>

                      <tr>

                        <th>
                          Tenant
                        </th>

                        <th>
                          Property
                        </th>

                        <th>
                          Check-in
                        </th>

                        <th>
                          Status
                        </th>

                        <th>
                          Action
                        </th>

                      </tr>

                    </thead>

                    <tbody>

                      {bookings
                        .slice(0, 5)
                        .map(
                          (
                            booking
                          ) => {

                            const status =
                              booking.status ||
                              "Pending";

                            const isPending =
                              String(
                                status
                              ).toLowerCase() ===
                              "pending";

                            const tenantName =
                              booking.fullName ||
                              booking.tenantName ||
                              booking.user
                                ?.fullName ||
                              "Tenant";

                            const propertyName =
                              booking.propertyName ||
                              booking.property
                                ?.name ||
                              "Property";

                            return (

                              <tr
                                key={
                                  booking._id
                                }
                              >

                                <td>

                                  <div className="owner-tenant-cell">

                                    <div className="owner-tenant-avatar">

                                      {tenantName
                                        .charAt(
                                          0
                                        )
                                        .toUpperCase()}

                                    </div>

                                    <div>

                                      <strong>
                                        {
                                          tenantName
                                        }
                                      </strong>

                                      <small>
                                        {
                                          booking.phone ||
                                          booking.user
                                            ?.phone ||
                                          "Tenant"
                                        }
                                      </small>

                                    </div>

                                  </div>

                                </td>

                                <td>

                                  <strong>
                                    {
                                      propertyName
                                    }
                                  </strong>

                                </td>

                                <td>

                                  {formatDate(
                                    booking.checkInDate ||
                                      booking.preferredCheckInDate
                                  )}

                                </td>

                                <td>

                                  <span
                                    className={`owner-booking-status ${String(
                                      status
                                    ).toLowerCase()}`}
                                  >

                                    {
                                      status
                                    }

                                  </span>

                                </td>

                                <td>

                                  {isPending ? (

                                    <div className="owner-booking-actions">

                                      <button
                                        type="button"
                                        className="owner-accept-btn"
                                        disabled={
                                          updatingBookingId ===
                                          booking._id
                                        }
                                        onClick={() =>
                                          updateBookingStatus(
                                            booking._id,
                                            "Approved"
                                          )
                                        }
                                      >

                                        <FaCheck />

                                        Accept

                                      </button>

                                      <button
                                        type="button"
                                        className="owner-reject-btn"
                                        disabled={
                                          updatingBookingId ===
                                          booking._id
                                        }
                                        onClick={() =>
                                          updateBookingStatus(
                                            booking._id,
                                            "Rejected"
                                          )
                                        }
                                      >

                                        <FaTimes />

                                        Reject

                                      </button>

                                    </div>

                                  ) : (

                                    <span className="owner-action-completed">

                                      {
                                        status
                                      }

                                    </span>

                                  )}

                                </td>

                              </tr>

                            );

                          }
                        )}

                    </tbody>

                  </table>

                </div>

              )}

            </section>

          </>

        )}

      </div>

    </OwnerDashboardLayout>

  );

}

export default OwnerDashboard;