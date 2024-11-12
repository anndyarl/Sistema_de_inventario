import React from "react"
import Layout from "../hocs/layout/Layout";
import { Card, Col, Row } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { Plus, Trash } from "react-bootstrap-icons";
const classNames = (...classes: (string | boolean | undefined)[]): string => {
  return classes.filter(Boolean).join(" ");
};
const Altas: React.FC = () => {


  return (
    <Layout>
      <>
        <Row>
          <Col lg={6} md={5} className="mb-1">
            <Card className="custom-card shadow p-3 border-0 rounded">
              <Card.Body>
                <Card.Title className="text-center fw-semibold">
                  Registrar Altas
                </Card.Title>
                <Card.Text className="text-center m-2">
                  Busque el activo o los activos que desee dar de Alta.
                </Card.Text>
                <div className="d-flex justify-content-center">
                  <div className="flex-grow-1">
                    <NavLink
                      key="RegistrarAltas"
                      to="/RegistrarAltas"
                      className="btn btn-primary text-white d-flex align-items-center justify-content-center py-2 px-3 mb-2 rounded text-decoration-none"
                    >
                      <Plus
                        className={classNames("me-3 flex-shrink-0", "h-5 w-5")}
                        aria-hidden="true"
                      />
                      Nuevo
                    </NavLink>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={6} md={5} className="mb-1">
            <Card className="custom-card shadow p-3 border-0 rounded">
              <Card.Body>
                <Card.Title className="text-center fw-semibold">
                  Modificar Altas
                </Card.Title>
                <Card.Text className="text-center m-2">
                  Busque el activo o activos de altas que desee modificar.
                </Card.Text>
                <div className="d-flex justify-content-center">
                  <div className="flex-grow-1">
                    <NavLink
                      key="#"
                      to="#"
                      className="btn btn-primary text-white d-flex align-items-center justify-content-center py-2 px-3 mb-2 rounded text-decoration-none"
                    >
                      <Plus
                        className={classNames("me-3 flex-shrink-0", "h-5 w-5")}
                        aria-hidden="true"
                      />
                      Nuevo
                    </NavLink>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={6} md={5} className="mb-1">
            <Card className="custom-card shadow p-3 border-0 rounded">
              <Card.Body>
                <Card.Title className="text-center fw-semibold">
                  Anular Altas
                </Card.Title>
                <Card.Text className="text-center m-2">
                  Busque el activo o los activos de altas que desee anular.
                </Card.Text>
                <div className="d-flex justify-content-center">
                  <div className="flex-grow-1">
                    <NavLink
                      key="#"
                      to="#"
                      className="btn btn-primary text-white d-flex align-items-center justify-content-center py-2 px-3 mb-2 rounded text-decoration-none"
                    >
                      <Plus
                        className={classNames("me-3 flex-shrink-0", "h-5 w-5")}
                        aria-hidden="true"
                      />
                      Nuevo
                    </NavLink>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>

        </Row>
      </>
    </Layout>
  );
};

export default Altas;
