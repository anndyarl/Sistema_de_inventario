import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { House, Box, ArrowsMove, PlusCircle, DashCircle, Heart, FileText, Gear } from 'react-bootstrap-icons';
import "../../styles/Sidebar.css"
import Logout from './Logout';
// Function to combine classes conditionally
const classNames = (...classes: (string | boolean | undefined)[]): string => {
  return classes.filter(Boolean).join(' ');
};

interface NavItem {
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
    { name: 'Donaciones', href: '/Donaciones', icon: Heart },
    { name: 'Informes', href: '/Informes', icon: FileText },
    { name: 'Configuración', href: '/Configuracion', icon: Gear }
  ];

  const handleClick = (name: string) => {
    setActiveItem(name);
    setTimeout(() => setActiveItem(null), 300); // Reset after animation
  };

  return (
    <nav className="flex-grow-1">
      <div className='d-flex justify-content-center text-white m-4'>
        <NavLink className="navbar-brand fw-semibold" to="/Inicio">SSMSO</NavLink>
      </div>
      {navigation.map((item) => (
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
      ))}

    </nav >
  );
};

export default Sidebar;