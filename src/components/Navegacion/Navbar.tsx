import React, { useEffect, useState } from 'react';
import Profile from './Profile';
import { useNavigate } from 'react-router-dom';
import { Search } from 'react-bootstrap-icons';
import { RootState } from '../../store';
import { connect } from 'react-redux';
import { darkModeActions } from '../../redux/actions/Otros/darkModeActions';
const classNames = (...classes: (string | boolean | undefined)[]): string => {
    return classes.filter(Boolean).join(" ");
};
interface DarkMode {
    isDarkMode: boolean;
}
const Navbar: React.FC<DarkMode> = ({ isDarkMode }) => {
    const [search, setSearch] = useState('');
    const navigate = useNavigate();

    const routes = [
        { name: 'Inventario', path: '/Inventario' },
        { name: 'Registrar Inventario', path: '/FormInventario', keywords: ['crear', 'registrar'] },
        { name: 'Modificar Inventario', path: '/ModificarInventario' },
        { name: 'Anular Inventario', path: '/AnularInventario' },
        { name: 'Bienes de Funcionarios', path: '/FormBienesFuncionarios', keywords: ['bienes', 'crear bienes'] },
        { name: 'Carga Masiva', path: '/CargaMasiva' },
        { name: 'Traslados', path: '/Traslados' },
        { name: 'Registrar Traslados', path: '/RegistrarTraslados' },
        { name: 'Altas', path: '/Altas' },
        { name: 'Firmar Altas', path: '/FirmarAltas' },
        { name: 'Registrar Altas', path: '/RegistrarAltas' },
        { name: 'Anular Altas', path: '/AnularAltas' },
        { name: 'Imprimir Etiqueta', path: '/ImprimirEtiqueta', keywords: ['qr', 'Etiquetas', 'Imprimir', 'generar'] },
        { name: 'Bajas', path: '/Bajas' },
        { name: 'Bodega de exluidos', path: '/BodegaExcluidos' },
        { name: 'Donaciones', path: '/Donaciones' },
        { name: 'Informes', path: '/Informes' }


    ];

    // Filtra las rutas basadas en la búsqueda
    const filteredRoutes = routes.filter((route) =>
        route.name.toLowerCase().includes(search.toLowerCase()) ||
        route.keywords?.some(keyword => keyword.toLowerCase().includes(search.toLowerCase()))
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

    // const searchRoutes = (query: string) => {
    //     return routes.filter(route =>
    //         route.name.toLowerCase().includes(query.toLowerCase()) ||
    //         route.keywords.some(keyword => keyword.toLowerCase().includes(query.toLowerCase()))
    //     );
    // };

    // // Ejemplo de uso
    // const userInput = 'QR';  // Esto podría venir de un campo de búsqueda
    // const filteredRoutes = searchRoutes(userInput);

    // console.log(filteredRoutes);  // Resultado: Array con la ruta de 'Imprimir Etiqueta'

    return (
        <nav id="navbar" className={`navbar justify-content-end rounded-3 ${isDarkMode ? "bg-color-dark" : "bg-light"}`}>
            <div className="d-flex align-items-center">
                <Search className={classNames("mx-2 flex-shrink-0", "h-5 w-5")} aria-hidden="true" />
                <input
                    type="text"
                    className={`form-select rounded-4 ${isDarkMode ? "bg-dark text-light " : ""}`}
                    placeholder="Buscar"
                    value={search}
                    size={40}
                    onChange={(e) => setSearch(e.target.value)}
                />

                {search && (
                    <ul
                        className="position-absolute  mx-5 mt-4 top-50 z-3 bg-white rounded shadow list-group list-group-flush overflow-auto"
                        style={{ maxHeight: '250px', width: "290px" }}>
                        {filteredRoutes.map((route) => (
                            <li
                                key={route.path}
                                className="list-group-item list-group-item-action "
                                onClick={() => handleSelectRoute(route.path)}
                            >
                                {route.name}
                            </li>
                        ))}
                    </ul>
                )}
                <Profile />
            </div>

        </nav >
    );
}

//mapea los valores del estado global de Redux
const mapStateToProps = (state: RootState) => ({
    isDarkMode: state.darkModeReducer.isDarkMode
});

export default connect(mapStateToProps, {
    darkModeActions
})(Navbar);
