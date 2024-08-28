import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../../redux/reducers"; // Asegúrate de ajustar la ruta al archivo donde defines RootState
import 'bootstrap/dist/css/bootstrap.min.css'; // Importa Bootstrap si no lo has hecho ya

// Define una interfaz para las props que el componente podría recibir
interface Datos_cuentaProps extends PropsFromRedux {}

// Define el componente Sidebar tipado con las props
const Datos_cuenta: React.FC<Datos_cuentaProps> = () => {
     return (            
       <div className="container my-5">
    <div className="border p-4 rounded shadow-sm bg-white">
      <div>
        <h3 className="form-title">Datos Cuenta</h3>
        {/* <p className="form-subtitle">Detalles personales y aplicación.</p> */}
      </div>
      <div className="mt-4 border-top">
        <dl className="row">

          <div className="col-sm-12 col-md-6 mb-3">
            <dt className="text-muted">Servicio</dt>
            <dd className="d-flex align-items-center">
              <select className="form-select">
                <option value="backend">Backend Developer</option>
                <option value="frontend">Frontend Developer</option>
                <option value="fullstack">Full Stack Developer</option>
              </select>
            </dd>
          </div>    

         <div className="col-sm-12 col-md-6 mb-3">
            <dt className="text-muted">Dependencia</dt>
            <dd className="d-flex align-items-center">
              <select className="form-select">
                <option value="backend">Backend Developer</option>
                <option value="frontend">Frontend Developer</option>
                <option value="fullstack">Full Stack Developer</option>
              </select>
            </dd>
          </div>    

          <div className="col-sm-12 col-md-6 mb-3">
          <dt className="text-muted">Especie</dt>
          <dd className="d-flex align-items-center">
            <input type="file" className="form-control" />
          </dd>
        </div>  

          <div className="col-sm-12 col-md-6 mb-3">
            <dt className="text-muted">Cuenta</dt>
            <dd className="d-flex align-items-center">
              <select className="form-select">
                <option value="backend">Backend Developer</option>
                <option value="frontend">Frontend Developer</option>
                <option value="fullstack">Full Stack Developer</option>
              </select>
            </dd>
          </div>         
        
        </dl>
      </div>
    </div>
  </div>
  

    );
};

// Mapea el estado al componente (en este caso vacío)
const mapStateToProps = (state: RootState) => ({});

// Si tienes funciones que quieres mapear, las añades aquí
const mapDispatchToProps = {};

// Conecta el componente a Redux y tipa las props correctamente
const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(Datos_cuenta);
