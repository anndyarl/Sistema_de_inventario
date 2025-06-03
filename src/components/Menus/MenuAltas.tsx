import React, { useState } from "react";

import { NavLink } from "react-router-dom";
import { Plus, List, Printer, SlashCircle } from "react-bootstrap-icons";
import { RootState } from "../../store";
import { connect } from "react-redux";
import { Signature } from "lucide-react";
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
const MenuAltas: React.FC<Props> = ({ isDarkMode }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigation: NavItem[] = [
        {
            name: 'Registrar Altas',
            description: 'Busque el activo o los activos que desee dar de Alta.',
            href: '/Altas/RegistrarAltas',
            icon: Plus
        },
        {
            name: 'Anular Altas',
            description: 'Busque el activo o los activos de altas que desee anular.',
            href: '/Altas/AnularAltas',
            icon: SlashCircle
        },
        {
            name: 'Firmar Altas',
            description: ' Busque, verifique y autorice las altas mediante firmas.',
            href: '/Altas/FirmarAltas',
            icon: Signature
        },
        {
            name: 'Estado Firmas',
            description: ' Verifique el estado de las firmas que han sido firmadas.',
            href: '/Altas/EstadoFirmas',
            icon: Signature
        },
        {
            name: 'Imprimir Etiquetas',
            description: 'Encuentre y modifique el inventario existente.',
            href: '/Altas/ImprimirEtiqueta',
            icon: Printer
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
})(MenuAltas);
