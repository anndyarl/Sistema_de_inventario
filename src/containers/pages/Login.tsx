import React, { useState } from "react";
import { connect } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import { authActions, logout } from "../../redux/actions/auth/authActions";
import { RootState } from "../../redux/reducers";
import "../../styles/Login.css";
import { Button, Modal, Spinner } from "react-bootstrap";
import { validaApiloginActions } from "../../redux/actions/auth/validaApiloginActions";
import { loginPruebaActions } from "../../redux/actions/auth/loginPruebaActions";
import Swal from "sweetalert2";

export interface ListadoUsuarios {
  rut: string;
  nombre: string;
  iD_CREDENCIAL: number;
  establecimiento: number;
}
interface Props {
  authActions: (usuario: string, password: string) => Promise<boolean>;
  validaApiloginActions: (rut: string) => Promise<number>;
  logout: () => void;
  loginPruebaActions: () => Promise<boolean>;
  isAuthenticated: boolean | null;
  error: string | null;
  isDarkMode: boolean;
  listadoUsuarios: ListadoUsuarios[];
}

const Login: React.FC<Props> = ({ authActions, validaApiloginActions, logout, loginPruebaActions, isAuthenticated, isDarkMode, listadoUsuarios }) => {
  const [formData, setFormData] = useState({ usuario: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [mostrarListado, setMostrarListado] = useState(false);

  const navigate = useNavigate();

  // const Usuarios: ListadoUsuarios[] = [
  //   { rut: '15621643', nombre: 'Rodrigo Toledo', id: 18124, establecimiento: 1 },
  //   { rut: '13552858', nombre: 'Ivan Acevedo', id: 68321, establecimiento: 1 },
  //   { rut: '16739610', nombre: 'Jonathan Vargas', id: 6405, establecimiento: 1 },
  //   { rut: '10399886', nombre: 'Gabriela Farias', id: 888, establecimiento: 1 },
  //   { rut: '11149879', nombre: 'Nelson Quiroz', id: 21479, establecimiento: 1 },
  //   { rut: '18250588', nombre: 'Andy Riquelme', id: 62511, establecimiento: 2 },
  //   { rut: '15693379', nombre: 'Felipe Almonte', id: 18667, establecimiento: 2 },
  //   { rut: '17849831', nombre: 'Katherine Reyes', id: 66099, establecimiento: 2 },
  //   { rut: '19704000', nombre: 'Daniel Rojas', id: 66098, establecimiento: 2 },
  //   { rut: '20834661', nombre: 'Ademir Piñeda ', id: 67404, establecimiento: 2 },
  //   { rut: '20277985', nombre: 'Ignacio Aviles', id: 67234, establecimiento: 2 },
  //   { rut: '15533835', nombre: 'Jaime Castillo', id: 1770, establecimiento: 3 },
  //   { rut: '21067565', nombre: 'Benjamin Bulboa', id: 6601, establecimiento: 3 }

  // ];

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      //Acceso para obtener token
      const resultado = await authActions(formData.usuario, formData.password);
      if (resultado) {
        //Lista usuario de prueba
        const ListaLogin = await loginPruebaActions();
        if (ListaLogin) {
          setLoading(false);
          setMostrarListado(resultado);
        } else {
          Swal.fire({
            icon: "error",
            title: "Error al cargar",
            text: "No se pudo obtener el listado de usuarios",
            background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
            color: `${isDarkMode ? "#ffffff" : "000000"}`,
            confirmButtonColor: `${isDarkMode ? "#6c757d" : "#0d6efd"}`,
            customClass: {
              popup: "custom-border", // Clase personalizada para el borde
            }
          });
          setLoading(false);
          setMostrarListado(false);
          return;
        }
      }
      else {
        Swal.fire({
          icon: "error",
          title: "Error de acceso",
          text: "EL usuario o la contraseña son incorrectos. / o el servidor no responde",
          background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
          color: `${isDarkMode ? "#ffffff" : "000000"}`,
          confirmButtonColor: `${isDarkMode ? "#6c757d" : "#0d6efd"}`,
          customClass: {
            popup: "custom-border", // Clase personalizada para el borde
          }
        });
        setLoading(false);
        return;
      }
    } catch (error) {
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

  if (isAuthenticated) {
    return <Navigate to="/Inicio" />;
  }

  return (
    <div
      className={`d-flex justify-content-center align-items-center min-vh-100 px-2 ${isDarkMode ? "bg-color-dark" : "bg-light"}`}
    >
      <div
        className={`border p-3 p-md-4 rounded-0 w-100 
    ${isDarkMode ? "text-white bg-color-dark" : "bg-light border-dark"}`}
        style={{
          maxWidth: "450px"
        }}
      >
        {/* Elemento decorativo */}
        <div className="d-flex position-relative mb-3" style={{ width: "116px" }}>
          <div className="text-bg-primary flex-grow-1" style={{ padding: "3px" }} />
          <div className="text-bg-danger flex-grow-1 w-25" style={{ padding: "3px" }} />
        </div>

        <h1
          className="fw-bold text-center mb-3"
          style={{ color: "#575757", fontSize: "1.6rem" }}
        >
          SSMSO
        </h1>

        <form id="Login" className="text-start" onSubmit={onSubmit}>
          <label htmlFor="usuario" className="small">
            Ingresar usuario
          </label>
          <input
            type="text"
            className="form-control w-100 mx-auto mb-2 border-dark rounded-0"
            id="usuario"
            name="usuario"
            value={formData.usuario}
            placeholder="Usuario"
            onChange={onChange}
            required
          />

          <label htmlFor="password" className="small">
            Ingresar contraseña
          </label>
          <input
            type="password"
            className="form-control w-100 mx-auto mb-3 border-dark rounded-0"
            id="password"
            name="password"
            value={formData.password}
            placeholder="*******"
            onChange={onChange}
            required
          />

          <div className="text-center">
            <button
              type="submit"
              className="btn btn-primary w-100 rounded-0 py-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <u>INGRESANDO...</u>{" "}
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                </>
              ) : (
                <u>INGRESA</u>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Modal usuarios */}
      <Modal show={mostrarListado} onHide={() => setMostrarListado(false)} size="lg" centered>
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
                  <th>ID</th>
                  <th>Establecimiento</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {listadoUsuarios.length > 0 ? (
                  listadoUsuarios.map((item, index) => (
                    <tr key={index}>
                      <td>{item.rut || "N/A"}</td>
                      <td>{item.nombre || "N/A"}</td>
                      <td>{item.iD_CREDENCIAL || "N/A"}</td>
                      <td>
                        {item.establecimiento === 1
                          ? "SSMSO"
                          : item.establecimiento === 2
                            ? "CASR"
                            : item.establecimiento === 3
                              ? "HSJM"
                              : "Sin información"}
                      </td>
                      <td className="text-end">
                        <Button
                          variant="outline-primary"
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
                    <td colSpan={5} className="text-center">
                      No hay registros
                    </td>
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
  listadoUsuarios: state.loginPruebaReducers.listadoUsuarios
});

export default connect(mapStateToProps, {
  authActions,
  validaApiloginActions,
  logout,
  loginPruebaActions
})(Login);
