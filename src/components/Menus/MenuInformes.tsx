import React, { useState } from "react";

import { NavLink } from "react-router-dom";
import { List, FileText } from "react-bootstrap-icons";
import { RootState } from "../../store";
import { connect } from "react-redux";
const classNames = (...classes: (string | boolean | undefined)[]): string => {
    return classes.filter(Boolean).join(" ");
};

interface NavItem {
    name: string;
    href: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}
interface Props {
    isDarkMode: boolean;
}
const MenuBajas: React.FC<Props> = ({ isDarkMode }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigation: NavItem[] = [
        {
            name: 'Altas Mensuales',
            href: '/Informes/AltasMensuales',
            icon: FileText
        },
        {
            name: 'Bajas Mensuales',
            href: '/Informes/BajasMensuales',
            icon: FileText
        },
        {
            name: 'Consulta Inventario Especies',
            href: '/Informes/ConsultaInventarioEspecies',
            icon: FileText
        },
        {
            name: 'Traslados Mensuales',
            href: '/Informes/TrasladosMensuales',
            icon: FileText
        },
        {
            name: 'Folios por Servicio-Dependencia',
            href: '/Informes/FolioPorServicioDependencia',
            icon: FileText
        },
        {
            name: 'Excel-Folios por Servicios',
            href: '/Informes/ExcelFolioPorServicios',
            icon: FileText
        },
    ];

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    return (
        <>
            {/* Mobile Navbar y Desktop*/}
            <nav className="navbar navbar-expand-lg navbar-light justify-content-end border shadow-sm rounded-3 border-0">
                <button className="navbar-toggler m-1" type="button" aria-label="Toggle navigation" onClick={toggleSidebar}>
                    <List size={30} className={`${isDarkMode ? "text-white" : ""}`} />
                </button>
                <div className="container-fluid">

                    <div className={`w-100 ${sidebarOpen ? "d-block" : "d-none"} d-lg-block`}>
                        <div className="navbar-nav mb-2 mb-lg-0 me-3">
                            {navigation.map((item, index) => (
                                <NavLink
                                    key={index}
                                    to={item.href}
                                    className={classNames('btn btn-outline-secondary py-2 px-3 m-1 rounded-2 text-decoration-none', isDarkMode ? "text-light" : "")}
                                    onClick={toggleSidebar}                                 >
                                    <item.icon className="me-3 flex-shrink-0 h-5 w-5" aria-hidden="true" />
                                    {item.name}
                                </NavLink>

                            ))}
                        </div>
                    </div>
                </div>
            </nav>
        </>
    );
};


const mapStateToProps = (state: RootState) => ({
    isDarkMode: state.darkModeReducer.isDarkMode
});

export default connect(mapStateToProps, {
})(MenuBajas);
