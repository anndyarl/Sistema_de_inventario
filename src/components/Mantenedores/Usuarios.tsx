import React from "react"
import Layout from "../../containers/hocs/layout/Layout";
import MenuMantenedores from "../Menus/MenuMantenedores";


const Usuarios: React.FC = () => {
    return (
        <Layout>
            <MenuMantenedores />
            <p>Usuarios</p>
        </Layout>
    );
};

export default Usuarios;
