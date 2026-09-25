import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
} from "react-router-dom";

import {
  AuthProvider,
  useAuth,
} from "../context/AuthContext";

import LoginRequiredModal from "../components/LoginRequiredModal/LoginRequiredModal";
import UserLayout from "../components/UserLayout/UserLayout";

import Landing from "../pages/Landing/Landing";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import ForgotPassword from "../pages/ForgotPassword/ForgotPassword";
import ResetPassword from "../pages/ResetPassword/ResetPassword";
import VerifyEmail from "../pages/VerifyEmail/VerifyEmail";
import Rent from "../pages/Rent/Rent";
import Expenses from "../pages/Expenses/Expenses";
import Privacy from "../pages/Privacy/Privacy";
import Terms from "../pages/Terms/Terms";

import UserDashboard from "../pages/UserDashboard/UserDashboard";
import PropertyListing from "../pages/PropertyListing/PropertyListing";
import PropertyDetails from "../pages/PropertyDetails/PropertyDetails";
import FindRoommates from "../pages/FindRoommates/FindRoommates";
import Book from "../pages/Book/Book";
import MyBookings from "../pages/MyBookings/MyBookings";
import Profile from "../pages/Profile/Profile";

import OwnerDashboard from "../pages/OwnerDashboard/OwnerDashboard";
import MyProperties from "../pages/MyProperties/MyProperties";
import AddProperty from "../pages/AddProperty/AddProperty";
import EditProperty from "../pages/EditProperty/EditProperty";
import OwnerBookings from "../pages/OwnerBookings/OwnerBookings";
import OwnerProfile from "../pages/OwnerProfile/OwnerProfile";
import OwnerRoommates from "../pages/OwnerRoommates/OwnerRoommates";

function LoadingScreen() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background: "#0b1020",
        color: "#ffffff",
        fontSize: "16px",
      }}
    >
      Loading...
    </div>
  );
}

function ProtectedRoute({ role }) {
  const {
    isLoggedIn,
    userRole,
    authLoading,
  } = useAuth();

  if (authLoading) {
    return <LoadingScreen />;
  }

  if (!isLoggedIn) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  if (role && userRole !== role) {
    return (
      <Navigate
        to={
          userRole === "owner"
            ? "/owner-dashboard"
            : "/dashboard"
        }
        replace
      />
    );
  }

  return <Outlet />;
}

function HomeRedirect() {
  const {
    isLoggedIn,
    userRole,
    authLoading,
  } = useAuth();

  if (authLoading) {
    return <LoadingScreen />;
  }

  if (!isLoggedIn) {
    return <Landing />;
  }

  return (
    <Navigate
      to={
        userRole === "owner"
          ? "/owner-dashboard"
          : "/dashboard"
      }
      replace
    />
  );
}

function AppRoutes() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* PUBLIC ROUTES */}
          <Route
            path="/"
            element={<HomeRedirect />}
          />

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />

          <Route
            path="/verify-email"
            element={<VerifyEmail />}
          />

          <Route
            path="/forgot-password"
            element={<ForgotPassword />}
          />

          <Route
            path="/reset-password"
            element={<ResetPassword />}
          />

          <Route
            path="/privacy"
            element={<Privacy />}
          />

          <Route
            path="/terms"
            element={<Terms />}
          />

          {/* USER ROUTES */}
          <Route element={<ProtectedRoute role="user" />}>
            <Route element={<UserLayout />}>
              <Route
                path="/dashboard"
                element={<UserDashboard />}
              />

              <Route
                path="/properties"
                element={<PropertyListing />}
              />

              <Route
                path="/property-details/:id"
                element={<PropertyDetails />}
              />

              <Route
                path="/roommates"
                element={<FindRoommates />}
              />

              <Route
                path="/book/:id"
                element={<Book />}
              />

              <Route
                path="/my-bookings"
                element={<MyBookings />}
              />

              <Route
                path="/profile"
                element={<Profile />}
              />

              <Route
                path="/rent"
                element={<Rent />}
              />

              <Route
                path="/expenses"
                element={<Expenses />}
              />
            </Route>
          </Route>

          {/* OWNER ROUTES */}
          <Route element={<ProtectedRoute role="owner" />}>
            <Route
              path="/owner-dashboard"
              element={<OwnerDashboard />}
            />

            <Route
              path="/my-properties"
              element={<MyProperties />}
            />

            <Route
              path="/add-property"
              element={<AddProperty />}
            />

            <Route
              path="/edit-property/:id"
              element={<EditProperty />}
            />

            <Route
              path="/owner-bookings"
              element={<OwnerBookings />}
            />

            <Route
              path="/owner-roommates"
              element={<OwnerRoommates />}
            />

            <Route
              path="/owner-profile"
              element={<OwnerProfile />}
            />
          </Route>

          {/* FALLBACK ROUTE */}
          <Route
            path="*"
            element={
              <Navigate
                to="/"
                replace
              />
            }
          />
        </Routes>

        <LoginRequiredModal />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default AppRoutes;