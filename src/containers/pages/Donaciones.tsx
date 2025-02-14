import React from "react"
import Layout from "../hocs/layout/Layout";
import { Helmet } from "react-helmet-async";

const Donaciones: React.FC = () => {
  return (
    <Layout>
      <Helmet>
        <title>Donaciones</title>
      </Helmet>
      <p>Donaciones</p>
    </Layout>
  );
};

export default Donaciones;
