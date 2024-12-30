// ClaveUnica.tsx
import React from "react";
import { loginClaveUnica } from "../../redux/actions/auth/auth";
import { DatosPersona } from "../../redux/interfaces"; // Importa la interfaz
import { connect } from "react-redux";
import { RootState } from "../../redux/reducers"; // Asegúrate de tener este tipo definido correctamente
import { Navigate } from "react-router-dom";
import { useAppDispatch } from "../../hooks/hook";
import ssmso_background from "../../assets/img/ssmso_imagen.png";
import ssmso_logo from "../../assets/img/SSMSO-LOGO.png"
import ondas from "../../assets/img/ondas.png"
interface Props {
  isAuthenticated: boolean | null;
  isDarkMode: boolean;
}

const ClaveUnica: React.FC<Props> = ({ isAuthenticated, isDarkMode }) => {
  const dispatch = useAppDispatch();

  const handleEnviar = () => {
    const params = new URLSearchParams(window.location.search);

    /*rut = "12870560";*/
    /*rut = "12585045";*/
    //rut = "15621643";
    //rut = "14197140";
    //rut = "17489749";

    // const rut = params.get('14197140');

    // Define el objeto `datosPersona` con el formato adecuado
    const datosPersona: DatosPersona = {
      RolUnico: { DV: "0", numero: "14197140", tipo: "RUN" },
      sub: "2253944",
      name: {
        apellidos: ["Jaque", "Garcia"],
        nombres: ["Margarita", "Andrea"],
      },
    };

    if (datosPersona) {
      dispatch(loginClaveUnica(datosPersona));
    } else {
      console.error("Datos de la persona no encontrados", datosPersona);
    }
  };

  if (isAuthenticated) {
    return <Navigate to="/Inicio" />;
  }
  return (
    // <div classNameNameName="container d-flex justify-content-center align-items-center vh-100">
    //   <div classNameNameName="col-12 col-md-8 border p-4 rounded shadow-sm bg-white">
    //     <h1 classNameNameName="form-heading">Sistema de Inventario</h1>
    //     <p classNameNameName="form-heading fs-09em">
    //       Sistema de apoyo en la gestión administrativa, Servicio de Salud
    //       Metropolitano Sur Oriente Departamento de Informática Unidad de
    //       Desarrollo 2024
    //     </p>
    //     <div classNameNameName="p-4 rounded shadow-sm bg-white d-flex justify-content-center">
    //       {/**Producciòn */}
    //       {/* <a
    //                      href="/claveunica"
    //                     classNameNameName="btn btn-primary"
    //                 >
    //                     Clave Única
    //                 </a> */}

    //       {/**Desarrollo */}
    // {/* <Button onClick={handleEnviar}  type="submit" classNameNameName="btn btn-primary text-center me-2">Clave Unica </Button> */}

    //       {/**Prueba */}
    //       <a href="/Login" classNameNameName="btn btn-primary">
    //         Clave Única
    //       </a>
    //     </div>
    //     <p classNameNameName="botto-text">
    //       Diseñado por Departamento de Informática - Unidad de Desarrollo 2024
    //     </p>
    //   </div>
    // </div>


    <section className={`vh-100 ${isDarkMode ? "darkModePrincipal" : ""}`}>
      <div className="container-fluid">
        <div className="row">
          <div className="col-sm-6 row align-content-around">
            <div>
              <div className="d-flex justify-content-center">
                <img
                  src={ssmso_logo}
                  alt="SSMSO-LOGO"
                  width={200}
                  className="img-fluid"
                />
              </div>
              <h3 className="border-bottom text-center"> Sistema de apoyo en la gestión administrativa</h3>
              <p className="fs-09em mb-1">
                Servicio de Salud Metropolitano Sur Oriente
              </p>
              <div className="text-center">
                <a href="/Login"
                  className={`btn ${isDarkMode ? "btn-secondary" : "btn-primary"}`}>
                  Clave Única demo
                </a>
              </div>
              {/* <div className="mb-4 text-center">
                  <a
                    href="/claveunica"
                    className={`btn ${isDarkMode ? "btn-secondary" : "btn-primary"}`}>
                    Clave Única
                  </a>
                </div> */}
            </div>
            <div>
              <p className="text-center fs-xs ">
                Diseñado por el Departamento de Informática | Unidad de Desarrollo 2025
              </p>
            </div>

          </div>
          <div className="col-sm-6 px-0 d-none d-sm-block">
            <div className="d-flex position-absolute mx-5 w-25">
              <div className="text-bg-primary p-1 flex-grow-1"></div>
              <div className="text-bg-danger p-1 flex-grow-1 w-25"></div>
            </div>
            <div className={` ${isDarkMode ? "bg-color-dark" : "bg-color"} position-values-1`}>
              <img
                src={ondas}
                alt="ondas"
                width={200}
                className="img-fluid"
              />
            </div>
            <div className={`w-100 vh-100 ${isDarkMode ? "bg-color-dark" : "bg-color"} d-flex justify-content-center align-items-center`}>
              <img
                src={ssmso_background}
                alt="SSMSO"
                width={280}
                className="img-fluid position-absolute z-1"
              />
            </div>
            <div className={` ${isDarkMode ? "bg-color-dark" : "bg-color"} position-values-2`}>
              <img
                src={ondas}
                alt="ondas"
                width={200}
                className="img-fluid"
              />
            </div>

          </div>
        </div>
      </div>
    </section>


  );
};

const mapStateToProps = (state: RootState) => ({
  isAuthenticated: state.loginReducer.isAuthenticated,
  isDarkMode: state.darkModeReducer.isDarkMode
});

export default connect(mapStateToProps, {
  loginClaveUnica,
})(ClaveUnica);
