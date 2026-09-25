import { useMemo, useState } from "react";
import { Container, Row, Col, Form, Button, Badge } from "react-bootstrap";
import { FaEdit, FaTrash, FaSearch } from "react-icons/fa";
import "./MyProperties.css";

const propertyData = [
  {
    id: 1,
    name: "Green View PG",
    area: "Hasthampatti",
    rent: 6500,
    deposit: 10000,
    type: "PG",
    status: "Active",
    image:
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 2,
    name: "Sri Lakshmi Apartment",
    area: "Fairlands",
    rent: 9000,
    deposit: 20000,
    type: "Apartment",
    status: "Active",
    image:
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 3,
    name: "Royal Mens Hostel",
    area: "Suramangalam",
    rent: 5000,
    deposit: 8000,
    type: "Hostel",
    status: "Inactive",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 4,
    name: "City Stay Rooms",
    area: "Alagapuram",
    rent: 7500,
    deposit: 15000,
    type: "Room",
    status: "Active",
    image:
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80",
  },
];

function MyProperties() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [areaFilter, setAreaFilter] = useState("All");

  const filteredProperties = useMemo(() => {
    return propertyData.filter((property) => {
      const matchesSearch =
        property.name.toLowerCase().includes(search.toLowerCase()) ||
        property.area.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "All" || property.status === statusFilter;

      const matchesArea =
        areaFilter === "All" || property.area === areaFilter;

      return matchesSearch && matchesStatus && matchesArea;
    });
  }, [search, statusFilter, areaFilter]);

  const handleEdit = (property) => {
    alert(`Edit UI clicked for ${property.name}`);
  };

  const handleDelete = (property) => {
    alert(`Delete UI clicked for ${property.name}`);
  };

  return (
    <div className="my-properties-page">
      <Container fluid>
        <div className="page-header">
          <div>
            <p className="page-small-title">OWNER PANEL</p>
            <h2>My Properties</h2>
            <p>
              View and manage all your listed properties in one place.
            </p>
          </div>

          <Button className="add-property-btn">
            + Add Property
          </Button>
        </div>

        <div className="filter-section">
          <Row className="g-3 align-items-center">
            <Col lg={6} md={12}>
              <div className="search-box">
                <FaSearch className="search-icon" />

                <Form.Control
                  type="text"
                  placeholder="Search by property name or area..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </Col>

            <Col lg={3} md={6}>
              <Form.Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </Form.Select>
            </Col>

            <Col lg={3} md={6}>
              <Form.Select
                value={areaFilter}
                onChange={(e) => setAreaFilter(e.target.value)}
              >
                <option value="All">All Salem Areas</option>
                <option value="Hasthampatti">Hasthampatti</option>
                <option value="Fairlands">Fairlands</option>
                <option value="Suramangalam">Suramangalam</option>
                <option value="Alagapuram">Alagapuram</option>
              </Form.Select>
            </Col>
          </Row>
        </div>

        <div className="properties-count">
          <h5>
            Showing {filteredProperties.length}{" "}
            {filteredProperties.length === 1 ? "Property" : "Properties"}
          </h5>
        </div>

        <Row className="g-4">
          {filteredProperties.length > 0 ? (
            filteredProperties.map((property) => (
              <Col
                key={property.id}
                xl={4}
                lg={6}
                md={6}
                sm={12}
              >
                <div className="property-card">
                  <div className="property-image-wrapper">
                    <img
                      src={property.image}
                      alt={property.name}
                      className="property-image"
                    />

                    <Badge
                      className={`status-badge ${
                        property.status === "Active"
                          ? "active-status"
                          : "inactive-status"
                      }`}
                    >
                      {property.status}
                    </Badge>
                  </div>

                  <div className="property-content">
                    <div className="property-top">
                      <div>
                        <h4>{property.name}</h4>
                        <p>{property.area}, Salem</p>
                      </div>

                      <span className="property-type">
                        {property.type}
                      </span>
                    </div>

                    <div className="price-section">
                      <div>
                        <span>Monthly Rent</span>
                        <h5>
                          ₹{property.rent.toLocaleString()}
                        </h5>
                      </div>

                      <div>
                        <span>Deposit</span>
                        <h5>
                          ₹{property.deposit.toLocaleString()}
                        </h5>
                      </div>
                    </div>

                    <div className="property-actions">
                      <Button
                        className="edit-btn"
                        onClick={() => handleEdit(property)}
                      >
                        <FaEdit />
                        Edit
                      </Button>

                      <Button
                        className="delete-btn"
                        onClick={() => handleDelete(property)}
                      >
                        <FaTrash />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </Col>
            ))
          ) : (
            <Col xs={12}>
              <div className="empty-state">
                <h4>No Properties Found</h4>
                <p>
                  Try changing your search or filter options.
                </p>
              </div>
            </Col>
          )}
        </Row>
      </Container>
    </div>
  );
}

export default MyProperties;