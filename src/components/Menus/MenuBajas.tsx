import React, { useState } from "react";

import { NavLink } from "react-router-dom";
import { List, Exclude, BoxSeamFill, Boxes } from "react-bootstrap-icons";
import { RootState } from "../../store";
import { connect } from "react-redux";
const classNames = (...classes: (string | boolean | undefined)[]): string => {
    return classes.filter(Boolean).join(" ");
};

interface NavItem {
    name: string;
    description: string;
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
            name: 'Listado General',
            description: 'Busque el activo o los activos que desee dar de baja',
            href: '/Bajas/ListadoGeneral',
            icon: Boxes
        },
        // {
        //     name: 'Bienes de Bajas',
        //     description: 'Busque el activo o los activos que desee excluir',
        //     href: '/Bajas/RegistrarBajas',
        //     icon: DashCircle
        // },
        {
            name: 'Bodega de Excluidos',
            description: 'Seleccione el activo o los activos de baja que desee enviar a remate',
            href: '/Bajas/BodegaExcluidos',
            icon: Exclude
        },
        {
            name: 'Bienes Rematados',
            description: 'Listado de todos los activos excluidos',
            href: '/Bajas/BienesRematados',
            icon: BoxSeamFill
        },

    ];

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    return (
        <>
            {/* Mobile Navbar y Desktop*/}
            <nav className="navbar navbar-expand-lg navbar-light justify-content-end border shadow-sm rounded-3 border-0">
                <button className="navbar-toggler m-1 border-0" type="button" aria-label="Toggle navigation" onClick={toggleSidebar}>
                    <List size={30} className={`${isDarkMode ? "text-white" : ""}`} />
                </button>
                <div className="container-fluid">

                    <div className={`w-100 ${sidebarOpen ? "d-block" : "d-none"} d-lg-block`}>
                        <div className="navbar-nav mb-2 mb-lg-0 me-3">
                            {navigation.map((item, index) => (
                                <NavLink
                                    key={index}
                                    to={item.href}
                                    onClick={toggleSidebar}
                                    className={({ isActive }) =>
                                        classNames(
                                            'btn py-2 px-3 m-1 text-decoration-none border-0 fw-semibold ',
                                            isActive ? 'border-bottom  rounded-0 border-2 border-secondary' : '',
                                            isDarkMode ? 'text-light' : 'text-secondary'
                                        )
                                    }
                                >
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
