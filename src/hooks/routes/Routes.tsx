import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Error404 from '../../containers/errors/Error404';
import Login from '../../containers/pages/Login';
import Home from '../../containers/pages/Home';


const AnimatedRoutes: React.FC = () => {
    const location = useLocation();

    return (
        <AnimatePresence>
            <Routes location={location} key={location.pathname}>
                {/* Error Display */}
                <Route path="*" element={<Error404 />} />

                {/* Login Display */}
                <Route path="/" element={<Login/>} />
                <Route path="/Home" element={<Home/>} />
            </Routes>
        </AnimatePresence>
    );
};

export default AnimatedRoutes;