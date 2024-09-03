import React, { useState} from 'react';
import { connect } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { login } from '../../redux/actions/auth/auth'; // Elimina buscar_unidades si no se usa aquí
import { RootState } from '../../redux/reducers'; // Asegúrate de tener este tipo definido correctamente
import '../../styles/Login.css';

interface Props {
    login: (usuario: string, password: string) => void;
    isAuthenticated: boolean | null;   
}

const Login: React.FC<Props> = ({ login, isAuthenticated }) => {
   
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

        <div className="container d-flex justify-content-center align-items-center vh-100 ">
            <div className="col-12 col-md-8 border p-4 rounded shadow-sm bg-white">
                <h1 className="form-heading">Sistema de Inventario</h1>
                <p className="form-heading fs-09em">
                    Sistema de apoyo en la gestión administrativa, Servicio de Salud Metropolitano Sur Oriente 
                    Departamento de Informática Unidad de Desarrollo 2020
                </p>
                <form id="Login" className='text-center' onSubmit={onSubmit}>
                    <div className="form-group ">
                        <input type="text" className="form-control" id="inputusuario" name="usuario" value={usuario} placeholder="usuario" onChange={onChange} required />
                    </div>
                    <div className="form-group">
                        <input type="password" className="form-control" id="inputPassword" name="password" value={password} placeholder="Password" onChange={onChange} required />
                    </div>
                    {/* <div className="forgot">
                        <Link to="/forgot_password" className="underlineHover">Forgot password?</Link>
                    </div> */}
                    <button type="submit" className="btn btn-primary text-center">Ingresar</button>
                </form>
                <p className="botto-text">Diseñado por Departamento de Informática - Unidad de Desarrollo 2024</p>
            </div>
        </div>
      
  
    );
};

const mapStateToProps = (state: RootState) => ({
    isAuthenticated: state.auth.isAuthenticated,   
});

export default connect(mapStateToProps, {
    login, 
})(Login);