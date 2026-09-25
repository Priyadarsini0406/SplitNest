/* eslint-disable react-hooks/set-state-in-effect */
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  FaCalendarCheck,
  FaCheck,
  FaTimes,
  FaSearch,
  FaSyncAlt,
  // eslint-disable-next-line no-unused-vars
  FaUser,
  FaBuilding,
  FaClock,
  FaPhone,
  FaEnvelope,
} from "react-icons/fa";

import OwnerDashboardLayout from
  "../../components/OwnerDashboardLayout/OwnerDashboardLayout";

import {
  useAuth,
} from "../../context/AuthContext";

import "./OwnerBookings.css";

const API_URL =
  "http://localhost:5000/api";

function OwnerBookings() {
  const {
    token,
    authHeaders,
  } = useAuth();

  // ==========================================
  // STATES
  // ==========================================

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
    search,
    setSearch,
  ] = useState("");

  const [
    statusFilter,
    setStatusFilter,
  ] = useState("All");

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
  // FETCH BOOKINGS
  // ==========================================

  const fetchBookings =
    useCallback(async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await fetch(
            `${API_URL}/bookings`,
            {
              method: "GET",

              headers: {
                ...getAuthHeaders(),
              },
            }
          );

        const result =
          await response.json();

        if (!response.ok) {
          throw new Error(
            result.message ||
              "Unable to load booking requests."
          );
        }

        const bookingData =
          Array.isArray(
            result.data
          )
            ? result.data
            : Array.isArray(
                result.bookings
              )
            ? result.bookings
            : [];

        setBookings(
          bookingData
        );
      } catch (err) {
        console.error(
          "Fetch Owner Bookings Error:",
          err
        );

        setError(
          err.message ||
            "Unable to load booking requests."
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
    fetchBookings();
  }, [fetchBookings]);

  // ==========================================
  // COUNTS
  // ==========================================

  const pendingCount =
    useMemo(() => {
      return bookings.filter(
        (booking) =>
          String(
            booking.status ||
              ""
          ).toLowerCase() ===
          "pending"
      ).length;
    }, [bookings]);

  const approvedCount =
    useMemo(() => {
      return bookings.filter(
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
      ).length;
    }, [bookings]);

  const rejectedCount =
    useMemo(() => {
      return bookings.filter(
        (booking) =>
          String(
            booking.status ||
              ""
          ).toLowerCase() ===
          "rejected"
      ).length;
    }, [bookings]);

  // ==========================================
  // SEARCH + FILTER
  // ==========================================

  const filteredBookings =
    useMemo(() => {
      const keyword =
        search
          .trim()
          .toLowerCase();

      return bookings.filter(
        (booking) => {
          const tenantName =
            String(
              booking.fullName ||
                booking.tenantName ||
                booking.user
                  ?.fullName ||
                ""
            ).toLowerCase();

          const tenantEmail =
            String(
              booking.email ||
                booking.user
                  ?.email ||
                ""
            ).toLowerCase();

          const tenantPhone =
            String(
              booking.phone ||
                booking.user
                  ?.phone ||
                ""
            ).toLowerCase();

          const propertyName =
            String(
              booking.propertyName ||
                booking.property
                  ?.name ||
                ""
            ).toLowerCase();

          const bookingStatus =
            String(
              booking.status ||
                "Pending"
            );

          const matchesSearch =
            tenantName.includes(
              keyword
            ) ||
            tenantEmail.includes(
              keyword
            ) ||
            tenantPhone.includes(
              keyword
            ) ||
            propertyName.includes(
              keyword
            );

          const matchesStatus =
            statusFilter ===
              "All" ||
            bookingStatus.toLowerCase() ===
              statusFilter.toLowerCase();

          return (
            matchesSearch &&
            matchesStatus
          );
        }
      );
    }, [
      bookings,
      search,
      statusFilter,
    ]);

  // ==========================================
  // UPDATE STATUS
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

      const actionText =
        status === "Approved"
          ? "approve"
          : "reject";

      const confirmed =
        window.confirm(
          `Are you sure you want to ${actionText} this booking request?`
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

        const result =
          await response.json();

        if (!response.ok) {
          throw new Error(
            result.message ||
              "Unable to update booking status."
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
              (booking) =>
                booking._id ===
                bookingId
                  ? updatedBooking
                    ? {
                        ...booking,
                        ...updatedBooking,
                      }
                    : {
                        ...booking,
                        status,
                      }
                  : booking
            )
        );

        alert(
          status === "Approved"
            ? "Booking approved successfully!"
            : "Booking rejected successfully!"
        );
      } catch (err) {
        console.error(
          "Update Booking Status Error:",
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
  // FORMAT DATE
  // ==========================================

  const formatDate = (
    date
  ) => {
    if (!date) {
      return "Not specified";
    }

    const parsed =
      new Date(date);

    if (
      Number.isNaN(
        parsed.getTime()
      )
    ) {
      return "Not specified";
    }

    return parsed.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // ==========================================
  // GET STATUS CLASS
  // ==========================================

  const getStatusClass = (
    status
  ) => {
    const value =
      String(
        status ||
          "Pending"
      ).toLowerCase();

    if (
      value ===
        "approved" ||
      value ===
        "accepted"
    ) {
      return "approved";
    }

    if (
      value ===
      "rejected"
    ) {
      return "rejected";
    }

    if (
      value ===
      "cancelled"
    ) {
      return "cancelled";
    }

    return "pending";
  };

  // ==========================================
  // INITIAL
  // ==========================================

  const getInitial = (
    booking
  ) => {
    const name =
      booking.fullName ||
      booking.tenantName ||
      booking.user?.fullName ||
      "T";

    return name
      .charAt(0)
      .toUpperCase();
  };

  return (
    <OwnerDashboardLayout>

      <div className="owner-bookings-page">

        {/* ==================================
            HEADER
        ================================== */}

        <div className="owner-bookings-header">

          <div>

            <p className="owner-bookings-eyebrow">
              OWNER PANEL
            </p>

            <h1>
              Booking Requests
            </h1>

            <p>
              Review and manage tenant
              reservation requests for
              your properties.
            </p>

          </div>

          <button
            type="button"
            className="owner-bookings-refresh"
            onClick={
              fetchBookings
            }
          >
            <FaSyncAlt />

            Refresh
          </button>

        </div>

        {/* ==================================
            ERROR
        ================================== */}

        {error && (

          <div className="owner-bookings-error">

            <span>
              {error}
            </span>

            <button
              type="button"
              onClick={
                fetchBookings
              }
            >
              Try Again
            </button>

          </div>

        )}

        {/* ==================================
            OVERVIEW
        ================================== */}

        <div className="owner-booking-stats">

          <div className="owner-booking-stat-card">

            <div className="booking-stat-icon total">

              <FaCalendarCheck />

            </div>

            <div>

              <span>
                Total Requests
              </span>

              <strong>
                {
                  bookings.length
                }
              </strong>

            </div>

          </div>

          <div className="owner-booking-stat-card">

            <div className="booking-stat-icon pending">

              <FaClock />

            </div>

            <div>

              <span>
                Pending
              </span>

              <strong>
                {
                  pendingCount
                }
              </strong>

            </div>

          </div>

          <div className="owner-booking-stat-card">

            <div className="booking-stat-icon approved">

              <FaCheck />

            </div>

            <div>

              <span>
                Approved
              </span>

              <strong>
                {
                  approvedCount
                }
              </strong>

            </div>

          </div>

          <div className="owner-booking-stat-card">

            <div className="booking-stat-icon rejected">

              <FaTimes />

            </div>

            <div>

              <span>
                Rejected
              </span>

              <strong>
                {
                  rejectedCount
                }
              </strong>

            </div>

          </div>

        </div>

        {/* ==================================
            FILTERS
        ================================== */}

        <div className="owner-bookings-filter-card">

          <div className="owner-bookings-search">

            <FaSearch />

            <input
              type="search"
              placeholder="Search tenant, property, email or phone..."
              value={
                search
              }
              onChange={(event) =>
                setSearch(
                  event.target
                    .value
                )
              }
            />

          </div>

          <select
            value={
              statusFilter
            }
            onChange={(event) =>
              setStatusFilter(
                event.target
                  .value
              )
            }
          >

            <option value="All">
              All Status
            </option>

            <option value="Pending">
              Pending
            </option>

            <option value="Approved">
              Approved
            </option>

            <option value="Rejected">
              Rejected
            </option>

            <option value="Cancelled">
              Cancelled
            </option>

          </select>

        </div>

        {/* ==================================
            BOOKINGS CONTENT
        ================================== */}

        <section className="owner-bookings-card">

          <div className="owner-bookings-card-head">

            <div>

              <h3>
                All Booking Requests
              </h3>

              <p>
                Showing{" "}

                {
                  filteredBookings.length
                }{" "}

                request
                {
                  filteredBookings.length !==
                  1
                    ? "s"
                    : ""
                }
              </p>

            </div>

          </div>

          {/* LOADING */}

          {loading ? (

            <div className="owner-bookings-loading">

              <div className="owner-bookings-spinner" />

              <p>
                Loading booking
                requests...
              </p>

            </div>

          ) : filteredBookings.length ===
            0 ? (

            /* EMPTY */

            <div className="owner-bookings-empty">

              <FaCalendarCheck />

              <h3>
                No Booking Requests
                Found
              </h3>

              <p>

                {bookings.length ===
                0
                  ? "You have not received any booking requests yet."
                  : "No booking requests match your search or filter."}

              </p>

            </div>

          ) : (

            /* TABLE */

            <div className="owner-bookings-table-wrapper">

              <table className="owner-bookings-table">

                <thead>

                  <tr>

                    <th>
                      Tenant
                    </th>

                    <th>
                      Property
                    </th>

                    <th>
                      Contact
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

                  {filteredBookings.map(
                    (booking) => {

                      const status =
                        booking.status ||
                        "Pending";

                      const isPending =
                        String(
                          status
                        ).toLowerCase() ===
                        "pending";

                      const isUpdating =
                        updatingBookingId ===
                        booking._id;

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

                      const email =
                        booking.email ||
                        booking.user
                          ?.email ||
                        "";

                      const phone =
                        booking.phone ||
                        booking.user
                          ?.phone ||
                        "";

                      return (

                        <tr
                          key={
                            booking._id
                          }
                        >

                          {/* TENANT */}

                          <td>

                            <div className="owner-booking-tenant">

                              <div className="owner-booking-avatar">

                                {getInitial(
                                  booking
                                )}

                              </div>

                              <div>

                                <strong>
                                  {
                                    tenantName
                                  }
                                </strong>

                                <span>
                                  Tenant
                                </span>

                              </div>

                            </div>

                          </td>

                          {/* PROPERTY */}

                          <td>

                            <div className="owner-booking-property">

                              <FaBuilding />

                              <div>

                                <strong>
                                  {
                                    propertyName
                                  }
                                </strong>

                                <span>

                                  {booking.property
                                    ?.area ||
                                    booking.area ||
                                    "Salem"}

                                </span>

                              </div>

                            </div>

                          </td>

                          {/* CONTACT */}

                          <td>

                            <div className="owner-booking-contact">

                              {phone && (

                                <span>

                                  <FaPhone />

                                  {
                                    phone
                                  }

                                </span>

                              )}

                              {email && (

                                <span>

                                  <FaEnvelope />

                                  {
                                    email
                                  }

                                </span>

                              )}

                              {!phone &&
                                !email && (

                                <span>
                                  No contact
                                </span>

                              )}

                            </div>

                          </td>

                          {/* CHECK-IN */}

                          <td>

                            <div className="owner-booking-date">

                              <FaClock />

                              {formatDate(
                                booking.checkInDate ||
                                  booking.preferredCheckInDate
                              )}

                            </div>

                          </td>

                          {/* STATUS */}

                          <td>

                            <span
                              className={`owner-booking-status ${getStatusClass(
                                status
                              )}`}
                            >

                              {
                                status
                              }

                            </span>

                          </td>

                          {/* ACTION */}

                          <td>

                            {isPending ? (

                              <div className="owner-booking-action-buttons">

                                <button
                                  type="button"
                                  className="approve-btn"
                                  disabled={
                                    isUpdating
                                  }
                                  onClick={() =>
                                    updateBookingStatus(
                                      booking._id,
                                      "Approved"
                                    )
                                  }
                                >

                                  <FaCheck />

                                  {isUpdating
                                    ? "..."
                                    : "Accept"}

                                </button>

                                <button
                                  type="button"
                                  className="reject-btn"
                                  disabled={
                                    isUpdating
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

                              <span className="owner-booking-completed">

                                {status ===
                                "Approved"
                                  ? "Approved"
                                  : status}

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

      </div>

    </OwnerDashboardLayout>
  );
}

export default OwnerBookings;