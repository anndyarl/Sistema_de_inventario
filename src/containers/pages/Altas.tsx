import React from "react";
import Layout from "../../hooks/layout/Layout";


// Define interfaces para props si es necesario
interface AltasProps {
    // Si hay props, define sus tipos aquí
    // ejemplo: isAuthenticated: boolean;
}

// Si no hay props, simplemente tipa el componente como FC
const Altas: React.FC<AltasProps> = () => {
    return (
        <Layout>        
            <div>Altas</div>   
        </Layout>
    );
};

// Si necesitas conectar con Redux, agrega la función connect
// export default connect(mapStateToProps, mapDispatchToProps)(Login);
export default Altas;
