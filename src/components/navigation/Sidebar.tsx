import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { House, Box, ArrowsMove, PlusCircle, DashCircle, Heart, FileText, Gear, List, X, Person   } from 'react-bootstrap-icons';

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
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navigation: NavItem[] = [
    { name: 'Home', href: '/Home', icon: House },
    { name: 'Inventario', href: '/Inventario', icon: Box },
    { name: 'Traslados', href: '/Traslados', icon: ArrowsMove },
    { name: 'Altas', href: '/Altas', icon: PlusCircle },
    { name: 'Bajas', href: '/Bajas', icon: DashCircle },
    { name: 'Donaciones', href: '/Donaciones', icon: Heart },
    { name: 'Informes', href: '/Informes', icon: FileText },
    { name: 'Configuración', href: '/Configuracion', icon: Gear }
  ];

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Mobile toggle button */}
      <button 
        className="d-md-none btn btn-primary position-fixed top-0 start-0 mt-2 ms-2 z-3"
        onClick={toggleSidebar}
        aria-label="Toggle sidebar"
      >
        <List size={24} />
      </button>

      {/* Sidebar */}
      <div className={classNames(
        "sidebar bg-color text-white",
        "position-fixed top-0 start-0 bottom-0",
        "d-flex flex-column",
        "p-3",
        "transition-all duration-300",
        isOpen ? "translate-x-0" : "-translate-x-100",
        "d-md-flex"
      )} style={{width: '250px', zIndex: 1030}}>

        {/* <div className="d-flex justify-content-between align-items-center mb-4">
          <h5 className="m-0">Menu</h5>
          <button 
            className="d-md-none btn btn-outline-light"
            onClick={toggleSidebar}
            aria-label="Close sidebar"
          >
            <X size={24} />
          </button>
        </div> */}

        <nav className="flex-grow-1">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) => classNames(
                isActive ? 'bg-light text-dark' : 'text-white',
                'd-flex align-items-center py-2 px-3 mb-2 rounded text-decoration-none'
              )}
              onClick={() => setIsOpen(false)}
            >
              <item.icon
                className={classNames(
                  'me-3 flex-shrink-0',
                  'h-5 w-5'
                )}
                aria-hidden="true"
              />
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto">
          <button className="btn btn-outline-light w-100 d-flex align-items-center justify-content-center">
            <Person className="me-2" />
            Andy Riquelme
          </button>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100 bg-dark opacity-50 d-md-none"
          onClick={toggleSidebar}
          style={{zIndex: 1020}}
        ></div>
      )}
    </>
  );
}

export default Sidebar;