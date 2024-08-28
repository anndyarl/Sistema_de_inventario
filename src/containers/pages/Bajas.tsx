import React from "react";
import Layout from "../../hooks/layout/Layout";

// Define interfaces para props si es necesario
interface BajasProps {
    // Si hay props, define sus tipos aquí
    // ejemplo: isAuthenticated: boolean;
}

// Si no hay props, simplemente tipa el componente como FC
const Bajas: React.FC<BajasProps> = () => {
    return (
        <Layout>          
            <div>Bajas</div>   
        </Layout>
    );
};

// Si necesitas conectar con Redux, agrega la función connect
// export default connect(mapStateToProps, mapDispatchToProps)(Login);
export default Bajas;
