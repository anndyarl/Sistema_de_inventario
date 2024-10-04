import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Col, Row } from 'react-bootstrap';
import React, { useState, useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
//importacion de objetos desde actions de redux
import {
  setNRecepcionActions, setFechaRecepcionActions, setNOrdenCompraActions, setNFacturaActions,
  setOrigenPresupuestoActions, setMontoRecepcionActions, setFechaFacturaActions,
  setRutProveedorActions, setnombreProveedorActions, setModalidadCompraActions
} from '../../redux/actions/Inventario/Datos_inventariosActions';
import { obtenerRecepcionActions } from '../../redux/actions/Inventario/obtenerRecepcionActions';


// Define el tipo de los elementos del combo `OrigenPresupuesto`
export interface ORIGEN {
  codigo: string;
  descripcion: string;
}

// Define el tipo de los elementos del combo `ModalidadCompra`
export interface MODALIDAD {
  codigo: string;
  descripcion: string;
}
// Define el tipo de los datos que se manejarán en el componente
export interface InventarioProps {
  // fechaFactura: string,
  // fechaRecepcion: string,
  modalidadDeCompra: number,
  montoRecepcion: number,
  nFactura: string,
  nOrdenCompra: number,
  nRecepcion: number,
  nombreProveedor: string,
  origenPresupuesto: number,
  rutProveedor: string
}

// Define el tipo de props para el componente, extendiendo InventarioProps
interface Datos_inventarioProps extends InventarioProps {
  onNext: (Inventario: InventarioProps) => void;
  comboOrigen: ORIGEN[];
  comboModalidad: MODALIDAD[];
}

// Define el componente `Datos_inventario` del props
const Datos_inventario: React.FC<Datos_inventarioProps> = ({
  onNext,
  comboOrigen,
  comboModalidad,
  // fechaFactura: string,
  // fechaRecepcion: string,
  modalidadDeCompra,
  montoRecepcion,
  nFactura,
  nOrdenCompra,
  nRecepcion,
  nombreProveedor,
  origenPresupuesto,
  rutProveedor


}) => {
  const [Inventario, setInventario] = useState<InventarioProps>({

    // fechaFactura: '',
    // fechaRecepcion: '',  
    modalidadDeCompra: 0,
    montoRecepcion: 0,
    nFactura: '',
    nOrdenCompra: 0,
    nRecepcion: 0,
    nombreProveedor: '',
    origenPresupuesto: 0,
    rutProveedor: '',
  });

  const dispatch = useDispatch<AppDispatch>();
  const [showInput, setShowInput] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;

    // Verifica si el campo que se está modificando es 'montoRecepcion' y convierte el valor a número
    const newValue = name === "montoRecepcion" ? parseFloat(value) || 0 : value;
    const newValue2 = name === "nOrdenCompra" ? parseInt(value) || 0 : value;
    setInventario(prevInventario => ({
      ...prevInventario,
      [name]: newValue,
      [name]: newValue2
    }));

    //Al seleccionar "otros" es decir el valor 7 este habilitará el input text
    if (name === 'modalidadDeCompra' && value === '7') {
      setShowInput(true);
    }
    else {
      setShowInput(false);
    }
  };

  //Hook que muestra los valores al input
  // Sincroniza el estado local con Redux
  useEffect(() => {
    setInventario({
      // fechaFactura,
      // fechaRecepcion,
      modalidadDeCompra,
      montoRecepcion,
      nFactura,
      nOrdenCompra,
      nRecepcion,
      nombreProveedor,
      origenPresupuesto,
      rutProveedor
    });
  }, [ /*fechaFactura, fechaRecepcion*/, modalidadDeCompra, montoRecepcion, nFactura, nOrdenCompra, nRecepcion, nombreProveedor, origenPresupuesto, rutProveedor]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // console.log('Formulario Datos inventario', Inventario);
    // Despachar todas las acciones necesarias

    // dispatch(setFechaFactura(Inventario.fechaFactura));
    // dispatch(setFechaRecepcion(Inventario.fechaRecepcion));
    dispatch(setModalidadCompraActions(Inventario.modalidadDeCompra));
    dispatch(setMontoRecepcionActions(Inventario.montoRecepcion));
    dispatch(setNFacturaActions(Inventario.nFactura));
    dispatch(setNOrdenCompraActions(Inventario.nOrdenCompra));
    dispatch(setNRecepcionActions(Inventario.nRecepcion));
    dispatch(setnombreProveedorActions(Inventario.nombreProveedor));
    dispatch(setOrigenPresupuestoActions(Inventario.origenPresupuesto));
    dispatch(setRutProveedorActions(Inventario.rutProveedor));



    onNext(Inventario);
  };

  const handleRecepcionSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!Inventario.nRecepcion) {

      alert("Por favor, ingrese un número de recepción válido.");
      return;
    }
    // Despacha la acción para obtener la recepción en el formulario de activos fijos
    dispatch(obtenerRecepcionActions(Inventario.nRecepcion));
  };

  return (
    <>
      <form onSubmit={handleSubmit} >
        <div className="border-top p-1 rounded">
          <div>
            <h3 className="form-title">Registro Inventario</h3>
          </div>
          <div className="mt-4 border-top">
            <Row>
              <Col md={6}>
                <div className="mb-1">
                  <dt className="text-muted">N° de Recepción</dt>
                  <dd className="d-flex align-items-center">
                    <input type="text" className="form-control" maxLength={12} name="nRecepcion" onChange={handleChange} value={Inventario.nRecepcion} />
                    <Button onClick={handleRecepcionSubmit} variant="primary" >+</Button>
                  </dd>
                </div>

                {/* <div className="mb-1">
                  <dt className="text-muted">Fecha de Recepción</dt>
                  <dd className="d-flex align-items-center">
                    <input type="date" className="form-control" name="fechaRecepcion" onChange={handleChange} value={Inventario.fechaRecepcion} />
                  </dd>
                </div> */}

                <div className="mb-1">
                  <dt className="text-muted">N° Orden de Compra</dt>
                  <dd className="d-flex align-items-center">
                    <input type="text" className="form-control" maxLength={12} name="nOrdenCompra" onChange={handleChange} value={Inventario.nOrdenCompra} />
                  </dd>
                </div>

                <div className="mb-1">
                  <dt className="text-muted">N° Factura</dt>
                  <dd className="d-flex align-items-center">
                    <input type="text" className="form-control" maxLength={12} name="nFactura" onChange={handleChange} value={Inventario.nFactura} />
                  </dd>
                </div>

                <div className="mb-1">
                  <dt className="text-muted">Origen Presupuesto</dt>
                  <dd className="d-flex align-items-center">
                    <select className="form-select" name="origenPresupuesto" onChange={handleChange} value={Inventario.origenPresupuesto}>
                      <option value="">Seleccione un origen</option>
                      {comboOrigen.map((traeOrigen) => (
                        <option key={traeOrigen.codigo} value={traeOrigen.codigo}>
                          {traeOrigen.descripcion}
                        </option>
                      ))}
                    </select>
                  </dd>
                </div>
              </Col>
              <Col md={6}>

                <div className="mb-1">
                  <dt className="text-muted">Monto Recepción</dt>
                  <dd className="d-flex align-items-center">
                    <input type="text" className="form-control" maxLength={12} name="montoRecepcion" onChange={handleChange} value={Inventario.montoRecepcion} />
                  </dd>
                </div>

                {/* <div className="mb-1">
                  <dt className="text-muted">Fecha factura</dt>
                  <dd className="d-flex align-items-center">
                    <input type="date" className="form-control" name="fechaFactura" onChange={handleChange} value={Inventario.fechaFactura} />
                  </dd>
                </div> */}

                <div className="mb-1">
                  <dt className="text-muted">Rut Proveedor</dt>
                  <dd className="d-flex align-items-center">
                    <input type="text" className="form-control" maxLength={12} name="rutProveedor" onChange={handleChange} value={Inventario.rutProveedor} />
                  </dd>
                </div>

                <div className="mb-1">
                  <dt className="text-muted">Nombre Proveedor</dt>
                  <dd className="d-flex align-items-center">
                    <input type="text" className="form-control" maxLength={30} name="nombreProveedor" onChange={handleChange} value={Inventario.nombreProveedor} />
                  </dd>
                </div>

                <div className="mb-1">
                  <dt className="text-muted">Modalidad de Compra</dt>
                  <dd className="d-flex align-items-center">
                    <select className="form-select" name="modalidadDeCompra" onChange={handleChange} value={Inventario.modalidadDeCompra}>
                      <option value="">Seleccione una modalidad</option>
                      {comboModalidad.map((traeModalidad) => (
                        <option key={traeModalidad.codigo} value={traeModalidad.codigo}>
                          {traeModalidad.descripcion}
                        </option>
                      ))}
                    </select>
                  </dd>
                </div>
                {showInput && (
                  <div className="mb-1">
                    <dt className="text-muted">Modalidad de compra</dt>
                    <dd className="d-flex align-items-center">
                      <input
                        type="text"
                        className="form-control"
                        name="modalidadDeCompra"
                        placeholder="Especifique otro"
                        onChange={(e) => setInventario({ ...Inventario, modalidadDeCompra: parseInt(e.target.value) })}
                      />
                    </dd>
                  </div>
                )}

              </Col>
            </Row>

          </div>
        </div>
        <div className="p-1 rounded bg-white d-flex justify-content-end ">
          <button type="submit" className="btn btn-primary ">Siguiente</button>
        </div>
      </form>
    </>
  );
};

//mapea los valores del estado global de Redux 
const mapStateToProps = (state: RootState) => ({
  fechaFactura: state.datosInventarioReducer.fechaFactura,
  fechaRecepcion: state.datosInventarioReducer.fechaRecepcion,
  modalidadDeCompra: state.datosInventarioReducer.modalidadDeCompra,
  montoRecepcion: state.datosInventarioReducer.montoRecepcion,
  nFactura: state.datosInventarioReducer.nFactura,
  nOrdenCompra: state.datosInventarioReducer.nOrdenCompra,
  nRecepcion: state.datosInventarioReducer.nRecepcion,
  nombreProveedor: state.datosInventarioReducer.nombreProveedor,
  origenPresupuesto: state.datosInventarioReducer.origenPresupuesto,
  rutProveedor: state.datosInventarioReducer.rutProveedor,

});

export default connect(mapStateToProps,
  {

  })(Datos_inventario);

