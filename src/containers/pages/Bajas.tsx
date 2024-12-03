import React from "react"
import Layout from "../hocs/layout/Layout";
import { Card, Col, Row } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { DashCircle, Exclude } from "react-bootstrap-icons";
import { motion, AnimatePresence } from "framer-motion";
const classNames = (...classes: (string | boolean | undefined)[]): string => {
  return classes.filter(Boolean).join(" ");
};
const Bajas: React.FC = () => {

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
            <Row className="g-1">
              <Col lg={4} md={6} sm={12}>
                <Card className="text-center bg-color text-white p-4 border-0 shadow-lg rounded h-100 d-flex flex-column">
                  <div className="mb-3">
                    <DashCircle className="me-3 mt-5 fs-2 flex-shrink-0" aria-hidden="true" />
                  </div>
                  <Card.Title className="fw-bold">Registrar Bajas</Card.Title>
                  <Card.Text className="fw-light flex-grow-1">
                    Busque el activo o los activos que desee dar de Baja
                  </Card.Text>
                  <NavLink
                    key="RegistrarBajas"
                    to="/RegistrarBajas"
                    className="btn btn-outline-light btn-sm mt-auto text-decoration-none"
                  >
                    Nuevo
                  </NavLink>
                </Card>
              </Col>
              <Col lg={4} md={6} sm={12}>
                <Card className="text-center bg-color text-white p-4 border-0 shadow-lg rounded h-100 d-flex flex-column">
                  <div className="mb-3">
                    <Exclude className="me-3 mt-5 fs-2 flex-shrink-0" aria-hidden="true" />
                  </div>
                  <Card.Title className="fw-bold">Bodeja de excluidos</Card.Title>
                  <Card.Text className="fw-light flex-grow-1">
                    Busque lo sinventarios que han sido dados de baja
                  </Card.Text>
                  <NavLink
                    key="BodegaExcluidos"
                    to="/BodegaExcluidos"
                    className="btn btn-outline-light btn-sm mt-auto text-decoration-none"
                  >
                    Excluir
                  </NavLink>
                </Card>
              </Col>
            </Row>
          </div>
        </motion.div>
      </AnimatePresence>
    </Layout>
  );
};

export default Bajas;
