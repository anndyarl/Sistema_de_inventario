import React, { useState } from "react";

import { NavLink } from "react-router-dom";
import { Plus, List, Arrows, PencilSquare, Search, SlashCircle, X } from "react-bootstrap-icons";
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
            href: '/Inventario/FormInventario',
            icon: Plus
        },
        {
            name: 'Modificar Inventario',
            description: 'Encuentre y modifique el inventario existente.',
            href: '/Inventario/ModificarInventario',
            icon: PencilSquare
        },
        {
            name: 'Anular Inventario',
            description: 'Búsquelo previamente por fecha de inicio y término.',
            href: '/Inventario/AnularInventario',
            icon: SlashCircle
        },
        {
            name: 'Buscar Inventario',
            description: 'Filtre por distintos criterios para encontrar de manera fácil sus bienes',
            href: '/Inventario/BuscarInventario',
            icon: Search
        },
        {
            name: 'Bienes de Funcionarios',
            description: 'Registre los bienes asignados a funcionarios.',
            href: '/Inventario/FormBienesFuncionarios',
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
                <button className="navbar-toggler m-1 border-top" type="button" aria-label="Toggle navigation" onClick={toggleSidebar}>
                    {sidebarOpen ? <X size={30} className={`${isDarkMode ? "text-white" : ""}`} /> : <List size={30} className={`${isDarkMode ? "text-white" : ""}`} />}
                </button>
                <div className="container-fluid">
                    <div className={`w-100 ${sidebarOpen ? "d-block" : "d-none"} d-lg-block`}>
                        <div className="navbar-nav mb-2 mb-lg-0 ">
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
})(MenuInventario);
