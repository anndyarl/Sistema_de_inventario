import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button, Form, Pagination, Row, Col, Spinner, OverlayTrigger, Tooltip, } from "react-bootstrap";
import React, { useState, useMemo, useEffect } from "react";
import { connect, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../../../store.ts";
import { setDependenciaActions, setServicioActions, setCuentaActions, setEspecieActions, setDescripcionEspecieActions, setNombreEspecieActions, } from "../../../redux/actions/Inventario/RegistrarInventario/datosRegistroInventarioActions.tsx";
import { Check2Circle, Plus, Search } from "react-bootstrap-icons";
import Select from "react-select";
import { Objeto } from "../../Navegacion/Profile.tsx";
import Swal from "sweetalert2";
import { comboEspeciesBienActions } from "../../../redux/actions/Inventario/Combos/comboEspeciesBienActions.tsx";
import { listadoDeEspeciesBienActions } from "../../../redux/actions/Inventario/Combos/listadoDeEspeciesBienActions.tsx";
const classNames = (...classes: (string | boolean | undefined)[]): string => {
  return classes.filter(Boolean).join(" ");
};
// Define el tipo de los elementos del combo `servicio`
export interface SERVICIO {
  codigo: number;
  nombrE_ORD: string;
  descripcion: string;
}

// Define el tipo de los elementos del combo `dependencia`
export interface DEPENDENCIA {
  codigo: number;
  descripcion: string;
  nombrE_ORD: string;
}

// Define el tipo de los elementos del combo `cuentas`
export interface CUENTA {
  codigo: number;
  descripcion: string;
}


// Define el tipo de los elementos del combo `bien`
export interface BIEN {
  codigo: string;
  descripcion: string;
}

// Define el tipo de los elementos del combo `detalles`
export interface DETALLE {
  codigo: string;
  descripcion: string;
}

// Define el tipo de los elementos del combo `ListaEspecie`
export interface ListaEspecie {
  estabL_CORR: number;
  esP_CODIGO: string;
  nombrE_ESP: string;
}
//Props del formulario
export interface CuentaProps {
  servicio: number;
  cuenta: number;
  dependencia: number;
  especie: string;
  bien?: number;
}

// Define el tipo de props para el componente, extendiendo InventarioProps
interface DatosCuentaProps extends CuentaProps {
  onNext: (Cuenta: CuentaProps) => void;
  onBack: () => void;
  comboServicio: SERVICIO[];
  comboDependencia: DEPENDENCIA[];
  comboCuenta: CUENTA[];
  //Dentro del modal
  comboBien: BIEN[];
  comboDetalle: DETALLE[];
  listaEspecie: ListaEspecie[];
  onServicioSeleccionado: (codigoServicio: string) => void; // Nueva prop para pasar el servicio seleccionado
  servicioSeleccionado: string | null | undefined; // Estado que se pasa como prop para mantener el valor seleccionado
  onBienSeleccionado: (codigoBien: string) => void; // Nueva prop para pasar el bien seleccionado
  bienSeleccionado: string | null | undefined; // Estado que se pasa como prop para mantener el valor seleccionado
  onDetalleSeleccionado: (codigoDetalle: number) => void; // Nueva prop para pasar el detalle seleccionado
  detalleSeleccionado: string | number | null | undefined; // Estado que se pasa como prop para mantener el valor seleccionado
  onEspecieSeleccionado: (nombreEspecie: string) => void; // Nueva prop para pasar el detalle seleccionado
  especieSeleccionado: string | null | undefined;
  descripcionEspecie: string; // se utiliza solo para guardar la descripcion completa en el input de especie  
  comboEspeciesBienActions: (EST: number, IDBIEN: number) => Promise<boolean>; //Carga Combo Especie
  listadoDeEspeciesBienActions: (EST: number, IDBIEN: number, esP_CODIGO: string, esP_NOMBRE: string) => Promise<boolean>; //Lista Especies en tabla
  comboEspecies: ListaEspecie[];
  isDarkMode: boolean;
  objeto: Objeto;
}
//Paso 2 del Formulario
const DatosCuenta: React.FC<DatosCuentaProps> = ({
  onNext,
  onBack,
  onServicioSeleccionado,
  onBienSeleccionado,
  onDetalleSeleccionado,
  onEspecieSeleccionado,
  comboEspeciesBienActions,
  listadoDeEspeciesBienActions,
  //Combos
  comboServicio,
  comboCuenta,
  comboDependencia,
  comboBien,
  comboDetalle,
  listaEspecie,
  comboEspecies,
  //inputs
  servicio,
  cuenta,
  dependencia,
  especie,
  bien,
  // detalles,
  descripcionEspecie,
  isDarkMode,
  objeto
}) => {

  const [Cuenta, setCuenta] = useState({
    servicio: 0,
    cuenta: 0,
    mantenerCuenta: true,
    dependencia: 0,
    especie: "",
    bien: 0
  });

  const [Especies, setEspecies] = useState({
    estableEspecie: 0,
    codigoEspecie: "",
    nombreEspecie: "",
    descripcionEspecie: "",
  });
  const dispatch = useDispatch<AppDispatch>();
  const [mostrarModal, setMostrarModal] = useState(false);
  const [filasSeleccionadas, setFilasSeleccionadas] = useState<string[]>([]);
  const [elementoSeleccionado, setElementoSeleccionado] = useState<ListaEspecie>();
  const [paginaActual, setPaginaActual] = useState(1);
  const elementosPorPagina = 20;
  const [error, setError] = useState<Partial<CuentaProps>>({});
  const [loading, setLoading] = useState(false);
  const [detalleSeleccionado, setDetalleSeleccionado] = useState<number | null>(null);

  const especieOptions = comboEspecies.map((item) => ({
    value: item.esP_CODIGO,
    label: item.nombrE_ESP,
  }));

  const [Buscar, setBuscar] = useState({
    esP_CODIGO: "",
    esp_NOMBRE: ""
  });

  // Si selecciona desde el combo
  const handleComboEspecieChange = (selectedOption: any) => {
    const value = selectedOption ? selectedOption.value : "";
    setBuscar((prev) => ({ ...prev, esP_CODIGO: value }));
    console.log("select:", value);
  };

  // Si escribe a mano
  const handleInputEspecieChange = (input: string) => {
    setBuscar((prev) => ({ ...prev, esp_NOMBRE: input }));
    console.log("texto:", input);
    handleBuscar();
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;

    // Convierte `value` a número
    let newValue: string | number = ["servicio", "dependencia", "especie", "cuenta", "bien"].includes(name)
      ? parseFloat(value) || 0 // Convierte a `number`, si no es válido usa 0
      : value;

    setCuenta((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    // Otras condiciones para diferentes campos del formulario
    // Condiciones para los campos específicos
    if (name === "servicio") {
      onServicioSeleccionado(value);
      dispatch(setServicioActions(newValue as number));
      // Restablece dependencia al seleccionar un nuevo servicio
      setCuenta((prev) => ({ ...prev, dependencia: 0 })); // Limpia dependencia localmente     
    }
    if (name === "dependencia") {
      dispatch(setDependenciaActions(newValue as number));
    }
    if (name === "cuenta") {
      dispatch(setCuentaActions(newValue as number));
    }
    if (name === "bien") {
      onBienSeleccionado(value);
    }
    if (name === "detalles") {
      paginar(1);
      onDetalleSeleccionado(newValue as number);
      setDetalleSeleccionado(newValue as number);
    }

  };

  //Validaciones del formulario
  const validate = () => {
    let tempErrors: Partial<any> & {} = {};
    // Validación para N° de Recepción (debe ser un número)
    if (!Cuenta.servicio) tempErrors.servicio = "El Servicio es obligatorio.";
    if (!Cuenta.dependencia)
      tempErrors.dependencia = "La Dependencia es obligatoria.";
    if (!Cuenta.especie) tempErrors.especie = "La Especie es obligatorio.";
    if (!Cuenta.cuenta) tempErrors.cuenta = "La Cuenta es obligatorio.";

    setError(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const { mantenerCuenta } = Cuenta;
  useEffect(() => {
    setCuenta({
      servicio,
      cuenta,
      mantenerCuenta,
      dependencia,
      especie,
      bien: bien ?? 0
    });
  }, [servicio, cuenta, mantenerCuenta, dependencia, especie, bien]);

  //Se usa useEffect en este caso de Especie ya que por handleChange no detecta el cambio
  // debido que este se pasa por una seleccion desde el modal en la selccion que se hace desde el listado
  useEffect(() => {
    //Carga combo especies
    if (comboEspecies.length === 0) {
      comboEspeciesBienActions(objeto.Roles[0].codigoEstablecimiento, 0);
    }

    // Detecta si el valor de 'especie' ha cambiado
    if (Especies.codigoEspecie) {
      onEspecieSeleccionado(Especies.codigoEspecie);
      dispatch(setEspecieActions(Cuenta.especie));
      dispatch(setDescripcionEspecieActions(Especies.descripcionEspecie));
      if (parseInt(Especies.codigoEspecie) > 0) {
        dispatch(setNombreEspecieActions(Especies.codigoEspecie));
      }

      setCuenta((cuentaPrevia) => ({ ...cuentaPrevia, cuenta: 0 })); // Limpia cuenta localmente

    }
  }, [Especies.codigoEspecie]);

  //validar estructura del formulario.
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validate()) {
      onNext(Cuenta);
    }
  };

  const handleVolver = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    onBack();
  };

  const handleBuscar = async () => {
    setLoading(true);
    let resultado = false;
    if (Buscar.esP_CODIGO && Buscar.esP_CODIGO.includes("-")) {
      // Seleccionó del combo: usar código
      resultado = await listadoDeEspeciesBienActions(objeto.Roles[0].codigoEstablecimiento, 0, Buscar.esP_CODIGO, "");
    } else if (Buscar.esp_NOMBRE && Buscar.esp_NOMBRE.trim() !== "") {
      // Escribió manualmente: usar nombre   
      resultado = await listadoDeEspeciesBienActions(objeto.Roles[0].codigoEstablecimiento, 0, "", Buscar.esp_NOMBRE);
    } else {
      resultado = await listadoDeEspeciesBienActions(objeto.Roles[0].codigoEstablecimiento, detalleSeleccionado ?? 0, "", "");
      setLoading(false);
      return;
    }
    if (!resultado) {
      Swal.fire({
        icon: "warning",
        title: "Especie no encontrada",
        text: "La especie consultado no ha sido encontrada",
        confirmButtonText: "Ok",
      });
      setLoading(false); //Finaliza estado de carga
      return;
    } else {
      paginar(1);
      setLoading(false); //Finaliza estado de carga
    }
    setLoading(false);
  };

  //Selecciona fila del listado de especies
  const handleSeleccionFila = (index: number) => {
    const item = listaEspecie[index];
    setFilasSeleccionadas([index.toString()]);
    setElementoSeleccionado(item);
  };

  const handleSubmitSeleccionado = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (typeof elementoSeleccionado === "object" && elementoSeleccionado !== null) {
      const estableEspecie = (elementoSeleccionado as ListaEspecie).estabL_CORR;
      const codigoEspecie = (elementoSeleccionado as ListaEspecie).esP_CODIGO;
      const nombreEspecie = `${(elementoSeleccionado as ListaEspecie).nombrE_ESP}`;
      const descripcionEspecie = (elementoSeleccionado as ListaEspecie).esP_CODIGO + " | " + `${(elementoSeleccionado as ListaEspecie).nombrE_ESP}`;
      // Actualiza tanto el estado 'Especies' como el estado 'Cuenta.especie'
      setEspecies({
        estableEspecie,
        codigoEspecie,
        nombreEspecie,
        descripcionEspecie,
      });
      setCuenta((cuentaPrevia) => ({
        ...cuentaPrevia,
        especie: codigoEspecie.toString(), // Actualiza el campo 'especie' en el estado de 'Cuenta'
      }));
      // Resetea el estado de las filas seleccionadas para desmarcar el checkbox
      setFilasSeleccionadas([]);

      setMostrarModal(false); // Cierra el modal
    } else {
      // console.log("No se ha seleccionado ningún elemento.");
    }
  };

  // Lógica de Paginación actualizada
  const indiceUltimoElemento = paginaActual * elementosPorPagina;
  const indicePrimerElemento = indiceUltimoElemento - elementosPorPagina;
  const elementosActuales = useMemo(
    () => listaEspecie.slice(indicePrimerElemento, indiceUltimoElemento),
    [listaEspecie, indicePrimerElemento, indiceUltimoElemento]
  );
  const totalPaginas = Math.ceil(listaEspecie.length / elementosPorPagina);
  // const totalPaginas = Array.isArray(listaEspecie) ? Math.ceil(listaEspecie.length / elementosPorPagina) : 0;

  const paginar = (numeroPagina: number) => setPaginaActual(numeroPagina);

  return (
    <>
      <form onSubmit={handleSubmit} className={isDarkMode ? "bg-dark text-light" : ""}>
        <div className={`border border-botom p-4 rounded ${isDarkMode ? "darkModePrincipal text-light border-secondary" : ""}`}>
          <h3 className="form-title fw-semibold border-bottom p-1">
            Detalles de Inventario
          </h3>
          <p className="p-1  fw-semibold">* Campos obligatorios</p>
          <Row>
            <Col md={6}>
              <div className="mt-2">
                <label className="fw-semibold">Servicio *</label>
                <select
                  aria-label="servicio"
                  className={`form-select ${isDarkMode ? "bg-dark text-light border-secondary" : ""} ${error.servicio ? "is-invalid" : ""}`}
                  name="servicio"
                  onChange={handleChange}
                  value={Cuenta.servicio}
                >
                  <option value="">Seleccione un origen</option>
                  {comboServicio.map((traeServicio) => (
                    <option key={traeServicio.codigo} value={traeServicio.codigo}>
                      {traeServicio.nombrE_ORD}
                    </option>
                  ))}
                </select>
                {error.servicio && (
                  <div className="invalid-feedback fw-semibold">{error.servicio}</div>
                )}
              </div>
              <div className="mt-1">
                <label className="fw-semibold">Dependencia *</label>
                <select
                  aria-label="dependencia"
                  className={`form-select ${isDarkMode ? "bg-dark text-light border-secondary" : ""} ${error.dependencia ? "is-invalid" : ""}`}
                  name="dependencia"
                  onChange={handleChange}
                  value={Cuenta.dependencia}
                  disabled={!Cuenta.servicio}
                >
                  <option value="">Seleccionar</option>
                  {comboDependencia.map((traeDependencia) => (
                    <option key={traeDependencia.codigo} value={traeDependencia.codigo}>
                      {traeDependencia.nombrE_ORD}
                    </option>
                  ))}
                </select>
                {error.dependencia && (
                  <div className="invalid-feedback fw-semibold">{error.dependencia}</div>
                )}
              </div>
            </Col>
            <Col md={6}>
              <div className="mb-1">
                <label className="fw-semibold">Especie *</label>
                <dd className="d-flex align-items-center">
                  <input
                    aria-label="especie"
                    className={`form-control ${isDarkMode ? "bg-dark text-light border-secondary" : ""} ${error.especie ? "is-invalid" : ""}`}
                    type="text"
                    name="especie"
                    value={Especies.descripcionEspecie || descripcionEspecie || "Haz clic en más para seleccionar una especie"}
                    onChange={handleChange}
                    disabled
                  />
                  <Button
                    variant="primary"
                    onClick={() => setMostrarModal(true)}
                    className={`btn ${isDarkMode ? "btn-secondary" : "btn-primary"}  m-1`}>
                    <Plus className={classNames("flex-shrink-0", "h-5 w-5")} aria-hidden="true" />
                  </Button>
                </dd>
                {error.especie && (
                  <div className="invalid-feedback fw-semibold d-block">
                    {error.especie}
                  </div>
                )}
              </div>
              <div className="mb-1">
                <label className="fw-semibold">Cuenta *</label>
                <select
                  aria-label="cuenta"
                  className={`form-select ${isDarkMode ? "bg-dark text-light border-secondary" : ""} ${error.cuenta ? "is-invalid" : ""}`}
                  name="cuenta"
                  onChange={handleChange}
                  value={Cuenta.cuenta}
                >
                  <option value="">Selecciona una opción</option>
                  {comboCuenta.map((traeCuentas) => (
                    <option key={traeCuentas.codigo} value={traeCuentas.codigo}>
                      {traeCuentas.descripcion}
                    </option>
                  ))}
                </select>
                {error.cuenta && (
                  <div className="invalid-feedback fw-semibold">{error.cuenta}</div>
                )}
              </div>
            </Col>
          </Row>
          <div className={`p-1 rounded d-flex justify-content-between ${isDarkMode ? "darkModePrincipal" : "bg-white"}`}>
            <Button onClick={handleVolver} className={`btn ${isDarkMode ? "btn-secondary" : "btn-primary"}  m-1`}>
              Volver
            </Button>
            <Button type="submit" className={`btn ${isDarkMode ? "btn-secondary" : "btn-primary"}  m-1`}>
              Siguiente
            </Button>
          </div>
        </div>
      </form>
      {/* Modal formulario Activos Fijo*/}
      <Modal
        show={mostrarModal}
        onHide={() => setMostrarModal(false)}
        size="lg"
        className="modal-fullscreen-sm-down"
      >
        <Modal.Header className={`${isDarkMode ? "darkModePrincipal" : ""}`} closeButton>
          <Modal.Title>Listado de Especies</Modal.Title>
        </Modal.Header>

        <Modal.Body className={`${isDarkMode ? "darkModePrincipal" : ""}`}>
          <form onSubmit={handleSubmitSeleccionado}>
            <Row className="mb-2">
              {/* Bien / Detalles */}
              <Col xs={12} md={6}>
                <div className="mb-1">
                  <label aria-label="bien" className="fw-semibold">Bien</label>
                  <select
                    aria-label="bien"
                    name="bien"
                    className={`form-select ${isDarkMode ? "bg-dark text-light border-secondary" : ""}`}
                    onChange={handleChange}
                  >
                    <option value="">Seleccionar</option>
                    {comboBien.map((traeBien) => (
                      <option key={traeBien.codigo} value={traeBien.codigo}>
                        {traeBien.descripcion}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-1">
                  <label className="fw-semibold">Detalles</label>
                  <select
                    aria-label="detalles"
                    name="detalles"
                    className={`form-select ${isDarkMode ? "bg-dark text-light border-secondary" : ""}`}
                    onChange={handleChange}
                    disabled={!Cuenta.bien}
                  >
                    <option value="">Seleccionar</option>
                    {comboDetalle.map((traeDetalles) => (
                      <option key={traeDetalles.codigo} value={traeDetalles.codigo}>
                        {traeDetalles.descripcion}
                      </option>
                    ))}
                  </select>
                </div>
              </Col>

              <Col xs={12} md={6}>
                {/* Especie */}
                <div className="mb-1">
                  <label className="fw-semibold">
                    Buscar Especie
                  </label>
                  <div className="d-flex align-items-center">
                    <Select
                      options={especieOptions}
                      onChange={(selectedOption) => handleComboEspecieChange(selectedOption)}
                      onInputChange={(inputValue) => handleInputEspecieChange(inputValue)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleBuscar();
                        }
                      }}
                      name="esP_CODIGO"
                      placeholder="Buscar"
                      isClearable
                      classNamePrefix="react-select"
                      className="w-100 mx-1"
                      styles={{
                        control: (base) => ({
                          ...base,
                          backgroundColor: isDarkMode ? "#212529" : "white",
                          color: isDarkMode ? "white" : "#212529",
                          borderColor: isDarkMode ? "rgb(108 117 125)" : "#a6a6a66e",

                        }),
                        singleValue: (base) => ({
                          ...base,
                          color: isDarkMode ? "white" : "#212529",
                        }),
                        menu: (base) => ({
                          ...base,
                          backgroundColor: isDarkMode ? "#212529" : "white",
                          color: isDarkMode ? "white" : "#212529",

                        }),
                        option: (base, { isFocused, isSelected }) => ({
                          ...base,
                          backgroundColor:
                            isSelected || isFocused ? "#6c757d" : isDarkMode ? "#212529" : "white",
                          color:
                            isSelected || isFocused ? "white" : isDarkMode ? "white" : "#212529",
                        }),
                      }}
                    />
                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip id="tooltip-limpiar">Buscar</Tooltip>}
                    >
                      <Button
                        onClick={handleBuscar}
                        variant={isDarkMode ? "secondary" : "primary"}
                        className="w-md-auto"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <Spinner
                              as="span"
                              animation="border"
                              size="sm"
                              role="status"
                              aria-hidden="true"
                              className="ms-1"
                            />
                          </>
                        ) : (
                          <>
                            <Search className="ms-1" />
                          </>
                        )}
                      </Button>
                    </OverlayTrigger>
                  </div>
                </div>
              </Col>
            </Row>

            {listaEspecie.length > 0 && (
              <Col xs={12} className="d-flex justify-content-end ">
                <Button
                  variant={isDarkMode ? "secondary" : "primary"}
                  type="submit"
                  className="mb-1"
                  disabled={!filasSeleccionadas.length}
                >
                  Seleccionar <Check2Circle className="ms-1" />
                </Button>
              </Col>
            )}

          </form>
          {/* Tabla responsive */}
          {listaEspecie.length != 0 ? (
            <div className="table-responsive" style={{ maxHeight: "50vh", overflowY: "auto" }}>
              <table className={`table ${isDarkMode ? "table-dark" : "table-hover table-striped"}`}>
                <thead className={`sticky-top z-0 ${isDarkMode ? "table-dark" : "table-light"}`}>
                  <tr>
                    <th></th>
                    <th className={isDarkMode ? "text-light" : "text-dark"}>Código</th>
                    <th className={isDarkMode ? "text-light" : "text-dark"}>Especie</th>
                  </tr>
                </thead>
                <tbody>
                  {elementosActuales.map((listadoEspecies, index) => (
                    <tr key={index}>
                      <td>
                        <Form.Check
                          type="checkbox"
                          onChange={() => handleSeleccionFila(indicePrimerElemento + index)}
                          checked={filasSeleccionadas.includes(
                            (indicePrimerElemento + index).toString()
                          )}
                        />
                      </td>
                      <td className={isDarkMode ? "text-light" : "text-dark"}>
                        {listadoEspecies.esP_CODIGO}
                      </td>
                      <td className={isDarkMode ? "text-light" : "text-dark"}>
                        {listadoEspecies.nombrE_ESP}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className={`text-center m-2 p-2 rounded fs-05em fw-semibold ${isDarkMode ? 'bg-dark text-light border border-secondary' : 'bg-light text-muted border'}`}>
              Aplique un filtro para visualizar los detalles de cada especie aquí.
            </p>

          )}
          {/* Paginador */}
          {listaEspecie.length > 10 && (
            <div className="paginador-container mt-3">
              <Pagination className="paginador-scroll justify-content-center">
                <Pagination.First onClick={() => paginar(1)} disabled={paginaActual === 1} />
                <Pagination.Prev
                  onClick={() => paginar(paginaActual - 1)}
                  disabled={paginaActual === 1}
                />
                {Array.from({ length: totalPaginas }, (_, i) => (
                  <Pagination.Item
                    key={i + 1}
                    active={i + 1 === paginaActual}
                    onClick={() => paginar(i + 1)}
                  >
                    {i + 1}
                  </Pagination.Item>
                ))}
                <Pagination.Next
                  onClick={() => paginar(paginaActual + 1)}
                  disabled={paginaActual === totalPaginas}
                />
                <Pagination.Last
                  onClick={() => paginar(totalPaginas)}
                  disabled={paginaActual === totalPaginas}
                />
              </Pagination>
            </div>
          )}
        </Modal.Body>
      </Modal >

    </>
  );
};

//mapea los valores del estado global de Redux
const mapStateToProps = (state: RootState) => ({
  servicio: state.datosCuentaReducers.servicio,
  cuenta: state.datosCuentaReducers.cuenta,
  dependencia: state.datosCuentaReducers.dependencia,
  especie: state.datosCuentaReducers.especie,
  descripcionEspecie: state.datosCuentaReducers.descripcionEspecie,
  isDarkMode: state.darkModeReducer.isDarkMode,
  objeto: state.validaApiLoginReducers,
  comboEspecies: state.listadoDeEspeciesBienReducers.comboEspecies,
});

export default connect(mapStateToProps, {
  comboEspeciesBienActions,
  listadoDeEspeciesBienActions
})(DatosCuenta);




