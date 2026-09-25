import { useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Alert,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import OwnerDashboardLayout from "../../components/OwnerDashboardLayout/OwnerDashboardLayout";
import "./AddProperty.css";

const salemAreas = [
  "Hasthampatti",
  "Fairlands",
  "Suramangalam",
  "Alagapuram",
  "Ammapet",
  "Gugai",
  "Shevapet",
  "Kondalampatti",
];

const amenitiesList = [
  "WiFi",
  "Parking",
  "Power Backup",
  "Water Supply",
  "Furnished",
  "AC",
  "Security",
  "Laundry",
];

function AddProperty() {
  const navigate = useNavigate();
  const { authHeaders } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    area: "",
    rent: "",
    deposit: "",
    type: "",
    amenities: [],
    description: "",
    image: "",
    status: "Active",
    sharingOptions: ["double"],
    totalBeds: 1,
    availableBeds: 1,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAmenityChange = (amenity) => {
    setFormData((prev) => {
      const alreadySelected =
        prev.amenities.includes(amenity);

      return {
        ...prev,
        amenities: alreadySelected
          ? prev.amenities.filter(
              (item) => item !== amenity
            )
          : [...prev.amenities, amenity],
      };
    });
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      return "Property name is required.";
    }

    if (!formData.area) {
      return "Please select Salem area.";
    }

    if (!formData.type) {
      return "Please select property type.";
    }

    if (
      formData.rent === "" ||
      Number(formData.rent) <= 0
    ) {
      return "Enter a valid rent amount.";
    }

    if (
      formData.deposit === "" ||
      Number(formData.deposit) < 0
    ) {
      return "Enter a valid deposit amount.";
    }

    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/properties",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            ...authHeaders,
          },

          body: JSON.stringify({
            name: formData.name.trim(),
            area: formData.area,
            rent: Number(formData.rent),
            deposit: Number(formData.deposit),
            type: formData.type,
            amenities: formData.amenities,
            description:
              formData.description.trim(),
            image: formData.image.trim(),
            status: formData.status,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Failed to add property."
        );
      }

      setMessage(
        "Property added successfully!"
      );

      setTimeout(() => {
        navigate("/my-properties");
      }, 800);
    } catch (err) {
      console.error(
        "Add Property Error:",
        err
      );

      setError(
        err.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <OwnerDashboardLayout>
      <div className="add-property-page">
        <Container fluid>
        <div className="add-property-header">
          <p className="section-label">
            OWNER PANEL
          </p>

          <h2>Add Property</h2>

          <p>
            Add your property details and make it
            available on SplitNest.
          </p>
        </div>

        <div className="add-property-card">
          {message && (
            <Alert variant="success">
              {message}
            </Alert>
          )}

          {error && (
            <Alert variant="danger">
              {error}
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            <Row className="g-4">
              {/* Property Name */}

              <Col md={8}>
                <Form.Group>
                  <Form.Label>
                    Property Name
                  </Form.Label>

                  <Form.Control
                    type="text"
                    name="name"
                    placeholder="Example: Green View PG"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>

              {/* Property Type */}

              <Col md={4}>
                <Form.Group>
                  <Form.Label>
                    Property Type
                  </Form.Label>

                  <Form.Select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                  >
                    <option value="">
                      Select Type
                    </option>

                    <option value="PG">
                      PG
                    </option>

                    <option value="Apartment">
                      Apartment
                    </option>

                    <option value="Hostel">
                      Hostel
                    </option>

                    <option value="Room">
                      Room
                    </option>

                    <option value="House">
                      House
                    </option>
                  </Form.Select>
                </Form.Group>
              </Col>

              {/* Salem Area */}

              <Col md={6}>
                <Form.Group>
                  <Form.Label>
                    Salem Area
                  </Form.Label>

                  <Form.Select
                    name="area"
                    value={formData.area}
                    onChange={handleChange}
                  >
                    <option value="">
                      Select Area
                    </option>

                    {salemAreas.map((area) => (
                      <option
                        key={area}
                        value={area}
                      >
                        {area}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              {/* Rent */}

              <Col md={3}>
                <Form.Group>
                  <Form.Label>
                    Monthly Rent
                  </Form.Label>

                  <Form.Control
                    type="number"
                    min="1"
                    name="rent"
                    placeholder="6500"
                    value={formData.rent}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>

              {/* Deposit */}

              <Col md={3}>
                <Form.Group>
                  <Form.Label>
                    Deposit
                  </Form.Label>

                  <Form.Control
                    type="number"
                    min="0"
                    name="deposit"
                    placeholder="10000"
                    value={formData.deposit}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>

              {/* Image URL */}

              <Col md={8}>
                <Form.Group>
                  <Form.Label>
                    Property Image URL
                  </Form.Label>

                  <Form.Control
                    type="url"
                    name="image"
                    placeholder="https://example.com/property.jpg"
                    value={formData.image}
                    onChange={handleChange}
                  />

                  <Form.Text className="text-muted">
                    For now, paste an image URL.
                  </Form.Text>
                </Form.Group>
              </Col>

              {/* Availability */}

              <Col md={4}>
                <Form.Group>
                  <Form.Label>
                    Availability
                  </Form.Label>

                  <Form.Select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value="Active">
                      Active
                    </option>

                    <option value="Inactive">
                      Inactive
                    </option>
                  </Form.Select>
                </Form.Group>
              </Col>

              {/* Amenities */}

              <Col xs={12}>
                <Form.Group>
                  <Form.Label>
                    Amenities
                  </Form.Label>

                  <div className="amenities-grid">
                    {amenitiesList.map(
                      (amenity) => (
                        <Form.Check
                          key={amenity}
                          type="checkbox"
                          id={`amenity-${amenity}`}
                          label={amenity}
                          checked={formData.amenities.includes(
                            amenity
                          )}
                          onChange={() =>
                            handleAmenityChange(
                              amenity
                            )
                          }
                        />
                      )
                    )}
                  </div>
                </Form.Group>
              </Col>

              {/* Description */}

              <Col xs={12}>
                <Form.Group>
                  <Form.Label>
                    Description
                  </Form.Label>

                  <Form.Control
                    as="textarea"
                    rows={5}
                    name="description"
                    placeholder="Write a short description about the property..."
                    value={formData.description}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>

              {/* Room sharing */}
              <Col xs={12}>
                <Form.Group>
                  <Form.Label>Room Sharing Options</Form.Label>
                  <div className="amenities-grid">
                    {["single", "double", "triple"].map((option) => (
                      <Form.Check
                        key={option}
                        type="checkbox"
                        id={`sharing-${option}`}
                        label={`${option.charAt(0).toUpperCase() + option.slice(1)} Sharing`}
                        checked={(formData.sharingOptions || []).includes(option)}
                        onChange={(event) => setFormData((previous) => ({
                          ...previous,
                          sharingOptions: event.target.checked
                            ? [...(previous.sharingOptions || []), option]
                            : (previous.sharingOptions || []).filter((item) => item !== option),
                        }))}
                      />
                    ))}
                  </div>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label>Total Beds</Form.Label>
                  <Form.Control type="number" min="1" name="totalBeds" value={formData.totalBeds} onChange={handleChange} />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label>Available Beds</Form.Label>
                  <Form.Control type="number" min="0" name="availableBeds" value={formData.availableBeds} onChange={handleChange} />
                </Form.Group>
              </Col>

              {/* Buttons */}

              <Col xs={12}>
                <div className="form-actions">
                  <Button
                    type="button"
                    className="cancel-btn"
                    onClick={() =>
                      navigate("/my-properties")
                    }
                  >
                    Cancel
                  </Button>

                  <Button
                    type="submit"
                    className="submit-property-btn"
                    disabled={loading}
                  >
                    {loading
                      ? "Adding..."
                      : "Add Property"}
                  </Button>
                </div>
              </Col>
            </Row>
          </Form>
        </div>
        </Container>
      </div>
    </OwnerDashboardLayout>
  );
}

export default AddProperty;