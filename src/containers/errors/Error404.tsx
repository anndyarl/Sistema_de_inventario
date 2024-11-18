import React from "react"
import Layout from "../hocs/layout/Layout";
const Error404: React.FC = () => {
  return (
    <Layout>
      <div className="container d-flex justify-content-center align-items-center vh-100 fixed">
        <div className="col-12 col-md-8 rounded shadow-sm bg-white">
          <h1 className="form-heading">Página no encontrada</h1>
          <p className="form-heading fs-09em">
            Lo sentimos, la página que estás buscando no existe o ha sido movida.
          </p>
          <div className="p-4 rounded shadow-sm bg-white d-flex justify-content-center">
            <a href="/Login" className="btn btn-primary">
              Volver a Clave Única
            </a>
          </div>

        </div>
      </div>
    </Layout>
  );
};

export default Error404;
