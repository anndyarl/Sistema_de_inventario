import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Col, Row } from 'react-bootstrap';
import React, { useState, useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import Swal from 'sweetalert2';
//importacion de objetos desde actions de redux
import {
  setNRecepcionActions, setFechaRecepcionActions, setNOrdenCompraActions, setNFacturaActions,
  setOrigenPresupuestoActions, setMontoRecepcionActions, setFechaFacturaActions,
  setRutProveedorActions, setnombreProveedorActions, setModalidadCompraActions,
  vaciarDatosTabla
} from '../../redux/actions/Inventario/Datos_inventariosActions';
import { obtenerRecepcionActions } from '../../redux/actions/Inventario/obtenerRecepcionActions';
import { ActivoFijo } from './Datos_activo_fijo';
import { obtenerInventarioActions } from '../../redux/actions/Inventario/obtenerInventarioActions';

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
  nInventario: number,
  nombreProveedor: string,
  origenPresupuesto: number,
  rutProveedor: string,
  aF_ORIGEN: string

}

// Define el tipo de props para el componente, extendiendo InventarioProps
interface Datos_inventarioProps extends InventarioProps {
  onNext: (Inventario: InventarioProps) => void;
  comboOrigen: ORIGEN[];
  comboModalidad: MODALIDAD[];
  datosTabla: ActivoFijo[];// se utliza aqui para validar el monto recepción, por si se tipea un cambio
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
  nInventario,
  nombreProveedor,
  origenPresupuesto,
  rutProveedor,
  datosTabla,
  aF_ORIGEN


}) => {
  const [Inventario, setInventario] = useState<InventarioProps>({

    fechaFactura: '',
    fechaRecepcion: '',
    modalidadDeCompra: 0,
    montoRecepcion: 0,
    nFactura: '',
    nOrdenCompra: 0,
    nRecepcion: 0,
    nInventario: 0,
    nombreProveedor: '',
    origenPresupuesto: 0,
    rutProveedor: '',
    aF_ORIGEN: ''
  });
  const dispatch = useDispatch<AppDispatch>();
  const [showInput, setShowInput] = useState(false);
  const [formState, setFormState] = useState({
    buscarPor: localStorage.getItem('buscarPor') || '0',  // Recupera el valor guardado o '0' por defecto
  });

  //Se declara para habilitar la validación de nRecepcion o nInventario
  const { buscarPor } = formState;
  const [error, setError] = useState<Partial<InventarioProps> & { general?: string, generalTabla?: string }>({});

  const [isMontoRecepcionEdited, setIsMontoRecepcionEdited] = useState(false);  // Validaciones

  const validate = () => {
    let tempErrors: Partial<any> & {} = {};

    if (buscarPor === "1") {
      // Validación para N° de Recepción (debe ser un número)
      if (!Inventario.nRecepcion) tempErrors.nRecepcion = "El N° de Recepción es obligatorio.";
    }
    else if (buscarPor === "2") {
      // Validación para N° de Recepción (debe ser un número)
      if (!Inventario.nInventario) tempErrors.nInventario = "El N° de Inventario es obligatorio.";
    }
    else if (buscarPor === "0") {
      // Validación seleccionar buscar por
      tempErrors.general = "Debe selecionar una opción";
    }
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
    else if (showInput && Inventario.modalidadDeCompra === 7) {
      tempErrors.modalidadDeCompra = "Especifique la Modalidad de Compra.";
    }

    setError(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;

    // Si el campo es numérico, convierte a número solo los que realmente son números
    let newValue: string | number = value;
    if (name === 'montoRecepcion' || name === 'modalidadDeCompra' || name === 'nOrdenCompra' || name === 'origenPresupuesto') {
      newValue = parseFloat(value) || 0;
    }

    if (name === 'montoRecepcion' && datosTabla.length > 0) {
      if (!isMontoRecepcionEdited) {
        Swal.fire({
          icon: 'warning',
          title: '¿Está seguro que desea modificar monto recepción?',
          text: 'Si modifica el monto recepción se perderán los datos en la tabla.',
          showCancelButton: true,
          confirmButtonText: "Si, Modificar",
          cancelButtonText: "No, Cancelar",
        }).then((result) => {
          if (result.isConfirmed) {
            setInventario((prevInventario) => ({
              ...prevInventario,
              [name]: 0,
            }));
            setIsMontoRecepcionEdited(true);
            dispatch(vaciarDatosTabla());
          }
        });
        return;
      }
    }
    if (name === 'buscarPor') {
      localStorage.setItem('buscarPor', value);  // Guarda el valor seleccionado en localStorage
    }
    setFormState({ ...formState, [name]: value });
    setError((prevErrors) => ({ ...prevErrors, [name]: '' }));
    setInventario((prevInventario) => ({ ...prevInventario, [name]: newValue }));
    //Al seleccionar "otros" es decir el valor 7 este habilitará el input text
    if (name === 'modalidadDeCompra' && value === '7') {
      setShowInput(true);
    }
    else {
      setShowInput(false);
    }


  };

  //Hook que muestra los valores al input, Sincroniza el estado local con Redux
  useEffect(() => {
    setInventario({
      fechaFactura,
      fechaRecepcion,
      modalidadDeCompra,
      montoRecepcion,
      nFactura,
      nOrdenCompra,
      nRecepcion,
      nInventario,
      nombreProveedor,
      origenPresupuesto,
      rutProveedor,
      aF_ORIGEN
    });
  }, [fechaFactura, fechaRecepcion, modalidadDeCompra, montoRecepcion, nFactura, nOrdenCompra, nRecepcion, nInventario, nombreProveedor, origenPresupuesto, rutProveedor]);

  console.log("af_ORIGEN", aF_ORIGEN);

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
  const handleInventarioSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!Inventario.nInventario) {

      alert("Por favor, ingrese un número de inventario válido.");
      return;
    }
    // Despacha la acción para obtener la recepción en el formulario de activos fijos
    dispatch(obtenerInventarioActions(Inventario.nInventario));
  };

  return (
    <>
      <form onSubmit={handleSubmit} >
        <div className="border-top p-1 rounded">

          <p>aF_ORIGEN: {aF_ORIGEN}</p>

          {formState.buscarPor === '1' && (
            <h3 className="form-title">Registro Inventario</h3>
          )}
          {formState.buscarPor === '2' && (
            <h3 className="form-title">Busqueda del Inventario</h3>
          )}

          <div className="mt-4 border-top">
            <Row>
              <Col md={6}>
                <div className="mb-1">
                  <select
                    className={`form-control ${error.general ? 'is-invalid' : ''}`}
                    name="buscarPor"
                    value={formState.buscarPor}
                    onChange={handleChange}
                    style={{ flex: '0 0 150px' }}
                  >
                    <option value="0">Seleccione una opción</option>
                    <option value="1">N° de Recepción</option>
                    <option value="2">N° de Inventario</option>
                  </select>
                  <div> {error.general && <div className="invalid-feedback d-block">{error.general}</div>}</div>
                </div>

                {formState.buscarPor === '1' && (
                  <div className="mb-1">
                    <div className="d-flex align-items-center">
                      <input
                        type="text"
                        className={`form-control ${error.nRecepcion ? 'is-invalid' : ''} w-100`}
                        maxLength={12}
                        name="nRecepcion"
                        onChange={handleChange}
                        value={Inventario.nRecepcion || 0}
                      />
                      <Button onClick={handleRecepcionSubmit} variant="primary" className="ms-2">
                        +
                      </Button>
                    </div>
                    {error.nRecepcion && <div className="invalid-feedback d-block">{error.nRecepcion}</div>}
                  </div>
                )}

                {formState.buscarPor === '2' && (
                  <div className="mb-1">
                    <div className="d-flex align-items-center">
                      <input
                        type="text"
                        className={`form-control ${error.nInventario ? 'is-invalid' : ''} w-100`}
                        maxLength={12}
                        name="nInventario"
                        onChange={handleChange}
                        value={Inventario.nInventario || 0}
                      />
                      <Button onClick={handleInventarioSubmit} variant="success" className="ms-2">
                        +
                      </Button>
                    </div>
                    {error.nInventario && <div className="invalid-feedback d-block">{error.nInventario}</div>}
                  </div>
                )}

                < div className="mb-1">
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
                  <label htmlFor="nOrdenCompra" className="form-label">N° Orden de compra</label>
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
                  <label htmlFor="nFactura" className="form-label">N° Factura</label>
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
                    value={Inventario.origenPresupuesto || Inventario.aF_ORIGEN}
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
                    // value={isMontoRecepcionEdited ? Inventario.montoRecepcion : montoRecepcion}
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
                  <label htmlFor="rutProveedor" className="form-label">Rut Proveedor</label>
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
                  <label htmlFor="nombreProveedor" className="form-label">Nombre Proveedor</label>
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
  datosTabla: state.datosInventarioReducer.datosTabla,
  // aF_ORIGEN: state.datosInventarioReducer.aF_ORIGEN
});

export default connect(mapStateToProps,
  {

  })(Datos_inventario);

