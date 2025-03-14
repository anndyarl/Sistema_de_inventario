import React from "react"
import { Helmet } from "react-helmet-async";
import Layout from "../../../containers/hocs/layout/Layout";
import { RootState } from "../../../store";
import { connect } from "react-redux";
import MenuListados from "../../Menus/MenuListados";

interface Props {
    isDarkMode: boolean;
}
const EspecieFecha: React.FC<Props> = ({ }) => {
    return (
        <Layout>
            <Helmet>
                <title>Especie Fecha</title>
            </Helmet>
            <MenuListados />
            <p>Especie Fecha</p>
        </Layout>
    );
};

const mapStateToProps = (state: RootState) => ({
    isDarkMode: state.darkModeReducer.isDarkMode
});

export default connect(mapStateToProps, {
})(EspecieFecha);

