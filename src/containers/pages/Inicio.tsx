import React, { useEffect } from "react"
import Layout from "../hocs/layout/Layout";
import { motion, AnimatePresence } from "framer-motion";
import { Card, Col, Row } from "react-bootstrap";
import { Boxes, BoxSeam, BoxSeamFill, PencilFill, PlusCircle, Printer, SlashCircle } from "react-bootstrap-icons";
import { NavLink } from "react-router-dom";
import { RootState } from "../../store";
import { connect } from "react-redux";
import { Signature } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { listaVersionamientoActions } from "../../redux/actions/Configuracion/listaVersionamientoActions";
import { ListaVersionamiento } from "../../components/Configuracion/Versionamiento";


interface NavItem {
  name: string;
  descripcion: string;
  href: string;
  title: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;

}
interface Props {
  isDarkMode: boolean;
  listaVersionamientoActions: () => void;
  listaVersionamiento: ListaVersionamiento[];

}

const Inicio: React.FC<Props> = ({ listaVersionamientoActions, listaVersionamiento, isDarkMode }) => {
  const pageVariants = {
    // initial: { opacity: 0, scale: 0.98 },
    // in: { opacity: 1, scale: 1 },
    initial: { opacity: 0, x: -100, }, // Comienza con transparencia y desplazamiento desde la izquierda
    in: { opacity: 1, x: 0, }, // Llega a opacidad completa y posición natural
  };

  useEffect(() => {
    if (listaVersionamiento.length === 0) { listaVersionamientoActions() }


  }, [listaVersionamiento, listaVersionamientoActions])

  const pageTransition = {
    type: "tween",
    easeIn: "anticipate",
    duration: 0.4,
    // delay: 0.05,
  };
  const navigation: NavItem[] = [

    { descripcion: 'Complete el registro de un nuevo inventario en tres sencillos pasos.', name: 'FormInventario', title: 'Registrar Inventario', href: '/Inventario/FormInventario', icon: Boxes },
    { descripcion: 'Encuentre y modifique el inventario existente.', name: 'ModificarInventario', title: 'Modificar Inventario', href: '/Inventario/ModificarInventario', icon: PencilFill },
    { descripcion: 'Seleccione y complete registro del activo que desee dar de baja.', name: 'ListadoGeneral', title: 'Listado General', href: '/Bajas/ListadoGeneral', icon: Boxes },
    { descripcion: 'Listado de todos los activos excluidos.', name: 'BienesRematados', title: 'Bienes Rematados', href: '/Bajas/BienesRematados', icon: BoxSeamFill },
    { descripcion: 'Para anular un inventario, búsquelo previamente por fecha de inicio y término.', name: 'AnularInventario', title: 'Anular Inventario', href: '/Inventario/AnularInventario', icon: SlashCircle },
    // { descripcion: 'Adjunte el documento correspondiente para la carga masiva del inventario.', name: 'CargaMasiva', title: 'Carga Masiva', href: '/Inventario/CargaMasiva', icon: DatabaseAdd },
    { descripcion: 'Busque, verifique y autorice las altas mediante firmas.', name: 'FirmarAltas', title: 'Firmar Altas', href: '/Altas/FirmarAltas', icon: Signature },
    { descripcion: 'Busque y genere un codigo QR de los inventarios de altas.', name: 'ImprimirEtiqueta', title: 'Imprimir Etiquetas', href: '/Altas/ImprimirEtiqueta', icon: Printer },
    { descripcion: 'Registre los bienes asignados a funcionarios.', name: 'FormBienesFuncionarios', title: 'Bienes de Funcionarios', href: '/Inventario/FormBienesFuncionarios', icon: BoxSeam },
    { descripcion: 'Registre el traslados de sus bienes.', name: 'RegistrarTraslados', title: 'Registrar Traslados', href: '/Traslados/RegistrarTraslados', icon: PlusCircle },

  ];

  return (
    <Layout>
      <Helmet>
        <title>Inicio</title>
      </Helmet>
      <AnimatePresence mode="wait">
        <motion.div key={location.pathname} initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>
          <div className="container mt-2">
            <Row className="g-2">
              {navigation.map((item) => (
                <Col key={item.name} lg={4} md={6} sm={12}>
                  <NavLink
                    to={item.href}
                    className={`text-white btn-sm mt-auto text-decoration-none`}
                  >
                    <div className={`text-center  ${isDarkMode ? "bg-color-dark" : "bg-color"}  p-4 border-0 shadow-lg rounded h-100 d-flex flex-column card-hover`}>
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
    </ Layout>
  );
};


const mapStateToProps = (state: RootState) => ({
  isDarkMode: state.darkModeReducer.isDarkMode,
  listaVersionamiento: state.listaVersionamientoReducers.listaVersionamiento
});

export default connect(mapStateToProps, {
  listaVersionamientoActions
})(Inicio);
