import React, { useState } from "react";
import { connect } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import { login, logout } from "../../redux/actions/auth/auth";
import { RootState } from "../../redux/reducers";
import "../../styles/Login.css";
import { Button, Modal, Spinner } from "react-bootstrap";
import { validaApiloginActions } from "../../redux/actions/auth/validaApiloginActions";

interface NavItem {
  rut: string;
  nombre: string;
  id: number;
  establecimiento: number;
}

interface Props {
  login: (usuario: string, password: string) => Promise<boolean>;
  validaApiloginActions: (rut: string) => Promise<number>;
  logout: () => void;
  isAuthenticated: boolean | null;
  error: string | null;
  isDarkMode: boolean;
}

const Login: React.FC<Props> = ({ login, validaApiloginActions, isAuthenticated, isDarkMode, logout }) => {
  const [formData, setFormData] = useState({ usuario: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [mostrarListado, setMostrarListado] = useState(false);
  const navigate = useNavigate();

  const Usuarios: NavItem[] = [
    { rut: '18250588', nombre: 'Andy Riquelme', id: 62511, establecimiento: 2 },
    { rut: '15533835', nombre: 'Jaime Castillo', id: 1770, establecimiento: 3 },
    { rut: '16739610', nombre: 'Jhonatan Vargas', id: 6405, establecimiento: 1 },
    { rut: '10399886', nombre: 'Gabriela Farias', id: 888, establecimiento: 1 },
    { rut: '15693379', nombre: 'Felipe Almonte', id: 18667, establecimiento: 2 },
    { rut: '17849831', nombre: 'Katherine Reyes', id: 66099, establecimiento: 2 },
    { rut: '19704000', nombre: 'Daniel Rojas', id: 66098, establecimiento: 2 }
  ];

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const resultado = await login(formData.usuario, formData.password);
      setLoading(false);
      setMostrarListado(resultado);
    } catch (error) {
      console.error("Error al intentar iniciar sesión:", error);
      setLoading(false);
    }
  };

  const handleIngresar = async (rut: string) => {
    try {
      const esValido = await validaApiloginActions(rut);
      if (esValido) {
        navigate("/Inicio");
      } else {
        await logout();
        navigate("/Denegado");
      }
    } catch (error) {
      console.error("Error validando usuario:", error);
      await logout();
      navigate("/Denegado");
    }
  };

  if (isAuthenticated) return <Navigate to="/Inicio" />;

  return (
    <div className={`d-flex justify-content-center align-items-center vh-100 ${isDarkMode ? "bg-color-dark" : "bg-light"}`}>
      <div className={`border p-3 rounded-0  ${isDarkMode ? "text-white bg-color-dark" : "bg-light border-dark"}`} style={{ width: '100%', maxWidth: '450px', height: '40%', maxHeight: '600px', minHeight: "200px" }}>

        {/* Elemento decorativo */}
        <div className="d-flex position-relative mb-3" style={{ width: "116px", left: "0px", bottom: "16px" }}>
          <div className="text-bg-primary flex-grow-1" style={{ padding: "3px" }}></div>
          <div className="text-bg-danger flex-grow-1 w-25" style={{ padding: "3px" }}></div>
        </div>
        <h1 className="fw-bold text-center" style={{ color: "#575757", fontSize: "1.6rem" }}>SSMSO</h1>

        <form id="Login" className="text-start" onSubmit={onSubmit}>
          <label htmlFor="usuario" style={{ fontSize: "12px" }}>Ingresa tu RUN</label>
          <input
            type="text"
            className="form-control w-100 mx-auto m-1 border-dark rounded-0"
            id="usuario"
            name="usuario"
            value={formData.usuario}
            placeholder="Usuario"
            onChange={onChange}
            required
          />

          <label htmlFor="password" style={{ fontSize: "12px" }}>Ingresa Contraseña</label>
          <input
            type="password"
            className="form-control w-100 mx-auto m-1 border-dark rounded-0"
            id="password"
            name="password"
            value={formData.password}
            placeholder="*******"
            onChange={onChange}
            required
          />

          <div className="form-group text-center">
            <button type="submit" className="btn btn-primary w-100 m-1 rounded-0" disabled={loading}>
              {loading ? (
                <>
                  <u>INGRESANDO...</u> <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                </>
              ) : (
                <u>INGRESA</u>
              )}
            </button>
          </div>
        </form>
      </div>

      <Modal show={mostrarListado} onHide={() => setMostrarListado(false)} size="lg">
        <Modal.Header className={isDarkMode ? "darkModePrincipal" : ""} closeButton>
          <Modal.Title className="fw-semibold">Seleccione un usuario</Modal.Title>
        </Modal.Header>
        <Modal.Body className={isDarkMode ? "darkModePrincipal" : ""}>
          <div className="table-responsive">
            <table className={`table ${isDarkMode ? "table-dark" : "table-hover table-striped"}`}>
              <thead>
                <tr>
                  <th>RUT</th>
                  <th>Nombre</th>
                  <th>Id Credencial</th>
                  <th>Establecimiento</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {Usuarios.length > 0 ? (
                  Usuarios.map((item, index) => (
                    <tr key={index}>
                      <td>{item.rut || 'N/A'}</td>
                      <td>{item.nombre || 'N/A'}</td>
                      <td>{item.id || 'N/A'}</td>
                      <td>{item.establecimiento === 1 ? "SSMSO"
                        : item.establecimiento === 2 ? "CASR"
                          : item.establecimiento === 3 ? "SJM" : "Sin Información"}</td>
                      <td>
                        <Button
                          variant="outline-primary"
                          className="fw-semibold"
                          size="sm"
                          onClick={() => handleIngresar(item.rut)}
                        >
                          Ingresar
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="text-center">No hay registros</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  isAuthenticated: state.validaApiLoginReducers.isAuthenticated,
  error: state.loginReducer.error,
  isDarkMode: state.darkModeReducer.isDarkMode,
});

export default connect(mapStateToProps, {
  login,
  validaApiloginActions,
  logout
})(Login);
