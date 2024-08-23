import React from "react";
// import { connect } from "react-redux"; // Si decides usar connect en el futuro
// import { LockClosedIcon } from "@heroicons/react/20/solid";
// import { Link, Navigate } from "react-router-dom";
// import "../../styles/Login.css"; // Descomentar si tienes un archivo CSS específico
import Layout from "../../hooks/layout/Layout";
import Navbar from "../../components/navigation/Navbar";
import Footer from "../../components/navigation/Footer";

// Define interfaces para props si es necesario
interface BajasProps {
    // Si hay props, define sus tipos aquí
    // ejemplo: isAuthenticated: boolean;
}

// Si no hay props, simplemente tipa el componente como FC
const Bajas: React.FC<BajasProps> = () => {
    return (
        <Layout>
            <Navbar />
            <div>Bajas</div>
            <Footer />
        </Layout>
    );
};

// Si necesitas conectar con Redux, agrega la función connect
// export default connect(mapStateToProps, mapDispatchToProps)(Login);
export default Bajas;
