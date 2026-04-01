import React, { useEffect, useState } from "react";

import { NavLink } from "react-router-dom";
import { PencilSquare, Search, SlashCircle, PersonPlus, CardList, PlusCircle } from "react-bootstrap-icons";
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
            icon: PlusCircle
        },
        {
            name: 'Modificar Inventario',
            description: 'Encuentre y modifique el inventario existente.',
            href: '/Inventario/ModificarInventario',
            icon: PencilSquare
        },
        {
            name: 'Buscar Inventario',
            description: 'Filtre por distintos criterios para encontrar de manera fácil sus bienes',
            href: '/Inventario/BuscarInventario',
            icon: Search
        },
        {
            name: 'Anular Inventario',
            description: 'Búsquelo previamente por fecha de inicio y término.',
            href: '/Inventario/AnularInventario',
            icon: SlashCircle
        },
        {
            name: 'Bienes de Funcionarios',
            description: 'Registre los bienes asignados a funcionarios.',
            href: '/Inventario/RegistroBienesFuncionarios',
            icon: PersonPlus
        },
        {
            name: 'Listado Bienes Funcionarios',
            description: 'Listado de bienes asignados a funcionarios.',
            href: '/Inventario/ListadoBienesFuncionarios',
            icon: CardList
        },

        // {
        //     name: 'Carga Masiva',
        //     description: 'Adjunte el documento correspondiente para la carga masiva del inventario.',
        //     href: '/CargaMasiva',
        //     icon: FileText
        // }

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
            <nav className="navbar navbar-expand-lg navbar-light justify-content-end border shadow-sm rounded-3 border-0 p-0">
                {/* <button className="navbar-toggler m-1 border-top" type="button" aria-label="Toggle navigation" onClick={toggleSidebar}>
                    {sidebarOpen ? <X size={30} className={`${isDarkMode ? "text-white" : ""}`} /> : <List size={30} className={`${isDarkMode ? "text-white" : ""}`} />}
                </button> */}
                <div className="d-flex justify-content-start justify-content-lg-start  container-fluid p-0">
                    {/* <div className={`w-100 ${sidebarOpen ? "d-block" : "d-none"} d-lg-block`}> */}
                    {/* <div className="navbar-nav mb-2 mb-lg-0 "> */}
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
})(MenuInventario);
