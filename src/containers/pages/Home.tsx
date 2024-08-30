import React, { useEffect } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '../../redux/reducers';
import { buscar_unidades, setToken } from '../../redux/actions/auth/auth';
import Layout from '../../hooks/layout/Layout';
 

const Home: React.FC<PropsFromRedux> = ({ unidades, loading, error, token, buscarUnidades, setToken }) => {
    useEffect(() => {
        // Obtén el token desde localStorage 
        const localStorageToken = localStorage.getItem('access');
        
        if (!token && localStorageToken) {
            setToken(localStorageToken); // Configura el token en el estado global
            console.log('Token Local :', localStorageToken); // Verifica el token  en la consola
        }

        // Utiliza el estado actualizado para buscar unidades
        if (localStorageToken) {
            buscarUnidades(localStorageToken);
            console.log('Token :', localStorageToken); 
        }
    }, [buscarUnidades, setToken]);

    return (
        <Layout>
          <div className="container my-5">
            <p>Home</p>
          </div>  
        </Layout>
    );
};

const mapStateToProps = (state: RootState) => ({
    unidades: state.auth.unidades,
    loading: state.auth.loading,
    error: state.auth.error,
    token: state.auth.token, // Token del estado global
});

const mapDispatchToProps = {
    buscarUnidades: buscar_unidades,
    setToken: setToken
};

const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(Home);
