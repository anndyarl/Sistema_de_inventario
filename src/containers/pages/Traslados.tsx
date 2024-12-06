import React from "react"
import Layout from "../hocs/layout/Layout";
import { Card, Col, Row } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { PlusCircle } from "react-bootstrap-icons";
import { motion, AnimatePresence } from "framer-motion";

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
const Traslados: React.FC = () => {
  return (
    <Layout>
      <AnimatePresence mode="wait">
        <motion.div key={location.pathname} initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>
          <div className="container mt-2">
            <Row className="g-1">
              <Col lg={4} md={6} sm={12}>
                <Card className="text-center bg-color text-white p-4 border-0 shadow-lg rounded h-100 d-flex flex-column">
                  <div className="mb-3">
                    <PlusCircle className="me-3 mt-5 fs-2 flex-shrink-0" aria-hidden="true" />
                  </div>
                  <Card.Title className="fw-bold">Registrar Traslados</Card.Title>
                  <Card.Text className="fw-light flex-grow-1 mb-2">
                    Complete el registro de de traslados
                  </Card.Text>
                  <NavLink
                    key="RegistrarTraslados"
                    to="/RegistrarTraslados"
                    className="btn btn-outline-light btn-sm mt-auto text-decoration-none"
                  >
                    Nuevo
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

export default Traslados;
