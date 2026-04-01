import React, { useEffect, useState } from "react";

import { NavLink } from "react-router-dom";
import { Collection } from "react-bootstrap-icons";
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
const MenuMantenedores: React.FC<Props> = ({ isDarkMode }) => {
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
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 992); // 992px es el breakpoint de lg en Bootstrap
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        return () => window.removeEventListener('resize', checkMobile);
    }, []);
    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    return (
        <>
            {/* Mobile Navbar y Desktop*/}
            <div className="navbar navbar-expand-lg navbar-light justify-content-end border shadow-sm rounded-3 border-0 p-0">
                {/* <button className="navbar-toggler m-1 border-0" type="button" aria-label="Toggle navigation" onClick={toggleSidebar}>
                    <List size={30} className={`${isDarkMode ? "text-white" : ""}`} />
                </button> */}
                <div className="d-flex justify-content-center justify-content-lg-start container-fluid">
                    {/* 
                    <div className={`w-100 ${sidebarOpen ? "d-block" : "d-none"} d-lg-block`}>
                        <div className="navbar-nav mb-2 mb-lg-0 me-3"> */}
                    {navigation.map((item, index) => (
                        <NavLink
                            key={index}
                            to={item.href}
                            onClick={toggleSidebar}
                            className={({ isActive }) =>
                                classNames(
                                    'btn text-decoration-none border-0 fw-semibold',
                                    isActive
                                        ? 'border-bottom rounded-0 border-2 border-primary text-primary'
                                        : (isDarkMode ? 'text-light' : 'text-secondary')
                                )
                            }
                        >
                            <item.icon className="flex-shrink-0 h-5 w-5" fontSize={20} aria-hidden="true" />
                            {isMobile ? <p className="fs-06rem">{item.name}</p> : <span className="ms-2">{item.name}</span>}
                        </NavLink>
                    ))}
                    {/* </div>
            </div> */}
                </div >
            </div >
        </>
    );
};


const mapStateToProps = (state: RootState) => ({
    isDarkMode: state.darkModeReducer.isDarkMode
});

export default connect(mapStateToProps, {
})(MenuMantenedores);
