import React from "react"
import Layout from "../hocs/layout/Layout";
import { Helmet } from "react-helmet-async";

const Informes: React.FC = () => {
  return (
    <Layout>
      <Helmet>
        <title>Informes</title>
      </Helmet>
      <p>Informes</p>
    </Layout>
  );
};

export default Informes;
