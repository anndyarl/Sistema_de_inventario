import 'bootstrap/dist/css/bootstrap.min.css'; 
import React, { useState, useEffect } from 'react';
// Define el tipo de los datos que se manejarán en el componente
interface Data {
  nRecepcion: string;
  fechaRecepcion: string;
  nOrdenCompra: string;
  horaRecepcion: string;
  nFactura: string;
  origenPresupuesto: string;
  montoRecepcion: string;
  fechaFactura: string;
  rutProveedor: string;
  nombreProvedor: string;
}

// Define el tipo de los elementos del combo `origenPresupuesto`
interface OrigenPresupuesto {
  codigo: string;
  descripcion: string;
}

// Define el tipo de props para el componente
interface Datos_inventarioProps {
  onNext: (data: Data) => void; // Cambia 'any' por el tipo específico 'Data'
  comboTraeOrigen: (token: string) => Promise<OrigenPresupuesto[]>; // Cambia el tipo según el retorno esperado
  
}

// Define el componente `Datos_inventario` tipado con las props
const Datos_inventario: React.FC<Datos_inventarioProps> = ({ onNext, comboTraeOrigen }) => {
  const [data, setData] = useState<Data>({
    nRecepcion: '',
    fechaRecepcion: '',
    nOrdenCompra: '',
    horaRecepcion: '',
    nFactura: '',
    origenPresupuesto: '',
    montoRecepcion: '',
    fechaFactura: '',
    rutProveedor: '',
    nombreProvedor: '',
  });

  const [origenes, setOrigenes] = useState<OrigenPresupuesto[]>([]); // Estado para guardar los datos de origenes

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onNext(data);
  };

  useEffect(() => {
    // Obtén el token desde localStorage 
    const localStorageToken = localStorage.getItem('access');

    // Llama a comboTraeOrigen con el token y actualiza el estado con los resultados
    if (localStorageToken) {
      comboTraeOrigen(localStorageToken).then((origenesData) => {
        setOrigenes(origenesData); // Actualiza el estado con los datos recibidos
        console.log('Token :', localStorageToken); 
      });
    }
  }, [comboTraeOrigen]);
   

     return (   
          <form onSubmit={handleSubmit}>
            <div className="border-top p-1 rounded shadow-sm bg-white">
              <div>
                <h3 className="form-title">Datos Inventario</h3> {/*
                <p className="form-subtitle">Detalles personales y aplicación.</p> */}
              </div>
              <div className="mt-4 border-top">
                <dl className="row">
          
                  <div className="col-sm-12 col-md-6 mb-3">
                    <dt className="text-muted">N° de Recepción</dt>
                    <dd className="d-flex align-items-center">
                      <input type="text" className="form-control" name="nRecepcion" onChange={handleChange} value={data.nRecepcion}/>
                    </dd>
                  </div>
          
                  <div className="col-sm-12 col-md-6 mb-3">
                    <dt className="text-muted">Fecha de Recepción</dt>
                    <dd className="d-flex align-items-center">
                      <input type="date" className="form-control" name="fechaRecepcion" onChange={handleChange} value={data.fechaRecepcion}/>
                    </dd>
                  </div>
          
                  <div className="col-sm-12 col-md-6 mb-3">
                    <dt className="text-muted">N° Orden de Compra</dt>
                    <dd className="d-flex align-items-center">
                      <input type="text" className="form-control" name="nOrdenCompra" onChange={handleChange} value={data.nOrdenCompra} />
                    </dd>
                  </div>
          
                  <div className="col-sm-12 col-md-6 mb-3">
                    <dt className="text-muted">Hora Recepción</dt>
                    <dd className="d-flex align-items-center">
                      <input type="text" className="form-control" name="horaRecepcion" onChange={handleChange} value={data.horaRecepcion}/>
                    </dd>
                  </div>
          
                  <div className="col-sm-12 col-md-6 mb-3">
                    <dt className="text-muted">N° Factura</dt>
                    <dd className="d-flex align-items-center">
                      <input type="text" className="form-control" name="nFactura" onChange={handleChange} value={data.nFactura}/>
                    </dd>
                  </div>
          
                  <div className="col-sm-12 col-md-6 mb-3">
                  <dt className="text-muted">Origen Presupuesto</dt>
                  <dd className="d-flex align-items-center">
                    <select className="form-select" name="origenPresupuesto" onChange={handleChange}>
                      <option value="">Seleccione un origen</option> {/* Opción por defecto */}
                      {origenes.map((origen) => (
                        <option key={origen.codigo} value={origen.codigo}>
                          {origen.descripcion} {/* Muestra el nombre del origen */}
                        </option>
                      ))}
                    </select>
                  </dd>
                </div> 
          
                  <div className="col-sm-12 col-md-6 mb-3">
                    <dt className="text-muted">Monto Recepción</dt>
                    <dd className="d-flex align-items-center">
                      <input type="text" className="form-control" name="montoRecepcion" onChange={handleChange} value={data.montoRecepcion}/>
                    </dd>
                  </div>
          
                  <div className="col-sm-12 col-md-6 mb-3">
                    <dt className="text-muted">Fecha factura</dt>
                    <dd className="d-flex align-items-center">
                      <input type="date" className="form-control" name="fechaFactura" onChange={handleChange} value={data.fechaFactura}/>
                    </dd>
                  </div>
          
                  <div className="col-sm-12 col-md-6 mb-3">
                    <dt className="text-muted">Rut Proveedor</dt>
                    <dd className="d-flex align-items-center">
                      <input type="text" className="form-control" name="rutProveedor" onChange={handleChange} value={data.rutProveedor}/>
                    </dd>
                  </div>
                  <div className="col-sm-12 col-md-6 mb-3">
                    <dt className="text-muted">Nombre Proveedor</dt>
                    <dd className="d-flex align-items-center">
                      <input type="text" className="form-control" name="nombreProvedor" onChange={handleChange} value={data.nombreProvedor}/>
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
            <div className="p-1 rounded bg-white d-flex justify-content-end ">              
                <button type="submit" className="btn btn-primary ">Siguiente</button>                
            </div>
          </form>      
    );
};


export default Datos_inventario;