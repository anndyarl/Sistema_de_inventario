import React, { useState } from "react";

import { NavLink } from "react-router-dom";
import { Plus, Pencil, Trash, List, Arrows } from "react-bootstrap-icons";
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
const MenuInventario: React.FC<Props> = ({ isDarkMode }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigation: NavItem[] = [
        {
            name: 'Registrar Inventario',
            description: 'Complete el registro de un nuevo inventario en tres sencillos pasos.',
            href: '/FormInventario',
            icon: Plus
        },
        {
            name: 'Modificar Inventario',
            description: 'Encuentre y modifique el inventario existente.',
            href: '/ModificarInventario',
            icon: Pencil
        },
        {
            name: 'Anular Inventario',
            description: 'Búsquelo previamente por fecha de inicio y término.',
            href: '/AnularInventario',
            icon: Trash
        },
        {
            name: 'Bienes de Funcionarios',
            description: 'Registre los bienes asignados a funcionarios.',
            href: '/FormBienesFuncionarios',
            icon: Arrows
        },
        // {
        //     name: 'Carga Masiva',
        //     description: 'Adjunte el documento correspondiente para la carga masiva del inventario.',
        //     href: '/CargaMasiva',
        //     icon: FileText
        // }

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
})(MenuInventario);
