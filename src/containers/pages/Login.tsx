import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import { login, logout } from "../../redux/actions/auth/auth";
import { RootState } from "../../redux/reducers";
import "../../styles/Login.css";
// import { Spinner } from "react-bootstrap";
// import clave_unica_svg from "../../assets/img/clave_unica_color.png"
import { validaApiloginActions } from "../../redux/actions/auth/validaApiloginActions";
import { Helmet } from "react-helmet-async";
import { Button } from "react-bootstrap";
interface Props {
  login: (usuario: string, password: string) => void;
  validaApiloginActions: (rut: string) => Promise<number>;
  logout: () => void;
  isAuthenticated: boolean | null;
  error: string | null;
  isDarkMode: boolean;
}

const Login: React.FC<Props> = ({ login, validaApiloginActions, isAuthenticated, isDarkMode }) => {
  // const [formData, setFormData] = useState({
  //   usuario: process.env.VITE_USUARIO_API_LOGIN || "",
  //   password: process.env.VITE_PASSWORD_API_LOGIN || "",
  // });
  // const [loading, setLoading] = useState(false); // Estado para controlar la carga
  // const { usuario, password } = formData;
  const [showButton, setShowButton] = useState(false);
  const navigate = useNavigate(); // Hook para redirigir

  // const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
  //   setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async () => {
    // setLoading(true); // Inicia el estado de carga
    await login("test_demodoc", "2023");
    // const esValido = await validaApiloginActions("18250588");// Valida usuario en Api login Andy RIquelme
    // const esValido = await validaApiloginActions("15533835");// Valida usuario en Api login --Jaime Castillo
    const esValido = await validaApiloginActions("16739610");// Valida usuario en Api login --Jhonatan Vargas
    // const esValido = await validaApiloginActions("10399886");// Valida usuario en Api login --Gabriela Farias

    if (esValido) {
      navigate("/Inicio");
    }
    else if (esValido) {
      await logout();//Eliminados el token
      navigate("/Denegado");
    }
    // setLoading(false); // Finaliza el estado de carga después de la solicitud
  };

  useEffect(() => {
    onSubmit();
  }, []);

  useEffect(() => {
    // Temporizador para mostrar el botón después de 20 segundos
    const timer = setTimeout(() => {
      setShowButton(true);
    }, 20000);
    return () => clearTimeout(timer);
  }, []);


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

  // return (
  // <div className="d-flex justify-content-center align-items-center vh-100">
  //   <div className="border p-3 rounded-0 border-dark bg-white"
  //     style={{ width: '100%', maxWidth: '450px', height: '40%', maxHeight: '600px', minHeight: "500px" }}>

  //     {/* Elemento decorativo */}
  //     <div className="d-flex position-relative mb-3" style={{ width: "116px", left: "0px", bottom: "16px" }}>
  //       <div className="text-bg-primary  flex-grow-1" style={{ padding: "3px" }}></div>
  //       <div className="text-bg-danger flex-grow-1 w-25" style={{ padding: "3px" }}></div>
  //     </div>

  //     <img
  //       src={clave_unica_svg}
  //       alt="clave_unica_svg"
  //       width={125}
  //       className="img-fluid position-relative" style={{ bottom: "33px" }}
  //     />

  //     <h1 className="fw-bold text-center" style={{ fontFamily: '', fontWeight: "bold", fontSize: "1.60rem", color: "#575757" }}>
  //       SSMSO
  //     </h1>

  //     <form id="Login" className="text-start" onSubmit={onSubmit} >
  //       <label htmlFor="run" className="form-group group-label" style={{ fontSize: "12px" }}>Ingresa tu Run</label>
  //       <div className="form-group mb-3">
  //         <input
  //           type="text"
  //           className="form-control w-100 mx-auto m-1 border-dark rounded-0"
  //           id="inputusuario"
  //           name="usuario"
  //           value={usuario}
  //           placeholder="Ingresa tu RUN"
  //           onChange={onChange}
  //           required
  //         />
  //       </div>

  //       <label htmlFor="claveunica" className="form-group group-label" style={{ fontSize: "12px" }}>Ingresa tu ClaveÚnica</label>
  //       <div className="form-group mb-3">
  //         <input
  //           type="password"
  //           className="form-control w-100 mx-auto m-1 border-dark rounded-0"
  //           id="inputPassword"
  //           name="password"
  //           value={password}
  //           placeholder="Ingresa tu ClaveÚnica"
  //           onChange={onChange}
  //           required
  //         />
  //       </div>
  //       <p className="text-primary" style={{ fontSize: "12px" }}>
  //         <u> Recupera tu ClaveÚnica</u>
  //       </p>
  //       <p className="text-primary" style={{ fontSize: "12px" }}>
  //         <u>Solicita tu ClaveÚnica</u>
  //       </p>
  //       {/* Botón de ingresar */}
  //       <div className="form-group text-center">
  //         <button type="submit" className="btn btn-primary w-100 m-1 rounded-0" style={{ background: "#0062cc" }}>
  //           {loading ? (
  //             <>
  //               <u>INGRESANDO...</u>
  //               <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
  //             </>
  //           ) : (
  //             <u>INGRESA</u>
  //           )}
  //         </button>
  //       </div>
  //     </form>

  //     {/* Mensaje de error */}
  //     {error && (
  //       <div className="alert alert-danger text-center p-2 m-2 fs-6" role="alert">
  //         Ocurrió un error al procesar la solicitud. Si el problema persiste, por favor póngase en contacto con la mesa de ayuda.
  //       </div>
  //     )}

  //     {/* Ayuda */}
  //     <p className="text-center mt-3">
  //       <u> Ayuda al 600 360 33 03</u>
  //     </p>
  //   </div>
  // </div>
  // );
  <>
    <Helmet>
      <title>Redirigiendo...</title>
    </Helmet>
    <div className={`d-flex justify-content-center align-items-center vh-100 ${isDarkMode ? "bg-color-dark" : ""}`}>
      <div className="col-12 col-md-8 text-center">
        <div className="d-flex justify-content-center align-items-center">
          <div className="spinner-border text-primary me-2" role="status" />
          <p className={`${isDarkMode ? "text-white" : "text-muted"}`}>
            Redirigiendo, un momento
            <span className="dots-animation">...</span>
          </p>
        </div>
        {showButton && (
          <div className="m-4 rounded d-inline-block">
            <p className={`${isDarkMode ? "text-white" : "text-muted"} mb-2`}>
              El proceso está tardando más de lo esperado. Si lo prefiere, puede volver a intentarlo.
            </p>
            <Button variant={`${isDarkMode ? "secondary" : "primary"}`} onClick={() => window.location.reload()}>
              Reintentar
            </Button>
          </div>
        )}
      </div>
    </div>
  </>
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
