import React, { useEffect } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '../../redux/reducers';
import { buscar_unidades, setToken } from '../../redux/actions/auth/auth';
import Layout from '../../hooks/layout/Layout';
import Footer from '../../components/navigation/Footer';
import Sidebar from '../../components/navigation/Sidebar';


    

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
            {/* <Sidebar/> */}
            {/* <div>
                <h1>Home</h1>
                {loading && <p>Loading...</p>}
                {error && <p>Error: {error}</p>}
                <div>
                    <h2>Select Unidad</h2>
                    <select>
                        {unidades.map((unidad) => (
                            <option key={unidad.idUnidad} value={unidad.idUnidad}>
                                {unidad.nombreUnidad}
                            </option>
                        ))}
                    </select>
                </div>
            </div> */}
            
            <Footer />
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
