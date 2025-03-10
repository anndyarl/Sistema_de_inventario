import React from "react"
import Layout from "../../hocs/layout/Layout";
import { Helmet } from "react-helmet-async";
import { AnimatePresence, motion } from "framer-motion";
import { Card, Col, Row } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { FileEarmarkArrowUp } from "react-bootstrap-icons";
import { RootState } from "../../../store";
import { connect } from "react-redux";

interface NavItem {
  name: string;
  descripcion: string;
  href: string;
  title: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}
interface GeneralProps {
  isDarkMode: boolean;
}
const Informes: React.FC<GeneralProps> = ({ isDarkMode }) => {

  const pageVariants = {
    // initial: { opacity: 0, scale: 0.98 },
    // in: { opacity: 1, scale: 1 },
    initial: { opacity: 0, x: -100, }, // Comienza con transparencia y desplazamiento desde la izquierda
    in: { opacity: 1, x: 0, }, // Llega a opacidad completa y posición natural
  };

  const pageTransition = {
    type: "tween",
    easeIn: "anticipate",
    duration: 0.4
  };

  const navigation: NavItem[] = [

    { descripcion: '', name: 'AltasMensuales', title: 'Altas Mensuales', href: '/Informes/AltasMensuales', icon: FileEarmarkArrowUp },
    { descripcion: '', name: 'ConsultaInventarioEspecies', title: 'Consulta Inventario - Especies', href: '/Informes/ConsultaInventarioEspecies', icon: FileEarmarkArrowUp },
  ];

  return (
    <Layout>
      <Helmet>
        <title>Informes</title>
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
  isDarkMode: state.darkModeReducer.isDarkMode
});

export default connect(mapStateToProps, {
})(Informes);
