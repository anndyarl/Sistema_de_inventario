import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState, useMemo, useEffect } from "react";
import { Modal, Button, Form, Pagination, Row, Col, } from "react-bootstrap";
import { Eraser, EraserFill, Floppy, PencilSquare, Plus, Trash } from "react-bootstrap-icons";
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
  setActualizaMantenerCuenta,
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
import { ListaEspecie } from "./DatosCuenta";
import { styleText } from "util";
import { IndicadoresProps } from "../../Navegacion/Profile";
import Inventario from "../../../containers/pages/Inventario";
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
  cuenta: string;
  cuentaOriginal: string;
  color?: string;
  chkMantener?: boolean;
  chkMantenerForm?: boolean;
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
  nCuenta: number[];
  datosTablaActivoFijo: ActivoFijo[];
  general?: string; // Campo para errores generales
  generalTabla?: string;
  formInventario: FormInventario;
  registrarFormInventarioActions: (formInventario: Record<string, any>) => Promise<Boolean>;
  isDarkMode: boolean;
  vidaUtil: string;
  fechaIngreso: string;
  marca: string;
  cantidad: string;
  modelo: string;
  observaciones: string;
  precio: string;
  comboEspecies: ListaEspecie[];
  utm: IndicadoresProps;
  // AF_CODIGO_GENERICO: number;//trae ultimo correlativo ingresado
}

