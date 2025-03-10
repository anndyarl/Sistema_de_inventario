import React from "react"

import { Helmet } from "react-helmet-async";
import Layout from "../../containers/hocs/layout/Layout";


const ConsultaInventarioEspecies: React.FC = () => {
    return (
        <Layout>
            <Helmet>
                <title>AltasMensuales</title>
            </Helmet>
            <p>Consulta Inventario - Especies</p>
        </Layout>
    );
};

export default ConsultaInventarioEspecies;
