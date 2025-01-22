import React, { useEffect } from "react";
import { RootState } from "../../store";
import { connect } from "react-redux";
import { Card, Row, Col } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { PencilFill, PlusCircle, BoxSeam, SlashCircle } from "react-bootstrap-icons";
import Layout from "../hocs/layout/Layout";
import { MODALIDAD, ORIGEN, PROVEEDOR, } from "../../components/Inventario/RegistrarInventario/DatosInventario";
import { BIEN, SERVICIO } from "../../components/Inventario/RegistrarInventario/DatosCuenta";
import { comboOrigenPresupuestosActions } from "../../redux/actions/Inventario/Combos/comboOrigenPresupuestoActions";
import { comboModalidadesActions } from "../../redux/actions/Inventario/Combos/comboModalidadCompraActions";
import { comboServicioActions } from "../../redux/actions/Inventario/Combos/comboServicioActions";
import { comboDetalleActions } from "../../redux/actions/Inventario/Combos//comboDetalleActions";
import { comboProveedorActions } from "../../redux/actions/Inventario/Combos/comboProveedorActions";
import { motion, AnimatePresence } from "framer-motion";

interface FormInventarioProps {
  //Trae props combos de Datos_inventario(formulario 1)
  comboOrigen: ORIGEN[];
  comboOrigenPresupuestosActions: () => void;
  comboModalidad: MODALIDAD[];
  comboModalidadesActions: () => void;
  comboProveedor: PROVEEDOR[];
  comboProveedorActions: () => void;

