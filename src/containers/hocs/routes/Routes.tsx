import { BrowserRouter as _, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

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
import ImprimirEtiqueta from '../../../components/Altas/ImprimirEtiqueta';
import RegistrarBajas from '../../../components/Bajas/BienesBajas';
import FormBienesFuncionarios from '../../../components/Inventario/FormBienesFuncionarios';
import BodegaExcluidos from '../../../components/Bajas/BodegaExcluidos';
import RegistrarTraslados from '../../../components/Traslados/RegistrarTraslados';
import FirmarAltas from '../../../components/Altas/FirmarAltas/FirmarAltas';
import BienesRematados from '../../../components/Bajas/BienesRematados';
import ValidaPortal from '../../pages/ValidaPortal';
import Denegado from '../../errors/Denegado';
import ListadoGeneral from '../../../components/Bajas/listadoGeneral';
import IA from '../../pages/IA';

const AnimatedRoutes: React.FC = () => {
    const location = useLocation();
    // const dispatch: AppDispatch = useDispatch(); // Usa el tipo AppDispatch para dispatch


    // useEffect(() => {
    //     dispatch(checkAuthStatus()); // Verifica el estado de autenticación al inicio
    // }, [dispatch]);

    return (
        <AnimatePresence>
            <Routes location={location} key={location.pathname}>
                {/* Error Display */}
                <Route path="*" element={<Error404 />} />
                <Route path="/Denegado" element={<Denegado />} />

                {/* Access Display */}
                <Route path="/Login" element={<Login />} />
                <Route path="/ValidaPortal" element={<ValidaPortal />} />
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
                {/* <Route path="/CargaMasiva" element={<CargaMasiva />} /> */}
                <Route path="/ImprimirEtiqueta" element={<ImprimirEtiqueta />} />
                {/* Fin Menu Inventario */}
                <Route path="/Traslados" element={<Traslados />} />
                <Route path="/RegistrarTraslados" element={<RegistrarTraslados />} />
                {/* Módulo Altas */}
                <Route path="/Altas" element={<Altas />} />
                <Route path="/RegistrarAltas" element={<RegistrarAltas />} />
                <Route path="/AnularAltas" element={<AnularAltas />} />
                <Route path="/FirmarAltas" element={<FirmarAltas />} />
                {/* Fin Módulo Altas */}
                {/* Módulo Bajas */}
                <Route path="/Bajas" element={<Bajas />} />
                <Route path="/ListadoGeneral" element={<ListadoGeneral />} />
                <Route path="/RegistrarBajas" element={<RegistrarBajas />} />
                <Route path="/BodegaExcluidos" element={<BodegaExcluidos />} />
                <Route path="/BienesRematados" element={<BienesRematados />} />
                {/* Fin Módulo Bajas */}
                <Route path="/Donaciones" element={<Donaciones />} />
                <Route path="/Informes" element={<Informes />} />
                <Route path="/Configuracion" element={<Configuracion />} />
                <Route path="/IA" element={<IA />} />
            </Routes>
        </AnimatePresence>
    );
};

export default AnimatedRoutes;