import React, { useState } from "react";

import { NavLink } from "react-router-dom";
import { Plus, Exclude, List } from "react-bootstrap-icons";
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
    const [activeItem, setActiveItem] = useState<string | null>(null);
    const navigation: NavItem[] = [
        {
            name: 'Registrar Bajas',
            description: 'Busque el activo o los activos que desee dar de Alta.',
            href: '/RegistrarBajas',
            icon: Plus
        },
        {
            name: 'Bodega de Excluidos',
            description: 'Busque el activo o los activos de Bajas que desee Excluir.',
            href: '/BodegaExcluidos',
            icon: Exclude
        },

    ];

    const handleClick = (name: string) => {
        setActiveItem(name);
        setTimeout(() => setActiveItem(null), 300); // Reset after animation
    };

    return (
        <>
            {/* Mobile Navbar y Desktop*/}
            <nav className="navbar navbar-expand-lg navbar-light justify-content-end border shadow-sm rounded-3 border-0">
                <button className="navbar-toggler m-1 border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <List className={`${isDarkMode ? "text-light" : "tet-muted"}`} size={30} />
                </button>
                <div className="container-fluid">

                    <div className="collapse navbar-collapse" id="navbarNav">

                        <div className="navbar-nav mb-2 mb-lg-0 me-3">

                            {navigation.map((item, index) => (
                                <NavLink
                                    key={index}
                                    to={item.href}
                                    className={classNames('btn btn-outline-secondary py-2 px-3 m-1 rounded-2 text-decoration-none', isDarkMode ? "text-light" : "", activeItem === item.name ? 'active' : '')}
                                    onClick={() => handleClick(item.name)}
                                >
                                    <item.icon className={classNames('me-3 flex-shrink-0', 'h-5 w-5')} aria-hidden="true" />
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
