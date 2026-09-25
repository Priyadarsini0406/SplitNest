import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  FaHome,
  FaBuilding,
  FaPlus,
  FaCalendarCheck,
  FaUser,
  FaUsers,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaBell,
} from "react-icons/fa";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  useAuth,
} from "../../context/AuthContext";

import "./OwnerDashboardLayout.css";

const API_URL =
  "http://localhost:5000/api";

function OwnerDashboardLayout({
  children,
}) {
  const navigate =
    useNavigate();

  const location =
    useLocation();

  const {
    logout,
    user,
    token,
    authHeaders,
  } = useAuth();

  const [
    unreadCount,
    setUnreadCount,
  ] = useState(0);

  const [notifications, setNotifications] = useState([]);

  const [
    sidebarOpen,
    setSidebarOpen,
  ] = useState(false);

  // ==========================================
  // BUILD AUTH HEADERS
  // ==========================================

  const getAuthHeaders =
    useCallback(() => {
      if (
        authHeaders &&
        Object.keys(
          authHeaders
        ).length > 0
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
  // LOAD NOTIFICATIONS
  // ==========================================

  const loadNotifications =
    useCallback(async () => {
      try {
        if (!token) {
          setUnreadCount(0);
          return;
        }

        const response =
          await fetch(
            `${API_URL}/notifications`,
            {
              method: "GET",

              headers: {
                ...getAuthHeaders(),
              },
            }
          );

        if (!response.ok) {
          setUnreadCount(0);
          return;
        }

        const result =
          await response.json();

        const notifications =
          Array.isArray(
            result.data
          )
            ? result.data
            : Array.isArray(
                result.notifications
              )
            ? result.notifications
            : [];

        const unread =
          notifications.filter(
            (notification) =>
              !notification.read
          ).length;

        setNotifications(notifications);
        setUnreadCount(
          unread
        );
      } catch (error) {
        console.error(
          "Notification Load Error:",
          error
        );

        setUnreadCount(0);
      }
    }, [
      getAuthHeaders,
      token,
    ]);

  // ==========================================
  // LOAD ON OPEN
  // ==========================================

  useEffect(() => {
    loadNotifications();
    const timer = window.setInterval(loadNotifications, 15000);
    return () => window.clearInterval(timer);
  }, [loadNotifications]);

  const openBookingRequests = async () => {
    try {
      if (unreadCount > 0) {
        await fetch(`${API_URL}/notifications/read-all`, {
          method: "PATCH",
          headers: { ...getAuthHeaders() },
        });
        setUnreadCount(0);
        setNotifications((items) => items.map((item) => ({ ...item, read: true })));
      }
    } catch (error) {
      console.error("Mark Notifications Read Error:", error);
    } finally {
      navigateTo("/owner-bookings");
    }
  };

  // ==========================================
  // ACTIVE ROUTE
  // ==========================================

  const isActive = (
    path
  ) => {
    return (
      location.pathname ===
      path
    );
  };

  // ==========================================
  // NAVIGATE
  // ==========================================

  const navigateTo = (
    path
  ) => {
    navigate(path);

    setSidebarOpen(false);
  };

  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = () => {
    if (logout) {
      logout();
    }

    navigate(
      "/login"
    );
  };

  // ==========================================
  // OWNER INITIALS
  // ==========================================

  const getOwnerInitials =
    () => {
      const name =
        user?.fullName ||
        "Owner";

      return name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map(
          (part) =>
            part[0]
        )
        .join("")
        .toUpperCase();
    };

  return (
    <div className="owner-layout-root">

      {/* ======================================
          MOBILE OVERLAY
      ====================================== */}

      {sidebarOpen && (
        <div
          className="owner-layout-overlay"
          onClick={() =>
            setSidebarOpen(
              false
            )
          }
        />
      )}

      {/* ======================================
          SIDEBAR
      ====================================== */}

      <aside
        className={`owner-layout-sidebar ${
          sidebarOpen
            ? "open"
            : ""
        }`}
      >

        {/* BRAND */}

        <div className="owner-layout-brand">

          <div className="owner-layout-logo-icon">
            <FaHome />
          </div>

          <div className="owner-layout-logo-text">
            Split<span>Nest</span>
          </div>

          <button
            type="button"
            className="owner-layout-close"
            onClick={() =>
              setSidebarOpen(
                false
              )
            }
          >
            <FaTimes />
          </button>

        </div>

        {/* ======================================
            OWNER PROFILE CARD
        ====================================== */}

        <div
          className="owner-layout-profile"
          onClick={() =>
            navigateTo(
              "/owner-profile"
            )
          }
        >

          <div className="owner-layout-avatar">
            {getOwnerInitials()}
          </div>

          <div>

            <h4>
              {user?.fullName ||
                "Property Owner"}
            </h4>

            <p>
              Owner Account
            </p>

          </div>

        </div>

        {/* ======================================
            NAVIGATION
        ====================================== */}

        <nav className="owner-layout-nav">

          <p className="owner-layout-menu-title">
            OWNER PANEL
          </p>

          {/* DASHBOARD */}

          <button
            type="button"
            className={`owner-layout-nav-item ${
              isActive(
                "/owner-dashboard"
              )
                ? "active"
                : ""
            }`}
            onClick={() =>
              navigateTo(
                "/owner-dashboard"
              )
            }
          >
            <FaHome />

            <span>
              Dashboard
            </span>

          </button>

          {/* MY PROPERTIES */}

          <button
            type="button"
            className={`owner-layout-nav-item ${
              isActive(
                "/my-properties"
              )
                ? "active"
                : ""
            }`}
            onClick={() =>
              navigateTo(
                "/my-properties"
              )
            }
          >
            <FaBuilding />

            <span>
              My Properties
            </span>

          </button>

          {/* ADD PROPERTY */}

          <button
            type="button"
            className={`owner-layout-nav-item ${
              isActive(
                "/add-property"
              )
                ? "active"
                : ""
            }`}
            onClick={() =>
              navigateTo(
                "/add-property"
              )
            }
          >
            <FaPlus />

            <span>
              Add Property
            </span>

          </button>

          {/* BOOKING REQUESTS */}

          <button
            type="button"
            className={`owner-layout-nav-item ${
              isActive(
                "/owner-bookings"
              )
                ? "active"
                : ""
            }`}
            onClick={openBookingRequests}
          >
            <FaCalendarCheck />

            <span>
              Booking Requests
            </span>

            {unreadCount >
              0 && (

              <span className="owner-layout-notification-count">

                <FaBell />

                {
                  unreadCount
                }

              </span>

            )}

          </button>

          {/* ROOMMATE LISTINGS */}

          <button
            type="button"
            className={`owner-layout-nav-item ${
              isActive("/owner-roommates") ? "active" : ""
            }`}
            onClick={() => navigateTo("/owner-roommates")}
          >
            <FaUsers />
            <span>Roommate Listings</span>
          </button>

          {/* OWNER PROFILE */}

          <button
            type="button"
            className={`owner-layout-nav-item ${
              isActive(
                "/owner-profile"
              )
                ? "active"
                : ""
            }`}
            onClick={() =>
              navigateTo(
                "/owner-profile"
              )
            }
          >
            <FaUser />

            <span>
              Profile
            </span>

          </button>

        </nav>

        {/* ======================================
            LOGOUT
        ====================================== */}

        <button
          type="button"
          className="owner-layout-logout"
          onClick={
            handleLogout
          }
        >
          <FaSignOutAlt />

          <span>
            Sign Out
          </span>

        </button>

      </aside>

      {/* ======================================
          MAIN CONTENT
      ====================================== */}

      <div className="owner-layout-content">

        {/* MOBILE TOPBAR */}

        <header className="owner-layout-mobile-header">

          <button
            type="button"
            className="owner-layout-menu-btn"
            onClick={() =>
              setSidebarOpen(
                true
              )
            }
          >
            <FaBars />
          </button>

          <div className="owner-layout-mobile-brand">
            Split<span>Nest</span>
          </div>

        </header>

        {/* PAGE CONTENT */}

        <main className="owner-layout-main">
          {children}
        </main>

      </div>

    </div>
  );
}

export default OwnerDashboardLayout;