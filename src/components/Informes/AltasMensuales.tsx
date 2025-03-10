import React from "react"

import { Helmet } from "react-helmet-async";
import Layout from "../../containers/hocs/layout/Layout";

const AltasMensuales: React.FC = () => {
    return (
        <Layout>
            <Helmet>
                <title>AltasMensuales</title>
            </Helmet>
            <p>AltasMensuales</p>
        </Layout>
    );
};

export default AltasMensuales;
