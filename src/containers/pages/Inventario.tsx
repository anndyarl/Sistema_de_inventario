import React, { useEffect } from "react";
import { RootState } from "../../store";
import { connect } from "react-redux";
import { Card, Row, Col } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { PencilFill, PlusCircle, BoxSeam, SlashCircle } from "react-bootstrap-icons";
import Layout from "../hocs/layout/Layout";
import { MODALIDAD, ORIGEN, PROVEEDOR, } from "../../components/Inventario/RegistrarInventario/DatosInventario";
import { BIEN, DEPENDENCIA, SERVICIO } from "../../components/Inventario/RegistrarInventario/DatosCuenta";
import { comboModalidadesActions } from "../../redux/actions/Inventario/Combos/comboModalidadCompraActions";
import { comboServicioActions } from "../../redux/actions/Inventario/Combos/comboServicioActions";
import { comboDetalleActions } from "../../redux/actions/Inventario/Combos//comboDetalleActions";
import { comboProveedorActions } from "../../redux/actions/Inventario/Combos/comboProveedorActions";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { comboOrigenPresupuestosActions } from "../../redux/actions/Inventario/Combos/comboOrigenPresupuestoActions";
import { Objeto } from "../../components/Navegacion/Profile";
import { comboDependenciaActions } from "../../redux/actions/Inventario/Combos/comboDependenciaActions";


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
  comboServicioActions: (establ_corr: number) => void;
  comboDependencia: DEPENDENCIA[];
  comboDependenciaActions: (serCorr: string) => void;
  comboBien: BIEN[];
  comboDetalleActions: (bienSeleccionado: string) => void;
  token: string | null;
  isDarkMode: boolean;
  objeto: Objeto;
}
interface NavItem {
  name: string;
  descripcion: string;
  href: string;
  title: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

const Inventario: React.FC<FormInventarioProps> = ({
  objeto,
  token,
  comboOrigen,
  comboModalidad,
  comboServicio,
  comboDependencia,
  comboBien,
  comboProveedor,
  isDarkMode,
  comboOrigenPresupuestosActions,
  comboModalidadesActions,
  comboServicioActions,
  comboDependenciaActions,
  comboDetalleActions,
  comboProveedorActions
}) => {

  useEffect(() => {
    // Hace todas las llamadas a las api una vez carga el componente padre(FormInventario)
    if (token) {
      // Verifica si las acciones ya fueron disparadas
      if (comboOrigen.length === 0) comboOrigenPresupuestosActions();
      if (comboModalidad.length === 0) comboModalidadesActions();
      if (comboServicio.length === 0) comboServicioActions(objeto.Roles[0].codigoEstablicimiento);
      if (comboDependencia.length === 0) comboDependenciaActions("");
      if (comboBien.length === 0) comboDetalleActions("0");
      if (comboProveedor.length === 0) comboProveedorActions();
    }

    //Carga combo bien con valor 0
    comboDetalleActions("0");
  }, [
    comboOrigenPresupuestosActions,
    comboModalidadesActions,
    comboServicioActions,
    comboDependenciaActions,
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

  const navigation: NavItem[] = [

    { descripcion: 'Complete el registro de un nuevo inventario en tres sencillos pasos.', name: 'FormInventario', title: 'Registrar Inventario', href: '/Inventario/FormInventario', icon: PlusCircle },
    { descripcion: 'Encuentre y modifique el inventario existente.', name: 'ModificarInventario', title: 'Modificar Inventario', href: '/Inventario/ModificarInventario', icon: PencilFill },
    { descripcion: 'Para anular un inventario, búsquelo previamente por fecha de inicio y término.', name: 'AnularInventario', title: 'Anular Inventario', href: '/Inventario/AnularInventario', icon: SlashCircle },
    { descripcion: 'Registre los bienes asignados a funcionarios.', name: 'FormBienesFuncionarios', title: 'Bienes de Funcionarios', href: '/Inventario/FormBienesFuncionarios', icon: BoxSeam },
    // { descripcion: 'Adjunte su archivo excel para realizar una carga masiva', name: 'CargaMasiva', title: 'Carga Masiva', href: '/Inventario/CargaMasiva', icon: FileExcel },

  ];

  return (
    <Layout>
      <Helmet>
        <title>Inventario</title>
      </Helmet>
      <AnimatePresence mode="wait">
        <motion.div key={location.pathname} initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>
          <div className="container mt-2">

            <Row className="g-2">
              {navigation.map((item) => (
                <Col key={item.name} lg={4} md={6} sm={12}>
                  <NavLink
                    to={item.href}
                    className={`text-white btn-sm mt-auto text-decoration-none `}
                  >
                    <div className={`text-center  ${isDarkMode ? "bg-color-dark" : "bg-color"} p-4 border-0 shadow-lg rounded h-100 d-flex flex-column card-hover`}>
                      <div className="mb-3">
                        <item.icon className="me-3 mt-5 fs-2 flex-shrink-0" aria-hidden="true" />
                      </div>
                      <Card.Title className="fw-bold">{item.title}</Card.Title>
                      <Card.Text className="fw-light flex-grow-1 mb-2">
                        {item.descripcion}
                      </Card.Text>
                    </div>
                  </NavLink>
                </Col>
              ))}
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
  isDarkMode: state.darkModeReducer.isDarkMode,
  objeto: state.validaApiLoginReducers
});

export default connect(mapStateToProps, {
  comboOrigenPresupuestosActions,
  comboModalidadesActions,
  comboServicioActions,
  comboDependenciaActions,
  comboDetalleActions,
  comboProveedorActions
})(Inventario);
