import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { House, Box, ArrowsMove, PlusCircle, DashCircle, Heart, FileText, Gear } from 'react-bootstrap-icons';

// Función para combinar clases condicionalmente
function classNames(...classes: (string | undefined)[]): string {
    return classes.filter(Boolean).join(' ');
}

// Componente Sidebar
const Sidebar: React.FC = () => {
    const location = useLocation();
    
        const navigation = [
      { name: 'Home', href: '/Home', icon: House, current: location.pathname === '/Home' },
      { name: 'Inventario', href: '/Inventario', icon: Box, current: location.pathname === '/Inventario' },  
      { name: 'Traslados', href: '/Traslados', icon: ArrowsMove, current: location.pathname === '/Traslados' }, 
      { name: 'Altas', href: '/Altas', icon: PlusCircle, current: location.pathname === '/Altas' }, 
      { name: 'Bajas', href: '/Bajas', icon: DashCircle, current: location.pathname === '/Bajas' }, 
      { name: 'Donaciones', href: '/Donaciones', icon: Heart, current: location.pathname === '/Donaciones' }, 
      { name: 'Informes', href: '/Informes', icon: FileText, current: location.pathname === '/Informes' }, 
      { name: 'Configuracion', href: '/Configuracion', icon: Gear, current: location.pathname === '/Configuracion' }
    ];

   return (
    <div> 
      {/* <div className="ml-4 mt-2 flex-shrink-0"> 
        <button type="button" className="btn btn-warning text-white shadow-sm" style={{backgroundColor: '#ff6600', borderColor: 'transparent'}}> 
         boton
        </button> 
      </div>  */}

<nav className="mt-5 px-4">
  {navigation.map((item) => (
    <NavLink
      key={item.name}
      to={item.href}
      className={classNames(
        item.current ? 'p-1 bg-light text-dark' : 'text-white',
        'd-flex align-items-center py-2 rounded text-decoration-none'
      )}
    >
      <item.icon
        className={classNames(
          item.current ? 'text-dark' : 'text-white',
          'mr-3 flex-shrink-0'
        )}
        aria-hidden="true"
      />
      {item.name}
    </NavLink>
  ))}
</nav>
    </div>
  );
}

export default Sidebar;
