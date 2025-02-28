import React from "react"
import Layout from "../../containers/hocs/layout/Layout";
import MenuMantenedores from "../Menus/MenuMantenedores";


const Especies: React.FC = () => {
    return (
        <Layout>
            <MenuMantenedores />
            <p>Especies</p>
        </Layout>
    );
};

export default Especies;
