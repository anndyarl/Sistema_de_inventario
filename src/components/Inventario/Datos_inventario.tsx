import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';

//importacion de objetos desde actions de redux
import { 
  setNRecepcion,
  setFechaRecepcion,
  setNOrdenCompra,
  // setHoraRecepcion,
  setNFactura,
  setOrigenPresupuesto,
  setMontoRecepcion,
  setFechaFactura,
  setRutProveedor,
  setnombreProveedor,
  setModalidadCompra
 } from '../../redux/actions/Inventario/Datos_inventariosActions'; 
import { RootState } from '../../store';

// Define el tipo de los elementos del combo `OrigenPresupuesto`
export interface OrigenPresupuesto {
  codigo: string;
  descripcion: string;
}

// Define el tipo de los elementos del combo `ModalidadCompra`
export interface ModalidadCompra {
  codigo: string;
  descripcion: string;
}
// Define el tipo de los datos que se manejarán en el componente
export interface InventarioProps {
  nRecepcion: string;
  fechaRecepcion: string;
  nOrdenCompra: string;
  // horaRecepcion: string;
  nFactura: string;
  origenPresupuesto: string;
  montoRecepcion: string;
  fechaFactura: string;
  rutProveedor: string;
  nombreProveedor: string;
  modalidadCompra: string;
}

// Define el tipo de props para el componente, extendiendo InventarioProps
interface Datos_inventarioProps extends InventarioProps {
  onNext: (data: InventarioProps) => void;
  origenes: OrigenPresupuesto[]; 
  modalidades: ModalidadCompra[];  
}

