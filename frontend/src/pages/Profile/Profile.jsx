import { useEffect, useMemo, useState } from "react";
import { Button, Col, Form, ProgressBar, Row, Spinner } from "react-bootstrap";
import { FiEdit3, FiMail, FiMapPin, FiPhone, FiSave, FiUser, FiUsers, FiX } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import "./Profile.css";

const API_URL = "http://localhost:5000/api";

function Profile() {
  const { user, authHeaders } = useAuth();

  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    phone: "",
    age: "",
    gender: "",
    occupation: "",
    collegeOrCompany: "",
    city: "Salem",
    preferredArea: "",
    monthlyBudget: "",
    roomType: "",
    foodPreference: "",
    smokingPreference: "",
    bio: "",
  });

  const [originalProfile, setOriginalProfile] = useState(profile);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await fetch(`${API_URL}/auth/me`, {
          headers: { ...authHeaders },
        });

        const result = await response.json();

        const data = {
          fullName: result.user?.fullName || user?.fullName || "",
          email: result.user?.email || user?.email || "",
          phone: result.user?.phone || "",
          age: result.user?.age || "",
          gender: result.user?.gender || "",
          occupation: result.user?.occupation || "",
          collegeOrCompany: result.user?.collegeOrCompany || "",
          city: result.user?.city || "Salem",
          preferredArea: result.user?.preferredArea || "",
          monthlyBudget: result.user?.monthlyBudget || "",
          roomType: result.user?.roomType || "",
          foodPreference: result.user?.foodPreference || "",
          smokingPreference: result.user?.smokingPreference || "",
          bio: result.user?.bio || "",
        };

        setProfile(data);
        setOriginalProfile(data);
      } catch {
        const fallback = {
          ...profile,
          fullName: user?.fullName || "",
          email: user?.email || "",
        };

        setProfile(fallback);
        setOriginalProfile(fallback);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [authHeaders, user]);

  const initials = useMemo(() => {
    return (profile.fullName || "User")
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  }, [profile.fullName]);

  const completion = useMemo(() => {
    const values = Object.values(profile);
    const completed = values.filter((value) => String(value || "").trim()).length;
    return Math.round((completed / values.length) * 100);
  }, [profile]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setProfile((previous) => ({ ...previous, [name]: value }));
  };

  const handleCancel = () => {
    setProfile(originalProfile);
    setEditing(false);
    setMessage("");
    setError("");
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch(`${API_URL}/users/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...authHeaders,
        },
        body: JSON.stringify(profile),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Unable to save profile.");
      }

      const updated = { ...profile, ...(result.data || {}) };
      setProfile(updated);
      setOriginalProfile(updated);
      setEditing(false);
      setMessage("Profile updated successfully.");
    } catch (saveError) {
      setError(saveError.message || "Unable to save profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-page">
        <div className="profile-loading">
          <Spinner animation="border" />
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div>
          <p>USER PANEL</p>
          <h1>My Profile</h1>
          <span>Manage your personal details and roommate preferences.</span>
        </div>

        {!editing && (
          <Button className="profile-edit-btn" onClick={() => setEditing(true)}>
            <FiEdit3 />
            Edit Profile
          </Button>
        )}
      </div>

      {message && <div className="profile-message success">{message}</div>}
      {error && <div className="profile-message error">{error}</div>}

      <div className="profile-layout">
        <aside className="profile-summary-card">
          <div className="profile-avatar">{initials}</div>
          <h2>{profile.fullName || "SplitNest User"}</h2>
          <p>Tenant Account</p>

          <div className="profile-progress-block">
            <div>
              <span>Profile Completion</span>
              <strong>{completion}%</strong>
            </div>
            <ProgressBar now={completion} />
          </div>

          <div className="profile-contact-list">
            <div><FiMail /><span>{profile.email || "Email not added"}</span></div>
            <div><FiPhone /><span>{profile.phone || "Phone not added"}</span></div>
            <div><FiMapPin /><span>{profile.city || "City not added"}</span></div>
          </div>
        </aside>

        <section className="profile-form-card">
          <Form onSubmit={handleSave}>
            <div className="profile-section-title">
              <FiUser />
              <div>
                <h3>Personal Information</h3>
                <p>Basic details visible to owners and roommates.</p>
              </div>
            </div>

            <Row className="g-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control name="fullName" value={profile.fullName} onChange={handleChange} disabled={!editing} />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label>Email</Form.Label>
                  <Form.Control value={profile.email} disabled />
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group>
                  <Form.Label>Phone</Form.Label>
                  <Form.Control name="phone" value={profile.phone} onChange={handleChange} disabled={!editing} />
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group>
                  <Form.Label>Age</Form.Label>
                  <Form.Control type="number" name="age" value={profile.age} onChange={handleChange} disabled={!editing} />
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group>
                  <Form.Label>Gender</Form.Label>
                  <Form.Select name="gender" value={profile.gender} onChange={handleChange} disabled={!editing}>
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label>Occupation</Form.Label>
                  <Form.Control name="occupation" value={profile.occupation} onChange={handleChange} disabled={!editing} />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label>College / Company</Form.Label>
                  <Form.Control name="collegeOrCompany" value={profile.collegeOrCompany} onChange={handleChange} disabled={!editing} />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label>City</Form.Label>
                  <Form.Control name="city" value={profile.city} onChange={handleChange} disabled={!editing} />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label>Preferred Area</Form.Label>
                  <Form.Control name="preferredArea" value={profile.preferredArea} onChange={handleChange} disabled={!editing} />
                </Form.Group>
              </Col>
            </Row>

            <div className="profile-divider" />

            <div className="profile-section-title">
              <FiUsers />
              <div>
                <h3>Living Preferences</h3>
                <p>Helps SplitNest recommend suitable properties and roommates.</p>
              </div>
            </div>

            <Row className="g-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Monthly Budget</Form.Label>
                  <Form.Control type="number" name="monthlyBudget" value={profile.monthlyBudget} onChange={handleChange} disabled={!editing} />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label>Room Type</Form.Label>
                  <Form.Select name="roomType" value={profile.roomType} onChange={handleChange} disabled={!editing}>
                    <option value="">Select</option>
                    <option value="Private Room">Private Room</option>
                    <option value="Double Sharing">Double Sharing</option>
                    <option value="Triple Sharing">Triple Sharing</option>
                    <option value="Entire Flat">Entire Flat</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label>Food Preference</Form.Label>
                  <Form.Select name="foodPreference" value={profile.foodPreference} onChange={handleChange} disabled={!editing}>
                    <option value="">Select</option>
                    <option value="Vegetarian">Vegetarian</option>
                    <option value="Non-Vegetarian">Non-Vegetarian</option>
                    <option value="Any">Any</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label>Smoking Preference</Form.Label>
                  <Form.Select name="smokingPreference" value={profile.smokingPreference} onChange={handleChange} disabled={!editing}>
                    <option value="">Select</option>
                    <option value="Non-Smoker">Non-Smoker</option>
                    <option value="Smoker">Smoker</option>
                    <option value="No Preference">No Preference</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col xs={12}>
                <Form.Group>
                  <Form.Label>About Me</Form.Label>
                  <Form.Control as="textarea" rows={4} name="bio" value={profile.bio} onChange={handleChange} disabled={!editing} />
                </Form.Group>
              </Col>
            </Row>

            {editing && (
              <div className="profile-actions">
                <Button type="button" className="profile-cancel-btn" onClick={handleCancel} disabled={saving}>
                  <FiX />
                  Cancel
                </Button>

                <Button type="submit" className="profile-save-btn" disabled={saving}>
                  {saving ? <Spinner size="sm" animation="border" /> : <FiSave />}
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            )}
          </Form>
        </section>
      </div>
    </div>
  );
}

export default Profile;