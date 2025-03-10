import React from "react"

import { Helmet } from "react-helmet-async";
import Layout from "../../../containers/hocs/layout/Layout";

const FoliosXServicioDependencia: React.FC = () => {
    return (
        <Layout>
            <Helmet>
                <title>FoliosXServicioDependencia</title>
            </Helmet>
            <p>Folios por Sercivio-Dependencia</p>
        </Layout>
    );
};

export default FoliosXServicioDependencia;
