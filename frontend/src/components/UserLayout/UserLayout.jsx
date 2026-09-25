import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  FiBell,
  FiBookOpen,
  FiCheck,
  FiCompass,
  FiDollarSign,
  FiGrid,
  FiHome,
  FiLogOut,
  FiMenu,
  FiPlusCircle,
  FiUsers,
  FiX,
} from "react-icons/fi";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import "./UserLayout.css";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  `${window.location.protocol}//${window.location.hostname}:5000/api`;

function UserLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const notificationRef = useRef(null);

  const { logout, user, userRole, token } = useAuth();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notificationLoading, setNotificationLoading] = useState(false);
  const [notificationError, setNotificationError] = useState("");


  const loadNotifications = useCallback(async () => {
    if (!token) {
      setNotifications([]);
      return;
    }

    try {
      setNotificationLoading(true);
      setNotificationError("");

      const response = await fetch(`${API_BASE_URL}/notifications`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result.message || "Unable to load notifications.");
      }

      setNotifications(Array.isArray(result.data) ? result.data : []);
    } catch (error) {
      console.error("Load Notifications Error:", error);
      setNotificationError(error.message || "Unable to load notifications.");
    } finally {
      setNotificationLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadNotifications();
    const timer = window.setInterval(loadNotifications, 15000);
    return () => window.clearInterval(timer);
  }, [loadNotifications]);

  useEffect(() => {
    const closeOnOutsideClick = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setNotificationOpen(false);
      }
    };

    document.addEventListener("mousedown", closeOnOutsideClick);
    return () => document.removeEventListener("mousedown", closeOnOutsideClick);
  }, []);

  const unreadCount = useMemo(
    () => notifications.filter((item) => !item.read).length,
    [notifications]
  );

  const markAllNotificationsRead = async () => {
    if (!token || unreadCount === 0) return;

    try {
      const response = await fetch(`${API_BASE_URL}/notifications/read-all`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result.message || "Unable to update notifications.");
      }

      setNotifications((items) =>
        items.map((item) => ({ ...item, read: true }))
      );
    } catch (error) {
      console.error("Mark Notifications Read Error:", error);
      setNotificationError(error.message || "Unable to update notifications.");
    }
  };

  const handleNotificationToggle = async () => {
    const opening = !notificationOpen;
    setNotificationOpen(opening);

    if (opening) {
      await loadNotifications();
    }
  };

  const openNotification = async (notification) => {
    if (!notification.read) {
      await markAllNotificationsRead();
    }

    setNotificationOpen(false);

    if (notification.link) {
      navigate(notification.link);
    }
  };

  const userName = user?.fullName || user?.name || "SplitNest User";

  const initials = useMemo(() => {
    return userName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase();
  }, [userName]);

  const menuItems = [
    { label: "Dashboard", icon: <FiGrid />, path: "/dashboard" },
    { label: "Browse Houses", icon: <FiCompass />, path: "/properties" },
    { label: "My Bookings", icon: <FiBookOpen />, path: "/my-bookings" },
    { label: "Find Roommates", icon: <FiUsers />, path: "/roommates" },
  ];

  const financeItems = [
    { label: "Split Rent", icon: <FiDollarSign />, path: "/rent" },
    { label: "Track Expenses", icon: <FiPlusCircle />, path: "/expenses" },
  ];

  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(`${path}/`);

  const goTo = (path) => {
    navigate(path);
    setSidebarOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const renderMenuItem = (item) => (
    <button
      type="button"
      key={item.path}
      className={`user-layout-menu-item ${isActive(item.path) ? "active" : ""}`}
      onClick={() => goTo(item.path)}
    >
      <span className="user-layout-menu-icon">{item.icon}</span>
      <span>{item.label}</span>
    </button>
  );

  return (
    <div className="user-layout light-theme">
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar overlay"
          className="user-layout-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`user-layout-sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="user-layout-brand">
          <div className="user-layout-brand-icon"><FiHome /></div>
          <div className="user-layout-brand-name">Split<span>Nest</span></div>
          <button
            type="button"
            className="user-layout-sidebar-close"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <FiX />
          </button>
        </div>

        <button type="button" className="user-layout-profile" onClick={() => goTo("/profile")}>
          <div className="user-layout-avatar">{initials}</div>
          <div className="user-layout-profile-text">
            <strong>{userName}</strong>
            <span>{userRole === "owner" ? "Owner" : "Tenant"}</span>
          </div>
        </button>

        <div className="user-layout-scroll-area">
          <nav className="user-layout-menu">
            <p className="user-layout-menu-heading">Main Panel</p>
            {menuItems.map(renderMenuItem)}
            <p className="user-layout-menu-heading user-layout-finance-heading">Finance & Utilities</p>
            {financeItems.map(renderMenuItem)}
          </nav>
        </div>

        <button type="button" className="user-layout-signout" onClick={handleLogout}>
          <FiLogOut />
          <span>Sign Out</span>
        </button>
      </aside>

      <section className="user-layout-right">
        <header className="user-layout-topbar">
          <button
            type="button"
            className="user-layout-mobile-menu"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
          >
            <FiMenu />
          </button>

          <div className="user-layout-search">
            <FiCompass />
            <input type="text" placeholder="Search properties, roommates, locations..." />
          </div>

          <div className="user-layout-top-actions">
            <div className="user-layout-notification-wrap" ref={notificationRef}>
              <button
                type="button"
                className="user-layout-icon-button user-layout-notification-button"
                aria-label="Notifications"
                title="View notifications"
                aria-expanded={notificationOpen}
                onClick={handleNotificationToggle}
              >
                <FiBell />
                {unreadCount > 0 && (
                  <span className="user-layout-notification-badge">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </button>

              {notificationOpen && (
                <div className="user-layout-notification-panel">
                  <div className="user-layout-notification-header">
                    <div>
                      <strong>Notifications</strong>
                      <span>{unreadCount} unread</span>
                    </div>
                    <button
                      type="button"
                      onClick={markAllNotificationsRead}
                      disabled={unreadCount === 0}
                    >
                      <FiCheck /> Mark all read
                    </button>
                  </div>

                  <div className="user-layout-notification-list">
                    {notificationLoading && notifications.length === 0 && (
                      <p className="user-layout-notification-state">Loading notifications...</p>
                    )}

                    {!notificationLoading && notificationError && (
                      <div className="user-layout-notification-state error">
                        <p>{notificationError}</p>
                        <button type="button" onClick={loadNotifications}>Try again</button>
                      </div>
                    )}

                    {!notificationLoading && !notificationError && notifications.length === 0 && (
                      <p className="user-layout-notification-state">No notifications yet.</p>
                    )}

                    {notifications.map((notification) => (
                      <button
                        type="button"
                        key={notification._id || notification.id}
                        className={`user-layout-notification-item ${notification.read ? "read" : "unread"}`}
                        onClick={() => openNotification(notification)}
                      >
                        <span className="user-layout-notification-dot" />
                        <span className="user-layout-notification-content">
                          <strong>{notification.title || "Notification"}</strong>
                          <span>{notification.message}</span>
                          <small>
                            {notification.createdAt
                              ? new Date(notification.createdAt).toLocaleString()
                              : "Just now"}
                          </small>
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button type="button" className="user-layout-top-avatar" onClick={() => goTo("/profile")}>
              {initials}
            </button>
          </div>
        </header>

        <main className="user-layout-page"><Outlet /></main>
      </section>
    </div>
  );
}

export default UserLayout;
