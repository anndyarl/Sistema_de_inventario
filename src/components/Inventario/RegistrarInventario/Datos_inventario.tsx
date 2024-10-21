import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Col, Row } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import { connect, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../../../store";
import Swal from "sweetalert2";
//importacion de objetos desde actions de redux
import {
  setNRecepcionActions,
  setFechaRecepcionActions,
  setNOrdenCompraActions,
  setNFacturaActions,
  setOrigenPresupuestoActions,
  setMontoRecepcionActions,
  setFechaFacturaActions,
  setRutProveedorActions,
  setnombreProveedorActions,
  setModalidadCompraActions,
  vaciarDatosTabla,
} from "../../../redux/actions/Inventario/Datos_inventariosActions";
import { obtenerRecepcionActions } from "../../../redux/actions/Inventario/obtenerRecepcionActions";
import { ActivoFijo } from "./Datos_activo_fijo";
import { Plus } from "react-bootstrap-icons";
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
  fechaFactura: string;
  fechaRecepcion: string;
  modalidadDeCompra: number;
  montoRecepcion: number;
  nFactura: string;
  nOrdenCompra: number;
  nRecepcion: number;
  nInventario: number;
  nombreProveedor: string;
  origenPresupuesto: number;
  rutProveedor: string;
}

// Define el tipo de props para el componente, extendiendo InventarioProps
interface Datos_inventarioProps extends InventarioProps {
  onNext: (Inventario: InventarioProps) => void;
  comboOrigen: ORIGEN[];
  comboModalidad: MODALIDAD[];
  datosTablaActivoFijo: ActivoFijo[]; // se utliza aqui para validar el monto recepción, por si se tipea un cambio 
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
  datosTablaActivoFijo

}) => {
  const [Inventario, setInventario] = useState<InventarioProps>({
    fechaFactura: "",
    fechaRecepcion: "",
    modalidadDeCompra: 0,
    montoRecepcion: 0,
    nFactura: "",
    nOrdenCompra: 0,
    nRecepcion: 0,
    nInventario: 0,
    nombreProveedor: "",
    origenPresupuesto: 0,
    rutProveedor: "",
  });

  const dispatch = useDispatch<AppDispatch>();
  const [showInput, setShowInput] = useState(false);
  const [error, setError] = useState<Partial<InventarioProps> & { general?: string; generalTabla?: string }>({});
  const [isMontoRecepcionEdited, setIsMontoRecepcionEdited] = useState(false); // Validaciones
  const classNames = (...classes: (string | boolean | undefined)[]): string => {
    return classes.filter(Boolean).join(' ');
  };

  const validate = () => {
    let tempErrors: Partial<any> & {} = {};
    // Validación para N° de Recepción (debe ser un número)
    if (!Inventario.nRecepcion) tempErrors.nRecepcion = "El N° de Recepción es obligatorio.";
    if (!Inventario.fechaRecepcion) tempErrors.fechaRecepcion = "La Fecha de Recepción es obligatoria.";
    if (!Inventario.nOrdenCompra) tempErrors.nOrdenCompra = "El N° de Orden de Compra es obligatorio.";
    else if (isNaN(Inventario.nOrdenCompra)) tempErrors.nOrdenCompra = "El N° de Orden de Compra debe ser numérico.";
    if (!Inventario.nFactura) tempErrors.nFactura = "El N° de Factura es obligatorio.";
    if (!Inventario.origenPresupuesto) tempErrors.origenPresupuesto = "El Origen de Presupuesto es obligatorio.";
    if (!Inventario.montoRecepcion) tempErrors.montoRecepcion = "El Monto de Recepción es obligatorio.";
    else if (!/^\d+(\.\d{1,2})?$/.test(String(Inventario.montoRecepcion))) tempErrors.montoRecepcion =
      "El Monto debe ser un número válido con hasta dos decimales.";
    if (!Inventario.fechaFactura) tempErrors.fechaFactura = "La Fecha de Factura es obligatoria.";
    if (!Inventario.rutProveedor) tempErrors.rutProveedor = "El Rut del Proveedor es obligatorio.";
    if (!Inventario.nombreProveedor) tempErrors.nombreProveedor = "El Nombre del Proveedor es obligatorio.";
    else if (Inventario.nombreProveedor.length > 30) tempErrors.nombreProveedor = "El Nombre no debe exceder los 30 caracteres.";
    if (!Inventario.modalidadDeCompra) tempErrors.modalidadDeCompra = "La Modalidad de Compra es obligatoria.";
    else if (showInput && Inventario.modalidadDeCompra === 7) {
      tempErrors.modalidadDeCompra = "Especifique la Modalidad de Compra.";
    }
    setError(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    // Si el campo es numérico, convierte a número solo los que realmente son números
    let newValue: string | number = value;
    if (
      name === "montoRecepcion" ||
      name === "modalidadDeCompra" ||
      name === "nOrdenCompra" ||
      name === "origenPresupuesto"
    ) {
      newValue = parseFloat(value) || 0;
    }

    if (name === "montoRecepcion" && datosTablaActivoFijo.length > 0) {
      if (!isMontoRecepcionEdited) {
        Swal.fire({
          icon: "warning",
          title: "¿Está seguro que desea modificar monto recepción?",
          text: "Si modifica el monto recepción se perderán los datos en la tabla.",
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
    // setError((prevErrors) => ({ ...prevErrors, [name]: "" }));
    setInventario((prevInventario) => ({
      ...prevInventario,
      [name]: newValue,
    }));
    //Al seleccionar "otros" es decir el valor 7 este habilitará el input text
    if (name === "modalidadDeCompra" && value === "7") {
      setShowInput(true);
    } else {
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
    });
  }, [
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
  ]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (validate()) {
      console.log("Formulario Datos inventario", Inventario);
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
      Swal.fire({
        icon: "warning",
        title: "Por favor, ingrese un número de recepción.",
        confirmButtonText: "Ok",
      });
      return;
    }
    // Despacha la acción para obtener la recepción en el formulario de activos fijos
    dispatch(obtenerRecepcionActions(Inventario.nRecepcion));

  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="border-top p-1 rounded">
          <h3 className="form-title">Registro Inventario</h3>

          <div className="shadow-sm p-5 m-1">
            <Row>
              <Col md={6}>
                <div className="mb-1">
                  <dt className="text-muted">Nº Recepción</dt>
                  <div className="d-flex align-items-center">
                    <input
                      type="text"
                      className={`form-control ${error.nRecepcion ? "is-invalid" : ""} w-100`}
                      maxLength={12}
                      name="nRecepcion"
                      onChange={handleChange}
                      value={Inventario.nRecepcion}
                    />
                    <Button
                      onClick={handleRecepcionSubmit}
                      variant="primary"
                      className="ms-1"
                    >
                      <Plus className={classNames('flex-shrink-0', 'h-5 w-5')} aria-hidden="true" />
                    </Button>
                  </div>
                  {error.nRecepcion && (
                    <div className="invalid-feedback d-block">
                      {error.nRecepcion}
                    </div>
                  )}
                </div>
                <div className="mb-1">
                  <dt className="text-muted">Fecha Recepción</dt>
                  <input
                    type="date"
                    className={`form-control ${error.fechaRecepcion ? "is-invalid" : ""}`}
                    name="fechaRecepcion"
                    onChange={handleChange}
                    value={Inventario.fechaRecepcion}
                  />
                  {error.fechaRecepcion && (
                    <div className="invalid-feedback">
                      {error.fechaRecepcion}
                    </div>
                  )}
                </div>

                <div className="mb-1">
                  <dt className="text-muted">N° Orden de compra</dt>
                  <input
                    type="text"
                    className={`form-control ${error.nOrdenCompra ? "is-invalid" : ""}`}
                    maxLength={12}
                    name="nOrdenCompra"
                    onChange={handleChange}
                    value={Inventario.nOrdenCompra}
                  />
                  {error.nOrdenCompra && (
                    <div className="invalid-feedback">{error.nOrdenCompra}</div>
                  )}
                </div>

                <div className="mb-1">
                  <dt className="text-muted">Nº factura</dt>
                  <input
                    type="text"
                    className={`form-control ${error.nFactura ? "is-invalid" : ""}`}
                    maxLength={12}
                    name="nFactura"
                    onChange={handleChange}
                    value={Inventario.nFactura}

                  />
                  {error.nFactura && (
                    <div className="invalid-feedback">{error.nFactura}</div>
                  )}
                </div>

                <div className="mb-1">
                  <dt className="text-muted">Origen Presupuesto</dt>
                  <select
                    className={`form-select ${error.origenPresupuesto ? "is-invalid" : ""}`}
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
                    <div className="invalid-feedback">
                      {error.origenPresupuesto}
                    </div>
                  )}
                </div>
              </Col>

              <Col md={6}>
                <div className="mb-1">
                  <dt className="text-muted">Monto Recepción</dt>
                  <input
                    type="text"
                    className={`form-control ${error.montoRecepcion ? "is-invalid" : ""}`}
                    maxLength={12}
                    name="montoRecepcion"
                    onChange={handleChange}
                    // value={isMontoRecepcionEdited ? Inventario.montoRecepcion : montoRecepcion}
                    value={Inventario.montoRecepcion}

                  />
                  {error.montoRecepcion && (
                    <div className="invalid-feedback">
                      {error.montoRecepcion}
                    </div>
                  )}
                </div>

                <div className="mb-1">
                  <dt className="text-muted">Fecha Factura</dt>
                  <input
                    type="date"
                    className={`form-control ${error.fechaFactura ? "is-invalid" : ""}`}
                    name="fechaFactura"
                    onChange={handleChange}
                    value={Inventario.fechaFactura}

                  />
                  {error.fechaFactura && (
                    <div className="invalid-feedback">{error.fechaFactura}</div>
                  )}
                </div>
                <div className="mb-1">
                  <dt className="text-muted">Rut Proveedor</dt>
                  <input
                    type="text"
                    className={`form-control ${error.rutProveedor ? "is-invalid" : ""}`}
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
                  <dt className="text-muted">Nombre Proveedor</dt>
                  <input
                    type="text"
                    className={`form-control ${error.nombreProveedor ? "is-invalid" : ""}`}
                    maxLength={30}
                    name="nombreProveedor"
                    onChange={handleChange}
                    value={Inventario.nombreProveedor}

                  />
                  {error.nombreProveedor && (
                    <div className="invalid-feedback">
                      {error.nombreProveedor}
                    </div>
                  )}
                </div>

                <div className="mb-1">
                  <dt className="text-muted">Modalida de Compra</dt>
                  <select
                    className={`form-select ${error.modalidadDeCompra ? "is-invalid" : ""}`}
                    name="modalidadDeCompra"
                    onChange={handleChange}
                    value={Inventario.modalidadDeCompra}

                  >
                    <option value="">Seleccione una modalidad</option>
                    {comboModalidad.map((traeModalidad) => (
                      <option
                        key={traeModalidad.codigo}
                        value={traeModalidad.codigo}
                      >
                        {traeModalidad.descripcion}
                      </option>
                    ))}
                  </select>
                  {error.modalidadDeCompra && (
                    <div className="invalid-feedback">
                      {error.modalidadDeCompra}
                    </div>
                  )}
                </div>

                {showInput && (
                  <div className="mb-1">
                    <dt className="text-muted">Modalida de Compra</dt>
                    <input
                      type="text"
                      className={`form-control ${error.modalidadDeCompra ? "is-invalid" : ""}`}
                      name="modalidadDeCompra"
                      placeholder="Especifique otro"
                      onChange={(e) =>
                        setInventario({
                          ...Inventario,
                          modalidadDeCompra: parseInt(e.target.value),
                        })
                      }
                    />
                    {error.modalidadDeCompra && (
                      <div className="invalid-feedback">
                        {error.modalidadDeCompra}
                      </div>
                    )}
                  </div>
                )}
              </Col>
            </Row>
          </div>
        </div>
        <div className="p-1 rounded bg-white d-flex justify-content-end ">
          <button type="submit" className="btn btn-primary ">
            Siguiente
          </button>
        </div>
      </form>
    </>
  );
};

//mapea los valores del estado global de Redux
const mapStateToProps = (state: RootState) => ({
  fechaFactura: state.datosRecepcionReducer.fechaFactura,
  fechaRecepcion: state.datosRecepcionReducer.fechaRecepcion,
  modalidadDeCompra: state.datosRecepcionReducer.modalidadDeCompra,
  montoRecepcion: state.datosRecepcionReducer.montoRecepcion,
  nFactura: state.datosRecepcionReducer.nFactura,
  nOrdenCompra: state.datosRecepcionReducer.nOrdenCompra,
  nRecepcion: state.datosRecepcionReducer.nRecepcion,
  nombreProveedor: state.datosRecepcionReducer.nombreProveedor,
  origenPresupuesto: state.datosRecepcionReducer.origenPresupuesto,
  rutProveedor: state.datosRecepcionReducer.rutProveedor,
  datosTablaActivoFijo: state.datosRecepcionReducer.datosTablaActivoFijo,
  datosInventarioCompleto: state.datosInventarioReducer.datosInventarioCompleto,
});

export default connect(mapStateToProps, {})(Datos_inventario);
