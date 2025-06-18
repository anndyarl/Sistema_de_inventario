import React from "react"
import Layout from "../hocs/layout/Layout";
import { Card, Col, Row } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { CheckCircleFill, PlusCircle, Printer, SlashCircle } from "react-bootstrap-icons";
import { motion, AnimatePresence } from "framer-motion";
import { connect } from "react-redux";
import { RootState } from "../../store";
import { Signature } from "lucide-react";
import { Helmet } from "react-helmet-async";

interface Props {
  isDarkMode: boolean;
}
interface NavItem {
  name: string;
  descripcion: string;
  href: string;
  title: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}
const Altas: React.FC<Props> = ({ isDarkMode }) => {

  const pageVariants = {
    initial: { opacity: 0, x: -100, }, // Comienza con transparencia y desplazamiento desde la izquierda
    in: { opacity: 1, x: 0, }, // Llega a opacidad completa y posición natural
  };

  const pageTransition = {
    type: "tween",
    easeIn: "anticipate",
    duration: 0.4,
    // delay: 0.05,
  };

  const navigation: NavItem[] = [

    { descripcion: 'Busque el activo o los activos que desee dar de Alta.', name: 'RegistrarAltas', title: 'Registrar Altas', href: '/Altas/RegistrarAltas', icon: PlusCircle },
    // { descripcion: 'Busque el activo o los activos de altas que desee anular.', name: 'AnularAltas', title: 'Anular Altas', href: '/Altas/AnularAltas', icon: SlashCircle },
    { descripcion: 'Busque, verifique y autorice las altas mediante firmas.', name: 'FirmarAltas', title: 'Firmar Altas', href: '/Altas/FirmarAltas', icon: Signature },
    { descripcion: 'Verifique el estado de las firmas que han sido firmadas.', name: 'EstadoFirmas', title: 'Estado Firmas', href: '/Altas/EstadoFirmas', icon: CheckCircleFill },
    { descripcion: 'Busque y genere un codigo QR de los inventarios de altas.', name: 'ImprimirEtiqueta', title: 'Imprimir Etiquetas', href: '/Altas/ImprimirEtiqueta', icon: Printer },
  ];

  return (

    <Layout>
      <Helmet>
        <title>Altas</title>
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
    </Layout>
  );
};
const mapStateToProps = (state: RootState) => ({
  isDarkMode: state.darkModeReducer.isDarkMode
});

export default connect(mapStateToProps, {
})(Altas);

