import React from "react"
import Layout from "../hocs/layout/Layout";
import { motion, AnimatePresence } from "framer-motion";
import { Card, Col, Row } from "react-bootstrap";
import { BoxSeam, DatabaseAdd, PencilFill, PlusCircle, Printer, SlashCircle } from "react-bootstrap-icons";
import { NavLink } from "react-router-dom";
const Inicio: React.FC = () => {
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
          <div className="container">
            <Row className="g-1">
              <Col lg={3} md={6} sm={12}>
                <Card className="text-center bg-color text-white p-4 border-0 shadow-lg rounded h-100 d-flex flex-column">
                  <div className="mb-3">
                    <PlusCircle className="me-3 mt-5 fs-2 flex-shrink-0" aria-hidden="true" />
                  </div>
                  <Card.Title className="fw-bold">Registrar Inventario</Card.Title>
                  <Card.Text className="fw-light flex-grow-1 mb-2">
                    Complete el registro de un nuevo inventario en tres sencillos pasos.
                  </Card.Text>
                  <NavLink
                    key="FormInventario"
                    to="/FormInventario"
                    className="btn btn-outline-light btn-sm mt-auto text-decoration-none"
                  >
                    Nuevo
                  </NavLink>
                </Card>
              </Col>
              {/* <Col lg={3} md={6} sm={12}>
                <Card className="text-center bg-color text-white p-4 border-0 shadow-lg rounded h-100 d-flex flex-column">
                  <div className="mb-3">
                    <PencilFill className="me-3 mt-5 fs-2 flex-shrink-0" aria-hidden="true" />
                  </div>
                  <Card.Title className="fw-bold">Modificar Inventario</Card.Title>
                  <Card.Text className="fw-light flex-grow-1 mb-2">
                    Encuentre y modifique el inventario existente.
                  </Card.Text>
                  <NavLink
                    key="ModificarInventario"
                    to="/ModificarInventario"
                    className="btn btn-outline-light btn-sm mt-auto text-decoration-none"
                  >
                    Modificar
                  </NavLink>
                </Card>
              </Col> */}
              <Col lg={3} md={6} sm={12}>
                <Card className="text-center bg-color text-white p-4 border-0 shadow-lg rounded h-100 d-flex flex-column">
                  <div className="mb-3">
                    <SlashCircle className="me-3 mt-5 fs-2 flex-shrink-0" aria-hidden="true" />
                  </div>
                  <Card.Title className="fw-bold">Anular Inventario</Card.Title>
                  <Card.Text className="fw-light flex-grow-1 mb-2">
                    Para anular un inventario, búsquelo previamente por fecha de
                    inicio y término.
                  </Card.Text>
                  <NavLink
                    key="AnularInventario"
                    to="/AnularInventario"
                    className="btn btn-outline-light btn-sm mt-auto text-decoration-none"
                  >
                    Anular
                  </NavLink>
                </Card>
              </Col>
              <Col lg={3} md={6} sm={12}>
                <Card className="text-center bg-color text-white p-4 border-0 shadow-lg rounded h-100 d-flex flex-column">
                  <div className="mb-3">
                    <BoxSeam className="me-3 mt-5 fs-2 flex-shrink-0" aria-hidden="true" />
                  </div>
                  <Card.Title className="fw-bold"> Bienes de Funcionarios</Card.Title>
                  <Card.Text className="fw-light flex-grow-1 mb-2">
                    Registre los bienes asignados a funcionarios.
                  </Card.Text>
                  <NavLink
                    key="FormBienesFuncionarios"
                    to="/FormBienesFuncionarios"
                    className="btn btn-outline-light btn-sm mt-auto text-decoration-none"
                  >
                    Nuevo
                  </NavLink>
                </Card>
              </Col>
              <Col lg={3} md={6} sm={12}>
                <Card className="text-center bg-color text-white p-4 border-0 shadow-lg rounded h-100 d-flex flex-column">
                  <div className="mb-3">
                    <DatabaseAdd className="me-3 mt-5 fs-2 flex-shrink-0" aria-hidden="true" />
                  </div>
                  <Card.Title className="fw-bold">Carga Masiva</Card.Title>
                  <Card.Text className="fw-light flex-grow-1 mb-2">
                    Adjunte el documento correspondiente para la carga masiva del inventario
                  </Card.Text>
                  <NavLink
                    key="CargaMasiva"
                    to="/CargaMasiva"
                    className="btn btn-outline-light btn-sm mt-auto text-decoration-none"
                  >
                    Nuevo
                  </NavLink>
                </Card>
              </Col>
              <Col lg={3} md={6} sm={12}>
                <Card className="text-center bg-color text-white p-4 border-0 shadow-lg rounded h-100 d-flex flex-column">
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
                </Card>
              </Col>
              <Col lg={3} md={6} sm={12}>
                <Card className="text-center bg-color text-white p-4 border-0 shadow-lg rounded h-100 d-flex flex-column">
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
                </Card>
              </Col>
              <Col lg={3} md={6} sm={12}>
                <Card className="text-center bg-color text-white p-4 border-0 shadow-lg rounded h-100 d-flex flex-column">
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
                </Card>
              </Col>
              <Col lg={3} md={6} sm={12}>
                <Card className="text-center bg-color text-white p-4 border-0 shadow-lg rounded h-100 d-flex flex-column">
                  <div className="mb-3">
                    <PlusCircle className="me-3 mt-5 fs-2 flex-shrink-0" aria-hidden="true" />
                  </div>
                  <Card.Title className="fw-bold"> Registrar Bajas</Card.Title>
                  <Card.Text className="fw-light flex-grow-1 mb-2">
                    Busque el activo o los activos que desee dar de Bajas
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
            </Row>
          </div>

        </motion.div>
      </AnimatePresence>
    </Layout >
  );
};

export default Inicio;
