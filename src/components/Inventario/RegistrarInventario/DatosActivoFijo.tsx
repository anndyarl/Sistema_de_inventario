import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState, useMemo, useEffect } from "react";
import { Modal, Button, Form, Pagination, Row, Col, } from "react-bootstrap";
import { Eraser, Floppy, PencilFill, Plus, Trash } from "react-bootstrap-icons";
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
  setVidaUtilActions,
  setFechaIngresoActions,
  setMarcaActions,
  setModeloActions,
  setPrecioActions,
  setCantidadActions,
  setObservacionesActions,
  showInputActions,
  setOtraModalidadActions,
  setNombreEspecieActions,
  setDescripcionEspecieActions,
  setInventarioRegistrado,
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
  setModalidadCompraActions,
} from "../../../redux/actions/Inventario/RegistrarInventario/datosRegistroInventarioActions";
import Swal from "sweetalert2";
import { FormInventario } from "./FormInventario";
// import { obtenerMaxInventarioActions } from "../../../redux/actions/Inventario/RegistrarInventario/obtenerMaxInventarioActions";

// Props del formulario
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

export interface Form {
  datosInventario: Record<string, any>;
}
interface DatosActivoFijoProps {
  onNext: (data: ActivoFijo[]) => void;
  onBack: () => void;
  onReset: () => void; // vuelve a al componente Datos_inventario
  montoRecepcion: number; //declaro un props para traer montoRecepción del estado global
  nombreEspecie: string[]; //Para obtener del estado global de redux
  datosTablaActivoFijo: ActivoFijo[];
  general?: string; // Campo para errores generales
  generalTabla?: string;
  formInventario: FormInventario;
  registrarFormInventarioActions: (formInventario: Record<string, any>) => Promise<Boolean>;
  // obtenerMaxInventarioActions: () => Promise<Boolean>;
  isDarkMode: boolean;
  vidaUtil: string;
  fechaIngreso: string;
  marca: string;
  cantidad: string;
  modelo: string;
  observaciones: string;
  precio: string;
  // AF_CODIGO_GENERICO: number;//trae ultimo correlativo ingresado
}

