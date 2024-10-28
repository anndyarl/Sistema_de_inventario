import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Error404 from '../../containers/errors/Error404';
import Login from '../../containers/pages/Login';
import Traslados from '../../containers/pages/Traslados';
import Altas from '../../containers/pages/Altas';
import Inventario from '../../containers/pages/Inventario';
import Bajas from '../../containers/pages/Bajas';
import Donaciones from '../../containers/pages/Donaciones';
import Informes from '../../containers/pages/Informes';
import Configuracion from '../../containers/pages/Configuracion';
import ClaveUnica from '../../containers/pages/ClaveUnica';
import SesionExpirada from '../../containers/errors/SesionExpirada';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { checkAuthStatus } from '../../redux/actions/auth/auth';
import { AppDispatch } from '../../store';

import FormBienesFuncionarios from '../../components/Inventario/BienesFuncionarios/FormBienesFuncionarios';
import ModificarInventario from '../../components/Inventario/ModificarInventario/ModificarInventario';

import AnularInventario from '../../components/Inventario/AnularInventario/AnularInventario';
import Inicio from '../../containers/pages/Inicio';
import FormInventario from '../../components/Inventario/RegistrarInventario/FormInventario';


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

                {/* Menu Inventario */}
                <Route path="/Inventario" element={<Inventario />} />
                <Route path="/FormInventario" element={<FormInventario />} />
                <Route path="/ModificarInventario" element={<ModificarInventario />} />
                <Route path="/AnularInventario" element={<AnularInventario />} />
                <Route path="/FormBienesFuncionarios" element={<FormBienesFuncionarios />} />

                {/* Fin Menu Inventario */}


                <Route path="/Traslados" element={<Traslados />} />
                <Route path="/Altas" element={<Altas />} />
                <Route path="/Bajas" element={<Bajas />} />
                <Route path="/Donaciones" element={<Donaciones />} />
                <Route path="/Informes" element={<Informes />} />
                <Route path="/Configuracion" element={<Configuracion />} />
            </Routes>
        </AnimatePresence>
    );
};

export default AnimatedRoutes;