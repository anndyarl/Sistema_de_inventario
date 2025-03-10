import React from "react"

import { Helmet } from "react-helmet-async";
import Layout from "../../../containers/hocs/layout/Layout";

const ExFolioXServicios: React.FC = () => {
    return (
        <Layout>
            <Helmet>
                <title>ExFolioXServicios</title>
            </Helmet>
            <p>Excel-Folios por Servicios</p>
        </Layout>
    );
};

export default ExFolioXServicios;
