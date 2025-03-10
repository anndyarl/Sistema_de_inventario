import React from "react"

import { Helmet } from "react-helmet-async";
import Layout from "../../../containers/hocs/layout/Layout";

const TrasladosMensuales: React.FC = () => {
    return (
        <Layout>
            <Helmet>
                <title>TrasladosMensuales</title>
            </Helmet>
            <p>Traslados Mensuales</p>
        </Layout>
    );
};

export default TrasladosMensuales;
