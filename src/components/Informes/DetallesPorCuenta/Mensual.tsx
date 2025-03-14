import React from "react"
import { Helmet } from "react-helmet-async";
import { RootState } from "../../../store";
import { connect } from "react-redux";
import MenuDetallesPorCuenta from "../../Menus/MenuDetallesPorCuenta";
import Layout from "../../../containers/hocs/layout/Layout";

interface Props {
    isDarkMode: boolean;
}
const Mensual: React.FC<Props> = ({ }) => {
    return (
        <Layout>
            <Helmet>
                <title>Mensual</title>
            </Helmet>
            <MenuDetallesPorCuenta />
            <p>Mensual</p>
        </Layout>
    );
};

const mapStateToProps = (state: RootState) => ({
    isDarkMode: state.darkModeReducer.isDarkMode
});

export default connect(mapStateToProps, {
})(Mensual);

