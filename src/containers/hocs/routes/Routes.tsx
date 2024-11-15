import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Error404 from '../../errors/Error404';
import Login from '../../pages/Login';
import Traslados from '../../pages/Traslados';
import Altas from '../../pages/Altas';
import Inventario from '../../pages/Inventario';
import Bajas from '../../pages/Bajas';
import Donaciones from '../../pages/Donaciones';
import Informes from '../../pages/Informes';
import Configuracion from '../../pages/Configuracion';
import ClaveUnica from '../../pages/ClaveUnica';
import SesionExpirada from '../../errors/SesionExpirada';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { checkAuthStatus } from '../../../redux/actions/auth/auth';
import { AppDispatch } from '../../../store';

import FormBienesFuncionarios from '../../../components/Inventario/BienesFuncionarios/FormBienesFuncionarios';
import ModificarInventario from '../../../components/Inventario/ModificarInventario/ModificarInventario';

import AnularInventario from '../../../components/Inventario/AnularInventario/AnularInventario';
import Inicio from '../../pages/Inicio';
import FormInventario from '../../../components/Inventario/RegistrarInventario/FormInventario';
import CargaMasiva from '../../../components/Inventario/CargaMasiva/CargaMasiva';
import RegistrarAltas from '../../../components/Altas/AnularAltas/AnularAltas';
import AnularAltas from '../../../components/Altas/AnularAltas/AnularAltas';



const AnimatedRoutes: React.FC = () => {
    const location = useLocation();
    const dispatch: AppDispatch = useDispatch(); // Usa el tipo AppDispatch para dispatch


    useEffect(() => {
        dispatch(checkAuthStatus()); // Verifica el estado de autenticación al inicio
    }, [dispatch]);

    return (
        <AnimatePresence>
            <Routes location={location} key={location.pathname}>
                {/* Error Display */}
                <Route path="*" element={<Error404 />} />

                {/* Access Display */}
                <Route path="/Login" element={<Login />} />
                <Route path="/SesionExpirada" element={<SesionExpirada />} />
                {/* <Route path="/ClaveUnica" element={<ClaveUnica/>} />  */}

                {/* Menu principal */}
                <Route path="/Inicio" element={<Inicio />} />
                <Route path="/" element={<ClaveUnica />} />

                {/* Módulo Inventario */}
                <Route path="/Inventario" element={<Inventario />} />
                <Route path="/FormInventario" element={<FormInventario />} />
                <Route path="/ModificarInventario" element={<ModificarInventario />} />
                <Route path="/AnularInventario" element={<AnularInventario />} />
                <Route path="/FormBienesFuncionarios" element={<FormBienesFuncionarios />} />
                <Route path="/CargaMasiva" element={<CargaMasiva />} />
                {/* Fin Menu Inventario */}
                <Route path="/Traslados" element={<Traslados />} />
                {/* Módulo Altas */}
                <Route path="/Altas" element={<Altas />} />
                <Route path="/RegistrarAltas" element={<RegistrarAltas />} />
                <Route path="/AnularAltas" element={<AnularAltas />} />
                {/* Fin Módulo Altas */}
                <Route path="/Bajas" element={<Bajas />} />
                <Route path="/Donaciones" element={<Donaciones />} />
                <Route path="/Informes" element={<Informes />} />
                <Route path="/Configuracion" element={<Configuracion />} />
            </Routes>
        </AnimatePresence>
    );
};

export default AnimatedRoutes;