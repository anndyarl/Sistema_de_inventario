import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Col, Row, Spinner } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import { connect, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../../../store";
import Swal from "sweetalert2";
import Select from "react-select";
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
  setOtraModalidadActions,
  showInputActions,
  setOtroProveedorActions
} from "../../../redux/actions/Inventario/RegistrarInventario/datosRegistroInventarioActions";
import { obtenerRecepcionActions } from "../../../redux/actions/Inventario/RegistrarInventario/obtenerRecepcionActions";
import { ActivoFijo } from "./DatosActivoFijo";
import { Eraser, Search } from "react-bootstrap-icons";
import { Objeto } from "../../Navegacion/Profile";
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
  proV_RUN: number,
  proV_NOMBRE: string
}

// Props del formulario
export interface InventarioProps {
  fechaFactura: string;
  fechaRecepcion: string;
  montoRecepcion: number;
  nFactura: string;
  nOrdenCompra: number;
  nRecepcion: number;
  origenPresupuesto: number;
  rutProveedor: string;
  usuarioCrea?: string;
  modalidadDeCompra: number;
  otraModalidad?: string;
  showInputReducer?: boolean;

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
  objeto: Objeto;
}

//Paso 1 del Formulario
const DatosInventario: React.FC<DatosInventarioProps> = ({
  onNext,
  comboOrigen,
  comboModalidad,
  comboProveedor,
  fechaFactura,
  fechaRecepcion,
  montoRecepcion,
  nFactura,
  nOrdenCompra,
  nRecepcion,
  usuarioCrea,
  origenPresupuesto,
  /*-------Modalidad compra----*/
  modalidadDeCompra,
  otraModalidad,
  showInputReducer,
  /*-------Fin Modalidad compra----*/
  rutProveedor,
  datosTablaActivoFijo,
  isDarkMode,
  objeto,
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
    otraModalidad: ""
  });

  const dispatch = useDispatch<AppDispatch>();
  const [_, setShowInput] = useState(false);
  const [error, setError] = useState<Partial<InventarioProps> & { general?: string; generalTabla?: string }>({});
  const [isMontoRecepcionEdited, setIsMontoRecepcionEdited] = useState(false); // Validaciones
  const classNames = (...classes: (string | boolean | undefined)[]): string => { return classes.filter(Boolean).join(" "); };

  const [loading, setLoading] = useState(false); // Estado para controlar la carga
  const proveedorOptions = comboProveedor.map((item) => ({
    value: item.proV_RUN.toString(),
    label: item.proV_NOMBRE,
  }));

  const handleProveedorChange = (selectedOption: any) => {
    const value = selectedOption ? selectedOption.value : "";
    setInventario((prevInventario) => ({ ...prevInventario, rutProveedor: value }));
    dispatch(setRutProveedorActions(value));
  };

  //Validaciones del formulario
  const validate = () => {
    let tempErrors: Partial<any> & {} = {};
    // Validación para N° de Recepción (debe ser un número)
    if (!Inventario.nRecepcion)
      tempErrors.nRecepcion = "Campo obligatorio";
    if (!Inventario.fechaRecepcion)
      tempErrors.fechaRecepcion = "Campo obligatorio";
    if (!Inventario.nOrdenCompra)
      tempErrors.nOrdenCompra = "Campo obligatorio";
    else if (isNaN(Inventario.nOrdenCompra))
      tempErrors.nOrdenCompra = "El N° de Orden de Compra debe ser numérico.";
    if (!Inventario.nFactura)
      tempErrors.nFactura = "Campo obligatorio";
    if (!Inventario.origenPresupuesto)
      tempErrors.origenPresupuesto = "Campo obligatorio";
    if (!Inventario.montoRecepcion)
      tempErrors.montoRecepcion = "Campo obligatorio";
    else if (!/^\d+(\.\d{1,2})?$/.test(String(Inventario.montoRecepcion)))
      tempErrors.montoRecepcion = "El Monto debe ser un número válido con hasta dos decimales.";
    if (!Inventario.fechaFactura) tempErrors.fechaFactura = "Campo obligatorio";
    if (!Inventario.rutProveedor)
      tempErrors.rutProveedor = "Campo obligatorio";
    /*---------Modalidad Compra----------*/
    if (!Inventario.modalidadDeCompra)
      tempErrors.modalidadDeCompra = "Campo obligatorio";

    if (showInputReducer) {
      if (!Inventario.otraModalidad)
        tempErrors.otraModalidad = "Campo obligatorio";
    }
    /*---------Fin Modalidad Compra----------*/
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
    } else if (name === "montoRecepcion") {
      newValue = parseFloat(value) || 0;
      dispatch(setMontoRecepcionActions(newValue as number)); // Convertido a número
    }
    else if (name === "modalidadDeCompra") {
      newValue = parseFloat(value) || 0;
      dispatch(setModalidadCompraActions(newValue as number)); // Convertido a número  
      //Al seleccionar "Otros" es decir el valor 7 este habilitará el input text
      if (value === "7") { // 7 es igual a Otros
        setShowInput(true); //estado de react para mostrar el input Otros
        dispatch(showInputActions(true)); //Se envia al estado de Otros a redux para guardarlo
      } else {
        setShowInput(false);
        dispatch(showInputActions(false));
        dispatch(setOtraModalidadActions(""));
      }
    }
    else if (name === "otraModalidad") {
      dispatch(setOtraModalidadActions(newValue as string));
    }
    else if (name === "otroProveedor") {
      dispatch(setOtroProveedorActions(newValue as string));
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
  };

  //Hook que muestra los valores al input, Sincroniza el estado local con Redux
  useEffect(() => {
    setInventario({
      fechaFactura,
      fechaRecepcion,
      modalidadDeCompra,
      ...(showInputReducer ? { otraModalidad } : {}), // Permite pasar el estado del input otraModalidad solo si es seleccionado
      montoRecepcion,
      nFactura,
      nOrdenCompra,
      nRecepcion,
      origenPresupuesto,
      rutProveedor,
      usuarioCrea: objeto.IdCredencial.toString()
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
    otraModalidad,
    showInputReducer,
    usuarioCrea
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
            rutProveedor: ""
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

  //En el componente DatosActivoFijo se encuentra el post del fomrulario completo
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validate()) {
      dispatch(setMontoRecepcionActions(Inventario.montoRecepcion));
      onNext(Inventario);
      console.log(Inventario);
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
                  <option value="">Seleccionar</option>
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
                  className={`form-control ${isDarkMode ? "bg-dark text-light border-secondary" : ""} ${error.montoRecepcion ? "is-invalid" : ""}`}
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

              <div className="mb-1">
                <label className="fw-semibold">
                  Proveedor
                </label>
                <Select
                  options={proveedorOptions}
                  onChange={handleProveedorChange}
                  name="rutProveedor"
                  value={proveedorOptions.find((option) => option.value === Inventario.rutProveedor) || null}
                  placeholder="Buscar"
                  className={`form-select-container ${error.rutProveedor ? "is-invalid" : ""}`}
                  classNamePrefix="react-select"
                  isClearable
                  isSearchable
                  styles={{
                    control: (baseStyles) => ({
                      ...baseStyles,
                      backgroundColor: isDarkMode ? "#212529" : "white", // Fondo oscuro
                      color: isDarkMode ? "white" : "#212529", // Texto blanco
                      borderColor: isDarkMode ? "rgb(108 117 125)" : "#a6a6a66e", // Bordes
                    }),
                    singleValue: (base) => ({
                      ...base,
                      color: isDarkMode ? "white" : "#212529", // Color del texto seleccionado
                    }),
                    menu: (base) => ({
                      ...base,
                      backgroundColor: isDarkMode ? "#212529" : "white", // Fondo del menú desplegable
                      color: isDarkMode ? "white" : "#212529",
                    }),
                    option: (base, { isFocused, isSelected }) => ({
                      ...base,
                      backgroundColor: isSelected ? "#6c757d" : isFocused ? "#6c757d" : isDarkMode ? "#212529" : "white",
                      color: isSelected ? "white" : isFocused ? "white" : isDarkMode ? "white" : "#212529",
                    }),
                  }}
                />

                {error.rutProveedor && (
                  <div className="invalid-feedback fw-semibold">
                    {error.rutProveedor}
                  </div>
                )}

              </div>

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
              {showInputReducer && (
                <div className="mb-1">
                  <input
                    aria-label="otraModalidad"
                    type="text"
                    className={`form-control ${isDarkMode ? "bg-secondary text-light border-secondary" : ""} ${error.otraModalidad ? "is-invalid" : ""}`}
                    name="otraModalidad"
                    placeholder="Especifique otro"
                    onChange={handleChange}
                    value={Inventario.otraModalidad || ""}
                  />
                  {error.otraModalidad && (
                    <div className="invalid-feedback fw-semibold">
                      {error.otraModalidad}
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
  montoRecepcion: state.obtenerRecepcionReducers.montoRecepcion,
  nFactura: state.obtenerRecepcionReducers.nFactura,
  nOrdenCompra: state.obtenerRecepcionReducers.nOrdenCompra,
  nRecepcion: state.obtenerRecepcionReducers.nRecepcion,
  origenPresupuesto: state.obtenerRecepcionReducers.origenPresupuesto,
  /*--------------Modalidad Compra--------------*/
  modalidadDeCompra: state.obtenerRecepcionReducers.modalidadDeCompra,
  otraModalidad: state.obtenerRecepcionReducers.otraModalidad,
  showInputReducer: state.obtenerRecepcionReducers.showInput,
  /*--------------Fin Modalidad Compra--------------*/
  rutProveedor: state.obtenerRecepcionReducers.rutProveedor,
  datosTablaActivoFijo: state.datosActivoFijoReducers.datosTablaActivoFijo,
  isDarkMode: state.darkModeReducer.isDarkMode,
  objeto: state.validaApiLoginReducers
});

export default connect(mapStateToProps, {
  obtenerRecepcionActions,
})(DatosInventario);
