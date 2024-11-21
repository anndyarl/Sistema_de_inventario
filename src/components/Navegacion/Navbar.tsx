import React, { useEffect, useState } from 'react';
import Profile from './Profile';
import { useNavigate } from 'react-router-dom';


function Navbar() {
    const [search, setSearch] = useState('');
    const navigate = useNavigate();

    const routes = [
        { name: 'Inventario', path: '/Inventario' },
        { name: 'Registrar Inventario', path: '/FormInventario' },
        { name: 'Modificar Inventario', path: '/ModificarInventario' },
        { name: 'Anular Inventario', path: '/AnularInventario' },
        { name: 'Bienes de Funcionarios', path: '/FormBienesFuncionarios' },
        { name: 'Carga Masiva', path: '/CargaMasiva' },
        { name: 'Traslados', path: '/Traslados' },
        { name: 'Altas', path: '/Altas' },
        { name: 'Registrar Altas', path: '/RegistrarAltas' },
        { name: 'Anular Altas', path: '/AnularAltas' },
        { name: 'Bajas', path: '/Bajas' },
        { name: 'Donaciones', path: '/Donaciones' },
        { name: 'Informes', path: '/Informes' },
        { name: 'Configuración', path: '/Configuracion' },


    ];

    // Filtra las rutas basadas en la búsqueda
    const filteredRoutes = routes.filter((route) =>
        route.name.toLowerCase().includes(search.toLowerCase())
    );

    const handleSelectRoute = (path: string) => {
        setSearch(''); // Limpia el campo de búsqueda
        navigate(path); // Navega a la ruta seleccionada
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
        <nav id="navbar" className="navbar navbar-expand-lg navbar-light justify-content-end">
            <div className="d-flex">
                <input
                    type="text"
                    className="form-control me-2"
                    placeholder="Buscar..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                {search && (

                    <ul
                        className="position-absolute mt-5 z-1 bg-white rounded shadow list-group list-group-flush overflow-auto"
                        style={{ maxHeight: '200px' }}>
                        {filteredRoutes.map((route) => (
                            <li
                                key={route.path}
                                className="list-group-item list-group-item-action"
                                onClick={() => handleSelectRoute(route.path)}
                            >
                                {route.name}
                            </li>
                        ))}
                    </ul>


                )}
            </div>
            <Profile />
        </nav>

    );
}

export default Navbar;