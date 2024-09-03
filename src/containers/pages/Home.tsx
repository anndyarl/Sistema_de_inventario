// import React, { useEffect } from 'react';
// import { connect, ConnectedProps } from 'react-redux';
// import { RootState } from '../../redux/reducers';
import Layout from '../../hooks/layout/Layout';
// import { setToken } from '../../redux/actions/auth/auth'; // Asegúrate de que la acción esté importada correctamente
 


const Home: React.FC = ({}) => {
   
  // useEffect(() => {
  //   // Obtén el token desde localStorage 
  //   const localStorageToken = localStorage.getItem('access');
    
  //   if (!token && localStorageToken) {
  //     setToken(localStorageToken); // Configura el token en el estado global
  //     console.log('Token Local :', localStorageToken); // Verifica el token en la consola
  //   }
    
  // }, [token, setToken]); // Asegúrate de incluir 'token' en las dependencias para evitar advertencias de dependencias faltantes

    return (
        <Layout>
          <div className="container my-5">
            <p>Home</p>
          </div>  
        </Layout>
    );
};

export default Home;