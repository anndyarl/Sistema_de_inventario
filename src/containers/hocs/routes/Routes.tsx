import { BrowserRouter as _, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import Login from '../../pages/Login';
import Traslados from '../../pages/Traslados';
import Altas from '../../pages/Altas';
import Inventario from '../../pages/Inventario';
import Bajas from '../../pages/Bajas';
import Donaciones from '../../pages/Donaciones';
import Informes from '../../pages/Informes';
import ClaveUnica from '../../pages/ClaveUnica';
import SesionExpirada from '../../errors/SesionExpirada';
// import { useDispatch } from 'react-redux';
// import { useEffect } from 'react';
// import { checkAuthStatus } from '../../../redux/actions/auth/auth';
// import { AppDispatch } from '../../../store';


import ModificarInventario from '../../../components/Inventario/ModificarInventario';

import AnularInventario from '../../../components/Inventario/AnularInventario';
import Inicio from '../../pages/Inicio';
import FormInventario from '../../../components/Inventario/RegistrarInventario/FormInventario';
// import CargaMasiva from '../../../components/Inventario/CargaMasiva';

import AnularAltas from '../../../components/Altas/AnularAltas';
import RegistrarAltas from '../../../components/Altas/RegistrarAltas';

import Error404 from '../../errors/Error404';
import ImprimirEtiqueta from '../../../components/Altas/ImprimirEtiqueta/ImprimirEtiqueta';
import RegistrarBajas from '../../../components/Bajas/BienesBajas';
import FormBienesFuncionarios from '../../../components/Inventario/FormBienesFuncionarios';
import BodegaExcluidos from '../../../components/Bajas/BodegaExcluidos';
import RegistrarTraslados from '../../../components/Traslados/RegistrarTraslados';
import FirmarAltas from '../../../components/Altas/FirmarAltas/FirmarAltas';
import BienesRematados from '../../../components/Bajas/BienesRematados';
import ValidaPortal from '../../pages/ValidaPortal';
import Denegado from '../../errors/Denegado';
import ListadoGeneral from '../../../components/Bajas/ListadoGeneral';
import Servicios from '../../../components/Mantenedores/Servicios';
import Dependencias from '../../../components/Mantenedores/Dependencias';
import Especies from '../../../components/Mantenedores/Especies';
import Usuarios from '../../../components/Mantenedores/Usuarios';
import Mantenedores from '../../pages/Mantenedores';
import ListadoTraslados from '../../../components/Traslados/ListadoTraslados';
import Proveedores from '../../../components/Mantenedores/Proveedores';



const AnimatedRoutes: React.FC = () => {
    const location = useLocation();
    // const dispatch: AppDispatch = useDispatch(); // Usa el tipo AppDispatch para dispatch


    // useEffect(() => {
    //     dispatch(checkAuthStatus()); // Verifica el estado de autenticación al inicio
    // }, [dispatch]);

    return (
        <AnimatePresence>
            <Routes location={location} key={location.pathname}>

                {/* Accesso */}
                <Route path="/Login" element={<Login />} />{/*Usado para pruebas */}
                <Route path="/ValidaPortal" element={<ValidaPortal />} />
                {/* <Route path="/ClaveUnica" element={<ClaveUnica/>} /> */}{/*Usado para pruebas */}
                {/* Fin Accesso */}

                {/* Principal */}
                <Route path="/Inicio" element={<Inicio />} />
                <Route path="/" element={<ClaveUnica />} />
                {/* Principal */}

                {/* Módulo Inventario */}
                <Route path="/Inventario" element={<Inventario />} />
                <Route path="/Inventario/FormInventario" element={<FormInventario />} />
                <Route path="/Inventario/ModificarInventario" element={<ModificarInventario />} />
                <Route path="/Inventario/AnularInventario" element={<AnularInventario />} />
                <Route path="/Inventario/FormBienesFuncionarios" element={<FormBienesFuncionarios />} />
                {/* <Route path="/CargaMasiva" element={<CargaMasiva />} /> */}
                {/* Fin Menu Inventario */}

                {/* Módulo Traslados */}
                <Route path="/Traslados" element={<Traslados />} />
                <Route path="/Traslados/RegistrarTraslados" element={<RegistrarTraslados />} />
                <Route path="/Traslados/ListadoTraslados" element={<ListadoTraslados />} />
                {/* Fin Módulo Traslados */}

                {/* Módulo Altas */}
                <Route path="/Altas" element={<Altas />} />
                <Route path="/Altas/RegistrarAltas" element={<RegistrarAltas />} />
                <Route path="/Altas/AnularAltas" element={<AnularAltas />} />
                <Route path="/Altas/ImprimirEtiqueta" element={<ImprimirEtiqueta />} />
                <Route path="/Altas/FirmarAltas" element={<FirmarAltas />} />
                {/* Fin Módulo Altas */}

                {/* Módulo Bajas */}
                <Route path="/Bajas" element={<Bajas />} />
                <Route path="/Bajas/ListadoGeneral" element={<ListadoGeneral />} />
                <Route path="/Bajas/RegistrarBajas" element={<RegistrarBajas />} />
                <Route path="/Bajas/BodegaExcluidos" element={<BodegaExcluidos />} />
                <Route path="/Bajas/BienesRematados" element={<BienesRematados />} />
                {/* Fin Módulo Bajas */}

                {/* Informes */}
                <Route path="/Informes" element={<Informes />} />{/*Mo disponible aún*/}
                {/* Fin Informes*/}

                {/* Donaciones */}
                <Route path="/Donaciones" element={<Donaciones />} />{/*No disponible aún*/}
                {/* Fin Donaciones*/}

                {/* Módulo Mantenedores */}
                <Route path="/Mantenedores" element={<Mantenedores />} />
                <Route path="/Mantenedores/Dependencias" element={<Dependencias />} />
                <Route path="/Mantenedores/Especies" element={<Especies />} />
                <Route path="/Mantenedores/Servicios" element={<Servicios />} />
                <Route path="/Mantenedores/Usuarios" element={<Usuarios />} />
                <Route path="/Mantenedores/Proveedores" element={<Proveedores />} />
                {/* Módulo Mantenedores */}

                {/* Errores */}
                <Route path="*" element={<Error404 />} />
                <Route path="/Denegado" element={<Denegado />} />
                <Route path="/SesionExpirada" element={<SesionExpirada />} />
                {/* Fin Errores */}
            </Routes>
        </AnimatePresence>
    );
};

export default AnimatedRoutes;