import React from "react"
import Layout from "../hocs/layout/Layout";
import { Card, Col, Row } from "react-bootstrap";
import { motion, AnimatePresence } from "framer-motion";
import { NavLink } from "react-router-dom";
import { Collection } from "react-bootstrap-icons";
import { connect } from "react-redux";
import { RootState } from "../../store";
import { Helmet } from "react-helmet-async";

interface Props {
  isDarkMode: boolean;
}
interface NavItem {
  name: string;
  href: string;
  title: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

const pageVariants = {
  // initial: { opacity: 0, scale: 0.98 },
  // in: { opacity: 1, scale: 1 },
  initial: { x: -100, }, // Comienza con transparencia y desplazamiento desde la izquierda
  in: { x: 0, }, // Llega a opacidad completa y posición natural
};

const pageTransition = {
  type: "tween",
  easeIn: "anticipate",
  duration: 0.3,
  // delay: 0.03,
};

const navigation: NavItem[] = [
  { name: 'Servicios', title: 'Mantenedor de Servicios', href: '/Mantenedores/Servicios', icon: Collection },
  { name: 'Dependencias', title: 'Mantenedor de Dependencias', href: '/Mantenedores/Dependencias', icon: Collection },
  { name: 'Proveedores', title: 'Mantenedor de Proveedores', href: '/Mantenedores/Proveedores', icon: Collection },
  { name: 'Especies', title: 'Mantenedor de Especies', href: '/Mantenedores/Especies', icon: Collection },
  // { name: 'Componentes', title: 'Mantenedor de Componentes', href: '/Mantenedores/Componentes', icon: Collection }
  // { name: 'Usuarios', title: 'Mantenedor de Usuarios', href: '/Mantenedores/Usuarios', icon: Collection }
];

const Mantenedores: React.FC<Props> = ({ isDarkMode }) => {
  return (
    <Layout>
      <Helmet>
        <title>Mantenedores</title>
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
                        <Collection className="me-3 mt-5 fs-2 flex-shrink-0" aria-hidden="true" />
                      </div>
                      <Card.Title className="fw-bold">{item.title}</Card.Title>
                      <Card.Text className="fw-light flex-grow-1 mb-2">
                        {item.name}
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
})(Mantenedores);
