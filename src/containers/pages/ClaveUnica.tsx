// ClaveUnica.tsx
import React, { useEffect } from "react";
import { useAppDispatch } from "../../redux/hook";
import { loginClaveUnica } from "../../redux/actions/auth/auth";
import { DatosPersona } from "../../redux/interfaces"; // Importa la interfaz
import { connect } from "react-redux";
import { RootState } from "../../redux/reducers"; // Asegúrate de tener este tipo definido correctamente
import { Navigate } from "react-router-dom";
import { Button } from "react-bootstrap";

interface Props {
  isAuthenticated: boolean | null;
}

const ClaveUnica: React.FC<Props> = ({ isAuthenticated }) => {
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
  console.log("isAuthenticated", isAuthenticated);
  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="col-12 col-md-8 border p-4 rounded shadow-sm bg-white">
        <h1 className="form-heading">Sistema de Inventario</h1>
        <p className="form-heading fs-09em">
          Sistema de apoyo en la gestión administrativa, Servicio de Salud
          Metropolitano Sur Oriente Departamento de Informática Unidad de
          Desarrollo 2024
        </p>
        <div className="p-4 rounded shadow-sm bg-white d-flex justify-content-center">
          {/**Producciòn */}
          {/* <a
                         href="/claveunica"
                        className="btn btn-primary"
                    >
                        Clave Única
                    </a> */}

          {/**Desarrollo */}
          {/* <Button onClick={handleEnviar}  type="submit" className="btn btn-primary text-center me-2">Clave Unica </Button> */}

          {/**Prueba */}
          <a href="/Login" className="btn btn-primary">
            Clave Única
          </a>
        </div>
        <p className="botto-text">
          Diseñado por Departamento de Informática - Unidad de Desarrollo 2024
        </p>
      </div>
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  isAuthenticated: state.loginReducer.isAuthenticated,
});

export default connect(mapStateToProps, {
  loginClaveUnica,
})(ClaveUnica);
