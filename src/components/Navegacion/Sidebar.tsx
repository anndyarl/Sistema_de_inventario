import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Box, ArrowsMove, PlusCircle, DashCircle, FileText, Database } from 'react-bootstrap-icons';
import "../../styles/Sidebar.css"

const classNames = (...classes: (string | boolean | undefined)[]): string => {
  return classes.filter(Boolean).join(' ');
};
export interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

const Sidebar: React.FC = () => {
  const [activeItem, setActiveItem] = useState<string | null>(null);

  const navigation: NavItem[] = [

    { name: 'Inventario', href: '/Inventario', icon: Box },
    { name: 'Traslados', href: '/Traslados', icon: ArrowsMove },
    { name: 'Altas', href: '/Altas', icon: PlusCircle },
    { name: 'Bajas', href: '/Bajas', icon: DashCircle },
    // { name: 'Donaciones', href: '/Donaciones', icon: Heart },
    { name: 'Informes', href: '/Informes', icon: FileText },
    { name: 'Mantenedores', href: '/Mantenedores', icon: Database },
    // { name: 'IA', href: '/IA', icon: ChatDots }
  ];

  const handleClick = (name: string) => {
    setActiveItem(name);
    setTimeout(() => setActiveItem(null), 300); // Reset after animation
  };

  return (
    <nav>
      <div className="text-center text-white">
        <div className="d-flex  mx-2 top-0 w-75">
          <div className="text-bg-primary p-1 w-50"></div>
          <div className="text-bg-danger p-1 flex-grow-1 w-75"></div>
        </div>
        <div className='m-4'>
          <NavLink className="navbar-brand fw-semibold fs-5" to="/Inicio">SSMSO</NavLink>
        </div>
        {/* <div className='img-ondas'> </div> */}
      </div>
      {
        navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              classNames(
                isActive ? 'bg-light text-dark' : 'text-white',
                'd-flex align-items-center py-2 px-3 mb-2 rounded text-decoration-none nav-item',
                activeItem === item.name ? 'active' : ''
              )
            }
            onClick={() => handleClick(item.name)}
          >
            <item.icon className={classNames('me-3 flex-shrink-0', 'h-5 w-5')} aria-hidden="true" />
            {item.name}
          </NavLink>

        ))
      }
      {/* <div className="position-values-3 d-none d-lg-block">
        <img
          src={ondas}
          alt="ondas"
          width={200}
          className="img-fluid d-none d-lg-block"
        />
      </div> */}
    </nav >
  );
};


export default (Sidebar);

