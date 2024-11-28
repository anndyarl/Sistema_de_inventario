import React, { useState } from "react";
import { connect } from "react-redux";
import { Navigate } from "react-router-dom";
import { login } from "../../redux/actions/auth/auth";
import { RootState } from "../../redux/reducers";
import "../../styles/Login.css";
import { Spinner } from "react-bootstrap";

interface Props {
  login: (usuario: string, password: string) => void;
  isAuthenticated: boolean | null;
  error: string | null;
}

const Login: React.FC<Props> = ({ login, isAuthenticated, error }) => {
  const [formData, setFormData] = useState({
    usuario: "",
    password: "",
  });
  const [loading, setLoading] = useState(false); // Estado para controlar la carga

  const { usuario, password } = formData;

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); // Inicia el estado de carga
    await login(usuario, password);

    setLoading(false); // Finaliza el estado de carga después de la solicitud
  };

  if (isAuthenticated) {
    return <Navigate to="/Inicio" />;
  }

  // const [submitCount, setSubmitCount] = useState(0); // Estado para contar ejecuciones

  // useEffect(() => {
  //     if (error) {
  //         const handleAutoSubmit = async () => {
  //             setLoading(true);
  //             await login(usuario, password);
  //             setLoading(false);
  //         };

  //         handleAutoSubmit();

  //         // Incrementar el contador cada vez que se ejecuta el useEffect
  //         setSubmitCount((prevCount) => prevCount + 1);
  //         console.log("Error detectado", error);
  //     }
  // }, [error]); // Ejecuta la lógica cuando ocurre un error

  // useEffect(() => {
  //     console.log("El useEffect se ha ejecutado", submitCount, "veces.");
  // }, [submitCount]); // Mostrar cuántas veces se ha ejecutado el useEffect

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100 ">
      <div className="col-12 col-md-5 border p-4 rounded shadow-sm bg-white">
        <h1 className="form-heading">Clave única demo</h1>
        <p className="form-heading fs-09em">
          Sistema de apoyo en la gestión administrativa, Servicio de Salud
          Metropolitano Sur Oriente Departamento de Informática Unidad de
          Desarrollo 2024
        </p>
        <form
          id="Login"
          className="text-center mx-auto"
          onSubmit={onSubmit}
          style={{ maxWidth: "300px" }}
        >
          <div className="form-group ">
            <input
              type="text"
              className="form-control w-100 mx-auto m-1"
              id="inputusuario"
              name="usuario"
              value={usuario}
              placeholder="usuario"
              onChange={onChange}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              className="form-control w-100 mx-auto m-1"
              id="inputPassword"
              name="password"
              value={password}
              placeholder="Password"
              onChange={onChange}
              required
            />
          </div>

          {/* <div className="forgot">
                        <Link to="/forgot_password" className="underlineHover">Forgot password?</Link>
                    </div> */}
          <button type="submit" className="btn btn-primary text-center m-1">
            {loading ? (
              <>
                {" "}
                {" Ingresando..."}{" "}
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />{" "}
              </>
            ) : (
              "Ingresar"
            )}{" "}
          </button>
        </form>
        {error ? (
          <div
            className="alert alert-danger text-center p-2 m-2 fs-05em "
            role="alert"
          >
            Ocurrió un error al procesar la solicitud. Si el problema persiste,
            por favor pongase en contacto con la mesa de ayuda
          </div>
        ) : (
          <> </>
        )}

        <p className="botto-text">
          Diseñado por Departamento de Informática - Unidad de Desarrollo 2024
        </p>
      </div>
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  isAuthenticated: state.loginReducer.isAuthenticated,
  error: state.loginReducer.error,
});

export default connect(mapStateToProps, {
  login,
})(Login);
