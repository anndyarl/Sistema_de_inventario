import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState, useMemo } from "react";
import {
  Modal,
  Button,
  Table,
  Form,
  Pagination,
  Row,
  Col,
} from "react-bootstrap";
import {
  PencilFill, Plus, Trash
} from "react-bootstrap-icons";
import { RootState } from "../../../store";
import { connect, useDispatch } from "react-redux";

import {
  setServicioActions,
  setDependenciaActions,
  setCuentaActions,
  setEspecieActions,
  setDatosTablaActivoFijo,
  eliminarActivoDeTabla,
  eliminarMultiplesActivosDeTabla,
  actualizarSerieEnTabla,
  vaciarDatosTabla,
  setBienActions,
  setDetalleActions,
} from "../../../redux/actions/Inventario/RegistrarInventario/datosRegistroInventarioActions";
import { registrarFormInventarioActions } from "../../../redux/actions/Inventario/RegistrarInventario/registrarFormInventarioActions";

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
} from "../../../redux/actions/Inventario/RegistrarInventario/datosRegistroInventarioActions";
import Swal from "sweetalert2";
import { FormInventario } from "./FormInventario";
import { LucideTrash, Trash2Icon } from "lucide-react";

export interface ActivoFijo {
  id: string;
  vidaUtil: string;
  fechaIngreso: string;
  marca: string;
  cantidad: string;
  modelo: string;
  observaciones: string;
  serie: string;
  precio: string;
  especie: string;
  color?: string;
}

interface Datos_activo_fijoProps {
  onNext: (data: ActivoFijo[]) => void;
  onBack: () => void;
  onReset: () => void; // vuelva a al componente Datos_inventario
  montoRecepcion: number; //declaro un props para traer montoRecepción del estado global
  nombreEspecie: string[]; //Para obtener del estado global de redux
  datosTablaActivoFijo: ActivoFijo[];
  general?: string; // Campo para errores generales
  generalTabla?: string;
  formInventario: FormInventario;
  registrarFormInventarioActions: (formInventario: Record<string, any>) => Promise<Boolean>;
}

