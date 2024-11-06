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
import { PencilFill, Plus } from "react-bootstrap-icons";
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
} from "../../../redux/actions/Inventario/Datos_inventariosActions";
import { registrarFormInventarioActions } from "../../../redux/actions/Inventario/registrarFormInventarioActions";

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
} from "../../../redux/actions/Inventario/Datos_inventariosActions";
import Swal from "sweetalert2";
import { FormInventario } from "./FormInventario";

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
  const [filasSeleccionadas, setFilasSeleccionadas] = useState<string[]>([]);
  const [paginaActual, setCurrentPage] = useState(1);
  const [elementosPorPagina] = useState(10);
  // const [total, setTotal] = useState<number>(0);
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
  const elementosActuales = useMemo(
    () => datos.slice(indicePrimerElemento, indiceUltimoElemento),
    [datos, indicePrimerElemento, indiceUltimoElemento]
  );
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
    if (!/^\d+(\.\d{1,2})?$/.test(currentActivo.precio))
      tempErrors.precio =
        "Precio debe ser un número válido con hasta dos decimales";
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
  const handleChange = (
    e: React.ChangeEvent<
      HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setCurrentActivo((prevData) => ({ ...prevData, [name]: value }));
  };
  // Estado para errores específicos por serie
  const [erroresSerie, setErroresSerie] = useState<{ [key: number]: string }>(
    {}
  );
  const [isRepeatSerie, setIsRepeatSerie] = useState(false);

  const handleCambiaSerie = (indexVisible: number, newSerie: string) => {
    // Convertir el índice visible al índice real en el array completo
    const indexReal = indicePrimerElemento + indexVisible;
    setActivosFijos((prevActivos) => {
      // Comprobar si la nueva serie ya existe en otro activo
      const serieExists = prevActivos.some(
        (activo, i) => activo.serie === newSerie && i !== indexReal
      );

      // Si existe, marcamos este índice con un error, pero permitimos el cambio
      if (serieExists) {
        setIsRepeatSerie(true);
        setErroresSerie((prevErrores) => ({
          ...prevErrores,
          [indexReal]: "Esta serie ya existe en otro activo.",
        }));

      } else {
        // Si no existe error, limpiamos el error de este índice
        setIsRepeatSerie(false);
        setErroresSerie((prevErrores) => {
          const newErrores = { ...prevErrores };
          delete newErrores[indexReal]; // Eliminar error si ya no hay conflicto
          return newErrores;
        });
      }
      // Actualizar el estado global (activosFijos) con el nuevo valor de serie
      const updatedActivos = prevActivos.map((activo, i) =>
        i === indexReal ? { ...activo, serie: newSerie } : activo
      );

      // Despachar la acción para actualizar la serie en Redux
      dispatch(actualizarSerieEnTabla(indexReal, newSerie));

      return updatedActivos; // Retornar el array completo actualizado
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

  const handleValidar = () => {

    if (pendiente == 0) {
      // setMostrarModalConfirmar(true);
      onNext(activosFijos);

      Swal.fire({
        icon: "info",
        // title: 'Confirmar',
        text: "Confirmar el envio del formulario",
        showDenyButton: false,
        showCancelButton: true,
        confirmButtonText: "Confirmar y Enviar",
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          Swal.fire("Registrado!", "", "success");
          handleFinalSubmit();
        }
      });
    } else {
      // SweetAlert2: mostrar alerta de error
      Swal.fire({
        icon: "warning",
        title: "Pendiente",
        text: `Tienes un monto pendiente de $${pendiente}`,
      });
    }

    if (isRepeatSerie) {
      // SweetAlert2: mostrar alerta de error
      Swal.fire({
        icon: "warning",
        title: "Serie Duplicada",
        text: "Por favor, verifique que no existan series duplicadas en el registro.",
      });
    }
  };

  const handleFinalSubmit = async () => {
    // Combina todos los datos en un solo objeto
    const FormulariosCombinados = {
      ...formInventario.datosInventario,
      ...formInventario.datosCuenta,
      activosFijos: activosFijos,
    };

    const resultado = await registrarFormInventarioActions(
      FormulariosCombinados
    );
    if (resultado) {
      console.log("FormulariosCombinados", FormulariosCombinados);
      //Resetea todo el formualario al estado inicial
      // dispatch(setTotalActivoFijoActions(total));
      dispatch(setNRecepcionActions(0));
      dispatch(setFechaRecepcionActions(""));
      dispatch(setNOrdenCompraActions(0));
      dispatch(setNFacturaActions(""));
      dispatch(setOrigenPresupuestoActions(0));
      dispatch(setMontoRecepcionActions(0));
      dispatch(setFechaFacturaActions(""));
      dispatch(setRutProveedorActions(""));
      dispatch(setnombreProveedorActions(""));
      dispatch(setModalidadCompraActions(0));
      dispatch(setServicioActions(0));
      dispatch(setDependenciaActions(0));
      dispatch(setCuentaActions(0));
      dispatch(setBienActions(0));
      dispatch(setDetalleActions(0));
      dispatch(setEspecieActions(""));
      dispatch(vaciarDatosTabla());
      onReset(); // retorna a Datos_inventario
      Swal.fire({
        icon: "success",
        title: "Registro exitoso",
        text: "El formulario se ha enviado y registrado con éxito!",
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un problema al enviar el formulario.",
      });
    }

  };

  const paginar = (numeroPagina: number) => setCurrentPage(numeroPagina);

  if (datosTablaActivoFijo.length === 0) {
    console.log("datosTablaActivoFijo está vacío");
  }

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
            Haz clic en (+) para agregar los detalles de cada activo aquí.
          </p>
        ) : (
          <div className="overflow-auto">
            <Table bordered hover>
              <thead>
                <tr>
                  <th style={{ color: "white", backgroundColor: "#0d4582" }}>
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
                  <th style={{ color: "white", backgroundColor: "#0d4582" }}>
                    Vida Útil
                  </th>
                  <th style={{ color: "white", backgroundColor: "#0d4582" }}>
                    Fecha Ingreso
                  </th>
                  <th style={{ color: "white", backgroundColor: "#0d4582" }}>
                    Marca
                  </th>
                  <th style={{ color: "white", backgroundColor: "#0d4582" }}>
                    Modelo
                  </th>
                  <th style={{ color: "white", backgroundColor: "#0d4582" }}>
                    Serie
                  </th>
                  <th style={{ color: "white", backgroundColor: "#0d4582" }}>
                    Precio
                  </th>
                  <th style={{ color: "white", backgroundColor: "#0d4582" }}>
                    Especie
                  </th>
                  <th style={{ color: "white", backgroundColor: "#0d4582" }}>
                    Acciones
                  </th>
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
                          onChange={(e) =>
                            handleCambiaSerie(indexReal, e.target.value)
                          }
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
                    <td
                      style={{ backgroundColor: activo.color || "transparent" }}
                    >
                      {" "}
                      {activo.especie}
                    </td>
                    <td>
                      {/* <Button variant="outline-secondary" size="sm" onClick={() => handleClone(activo)} className="me-2">
                  Clonar
                </Button> */}
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() =>
                          handleEliminar(
                            indexReal /*, parseFloat(activo.precio */
                          )
                        }
                      >
                        Eliminar
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
            <Pagination.First
              onClick={() => paginar(1)}
              disabled={paginaActual === 1}
            />
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
        )}
        {/* Botones volver y confirmar*/}
        <div className="d-flex justify-content-end mt-3 justify-content-between">
          <Button onClick={handleVolver} className="btn btn-primary m-1">
            Volver
          </Button>

          {elementosActuales.length > 0 && (
            <Button variant="btn btn-primary m-1" onClick={handleValidar}>
              Validar
            </Button>
          )}
        </div>
      </div>
      {/* Modal formulario Activos Fijo*/}
      <Modal
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
                <Button type="submit" variant="primary">
                  <Plus
                    className={classNames("flex-shrink-0", "h-5 w-5")}
                    aria-hidden="true"
                  />
                </Button>
              </div>
              <Col md={6}>
                <div className="mb-1">
                  <label htmlFor="vidaUtil" className="form-label">
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
                  <label htmlFor="fechaIngreso" className="form-label">
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
                  <label htmlFor="marca" className="form-label">
                    Marca
                  </label>
                  <input
                    type="text"
                    className={`form-control ${error.marca ? "is-invalid" : ""
                      }`}
                    id="marca"
                    name="marca"
                    maxLength={10}
                    onChange={handleChange}
                    value={currentActivo.marca}
                  />
                  {error.marca && (
                    <div className="invalid-feedback">{error.marca}</div>
                  )}
                </div>

                <div className="mb-1">
                  <label htmlFor="modelo" className="form-label">
                    Modelo
                  </label>
                  <input
                    type="text"
                    className={`form-control ${error.modelo ? "is-invalid" : ""
                      }`}
                    id="modelo"
                    name="modelo"
                    maxLength={10}
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
                  <label htmlFor="precio" className="form-label">
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
                  <label htmlFor="cantidad" className="form-label">
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
                  <label htmlFor="observaciones" className="form-label">
                    Observaciones
                  </label>
                  <textarea
                    className={`form-control ${error.observaciones ? "is-invalid" : ""
                      }`}
                    id="observaciones"
                    name="observaciones"
                    rows={4}
                    style={{ minHeight: "8px", resize: "none" }}
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
      </Modal>
    </>
  );
};

const mapStateToProps = (state: RootState) => ({
  montoRecepcion: state.datosRecepcionReducer.montoRecepcion,
  totalEstadoGlobal: state.datosRecepcionReducer.totalEstadoGlobal,
  nombreEspecie: state.datosRecepcionReducer.nombreEspecie,
  resetFormulario: state.datosRecepcionReducer.resetFormulario,
  datosTablaActivoFijo: state.datosRecepcionReducer.datosTablaActivoFijo,
});
export default connect(mapStateToProps, {
  registrarFormInventarioActions,
})(Datos_activo_fijo);