  //Trae props combos de Datos_cuenta(formulario 2)
  comboServicio: SERVICIO[];
  comboServicioActions: () => void;
  comboBien: BIEN[];
  comboDetalleActions: (bienSeleccionado: string) => void;
  token: string | null;
  isDarkMode: boolean;
}
const Inventario: React.FC<FormInventarioProps> = ({
  token,
  comboOrigen,
  comboModalidad,
  comboServicio,
  comboBien,
  comboProveedor,
  isDarkMode,
  comboOrigenPresupuestosActions,
  comboModalidadesActions,
  comboServicioActions,
  comboDetalleActions,
  comboProveedorActions
}) => {

  useEffect(() => {
    // Hace todas las llamadas a las api una vez carga el componente padre(FormInventario)
    if (token) {
      // Verifica si las acciones ya fueron disparadas
      if (comboOrigen.length === 0) comboOrigenPresupuestosActions();
      if (comboModalidad.length === 0) comboModalidadesActions();
      if (comboServicio.length === 0) comboServicioActions();
      if (comboBien.length === 0) comboDetalleActions("0");
      if (comboProveedor.length === 0) comboProveedorActions();
    }

    //Carga combo bien con valor 0
    comboDetalleActions("0");
  }, [
    comboOrigenPresupuestosActions,
    comboModalidadesActions,
    comboServicioActions,
    comboDetalleActions,
    comboProveedorActions
  ]);
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
    // delay: 0.03,
  };
  return (
    <Layout>
      <AnimatePresence mode="wait">
        <motion.div key={location.pathname} initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>
          <div className="container mt-2">
            <Row>
              {/* <Col lg={6} md={5} className="mb-1">
                <Card className="custom-card shadow p-3 border-0 rounded">
                  <Card.Body>
                    <Card.Title className="text-center fw-semibold">
                      Registrar Inventario
                    </Card.Title>
                    <Card.Text className="text-center m-2">
                      Complete el registro de un nuevo inventario en tres sencillos
                      pasos.
                    </Card.Text>
                    <div className="d-flex justify-content-center">
                      <div className="flex-grow-1">
                        <NavLink
                          key="FormInventario"
                          to="/FormInventario"
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
                      Modificar Inventario

                    </Card.Title>
                    <Card.Text className="text-center m-2">
                      Encuentre y modifique el inventario existente.

                    </Card.Text>
                    <div className="d-flex justify-content-center">
                      <div className="flex-grow-1">
                        <NavLink
                          key="ModificarInventario"
                          to="/ModificarInventario"

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
                      Anular Inventario
                    </Card.Title>
                    <Card.Text className="text-center m-2">
                      Para anular un inventario, búsquelo previamente por fecha de
                      inicio y término.
                    </Card.Text>
                    <div className="d-flex justify-content-center">
                      <div className="flex-grow-1">
                        <NavLink
                          key="AnularInventario"
                          to="/AnularInventario"
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
                      Bienes de Funcionarios
                    </Card.Title>
                    <Card.Text className="text-center m-2">
                      Registre los bienes asignados a funcionarios.
                    </Card.Text>
                    <div className="d-flex justify-content-center">
                      <div className="flex-grow-1 ">
                        <NavLink
                          key="FormBienesFuncionarios"
                          to="/FormBienesFuncionarios"
                          className="btn btn-primary text-white d-flex align-items-center justify-content-center py-2 px-3 mb-2 rounded text-decoration-none "
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
                      Carga Masiva
                    </Card.Title>
                    <Card.Text className="text-center m-2">
                      Adjunte el documento correspondiente para la carga masiva del inventario
                    </Card.Text>
                    <div className="d-flex justify-content-center">
                      <div className="flex-grow-1 ">
                        <NavLink
                          key="CargaMasiva"
                          to="/CargaMasiva"
                          className="btn btn-primary text-white d-flex align-items-center justify-content-center py-2 px-3 mb-2 rounded text-decoration-none "
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
              </Col> */}
            </Row>

            <Row className="g-1">
              <Col lg={4} md={6} sm={12}>
                <div className={`text-center ${isDarkMode ? "bg-color-dark" : "bg-color"} text-white p-4 border-0 shadow-lg rounded h-100 d-flex flex-column`}>
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
                </div>
              </Col>
              <Col lg={4} md={6} sm={12}>
                <div className={`text-center ${isDarkMode ? "bg-color-dark" : "bg-color"} text-white p-4 border-0 shadow-lg rounded h-100 d-flex flex-column`}>
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
                </div>
              </Col>
              <Col lg={4} md={6} sm={12}>
                <div className={`text-center ${isDarkMode ? "bg-color-dark" : "bg-color"} text-white p-4 border-0 shadow-lg rounded h-100 d-flex flex-column`}>
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
                </div>
              </Col>
              <Col lg={4} md={6} sm={12}>
                <div className={`text-center ${isDarkMode ? "bg-color-dark" : "bg-color"} text-white p-4 border-0 shadow-lg rounded h-100 d-flex flex-column`}>
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
                </div>
              </Col>
              {/* <Col lg={4} md={6} sm={12}>
                <div className={`text-center ${isDarkMode ? "bg-color-dark" : "bg-color"} text-white p-4 border-0 shadow-lg rounded h-100 d-flex flex-column`}>
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
                </div>
              </Col> */}
            </Row>
          </div>
        </motion.div>
      </AnimatePresence>
    </Layout>
  );
};

const mapStateToProps = (state: RootState) => ({
  token: state.loginReducer.token,
  comboOrigen: state.comboOrigenPresupuestoReducer.comboOrigen,
  comboServicio: state.comboServicioReducer.comboServicio,
  comboModalidad: state.comboModalidadCompraReducer.comboModalidad,
  comboCuenta: state.comboCuentaReducer.comboCuenta,
  comboDependencia: state.comboDependenciaReducer.comboDependencia,
  comboBien: state.detallesReducer.comboBien,
  comboProveedor: state.comboProveedorReducers.comboProveedor,
  isDarkMode: state.darkModeReducer.isDarkMode
});

export default connect(mapStateToProps, {
  comboOrigenPresupuestosActions,
  comboModalidadesActions,
  comboServicioActions,
  comboDetalleActions,
  comboProveedorActions
})(Inventario);
