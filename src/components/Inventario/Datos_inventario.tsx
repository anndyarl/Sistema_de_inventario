import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';

//importacion de objetos desde actions de redux
import {
  setNRecepcion, setFechaRecepcion, setNOrdenCompra, setNFactura,
  setOrigenPresupuesto, setMontoRecepcion, setFechaFactura,
  setRutProveedor, setnombreProveedor, setModalidadCompra
} from '../../redux/actions/Inventario/Datos_inventariosActions';

import { obtenerRecepcionActions } from '../../redux/actions/Inventario/obtenerRecepcionActions';

import { AppDispatch, RootState } from '../../store';
import { Button, Col, Row } from 'react-bootstrap';

// Define el tipo de los elementos del combo `OrigenPresupuesto`
export interface OrigenPresupuesto {
  codigo: string;
  descripcion: string;
}

// Define el tipo de los elementos del combo `ModalidadCompra`
export interface ModalidadDeCompra {
  codigo: string;
  descripcion: string;
}
// Define el tipo de los datos que se manejarán en el componente
export interface InventarioProps {
  fechaFactura: string,
  fechaRecepcion: string,
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
  origenes: OrigenPresupuesto[];
  modalidades: ModalidadDeCompra[];
}

// Define el componente `Datos_inventario` del props
const Datos_inventario: React.FC<Datos_inventarioProps> = ({
  onNext, origenes, modalidades,
  nRecepcion, fechaRecepcion, nOrdenCompra, nFactura,
  origenPresupuesto, montoRecepcion, fechaFactura,
  rutProveedor, nombreProveedor, modalidadDeCompra


}) => {
  const [Inventario, setInventario] = useState<InventarioProps>({
    nRecepcion: 0, fechaRecepcion: '', nOrdenCompra: 0,
    nFactura: '', origenPresupuesto: 0, montoRecepcion: 0,
    fechaFactura: '', rutProveedor: '', nombreProveedor: '',
    modalidadDeCompra: 0,
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
      nRecepcion, fechaRecepcion, nOrdenCompra, nFactura,
      origenPresupuesto, montoRecepcion, fechaFactura,
      rutProveedor, nombreProveedor, modalidadDeCompra
    });
  }, [nRecepcion, fechaRecepcion, nOrdenCompra, nFactura, origenPresupuesto,
    montoRecepcion, fechaFactura, rutProveedor, nombreProveedor, modalidadDeCompra]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // console.log('Formulario Datos inventario', Inventario);
    // Despachar todas las acciones necesarias
    dispatch(setNRecepcion(Inventario.nRecepcion));
    dispatch(setFechaRecepcion(Inventario.fechaRecepcion));
    dispatch(setNOrdenCompra(Inventario.nOrdenCompra));
    dispatch(setNFactura(Inventario.nFactura));
    dispatch(setOrigenPresupuesto(Inventario.origenPresupuesto));
    dispatch(setMontoRecepcion(Inventario.montoRecepcion));
    dispatch(setFechaFactura(Inventario.fechaFactura));
    dispatch(setRutProveedor(Inventario.rutProveedor));
    dispatch(setnombreProveedor(Inventario.nombreProveedor));
    dispatch(setModalidadCompra(Inventario.modalidadDeCompra));

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

                <div className="mb-1">
                  <dt className="text-muted">Fecha de Recepción</dt>
                  <dd className="d-flex align-items-center">
                    <input type="date" className="form-control" name="fechaRecepcion" onChange={handleChange} value={Inventario.fechaRecepcion} />
                  </dd>
                </div>

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
                      {origenes.map((origen) => (
                        <option key={origen.codigo} value={origen.codigo}>
                          {origen.descripcion}
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

                <div className="mb-1">
                  <dt className="text-muted">Fecha factura</dt>
                  <dd className="d-flex align-items-center">
                    <input type="date" className="form-control" name="fechaFactura" onChange={handleChange} value={Inventario.fechaFactura} />
                  </dd>
                </div>

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
                      {modalidades.map((modalidad) => (
                        <option key={modalidad.codigo} value={modalidad.codigo}>
                          {modalidad.descripcion}
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
  nRecepcion: state.datos_inventarioReducer.nRecepcion,
  fechaRecepcion: state.datos_inventarioReducer.fechaRecepcion,
  nOrdenCompra: state.datos_inventarioReducer.nOrdenCompra,
  nFactura: state.datos_inventarioReducer.nFactura,
  origenPresupuesto: state.datos_inventarioReducer.origenPresupuesto,
  montoRecepcion: state.datos_inventarioReducer.montoRecepcion,
  fechaFactura: state.datos_inventarioReducer.fechaFactura,
  rutProveedor: state.datos_inventarioReducer.rutProveedor,
  nombreProveedor: state.datos_inventarioReducer.nombreProveedor,
  modalidadDeCompra: state.datos_inventarioReducer.modalidadDeCompra

});

export default connect(mapStateToProps,
  {

  })(Datos_inventario);

