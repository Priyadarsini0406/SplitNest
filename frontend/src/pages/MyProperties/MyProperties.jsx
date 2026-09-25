/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useMemo, useState } from "react";

import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Badge,
  Spinner,
  Alert,
} from "react-bootstrap";

import {
  FaEdit,
  FaTrash,
  FaSearch,
  FaPlus,
} from "react-icons/fa";

import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import OwnerDashboardLayout from "../../components/OwnerDashboardLayout/OwnerDashboardLayout";

import "./MyProperties.css";

function MyProperties() {
  const navigate = useNavigate();
  const { authHeaders } = useAuth();

  // ==========================================
  // STATES
  // ==========================================

  const [properties, setProperties] = useState([]);

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [areaFilter, setAreaFilter] =
    useState("All");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // ==========================================
  // FETCH PROPERTIES FROM BACKEND
  // ==========================================

  const fetchProperties = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "http://localhost:5000/api/properties",
        {
          method: "GET",

          headers: {
            "Content-Type":
              "application/json",

            // Temporary owner ID
            // Later replace with real login user ID
            ...authHeaders,
          },
        }
      );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Failed to fetch properties."
        );
      }

      setProperties(
        result.data || []
      );
    } catch (err) {
      console.error(
        "Fetch Properties Error:",
        err
      );

      setError(
        err.message ||
          "Unable to load properties."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOAD PROPERTIES
  // ==========================================

  useEffect(() => {
    fetchProperties();
  }, []);

  // ==========================================
  // SEARCH + FILTER
  // ==========================================

  const filteredProperties =
    useMemo(() => {
      const keyword = search
        .trim()
        .toLowerCase();

      return properties.filter(
        (property) => {
          const propertyName =
            property.name?.toLowerCase() ||
            "";

          const propertyArea =
            property.area?.toLowerCase() ||
            "";

          const propertyType =
            property.type?.toLowerCase() ||
            "";

          const matchesSearch =
            propertyName.includes(
              keyword
            ) ||
            propertyArea.includes(
              keyword
            ) ||
            propertyType.includes(
              keyword
            );

          const matchesStatus =
            statusFilter === "All" ||
            property.status ===
              statusFilter;

          const matchesArea =
            areaFilter === "All" ||
            property.area ===
              areaFilter;

          return (
            matchesSearch &&
            matchesStatus &&
            matchesArea
          );
        }
      );
    }, [
      properties,
      search,
      statusFilter,
      areaFilter,
    ]);

  // ==========================================
  // ADD PROPERTY
  // ==========================================

  const handleAddProperty = () => {
    navigate("/add-property");
  };

  // ==========================================
  // EDIT PROPERTY
  // ==========================================

  const handleEdit = (
    propertyId
  ) => {
    if (!propertyId) {
      alert(
        "Property ID not found."
      );

      return;
    }

    navigate(
      `/edit-property/${propertyId}`
    );
  };

  // ==========================================
  // DELETE PROPERTY
  // ==========================================

  const handleDelete = async (
    propertyId,
    propertyName
  ) => {
    if (!propertyId) {
      alert(
        "Property ID not found."
      );

      return;
    }

    const confirmDelete =
      window.confirm(
        `Are you sure you want to delete "${propertyName}"?`
      );

    if (!confirmDelete) {
      return;
    }

    try {
      const response =
        await fetch(
          `http://localhost:5000/api/properties/${propertyId}`,
          {
            method: "DELETE",

            headers: {
              "Content-Type":
                "application/json",

              ...authHeaders,
            },
          }
        );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Failed to delete property."
        );
      }

      setProperties(
        (
          previousProperties
        ) =>
          previousProperties.filter(
            (property) =>
              property._id !==
              propertyId
          )
      );

      alert(
        "Property deleted successfully!"
      );
    } catch (err) {
      console.error(
        "Delete Property Error:",
        err
      );

      alert(
        err.message ||
          "Unable to delete property."
      );
    }
  };

  // ==========================================
  // IMAGE ERROR
  // ==========================================

  const handleImageError = (
    event
  ) => {
    event.currentTarget.src =
      "https://placehold.co/800x500?text=SplitNest+Property";
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <OwnerDashboardLayout>
      <div className="my-properties-page">

        <Container fluid>

          {/* ==============================
              PAGE HEADER
          ============================== */}

          <div className="page-header">

            <div>

              <p className="page-small-title">
                OWNER PANEL
              </p>

              <h2>
                My Properties
              </h2>

              <p>
                View and manage your
                listed properties in
                one place.
              </p>

            </div>

            <Button
              type="button"
              className="add-property-btn"
              onClick={
                handleAddProperty
              }
            >

              <FaPlus className="me-2" />

              Add Property

            </Button>

          </div>

          {/* ==============================
              SEARCH + FILTER
          ============================== */}

          <div className="filter-section">

            <Row className="g-3">

              {/* SEARCH */}

              <Col
                lg={6}
                md={12}
                xs={12}
              >

                <div className="search-box">

                  <FaSearch className="search-icon" />

                  <Form.Control
                    type="search"
                    placeholder="Search by name, area or type..."
                    value={search}
                    onChange={(e) =>
                      setSearch(
                        e.target.value
                      )
                    }
                  />

                </div>

              </Col>

              {/* STATUS FILTER */}

              <Col
                lg={3}
                md={6}
                xs={12}
              >

                <Form.Select
                  value={
                    statusFilter
                  }
                  onChange={(e) =>
                    setStatusFilter(
                      e.target.value
                    )
                  }
                >

                  <option value="All">
                    All Status
                  </option>

                  <option value="Active">
                    Active
                  </option>

                  <option value="Inactive">
                    Inactive
                  </option>

                </Form.Select>

              </Col>

              {/* AREA FILTER */}

              <Col
                lg={3}
                md={6}
                xs={12}
              >

                <Form.Select
                  value={
                    areaFilter
                  }
                  onChange={(e) =>
                    setAreaFilter(
                      e.target.value
                    )
                  }
                >

                  <option value="All">
                    All Salem Areas
                  </option>

                  <option value="Hasthampatti">
                    Hasthampatti
                  </option>

                  <option value="Fairlands">
                    Fairlands
                  </option>

                  <option value="Suramangalam">
                    Suramangalam
                  </option>

                  <option value="Alagapuram">
                    Alagapuram
                  </option>

                  <option value="Ammapet">
                    Ammapet
                  </option>

                  <option value="Gugai">
                    Gugai
                  </option>

                  <option value="Shevapet">
                    Shevapet
                  </option>

                  <option value="Kondalampatti">
                    Kondalampatti
                  </option>

                </Form.Select>

              </Col>

            </Row>

          </div>

          {/* ==============================
              ERROR MESSAGE
          ============================== */}

          {error && (
            <Alert
              variant="danger"
              className="mt-3"
            >

              {error}

              <div className="mt-2">

                <Button
                  size="sm"
                  variant="outline-danger"
                  onClick={
                    fetchProperties
                  }
                >
                  Try Again
                </Button>

              </div>

            </Alert>
          )}

          {/* ==============================
              LOADING
          ============================== */}

          {loading ? (

            <div className="text-center py-5">

              <Spinner animation="border" />

              <p className="mt-3">
                Loading properties...
              </p>

            </div>

          ) : (

            <>

              {/* ==============================
                  PROPERTY COUNT
              ============================== */}

              <div className="properties-count">

                <h5>

                  Showing{" "}

                  {
                    filteredProperties.length
                  }{" "}

                  {
                    filteredProperties.length ===
                    1
                      ? "Property"
                      : "Properties"
                  }

                </h5>

              </div>

              {/* ==============================
                  PROPERTY CARDS
              ============================== */}

              <Row className="g-4">

                {
                  filteredProperties.length >
                  0 ? (

                    filteredProperties.map(
                      (property) => (

                        <Col
                          key={
                            property._id
                          }
                          xl={4}
                          lg={6}
                          md={6}
                          sm={12}
                          xs={12}
                        >

                          <div className="property-card">

                            {/* IMAGE */}

                            <div className="property-image-wrapper">

                              <img
                                src={
                                  property.image ||
                                  "https://placehold.co/800x500?text=SplitNest+Property"
                                }
                                alt={
                                  property.name ||
                                  "Property"
                                }
                                className="property-image"
                                onError={
                                  handleImageError
                                }
                              />

                              {/* STATUS */}

                              <Badge
                                className={`status-badge ${
                                  property.status ===
                                  "Active"
                                    ? "active-status"
                                    : "inactive-status"
                                }`}
                              >

                                {
                                  property.status ||
                                  "Inactive"
                                }

                              </Badge>

                            </div>

                            {/* CONTENT */}

                            <div className="property-content">

                              {/* NAME + TYPE */}

                              <div className="property-top">

                                <div>

                                  <h4>
                                    {
                                      property.name
                                    }
                                  </h4>

                                  <p>
                                    {
                                      property.area
                                    }
                                    , Salem
                                  </p>

                                </div>

                                <span className="property-type">

                                  {
                                    property.type
                                  }

                                </span>

                              </div>

                              {/* PRICE */}

                              <div className="price-section">

                                <div>

                                  <span>
                                    Monthly Rent
                                  </span>

                                  <h5>
                                    ₹
                                    {Number(
                                      property.rent ||
                                        0
                                    ).toLocaleString(
                                      "en-IN"
                                    )}
                                  </h5>

                                </div>

                                <div>

                                  <span>
                                    Deposit
                                  </span>

                                  <h5>
                                    ₹
                                    {Number(
                                      property.deposit ||
                                        0
                                    ).toLocaleString(
                                      "en-IN"
                                    )}
                                  </h5>

                                </div>

                              </div>

                              {/* EDIT + DELETE */}

                              <div className="property-actions">

                                <Button
                                  type="button"
                                  className="edit-btn"
                                  onClick={() =>
                                    handleEdit(
                                      property._id
                                    )
                                  }
                                >

                                  <FaEdit />

                                  <span>
                                    Edit
                                  </span>

                                </Button>

                                <Button
                                  type="button"
                                  className="delete-btn"
                                  onClick={() =>
                                    handleDelete(
                                      property._id,
                                      property.name
                                    )
                                  }
                                >

                                  <FaTrash />

                                  <span>
                                    Delete
                                  </span>

                                </Button>

                              </div>

                            </div>

                          </div>

                        </Col>

                      )
                    )

                  ) : (

                    <Col xs={12}>

                      <div className="empty-state">

                        <h4>
                          No Properties Found
                        </h4>

                        <p>
                          {
                            properties.length ===
                            0
                              ? "You have not added any properties yet."
                              : "Try changing your search or filter options."
                          }
                        </p>

                        {
                          properties.length ===
                            0 && (

                            <Button
                              className="add-property-btn"
                              onClick={
                                handleAddProperty
                              }
                            >

                              <FaPlus className="me-2" />

                              Add Your First Property

                            </Button>

                          )
                        }

                      </div>

                    </Col>

                  )
                }

              </Row>

            </>

          )}

        </Container>

      </div>
    </OwnerDashboardLayout>
  );
}

export default MyProperties;