import React from "react"
import { Helmet } from "react-helmet-async";
import Layout from "../../../containers/hocs/layout/Layout";
import { RootState } from "../../../store";
import { connect } from "react-redux";
import MenuDetallesPorCuenta from "../../Menus/MenuDetallesPorCuenta";

interface Props {
    isDarkMode: boolean;
}
const ResumenCuentas: React.FC<Props> = ({ }) => {
    return (
        <Layout>
            <Helmet>
                <title>Resumen Cuentas</title>
            </Helmet>
            <MenuDetallesPorCuenta />
            <p>Resumen Cuentas</p>
        </Layout>
    );
};

const mapStateToProps = (state: RootState) => ({
    isDarkMode: state.darkModeReducer.isDarkMode
});

export default connect(mapStateToProps, {
})(ResumenCuentas);

