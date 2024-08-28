import React from "react";
import Layout from "../../hooks/layout/Layout";
import Footer from "../../components/navigation/Footer";

// Define interfaces para props si es necesario
interface InformesProps {
    // Si hay props, define sus tipos aquí
    // ejemplo: isAuthenticated: boolean;
}

// Si no hay props, simplemente tipa el componente como FC
const Informes: React.FC<InformesProps> = () => {
    return (
        <Layout>     
           <div>Informes</div>  
        </Layout>
    );
};

// Si necesitas conectar con Redux, agrega la función connect
// export default connect(mapStateToProps, mapDispatchToProps)(Login);
export default Informes;