const Datos_activo_fijo: React.FC<Datos_activo_fijoProps> = ({
  onNext,
  onBack,
  onReset,
  montoRecepcion,
  nombreEspecie,
  datosTablaActivoFijo,
  formInventario,
  registrarFormInventarioActions,
}) => {
  const [activosFijos, setActivosFijos] = useState<ActivoFijo[]>([]);

  const [currentActivo, setCurrentActivo] = useState<ActivoFijo>({
    id: "",
    vidaUtil: "",
    fechaIngreso: "",
    marca: "",
    cantidad: "",
    modelo: "",
    observaciones: "",
    serie: "",
    precio: "",
    especie: "",
  });
  const dispatch = useDispatch();

  const classNames = (...classes: (string | boolean | undefined)[]): string => {
    return classes.filter(Boolean).join(" ");
  };
  const [error, setError] = useState<
    Partial<ActivoFijo> & { general?: string; generalTabla?: string }
  >({});
  //-------Modal-------//
  const [mostrarModal, setMostrarModal] = useState(false);
  // const [mostrarModalConfirmar, setMostrarModalConfirmar] = useState(false);
  //-------Fin Modal-------//

  //-------Tabla-------//
  const [editingSerie, setEditingSerie] = useState<string | null>(null);
  const [serie, setSerie] = useState<string>();

  const [filasSeleccionadas, setFilasSeleccionadas] = useState<string[]>([]);
  const [paginaActual, setCurrentPage] = useState(1);
  const [elementosPorPagina] = useState(10);
  // Estado para errores específicos por serie
  const [erroresSerie, setErroresSerie] = useState<{ [key: number]: string }>({});
  const [isRepeatSerie, setIsRepeatSerie] = useState(false);
  //-------Fin Tabla-------//

  const precio = parseFloat(currentActivo.precio) || 0;
  const cantidad = parseInt(currentActivo.cantidad, 10) || 0;

  // Combina el estado local de react con el estado local de redux
  const datos = useMemo(() => {
    return datosTablaActivoFijo.length > 0
      ? datosTablaActivoFijo
      : activosFijos;
  }, [datosTablaActivoFijo, activosFijos]);

  const indiceUltimoElemento = paginaActual * elementosPorPagina;
  const indicePrimerElemento = indiceUltimoElemento - elementosPorPagina;
  const elementosActuales = useMemo(() => datos.slice(indicePrimerElemento, indiceUltimoElemento),
    [datos, indicePrimerElemento, indiceUltimoElemento]);
  const totalPaginas = Math.ceil(datos.length / elementosPorPagina);

  // Calcula el total del precio de la tabla
  const totalSum = useMemo(() => {
    return datos.reduce((sum, activo) => sum + parseFloat(activo.precio), 0);
  }, [datos]);

  // Calcular cantidad por precio
  const newTotal = cantidad * precio;
  const pendiente = montoRecepcion - totalSum;

  //---------------------------------------------------------//

  //Validaciones
  const validate = () => {
    let tempErrors: Partial<ActivoFijo> & { general?: string } = {};
    if (!currentActivo.vidaUtil)
      tempErrors.vidaUtil = "Vida útil es obligatorio";
    if (!/^\d+$/.test(currentActivo.vidaUtil))
      tempErrors.vidaUtil = "Vida útil debe ser un número";
    if (!currentActivo.fechaIngreso)
      tempErrors.fechaIngreso = "Fecha de Ingreso es obligatorio";
    if (!currentActivo.marca) tempErrors.marca = "Marca es obligatorio";
    if (!currentActivo.modelo) tempErrors.modelo = "Modelo es obligatorio";
    // if (!currentActivo.serie) tempErrors.serie = "Serie es obligatoria";
    if (!currentActivo.cantidad)
      tempErrors.cantidad = "Cantidad es obligatorio";
    else if (isNaN(parseInt(currentActivo.cantidad)))
      tempErrors.cantidad = "Cantidad debe ser un número";
    if (!currentActivo.precio) tempErrors.precio = "Precio es obligatorio";
    if (!/^\d+$/.test(currentActivo.precio))
      tempErrors.precio = "Precio debe ser un número entero";
    if (!currentActivo.observaciones)
      tempErrors.observaciones = "Observaciones es obligatorio";

    if (newTotal == 0) {
      tempErrors.general = `Debe ingresar un valor mayor a cero`;
    }
    if (newTotal > pendiente) {
      tempErrors.general = `El precio por cantidad ingresado es mayor al monto de recepción pendiente $${pendiente}`;
    }
    if (newTotal > montoRecepcion) {
      tempErrors.general = `La cantidad ingresada excede al facturado $${montoRecepcion}`;
    }

    setError(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  //handleChange maneja actualizaciones en tiempo real campo por campo
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentActivo((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleCambiaSerie = (indexVisible: number, newSerie: string) => {
    const indexReal = indicePrimerElemento + indexVisible;

    setActivosFijos((prevActivos) => {
      // Actualizar la serie del activo correspondiente
      const actualizaActivos = prevActivos.map((activo, i) =>
        i === indexReal ? { ...activo, serie: newSerie } : activo
      );

      // Validar si hay series vacías
      const serieVacia = actualizaActivos.some((activo) => !activo.serie.trim());
      setCurrentActivo((prevData) => ({
        ...prevData,
        activo: serieVacia,
      }));

      // Validar si hay series duplicadas (ignorando vacías)
      const serieNoVacia = actualizaActivos
        .map((activo) => activo.serie.trim())
        .filter((serie) => serie !== "");
      const duplicados = serieNoVacia.filter(
        (serie, index, arr) => arr.indexOf(serie) !== index
      );

      // Actualizar estado de duplicados y errores
      if (duplicados.length > 0) {
        setIsRepeatSerie(true);
        setErroresSerie((prevErrores) => ({
          ...prevErrores,
          [indexReal]: "Esta serie ya existe en otro activo.",
        }));
      } else {
        setIsRepeatSerie(false);
        setErroresSerie((prevErrores) => {
          const newErrores = { ...prevErrores };
          delete newErrores[indexReal]; // Limpiar error si ya no hay conflicto
          return newErrores;
        });
      }

      // Despachar la acción para actualizar Redux
      dispatch(actualizarSerieEnTabla(indexReal, newSerie));

      return actualizaActivos; // Retornar el array actualizado
    });
  };

  //-------------Funciones de la tabla --------------------//
  const handleSerieBlur = () => {
    setEditingSerie(null);
  };

  const setSeleccionaFilas = (index: number) => {
    setFilasSeleccionadas((prev) =>
      prev.includes(index.toString())
        ? prev.filter((rowIndex) => rowIndex !== index.toString())
        : [...prev, index.toString()]
    );
  };

  const handleSeleccionaTodos = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setFilasSeleccionadas(
        elementosActuales.map((_, index) =>
          (indicePrimerElemento + index).toString()
        )
      );
    } else {
      setFilasSeleccionadas([]);
    }
  };

  // const handleClone = (activo: ActivoFijo) => {
  //   const clonedActivo = { ...activo };
  //   setActivosFijos(prev => [...prev, clonedActivo]);
  // };

  const handleAgregar = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // let counter = 0;
    // const generateCorrelativeId = () => {
    //   counter += 1;
    //   return String(counter);
    // };

    if (validate()) {
      const cantidad = parseInt(currentActivo.cantidad, 10);
      const ultimaEspecie = nombreEspecie[nombreEspecie.length - 1] || "";

      // Funcion para generar colores aleatorios con el fin para distinguir las filas de ultimas especies
      const getRandomPastelColor = () => {
        const randomChannel = () => Math.floor(Math.random() * 128 + 127); // Valores entre 127 y 255 para generar tonos claros
        const red = randomChannel();
        const green = randomChannel();
        const blue = randomChannel();

        return `rgb(${red}, ${green}, ${blue})`;
      };

      // Buscar el color del último activo con la misma especie, si existe
      const colorUltimaEspecie =
        activosFijos.find((activo) => activo.especie === ultimaEspecie)
          ?.color || getRandomPastelColor();

      const newActivos = Array.from({ length: cantidad }, (_, index) => ({
        ...currentActivo,
        id: String(Date.now() + index),
        especie: ultimaEspecie,
        color: colorUltimaEspecie, // Asigna el color correspondiente
      }));
      setActivosFijos((prev) => [...prev, ...newActivos]);

      // Despacha el array de nuevos activos a Redux
      dispatch(setDatosTablaActivoFijo(newActivos));
      //Limpia campos despues de crearlos
      setCurrentActivo({
        id: "",
        vidaUtil: "",
        fechaIngreso: "",
        marca: "",
        cantidad: "",
        modelo: "",
        observaciones: "",
        serie: "",
        precio: "",
        especie: "",
        color: "",
      });

      setMostrarModal(false); //Cierra modal
    }
  };

  const handleEliminar = (index: number /*, precio: number*/) => {
    setActivosFijos((prev) => prev.filter((_, i) => i !== index));
    dispatch(eliminarActivoDeTabla(index));
  };

  const handleEliminarSeleccionados = () => {
    // Convertir los índices seleccionados a números
    const selectedIndices = filasSeleccionadas.map(Number);

    // Filtrar los activos para eliminar los seleccionados
    setActivosFijos((prev) =>
      prev.filter((_, index) => !selectedIndices.includes(index))
    );
    dispatch(eliminarMultiplesActivosDeTabla(selectedIndices));

    // Limpiar las filas seleccionadas
    setFilasSeleccionadas([]);
  };

  //-------------Fin Funciones de la tabla --------------------//

  const handleVolver = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    onBack();
  };

  // const handleValidar = async (): Promise<boolean> => {
  const handleValidar = () => {
    // Verifica si hay series vacías
    const serieVacia = activosFijos?.some(
      (activo) => !activo.serie || !activo.serie.trim()
    );
    console.log(" datos ACtivo fijo", datosTablaActivoFijo);
    // Verifica si hay series vacias
    if (serieVacia) {
      Swal.fire({
        icon: "warning",
        title: "Serie Faltante",
        text: "Por favor, verifique que todos los registros contengan su número de serie.",
      });
      return false;
    }

    // Verifica si hay series duplicadas
    if (isRepeatSerie) {
      Swal.fire({
        icon: "warning",
        title: "Serie Duplicada",
        text: "Por favor, verifique que no existan series duplicadas en el registro.",
      });
      return false;
    }

    // Verifica si hay un monto pendiente
    if (pendiente > 0) {
      Swal.fire({
        icon: "warning",
        title: "Serie Pendiente",
        text: `Tienes un monto pendiente de $${pendiente.toLocaleString("es-CL")}.`,
      });
      return false;
    }

    // Si pasa todas las validaciones
    return true;
  };

  const handleFinalSubmit = async () => {
    if (handleValidar()) {
      const confirmResult = await Swal.fire({
        icon: "info",
        title: "Confirmar registro",
        text: "¿Desea registrar el inventario de activos con la información proporcionada?",
        showCancelButton: true,
        confirmButtonText: "Confirmar y registrar",
        cancelButtonText: "Cancelar",
      });

      // Si el usuario confirma
      if (confirmResult.isConfirmed) {
        const FormulariosCombinados = {
          ...formInventario.datosInventario,
          ...formInventario.datosCuenta,
          activosFijos: datosTablaActivoFijo,
        };

        try {
          // Intenta registrar el formulario
          const resultado = await registrarFormInventarioActions(FormulariosCombinados);

          if (resultado) {
            console.log("tabla activo fijo", datosTablaActivoFijo);
            // Resetea todo el formulario al estado inicial
            dispatch(setNRecepcionActions(0));
            dispatch(setFechaRecepcionActions(""));
            dispatch(setNOrdenCompraActions(0));
            dispatch(setNFacturaActions(""));
            dispatch(setOrigenPresupuestoActions(0));
            dispatch(setMontoRecepcionActions(0));
            dispatch(setFechaFacturaActions(""));
            dispatch(setRutProveedorActions(""));
            dispatch(setModalidadCompraActions(0));
            dispatch(setServicioActions(0));
            dispatch(setDependenciaActions(0));
            dispatch(setCuentaActions(0));
            dispatch(setBienActions(0));
            dispatch(setDetalleActions(0));
            dispatch(setEspecieActions(""));
            dispatch(vaciarDatosTabla());
            onReset(); // Vuelve al estado inicial

            // Muestra el mensaje de éxito
            await Swal.fire({
              icon: "success",
              title: "Registro exitoso",
              text: "El formulario se ha enviado y registrado con éxito!",
            });
          } else {
            // Si ocurre un error en el registro
            await Swal.fire({
              icon: "error",
              title: "Error",
              text: "Hubo un problema al enviar el formulario.",
            });
          }
        } catch (error) {
          // Captura errores imprevistos
          console.error("Error al registrar el formulario:", error);
          await Swal.fire({
            icon: "error",
            title: "Error inesperado",
            text: "Ocurrió un error inesperado. Por favor, inténtelo nuevamente.",
          });
        }
      }
    }
  };

  const paginar = (numeroPagina: number) => setCurrentPage(numeroPagina);

  return (
    <>
      <div className="border-bottom shadow-sm p-4 rounded">
        <h3 className="form-title fw-semibold border-bottom">
          Detalles activo
        </h3>
        <div className="d-flex justify-content-between  m-1">
          {/* Monto Recepción*/}
          <div className=" align-content-center">
            <strong>Monto Recepción:</strong> $
            {montoRecepcion.toLocaleString("es-ES", {
              minimumFractionDigits: 0,
            })}
          </div>
          {/* habilita Boton Modal formulario si solo monto recepcion y total coinciden y si la especie tiene datos */}
          {totalSum != montoRecepcion && nombreEspecie.length > 0 && (
            <Button
              className="align-content-center"
              variant="primary"
              onClick={() => setMostrarModal(true)}
            >
              <Plus
                className={classNames("flex-shrink-0", "h-5 w-5")}
                aria-hidden="true"
              />
            </Button>
          )}
        </div>

        {/* Boton elimina filas seleccionadas */}
        {filasSeleccionadas.length > 0 && (
          <Button
            variant="danger"
            onClick={handleEliminarSeleccionados}
            className="mb-1 me-2"
          >
            Eliminar Seleccionados
          </Button>
        )}
        {/* Mostrar errores generales */}
        {error.generalTabla && (
          <div className="alert alert-danger" role="alert">
            {error.generalTabla}
          </div>
        )}
        {/* Tabla */}
        {datos.length === 0 ? (
          <p className="d-flex justify-content-center alert alert-light m-1 p-1 ">
            Haz clic en (+) para agregar aquí los detalles de cada activo.
          </p>
        ) : (
          <div className="overflow-auto">
            <Table responsive className="mb-0">
              <thead className="table-light sticky-top">
                <tr>
                  <th >
                    <Form.Check
                      type="checkbox"
                      onChange={handleSeleccionaTodos}
                      checked={
                        filasSeleccionadas.length ===
                        elementosActuales.length &&
                        elementosActuales.length > 0
                      }
                    />
                  </th>
                  <th>Vida Útil</th>
                  <th>Fecha Ingreso</th>
                  <th>Marca</th>
                  <th>Modelo</th>
                  <th>Serie</th>
                  <th>Precio</th>
                  <th>Especie</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {elementosActuales.map((activo, indexReal) => (
                  <tr key={indexReal}>
                    <td>
                      <Form.Check
                        type="checkbox"
                        onChange={() => setSeleccionaFilas(indexReal)}
                        checked={filasSeleccionadas.includes(
                          indexReal.toString()
                        )}
                      />
                    </td>
                    <td>{activo.vidaUtil}</td>
                    <td>{activo.fechaIngreso}</td>
                    <td>{activo.marca}</td>
                    <td>{activo.modelo}</td>
                    <td
                      className="w-15"
                      onClick={() => setEditingSerie(indexReal.toString())}
                    >
                      <div className="d-flex align-items-center ">
                        <Form.Control
                          type="text"
                          value={activo.serie}
                          onChange={(e) => handleCambiaSerie(indexReal, e.target.value)}
                          onBlur={handleSerieBlur}
                          autoFocus
                          maxLength={10}
                          pattern="\d*"
                          placeholder="editar"
                          data-index={indexReal}
                          // Agregar clase condicional si hay un error en la serie
                          className={
                            erroresSerie[indexReal] ? "is-invalid" : ""
                          }
                        />
                        <PencilFill
                          style={{ marginLeft: "1rem", color: "#6c757d" }}
                        />{" "}
                        {/* Ícono de lápiz */}
                      </div>
                      {erroresSerie[indexReal] && (
                        <div className="invalid-feedback d-block">
                          {erroresSerie[indexReal]}
                        </div>
                      )}
                    </td>

                    <td>
                      $
                      {parseFloat(activo.precio).toLocaleString("es-ES", {
                        minimumFractionDigits: 0,
                      })}
                    </td>
                    <td className="fw-bold" style={{ backgroundColor: activo.color || "transparent" }}> {" "}  {activo.especie}</td>
                    <td>
                      {/* Clonar */}
                      {/* <Button variant="outline-secondary" size="sm" onClick={() => handleClone(activo)} className="me-2">*/}

                      {/* </Button> */}
                      <Button variant="outline-danger" size="sm" onClick={() => handleEliminar(indexReal)} /*, parseFloat(activo.precio */>
                        <Trash
                          className={classNames("flex-shrink-0", "h-5 w-5")}
                          aria-hidden="true"
                        />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={6} className="text-right">
                    <strong>Total activo fijo:</strong>
                  </td>
                  <td>
                    <strong>
                      $
                      {totalSum.toLocaleString("es-ES", {
                        minimumFractionDigits: 0,
                      })}
                    </strong>
                  </td>
                </tr>
              </tfoot>
            </Table>
          </div>
        )}

        {/* Paginador*/}
        {elementosActuales.length > 0 && (
          <Pagination className="d-flex justify-content-end">
            <Pagination.First onClick={() => paginar(1)} disabled={paginaActual === 1} />
            <Pagination.Prev onClick={() => paginar(paginaActual - 1)} disabled={paginaActual === 1} />
            {Array.from({ length: totalPaginas }, (_, i) => (<Pagination.Item key={i + 1} active={i + 1 === paginaActual} onClick={() => paginar(i + 1)}>{i + 1} </Pagination.Item>))}
            <Pagination.Next onClick={() => paginar(paginaActual + 1)} disabled={paginaActual === totalPaginas} />
            <Pagination.Last onClick={() => paginar(totalPaginas)} disabled={paginaActual === totalPaginas} />
          </Pagination>
        )}
        {/* Botones volver y confirmar*/}
        <div className="d-flex justify-content-end mt-3 justify-content-between">
          <Button onClick={handleVolver} className="btn btn-primary m-1">
            Volver
          </Button>

          {elementosActuales.length > 0 && (
            <Button variant="btn btn-primary m-1"
              onClick={handleFinalSubmit} >
              Validar
            </Button>
          )}
        </div>
      </div >
      {/* Modal formulario Activos Fijo*/}
      < Modal
        show={mostrarModal}
        onHide={() => setMostrarModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title className="fw-semibold">Agregar activo fijo</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {/* Mostrar errores generales en el modal */}
          {error.general && (
            <div className="alert alert-danger" role="alert">
              {error.general}
            </div>
          )}

          <form onSubmit={handleAgregar}>
            <Row>
              <div className="d-flex justify-content-between p-2">
                <p>
                  <strong>Monto Recepción:</strong> $
                  {montoRecepcion.toLocaleString("es-ES", {
                    minimumFractionDigits: 0,
                  })}
                </p>
                <p><strong>Monto Pendiente:</strong> ${(montoRecepcion - totalSum).toLocaleString("es-ES", {
                  minimumFractionDigits: 0,
                })}</p>
                <Button type="submit" variant="primary">
                  <Plus
                    className={classNames("flex-shrink-0", "h-5 w-5")}
                    aria-hidden="true"
                  />
                </Button>
              </div>
              <Col md={6}>
                <div className="mb-1">
                  <label htmlFor="vidaUtil" className="text-muted fw-semibold">
                    Vida Útil
                  </label>
                  <input
                    type="text"
                    className={`form-control ${error.vidaUtil ? "is-invalid" : ""
                      }`}
                    id="vidaUtil"
                    name="vidaUtil"
                    maxLength={10}
                    onChange={handleChange}
                    value={currentActivo.vidaUtil}
                  />
                  {error.vidaUtil && (
                    <div className="invalid-feedback">{error.vidaUtil}</div>
                  )}
                </div>

                <div className="mb-1">
                  <label htmlFor="fechaIngreso" className="text-muted fw-semibold">
                    Fecha Ingreso
                  </label>
                  <input
                    type="date"
                    className={`form-control ${error.fechaIngreso ? "is-invalid" : ""
                      }`}
                    id="fechaIngreso"
                    name="fechaIngreso"
                    onChange={handleChange}
                    value={currentActivo.fechaIngreso}
                  />
                  {error.fechaIngreso && (
                    <div className="invalid-feedback">{error.fechaIngreso}</div>
                  )}
                </div>

                <div className="mb-1">
                  <label htmlFor="marca" className="text-muted fw-semibold">
                    Marca
                  </label>
                  <input
                    type="text"
                    className={`form-control ${error.marca ? "is-invalid" : ""
                      }`}
                    id="marca"
                    name="marca"
                    maxLength={20}
                    onChange={handleChange}
                    value={currentActivo.marca}
                  />
                  {error.marca && (
                    <div className="invalid-feedback">{error.marca}</div>
                  )}
                </div>

                <div className="mb-1">
                  <label htmlFor="modelo" className="text-muted fw-semibold">
                    Modelo
                  </label>
                  <input
                    type="text"
                    className={`form-control ${error.modelo ? "is-invalid" : ""
                      }`}
                    id="modelo"
                    name="modelo"
                    maxLength={20}
                    onChange={handleChange}
                    value={currentActivo.modelo}
                  />
                  {error.modelo && (
                    <div className="invalid-feedback">{error.modelo}</div>
                  )}
                </div>
              </Col>
              <Col md={6}>
                <div className="mb-1">
                  <label htmlFor="precio" className="text-muted fw-semibold">
                    Precio
                  </label>
                  <input
                    type="text"
                    className={`form-control ${error.precio ? "is-invalid" : ""
                      }`}
                    id="precio"
                    name="precio"
                    maxLength={12}
                    onChange={handleChange}
                    value={currentActivo.precio}
                  />
                  {error.precio && (
                    <div className="invalid-feedback">{error.precio}</div>
                  )}
                </div>

                <div className="mb-1">
                  <label htmlFor="cantidad" className="text-muted fw-semibold">
                    Cantidad
                  </label>
                  <input
                    type="text"
                    className={`form-control ${error.cantidad ? "is-invalid" : ""
                      }`}
                    id="cantidad"
                    name="cantidad"
                    maxLength={6}
                    onChange={handleChange}
                    value={currentActivo.cantidad}
                  />
                  {error.cantidad && (
                    <div className="invalid-feedback">{error.cantidad}</div>
                  )}
                </div>
                <div className="mb-1">
                  <label htmlFor="observaciones" className="text-muted fw-semibold">
                    Observaciones
                  </label>
                  <textarea
                    className={`form-control ${error.observaciones ? "is-invalid" : ""
                      }`}
                    aria-label="observaciones"
                    name="observaciones"
                    rows={4}
                    // maxLength={500}
                    // style={{ minHeight: "8px", resize: "none" }}
                    onChange={handleChange}
                    value={currentActivo.observaciones}
                  />
                  {error.observaciones && (
                    <div className="invalid-feedback">
                      {error.observaciones}
                    </div>
                  )}
                </div>
              </Col>
            </Row>
          </form>
        </Modal.Body>
      </Modal >
    </>
  );
};

const mapStateToProps = (state: RootState) => ({
  montoRecepcion: state.obtenerRecepcionReducers.montoRecepcion,
  nombreEspecie: state.datosActivoFijoReducers.nombreEspecie,
  resetFormulario: state.datosActivoFijoReducers.resetFormulario,
  datosTablaActivoFijo: state.datosActivoFijoReducers.datosTablaActivoFijo,
});
export default connect(mapStateToProps, {
  registrarFormInventarioActions,
})(Datos_activo_fijo);
