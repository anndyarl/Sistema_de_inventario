import React from "react"

import { Helmet } from "react-helmet-async";
import Layout from "../../../containers/hocs/layout/Layout";
import MenuInformes from "../../Menus/MenuInformes";

const ConsultaInventarioEspecies: React.FC = () => {
    return (
        <Layout>
            <Helmet>
                <title>Consulta Inventario - Especies</title>
            </Helmet>
            <MenuInformes />
            <p>Consulta Inventario - Especies</p>
        </Layout>
    );
};

export default ConsultaInventarioEspecies;
