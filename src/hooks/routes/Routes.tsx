import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Error404 from '../../containers/errors/Error404';
import Login from '../../containers/pages/Login';
import Home from '../../containers/pages/Home';
import Traslados from '../../containers/pages/Traslados';
import Altas from '../../containers/pages/Altas';
import Inventario from '../../containers/pages/Inventario';
import Bajas from '../../containers/pages/Bajas';
import Donaciones from '../../containers/pages/Donaciones';
import Informes from '../../containers/pages/Informes';
import Configuracion from '../../containers/pages/Configuracion';
import ClaveUnica from '../../containers/pages/ClaveUnica';


const AnimatedRoutes: React.FC = () => {
    const location = useLocation();

    return (
        <AnimatePresence>
            <Routes location={location} key={location.pathname}>
                {/* Error Display */}
                <Route path="*" element={<Error404 />} />

                {/* Login Display */}
                <Route path="/" element={<ClaveUnica/>} />
                <Route path="/Login" element={<Login/>} />
                <Route path="/Home" element={<Home/>} />
                <Route path="/Inventario" element={<Inventario/>} />
                <Route path="/Traslados" element={<Traslados/>} />
                <Route path="/Altas" element={<Altas/>} />
                <Route path="/Bajas" element={<Bajas/>} />
                <Route path="/Donaciones" element={<Donaciones/>} />
                <Route path="/Informes" element={<Informes/>} />
                <Route path="/Configuracion" element={<Configuracion/>} />
            </Routes>
        </AnimatePresence>
    );
};

export default AnimatedRoutes;