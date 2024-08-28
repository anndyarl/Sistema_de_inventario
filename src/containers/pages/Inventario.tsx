import React from "react";
import Layout from "../../hooks/layout/Layout";
import FormularioCompleto from "../../components/Inventario/FormularioCompleto";


// Define interfaces para props si es necesario
interface InventarioProps {
    // Si hay props, define sus tipos aquí
    // ejemplo: isAuthenticated: boolean;
}

// Si no hay props, simplemente tipa el componente como FC
const Inventario: React.FC<InventarioProps> = () => {
    return (
        <Layout>  
          <div className="container my-5">
             <FormularioCompleto />  
          </div>
        </Layout>
    );
};

// Si necesitas conectar con Redux, agrega la función connect
// export default connect(mapStateToProps, mapDispatchToProps)(Login);
export default Inventario;