//Paso 3 del Formulario
const DatosActivoFijo: React.FC<DatosActivoFijoProps> = ({
  onBack,
  onReset,
  montoRecepcion,
  nombreEspecie,
  datosTablaActivoFijo,
  formInventario,
  isDarkMode,
  vidaUtil,
  fechaIngreso,
  marca,
  cantidad,
  modelo,
  observaciones,
  precio,
  // AF_CODIGO_GENERICO,
  registrarFormInventarioActions,
  // obtenerMaxInventarioActions
}) => {

  //Estado que guarda en un array los objetos que irán en la tabla
  const [activosFijos, setActivosFijos] = useState<ActivoFijo[]>([]);

  //Estado que guarda los objetos del formulario(dentro del Modal)
  const [activoActual, setActivoActual] = useState<ActivoFijo>({
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

  const [error, setError] = useState<Partial<ActivoFijo> & { general?: string; generalTabla?: string }>({});

  //-------Modal-------//
  const [mostrarModal, setMostrarModal] = useState(false);
  //-------Fin Modal-------//

  //-------Tabla-------//
  const [_, setEditingSerie] = useState<string | null>(null);
  const [filasSeleccionadas, setFilasSeleccionadas] = useState<string[]>([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const [elementosPorPagina] = useState(10);
  const [erroresSerie, setErroresSerie] = useState<{ [key: number]: string }>({});
  const vPrecio = parseFloat(activoActual.precio) || 0;
  const vCantidad = parseInt(activoActual.cantidad, 10) || 0;

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
  const newTotal = vCantidad * vPrecio;
  const pendiente = montoRecepcion - totalSum;

  //---------------------------------------------------------//

  //Validaciones del formulario
  const validate = () => {
    let tempErrors: Partial<ActivoFijo> & { general?: string } = {};
    if (!activoActual.vidaUtil) tempErrors.vidaUtil = "Campo obligatorio";
    else if (!/^\d+$/.test(activoActual.vidaUtil)) tempErrors.vidaUtil = "Vida útil debe ser un número";
    if (!activoActual.fechaIngreso) tempErrors.fechaIngreso = "Campo obligatorio";
    if (!activoActual.marca) tempErrors.marca = "Campo obligatorio";
    if (!activoActual.modelo) tempErrors.modelo = "Campo obligatorio";
    if (!activoActual.cantidad) tempErrors.cantidad = "Campo obligatorio";
    else if (isNaN(parseInt(activoActual.cantidad))) tempErrors.cantidad = "Cantidad debe ser un número";
    if (!activoActual.precio) tempErrors.precio = "Campo obligatorio";
    else if (!/^\d+$/.test(activoActual.precio)) tempErrors.precio = "Precio debe ser un número entero";
    if (!activoActual.observaciones) tempErrors.observaciones = "Campo obligatorio";
    if (newTotal == 0) {
      tempErrors.general = `Debe ingresar un valor mayor a cero`;
    }
    if (newTotal > pendiente) {
      tempErrors.general = `La cantidad por precio ingresado supera al monto de recepción.`;
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
    setActivoActual((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleCambiaSerie = (indexVisible: number, newSerie: string) => {
    const indexReal = indicePrimerElemento + indexVisible;

    setActivosFijos((prevActivos) => {
      const actualizaActivos = prevActivos.map((activo, i) =>
        i === indexReal ? { ...activo, serie: newSerie } : activo
      );

      // Validar si hay series vacías
      const serieVacia = actualizaActivos.some((activo) => !activo.serie.trim());
      setActivoActual((prevData) => ({
        ...prevData,
        activo: serieVacia,
      }));

      // Validar duplicados
      const seriesMap = new Map<string, number[]>(); // Mapeo de series a índices
      actualizaActivos.forEach((activo, index) => {
        const serie = activo.serie.trim();
        if (serie) {
          if (seriesMap.has(serie)) {
            seriesMap.get(serie)!.push(index); // Agregar índice al array existente
          } else {
            seriesMap.set(serie, [index]); // Crear un nuevo array con el índice
          }
        }
      });

      // Obtener los índices de duplicados
      const duplicadosIndices: number[] = [];
      seriesMap.forEach((indices) => {
        if (indices.length > 1) {
          duplicadosIndices.push(...indices); // Agregar todos los índices duplicados
        }
      });

      // Actualizar errores para los índices duplicados
      if (duplicadosIndices.length > 0) {
        // setIsRepeatSerie(true);
        setErroresSerie((prevErrores) => {
          const newErrores = { ...prevErrores };

          // Pintar error en todos los índices duplicados
          duplicadosIndices.forEach((index) => {
            newErrores[index] = "Esta serie ya existe en otro activo.";
          });

          return newErrores;
        });
      } else {
        // setIsRepeatSerie(false);

        // Limpiar errores para índices que ya no son duplicados
        setErroresSerie((prevErrores) => {
          const newErrores = { ...prevErrores };

          Object.keys(newErrores).forEach((key) => {
            const index = parseInt(key, 10);
            if (!duplicadosIndices.includes(index)) {
              delete newErrores[index]; // Eliminar errores de índices no duplicados
            }
          });

          return newErrores;
        });
      }


      // Despacha la serie actualizada al estado global de Redux
      dispatch(actualizarSerieEnTabla(indexReal, newSerie));

      return actualizaActivos;
    });
  };

  // const funcionObtieneMaxRegistro = () => {
  //   if (AF_CODIGO_GENERICO === 0) {
  //     obtenerMaxInventarioActions();
  //   }
  // };

  //Sincroniza los numero de serie de la tabla datosTablaActivoFijo con el estado global de redux
  useEffect(() => {
    if (datosTablaActivoFijo.length > 0) {
      setActivosFijos(datosTablaActivoFijo);
    }
    // funcionObtieneMaxRegistro();
  }, [datosTablaActivoFijo, /*funcionObtieneMaxRegistro*/, paginaActual]);

  //Renderiza los datos almacenados en el estado global de redux
  useEffect(() => {
    setActivoActual({
      id: "",
      vidaUtil,
      fechaIngreso,
      marca,
      cantidad,
      modelo,
      observaciones,
      serie: "",
      precio,
      especie: ""
    });
  }, [
    vidaUtil,
    fechaIngreso,
    marca,
    cantidad,
    modelo,
    observaciones,
    precio
  ]);

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
    // console.log("indices seleccionmados", index);
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
    // console.log("indices seleccionmados", filasSeleccionadas);
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
      const cantidad = parseInt(activoActual.cantidad, 10);
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
      const colorUltimaEspecie = activosFijos.find((activo) => activo.especie === ultimaEspecie)?.color || getRandomPastelColor();

      const newActivos = Array.from({ length: cantidad }, (_,) => ({
        ...activoActual,
        id: `${Math.floor(performance.now())}${Math.floor(Math.random() * 1000)}`,
        especie: ultimaEspecie,
        color: colorUltimaEspecie, // Asigna el color correspondiente a la ultima especie
      }));
      setActivosFijos((prev) => [...prev, ...newActivos]);

      // Despacha el array de nuevos activos a Redux
      dispatch(setDatosTablaActivoFijo(newActivos));
      dispatch(setVidaUtilActions(activoActual.vidaUtil));
      dispatch(setFechaIngresoActions(activoActual.fechaIngreso));
      dispatch(setMarcaActions(activoActual.marca));
      dispatch(setModeloActions(activoActual.modelo));
      dispatch(setPrecioActions(activoActual.precio));
      dispatch(setCantidadActions(activoActual.cantidad));
      dispatch(setObservacionesActions(activoActual.observaciones));
      setMostrarModal(false); //Cierra modal
    }
  };

  const handleLimpiar = () => {
    setActivoActual((prevData) => ({
      ...prevData,
      vidaUtil: "",
      fechaIngreso: "",
      marca: "",
      modelo: "",
      precio: "",
      cantidad: "",
      observaciones: ""
    }));
    dispatch(setVidaUtilActions(""));
    dispatch(setFechaIngresoActions(""));
    dispatch(setMarcaActions(""));
    dispatch(setModeloActions(""));
    dispatch(setPrecioActions(""));
    dispatch(setCantidadActions(""));
    dispatch(setObservacionesActions(""));
  }
  const handleEliminar = (index: number) => {
    setActivosFijos((prev) => {
      const actualizados = prev.filter((_, i) => i !== index);

      // Limpia los errores asociados al índice eliminado
      setErroresSerie((prevErrores) => {
        const newErrores = { ...prevErrores };
        delete newErrores[index];
        return newErrores;
      });
      paginar(1);
      return actualizados;
    });

    // Despachar acción para actualizar el estado global
    dispatch(eliminarActivoDeTabla(index));
  };

  const handleEliminarSeleccionados = () => {
    // Convertir los índices seleccionados a números
    const selectedIndices = filasSeleccionadas.map(Number);

    // Filtrar los activos y eliminar los seleccionados
    setActivosFijos((prev) => {
      const actualizados = prev.filter((_, index) => !selectedIndices.includes(index));

      // Limpia los errores asociados a los índices eliminados
      setErroresSerie((prevErrores) => {
        const newErrores = { ...prevErrores };
        selectedIndices.forEach((index) => {
          delete newErrores[index];
        });
        return newErrores;
      });

      return actualizados;
    });

    // Despachar acción para actualizar el estado global
    dispatch(eliminarMultiplesActivosDeTabla(selectedIndices));

    // Limpiar las filas seleccionadas
    setFilasSeleccionadas([]);
    paginar(1);
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

    if (serieVacia) {
      Swal.fire({
        icon: "warning",
        title: "Serie Faltante",
        text: "Por favor, verifique que todos los registros contengan su número de serie.",
        background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
        color: `${isDarkMode ? "#ffffff" : "000000"}`,
        confirmButtonColor: `${isDarkMode ? "#007bff" : "444"}`,
        customClass: {
          popup: "custom-border", // Clase personalizada para el borde
        }
      });
      return false;
    }

    // Verifica si hay series duplicadas y obtiene índices
    const seriesMap = new Map();
    const duplicados: { serie: string; index: number }[] = []; // Tipado explícito

    activosFijos.forEach((activo, index) => {
      const serie = activo.serie?.trim();
      if (serie) {
        if (seriesMap.has(serie)) {
          duplicados.push({ serie, index });
        } else {
          seriesMap.set(serie, index);
        }
      }
    });


    if (duplicados.length > 0) {
      // setIsRepeatSerie(true);

      // Agrega errores para los índices duplicados
      setErroresSerie((prevErrores) => {
        const newErrores = { ...prevErrores };
        duplicados.forEach(({ index }) => {
          newErrores[index] = "Esta serie ya existe en otro activo.";
        });

        return newErrores;
      });
      Swal.fire({
        icon: "warning",
        title: "Serie Duplicada",
        text: "Por favor, verifique que no existan series duplicadas en el registro.",
        background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
        color: `${isDarkMode ? "#ffffff" : "000000"}`,
        confirmButtonColor: `${isDarkMode ? "#007bff" : "444"}`,
        customClass: {
          popup: "custom-border", // Clase personalizada para el borde
        },
      });
      return false;
    }
    else {
      // setIsRepeatSerie(false);
      // Limpia errores relacionados con duplicados
      setErroresSerie((prevErrores) => {
        const newErrores = { ...prevErrores };
        // Recalcula errores para los índices restantes
        Object.keys(newErrores).forEach((key) => {
          const index = parseInt(key, 10);
          const serie = activosFijos[index]?.serie?.trim();
          if (
            !serie || // Si la serie está vacía
            !duplicados.some(({ index: dupIndex }) => dupIndex === index) // Si ya no está duplicada
          ) {
            delete newErrores[index];
          }
        });

        return newErrores;
      });

    }




    // Verifica si hay un monto pendiente
    if (pendiente > 0) {
      Swal.fire({
        icon: "warning",
        title: "Monto Pendiente",
        text: `Tiene un monto pendiente de $${pendiente.toLocaleString("es-CL")}.-`,
        background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
        color: `${isDarkMode ? "#ffffff" : "000000"}`,
        confirmButtonColor: `${isDarkMode ? "#007bff" : "444"}`,
        customClass: {
          popup: "custom-border", // Clase personalizada para el borde
        }
      });
      return false;
    }

    // Si pasa todas las validaciones
    return true;
  };

  const handleFinalSubmit = async () => {
    const FormulariosCombinados = {
      ...formInventario.datosInventario,
      ...formInventario.datosCuenta,
      activosFijos: datosTablaActivoFijo,
    };

    console.log(FormulariosCombinados);

    if (handleValidar()) {
      const confirmResult = await Swal.fire({
        icon: "info",
        title: "Confirmar registro",
        text: "¿Desea registrar el inventario de activos con la información proporcionada?",
        showCancelButton: true,
        confirmButtonText: "Confirmar y registrar",
        cancelButtonText: "Cancelar",
        background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
        color: `${isDarkMode ? "#ffffff" : "000000"}`,
        confirmButtonColor: `${isDarkMode ? "#007bff" : "444"}`,
        customClass: { popup: "custom-border" }
      });

      if (confirmResult.isConfirmed) {
        try {
          const resultado = await registrarFormInventarioActions(FormulariosCombinados);

          if (resultado) {
            // Espera a obtener el nuevo código antes de continuar
            // funcionObtieneMaxRegistro();
            dispatch(setNRecepcionActions(0));
            dispatch(setFechaRecepcionActions(""));
            dispatch(setNOrdenCompraActions(""));
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
            dispatch(setNombreEspecieActions(""));
            dispatch(setDescripcionEspecieActions(""));
            dispatch(vaciarDatosTabla());
            dispatch(showInputActions(false));
            dispatch(setOtraModalidadActions(""));
            dispatch(setInventarioRegistrado(1));//Estado mostrar resumen en paso 1
            onReset(); // Vuelve al paso 1
            //  Muestra el código obtenido después de esperarlo
            // Swal.fire({
            //   icon: "success",
            //   title: "Registro exitoso",
            //   text: `Se ha registrado con éxito su formulario`,
            //   background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
            //   color: `${isDarkMode ? "#ffffff" : "000000"}`,
            //   confirmButtonColor: `${isDarkMode ? "#007bff" : "444"}`,
            //   customClass: { popup: "custom-border" }
            // });

          } else {
            dispatch(setInventarioRegistrado(0));
            Swal.fire({
              icon: "error",
              title: "Error",
              text: "Ocurrió un error al registrar el formulario. Si el problema persiste, por favor contacte a la Unidad de Desarrollo para recibir asistencia.",
              background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
              color: `${isDarkMode ? "#ffffff" : "000000"}`,
              confirmButtonColor: `${isDarkMode ? "#007bff" : "444"}`,
              customClass: { popup: "custom-border" }
            });
          }
        } catch (error) {
          console.error("Error al registrar el formulario:", error);
          Swal.fire({
            icon: "error",
            title: "Error inesperado",
            text: "Ocurrió un error inesperado. Por favor, inténtelo nuevamente.",
            background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
            color: `${isDarkMode ? "#ffffff" : "000000"}`,
            confirmButtonColor: `${isDarkMode ? "#007bff" : "444"}`,
            customClass: { popup: "custom-border" }
          });
        }
      }

    }
  };

  const paginar = (numeroPagina: number) => setPaginaActual(numeroPagina);

  return (
    <>
      <div className={`border border-botom p-4 rounded ${isDarkMode ? "darkModePrincipal text-light border-secondary" : ""}`}>
        <h3 className="form-title fw-semibold border-bottom">
          Detalles activo
        </h3>
        <div className="d-flex justify-content-between align-items-center mb-4">
          {/* Contenedor para Monto Recepción y Monto Pendiente */}
          <div className="d-flex">
            <div className="mx-1 bg-primary text-white p-1 rounded">
              <p className="text-center">Monto Recepción</p>
              <p className="fw-semibold text-center">
                $ {montoRecepcion.toLocaleString("es-ES", { minimumFractionDigits: 0 })}
              </p>
            </div>
            <div className=" mx-1 bg-secondary text-white p-1 rounded">
              <p className="text-center">Monto Pendiente</p>
              <p className="fw-semibold text-center">
                $ {(montoRecepcion - totalSum).toLocaleString("es-ES", {
                  minimumFractionDigits: 0,
                })}
              </p>
            </div>
          </div>

          {/* Contenedor para los Botones */}
          <div className="d-flex">
            <div className="mb-1 mx-1">
              {/* habilita Boton Modal formulario si solo monto recepcion y total coinciden y si la especie tiene datos */}
              {totalSum != montoRecepcion && nombreEspecie.length > 0 && (
                <Button
                  className="align-content-center"
                  variant={`${isDarkMode ? "secondary" : "primary"}`}
                  onClick={() => setMostrarModal(true)}
                >
                  <Plus className="flex-shrink-0 h-5 w-5 mx-1" aria-hidden="true" />
                  Agregar
                </Button>
              )}
            </div>
          </div>
        </div>


        {/* Boton elimina filas seleccionadas */}
        <div className="d-flex justify-content-start">
          {filasSeleccionadas.length > 0 && (
            <Button
              variant="danger"
              onClick={handleEliminarSeleccionados}
              className="m-1 p-2 d-flex align-items-center"  // Alinea el spinner y el texto
            >
              Eliminar
              <span className="badge bg-light text-dark mx-1">
                {filasSeleccionadas.length}
              </span>
              {filasSeleccionadas.length === 1 ? "Activo seleccionado" : "Activos seleccionados"}
            </Button>
          )}
        </div>
        {/* Mostrar errores generales */}
        {error.generalTabla && (
          <div className="alert alert-danger" role="alert">
            {error.generalTabla}
          </div>
        )}
        {/* Tabla */}
        {datos.length === 0 ? (
          <p className="d-flex justify-content-center m-1 p-1 ">
            Haz clic en (+ Agregar) para listar aquí los detalles de cada activo.
          </p>
        ) : (
          <div className='table-responsive'>
            <table className={`table ${isDarkMode ? "table-dark" : "table-hover table-striped"}`}>
              <thead className={`sticky-top ${isDarkMode ? "table-dark" : "text-dark table-light"}`}>
                <tr >
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
                  <th>Código</th>
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
                {elementosActuales.map((activo, index) => {
                  const indexReal = indicePrimerElemento + index; // Índice real basado en la página
                  return (
                    <tr key={indexReal}>
                      <td>
                        <Form.Check
                          type="checkbox"
                          onChange={() => setSeleccionaFilas(indexReal)}
                          checked={filasSeleccionadas.includes(indexReal.toString())}
                        />
                      </td>
                      <td>{activo.id}</td>
                      <td>{activo.vidaUtil}</td>
                      <td>{activo.fechaIngreso}</td>
                      <td>{activo.marca}</td>
                      <td>{activo.modelo}</td>
                      <td
                        className={`${isDarkMode ? "text-light" : "text-dark"} w-15`}
                        onClick={() => setEditingSerie(indexReal.toString())}
                      >
                        <div className={`d-flex align-items-center ${isDarkMode ? "text-light" : "text-dark"}`}>
                          <Form.Control
                            type="text"
                            value={activo.serie}
                            onChange={(e) => handleCambiaSerie(index, e.target.value)}
                            onBlur={handleSerieBlur}
                            autoFocus
                            maxLength={10}
                            pattern="\d*"
                            placeholder="Editar"
                            data-index={indexReal}
                            // Agregar clase condicional si hay un error en la serie
                            className={`${erroresSerie[indexReal] ? "is-invalid" : ""} ${isDarkMode ? "bg-secondary-subtle" : ""}`}

                          />
                          <PencilFill
                            style={{ marginLeft: "1rem", color: "#6c757d" }}
                          />{" "}
                          {/* Ícono de lápiz */}
                        </div>
                        {erroresSerie[indexReal] && (
                          <div className="invalid-feedback fw-semibold d-block">
                            {erroresSerie[indexReal]}
                          </div>
                        )}
                      </td>

                      <td >
                        $
                        {parseFloat(activo.precio).toLocaleString("es-ES", {
                          minimumFractionDigits: 0,
                        })}
                      </td>
                      <td className="fw-bold" style={{ backgroundColor: activo.color || "transparent" }}> {activo.especie}</td>
                      <td>
                        {/* Clonar */}
                        {/* <Button variant="outline-secondary" size="sm" onClick={() => handleClone(activo)} className="me-2">*/}

                        {/* </Button> */}
                        <Button variant="outline-danger" size="sm" className="rounded-2" onClick={() => handleEliminar(indexReal)} /*, parseFloat(activo.precio */>
                          <Trash
                            className="flex-shrink-0 h-5 w-5"
                            aria-hidden="true"
                          />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={6} className={`text-right ${isDarkMode ? "text-light" : "text-dark"}`}>
                    <strong >Total activo fijo:</strong>
                  </td>
                  <td colSpan={3}>
                    <strong >
                      ${totalSum.toLocaleString("es-ES", { minimumFractionDigits: 0, })}
                    </strong>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}

        {/* Paginador*/}
        {elementosActuales.length > 0 && (
          <div className="paginador-container">
            <Pagination className="paginador-scroll">
              <Pagination.First onClick={() => paginar(1)} disabled={paginaActual === 1} />
              <Pagination.Prev onClick={() => paginar(paginaActual - 1)} disabled={paginaActual === 1} />
              {Array.from({ length: totalPaginas }, (_, i) => (<Pagination.Item key={i + 1} active={i + 1 === paginaActual} onClick={() => paginar(i + 1)}>{i + 1} </Pagination.Item>))}
              <Pagination.Next onClick={() => paginar(paginaActual + 1)} disabled={paginaActual === totalPaginas} />
              <Pagination.Last onClick={() => paginar(totalPaginas)} disabled={paginaActual === totalPaginas} />
            </Pagination>
          </div>
        )}
        {/* Botones volver y confirmar*/}
        <div className="d-flex justify-content-end mt-3 justify-content-between">

          <Button onClick={handleVolver} variant={` m-1 btn ${isDarkMode ? "btn-secondary" : "btn-primary"}`}>
            Volver
          </Button>

          {elementosActuales.length > 0 && (
            <Button variant={`btn ${isDarkMode ? "btn-secondary" : "btn-primary"}  m-1`}
              onClick={handleFinalSubmit} >
              Validar
            </Button>
          )}
        </div>
        {/* Modal formulario Activos Fijo*/}
        < Modal
          show={mostrarModal}
          onHide={() => setMostrarModal(false)}
          size="lg"
        >
          <Modal.Header className={`${isDarkMode ? "darkModePrincipal" : ""}`} closeButton>
            <Modal.Title className="fw-semibold">Agregar activos fijos</Modal.Title>
          </Modal.Header>

          <Modal.Body className={`${isDarkMode ? "darkModePrincipal" : ""}`}>
            {/* Mostrar errores generales en el modal */}
            {error.general && (
              <div className="alert alert-danger" role="alert">
                {error.general}
              </div>
            )}

            <form onSubmit={handleAgregar}>
              <Row>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  {/* Contenedor para Monto Recepción y Monto Pendiente */}
                  <div className="d-flex">
                    <div className="mx-1 bg-primary text-white p-1 rounded">
                      <p className="text-center">Monto Recepción</p>
                      <p className="fw-semibold text-center">
                        $ {montoRecepcion.toLocaleString("es-ES", { minimumFractionDigits: 0 })}
                      </p>
                    </div>
                    <div className=" mx-1 bg-secondary text-white p-1 rounded">
                      <p className="text-center">Monto Pendiente</p>
                      <p className="fw-semibold text-center">
                        $ {(montoRecepcion - totalSum).toLocaleString("es-ES", {
                          minimumFractionDigits: 0,
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Contenedor para los Botones */}
                  <div className="d-flex">
                    <div className="mb-1 mx-1">
                      <Button type="submit" variant={`${isDarkMode ? "secondary" : "primary "} mx-2`}>
                        <Floppy
                          className="flex-shrink-0 me-2 h-5 w-5"
                          aria-hidden="true"
                        />
                        Guardar
                      </Button>
                    </div>
                    <div className="mb-1 mx-1">
                      <Button onClick={handleLimpiar} variant={`${isDarkMode ? "secondary" : "primary "}`}>
                        <Eraser
                          className="flex-shrink-0 me-2 h-5 w-5"
                          aria-hidden="true"
                        />
                        Limpiar
                      </Button>
                    </div>
                  </div>
                </div>
                <Col md={6}>
                  <div className="mb-1">
                    <label htmlFor="vidaUtil" className="fw-semibold">
                      Vida Útil
                    </label>
                    <input
                      type="text"
                      className={`form-control ${error.vidaUtil ? "is-invalid " : ""} ${isDarkMode ? "bg-dark text-light border-secondary" : ""}`}
                      id="vidaUtil"
                      name="vidaUtil"
                      maxLength={10}
                      onChange={handleChange}
                      value={activoActual.vidaUtil}
                    />
                    {error.vidaUtil && (
                      <div className="invalid-feedback fw-semibold">{error.vidaUtil}</div>
                    )}
                  </div>

                  <div className="mb-1">
                    <label htmlFor="fechaIngreso" className="fw-semibold">
                      Fecha Ingreso
                    </label>
                    <input
                      type="date"
                      className={`form-control ${error.fechaIngreso ? "is-invalid " : ""} ${isDarkMode ? "bg-dark text-light border-secondary" : ""}`}
                      id="fechaIngreso"
                      name="fechaIngreso"
                      onChange={handleChange}
                      value={activoActual.fechaIngreso}
                    />
                    {error.fechaIngreso && (
                      <div className="invalid-feedback fw-semibold">{error.fechaIngreso}</div>
                    )}
                  </div>

                  <div className="mb-1">
                    <label htmlFor="marca" className="fw-semibold">
                      Marca
                    </label>
                    <input
                      type="text"
                      className={`form-control ${error.marca ? "is-invalid" : ""} ${isDarkMode ? "bg-dark text-light border-secondary" : ""}`}
                      id="marca"
                      name="marca"
                      maxLength={20}
                      onChange={handleChange}
                      value={activoActual.marca}
                    />
                    {error.marca && (
                      <div className="invalid-feedback fw-semibold">{error.marca}</div>
                    )}
                  </div>

                  <div className="mb-1">
                    <label htmlFor="modelo" className="fw-semibold">
                      Modelo
                    </label>
                    <input
                      type="text"
                      className={`form-control ${error.modelo ? "is-invalid" : ""} ${isDarkMode ? "bg-dark text-light border-secondary" : ""}`}
                      id="modelo"
                      name="modelo"
                      maxLength={20}
                      onChange={handleChange}
                      value={activoActual.modelo}
                    />
                    {error.modelo && (
                      <div className="invalid-feedback fw-semibold">{error.modelo}</div>
                    )}
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-1">
                    <label htmlFor="precio" className="fw-semibold">
                      Precio
                    </label>
                    <input
                      type="text"
                      className={`form-control ${error.precio ? "is-invalid " : ""} ${isDarkMode ? "bg-dark text-light border-secondary" : ""}`}
                      id="precio"
                      name="precio"
                      maxLength={12}
                      onChange={handleChange}
                      value={activoActual.precio}
                    />
                    {error.precio && (
                      <div className="invalid-feedback fw-semibold">{error.precio}</div>
                    )}
                  </div>

                  <div className="mb-1">
                    <label htmlFor="cantidad" className="fw-semibold">
                      Cantidad
                    </label>
                    <input
                      type="text"
                      className={`form-control ${error.cantidad ? "is-invalid " : ""} ${isDarkMode ? "bg-dark text-light border-secondary" : ""}`}
                      id="cantidad"
                      name="cantidad"
                      maxLength={6}
                      onChange={handleChange}
                      value={activoActual.cantidad}
                    />
                    {error.cantidad && (
                      <div className="invalid-feedback fw-semibold">{error.cantidad}</div>
                    )}
                  </div>
                  <div className="mb-1">
                    <label htmlFor="observaciones" className="fw-semibold">
                      Observaciones
                    </label>
                    <textarea
                      className={`form-control ${error.observaciones ? "is-invalid " : ""} ${isDarkMode ? "bg-dark text-light border-secondary" : ""}`}
                      aria-label="observaciones"
                      name="observaciones"
                      rows={4}
                      // maxLength={500}
                      style={{ minHeight: "8px", resize: "none" }}
                      onChange={handleChange}
                      value={activoActual.observaciones}
                    />
                    {error.observaciones && (
                      <div className="invalid-feedback fw-semibold">
                        {error.observaciones}
                      </div>
                    )}
                  </div>
                </Col>
              </Row>
            </form>
          </Modal.Body >
        </Modal >
      </div >
    </>
  );
};

const mapStateToProps = (state: RootState) => ({
  montoRecepcion: state.obtenerRecepcionReducers.montoRecepcion,
  nombreEspecie: state.datosActivoFijoReducers.nombreEspecie,
  resetFormulario: state.datosActivoFijoReducers.resetFormulario,
  datosTablaActivoFijo: state.datosActivoFijoReducers.datosTablaActivoFijo,
  isDarkMode: state.darkModeReducer.isDarkMode,
  vidaUtil: state.datosActivoFijoReducers.vidaUtil,
  fechaIngreso: state.datosActivoFijoReducers.fechaIngreso,
  marca: state.datosActivoFijoReducers.marca,
  cantidad: state.datosActivoFijoReducers.cantidad,
  modelo: state.datosActivoFijoReducers.modelo,
  observaciones: state.datosActivoFijoReducers.observaciones,
  precio: state.datosActivoFijoReducers.precio,
  // AF_CODIGO_GENERICO: state.obtenerMaxInventarioReducers.AF_CODIGO_GENERICO
});
export default connect(mapStateToProps, {
  registrarFormInventarioActions,
  // obtenerMaxInventarioActions
})(DatosActivoFijo);
