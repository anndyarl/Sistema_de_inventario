import React from "react"
import { Helmet } from "react-helmet-async";
import Layout from "../../../containers/hocs/layout/Layout";
import { RootState } from "../../../store";
import { connect } from "react-redux";
import MenuDetallesPorCuenta from "../../Menus/MenuDetallesPorCuenta";
interface Props {
    isDarkMode: boolean;
}
const Anual: React.FC<Props> = ({ }) => {
    return (
        <Layout>
            <Helmet>
                <title>Anual</title>
            </Helmet>
            <MenuDetallesPorCuenta />
            <p>Anual</p>
        </Layout>
    );
};

const mapStateToProps = (state: RootState) => ({
    isDarkMode: state.darkModeReducer.isDarkMode
});

export default connect(mapStateToProps, {
})(Anual);

