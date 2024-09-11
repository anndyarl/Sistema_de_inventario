import React from 'react';
import Layout from "../../hooks/layout/Layout";
import FormularioCompleto from "../../components/Inventario/FormularioCompleto";

const Inventario: React.FC = () => {
    return (
        <Layout>
            <div className="container">
                <FormularioCompleto />
            </div>
        </Layout>
    );

};

export default Inventario;
