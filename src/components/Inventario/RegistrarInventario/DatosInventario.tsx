import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Col, Row, Spinner } from "react-bootstrap";
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
  setModalidadCompraActions,
  vaciarDatosTabla,
  setServicioActions,
  setDependenciaActions,
  setCuentaActions,
  setBienActions,
  setDetalleActions,
  setEspecieActions,
} from "../../../redux/actions/Inventario/RegistrarInventario/datosRegistroInventarioActions";
import { obtenerRecepcionActions } from "../../../redux/actions/Inventario/RegistrarInventario/obtenerRecepcionActions";
import { ActivoFijo } from "./DatosActivoFijo";
import { Eraser, Search } from "react-bootstrap-icons";
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
// Define el tipo de los elementos del combo `Proveedor`
export interface PROVEEDOR {
  rut: number,
  nomprov: string
}

// Props del formulario
export interface InventarioProps {
  fechaFactura: string;
  fechaRecepcion: string;
  modalidadDeCompra: number;
  montoRecepcion: number;
  nFactura: string;
  nOrdenCompra: number;
  nRecepcion: number;
  origenPresupuesto: number;
  rutProveedor: string;
}

// Define el tipo de props para el componente, extendiendo InventarioProps
interface DatosInventarioProps extends InventarioProps {
  onNext: (Inventario: InventarioProps) => void; //Se pasan los datos a medida que se da siguiente al siguiente componente
  comboOrigen: ORIGEN[];
  comboModalidad: MODALIDAD[];
  comboProveedor: PROVEEDOR[];
  datosTablaActivoFijo: ActivoFijo[]; // se utliza aqui para validar el monto recepción, por si se tipea un cambio
  obtenerRecepcionActions: (nRecepcion: number) => Promise<Boolean>;
  isDarkMode: boolean;
}

