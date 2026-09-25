import { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Alert,
  Spinner,
} from "react-bootstrap";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import "./EditProperty.css";

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

function EditProperty() {
  const navigate = useNavigate();
  const { id } = useParams();

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
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // ==========================================
  // FETCH SINGLE PROPERTY
  // ==========================================

  const fetchProperty = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `http://localhost:5000/api/properties/${id}`,
        {
          method: "GET",

          headers: {
            "Content-Type": "application/json",
            "x-owner-id": "demo-owner-1",
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Failed to load property."
        );
      }

      const property = result.data;

      setFormData({
        name: property.name || "",
        area: property.area || "",
        rent: property.rent ?? "",
        deposit: property.deposit ?? "",
        type: property.type || "",
        amenities: property.amenities || [],
        description:
          property.description || "",
        image: property.image || "",
        status:
          property.status || "Active",
      });
    } catch (err) {
      console.error(
        "Fetch Property Error:",
        err
      );

      setError(
        err.message ||
          "Unable to load property."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProperty();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // ==========================================
  // INPUT CHANGE
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================
  // AMENITIES
  // ==========================================

  const handleAmenityChange = (amenity) => {
    setFormData((prev) => {
      const isSelected =
        prev.amenities.includes(amenity);

      return {
        ...prev,

        amenities: isSelected
          ? prev.amenities.filter(
              (item) => item !== amenity
            )
          : [
              ...prev.amenities,
              amenity,
            ],
      };
    });
  };

  // ==========================================
  // VALIDATION
  // ==========================================

  const validateForm = () => {
    if (!formData.name.trim()) {
      return "Property name is required.";
    }

    if (!formData.type) {
      return "Please select property type.";
    }

    if (!formData.area) {
      return "Please select Salem area.";
    }

    if (
      formData.rent === "" ||
      Number(formData.rent) <= 0
    ) {
      return "Enter a valid monthly rent.";
    }

    if (
      formData.deposit === "" ||
      Number(formData.deposit) < 0
    ) {
      return "Enter a valid deposit.";
    }

    return "";
  };

  // ==========================================
  // UPDATE PROPERTY
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    const validationError =
      validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(
        `http://localhost:5000/api/properties/${id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",

            "x-owner-id":
              "demo-owner-1",
          },

          body: JSON.stringify({
            name:
              formData.name.trim(),

            area:
              formData.area,

            rent:
              Number(formData.rent),

            deposit:
              Number(
                formData.deposit
              ),

            type:
              formData.type,

            amenities:
              formData.amenities,

            description:
              formData.description.trim(),

            image:
              formData.image.trim(),

            status:
              formData.status,
          }),
        }
      );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Failed to update property."
        );
      }

      setMessage(
        "Property updated successfully!"
      );

      setTimeout(() => {
        navigate("/my-properties");
      }, 800);
    } catch (err) {
      console.error(
        "Update Property Error:",
        err
      );

      setError(
        err.message ||
          "Unable to update property."
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="edit-property-loading">
        <Spinner animation="border" />

        <p>
          Loading property details...
        </p>
      </div>
    );
  }

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="edit-property-page">

      <Container>

        {/* HEADER */}

        <div className="edit-property-header">

          <p className="section-label">
            OWNER PANEL
          </p>

          <h2>
            Edit Property
          </h2>

          <p>
            Update your property details
            and save the changes.
          </p>

        </div>

        {/* FORM CARD */}

        <div className="edit-property-card">

          {/* SUCCESS */}

          {message && (
            <Alert variant="success">
              {message}
            </Alert>
          )}

          {/* ERROR */}

          {error && (
            <Alert variant="danger">
              {error}
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>

            <Row className="g-4">

              {/* PROPERTY NAME */}

              <Col md={8}>

                <Form.Group>

                  <Form.Label>
                    Property Name
                  </Form.Label>

                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={
                      handleChange
                    }
                    placeholder="Enter property name"
                  />

                </Form.Group>

              </Col>

              {/* PROPERTY TYPE */}

              <Col md={4}>

                <Form.Group>

                  <Form.Label>
                    Property Type
                  </Form.Label>

                  <Form.Select
                    name="type"
                    value={
                      formData.type
                    }
                    onChange={
                      handleChange
                    }
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

              {/* AREA */}

              <Col md={6}>

                <Form.Group>

                  <Form.Label>
                    Salem Area
                  </Form.Label>

                  <Form.Select
                    name="area"
                    value={
                      formData.area
                    }
                    onChange={
                      handleChange
                    }
                  >

                    <option value="">
                      Select Area
                    </option>

                    {
                      salemAreas.map(
                        (area) => (
                          <option
                            key={area}
                            value={area}
                          >
                            {area}
                          </option>
                        )
                      )
                    }

                  </Form.Select>

                </Form.Group>

              </Col>

              {/* RENT */}

              <Col md={3}>

                <Form.Group>

                  <Form.Label>
                    Monthly Rent
                  </Form.Label>

                  <Form.Control
                    type="number"
                    min="1"
                    name="rent"
                    value={
                      formData.rent
                    }
                    onChange={
                      handleChange
                    }
                  />

                </Form.Group>

              </Col>

              {/* DEPOSIT */}

              <Col md={3}>

                <Form.Group>

                  <Form.Label>
                    Deposit
                  </Form.Label>

                  <Form.Control
                    type="number"
                    min="0"
                    name="deposit"
                    value={
                      formData.deposit
                    }
                    onChange={
                      handleChange
                    }
                  />

                </Form.Group>

              </Col>

              {/* IMAGE */}

              <Col md={8}>

                <Form.Group>

                  <Form.Label>
                    Property Image URL
                  </Form.Label>

                  <Form.Control
                    type="url"
                    name="image"
                    value={
                      formData.image
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="https://example.com/image.jpg"
                  />

                </Form.Group>

              </Col>

              {/* STATUS */}

              <Col md={4}>

                <Form.Group>

                  <Form.Label>
                    Availability
                  </Form.Label>

                  <Form.Select
                    name="status"
                    value={
                      formData.status
                    }
                    onChange={
                      handleChange
                    }
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

              {/* AMENITIES */}

              <Col xs={12}>

                <Form.Group>

                  <Form.Label>
                    Amenities
                  </Form.Label>

                  <div className="amenities-grid">

                    {
                      amenitiesList.map(
                        (amenity) => (

                          <Form.Check
                            key={
                              amenity
                            }
                            type="checkbox"
                            id={`edit-${amenity}`}
                            label={
                              amenity
                            }
                            checked={
                              formData.amenities.includes(
                                amenity
                              )
                            }
                            onChange={() =>
                              handleAmenityChange(
                                amenity
                              )
                            }
                          />

                        )
                      )
                    }

                  </div>

                </Form.Group>

              </Col>

              {/* DESCRIPTION */}

              <Col xs={12}>

                <Form.Group>

                  <Form.Label>
                    Description
                  </Form.Label>

                  <Form.Control
                    as="textarea"
                    rows={5}
                    name="description"
                    value={
                      formData.description
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Enter property description"
                  />

                </Form.Group>

              </Col>

              {/* BUTTONS */}

              <Col xs={12}>

                <div className="form-actions">

                  <Button
                    type="button"
                    className="cancel-btn"
                    onClick={() =>
                      navigate(
                        "/my-properties"
                      )
                    }
                  >
                    Cancel
                  </Button>

                  <Button
                    type="submit"
                    className="update-property-btn"
                    disabled={
                      saving
                    }
                  >

                    {
                      saving
                        ? "Saving..."
                        : "Save Changes"
                    }

                  </Button>

                </div>

              </Col>

            </Row>

          </Form>

        </div>

      </Container>

    </div>
  );
}

export default EditProperty;