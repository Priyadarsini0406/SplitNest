/* eslint-disable react-hooks/set-state-in-effect */
import {
  useEffect,
  useState,
} from "react";

import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaBuilding,
  FaCity,
  FaEdit,
  FaSave,
  FaTimes,
  FaLock,
  FaCamera,
  FaCalendarAlt,
  FaShieldAlt,
} from "react-icons/fa";

import OwnerDashboardLayout from
  "../../components/OwnerDashboardLayout/OwnerDashboardLayout";

import {
  useAuth,
} from "../../context/AuthContext";

import "./OwnerProfile.css";

const API_URL =
  "http://localhost:5000/api";

function OwnerProfile() {
  const {
    user,
    token,
  } = useAuth();

  // ==========================================
  // STATES
  // ==========================================

  const [
    profile,
    setProfile,
  ] = useState({
    fullName: "",
    email: "",
    phone: "",
    role: "owner",

    businessName: "",
    address: "",
    city: "",
    area: "",

    profileImage: "",
    createdAt: "",
  });

  const [
    formData,
    setFormData,
  ] = useState({
    fullName: "",
    phone: "",

    businessName: "",
    address: "",
    city: "",
    area: "",

    profileImage: "",
  });

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    saving,
    setSaving,
  ] = useState(false);

  const [
    editMode,
    setEditMode,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  const [
    success,
    setSuccess,
  ] = useState("");

  // ==========================================
  // PASSWORD STATES
  // ==========================================

  const [
    showPasswordModal,
    setShowPasswordModal,
  ] = useState(false);

  const [
    passwordLoading,
    setPasswordLoading,
  ] = useState(false);

  const [
    passwordData,
    setPasswordData,
  ] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // ==========================================
  // FETCH OWNER PROFILE
  // ==========================================

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/auth/me`,
        {
          method: "GET",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Unable to load profile."
        );
      }

      const data =
        result.data ||
        result.user ||
        {};

      const profileData = {
        fullName:
          data.fullName ||
          user?.fullName ||
          "",

        email:
          data.email ||
          user?.email ||
          "",

        phone:
          data.phone ||
          user?.phone ||
          "",

        role:
          data.role ||
          user?.role ||
          "owner",

        businessName:
          data.businessName ||
          "",

        address:
          data.address ||
          "",

        city:
          data.city ||
          "",

        area:
          data.area ||
          "",

        profileImage:
          data.profileImage ||
          "",

        createdAt:
          data.createdAt ||
          user?.createdAt ||
          "",
      };

      setProfile(
        profileData
      );

      setFormData({
        fullName:
          profileData.fullName,

        phone:
          profileData.phone,

        businessName:
          profileData.businessName,

        address:
          profileData.address,

        city:
          profileData.city,

        area:
          profileData.area,

        profileImage:
          profileData.profileImage,
      });
    } catch (err) {
      console.error(
        "Owner Profile Error:",
        err
      );

      /*
        Fallback:
        If /auth/me is temporarily
        unavailable, show logged-in
        user information.
      */

      if (user) {
        const fallback = {
          fullName:
            user.fullName || "",

          email:
            user.email || "",

          phone:
            user.phone || "",

          role:
            user.role || "owner",

          businessName:
            user.businessName || "",

          address:
            user.address || "",

          city:
            user.city || "",

          area:
            user.area || "",

          profileImage:
            user.profileImage || "",

          createdAt:
            user.createdAt || "",
        };

        setProfile(fallback);

        setFormData({
          fullName:
            fallback.fullName,

          phone:
            fallback.phone,

          businessName:
            fallback.businessName,

          address:
            fallback.address,

          city:
            fallback.city,

          area:
            fallback.area,

          profileImage:
            fallback.profileImage,
        });
      } else {
        setError(
          err.message ||
            "Unable to load profile."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOAD PROFILE
  // ==========================================

  useEffect(() => {
    if (token) {
      fetchProfile();
    } else {
      setLoading(false);
    }

    // eslint-disable-next-line
  }, [token]);

  // ==========================================
  // HANDLE INPUT
  // ==========================================

  const handleChange = (
    event
  ) => {
    const {
      name,
      value,
    } = event.target;

    setFormData(
      (previous) => ({
        ...previous,

        [name]:
          value,
      })
    );
  };

  // ==========================================
  // EDIT PROFILE
  // ==========================================

  const handleEdit = () => {
    setError("");
    setSuccess("");

    setFormData({
      fullName:
        profile.fullName,

      phone:
        profile.phone,

      businessName:
        profile.businessName,

      address:
        profile.address,

      city:
        profile.city,

      area:
        profile.area,

      profileImage:
        profile.profileImage,
    });

    setEditMode(true);
  };

  // ==========================================
  // CANCEL EDIT
  // ==========================================

  const handleCancel = () => {
    setEditMode(false);

    setError("");
    setSuccess("");

    setFormData({
      fullName:
        profile.fullName,

      phone:
        profile.phone,

      businessName:
        profile.businessName,

      address:
        profile.address,

      city:
        profile.city,

      area:
        profile.area,

      profileImage:
        profile.profileImage,
    });
  };

  // ==========================================
  // PROFILE PHOTO UPLOAD
  // ==========================================

  const handleProfileImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError("");
    setSuccess("");

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      event.target.value = "";
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError("Profile image must be below 2 MB.");
      event.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setFormData((previous) => ({
        ...previous,
        profileImage: String(reader.result || ""),
      }));
    };
    reader.onerror = () => setError("Unable to read the selected image.");
    reader.readAsDataURL(file);
  };

  // ==========================================
  // SAVE PROFILE
  // ==========================================

  const handleSave = async (
    event
  ) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (
      !formData.fullName.trim()
    ) {
      setError(
        "Full name is required."
      );

      return;
    }

    const cleanPhone =
      formData.phone.replace(
        /\D/g,
        ""
      );

    if (
      formData.phone &&
      cleanPhone.length !== 10
    ) {
      setError(
        "Please enter a valid 10 digit phone number."
      );

      return;
    }

    try {
      setSaving(true);

      const response = await fetch(
        `${API_URL}/users/profile`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify({
            fullName:
              formData.fullName.trim(),

            phone:
              formData.phone.trim(),

            businessName:
              formData.businessName.trim(),

            address:
              formData.address.trim(),

            city:
              formData.city.trim(),

            area:
              formData.area.trim(),

            profileImage:
              formData.profileImage.trim(),
          }),
        }
      );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Unable to update profile."
        );
      }

      const updated =
        result.data ||
        result.user ||
        {};

      const updatedProfile = {
        ...profile,
        ...formData,
        ...updated,
      };

      setProfile(
        updatedProfile
      );

      /*
        Update localStorage user
        without removing JWT token.
      */

      const savedUser =
        localStorage.getItem(
          "splitnest_user"
        );

      if (savedUser) {
        const currentUser =
          JSON.parse(
            savedUser
          );

        localStorage.setItem(
          "splitnest_user",

          JSON.stringify({
            ...currentUser,
            ...updatedProfile,
          })
        );
      }

      setEditMode(false);

      setSuccess(
        result.message ||
          "Profile updated successfully."
      );
    } catch (err) {
      console.error(
        "Update Profile Error:",
        err
      );

      setError(
        err.message ||
          "Unable to update profile."
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // PASSWORD INPUT
  // ==========================================

  const handlePasswordChange = (
    event
  ) => {
    const {
      name,
      value,
    } = event.target;

    setPasswordData(
      (previous) => ({
        ...previous,

        [name]:
          value,
      })
    );
  };

  // ==========================================
  // CHANGE PASSWORD
  // ==========================================

  const handleChangePassword =
    async (event) => {
      event.preventDefault();

      setError("");
      setSuccess("");

      if (
        !passwordData.currentPassword ||
        !passwordData.newPassword ||
        !passwordData.confirmPassword
      ) {
        setError(
          "Please fill all password fields."
        );

        return;
      }

      if (
        passwordData.newPassword
          .length < 6
      ) {
        setError(
          "New password must contain at least 6 characters."
        );

        return;
      }

      if (
        passwordData.newPassword !==
        passwordData.confirmPassword
      ) {
        setError(
          "New passwords do not match."
        );

        return;
      }

      try {
        setPasswordLoading(
          true
        );

        const response =
          await fetch(
            `${API_URL}/auth/change-password`,
            {
              method: "PUT",

              headers: {
                "Content-Type":
                  "application/json",

                Authorization:
                  `Bearer ${token}`,
              },

              body:
                JSON.stringify({
                  currentPassword:
                    passwordData.currentPassword,

                  newPassword:
                    passwordData.newPassword,
                }),
            }
          );

        const result =
          await response.json();

        if (!response.ok) {
          throw new Error(
            result.message ||
              "Unable to change password."
          );
        }

        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });

        setShowPasswordModal(
          false
        );

        setSuccess(
          result.message ||
            "Password changed successfully."
        );
      } catch (err) {
        console.error(
          "Change Password Error:",
          err
        );

        setError(
          err.message ||
            "Unable to change password."
        );
      } finally {
        setPasswordLoading(
          false
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
      return "Not available";
    }

    const parsedDate =
      new Date(date);

    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {
      return "Not available";
    }

    return parsedDate.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }
    );
  };

  // ==========================================
  // INITIALS
  // ==========================================

  const getInitials = () => {
    const name =
      profile.fullName ||
      "Property Owner";

    return name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map(
        (word) =>
          word[0]
      )
      .join("")
      .toUpperCase();
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <OwnerDashboardLayout>

        <div className="owner-profile-loading">

          <div className="owner-profile-spinner" />

          <h3>
            Loading Profile...
          </h3>

        </div>

      </OwnerDashboardLayout>
    );
  }

  // ==========================================
  // UI
  // ==========================================

  return (
    <OwnerDashboardLayout>

      <div className="owner-profile-page">

        {/* HEADER */}

        <div className="owner-profile-header">

          <div>

            <p className="owner-profile-eyebrow">
              OWNER PANEL
            </p>

            <h1>
              My Profile
            </h1>

            <p>
              Manage your personal and
              property owner information.
            </p>

          </div>

          {!editMode && (

            <button
              type="button"
              className="owner-profile-edit-btn"
              onClick={
                handleEdit
              }
            >

              <FaEdit />

              Edit Profile

            </button>

          )}

        </div>

        {/* ALERTS */}

        {error && (

          <div className="owner-profile-alert error">

            {error}

          </div>

        )}

        {success && (

          <div className="owner-profile-alert success">

            {success}

          </div>

        )}

        {/* MAIN GRID */}

        <div className="owner-profile-grid">

          {/* LEFT CARD */}

          <aside className="owner-profile-card owner-profile-summary">

            <div className="owner-profile-avatar-wrapper">

              <img
                src={profile.profileImage || "/default-owner-avatar.svg"}
                alt={profile.fullName || "Property owner"}
                className="owner-profile-avatar-image"
                onError={(event) => {
                  event.currentTarget.src = "/default-owner-avatar.svg";
                }}
              />

              <div className="owner-profile-camera">

                <FaCamera />

              </div>

            </div>

            <h2>
              {profile.fullName ||
                "Property Owner"}
            </h2>

            <p className="owner-profile-email">

              {profile.email}

            </p>

            <div className="owner-role-badge">

              <FaShieldAlt />

              Property Owner

            </div>

            <div className="owner-profile-summary-divider" />

            <div className="owner-profile-mini-info">

              <div>

                <FaPhone />

                <span>

                  {profile.phone ||
                    "Phone not added"}

                </span>

              </div>

              <div>

                <FaBuilding />

                <span>

                  {profile.businessName ||
                    "Business name not added"}

                </span>

              </div>

              <div>

                <FaMapMarkerAlt />

                <span>

                  {profile.area ||
                    profile.city ||
                    "Location not added"}

                </span>

              </div>

              <div>

                <FaCalendarAlt />

                <span>

                  Member since{" "}

                  {formatDate(
                    profile.createdAt
                  )}

                </span>

              </div>

            </div>

            <button
              type="button"
              className="owner-change-password-btn"
              onClick={() => {

                setError("");

                setSuccess("");

                setShowPasswordModal(
                  true
                );

              }}
            >

              <FaLock />

              Change Password

            </button>

          </aside>

          {/* RIGHT DETAILS */}

          <section className="owner-profile-card owner-profile-details">

            <div className="owner-profile-section-title">

              <div>

                <h3>
                  Owner Information
                </h3>

                <p>
                  Your account and
                  property management
                  details.
                </p>

              </div>

            </div>

            <form
              onSubmit={
                handleSave
              }
            >

              <div className="owner-profile-form-grid">

                {/* FULL NAME */}

                <div className="owner-profile-field">

                  <label>

                    <FaUser />

                    Full Name

                  </label>

                  {editMode ? (

                    <input
                      type="text"
                      name="fullName"
                      value={
                        formData.fullName
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="Enter full name"
                    />

                  ) : (

                    <div className="owner-profile-value">

                      {profile.fullName ||
                        "Not added"}

                    </div>

                  )}

                </div>

                {/* EMAIL */}

                <div className="owner-profile-field">

                  <label>

                    <FaEnvelope />

                    Email Address

                  </label>

                  <div className="owner-profile-value readonly">

                    {profile.email ||
                      "Not added"}

                  </div>

                </div>

                {/* PHONE */}

                <div className="owner-profile-field">

                  <label>

                    <FaPhone />

                    Phone Number

                  </label>

                  {editMode ? (

                    <input
                      type="tel"
                      name="phone"
                      value={
                        formData.phone
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="Enter phone number"
                    />

                  ) : (

                    <div className="owner-profile-value">

                      {profile.phone ||
                        "Not added"}

                    </div>

                  )}

                </div>

                {/* ROLE */}

                <div className="owner-profile-field">

                  <label>

                    <FaShieldAlt />

                    Account Role

                  </label>

                  <div className="owner-profile-value readonly">

                    Property Owner

                  </div>

                </div>

                {/* BUSINESS */}

                <div className="owner-profile-field full-width">

                  <label>

                    <FaBuilding />

                    Business /
                    Property Name

                  </label>

                  {editMode ? (

                    <input
                      type="text"
                      name="businessName"
                      value={
                        formData.businessName
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="Example: SplitNest Homes"
                    />

                  ) : (

                    <div className="owner-profile-value">

                      {profile.businessName ||
                        "Not added"}

                    </div>

                  )}

                </div>

                {/* ADDRESS */}

                <div className="owner-profile-field full-width">

                  <label>

                    <FaMapMarkerAlt />

                    Address

                  </label>

                  {editMode ? (

                    <textarea
                      name="address"
                      value={
                        formData.address
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="Enter your address"
                      rows="3"
                    />

                  ) : (

                    <div className="owner-profile-value multiline">

                      {profile.address ||
                        "Not added"}

                    </div>

                  )}

                </div>

                {/* CITY */}

                <div className="owner-profile-field">

                  <label>

                    <FaCity />

                    City

                  </label>

                  {editMode ? (

                    <input
                      type="text"
                      name="city"
                      value={
                        formData.city
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="Example: Salem"
                    />

                  ) : (

                    <div className="owner-profile-value">

                      {profile.city ||
                        "Not added"}

                    </div>

                  )}

                </div>

                {/* AREA */}

                <div className="owner-profile-field">

                  <label>

                    <FaMapMarkerAlt />

                    Area

                  </label>

                  {editMode ? (

                    <input
                      type="text"
                      name="area"
                      value={
                        formData.area
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="Example: Fairlands"
                    />

                  ) : (

                    <div className="owner-profile-value">

                      {profile.area ||
                        "Not added"}

                    </div>

                  )}

                </div>

                {/* IMAGE URL */}

                {editMode && (

                  <div className="owner-profile-field full-width">
                    <label>
                      <FaCamera />
                      Upload Profile Photo
                    </label>

                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={handleProfileImageUpload}
                    />

                    <small>
                      Select JPG, PNG or WebP. Maximum size: 2 MB.
                    </small>

                  </div>

                )}

              </div>

              {/* ACTIONS */}

              {editMode && (

                <div className="owner-profile-actions">

                  <button
                    type="button"
                    className="owner-profile-cancel-btn"
                    onClick={
                      handleCancel
                    }
                    disabled={
                      saving
                    }
                  >

                    <FaTimes />

                    Cancel

                  </button>

                  <button
                    type="submit"
                    className="owner-profile-save-btn"
                    disabled={
                      saving
                    }
                  >

                    <FaSave />

                    {saving
                      ? "Saving..."
                      : "Save Changes"}

                  </button>

                </div>

              )}

            </form>

          </section>

        </div>

        {/* PASSWORD MODAL */}

        {showPasswordModal && (

          <div
            className="owner-password-overlay"
            onMouseDown={(event) => {

              if (
                event.target ===
                event.currentTarget
              ) {
                setShowPasswordModal(
                  false
                );
              }

            }}
          >

            <div className="owner-password-modal">

              <div className="owner-password-header">

                <div>

                  <h3>
                    Change Password
                  </h3>

                  <p>
                    Enter your current
                    password and create a
                    new password.
                  </p>

                </div>

                <button
                  type="button"
                  onClick={() =>
                    setShowPasswordModal(
                      false
                    )
                  }
                >

                  <FaTimes />

                </button>

              </div>

              <form
                onSubmit={
                  handleChangePassword
                }
              >

                <div className="owner-password-field">

                  <label>
                    Current Password
                  </label>

                  <input
                    type="password"
                    name="currentPassword"
                    value={
                      passwordData.currentPassword
                    }
                    onChange={
                      handlePasswordChange
                    }
                    placeholder="Enter current password"
                  />

                </div>

                <div className="owner-password-field">

                  <label>
                    New Password
                  </label>

                  <input
                    type="password"
                    name="newPassword"
                    value={
                      passwordData.newPassword
                    }
                    onChange={
                      handlePasswordChange
                    }
                    placeholder="Minimum 6 characters"
                  />

                </div>

                <div className="owner-password-field">

                  <label>
                    Confirm New Password
                  </label>

                  <input
                    type="password"
                    name="confirmPassword"
                    value={
                      passwordData.confirmPassword
                    }
                    onChange={
                      handlePasswordChange
                    }
                    placeholder="Confirm new password"
                  />

                </div>

                <div className="owner-password-actions">

                  <button
                    type="button"
                    className="password-cancel-btn"
                    onClick={() =>
                      setShowPasswordModal(
                        false
                      )
                    }
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="password-save-btn"
                    disabled={
                      passwordLoading
                    }
                  >

                    {passwordLoading
                      ? "Updating..."
                      : "Update Password"}

                  </button>

                </div>

              </form>

            </div>

          </div>

        )}

      </div>

    </OwnerDashboardLayout>
  );
}

export default OwnerProfile;