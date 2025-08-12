import { BrowserRouter as Router } from 'react-router-dom';
import { store, persistor } from './store';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import AnimatedRoutes from './containers/hocs/routes/Routes';
const App: React.FC = () => {
  return (
    <HelmetProvider>
      <Helmet>
        <title>Sistema de Inventario</title>
        <meta name="description" content="Sistema de Inventario" />
        <meta name="keywords" content="SSMSO, Sistema de inventario SSMSO, nuevo sistema de inventario SSMSO" />
        <meta name="robots" content="all" />
        <link rel="canonical" href="https://inventario.ssmso.cl" />
        <meta name="author" content="SSMSO" />
        <meta name="publisher" content="SSMSO" />
        <meta property="og:title" content="Sistema de Inventario" />
        <meta property="og:description" content="Sistema de Inventario" />
        <meta property="og:url" content="https://inventario.ssmso.cl" />
        <meta name="twitter:description" content="Sistema de Inventario" />
        <meta name="twitter:card" content="summary_large_image" />
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
