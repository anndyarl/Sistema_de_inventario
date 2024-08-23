import React, { useState, useEffect } from 'react';
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
    // Si se quiere hacer algo al autenticar, se puede añadir en useEffect
    useEffect(() => {
        if (isAuthenticated) {
            // Redirigir o hacer algo cuando el usuario esté autenticado
        }
    }, [isAuthenticated]);

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
        <div className="container">
        <h1 className="form-heading">Sistema de Inventario</h1>
        <div className="login-form">
            <div className="main-div">
                <div className="panel">
                    <p>Please enter your usuario and password</p>
                </div>
                <form id="Login" onSubmit={onSubmit}>
                    <div className="form-group">
                        <input type="text" className="form-control" id="inputusuario" name="usuario" value={usuario} placeholder="usuario" onChange={onChange} required />
                    </div>
                    <div className="form-group">
                        <input type="password" className="form-control" id="inputPassword" name="password" value={password} placeholder="Password" onChange={onChange} required />
                    </div>
                    <div className="forgot">
                        <Link to="/forgot_password" className="underlineHover">Forgot password?</Link>
                    </div>
                    <button type="submit" className="btn btn-primary">Login</button>
                </form>
            </div>
            <p className="botto-text">Designed by AndyRL</p>
        </div>
    </div>
    );
};

const mapStateToProps = (state: RootState) => ({
    isAuthenticated: state.auth.isAuthenticated,
    loading: state.auth.loading,
});

export default connect(mapStateToProps, {
    login, // Elimina buscar_unidades si no es necesario aquí
})(Login);
