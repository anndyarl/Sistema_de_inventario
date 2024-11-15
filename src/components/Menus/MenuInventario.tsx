import React, { useEffect, useState } from "react";

import { NavLink } from "react-router-dom";
import { Plus, Pencil, Trash, Arrows } from "react-bootstrap-icons";

const classNames = (...classes: (string | boolean | undefined)[]): string => {
    return classes.filter(Boolean).join(" ");
};

interface NavItem {
    name: string;
    description: string;
    href: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}
const MenuInventario: React.FC = ({ }) => {
    const [activeItem, setActiveItem] = useState<string | null>(null);
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

    const handleClick = (name: string) => {
        setActiveItem(name);
        setTimeout(() => setActiveItem(null), 300); // Reset after animation
    };
    useEffect(() => {
        const handleScroll = () => {
            const navbar = document.getElementById('navbar');
            if (navbar) {
                if (window.scrollY > 50) {
                    navbar.classList.add('shadow-navbar', 'bg-white');
                } else {
                    navbar.classList.remove('shadow-navbar', 'bg-white');
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    return (
        <>
            {/* Mobile Navbar y Desktop*/}
            <nav id="navbar" className="navbar navbar-expand-lg navbar-light">
                <div className="container-fluid">
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse justify-content-start" id="navbarNav">
                        <div className="navbar-nav mb-2 mb-lg-0 me-3">
                            {navigation.map((item) => (
                                <NavLink
                                    to={item.href}
                                    className={classNames(
                                        'btn btn-outline-light text-dark py-2 px-3 m-1 rounded text-decoration-none',
                                        activeItem === item.name ? 'active' : ''
                                    )}
                                    onClick={() => handleClick(item.name)}
                                >
                                    <item.icon
                                        className={classNames('me-3 flex-shrink-0', 'h-5 w-5')}
                                        aria-hidden="true"
                                    />
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

export default MenuInventario;
