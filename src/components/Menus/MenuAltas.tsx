import React, { useState } from "react";

import { NavLink } from "react-router-dom";
import { Plus, Pencil, Trash } from "react-bootstrap-icons";
const classNames = (...classes: (string | boolean | undefined)[]): string => {
    return classes.filter(Boolean).join(" ");
};

interface NavItem {
    name: string;
    description: string;
    href: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}
const MenuAltas: React.FC = ({ }) => {
    const [activeItem, setActiveItem] = useState<string | null>(null);
    const navigation: NavItem[] = [
        {
            name: 'Registrar Altas',
            description: 'Busque el activo o los activos que desee dar de Alta.',
            href: '/#',
            icon: Plus
        },
        {
            name: 'Modificar Inventario',
            description: 'Encuentre y modifique el inventario existente.',
            href: '/#',
            icon: Pencil
        },
        {
            name: 'Anular Altas',
            description: 'Busque el activo o los activos de altas que desee anular.',
            href: '/AnularAltas',
            icon: Trash
        },

    ];

    const handleClick = (name: string) => {
        setActiveItem(name);
        setTimeout(() => setActiveItem(null), 300); // Reset after animation
    };

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

export default MenuAltas;
