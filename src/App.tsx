import { BrowserRouter as Router } from 'react-router-dom';
import { store, persistor } from './store'; 
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Provider } from 'react-redux';
// import './App.css';

import AnimatedRoutes from './hooks/routes/Routes';
import { PersistGate } from 'redux-persist/integration/react';

const App: React.FC = () => {
  return (
    <HelmetProvider>
      <Helmet>
        <title>Sistema de Inventario | Home</title>
        <meta name="description" content="Diario de trading" />
        <meta name="keywords" content="agencia de software, agencia de marketing, creacion de pagina web" />
        <meta name="robots" content="all" />
        <link rel="canonical" href="https://www.Younalup.com/" />
        <meta name="author" content="Younalup" />
        <meta name="publisher" content="Younalup" />

        {/* Social Media Tags */}
        <meta property="og:title" content="Sistema de Inventario | Home" />
        <meta property="og:description" content="Diario de trading" />
        <meta property="og:url" content="https://www.Younalup.com/" />
        <meta property="og:image" content="https://bafybeicwrhxloesdlojn3bxyjqnxgsagtd4sl53a7t4cn4vfe2abmybzua.ipfs.w3s.link/lightbnuilbg.jpg" />

        <meta name="twitter:title" content="Sistema de Inventario | Home" />
        <meta name="twitter:description" content="Diario de trading" />
        <meta name="twitter:image" content="https://bafybeicwrhxloesdlojn3bxyjqnxgsagtd4sl53a7t4cn4vfe2abmybzua.ipfs.w3s.link/lightbnuilbg.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
       
        {/* <link href="//maxcdn.bootstrapcdn.com/bootstrap/4.1.1/css/bootstrap.min.css" rel="stylesheet" />
        <script src="//maxcdn.bootstrapcdn.com/bootstrap/4.1.1/js/bootstrap.min.js"></script>
        <script src="//cdnjs.cloudflare.com/ajax/libs/jquery/2.2.4/jquery.min.js"></script> */}
        <link
          href="https://stackpath.bootstrapcdn.com/bootstrap/5.3.0/css/bootstrap.min.css"
          rel="stylesheet"
          integrity="sha384-KyZXEAg3QhqLMpG8r+8fhAXLRH9Y5CSgEl3g3gSR8PAsf4eE6fj0r7sS8yXdi0lvK"
          crossOrigin="anonymous"
        />
        <script
          src="https://stackpath.bootstrapcdn.com/bootstrap/5.3.0/js/bootstrap.bundle.min.js"
          integrity="sha384-kenU1KFdBIe4zVF0s0G1M5b4hcpxyD9F7jL+FS2GkC1pDIp0yYlDAXLFq4Kk8qOX1"
          crossOrigin="anonymous"
        ></script>


        
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
