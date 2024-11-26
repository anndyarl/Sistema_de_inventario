import React from "react"
import Layout from "../hocs/layout/Layout";
import { Card, Col, Row } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { Plus, Trash } from "react-bootstrap-icons";
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
            <Row>
              <Col lg={6} md={5} className="mb-1">
                <Card className="custom-card shadow p-3 border-0 rounded">
                  <Card.Body>
                    <Card.Title className="text-center fw-semibold">
                      Registrar Bajas
                    </Card.Title>
                    <Card.Text className="text-center m-2">
                      Busque el activo o los activos que desee dar de Baja.
                    </Card.Text>
                    <div className="d-flex justify-content-center">
                      <div className="flex-grow-1">
                        <NavLink
                          key="RegistrarBajas"
                          to="/RegistrarBajas"
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
          </div>
        </motion.div>
      </AnimatePresence>
    </Layout>
  );
};

export default Bajas;
