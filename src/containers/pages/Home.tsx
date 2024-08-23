import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import Layout from '../../hooks/layout/Layout';
import Navbar from '../../components/navigation/Navbar';
import Footer from '../../components/navigation/Footer';
import { buscar_unidades } from '../../redux/actions/auth/auth'; // Ajusta la ruta según la ubicación de tu archivo de acción
import { RootState } from '../../redux/reducers'; // Ajusta la ruta según la ubicación de tu archivo de tipos

interface Unidad {
    idUnidad: number;
    nombreUnidad: string;
}

interface HomeProps {
    unidades: Unidad[];
    loading: boolean;
    error: string | null;
    buscarUnidades: () => void;
}

const Home: React.FC<HomeProps> = ({ unidades, loading, error, buscarUnidades }) => {
    useEffect(() => {
        buscarUnidades(); // Llama a la acción cuando el componente se monte
    }, [buscarUnidades]);

    return (
        <Layout>
            <Navbar />
            {/* <div>
                <h1>Home</h1>
                {loading && <p>Loading...</p>}
                {error && <p>Error: {error}</p>}
                <ul>
                    {unidades.map((unidad) => (
                        <li key={unidad.idUnidad}>
                            {unidad.idUnidad}: {unidad.nombreUnidad}
                        </li>
                    ))}
                </ul>
            </div> */}
            <Footer />
        </Layout>
    );
};

const mapStateToProps = (state: RootState) => ({
    unidades: state.auth.unidades, // Accede a las unidades desde el estado 'auth'
    loading: state.auth.loading,
    error: state.auth.error, // Asegúrate de definir 'error' en tu estado si lo usas
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
    buscarUnidades: () => dispatch(buscar_unidades() as any), // Usa `as any` para evitar el error de tipo
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);
