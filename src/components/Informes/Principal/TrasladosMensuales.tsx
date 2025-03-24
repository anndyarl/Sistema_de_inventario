import React from "react"

import { Helmet } from "react-helmet-async";
import Layout from "../../../containers/hocs/layout/Layout";
import MenuInformes from "../../Menus/MenuInformes";

const TrasladosMensuales: React.FC = () => {
    return (
        <Layout>
            <Helmet>
                <title>Traslados Mensuales</title>
            </Helmet>
            <MenuInformes />
            <p>Traslados Mensuales</p>
        </Layout>
    );
};

export default TrasladosMensuales;
