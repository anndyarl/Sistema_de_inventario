import React, { useState} from 'react';
import { connect } from 'react-redux';
import { Link, Navigate } from 'react-router-dom';
import { login } from '../../redux/actions/auth/auth'; // Elimina buscar_unidades si no se usa aquí
import { RootState } from '../../redux/reducers'; // Asegúrate de tener este tipo definido correctamente
import '../../styles/Login.css';

interface Props {
    login: (usuario: string, password: string) => void;
    isAuthenticated: boolean | null;
    loading: boolean;
}

const Login: React.FC<Props> = ({ login, isAuthenticated, loading }) => {
   
    const [formData, setFormData] = useState({
        usuario: '',
        password: '',
    });

    const { usuario, password } = formData;

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => 
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        login(usuario, password);
    };

    if (isAuthenticated) {
        return <Navigate to='/Home' />;
    }

    return (        
        <div className="container d-flex justify-content-center align-items-center min-v0">
            <div className="col-12 col-md-8 border p-4 rounded shadow-sm bg-white">
                <h1 className="form-heading">Sistema de Inventario</h1>
                <p className="form-heading fs-09em">
                    Sistema de apoyo en la gestión administrativa, Servicio de Salud Metropolitano Sur Oriente 
                    Departamento de Informática Unidad de Desarrollo 2020
                </p>
                <div className="p-4 rounded shadow-sm bg-white d-flex justify-content-center">
                    <a href="https://sidra.ssmso.cl/wcf_claveunica/?url_solicitud=https://sidra.ssmso.cl/api_erp_inv_qa/api/claveunica/validarportal/" className="btn btn-primary">
                        Clave Única
                    </a>
                </div>
                <p className="botto-text">Diseñado por Departamento de Informática - Unidad de Desarrollo 2024</p>
            </div>
        </div>
      
    );
};

const mapStateToProps = (state: RootState) => ({
    isAuthenticated: state.auth.isAuthenticated,
    loading: state.auth.loading,
});

export default connect(mapStateToProps, {
    login, 
})(Login);