//Paso 3 del Formulario
const DatosActivoFijo: React.FC<DatosActivoFijoProps> = ({
  onBack,
  onReset,
  montoRecepcion,
  nombreEspecie,
  nCuenta,
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
  comboEspecies,
  utm,
  // AF_CODIGO_GENERICO,
  registrarFormInventarioActions
}) => {
  const fechaHoy = new Date().toISOString().split("T")[0];//Se asigana fechade manera automatica a fechaIngreso

  //Estado que guarda en un array los objetos que irán en la tabla
  const [activosFijos, setActivosFijos] = useState<ActivoFijo[]>([]);
  //Estado que guarda los objetos del formulario(dentro del Modal)
  const [activoFormulario, setActivoFormulario] = useState<ActivoFijo>({
    id: "",
    vidaUtil: "",
    fechaIngreso: fechaHoy,
    marca: "",
    cantidad: "",
    modelo: "",
    observaciones: "",
    serie: "",
    precio: "",
    especie: "",
    cuenta: "",
    cuentaOriginal: "",
    chkMantenerForm: true
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

  const [erroresSerie, setErroresSerie] = useState<{ [key: number]: string }>({});
  const vPrecio = parseFloat(activoFormulario.precio) || 0;
  const vCantidad = parseInt(activoFormulario.cantidad, 10) || 0;
  const [Paginacion, setPaginacion] = useState({
    nPaginacion: 10
  });
  const elementosPorPagina = Paginacion.nPaginacion;
  // Combina el estado local de react con el estado local de redux
  const datos = activosFijos;
  // const datos = useMemo(() => {
  //   return datosTablaActivoFijo.length > 0
  //     ? datosTablaActivoFijo
  //     : activosFijos;
  // }, [datosTablaActivoFijo, activosFijos]);

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
  // Calcular pendiente
  const pendiente = montoRecepcion - totalSum;
  //Multiplica valor utm
  const Utmxtres = utm.valor * 3;

  //Formatear la fecha actual en español (Chile)

  //Validaciones del formulario
  const validate = () => {
    let tempErrors: Partial<ActivoFijo> & { general?: string } = {};
    if (!activoFormulario.vidaUtil) tempErrors.vidaUtil = "Campo obligatorio";
    else if (!/^\d+$/.test(activoFormulario.vidaUtil)) tempErrors.vidaUtil = "Vida útil debe ser un número";
    if (!activoFormulario.marca) tempErrors.marca = "Campo obligatorio";
    if (!activoFormulario.modelo) tempErrors.modelo = "Campo obligatorio";
    if (!activoFormulario.cantidad) tempErrors.cantidad = "Campo obligatorio";
    else if (isNaN(parseInt(activoFormulario.cantidad))) tempErrors.cantidad = "Cantidad debe ser un número";
    if (!activoFormulario.precio) tempErrors.precio = "Campo obligatorio";
    else if (!/^\d+$/.test(activoFormulario.precio)) tempErrors.precio = "Precio debe ser un número entero";
    if (!activoFormulario.observaciones) tempErrors.observaciones = "Campo obligatorio";
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
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, type, value } = e.target;

    const newValue = type === "checkbox" && "checked" in e.target
      ? (e.target as HTMLInputElement).checked
      : value;

    setActivoFormulario((prevData) => ({
      ...prevData,
      [name]: newValue
    }));

    setPaginacion((prevState) => ({
      ...prevState,
      [name]: newValue,
    }));
  };

  const handleCambiaSerie = (indexVisible: number, newSerie: string) => {
    const indexReal = indicePrimerElemento + indexVisible;

    setActivosFijos((prevActivos) => {
      const actualizaActivos = prevActivos.map((activo, i) =>
        i === indexReal ? { ...activo, serie: newSerie } : activo
      );

      // Validar si hay series vacías
      const serieVacia = actualizaActivos.some((activo) => !activo.serie.trim());
      setActivoFormulario((prevData) => ({
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
    setActivoFormulario({
      id: "",
      vidaUtil,
      fechaIngreso: fechaHoy,
      marca,
      cantidad,
      modelo,
      observaciones,
      serie: "",
      precio,
      especie: "",
      cuenta: "",
      cuentaOriginal: "",
      chkMantenerForm: true
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
  };

  const handleSeleccionaTodos = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;

    if (isChecked) {
      // 1) Calcula los índices reales de la página actual
      const seleccionados = elementosActuales.map((_, idx) =>
        (indicePrimerElemento + idx).toString()
      );

      // 2) Actualiza la selección
      setFilasSeleccionadas(seleccionados);

      // 3) Restaura chkMantener y cuentaOriginal para esas filas
      setActivosFijos((prevActivos) =>
        prevActivos.map((activo, i) => {
          if (seleccionados.includes(i.toString())) {
            const original = activo.cuentaOriginal ?? activo.cuenta;
            // Despacha también a Redux
            dispatch(setActualizaMantenerCuenta(i, true, original));
            return {
              ...activo,
              chkMantener: true,
              cuenta: original
            };
          }
          return activo;
        })
      );
    } else {
      // Solo deselecciona sin tocar el estado de cuenta
      setFilasSeleccionadas([]);
    }
  };




  const handleAgregar = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (validate()) {
      const cantidad = parseInt(activoFormulario.cantidad, 10);
      const ultimaEspecie = nombreEspecie[nombreEspecie.length - 1] || "";
      // console.log("ultimaEspecie", ultimaEspecie);
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
        ...activoFormulario,
        id: `${Math.floor(performance.now())}${Math.floor(Math.random() * 1000)}`,
        especie: ultimaEspecie,
        cuenta: Utmxtres > parseInt(activoFormulario.precio) ? "5320413" : nCuenta.toString(),
        cuentaOriginal: nCuenta.toString(),
        color: colorUltimaEspecie, // Asigna el color correspondiente a la ultima especie
        chkMantener: Utmxtres > parseInt(activoFormulario.precio) ? false : true
      }));
      setActivosFijos((prev) => [...prev, ...newActivos]);

      // Despacha el array de nuevos activos a Redux
      dispatch(setDatosTablaActivoFijo(newActivos));
      dispatch(setVidaUtilActions(activoFormulario.vidaUtil));
      dispatch(setFechaIngresoActions(activoFormulario.fechaIngreso));
      dispatch(setMarcaActions(activoFormulario.marca));
      dispatch(setModeloActions(activoFormulario.modelo));
      dispatch(setPrecioActions(activoFormulario.precio));
      dispatch(setCantidadActions(activoFormulario.cantidad));
      dispatch(setObservacionesActions(activoFormulario.observaciones));
      setMostrarModal(false); //Cierra modal
    }
  };

  const handleCheck = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const { name, checked } = e.target;

    if (name === "chkMantener") {
      const nuevosDatos = activosFijos.map((activo, i) =>
        i === index
          ? {
            ...activo,
            cuenta: checked ? activo.cuentaOriginal : "5320413",
            chkMantener: checked,
          }
          : activo
      );

      setActivosFijos(nuevosDatos);

      // Usa tu acción personalizada
      const nuevaCuenta = checked ? activosFijos[index].cuentaOriginal : "5320413";

      //este se encargarà de despacharlo 
      dispatch(setActualizaMantenerCuenta(index, checked, nuevaCuenta));
    }
  };


  const handleLimpiar = () => {
    setActivoFormulario((prevData) => ({
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

  const handleMantenerCuentaSeleccionados = () => {
    // 1) Convierte los índices seleccionados a números
    const selectedIndices = filasSeleccionadas.map(Number);

    // 2) Recorre todo el array y aplica la lógica en los seleccionados
    const nuevosDatos = activosFijos.map((activo, index) => {
      if (selectedIndices.includes(index)) {
        // Si está seleccionado, invierte el estado de chkMantener
        const nuevoChk = !activo.chkMantener;
        const nuevaCuenta = nuevoChk
          ? activo.cuentaOriginal   // restaura la original si ahora la mantiene
          : "5320413";              // sino asigna la pequeña

        // Despacha también a Redux
        dispatch(setActualizaMantenerCuenta(index, nuevoChk, nuevaCuenta));

        // Retorna el objeto actualizado
        return {
          ...activo,
          chkMantener: nuevoChk,
          cuenta: nuevaCuenta
        };
      }
      return activo; // no seleccionado → sin cambio
    });

    // 3) Actualiza tu estado local de la tabla
    setActivosFijos(nuevosDatos);
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
    //A peticion del usuario la serie no es obligatoria
    // Verifica si hay series vacías
    // const serieVacia = activosFijos?.some(
    //   (activo) => !activo.serie || !activo.serie.trim()
    // );

    // if (serieVacia) {
    //   Swal.fire({
    //     icon: "warning",
    //     title: "Serie Faltante",
    //     text: "Por favor, verifique que todos los registros contengan su número de serie.",
    //     background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
    //     color: `${isDarkMode ? "#ffffff" : "000000"}`,
    //     confirmButtonColor: `${isDarkMode ? "#007bff" : "444"}`,
    //     customClass: {
    //       popup: "custom-border", // Clase personalizada para el borde
    //     }
    //   });
    //   return false;
    // }

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
    const activosFinales = activosFijos.map(({ cuentaOriginal, ...resto }) => resto);
    const FormulariosCombinados = {
      ...formInventario.datosInventario,
      ...formInventario.datosCuenta,
      activosFijos: activosFinales,
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

  //Selecciona todas las cuentas checadas
  const selectedIndices = filasSeleccionadas.map(Number);
  const mantenerTodo = selectedIndices.length > 0 && selectedIndices.every(i => activosFijos[i].chkMantener);

  return (
    <>
      <div className={`border border-botom p-4 rounded ${isDarkMode ? "darkModePrincipal text-light border-secondary" : ""}`}>
        <h3 className="form-title fw-semibold border-bottom">
          Detalles activo
        </h3>
        <div className="d-flex justify-content-between align-items-center mb-4">
          {/* Contenedor para Monto Recepción y Monto Pendiente */}
          <div className="d-flex">
            <div className="mx-1 bg-primary text-white p-2 rounded">
              <p className="text-center">Monto Recepción</p>
              <p className="fw-semibold text-center">
                $ {montoRecepcion.toLocaleString("es-ES", { minimumFractionDigits: 0 })}
              </p>
            </div>
            <div className=" mx-1 bg-secondary text-white p-2 rounded">
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

        <div className="d-flex justify-content-end">
          {/* Boton Mantener Cuenta multiple */}
          {filasSeleccionadas.length > 0 && (
            <Button
              variant={mantenerTodo ? "secondary" : "primary"}
              onClick={handleMantenerCuentaSeleccionados}
              className="mb-1 p-2 mx-1 d-flex align-items-center"
            >
              {mantenerTodo ? "Descartar Cuentas" : "Mantener Cuentas"}
              <span className="badge bg-light text-dark mx-1 mt-1">
                {filasSeleccionadas.length}
              </span>
            </Button>
          )}

          {/* Boton elimina filas seleccionadas */}
          {filasSeleccionadas.length > 0 && (
            <Button
              variant="danger"
              onClick={handleEliminarSeleccionados}
              className="mb-1 p-2 mx-1 d-flex align-items-center"  // Alinea el spinner y el texto
            >
              Quitar
              <span className="badge bg-light text-dark mx-1 mt-1">
                {filasSeleccionadas.length}
              </span>
            </Button>
          )}
          <div className="d-flex align-items-center mx-2 mb-1 p-2">
            <label htmlFor="nPaginacion" className="form-label fw-semibold mb-0 me-2">
              Tamaño de página:
            </label>
            <select
              aria-label="Seleccionar tamaño de página"
              className={`form-select form-select-sm w-auto ${isDarkMode ? "bg-dark text-light border-secondary" : ""}`}
              name="nPaginacion"
              onChange={handleChange}
              value={Paginacion.nPaginacion}
            >
              {[10, 20, 30, datos.length].map((val) => (
                <option key={val} value={val}>{val}</option>
              ))}
            </select>
          </div>
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
                      className="text-center"
                      onChange={handleSeleccionaTodos}
                      checked={filasSeleccionadas.length === elementosActuales.length && elementosActuales.length > 0}
                    />
                  </th>
                  <th className="text-center">Especie</th>
                  <th className="text-center">Vida Útil</th>
                  <th className="text-center">Fecha Ingreso</th>
                  <th className="text-center">Marca</th>
                  <th className="text-center">Modelo</th>
                  <th className="text-center">Serie</th>
                  <th className="text-center">Precio</th>
                  <th className="text-center">Cuenta</th>
                  <th className="text-center" >Mantener Cuenta</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {elementosActuales.map((activo, index) => {
                  const indexReal = indicePrimerElemento + index; // Índice real basado en la página
                  return (
                    <tr key={indexReal}>
                      <td className="text-center">
                        <Form.Check
                          type="checkbox"
                          onChange={() => setSeleccionaFilas(indexReal)}
                          checked={filasSeleccionadas.includes(indexReal.toString())}
                        />
                      </td>
                      <td className="fw-bold text-center" style={{ backgroundColor: activo.color || "transparent" }}>
                        {comboEspecies.find((esp) => esp.esP_CODIGO === activo.especie)?.nombrE_ESP || activo.especie}
                      </td>
                      <td className="text-center">{activo.vidaUtil}</td>

                      <td className="text-center"> {activo.fechaIngreso
                        ? activo.fechaIngreso.split('-').reverse().join('/')
                        : 'N/A'
                      }</td>
                      <td className="text-center">{activo.marca}</td>
                      <td className="text-center">{activo.modelo}</td>
                      <td
                        className={` ${isDarkMode ? "text-light" : "text-dark"} w-15`}
                        onClick={() => setEditingSerie(indexReal.toString())}
                      >
                        <div className={`d-flex align-items-center  ${isDarkMode ? "text-light" : "text-dark"}`}>
                          <Form.Control
                            type="text"
                            value={activo.serie}
                            onChange={(e) => handleCambiaSerie(index, e.target.value)}
                            onBlur={handleSerieBlur}
                            autoFocus
                            maxLength={10}
                            placeholder="-"
                            pattern="\d*"
                            data-index={indexReal}
                            // Agregar clase condicional si hay un error en la serie
                            className={` text-center ${erroresSerie[indexReal] ? "is-invalid" : ""} ${isDarkMode ? "bg-secondary-subtle" : ""}`}

                          />
                          <PencilSquare
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

                      <td className="text-center">${parseFloat(activo.precio).toLocaleString("es-ES", { minimumFractionDigits: 0, })}</td>
                      <td className="fw-bold text-center">{activo.cuenta}</td>
                      {Utmxtres > parseInt(activo.precio) ? (
                        <td className="text-center"
                          style={{ width: "100px", minWidth: "150px", maxWidth: "40px" }}
                        >
                          <Form.Check
                            onChange={(e) => handleCheck(e, indexReal)}
                            name="chkMantener"
                            type="checkbox"
                            className="form-switch"
                            checked={activo.chkMantener ?? true}
                          />
                        </td>
                      ) : (
                        <>
                          <td className="text-center">
                            -
                          </td>
                        </>
                      )}
                      <td>
                        {/* ELiminar */}
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
                  <td colSpan={8} className={`text-right ${isDarkMode ? "text-light" : "text-dark"}`}>
                    <strong >Total activo fijo:</strong>
                  </td>
                  <td colSpan={8}>
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
                  <div className="d-flex p-1">
                    <div className="mx-1 bg-primary text-white p-2 rounded">
                      <p className="text-center">Monto Recepción</p>
                      <p className="fw-semibold text-center">
                        $ {montoRecepcion.toLocaleString("es-ES", { minimumFractionDigits: 0 })}
                      </p>
                    </div>
                    <div className=" mx-1 bg-secondary text-white p-2 rounded">
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
                    <div className="mb-1 mx-2">
                      <Button type="submit" variant={`${isDarkMode ? "secondary" : "primary "} `}>
                        Guardar
                        <Floppy
                          className="flex-shrink-0 me-2 h-5 w-5 ms-1"
                          aria-hidden="true"
                        />
                      </Button>
                    </div>
                    <div className="mb-1">
                      <Button
                        onClick={handleLimpiar}
                        variant="primary"
                        className={`btn ${isDarkMode ? "btn-secondary" : "btn-primary"}`}
                      >
                        Limpiar
                        {
                          (() => {
                            const { ...restoTraslados } = activoFormulario;
                            const tieneDatos = Object.values(restoTraslados).some(
                              (valor) => valor !== ""
                            );

                            return tieneDatos ? (
                              <EraserFill
                                className="flex-shrink-0 h-5 w-5 ms-1"
                                aria-hidden="true"
                              />
                            ) : (
                              <Eraser
                                className="flex-shrink-0 h-5 w-5 ms-1"
                                aria-hidden="true"
                              />

                            );
                          })()
                        }
                      </Button>
                    </div>
                  </div>
                </div>
                <Col md={6}>
                  {/* <div className="mb-1">
                    <label htmlFor="cuenta" className="fw-semibold">
                      Cuenta
                    </label>
                    <p className="border p-2 bg-light rounded">
                      {activoFormulario.chkMantener !== false
                        ? nCuenta
                        : "5320413"}
                    </p>
                  </div> */}
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
                      value={activoFormulario.vidaUtil}
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
                      name="fechaIngreso"
                      id="fechaIngreso"
                      onChange={handleChange}
                      disabled
                      value={activoFormulario.fechaIngreso}
                    />
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
                      value={activoFormulario.marca}
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
                      value={activoFormulario.modelo}
                    />
                    {error.modelo && (
                      <div className="invalid-feedback fw-semibold">{error.modelo}</div>
                    )}
                  </div>

                </Col>
                <Col md={6}>
                  {/* <div className="mb-1">
                    <label htmlFor="cantidad" className="fw-semibold">
                      Mantener Cuenta
                    </label>
                    <Form.Check
                      onChange={handleChange}
                      name="chkMantenerForm"
                      type="checkbox"
                      className="form-switch"
                      checked={activoFormulario.chkMantenerForm}
                    />
                  </div> */}

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
                      value={activoFormulario.precio}
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
                      value={activoFormulario.cantidad}
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
                      value={activoFormulario.observaciones}
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
  nCuenta: state.datosActivoFijoReducers.nCuenta,
  comboEspecies: state.comboEspeciesBienReducers.comboEspecies,
  utm: state.indicadoresReducers.utm,

});
export default connect(mapStateToProps, {
  registrarFormInventarioActions,
  // obtenerMaxInventarioActions
})(DatosActivoFijo);
