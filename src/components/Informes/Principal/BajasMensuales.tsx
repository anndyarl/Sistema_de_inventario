import React from "react"

import { Helmet } from "react-helmet-async";
import Layout from "../../../containers/hocs/layout/Layout";
import MenuInformes from "../../Menus/MenuInformes";

const BajasMensuales: React.FC = () => {
    return (
        <Layout>
            <Helmet>
                <title>Bajas Mensuales</title>
            </Helmet>
            <MenuInformes />
            <p>Bajas Mensuales </p>
        </Layout>
    );
};

export default BajasMensuales;
