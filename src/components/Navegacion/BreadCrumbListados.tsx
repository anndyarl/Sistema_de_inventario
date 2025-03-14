import React from "react"
import { connect } from "react-redux";
import { NavLink } from "react-router-dom";
import { RootState } from "../../store";

interface Props {
    rutaActual: string;
    isDarkMode: boolean;
}
const BreadCrumbListados: React.FC<Props> = ({ rutaActual }) => {
    return (
        <>
            {/* Breadcrumb */}
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li>
                        <NavLink className="text-decoration-none text-primary" to="/Informes">Informes / </NavLink>
                    </li>
                    <li>
                        <NavLink className="text-decoration-none text-primary" to="/Informes/Listados">Listados / </NavLink>
                    </li>
                    <li className="text-primary" aria-current="page">
                        {rutaActual}
                    </li>
                </ol>
            </nav>
        </>
    );
};



const mapStateToProps = (state: RootState) => ({
    isDarkMode: state.darkModeReducer.isDarkMode
});

export default connect(mapStateToProps, {
})(BreadCrumbListados);