//Paso 1 del Formulario
const DatosInventario: React.FC<DatosInventarioProps> = ({
  onNext,
  comboOrigen,
  comboModalidad,
  comboProveedor,
  fechaFactura,
  fechaRecepcion,
  modalidadDeCompra,
  montoRecepcion,
  nFactura,
  nOrdenCompra,
  nRecepcion,
  origenPresupuesto,
  rutProveedor,
  datosTablaActivoFijo,
  isDarkMode,
  obtenerRecepcionActions,
}) => {
  const [Inventario, setInventario] = useState<InventarioProps>({
    fechaFactura: "",
    fechaRecepcion: "",
    modalidadDeCompra: 0,
    montoRecepcion: 0,
    nFactura: "",
    nOrdenCompra: 0,
    nRecepcion: 0,
    origenPresupuesto: 0,
    rutProveedor: "",
  });

  const dispatch = useDispatch<AppDispatch>();
  const [showInputProv, setShowInputProv] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [error, setError] = useState<Partial<InventarioProps> & { general?: string; generalTabla?: string }>({});
  const [isMontoRecepcionEdited, setIsMontoRecepcionEdited] = useState(false); // Validaciones
  const classNames = (...classes: (string | boolean | undefined)[]): string => {
    return classes.filter(Boolean).join(" ");
  };
  const [loading, setLoading] = useState(false); // Estado para controlar la carga

  //Validaciones del formulario
  const validate = () => {
    let tempErrors: Partial<any> & {} = {};
    // Validación para N° de Recepción (debe ser un número)
    if (!Inventario.nRecepcion)
      tempErrors.nRecepcion = "El N° de Recepción es obligatorio.";
    if (!Inventario.fechaRecepcion)
      tempErrors.fechaRecepcion = "La Fecha de Recepción es obligatoria.";
    if (!Inventario.nOrdenCompra)
      tempErrors.nOrdenCompra = "El N° de Orden de Compra es obligatorio.";
    else if (isNaN(Inventario.nOrdenCompra))
      tempErrors.nOrdenCompra = "El N° de Orden de Compra debe ser numérico.";
    if (!Inventario.nFactura)
      tempErrors.nFactura = "El N° de Factura es obligatorio.";
    if (!Inventario.origenPresupuesto)
      tempErrors.origenPresupuesto = "El Origen de Presupuesto es obligatorio.";
    if (!Inventario.montoRecepcion)
      tempErrors.montoRecepcion = "El Monto de Recepción es obligatorio.";
    else if (!/^\d+(\.\d{1,2})?$/.test(String(Inventario.montoRecepcion)))
      tempErrors.montoRecepcion =
        "El Monto debe ser un número válido con hasta dos decimales.";
    if (!Inventario.fechaFactura)
      tempErrors.fechaFactura = "La Fecha de Factura es obligatoria.";
    if (!Inventario.rutProveedor)
      tempErrors.rutProveedor = "El Rut del Proveedor es obligatorio.";
    if (!Inventario.modalidadDeCompra)
      tempErrors.modalidadDeCompra = "La Modalidad de Compra es obligatoria.";
    else if (showInput && Inventario.modalidadDeCompra === 7) {
      tempErrors.modalidadDeCompra = "Especifique la Modalidad de Compra.";
    }
    setError(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;

    // Convierte `value` a número
    let newValue: string | number = ["montoRecepcion", "nOrdenCompra", "nRecepcion"].includes(name)
      ? parseFloat(value) || 0 // Convierte a `number`, si no es válido usa 0
      : value;

    setInventario((prevInventario) => ({
      ...prevInventario,
      [name]: newValue,
    }));

    // Ejecuta los dispatch correspondientes
    if (name === "fechaFactura") {
      dispatch(setFechaFacturaActions(newValue as string));
    } else if (name === "fechaRecepcion") {
      dispatch(setFechaRecepcionActions(newValue as string));
    } else if (name === "nFactura") {
      dispatch(setNFacturaActions(newValue as string));
    } else if (name === "nOrdenCompra") {
      newValue = parseFloat(value) || 0;
      dispatch(setNOrdenCompraActions(newValue as number)); // Convertido a número
    } else if (name === "nRecepcion") {
      dispatch(setNRecepcionActions(newValue as number)); // Convertido a número
    } else if (name === "origenPresupuesto") {
      newValue = parseFloat(value) || 0;
      dispatch(setOrigenPresupuestoActions(newValue as number)); // Convertido a número
    } else if (name === "rutProveedor") {
      newValue = parseFloat(value) || 0;
      dispatch(setRutProveedorActions(newValue as number));
    } else if (name === "montoRecepcion") {
      newValue = parseFloat(value) || 0;
      dispatch(setMontoRecepcionActions(newValue as number)); // Convertido a número
    }

    if (name === "montoRecepcion" && datosTablaActivoFijo.length > 0) {
      if (!isMontoRecepcionEdited) {
        Swal.fire({
          icon: "warning",
          title: "¿Está seguro que desea modificar monto recepción?",
          text: "Si modifica el monto recepción se perderán los datos en la tabla activos fijos.",
          showCancelButton: true,
          confirmButtonText: "Si, Modificar",
          cancelButtonText: "Cancelar",
          background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
          color: `${isDarkMode ? "#ffffff" : "000000"}`,
          confirmButtonColor: `${isDarkMode ? "#007bff" : "444"}`,
          customClass: {
            popup: "custom-border", // Clase personalizada para el borde
          }
        }).then((result) => {
          if (result.isConfirmed) {
            setInventario((prevInventario) => ({
              ...prevInventario,
              [name]: 0,
            }));
            setIsMontoRecepcionEdited(true);
            dispatch(vaciarDatosTabla());
          }
          else {
            setInventario((prevInventario) => ({
              ...prevInventario,
              [name]: Inventario.montoRecepcion,
            }));
          }
        });
        return;
      }
    }

    //Al seleccionar "otros" es decir el valor 7 este habilitará el input text
    if (name === "modalidadDeCompra") {
      if (value === "7") {
        newValue = parseFloat(value) || 0;
        dispatch(setModalidadCompraActions(newValue as number));
        setShowInput(true);
      } else {
        newValue = parseFloat(value) || 0;
        dispatch(setModalidadCompraActions(newValue as number));
        setShowInput(false);
      }
    }

    //Al seleccionar "otros" es decir el valor 3132 este habilitará el input text
    if (name === "rutProveedor") {
      if (value === "0") {
        newValue = value;
        dispatch(setRutProveedorActions(newValue));
        setShowInputProv(true);
      } else {
        newValue = value;
        dispatch(setRutProveedorActions(newValue));
        setShowInputProv(false);
      }
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
    origenPresupuesto,
    rutProveedor,
  ]);

  const handleRecepcionSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setLoading(true); // Inicia el estado de carga
    if (!Inventario.nRecepcion) {
      Swal.fire({
        icon: "warning",
        title: "Por favor, ingrese un número de recepción.",
        confirmButtonText: "Ok",
        background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
        color: `${isDarkMode ? "#ffffff" : "000000"}`,
        confirmButtonColor: `${isDarkMode ? "#007bff" : "444"}`,
        customClass: {
          popup: "custom-border", // Clase personalizada para el borde
        }
      });
      setLoading(false);
      return;
    }
    // Despacha la acción para obtener la recepción en el formulario de activos fijos
    const resultado = await obtenerRecepcionActions(Inventario.nRecepcion);
    if (!resultado) {
      Swal.fire({
        icon: "error",
        title: ":'(",
        text: "No se encontraron resultados, inténte otro registro.",
        confirmButtonText: "Ok",
        background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
        color: `${isDarkMode ? "#ffffff" : "000000"}`,
        confirmButtonColor: `${isDarkMode ? "#007bff" : "444"}`,
        customClass: {
          popup: "custom-border", // Clase personalizada para el borde
        }
      });
      setLoading(false); //Finaliza estado de carga
      return;
    } else {
      setLoading(false); //Finaliza estado de carga
    }
  };
  const handleLimpiar = () => {
    const tieneDatos = Object.values(Inventario).some((valor) => valor !== "" && valor !== 0);
    if (tieneDatos) {
      Swal.fire({
        icon: "warning",
        title: "¿Está seguro de que desea limpiar el formulario?",
        text: "Esta acción eliminará todos los datos ingresados en los pasos completados.",
        showCancelButton: true,
        confirmButtonText: "Si, Limpiar",
        cancelButtonText: "Cancelar",
        background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
        color: `${isDarkMode ? "#ffffff" : "000000"}`,
        confirmButtonColor: `${isDarkMode ? "#007bff" : "444"}`,
        customClass: {
          popup: "custom-border", // Clase personalizada para el borde
        }
      }).then((result) => {
        if (result.isConfirmed) {
          setInventario((prevInventario) => ({
            ...prevInventario,
            fechaFactura: "",
            fechaRecepcion: "",
            modalidadDeCompra: 0,
            montoRecepcion: 0,
            nFactura: "",
            nOrdenCompra: 0,
            nRecepcion: 0,
            nombreProveedor: "",
            origenPresupuesto: 0,
            rutProveedor: "",
          }));
          dispatch(setNRecepcionActions(0));
          dispatch(setFechaRecepcionActions(""));
          dispatch(setNOrdenCompraActions(0));
          dispatch(setNFacturaActions(""));
          dispatch(setOrigenPresupuestoActions(0));
          dispatch(setMontoRecepcionActions(0));
          dispatch(setFechaFacturaActions(""));
          dispatch(setRutProveedorActions(""));
          dispatch(setModalidadCompraActions(0));
          dispatch(setModalidadCompraActions(0));
          dispatch(setServicioActions(0));
          dispatch(setDependenciaActions(0));
          dispatch(setCuentaActions(0));
          dispatch(setBienActions(0));
          dispatch(setDetalleActions(0));
          dispatch(setEspecieActions(""));
          dispatch(vaciarDatosTabla());
        }
      });
    }
  }
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validate()) {
      dispatch(setMontoRecepcionActions(Inventario.montoRecepcion)); // Convertido a número
      onNext(Inventario);
      // console.log(Inventario);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className={`border border-botom p-4 rounded ${isDarkMode ? "darkModePrincipal text-light border-secondary" : ""}`}>
          <h3 className="form-title fw-semibold border-bottom p-1">
            Registrar Inventario
          </h3>
          <Row>
            <Col md={4}>
              {/* Nº Recepción */}
              <div className="mb-1">
                <label className="fw-semibold">
                  Nº Recepción
                </label>
                <div className="d-flex align-items-center">
                  <input
                    aria-label="nRecepcion"
                    type="text"
                    className={`form-control ${isDarkMode ? "bg-dark text-light border-secondary" : ""} ${error.nRecepcion ? "is-invalid" : ""}`}
                    maxLength={12}
                    name="nRecepcion"
                    onChange={handleChange}
                    value={Inventario.nRecepcion}
                  />
                  <Button
                    onClick={handleRecepcionSubmit}
                    variant="primary"
                    className={`btn ${isDarkMode ? "btn-secondary" : "btn-primary"}  m-1`}
                  >
                    {loading ? (
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                      />
                    ) : (
                      <Search
                        className={classNames("flex-shrink-0", "h-5 w-5")}
                        aria-hidden="true"
                      />
                    )}
                  </Button>
                  <Button onClick={handleLimpiar} variant="primary" className={`btn ${isDarkMode ? "btn-secondary" : "btn-primary"}  m-1`}>
                    <Eraser
                      className={classNames("flex-shrink-0", "h-5 w-5")}
                      aria-hidden="true"
                    />
                  </Button>
                </div>
                {error.nRecepcion && (
                  <div className="invalid-feedback fw-semibold d-block">
                    {error.nRecepcion}
                  </div>
                )}
              </div>

              {/* Fecha Recepción */}
              <div className="mb-1">
                <label className="fw-semibold">
                  Fecha Recepción
                </label>
                <input
                  aria-label="fechaRecepcion"
                  type="date"
                  className={`form-control ${isDarkMode ? "bg-dark text-light border-secondary" : ""} ${error.fechaRecepcion ? "is-invalid" : ""}`}
                  name="fechaRecepcion"
                  onChange={handleChange}
                  value={Inventario.fechaRecepcion}
                />
                {error.fechaRecepcion && (
                  <div className="invalid-feedback fw-semibold">{error.fechaRecepcion}</div>
                )}
              </div>

              {/* N° Orden de Compra */}
              <div className="mb-1">
                <label className="fw-semibold">
                  N° Orden de Compra
                </label>
                <input
                  aria-label="nOrdenCompra"
                  type="text"
                  className={`form-control ${isDarkMode ? "bg-dark text-light border-secondary" : ""
                    } ${error.nOrdenCompra ? "is-invalid" : ""}`}
                  maxLength={12}
                  name="nOrdenCompra"
                  onChange={handleChange}
                  value={Inventario.nOrdenCompra}
                />
                {error.nOrdenCompra && (
                  <div className="invalid-feedback fw-semibold">{error.nOrdenCompra}</div>
                )}
              </div>
            </Col>
            <Col md={4}>
              {/* Nº Factura */}
              <div className="mb-1">
                <label className="fw-semibold">
                  Nº Factura
                </label>
                <input
                  aria-label="nFactura"
                  type="text"
                  className={`form-control ${isDarkMode ? "bg-dark text-light border-secondary" : ""
                    } ${error.nFactura ? "is-invalid" : ""}`}
                  maxLength={12}
                  name="nFactura"
                  onChange={handleChange}
                  value={Inventario.nFactura}
                />
                {error.nFactura && (
                  <div className="invalid-feedback fw-semibold">{error.nFactura}</div>
                )}
              </div>

              {/* Origen Presupuesto */}
              <div className="mb-1">
                <label className="fw-semibold">
                  Origen Presupuesto
                </label>
                <select
                  aria-label="origenPresupuesto"
                  className={`form-select ${isDarkMode ? "bg-dark text-light border-secondary" : ""
                    } ${error.origenPresupuesto ? "is-invalid" : ""}`}
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
                  <div className="invalid-feedback fw-semibold">{error.origenPresupuesto}</div>
                )}
              </div>

              {/* Monto Recepción */}
              <div className="mb-1">
                <label className="fw-semibold">
                  Monto Recepción
                </label>
                <input
                  aria-label="montoRecepcion"
                  type="text"
                  className={`form-control ${isDarkMode ? "bg-dark text-light border-secondary" : ""
                    } ${error.montoRecepcion ? "is-invalid" : ""}`}
                  maxLength={12}
                  name="montoRecepcion"
                  onChange={handleChange}
                  value={Inventario.montoRecepcion}
                />
                {error.montoRecepcion && (
                  <div className="invalid-feedback fw-semibold">{error.montoRecepcion}</div>
                )}
              </div>
            </Col>
            <Col md={4}>
              {/* Fecha Factura */}
              <div className="mb-1">
                <label className="fw-semibold">
                  Fecha Factura
                </label>
                <input
                  aria-label="fechaFactura"
                  type="date"
                  className={`form-control ${isDarkMode ? "bg-dark text-light border-secondary" : ""
                    } ${error.fechaFactura ? "is-invalid" : ""}`}
                  name="fechaFactura"
                  onChange={handleChange}
                  value={Inventario.fechaFactura}
                />
                {error.fechaFactura && (
                  <div className="invalid-feedback fw-semibold">{error.fechaFactura}</div>
                )}
              </div>

              {/* Proveedor */}
              <div className="mb-1">
                <label className="fw-semibold">
                  Proveedor
                </label>
                <select
                  aria-label="rutProveedor"
                  className={`form-select ${isDarkMode ? "bg-dark text-light border-secondary" : ""} ${error.rutProveedor ? "is-invalid" : ""}`}
                  name="rutProveedor"
                  onChange={handleChange}
                  value={Inventario.rutProveedor}
                >
                  <option value="">Seleccione un Proveedor</option>
                  {comboProveedor.map((traeProveedor) => (
                    <option key={traeProveedor.rut} value={traeProveedor.rut}>
                      {traeProveedor.nomprov}
                    </option>
                  ))}
                </select>
                {error.rutProveedor && (
                  <div className="invalid-feedback fw-semibold">{error.rutProveedor}</div>
                )}
              </div>

              {showInputProv && (
                <div className="mb-1">
                  <input
                    aria-label="rutProveedor"
                    type="text"
                    pattern="[A-Za-zÑñÁáÉéÍíÓóÚúÜü\s]+"
                    className={`form-control ${isDarkMode ? "bg-secondary text-light border-secondary" : ""} ${error.rutProveedor ? "is-invalid" : ""}`}
                    name="rutProveedor"
                    placeholder="Especifique otro"
                    onChange={(e) =>
                      setInventario({
                        ...Inventario,
                        rutProveedor: e.target.value,
                      })
                    }
                  />
                  {error.rutProveedor && (
                    <div className="invalid-feedback fw-semibold">
                      {error.rutProveedor}
                    </div>
                  )}
                </div>
              )}

              {/* Modalidad de Compra */}
              <div className="mb-1">
                <label className="fw-semibold">
                  Modalidad de Compra
                </label>
                <select
                  aria-label="modalidadDeCompra"
                  className={`form-select ${isDarkMode ? "bg-dark text-light border-secondary" : ""} ${error.modalidadDeCompra ? "is-invalid" : ""}`}
                  name="modalidadDeCompra"
                  onChange={handleChange}
                  value={Inventario.modalidadDeCompra}
                >
                  <option value="">Seleccionar</option>
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
                  <div className="invalid-feedback fw-semibold">
                    {error.modalidadDeCompra}
                  </div>
                )}
              </div>
              {showInput && (
                <div className="mb-1">
                  <input
                    aria-label="modalidadDeCompra"
                    type="text"
                    className={`form-control ${isDarkMode ? "bg-secondary text-light border-secondary" : ""} ${error.modalidadDeCompra ? "is-invalid" : ""}`}
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
                    <div className="invalid-feedback fw-semibold">
                      {error.modalidadDeCompra}
                    </div>
                  )}
                </div>
              )}
            </Col>
          </Row>
          <div className="rounded d-flex justify-content-end m-2">
            <button type="submit" className={`btn ${isDarkMode ? "btn-secondary" : "btn-primary"}  m-1`}>
              Siguiente
            </button>
          </div>
        </div>
      </form>

    </>
  );
};

//mapea los valores del estado global de Redux
const mapStateToProps = (state: RootState) => ({
  fechaFactura: state.obtenerRecepcionReducers.fechaFactura,
  fechaRecepcion: state.obtenerRecepcionReducers.fechaRecepcion,
  modalidadDeCompra: state.obtenerRecepcionReducers.modalidadDeCompra,
  montoRecepcion: state.obtenerRecepcionReducers.montoRecepcion,
  nFactura: state.obtenerRecepcionReducers.nFactura,
  nOrdenCompra: state.obtenerRecepcionReducers.nOrdenCompra,
  nRecepcion: state.obtenerRecepcionReducers.nRecepcion,
  nombreProveedor: state.obtenerRecepcionReducers.nombreProveedor,
  origenPresupuesto: state.obtenerRecepcionReducers.origenPresupuesto,
  rutProveedor: state.obtenerRecepcionReducers.rutProveedor,
  datosTablaActivoFijo: state.datosActivoFijoReducers.datosTablaActivoFijo,
  isDarkMode: state.darkModeReducer.isDarkMode
});

export default connect(mapStateToProps, {
  obtenerRecepcionActions,
})(DatosInventario);
