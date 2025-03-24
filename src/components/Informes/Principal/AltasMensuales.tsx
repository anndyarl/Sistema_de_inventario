import React from "react"

import { Helmet } from "react-helmet-async";
import Layout from "../../../containers/hocs/layout/Layout";
import MenuInformes from "../../Menus/MenuInformes";

const AltasMensuales: React.FC = () => {
    return (
        <Layout>
            <Helmet>
                <title>Altas Mensuales</title>
            </Helmet>
            <MenuInformes />
            <p>Altas Mensuales</p>
        </Layout>
    );
};

export default AltasMensuales;
