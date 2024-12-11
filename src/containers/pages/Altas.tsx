import React from "react"
import Layout from "../hocs/layout/Layout";
import { Card, Col, Row } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { PlusCircle, Printer, SlashCircle } from "react-bootstrap-icons";
import { motion, AnimatePresence } from "framer-motion";
import { connect } from "react-redux";
import { RootState } from "../../store";
import { Signature } from "lucide-react";

interface Props {
  isDarkMode: boolean;
}

const Altas: React.FC<Props> = ({ isDarkMode }) => {

  const pageVariants = {
    // initial: { opacity: 0, scale: 0.98 },
    // in: { opacity: 1, scale: 1 },
    initial: { opacity: 0, x: -100, }, // Comienza con transparencia y desplazamiento desde la izquierda
    in: { opacity: 1, x: 0, }, // Llega a opacidad completa y posición natural
  };

  const pageTransition = {
    type: "tween",
    easeIn: "anticipate",
    duration: 0.4,
    // delay: 0.05,
  };
  return (
    <Layout>
      <AnimatePresence mode="wait">
        <motion.div key={location.pathname} initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>
          <div className="container mt-2">
            {/* <Row>
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
                      Anular Altas
                    </Card.Title>
                    <Card.Text className="text-center m-2">
                      Busque el activo o los activos de altas que desee anular.
                    </Card.Text>
                    <div className="d-flex justify-content-center">
                      <div className="flex-grow-1">
                        <NavLink
                          key="AnularAltas"
                          to="/AnularAltas"
                          className="btn btn-primary text-white d-flex align-items-center justify-content-center py-2 px-3 mb-2 rounded text-decoration-none"
                        >
                          <Trash
                            className={classNames("me-3 flex-shrink-0", "h-5 w-5")}
                            aria-hidden="true"
                          />
                          Anular
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
                      Imprimir Etiquetas
                    </Card.Title>
                    <Card.Text className="text-center m-2">
                      Busque y genere un codigo QR de los inventarios de altas
                    </Card.Text>
                    <div className="d-flex justify-content-center">
                      <div className="flex-grow-1">
                        <NavLink
                          key="ImprimirEtiqueta"
                          to="/ImprimirEtiqueta"
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
            </Row>  */}
            <Row className="g-1">
              <Col lg={4} md={6} sm={12}>
                <div className={`text-center ${isDarkMode ? "bg-color-dark" : "bg-color"} text-white p-4 border-0 shadow-lg rounded h-100 d-flex flex-column`}>
                  <div className="mb-3">
                    <PlusCircle className="me-3 mt-5 fs-2 flex-shrink-0" aria-hidden="true" />
                  </div>
                  <Card.Title className="fw-bold"> Registrar Altas</Card.Title>
                  <Card.Text className="fw-light flex-grow-1 mb-2">
                    Busque el activo o los activos que desee dar de Alta
                  </Card.Text>
                  <NavLink
                    key="RegistrarAltas"
                    to="/RegistrarAltas"
                    className="btn btn-outline-light btn-sm mt-auto text-decoration-none"
                  >
                    Nuevo
                  </NavLink>
                </div>
              </Col>
              <Col lg={4} md={6} sm={12}>
                <div className={`text-center ${isDarkMode ? "bg-color-dark" : "bg-color"} text-white p-4 border-0 shadow-lg rounded h-100 d-flex flex-column`}>
                  <div className="mb-3">
                    <SlashCircle className="me-3 mt-5 fs-2 flex-shrink-0" aria-hidden="true" />
                  </div>
                  <Card.Title className="fw-bold"> Anular Altas</Card.Title>
                  <Card.Text className="fw-light flex-grow-1 mb-2">
                    Busque el activo o los activos de altas que desee anular
                  </Card.Text>
                  <NavLink
                    key="AnularAltas"
                    to="/AnularAltas"
                    className="btn btn-outline-light btn-sm mt-auto text-decoration-none"
                  >
                    Anular
                  </NavLink>
                </div>
              </Col>
              <Col lg={4} md={6} sm={12}>
                <div className={`text-center ${isDarkMode ? "bg-color-dark" : "bg-color"} text-white p-4 border-0 shadow-lg rounded h-100 d-flex flex-column`}>
                  <div className="mb-3">
                    <Printer className="me-3 mt-5 fs-2 flex-shrink-0" aria-hidden="true" />
                  </div>
                  <Card.Title className="fw-bold">Imprimir Etiquetas</Card.Title>
                  <Card.Text className="fw-light flex-grow-1 mb-2">
                    Busque y genere un codigo QR de los inventarios de altas
                  </Card.Text>
                  <NavLink
                    key="ImprimirEtiqueta"
                    to="/ImprimirEtiqueta"
                    className="btn btn-outline-light btn-sm mt-auto text-decoration-none"
                  >
                    Generar
                  </NavLink>
                </div>
              </Col>
              <Col lg={4} md={6} sm={12}>
                <div className={`text-center ${isDarkMode ? "bg-color-dark" : "bg-color"} text-white p-4 border-0 shadow-lg rounded h-100 d-flex flex-column`}>
                  <div className="mb-3">
                    <Signature className="me-3 mt-5 fs-2 flex-shrink-0" aria-hidden="true" />
                  </div>
                  <Card.Title className="fw-bold">Firmar Altas</Card.Title>
                  <Card.Text className="fw-light flex-grow-1 mb-2">
                    Busque, verifique y autorice las altas mediante firmas.
                  </Card.Text>
                  <NavLink
                    key="FirmarAltas"
                    to="/FirmarAltas"
                    className="btn btn-outline-light btn-sm mt-auto text-decoration-none"
                  >
                    Firmar
                  </NavLink>
                </div>
              </Col>
            </Row>
          </div>
        </motion.div>
      </AnimatePresence>
    </Layout>
  );
};
const mapStateToProps = (state: RootState) => ({
  isDarkMode: state.darkModeReducer.isDarkMode
});

export default connect(mapStateToProps, {
})(Altas);