// Define el componente `Datos_inventario` del props
const Datos_inventario: React.FC<Datos_inventarioProps> = ({ 
  onNext,
   origenes, //combo OrigenPresupuesto
   modalidades, //combo MdalidadCompra
   nRecepcion,
   fechaRecepcion,
   nOrdenCompra,
  //  horaRecepcion,
   nFactura,   
   origenPresupuesto,
   montoRecepcion,
   fechaFactura,
   rutProveedor,
   nombreProveedor,
   modalidadCompra,

  }) => {
  const [data, setData] = useState<InventarioProps>({
    nRecepcion: '',
    fechaRecepcion: '',
    nOrdenCompra: '',
    // horaRecepcion: '',
    nFactura: '',
    origenPresupuesto: '',
    montoRecepcion: '',
    fechaFactura: '',
    rutProveedor: '',
    nombreProveedor: '',
    modalidadCompra: ''
  });

  const dispatch = useDispatch();


 //Hook que muestra los valores al input
useEffect(() => {
   // Sincroniza el estado local con el valor de Redux
  setData((prevData) => ({
    ...prevData, // Copia todos los valores anteriores del estado
    nRecepcion: nRecepcion,   
    fechaRecepcion: fechaRecepcion,
    nOrdenCompra: nOrdenCompra,
    // horaRecepcion: horaRecepcion,
    nFactura: nFactura,  
    origenPresupuesto: origenPresupuesto,  
    montoRecepcion: montoRecepcion,
    fechaFactura: fechaFactura,
    rutProveedor: rutProveedor,
    nombreProveedor: nombreProveedor,
    modalidadCompra: modalidadCompra,
    
  }));
  
}, [nRecepcion, fechaRecepcion, nOrdenCompra,/* horaRecepcion*/, nFactura, origenPresupuesto, montoRecepcion, fechaFactura, rutProveedor, nombreProveedor, modalidadCompra ]);


  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setData(prevData => ({ ...prevData, [name]: value }));
  };

  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
     // Despachar todas las acciones necesarias
    dispatch(setNRecepcion(data.nRecepcion)); // Despachar la acción para actualizar `nRecepcion`
    dispatch(setFechaRecepcion(data.fechaRecepcion));
    dispatch(setNOrdenCompra(data.nOrdenCompra));
    // dispatch(setHoraRecepcion(data.horaRecepcion));
    dispatch(setNFactura(data.nFactura));
    dispatch(setOrigenPresupuesto(data.origenPresupuesto));
    dispatch(setMontoRecepcion(data.montoRecepcion));
    dispatch(setFechaFactura(data.fechaFactura));
    dispatch(setRutProveedor(data.rutProveedor));
    dispatch(setnombreProveedor(data.nombreProveedor));
    dispatch(setModalidadCompra(data.modalidadCompra));
    
    onNext(data);
  };

     return (   
          <form onSubmit={handleSubmit} >
            <div className="border-top p-1 rounded">
              <div>
                <h3 className="form-title">Datos Inventario</h3> {/*
                <p className="form-subtitle">Detalles personales y aplicación.</p> */}
              </div>
              <div className="mt-4 border-top">
                <dl className="row">          
                  <div className="col-sm-12 col-md-3 mb-3">
                    <dt className="text-muted">N° de Recepción</dt>
                    <dd className="d-flex align-items-center">
                      <input type="text" className="form-control" name="nRecepcion" onChange={handleChange} value={data.nRecepcion}/>
                    </dd>
                  </div>
          
                  <div className="col-sm-12 col-md-3 mb-3">
                    <dt className="text-muted">Fecha de Recepción</dt>
                    <dd className="d-flex align-items-center">
                      <input type="date" className="form-control" name="fechaRecepcion" onChange={handleChange} value={data.fechaRecepcion}/>
                    </dd>
                  </div>
          
                  <div className="col-sm-12 col-md-3 mb-3">
                    <dt className="text-muted">N° Orden de Compra</dt>
                    <dd className="d-flex align-items-center">
                      <input type="text" className="form-control" name="nOrdenCompra" onChange={handleChange} value={data.nOrdenCompra} />
                    </dd>
                  </div>
          
                  {/* <div className="col-sm-12 col-md-3 mb-3">
                    <dt className="text-muted">Hora Recepción</dt>
                    <dd className="d-flex align-items-center">
                      <input type="text" className="form-control" name="horaRecepcion" onChange={handleChange} value={data.horaRecepcion}/>
                    </dd>
                  </div> */}
          
                  <div className="col-sm-12 col-md-3 mb-3">
                    <dt className="text-muted">N° Factura</dt>
                    <dd className="d-flex align-items-center">
                      <input type="text" className="form-control" name="nFactura" onChange={handleChange} value={data.nFactura}/>
                    </dd>
                  </div>
          
                  <div className="col-sm-12 col-md-3 mb-3">
                  <dt className="text-muted">Origen Presupuesto</dt>
                  <dd className="d-flex align-items-center">
                    <select className="form-select" name="origenPresupuesto" onChange={handleChange} value={data.origenPresupuesto}>
                      <option value="">Seleccione un origen</option>
                      {origenes.map((origen) => (
                        <option key={origen.codigo} value={origen.codigo}>
                          {origen.descripcion} 
                        </option>
                      ))}
                    </select>
                  </dd>
                  </div> 
          
                  <div className="col-sm-12 col-md-3 mb-3">
                    <dt className="text-muted">Monto Recepción</dt>
                    <dd className="d-flex align-items-center">
                      <input type="text" className="form-control" name="montoRecepcion" onChange={handleChange} value={data.montoRecepcion}/>
                    </dd>
                  </div>
          
                  <div className="col-sm-12 col-md-3 mb-3">
                    <dt className="text-muted">Fecha factura</dt>
                    <dd className="d-flex align-items-center">
                      <input type="date" className="form-control" name="fechaFactura" onChange={handleChange} value={data.fechaFactura}/>
                    </dd>
                  </div>
          
                  <div className="col-sm-12 col-md-3 mb-3">
                    <dt className="text-muted">Rut Proveedor</dt>
                    <dd className="d-flex align-items-center">
                      <input type="text" className="form-control" name="rutProveedor" onChange={handleChange} value={data.rutProveedor}/>
                    </dd>
                  </div>
                  <div className="col-sm-12 col-md-3 mb-3">
                    <dt className="text-muted">Nombre Proveedor</dt>
                    <dd className="d-flex align-items-center">
                      <input type="text" className="form-control" name="nombreProveedor" onChange={handleChange} value={data.nombreProveedor}/>
                    </dd>
                  </div>
                  <div className="col-sm-12 col-md-3 mb-3">
                  <dt className="text-muted">Modalidad de Compra</dt>
                  <dd className="d-flex align-items-center">
                    <select className="form-select" name="modalidadCompra" onChange={handleChange} value={data.modalidadCompra}>
                      <option value="">Seleccione un origen</option>
                      {modalidades.map((modalidad) => (
                        <option key={modalidad.codigo} value={modalidad.codigo}>
                          {modalidad.descripcion} 
                        </option>
                      ))}
                    </select>
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

//mapea los valores del estado global de Redux 
const mapStateToProps = (state: RootState) => ({ 
  nRecepcion: state.datos_inventarioReducer.nRecepcion,
  fechaRecepcion: state.datos_inventarioReducer.fechaRecepcion,
  nOrdenCompra: state.datos_inventarioReducer.nOrdenCompra,
  // horaRecepcion: state.datos_inventarioReducer.horaRecepcion,
  nFactura: state.datos_inventarioReducer.nFactura,
  origenPresupuesto: state.datos_inventarioReducer.origenPresupuesto,
  montoRecepcion: state.datos_inventarioReducer.montoRecepcion,
  fechaFactura: state.datos_inventarioReducer.fechaFactura,
  rutProveedor: state.datos_inventarioReducer.rutProveedor,
  nombreProveedor: state.datos_inventarioReducer.nombreProveedor,
  modalidadCompra: state.datos_inventarioReducer.modalidadCompra
});

export default connect(mapStateToProps,
   {  
    setNRecepcion,
    setFechaRecepcion,
    setNOrdenCompra,
    // setHoraRecepcion,
    setNFactura,
    setOrigenPresupuesto,
    setMontoRecepcion,
    setFechaFactura,
    setRutProveedor,
    setnombreProveedor,
    setModalidadCompra,
    })(Datos_inventario);

