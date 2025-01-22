import { BrowserRouter as Router } from 'react-router-dom';
import { store, persistor } from './store';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Provider } from 'react-redux';
// import './App.css';

import AnimatedRoutes from './containers/hocs/routes/Routes';
import { PersistGate } from 'redux-persist/integration/react';
const App: React.FC = () => {
  return (
    <HelmetProvider>
      <Helmet>
        <title>Sistema de Inventario | Inicio</title>
        <meta name="description" content="Sistema de Inventario" />
        <meta name="keywords" content="SSMSO, Sistema de inventario ssmso, nuevo sistemas de inventario ssmso" />
        <meta name="robots" content="all" />
        <link rel="canonical" href="https://www.ssmso.cl" />
        <meta name="author" content="SSMSO" />
        <meta name="publisher" content="SSMSO" />

        {/* Social Media Tags */}
        <meta property="og:title" content="Sistema de Inventario" />
        <meta property="og:description" content="Sistema de Inventario" />
        <meta property="og:url" content="https://www.ssmso.cl" />
        {/* <meta property="og:image" content="https://bafybeicwrhxloesdlojn3bxyjqnxgsagtd4sl53a7t4cn4vfe2abmybzua.ipfs.w3s.link/lightbnuilbg.jpg" /> */}

        <meta name="twitter:description" content="Sistema de Inventario" />
        {/* <meta name="twitter:image" content="https://bafybeicwrhxloesdlojn3bxyjqnxgsagtd4sl53a7t4cn4vfe2abmybzua.ipfs.w3s.link/lightbnuilbg.jpg" /> */}
        <meta name="twitter:card" content="summary_large_image" />
        {/* <link rel="icon" href="%PUBLIC_URL%/favicon.ico" /> */}
      </Helmet>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Router>
            <AnimatedRoutes />
          </Router>
        </PersistGate>
      </Provider>
    </HelmetProvider>
  );
};

export default App;
