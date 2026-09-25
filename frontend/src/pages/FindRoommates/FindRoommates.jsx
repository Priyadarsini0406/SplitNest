import { useEffect, useMemo, useState } from "react";

import {
  FiMapPin,
  FiPhone,
  FiSearch,
  FiSliders,
  FiUsers,
  FiX,
} from "react-icons/fi";

import { MdBed } from "react-icons/md";
import { HiOutlineHomeModern } from "react-icons/hi2";

import "./FindRoommates.css";

const API_BASE = `${window.location.protocol}//${window.location.hostname}:5000`;

const formatSharing = (value = "") => {
  const cleanValue = String(value).trim().toLowerCase();

  if (!cleanValue) {
    return "Sharing";
  }

  return `${
    cleanValue.charAt(0).toUpperCase() +
    cleanValue.slice(1)
  } Sharing`;
};

const getInitials = (name = "SplitNest") =>
  String(name)
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) =>
      part.charAt(0).toUpperCase()
    )
    .join("");

function FindRoommates() {
  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState("");
  const [gender, setGender] = useState("All");
  const [sharing, setSharing] = useState("All");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadListings = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_BASE}/api/roommate-listings/public`
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.message ||
              "Unable to load roommate rooms."
          );
        }

        if (isMounted) {
          setRows(
            Array.isArray(result.data)
              ? result.data
              : []
          );
        }
      } catch (err) {
        console.error(
          "Load roommate listings error:",
          err
        );

        if (isMounted) {
          setRows([]);

          setError(
            err.message ||
              "Unable to load roommate rooms."
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadListings();

    return () => {
      isMounted = false;
    };
  }, []);

  const shown = useMemo(() => {
    const query = search
      .trim()
      .toLowerCase();

    return rows.filter((row) => {
      const searchableText = [
        row.propertyName,
        row.area,
        row.sharingType,
        row.gender,
        row.description,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const searchMatches =
        !query ||
        searchableText.includes(query);

      const genderMatches =
        gender === "All" ||
        String(row.gender)
          .trim()
          .toLowerCase() ===
          gender.toLowerCase();

      const sharingMatches =
        sharing === "All" ||
        String(row.sharingType)
          .trim()
          .toLowerCase() ===
          sharing.toLowerCase();

      return (
        searchMatches &&
        genderMatches &&
        sharingMatches
      );
    });
  }, [
    rows,
    search,
    gender,
    sharing,
  ]);

  const totalBeds = useMemo(
    () =>
      rows.reduce(
        (total, room) =>
          total +
          Number(room.availableBeds || 0),
        0
      ),
    [rows]
  );

  const clearFilters = () => {
    setSearch("");
    setGender("All");
    setSharing("All");
  };

  const hasFilters =
    Boolean(search.trim()) ||
    gender !== "All" ||
    sharing !== "All";

  return (
    <main className="find-roommates-page animate-fade-in">
      <section className="roommate-hero-panel">
        <div className="roommate-hero-copy">
          <span className="roommate-eyebrow">
            <FiUsers />
            Verified shared spaces
          </span>

          <h1>
            Find Your Next Roommate Space
          </h1>

          <p>
            Discover owner-published rooms,
            compare sharing options and contact
            property owners directly.
          </p>
        </div>

        <div className="roommate-hero-stats">
          <div className="roommate-stat-card">
            <HiOutlineHomeModern />

            <div>
              <strong>{rows.length}</strong>
              <span>Active rooms</span>
            </div>
          </div>

          <div className="roommate-stat-card">
            <MdBed />

            <div>
              <strong>{totalBeds}</strong>
              <span>Available beds</span>
            </div>
          </div>
        </div>
      </section>

      <section className="roommate-search-panel">
        <div className="roommate-search-box">
          <FiSearch />

          <input
            type="search"
            placeholder="Search by property, area, sharing type or gender"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />

          {search && (
            <button
              type="button"
              className="roommate-clear-search"
              onClick={() => setSearch("")}
              aria-label="Clear search"
            >
              <FiX />
            </button>
          )}
        </div>

        <div className="roommate-filter-row">
          <span className="roommate-filter-label">
            <FiSliders />
            Quick filters
          </span>

          <div className="roommate-filter-group">
            {[
              "All",
              "Male",
              "Female",
              "Any",
            ].map((item) => (
              <button
                type="button"
                key={item}
                className={
                  gender === item
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setGender(item)
                }
              >
                {item === "All"
                  ? "All genders"
                  : item}
              </button>
            ))}
          </div>

          <div className="roommate-filter-group">
            {[
              "All",
              "single",
              "double",
              "triple",
            ].map((item) => (
              <button
                type="button"
                key={item}
                className={
                  sharing === item
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setSharing(item)
                }
              >
                {item === "All"
                  ? "All sharing"
                  : formatSharing(item)}
              </button>
            ))}
          </div>

          {hasFilters && (
            <button
              type="button"
              className="roommate-reset-button"
              onClick={clearFilters}
            >
              Reset
            </button>
          )}
        </div>
      </section>

      <section className="roommate-results-section">
        <div className="roommate-results-heading">
          <div>
            <h2>
              Available Shared Rooms
            </h2>

            <p>
              {loading
                ? "Checking current availability..."
                : `${shown.length} listing${
                    shown.length === 1
                      ? ""
                      : "s"
                  } found`}
            </p>
          </div>
        </div>

        {error && (
          <div className="roommate-error-state">
            {error}
          </div>
        )}

        {loading ? (
          <div className="roommate-loading-grid">
            {[1, 2, 3].map((item) => (
              <div
                className="roommate-loading-card"
                key={item}
              />
            ))}
          </div>
        ) : shown.length > 0 ? (
          <div className="roommate-listing-grid">
            {shown.map(
              (room, index) => (
                <article
                  className="roommate-listing-card"
                  key={
                    room._id ||
                    `${room.propertyName}-${index}`
                  }
                >
                  <div className="roommate-card-accent" />

                  <div className="roommate-card-top">
                    <div className="roommate-property-avatar">
                      {getInitials(
                        room.propertyName
                      )}
                    </div>

                    <div className="roommate-property-heading">
                      <div className="roommate-property-title-row">
                        <h3>
                          {room.propertyName ||
                            "Shared Room"}
                        </h3>

                        {index === 0 && (
                          <span className="roommate-featured-badge">
                            Featured
                          </span>
                        )}
                      </div>

                      <p>
                        <FiMapPin />

                        {room.area ||
                          "Location not specified"}
                      </p>
                    </div>
                  </div>

                  <div className="roommate-card-tags">
                    <span>
                      <FiUsers />

                      {formatSharing(
                        room.sharingType
                      )}
                    </span>

                    <span>
                      {room.gender || "Any"}
                    </span>

                    <span>
                      <MdBed />

                      {Number(
                        room.availableBeds || 0
                      )}{" "}
                      bed(s)
                    </span>
                  </div>

                  <div className="roommate-description">
                    <strong>Room Details</strong>
                    <p>
                      {room.description ||
                        `${formatSharing(
                          room.sharingType
                        )} room available in ${
                          room.area ||
                          "the listed area"
                        }. Contact the owner for more information.`}
                    </p>
                  </div>

                  <div className="roommate-card-footer">
                    <div className="roommate-rent-block">
                      <span>
                        Monthly rent
                      </span>

                      <strong>
                        ₹
                        {Number(
                          room.rent || 0
                        ).toLocaleString(
                          "en-IN"
                        )}

                        <small>
                          /month
                        </small>
                      </strong>
                    </div>

                    {room.contactPhone ? (
                      <div className="roommate-contact-section">
                        <span className="roommate-phone-number">
                          <FiPhone />
                          {room.contactPhone}
                        </span>

                        <a
                          className="roommate-contact-button"
                          href={`tel:${room.contactPhone}`}
                          aria-label={`Call owner at ${room.contactPhone}`}
                        >
                          <FiPhone />
                          Contact Owner
                        </a>
                      </div>
                    ) : (
                      <span className="roommate-phone-unavailable">
                        Contact number unavailable
                      </span>
                    )}
                  </div>
                </article>
              )
            )}
          </div>
        ) : (
          <div className="roommate-empty-state">
            <div className="roommate-empty-icon">
              <FiUsers />
            </div>

            <h3>
              No matching roommate rooms
            </h3>

            <p>
              Try another area, gender or
              sharing filter.
            </p>

            {hasFilters && (
              <button
                type="button"
                onClick={clearFilters}
              >
                Clear all filters
              </button>
            )}
          </div>
        )}
      </section>
    </main>
  );
}

export default FindRoommates;