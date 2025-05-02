import React, { useState } from "react";

import { NavLink } from "react-router-dom";
import { List, Collection } from "react-bootstrap-icons";
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
            name: 'Servicios',
            description: 'Listado de Servicios',
            href: '/Mantenedores/Servicios',
            icon: Collection
        },
        {
            name: 'Dependencias',
            description: 'Listado de Dependencias',
            href: '/Mantenedores/Dependencias',
            icon: Collection
        },
        {
            name: 'Proveedores',
            description: 'Listado de Proveedores',
            href: '/Mantenedores/Proveedores',
            icon: Collection
        },
        {
            name: 'Especies',
            description: 'Listado de Especies',
            href: '/Mantenedores/Especies',
            icon: Collection
        },
        // {
        //     name: 'Componente',
        //     description: 'Listado de Componentes',
        //     href: '/Mantenedores/Componentes',
        //     icon: Collection
        // },
        // {
        //     name: 'Usuarios',
        //     description: 'Listado de Usuarios',
        //     href: '/Mantenedores/Usuarios',
        //     icon: Collection
        // },
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
