import { useCallback, useEffect, useMemo, useState } from "react";
import {
  FiAlertCircle,
  FiCheckCircle,
  FiHome,
  FiMapPin,
  FiPhone,
  FiPlus,
  FiRefreshCw,
  FiTrash2,
  FiUsers,
} from "react-icons/fi";
import { MdBed } from "react-icons/md";

import OwnerDashboardLayout from "../../components/OwnerDashboardLayout/OwnerDashboardLayout";
import { useAuth } from "../../context/AuthContext";

import "./OwnerRoommates.css";

const API_BASE =
  import.meta.env.VITE_API_URL ||
  `${window.location.protocol}//${window.location.hostname}:5000`;

const INITIAL_FORM = {
  propertyId: "",
  gender: "Any",
  sharingType: "double",
  rent: "",
  availableBeds: 1,
  description: "",
  contactPhone: "",
};

const formatSharingType = (value = "") => {
  const text = String(value).trim();

  if (!text) {
    return "Sharing";
  }

  return `${text.charAt(0).toUpperCase()}${text.slice(1)} Sharing`;
};

const formatCurrency = (value) =>
  Number(value || 0).toLocaleString("en-IN");

export default function OwnerRoommates() {
  const { authHeaders } = useAuth();

  const [properties, setProperties] = useState([]);
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState(INITIAL_FORM);

  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [deletingId, setDeletingId] = useState("");

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const activeProperties = useMemo(
    () =>
      properties.filter(
        (property) =>
          String(property.status || "").toLowerCase() === "active"
      ),
    [properties]
  );

  const totalBeds = useMemo(
    () =>
      rows.reduce(
        (total, listing) =>
          total + Number(listing.availableBeds || 0),
        0
      ),
    [rows]
  );

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const [propertiesResponse, listingsResponse] = await Promise.all([
        fetch(`${API_BASE}/api/properties`, {
          headers: authHeaders,
        }),

        fetch(`${API_BASE}/api/roommate-listings/owner`, {
          headers: authHeaders,
        }),
      ]);

      const propertiesResult = await propertiesResponse.json();
      const listingsResult = await listingsResponse.json();

      if (!propertiesResponse.ok) {
        throw new Error(
          propertiesResult.message || "Unable to load properties."
        );
      }

      if (!listingsResponse.ok) {
        throw new Error(
          listingsResult.message || "Unable to load roommate listings."
        );
      }

      setProperties(
        Array.isArray(propertiesResult.data)
          ? propertiesResult.data
          : []
      );

      setRows(
        Array.isArray(listingsResult.data)
          ? listingsResult.data
          : []
      );
    } catch (err) {
      console.error("Load owner roommate listings error:", err);

      setProperties([]);
      setRows([]);
      setError(err.message || "Unable to load roommate listings.");
    } finally {
      setLoading(false);
    }
  }, [authHeaders]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const updateForm = (field, value) => {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));

    setError("");
    setMessage("");
  };

  const handlePropertyChange = (propertyId) => {
    const selectedProperty = properties.find(
      (property) => property._id === propertyId
    );

    setForm((currentForm) => ({
      ...currentForm,
      propertyId,
      rent:
        currentForm.rent ||
        selectedProperty?.rent ||
        selectedProperty?.monthlyRent ||
        "",
    }));

    setError("");
    setMessage("");
  };

  const validateForm = () => {
    if (!form.propertyId) {
      return "Please select one active property.";
    }

    if (!form.rent || Number(form.rent) <= 0) {
      return "Please enter a valid monthly rent.";
    }

    if (
      !form.availableBeds ||
      Number(form.availableBeds) < 1
    ) {
      return "Available beds must be at least 1.";
    }

    const cleanPhone = String(form.contactPhone || "").replace(
      /\D/g,
      ""
    );

    if (cleanPhone && cleanPhone.length !== 10) {
      return "Contact phone must contain exactly 10 digits.";
    }

    return "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      setMessage("");
      return;
    }

    try {
      setPublishing(true);
      setError("");
      setMessage("");

      const payload = {
        ...form,
        rent: Number(form.rent),
        availableBeds: Number(form.availableBeds),
        contactPhone: String(form.contactPhone || "").replace(
          /\D/g,
          ""
        ),
        description: String(form.description || "").trim(),
      };

      const response = await fetch(
        `${API_BASE}/api/roommate-listings`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...authHeaders,
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Unable to publish roommate listing."
        );
      }

      setForm(INITIAL_FORM);
      setMessage(
        result.message || "Roommate listing published successfully."
      );

      await loadData();
    } catch (err) {
      console.error("Publish roommate listing error:", err);

      setError(
        err.message || "Unable to publish roommate listing."
      );
    } finally {
      setPublishing(false);
    }
  };

  const handleDelete = async (listingId, propertyName) => {
    const shouldDelete = window.confirm(
      `Delete roommate listing for "${propertyName}"?`
    );

    if (!shouldDelete) {
      return;
    }

    try {
      setDeletingId(listingId);
      setError("");
      setMessage("");

      const response = await fetch(
        `${API_BASE}/api/roommate-listings/${listingId}`,
        {
          method: "DELETE",
          headers: authHeaders,
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Unable to delete roommate listing."
        );
      }

      setRows((currentRows) =>
        currentRows.filter((row) => row._id !== listingId)
      );

      setMessage(
        result.message || "Roommate listing deleted successfully."
      );
    } catch (err) {
      console.error("Delete roommate listing error:", err);

      setError(
        err.message || "Unable to delete roommate listing."
      );
    } finally {
      setDeletingId("");
    }
  };

  return (
    <OwnerDashboardLayout>
      <main className="orm-page">
        <section className="orm-hero">
          <div className="orm-hero-content">
            <span className="orm-eyebrow">
              <FiUsers />
              Shared-room management
            </span>

            <h1>Roommate Listings</h1>

            <p>
              Publish available sharing rooms and connect with users
              searching for a suitable shared living space.
            </p>
          </div>

          <div className="orm-stat-grid">
            <div className="orm-stat-card">
              <FiHome />

              <div>
                <strong>{activeProperties.length}</strong>
                <span>Active properties</span>
              </div>
            </div>

            <div className="orm-stat-card">
              <FiUsers />

              <div>
                <strong>{rows.length}</strong>
                <span>Published listings</span>
              </div>
            </div>

            <div className="orm-stat-card">
              <MdBed />

              <div>
                <strong>{totalBeds}</strong>
                <span>Available beds</span>
              </div>
            </div>
          </div>
        </section>

        {message && (
          <div className="orm-alert orm-alert-success">
            <FiCheckCircle />
            <span>{message}</span>
          </div>
        )}

        {error && (
          <div className="orm-alert orm-alert-error">
            <FiAlertCircle />
            <span>{error}</span>
          </div>
        )}

        <section className="orm-form-card">
          <div className="orm-section-heading">
            <div>
              <span className="orm-section-icon">
                <FiPlus />
              </span>

              <div>
                <h2>Publish New Listing</h2>
                <p>
                  Select an active property and enter the room
                  availability details.
                </p>
              </div>
            </div>
          </div>

          {activeProperties.length === 0 && !loading && (
            <div className="orm-property-warning">
              <FiAlertCircle />

              <span>
                You need at least one active property before publishing
                a roommate listing.
              </span>
            </div>
          )}

          <form className="orm-form" onSubmit={handleSubmit}>
            <div className="orm-field orm-field-wide">
              <label htmlFor="roommateProperty">
                Property
                <span>*</span>
              </label>

              <select
                id="roommateProperty"
                required
                value={form.propertyId}
                onChange={(event) =>
                  handlePropertyChange(event.target.value)
                }
                disabled={publishing}
              >
                <option value="">Select an active property</option>

                {activeProperties.map((property) => (
                  <option
                    key={property._id}
                    value={property._id}
                  >
                    {property.name} - {property.area}
                  </option>
                ))}
              </select>
            </div>

            <div className="orm-field">
              <label htmlFor="roommateGender">
                Preferred gender
              </label>

              <select
                id="roommateGender"
                value={form.gender}
                onChange={(event) =>
                  updateForm("gender", event.target.value)
                }
                disabled={publishing}
              >
                <option value="Any">Any gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            <div className="orm-field">
              <label htmlFor="roommateSharing">
                Sharing type
              </label>

              <select
                id="roommateSharing"
                value={form.sharingType}
                onChange={(event) =>
                  updateForm("sharingType", event.target.value)
                }
                disabled={publishing}
              >
                <option value="single">Single Sharing</option>
                <option value="double">Double Sharing</option>
                <option value="triple">Triple Sharing</option>
              </select>
            </div>

            <div className="orm-field">
              <label htmlFor="roommateRent">
                Monthly rent
                <span>*</span>
              </label>

              <div className="orm-input-with-prefix">
                <span>₹</span>

                <input
                  id="roommateRent"
                  required
                  type="number"
                  min="1"
                  placeholder="Enter monthly rent"
                  value={form.rent}
                  onChange={(event) =>
                    updateForm("rent", event.target.value)
                  }
                  disabled={publishing}
                />
              </div>
            </div>

            <div className="orm-field">
              <label htmlFor="roommateBeds">
                Available beds
                <span>*</span>
              </label>

              <div className="orm-input-with-icon">
                <MdBed />

                <input
                  id="roommateBeds"
                  required
                  type="number"
                  min="1"
                  placeholder="Number of beds"
                  value={form.availableBeds}
                  onChange={(event) =>
                    updateForm(
                      "availableBeds",
                      event.target.value
                    )
                  }
                  disabled={publishing}
                />
              </div>
            </div>

            <div className="orm-field">
              <label htmlFor="roommatePhone">
                Contact phone
              </label>

              <div className="orm-input-with-icon">
                <FiPhone />

                <input
                  id="roommatePhone"
                  type="tel"
                  inputMode="numeric"
                  maxLength="10"
                  placeholder="Uses profile phone if empty"
                  value={form.contactPhone}
                  onChange={(event) =>
                    updateForm(
                      "contactPhone",
                      event.target.value.replace(/\D/g, "")
                    )
                  }
                  disabled={publishing}
                />
              </div>

              <small>
                Leave empty to use the phone number from your owner
                profile.
              </small>
            </div>

            <div className="orm-field orm-field-description">
              <label htmlFor="roommateDescription">
                Room description
              </label>

              <textarea
                id="roommateDescription"
                rows="4"
                maxLength="500"
                placeholder="Mention nearby locations, facilities, roommate expectations, food preference or house rules..."
                value={form.description}
                onChange={(event) =>
                  updateForm("description", event.target.value)
                }
                disabled={publishing}
              />

              <small>
                {form.description.length}/500 characters
              </small>
            </div>

            <div className="orm-form-submit">
              <button
                type="submit"
                className="orm-publish-button"
                disabled={
                  publishing || activeProperties.length === 0
                }
              >
                {publishing ? (
                  <>
                    <FiRefreshCw className="orm-spin" />
                    Publishing...
                  </>
                ) : (
                  <>
                    <FiPlus />
                    Publish Listing
                  </>
                )}
              </button>
            </div>
          </form>
        </section>

        <section className="orm-listings-section">
          <div className="orm-listings-header">
            <div>
              <h2>Published Listings</h2>

              <p>
                Manage all roommate listings created from your
                properties.
              </p>
            </div>

            <button
              type="button"
              className="orm-refresh-button"
              onClick={loadData}
              disabled={loading}
            >
              <FiRefreshCw className={loading ? "orm-spin" : ""} />
              Refresh
            </button>
          </div>

          {loading ? (
            <div className="orm-loading-grid">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="orm-loading-card"
                />
              ))}
            </div>
          ) : rows.length > 0 ? (
            <div className="orm-grid">
              {rows.map((listing) => (
                <article
                  className="orm-listing-card"
                  key={listing._id}
                >
                  <div className="orm-listing-accent" />

                  <div className="orm-listing-top">
                    <div className="orm-property-avatar">
                      <FiHome />
                    </div>

                    <div className="orm-listing-title">
                      <h3>
                        {listing.propertyName || "Shared Room"}
                      </h3>

                      <p>
                        <FiMapPin />
                        {listing.area || "Location unavailable"}
                      </p>
                    </div>

                    <span
                      className={`orm-status-badge ${
                        listing.status === "Active"
                          ? "active"
                          : "inactive"
                      }`}
                    >
                      {listing.status || "Active"}
                    </span>
                  </div>

                  <div className="orm-listing-tags">
                    <span>
                      <FiUsers />
                      {formatSharingType(listing.sharingType)}
                    </span>

                    <span>{listing.gender || "Any"}</span>

                    <span>
                      <MdBed />
                      {Number(listing.availableBeds || 0)} bed(s)
                    </span>
                  </div>

                  <div className="orm-listing-description">
                    <strong>Room details</strong>

                    <p>
                      {listing.description ||
                        `${formatSharingType(
                          listing.sharingType
                        )} room available in ${
                          listing.area || "the listed area"
                        }.`}
                    </p>
                  </div>

                  <div className="orm-listing-footer">
                    <div className="orm-listing-rent">
                      <span>Monthly rent</span>

                      <strong>
                        ₹{formatCurrency(listing.rent)}
                        <small>/month</small>
                      </strong>
                    </div>

                    <div className="orm-listing-actions">
                      {listing.contactPhone && (
                        <span className="orm-contact-number">
                          <FiPhone />
                          {listing.contactPhone}
                        </span>
                      )}

                      <button
                        type="button"
                        className="orm-delete-button"
                        onClick={() =>
                          handleDelete(
                            listing._id,
                            listing.propertyName
                          )
                        }
                        disabled={deletingId === listing._id}
                      >
                        {deletingId === listing._id ? (
                          <>
                            <FiRefreshCw className="orm-spin" />
                            Deleting...
                          </>
                        ) : (
                          <>
                            <FiTrash2 />
                            Delete
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="orm-empty-state">
              <div className="orm-empty-icon">
                <FiUsers />
              </div>

              <h3>No roommate listings yet</h3>

              <p>
                Select one of your active properties and publish its
                available sharing-room details.
              </p>
            </div>
          )}
        </section>
      </main>
    </OwnerDashboardLayout>
  );
}