import {
  Container,
  Row,
  Col,
  Button,
} from "react-bootstrap";

import { useNavigate } from "react-router-dom";

import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  // ==============================
  // NAVIGATION FUNCTIONS
  // ==============================

  const goToMyProperties = () => {
    navigate("/my-properties");
  };

  const goToBrowseProperties = () => {
    navigate("/properties");
  };

  const goToRoommates = () => {
    navigate("/roommates");
  };

  return (
    <div className="dashboard-page-wrapper">

      <Container className="py-5">

        <Row className="justify-content-center">

          <Col lg={10} md={11}>

            <div className="dashboard-card-glass py-5 px-4">

              {/* =========================
                  DASHBOARD HEADER
              ========================= */}

              <div className="text-center">

                <h1 className="display-4 fw-bold mb-3 dashboard-heading">
                  Dashboard
                </h1>

                <p className="lead dashboard-subtext">
                  Welcome to SplitNest. Manage your
                  properties and explore available
                  homes from one place.
                </p>

              </div>

              {/* =========================
                  DASHBOARD VISUAL
              ========================= */}

              <div
                className="
                  dashboard-visual-stub
                  my-4
                  d-flex
                  align-items-center
                  justify-content-center
                "
              >
                <span>
                  SplitNest Dashboard
                </span>
              </div>

              {/* =========================
                  QUICK ACTIONS
              ========================= */}

              <Row className="g-3 mt-4">

                {/* MY PROPERTIES */}

                <Col
                  lg={4}
                  md={6}
                  sm={12}
                >

                  <div className="dashboard-action-card">

                    <h4>
                      My Properties
                    </h4>

                    <p>
                      View and manage all your
                      listed properties.
                    </p>

                    <Button
                      type="button"
                      className="w-100"
                      onClick={
                        goToMyProperties
                      }
                    >
                      My Properties
                    </Button>

                  </div>

                </Col>

                {/* BROWSE PROPERTIES */}

                <Col
                  lg={4}
                  md={6}
                  sm={12}
                >

                  <div className="dashboard-action-card">

                    <h4>
                      Browse Properties
                    </h4>

                    <p>
                      Search available properties
                      in Salem.
                    </p>

                    <Button
                      type="button"
                      className="w-100"
                      onClick={
                        goToBrowseProperties
                      }
                    >
                      Browse Properties
                    </Button>

                  </div>

                </Col>

                {/* FIND ROOMMATES */}

                <Col
                  lg={4}
                  md={6}
                  sm={12}
                >

                  <div className="dashboard-action-card">

                    <h4>
                      Find Roommates
                    </h4>

                    <p>
                      Find compatible roommates
                      based on your preferences.
                    </p>

                    <Button
                      type="button"
                      className="w-100"
                      onClick={
                        goToRoommates
                      }
                    >
                      Find Roommates
                    </Button>

                  </div>

                </Col>

              </Row>

            </div>

          </Col>

        </Row>

      </Container>

    </div>
  );
}

export default Dashboard;