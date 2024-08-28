import React from "react";
import Layout from "../../hooks/layout/Layout";
import Footer from "../../components/navigation/Footer";
import Datos_inventario from "../../components/Inventario/Datos_inventario";
import Datos_cuenta from "../../components/Inventario/Datos_cuenta";
import Datos_activo_fijo from "../../components/Inventario/Datos_activo_fijo";


// Define interfaces para props si es necesario
interface InventarioProps {
    // Si hay props, define sus tipos aquí
    // ejemplo: isAuthenticated: boolean;
}

// Si no hay props, simplemente tipa el componente como FC
const Inventario: React.FC<InventarioProps> = () => {
    return (
        <Layout>             
          <Datos_inventario/>
          <Datos_cuenta/>
          <Datos_activo_fijo/>      
        </Layout>
    );
};

// Si necesitas conectar con Redux, agrega la función connect
// export default connect(mapStateToProps, mapDispatchToProps)(Login);
export default Inventario;
