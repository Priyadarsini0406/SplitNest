import { useMemo, useState } from "react";

import {
  FiHome,
  FiCompass,
  FiUsers,
  FiDollarSign,
  FiPlusCircle,
  FiBookOpen,
  FiGrid,
  FiLogOut,
  FiMenu,
  FiX,
} from "react-icons/fi";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  useAuth,
} from "../../context/AuthContext";

import "./DashboardLayout.css";

function DashboardLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    logout,
    userRole,
    user,
  } = useAuth();

  const [
    mobileSidebarOpen,
    setMobileSidebarOpen,
  ] = useState(false);

  const isActive = (path) =>
    location.pathname === path;

  const goTo = (path) => {
    navigate(path);
    setMobileSidebarOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const userName =
    user?.fullName ||
    user?.name ||
    "SplitNest User";

  const initials = useMemo(() => {
    return userName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  }, [userName]);

  return (
    <div className="dashboard-layout-root">

      {mobileSidebarOpen && (
        <div
          className="dashboard-layout-overlay"
          onClick={() =>
            setMobileSidebarOpen(false)
          }
        />
      )}

      <aside
        className={`dashboard-layout-sidebar ${
          mobileSidebarOpen ? "open" : ""
        }`}
      >

        <div className="dashboard-layout-brand">

          <div className="dashboard-layout-logo-icon">
            <FiHome />
          </div>

          <div className="dashboard-layout-logo-text">
            Split<span>Nest</span>
          </div>

          <button
            type="button"
            className="dashboard-layout-close d-lg-none"
            onClick={() =>
              setMobileSidebarOpen(false)
            }
          >
            <FiX />
          </button>

        </div>

        <div
          className="dashboard-layout-profile"
          onClick={() =>
            goTo("/profile")
          }
        >

          <div className="dashboard-layout-avatar">
            {initials}
          </div>

          <div>

            <h6>
              {userName}
            </h6>

            <span>
              {userRole === "owner"
                ? "Owner"
                : "Tenant"}
            </span>

          </div>

        </div>

        <nav className="dashboard-layout-menu">

          <p className="dashboard-layout-menu-title">
            Main Panel
          </p>

          <button
            type="button"
            className={`dashboard-layout-menu-link ${
              isActive("/dashboard")
                ? "active"
                : ""
            }`}
            onClick={() =>
              goTo("/dashboard")
            }
          >
            <FiGrid />
            <span>Dashboard</span>
          </button>

          <button
            type="button"
            className={`dashboard-layout-menu-link ${
              isActive("/properties")
                ? "active"
                : ""
            }`}
            onClick={() =>
              goTo("/properties")
            }
          >
            <FiCompass />
            <span>Browse Houses</span>
          </button>

          <button
            type="button"
            className={`dashboard-layout-menu-link ${
              isActive("/my-bookings")
                ? "active"
                : ""
            }`}
            onClick={() =>
              goTo("/my-bookings")
            }
          >
            <FiBookOpen />
            <span>My Bookings</span>
          </button>

          <button
            type="button"
            className={`dashboard-layout-menu-link ${
              isActive("/roommates")
                ? "active"
                : ""
            }`}
            onClick={() =>
              goTo("/roommates")
            }
          >
            <FiUsers />
            <span>Find Roommates</span>
          </button>

          <p className="dashboard-layout-menu-title">
            Finance & Utilities
          </p>

          <button
            type="button"
            className={`dashboard-layout-menu-link ${
              isActive("/rent")
                ? "active"
                : ""
            }`}
            onClick={() =>
              goTo("/rent")
            }
          >
            <FiDollarSign />
            <span>Split Rent</span>
          </button>

          <button
            type="button"
            className={`dashboard-layout-menu-link ${
              isActive("/expenses")
                ? "active"
                : ""
            }`}
            onClick={() =>
              goTo("/expenses")
            }
          >
            <FiPlusCircle />
            <span>Track Expenses</span>
          </button>

        </nav>

        <button
          type="button"
          className="dashboard-layout-menu-link dashboard-layout-logout"
          onClick={handleLogout}
        >
          <FiLogOut />
          <span>Sign Out</span>
        </button>

      </aside>

      <div className="dashboard-layout-content">

        <header className="dashboard-layout-mobile-header d-lg-none">

          <button
            type="button"
            className="dashboard-layout-menu-toggle"
            onClick={() =>
              setMobileSidebarOpen(true)
            }
          >
            <FiMenu />
          </button>

          <span className="dashboard-layout-mobile-logo">
            SplitNest
          </span>

        </header>

        <main className="dashboard-layout-main">
          {children}
        </main>

      </div>

    </div>
  );
}

export default DashboardLayout;