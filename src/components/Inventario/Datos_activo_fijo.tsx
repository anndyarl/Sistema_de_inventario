import 'bootstrap/dist/css/bootstrap.min.css'; 
import React, { useState } from 'react';  

// Define la interfaz para el estado `data`
interface ActivoFijoData {
  nRecepcion: string;
  vidaUtil: string;
  fechaIngreso: string;
  marca: string;
  cantidad: string;
  modelo: string;
  observaciones: string;
  serie: string;
  precio: string;
}

// Define el tipo de props para el componente
interface Datos_activo_fijoProps {
  onNext: (data: ActivoFijoData) => void;
}

// Define el componente Datos_activo_fijo tipado con las props
const Datos_activo_fijo: React.FC<Datos_activo_fijoProps> = ({ onNext }) => {
  const [data, setData] = useState<ActivoFijoData>({
    nRecepcion: '',
    vidaUtil: '',
    fechaIngreso: '',
    marca: '',
    cantidad: '',
    modelo: '',
    observaciones: '',
    serie: '',
    precio: '',
  });

  const [errors, setErrors] = useState<Partial<ActivoFijoData>>({});

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setData(prevData => ({ ...prevData, [name]: value }));
  };

  const validate = () => {
    let tempErrors: Partial<ActivoFijoData> = {};
    if (!data.nRecepcion) tempErrors.nRecepcion = "N° de Recepción es obligatorio.";
    if (!/^\d+$/.test(data.nRecepcion)) tempErrors.nRecepcion = "N° de Recepción debe ser un número.";

    if (!data.vidaUtil) tempErrors.vidaUtil = "Vida útil es obligatoria.";
    if (!/^\d+$/.test(data.vidaUtil)) tempErrors.vidaUtil = "Vida útil debe ser un número.";

    if (!data.fechaIngreso) tempErrors.fechaIngreso = "Fecha de Ingreso es obligatoria.";

    if (!data.marca) tempErrors.marca = "Marca es obligatoria.";

    if (!data.cantidad) tempErrors.cantidad = "Cantidad es obligatoria.";
    if (!/^\d+$/.test(data.cantidad)) tempErrors.cantidad = "Cantidad debe ser un número.";

    if (!data.precio) tempErrors.precio = "Precio es obligatorio.";
    if (!/^\d+(\.\d{1,2})?$/.test(data.precio)) tempErrors.precio = "Precio debe ser un número válido con hasta dos decimales.";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validate()) {
      onNext(data);
    }
  };

  return (   
    <form onSubmit={handleSubmit}>
      <div className="border-top p-1 rounded shadow-sm bg-white">
        <div>
          <h3 className="form-title">Datos Activo Fijo</h3>
        </div>
        <div className="mt-4 border-top">
          <dl className="row">
            <div className="col-sm-12 col-md-6 mb-3">
              <dt className="text-muted">N° de Recepción</dt>
              <dd className="d-flex align-items-center">
                <input 
                  type="text" 
                  className={`form-control ${errors.nRecepcion ? 'is-invalid' : ''}`} 
                  name="nRecepcion" 
                  onChange={handleChange} 
                  value={data.nRecepcion}
                  
                  pattern="^\d+$"
                />
                {errors.nRecepcion && <div className="invalid-feedback m-1">{errors.nRecepcion}</div>}
              </dd>
            </div>

            <div className="col-sm-12 col-md-6 mb-3">
              <dt className="text-muted">Vida ütil</dt>
              <dd className="d-flex align-items-center">
                <input 
                  type="text" 
                  className={`form-control ${errors.vidaUtil ? 'is-invalid' : ''}`} 
                  name="vidaUtil" 
                  onChange={handleChange} 
                  value={data.vidaUtil}
                  
                  pattern="^\d+$"
                />
                {errors.vidaUtil && <div className="invalid-feedback m-1">{errors.vidaUtil}</div>}
              </dd>
            </div>

            <div className="col-sm-12 col-md-6 mb-3">
              <dt className="text-muted">Fecha Ingreso</dt>
              <dd className="d-flex align-items-center">
                <input 
                  type="date" 
                  className={`form-control ${errors.fechaIngreso ? 'is-invalid' : ''}`} 
                  name="fechaIngreso" 
                  onChange={handleChange} 
                  value={data.fechaIngreso}
                  required
                />
                {errors.fechaIngreso && <div className="invalid-feedback m-1">{errors.fechaIngreso}</div>}
              </dd>
            </div>    

            <div className="col-sm-12 col-md-6 mb-3">
              <dt className="text-muted">Marca</dt>
              <dd className="d-flex align-items-center">
                <input 
                  type="text" 
                  className={`form-control ${errors.marca ? 'is-invalid' : ''}`} 
                  name="marca" 
                  onChange={handleChange} 
                  value={data.marca}
                  required
                />
                {errors.marca && <div className="invalid-feedback m-1">{errors.marca}</div>}
              </dd>
            </div>

            <div className="col-sm-12 col-md-6 mb-3">
              <dt className="text-muted">Cantidad</dt>
              <dd className="d-flex align-items-center">
                <input 
                  type="text" 
                  className={`form-control ${errors.cantidad ? 'is-invalid' : ''}`} 
                  name="cantidad" 
                  onChange={handleChange} 
                  value={data.cantidad}
                  required
                  pattern="^\d+$"
                />
                {errors.cantidad && <div className="invalid-feedback m-1">{errors.cantidad}</div>}
              </dd>
            </div>

            <div className="col-sm-12 col-md-6 mb-3">
              <dt className="text-muted">Modelo</dt>
              <dd className="d-flex align-items-center">
                <input 
                  type="text" 
                  className="form-control" 
                  name="modelo" 
                  onChange={handleChange} 
                  value={data.modelo}
                />
              </dd>
            </div>

            <div className="col-sm-12 col-md-6 mb-3">
              <dt className="text-muted">Observaciones</dt>
              <dd className="d-flex align-items-center">
                <textarea 
                  className="form-control" 
                  rows={2} 
                  name="observaciones" 
                  onChange={handleChange} 
                  value={data.observaciones}
                />
              </dd>
            </div>

            <div className="col-sm-12 col-md-6 mb-3">
              <dt className="text-muted">Serie</dt>
              <dd className="d-flex align-items-center">
                <input 
                  type="text" 
                  className="form-control" 
                  name="serie" 
                  onChange={handleChange} 
                  value={data.serie}
                />
              </dd>
            </div>

            <div className="col-sm-12 col-md-6 mb-3">
              <dt className="text-muted">Precio</dt>
              <dd className="d-flex align-items-center">
                <input 
                  type="text" 
                  className={`form-control ${errors.precio ? 'is-invalid' : ''}`} 
                  name="precio" 
                  onChange={handleChange} 
                  value={data.precio}
                  required
                  pattern="^\d+(\.\d{1,2})?$"
                />
                {errors.precio && <div className="invalid-feedback m-1">{errors.precio}</div>}
              </dd>
            </div>
          </dl>
        </div>
      </div>
      <div className="p-1 rounded bg-white d-flex justify-content-end">              
        <button type="submit" className="btn btn-primary">Agregar y Enviar</button>                
      </div>
    </form>
  );
};

export default Datos_activo_fijo;
