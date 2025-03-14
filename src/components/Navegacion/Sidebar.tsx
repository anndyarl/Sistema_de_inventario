import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Box, ArrowsMove, PlusCircle, DashCircle, FileText, Database,
  FileEarmarkSpreadsheet, ChevronDown,
} from 'react-bootstrap-icons';
import "../../styles/Sidebar.css";

const classNames = (...classes: (string | boolean | undefined)[]): string => {
  return classes.filter(Boolean).join(' ');
};

export interface NavItem {
  name: string;
  href?: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  isSubmenu?: boolean;
}

const Sidebar: React.FC = () => {
  const [openSubMenus, setOpenSubMenus] = useState<{ [key: string]: boolean }>({});

  const navigation: NavItem[] = [
    { name: 'Inventario', href: '/Inventario', icon: Box },
    { name: 'Traslados', href: '/Traslados', icon: ArrowsMove },
    { name: 'Altas', href: '/Altas', icon: PlusCircle },
    { name: 'Bajas', href: '/Bajas', icon: DashCircle },
    { name: 'Informes', href: '/Informes', icon: FileText },
    { name: 'Mantenedores', href: '/Mantenedores', icon: Database },
  ];

  const subMenus: { [key: string]: NavItem[] } = {
    'Informes': [
      { name: 'Listados', href: '/Informes/Listados', icon: FileEarmarkSpreadsheet },
      { name: 'Detalles por Cuenta', href: '/Informes/DetallesPorCuenta', icon: FileEarmarkSpreadsheet },
    ],
  };

  const toggleSubMenu = (menuName: string) => {
    setOpenSubMenus((prev) => ({
      ...prev,
      [menuName]: !prev[menuName],
    }));
  };

  return (
    <div>
      <div className="text-center text-white">
        <div className="d-flex mx-2 top-0 w-75">
          <div className="text-bg-primary p-1 w-50"></div>
          <div className="text-bg-danger p-1 flex-grow-1 w-75"></div>
        </div>
        <div className='m-4'>
          <NavLink className="navbar-brand fw-semibold fs-5" to="/Inicio">SSMSO</NavLink>
        </div>
      </div>

      {navigation.map((item) => (
        <div key={item.name} className="d-flex flex-column">
          <div className="d-flex align-items-center">
            <NavLink
              to={item.href!}
              className={({ isActive }) =>
                classNames(
                  isActive ? 'bg-light text-dark' : 'text-white',
                  'd-flex align-items-center py-2 px-3 mb-2 rounded-1 text-decoration-none nav-item flex-grow-1'
                )
              }
            >
              <item.icon className="me-3 flex-shrink-0 h-5 w-5" aria-hidden="true" />
              <p className='w-100 mb-0 '>{item.name}</p>
            </NavLink>

            {subMenus[item.name] && (
              <button
                className="btn py-2 px-3 mb-2 text-white"
                onClick={() => toggleSubMenu(item.name)}
                aria-label="Toggle submenu"
              >
                <ChevronDown className={`ms-2 ${openSubMenus[item.name] ? 'rotate-180' : ''}`} />
              </button>
            )}
          </div>

          {/* Submenú */}
          {subMenus[item.name] && openSubMenus[item.name] && (
            <div className="ms-4">
              {subMenus[item.name].map((subItem) => (
                <NavLink
                  key={subItem.name}
                  to={subItem.href!}
                  className={({ isActive }) =>
                    classNames(
                      isActive ? 'bg-light text-dark' : 'text-white',
                      'd-flex align-items-center py-2 px-3 mb-2 rounded text-decoration-none nav-item'
                    )
                  }
                >
                  <subItem.icon className="me-3 flex-shrink-0 h-5 w-5" />
                  {subItem.name}
                </NavLink>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Sidebar;
