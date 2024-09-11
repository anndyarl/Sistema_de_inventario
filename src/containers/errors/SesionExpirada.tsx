import React from "react"
const SesionExpirada: React.FC = () => {
    return (
          <div className="container d-flex justify-content-center align-items-center vh-100 fixed">
            <div className="col-12 col-md-8 border p-4 rounded shadow-sm bg-white">
              <h1 className="form-heading">Sesión expirada</h1>
              <p className="form-heading fs-09em">
                No está autenticado. Por favor, inicie sesión nuevamente.
              </p>
              <div className="p-4 rounded shadow-sm bg-white d-flex justify-content-center">
                <a href="/Login" className="btn btn-primary">
                  Clave Única
                </a>
              </div>
              <p className="botto-text">Diseñado por Departamento de Informática - Unidad de Desarrollo 2024</p>
            </div>
          </div>
    );
};

export default SesionExpirada;
