import React from "react"
import { Helmet } from "react-helmet-async";
import MenuInformes from "../Menus/MenuInformes";
import Layout from "../../containers/hocs/layout/Layout";

const ExcelFolioPorServicios: React.FC = () => {
    return (
        <Layout>
            <Helmet>
                <title>Excel Folio por Servicios</title>
            </Helmet>
            <MenuInformes />
            <p>Excel-Folios por Servicios</p>
        </Layout>
    );
};

export default ExcelFolioPorServicios;
