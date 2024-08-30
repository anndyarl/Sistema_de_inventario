import React from 'react';
import Layout from "../../hooks/layout/Layout";
import FormularioCompleto from "../../components/Inventario/FormularioCompleto";

// Define el tipo de props para el componente
interface InventarioProps {
   
  }
  
const Inventario: React.FC<InventarioProps> = () =>
{     
    return (
        <Layout>        
        <div className="container my-5">
            <FormularioCompleto />  
        </div>
        </Layout>
    );

};

export default Inventario;
