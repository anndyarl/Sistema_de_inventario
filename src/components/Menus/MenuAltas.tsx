import React, { useEffect, useState } from "react";

import { NavLink } from "react-router-dom";
import { Printer, CheckCircleFill, PlusCircle } from "react-bootstrap-icons";
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
    const [sidebarOpenSubMenu, setsidebarOpenSubMenu] = useState(false);
    const navigation: NavItem[] = [
        {
            name: 'Registrar Altas',
            description: 'Busque el activo o los activos que desee dar de Alta.',
            href: '/Altas/RegistrarAltas',
            icon: PlusCircle
        },
        // {
        //     name: 'Anular Altas',
        //     description: 'Busque el activo o los activos de altas que desee anular.',
        //     href: '/Altas/AnularAltas',
        //     icon: SlashCircle
        // },
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
            icon: CheckCircleFill
        },
        {
            name: 'Imprimir Etiquetas',
            description: 'Encuentre y modifique el inventario existente.',
            href: '/Altas/ImprimirEtiqueta',
            icon: Printer
        },

    ];
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 992); // 992px es el breakpoint de lg en Bootstrap
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        return () => window.removeEventListener('resize', checkMobile);
    }, []);
    const toggleSidebarMenu = () => setsidebarOpenSubMenu(!sidebarOpenSubMenu);

    return (
        <>
            {/* Mobile Navbar y Desktop*/}

            <nav className="navbar navbar-expand-lg navbar-light justify-content-end border shadow-sm rounded-3 border-0 p-0">
                {/* <button className="navbar-toggler m-1 border-0" type="button" aria-label="Toggle navigation" onClick={toggleSidebarMenu}>
                    <List key="main-toggle-icon" size={30} className={`${isDarkMode ? "text-white" : ""}`} />
                </button> */}
                <div className="d-flex justify-content-center justify-content-lg-start container-fluid">
                    {/* <div className={`w-100 ${sidebarOpenSubMenu ? "d-block" : "d-none"} d-lg-block`}> */}
                    {/* <div className="navbar-nav mb-2 mb-lg-0 me-3"> */}
                    {navigation.map((item, index) => (
                        <NavLink
                            key={index}
                            to={item.href}
                            onClick={toggleSidebarMenu}
                            className={({ isActive }) =>
                                classNames(
                                    'btn text-decoration-none border-0 fw-semibold',
                                    isActive ? `border-bottom rounded-0 border-2 border-primary text-primary fw-semibold` : 'text-secondary',
                                    isDarkMode ? ' rounded-0 border-2 border-light text-light fw-semibold' : ''
                                )
                            }
                        >
                            <item.icon className="flex-shrink-0 h-5 w-5" fontSize={20} aria-hidden="true" />
                            {isMobile ? <p className="fs-06rem">{item.name.split(' ')[0]}</p> : <span className="ms-2">{item.name}</span>}
                        </NavLink>
                    ))}
                    {/* </div> */}
                    {/* </div> */}
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
