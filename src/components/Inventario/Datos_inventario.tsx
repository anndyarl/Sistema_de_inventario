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
  comboOrigen: ORIGEN[];
  comboModalidad: MODALIDAD[];
}

// Define el componente `Datos_inventario` del props
const Datos_inventario: React.FC<Datos_inventarioProps> = ({
  onNext,
  comboOrigen,
  comboModalidad,
  fechaFactura,
  fechaRecepcion,
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

    fechaFactura: '',
    fechaRecepcion: '',
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
  const [error, setError] = useState<Partial<InventarioProps> & { general?: string, generalTabla?: string }>({});

  // Validaciones
  const validate = () => {
    let tempErrors: Partial<InventarioProps> & {} = {};

    // Validación para N° de Recepción (debe ser un número)
    if (!Inventario.nRecepcion) tempErrors.nRecepcion = "El N° de Recepción es obligatorio.";
    else if (isNaN(Inventario.nRecepcion)) tempErrors.nRecepcion = "El N° de Recepción debe ser numérico.";

    // Validación para Fecha de Recepción (debe ser una fecha válida)
    if (!Inventario.fechaRecepcion) tempErrors.fechaRecepcion = "La Fecha de Recepción es obligatoria.";

    // Validación para N° Orden de Compra (debe ser un número)
    if (!Inventario.nOrdenCompra) tempErrors.nOrdenCompra = "El N° de Orden de Compra es obligatorio.";
    else if (isNaN(Inventario.nOrdenCompra)) tempErrors.nOrdenCompra = "El N° de Orden de Compra debe ser numérico.";

    // Validación para N° Factura (debe ser un string y numérico)
    if (!Inventario.nFactura) tempErrors.nFactura = "El N° de Factura es obligatorio.";

    // Validación para Origen de Presupuesto (debe ser un número)
    if (!Inventario.origenPresupuesto) tempErrors.origenPresupuesto = "El Origen de Presupuesto es obligatorio.";

    // Validación para Monto de Recepción (debe ser un número con hasta dos decimales)
    if (!Inventario.montoRecepcion) tempErrors.montoRecepcion = "El Monto de Recepción es obligatorio.";
    else if (!/^\d+(\.\d{1,2})?$/.test(String(Inventario.montoRecepcion))) tempErrors.montoRecepcion = "El Monto debe ser un número válido con hasta dos decimales.";

    // Validación para Fecha de Factura
    if (!Inventario.fechaFactura) tempErrors.fechaFactura = "La Fecha de Factura es obligatoria.";

    // Validación para Rut del Proveedor (debe ser numérico)
    if (!Inventario.rutProveedor) tempErrors.rutProveedor = "El Rut del Proveedor es obligatorio.";

    // Validación para Nombre del Proveedor (máximo 30 caracteres)
    if (!Inventario.nombreProveedor) tempErrors.nombreProveedor = "El Nombre del Proveedor es obligatorio.";
    else if (Inventario.nombreProveedor.length > 30) tempErrors.nombreProveedor = "El Nombre no debe exceder los 30 caracteres.";

    // Validación para Modalidad de Compra (debe ser un número)
    if (!Inventario.modalidadDeCompra) tempErrors.modalidadDeCompra = "La Modalidad de Compra es obligatoria.";
    else if (showInput && Inventario.modalidadDeCompra === 7 && !Inventario.modalidadDeCompraEspecifica) {
      tempErrors.modalidadDeCompraEspecifica = "Especifique la Modalidad de Compra.";
    }

    setError(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    let newValue: string | number = value;
    // Convertir a número los campos que lo requieren
    if (name === 'nRecepcion' || name === 'nOrdenCompra' || name === 'montoRecepcion' || name === 'origenPresupuesto') {
      newValue = parseFloat(value) || 0;
    }
    setInventario(prevInventario => ({
      ...prevInventario,
      [name]: newValue,

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
      fechaFactura,
      fechaRecepcion,
      modalidadDeCompra,
      montoRecepcion,
      nFactura,
      nOrdenCompra,
      nRecepcion,
      nombreProveedor,
      origenPresupuesto,
      rutProveedor
    });
  }, [fechaFactura, fechaRecepcion, modalidadDeCompra, montoRecepcion, nFactura, nOrdenCompra, nRecepcion, nombreProveedor, origenPresupuesto, rutProveedor]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validate()) {
      console.log('Formulario Datos inventario', Inventario);
      // Despachar todas las acciones necesarias

      dispatch(setFechaFacturaActions(Inventario.fechaFactura));
      dispatch(setFechaRecepcionActions(Inventario.fechaRecepcion));
      dispatch(setModalidadCompraActions(Inventario.modalidadDeCompra));
      dispatch(setMontoRecepcionActions(Inventario.montoRecepcion));
      dispatch(setNFacturaActions(Inventario.nFactura));
      dispatch(setNOrdenCompraActions(Inventario.nOrdenCompra));
      dispatch(setNRecepcionActions(Inventario.nRecepcion));
      dispatch(setnombreProveedorActions(Inventario.nombreProveedor));
      dispatch(setOrigenPresupuestoActions(Inventario.origenPresupuesto));
      dispatch(setRutProveedorActions(Inventario.rutProveedor));
      onNext(Inventario);
    }
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
                  <label htmlFor="nRecepcion" className="form-label">N Recepción</label>
                  <div className="d-flex align-items-center">
                    <input
                      type="text"
                      className={`form-control ${error.nRecepcion ? 'is-invalid' : ''}`}
                      maxLength={12}
                      name="nRecepcion"
                      onChange={handleChange}
                      value={Inventario.nRecepcion}
                    />

                    <Button
                      onClick={handleRecepcionSubmit}
                      variant="primary"
                      className="ms-2"
                    >
                      +
                    </Button>

                  </div>
                  {error.nRecepcion && <div className="invalid-feedback">{error.nRecepcion}</div>}
                </div>

                <div className="mb-1">
                  <label htmlFor="fechaRecepcion" className="form-label">Fecha Recepción</label>
                  <input
                    type="date"
                    className={`form-control ${error.fechaRecepcion ? 'is-invalid' : ''}`}
                    name="fechaRecepcion"
                    onChange={handleChange}
                    value={Inventario.fechaRecepcion}
                  />
                  {error.fechaRecepcion && <div className="invalid-feedback">{error.fechaRecepcion}</div>}
                </div>

                <div className="mb-1">
                  <label htmlFor="nOrdenCompra" className="form-label">N Orden de compra</label>
                  <input
                    type="text"
                    className={`form-control ${error.nOrdenCompra ? 'is-invalid' : ''}`}
                    maxLength={12}
                    name="nOrdenCompra"
                    onChange={handleChange}
                    value={Inventario.nOrdenCompra}
                  />
                  {error.nOrdenCompra && <div className="invalid-feedback">{error.nOrdenCompra}</div>}
                </div>

                <div className="mb-1">
                  <label htmlFor="nFactura" className="form-label">N Factura</label>
                  <input
                    type="text"
                    className={`form-control ${error.nFactura ? 'is-invalid' : ''}`}
                    maxLength={12}
                    name="nFactura"
                    onChange={handleChange}
                    value={Inventario.nFactura}
                  />
                  {error.nFactura && <div className="invalid-feedback">{error.nFactura}</div>}

                </div>

                <div className="mb-1">
                  <label htmlFor="origenPresupuesto" className="form-label">Origen Presupuesto</label>
                  <select
                    className={`form-select ${error.origenPresupuesto ? 'is-invalid' : ''}`}
                    name="origenPresupuesto"
                    onChange={handleChange}
                    value={Inventario.origenPresupuesto}
                  >
                    <option value="">Seleccione un origen</option>
                    {comboOrigen.map((traeOrigen) => (
                      <option key={traeOrigen.codigo} value={traeOrigen.codigo}>
                        {traeOrigen.descripcion}
                      </option>
                    ))}
                  </select>
                  {error.origenPresupuesto && (
                    <div className="invalid-feedback">{error.origenPresupuesto}</div>
                  )}

                </div>
              </Col>

              <Col md={6}>
                <div className="mb-1">
                  <label htmlFor="montoRecepcion" className="form-label">Monto Recepción</label>
                  <input
                    type="text"
                    className={`form-control ${error.montoRecepcion ? 'is-invalid' : ''}`}
                    maxLength={12}
                    name="montoRecepcion"
                    onChange={handleChange}
                    value={Inventario.montoRecepcion}
                  />
                  {error.montoRecepcion && (
                    <div className="invalid-feedback">{error.montoRecepcion}</div>
                  )}

                </div>
                <div className="mb-1">
                  <label htmlFor="fechaFactura" className="form-label">Fecha Factura</label>
                  <input
                    type="date"
                    className={`form-control ${error.fechaFactura ? 'is-invalid' : ''}`}
                    name="fechaFactura"
                    onChange={handleChange}
                    value={Inventario.fechaFactura}
                  />
                  {error.fechaFactura && (
                    <div className="invalid-feedback">{error.fechaFactura}</div>
                  )}

                </div>

                <div className="mb-1">
                  <label htmlFor="rutProveedor" className="form-label">Rut Proveesor</label>
                  <input
                    type="text"
                    className={`form-control ${error.rutProveedor ? 'is-invalid' : ''}`}
                    maxLength={12}
                    name="rutProveedor"
                    onChange={handleChange}
                    value={Inventario.rutProveedor}
                  />
                  {error.rutProveedor && (
                    <div className="invalid-feedback">{error.rutProveedor}</div>
                  )}

                </div>

                <div className="mb-1">
                  <label htmlFor="nombreProveedor" className="form-label">Nombre Proveesor</label>
                  <input
                    type="text"
                    className={`form-control ${error.nombreProveedor ? 'is-invalid' : ''}`}
                    maxLength={30}
                    name="nombreProveedor"
                    onChange={handleChange}
                    value={Inventario.nombreProveedor}
                  />
                  {error.nombreProveedor && (
                    <div className="invalid-feedback">{error.nombreProveedor}</div>
                  )}

                </div>

                <div className="mb-1">
                  <label htmlFor="modalidadDeCompra" className="form-label">Modalidad de Compra</label>
                  <select
                    className={`form-select ${error.modalidadDeCompra ? 'is-invalid' : ''}`}
                    name="modalidadDeCompra"
                    onChange={handleChange}
                    value={Inventario.modalidadDeCompra}
                  >
                    <option value="">Seleccione una modalidad</option>
                    {comboModalidad.map((traeModalidad) => (
                      <option key={traeModalidad.codigo} value={traeModalidad.codigo}>
                        {traeModalidad.descripcion}
                      </option>
                    ))}
                  </select>
                  {error.modalidadDeCompra && (
                    <div className="invalid-feedback">{error.modalidadDeCompra}</div>
                  )}

                </div>

                {showInput && (
                  <div className="mb-1">
                    <label htmlFor="modalidadDeCompra" className="form-label">Modalidad de Compra</label>
                    <input
                      type="text"
                      className={`form-control ${error.modalidadDeCompra ? 'is-invalid' : ''}`}
                      name="modalidadDeCompra"
                      placeholder="Especifique otro"
                      onChange={(e) =>
                        setInventario({ ...Inventario, modalidadDeCompra: parseInt(e.target.value) })
                      }
                    />
                    {error.modalidadDeCompra && (
                      <div className="invalid-feedback">{error.modalidadDeCompra}</div>
                    )}

                  </div>
                )}
              </Col>
            </Row>


          </div>
        </div>
        <div className="p-1 rounded bg-white d-flex justify-content-end ">
          <button type="submit" className="btn btn-primary ">Siguiente</button>
        </div>
      </form >
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

