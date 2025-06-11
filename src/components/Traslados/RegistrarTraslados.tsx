import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useMemo, useState } from "react";
import { Row, Col, Collapse, OverlayTrigger, Tooltip, Button, Spinner, Pagination, Modal, Form, CloseButton } from "react-bootstrap";
import { connect } from "react-redux";
import Layout from "../../containers/hocs/layout/Layout";
import { RootState } from "../../store";
import { ArrowLeftRight, CaretDown, CaretUpFill, Eraser, Search } from "react-bootstrap-icons";
import "../../styles/Traslados.css"
import Swal from "sweetalert2";
import { Objeto } from "../Navegacion/Profile";
import { Helmet } from "react-helmet-async";
import MenuTraslados from "../Menus/MenuTraslados";
import { DEPENDENCIA } from "../Inventario/RegistrarInventario/DatosCuenta";
import { comboEstablecimientoActions } from "../../redux/actions/Traslados/Combos/comboEstablecimientoActions";
import { comboTrasladoServicioActions } from "../../redux/actions/Traslados/Combos/comboTrasladoServicioActions";
import { comboTrasladoEspecieActions } from "../../redux/actions/Traslados/Combos/comboTrasladoEspecieActions";
import { comboDependenciaOrigenActions } from "../../redux/actions/Traslados/Combos/comboDependenciaoOrigenActions";
import { comboDependenciaDestinoActions } from "../../redux/actions/Traslados/Combos/comboDependenciaDestinoActions";
import { obtenerInventarioTrasladoActions } from "../../redux/actions/Traslados/obtenerInventarioTrasladoActions";
import { registroTrasladoActions } from "../../redux/actions/Traslados/RegistroTrasladoActions";
import Select from "react-select";
import { listadoDeEspeciesBienActions } from "../../redux/actions/Inventario/Combos/listadoDeEspeciesBienActions";
import SkeletonLoader from "../Utils/SkeletonLoader";
import { registroTrasladoMultipleActions } from "../../redux/actions/Informes/Principal/FolioPorServicioDependencia/registroTrasladoMultipleActions";
import { comboServicioInformeActions } from "../../redux/actions/Informes/Principal/FolioPorServicioDependencia/comboServicioInformeActions";
import { comboEspeciesBienActions } from "../../redux/actions/Inventario/Combos/comboEspeciesBienActions";
// Define el tipo de los elementos del combo `Establecimiento`
export interface ESTABLECIMIENTO {
  codigo: number;
  descripcion: string;
}
// Define el tipo de los elementos del combo `traslado servicio`
interface TRASLADOSERVICIO {
  codigo: number;
  descripcion: string;
}
// Define el tipo de los elementos del combo `traslado especie`
interface TRASLADOESPECIE {
  codigo: number;
  descripcion: string;
}

/*-----Tabla principal------*/
interface ListaATrasladar {
  aF_CLAVE: number;
  aF_CODIGO_GENERICO: string;
  deT_OBS: string;
  esP_NOMBRE: string;
  deP_CORR_ORIGEN: number;
}

/*----Tabla Modal---*/
export interface ListaTrasladoSeleccion {
  aF_CLAVE: string;
  aF_CODIGO_GENERICO: string;
  deT_OBS: string;
  serviciO_DEPENDENCIA: string;
  esP_NOMBRE: string;
  deT_MARCA: string;
  deT_MODELO: string;
  deT_SERIE: string;
  deP_CORR_ORIGEN: number;
}
/*------Formulario Modal--------*/
interface FormularioTraslado {
  deP_CORR_DESTINO: number;
  traS_MEMO_REF: string;
  traS_FECHA_MEMO: string;
  traS_OBS: string;
  traS_NOM_ENTREGA: string;
  traS_NOM_RECIBE: string;
  traS_NOM_AUTORIZA: string;
}

interface ListaEspecie {
  estabL_CORR: number;
  esP_CODIGO: string;
  nombrE_ESP: string;
}

interface SERVICIO {
  deP_CORR: number;
  descripcion: string;
}

interface TrasladosProps {
  registroTrasladoMultipleActions: (FormularioTraslado: Record<string, any>) => Promise<boolean>
  comboTrasladoServicio: TRASLADOSERVICIO[];
  comboTrasladoServicioActions: (establ_corr: number) => void;
  comboEstablecimiento: ESTABLECIMIENTO[];
  comboEstablecimientoActions: () => void;
  comboTrasladoEspecie: TRASLADOESPECIE[];
  comboTrasladoEspecieActions: (establ_corr: number) => void;
  comboDependenciaOrigen: DEPENDENCIA[];
  comboDependenciaDestino: DEPENDENCIA[];
  comboDependenciaOrigenActions: (comboServicioOrigen: string) => void; // Nueva prop para pasar el servicio seleccionado
  comboDependenciaDestinoActions: (comboServicioDestino: string) => void; // Nueva prop para pasar el servicio seleccionado
  registroTrasladoActions: (FormularioTraslado: Record<string, any>) => Promise<boolean>
  obtenerInventarioTrasladoActions: (aF_CODIGO_GENERICO: string, esP_CODIGO: string, deP_CORR: number, deT_MARCA: string, deT_MODELO: string, deT_SERIE: string) => Promise<boolean>
  listaTrasladoSeleccion: ListaTrasladoSeleccion[];
  comboEspecies: ListaEspecie[];
  comboServicioInformeActions: (establ_corr: number) => void;//En buscador  
  comboEspeciesBienActions: (EST: number, IDBIEN: number) => Promise<boolean>; //Carga Combo Especie
  comboServicioInforme: SERVICIO[];
  token: string | null;
  isDarkMode: boolean;
  objeto: Objeto;
}


const RegistrarTraslados: React.FC<TrasladosProps> = ({
  registroTrasladoMultipleActions,
  comboServicioInformeActions,
  comboTrasladoServicioActions,
  comboEstablecimientoActions,
  comboTrasladoEspecieActions,
  comboDependenciaOrigenActions,
  comboDependenciaDestinoActions,
  obtenerInventarioTrasladoActions,
  comboEspeciesBienActions,
  comboTrasladoServicio,
  comboEstablecimiento,
  comboTrasladoEspecie,
  comboDependenciaOrigen,
  comboEspecies,
  listaTrasladoSeleccion,
  comboServicioInforme,
  objeto,
  token,
  isDarkMode }) => {
  const [loading, setLoadingBuscar] = useState(false); // Estado para controlar la carga
  const [loadingBuscar, setLoading] = useState(false); // Estado para controlar la carga
  const [error, setError] = useState<Partial<FormularioTraslado> & {}>({});
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarModalTraslado, setMostrarModalTraslado] = useState(false);
  const [paginaActual, setPaginaActual] = useState(1);
  const [paginaActual1, setPaginaActual1] = useState(1);
  const [filasSeleccionadas, setFilasSeleccionadas] = useState<string[]>([]);
  const [filasSeleccionadasTraslados, setFilasSeleccionadasTraslados] = useState<string[]>([]);
  const [activosFijos, setActivosFijos] = useState<ListaATrasladar[]>([]);
  const [Paginacion, setPaginacion] = useState({
    nPaginacion: 10
  });
  const elementosPorPagina = Paginacion.nPaginacion;

  const [Paginacion1, setPaginacion1] = useState({
    nPaginacion1: 10
  });
  const elementosPorPagina1 = Paginacion1.nPaginacion1;

  const servicioFormOptions = comboServicioInforme.map((item) => ({
    value: item.deP_CORR,
    label: item.descripcion,
  }));
  const [Buscar, setBuscar] = useState({
    aF_CODIGO_GENERICO: "",
    seR_CORR: "",
    deP_CORR_ORIGEN: 0,
    esP_CODIGO: "",
    marca: "",
    modelo: "",
    serie: ""
  });

  const [Traslados, setTraslados] = useState({
    usuario_crea: objeto.IdCredencial.toString(),
    deP_CORR_DESTINO: 0,
    traS_CO_REAL: 0,
    traS_MEMO_REF: "",
    traS_FECHA_MEMO: "",
    traS_OBS: "",
    traS_NOM_ENTREGA: "",
    traS_NOM_RECIBE: "",
    traS_NOM_AUTORIZA: ""
  });

  const especieOptions = comboEspecies.map((item) => ({
    value: item.esP_CODIGO,
    label: item.nombrE_ESP,
  }));

  const handleComboEspecieChange = (selectedOption: any) => {
    const value = selectedOption ? selectedOption.value : "";
    setBuscar((prev) => ({ ...prev, esP_CODIGO: value }));
  };

  const validateForm = () => {
    let tempErrors: Partial<any> & {} = {};
    if (!Traslados.deP_CORR_DESTINO) tempErrors.deP_CORR_DESTINO = "Campo obligatorio.";
    if (!Traslados.traS_OBS) tempErrors.traS_OBS = "Campo obligatorio.";
    if (!Traslados.traS_MEMO_REF) tempErrors.traS_MEMO_REF = "Campo obligatorio.";
    if (!Traslados.traS_FECHA_MEMO) tempErrors.traS_FECHA_MEMO = "Campo obligatorio.";
    if (!Traslados.traS_NOM_ENTREGA) tempErrors.traS_NOM_ENTREGA = "Campo obligatorio.";
    if (!Traslados.traS_NOM_RECIBE) tempErrors.traS_NOM_RECIBE = "Campo obligatorio.";
    if (!Traslados.traS_NOM_AUTORIZA) tempErrors.traS_NOM_AUTORIZA = "Campo obligatorio.";
    setError(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  useEffect(() => {
    if (token) {
      // Verifica si las acciones ya fueron disparadas
      if (comboTrasladoServicio.length === 0) comboTrasladoServicioActions(objeto.Roles[0].codigoEstablecimiento);
      if (comboEstablecimiento.length === 0) comboEstablecimientoActions();
      if (comboTrasladoEspecie.length === 0) comboTrasladoEspecieActions(objeto.Roles[0].codigoEstablecimiento);
      if (comboDependenciaOrigen.length === 0) comboDependenciaOrigenActions("");
      if (comboServicioInforme.length === 0) comboServicioInformeActions(objeto.Roles[0].codigoEstablecimiento);
      if (comboEspecies.length === 0) comboEspeciesBienActions(objeto.Roles[0].codigoEstablecimiento, 0);
    }
  }, [comboTrasladoServicioActions,
    comboEstablecimientoActions,
    comboTrasladoEspecieActions,
    listaTrasladoSeleccion,
    comboServicioInforme,
    comboEspecies]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    // Validación específica para af_codigo_generico: solo permitir números
    if (name === "aF_CODIGO_GENERICO" && !/^[0-9]*$/.test(value)) {
      return; // Salir si contiene caracteres no numéricos
    }
    // Convierte `value` a número
    let newValue: string | number = ["deP_CORR_ORIGEN", "deP_CORR", "n_TRASLADO", "seR_CORR"].includes(name)
      ? parseFloat(value) || 0 // Convierte a `number`, si no es válido usa 0
      : value;

    setBuscar((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    setTraslados((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    setPaginacion((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    setPaginacion1((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    if (name === "seR_CORR") {
      comboDependenciaOrigenActions(value);
    }
    if (name === "traS_DET_CORR") {
      comboDependenciaDestinoActions(value);
    }

  };

  const handleServicioFormChange = (selectedOption: any) => {
    const value = selectedOption ? selectedOption.value : 0;
    setTraslados((prevInventario) => ({ ...prevInventario, deP_CORR_DESTINO: value }));
  };

  const [isExpanded, setIsExpanded] = useState({
    fila1: true,
    fila2: true,
    fila3: false,
  });

  const toggleRow = (fila: keyof typeof isExpanded) => {
    setIsExpanded((prevState) => ({
      ...prevState,
      [fila]: !prevState[fila],
    }));
  };

  const handleLimpiar = () => {
    setBuscar((prev) => ({
      ...prev,
      aF_CODIGO_GENERICO: "",
      seR_CORR: "",
      deP_CORR_ORIGEN: 0,
      esP_CODIGO: "",
      marca: "",
      modelo: "",
      serie: ""
    }));
  }

  const handleBuscar = async (e: React.MouseEvent<HTMLButtonElement>) => {
    let resultado = false;
    e.preventDefault();
    setLoadingBuscar(true); // Inicia el estado de carga
    if (Buscar.aF_CODIGO_GENERICO.trim() === "" &&
      Buscar.deP_CORR_ORIGEN === 0 &&
      Buscar.esP_CODIGO.trim() === "" &&
      Buscar.marca.trim() === "" &&
      Buscar.modelo.trim() === "" &&
      Buscar.serie.trim() === "") {
      Swal.fire({
        icon: "warning",
        title: "Filtro requerido",
        text: "Por favor, ingrese al menos un parámetro para realizar la búsqueda.",
        confirmButtonText: "Ok",
        background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
        color: `${isDarkMode ? "#ffffff" : "000000"}`,
        confirmButtonColor: `${isDarkMode ? "#007bff" : "444"}`,
        customClass: {
          popup: "custom-border",
        }
      });
      setLoadingBuscar(false);
      return;
    }


    resultado = await obtenerInventarioTrasladoActions(Buscar.aF_CODIGO_GENERICO, Buscar.esP_CODIGO, Buscar.deP_CORR_ORIGEN, Buscar.marca, Buscar.modelo, Buscar.serie);

    if (!resultado) {
      Swal.fire({
        icon: "warning",
        title: "Sin Resultados",
        text: "No hay registros disponibles para mostrar.",
        background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
        color: `${isDarkMode ? "#ffffff" : "000000"}`,
        confirmButtonColor: `${isDarkMode ? "#007bff" : "444"}`,
        customClass: {
          popup: "custom-border", // Clase personalizada para el borde
        }
      });
      setLoadingBuscar(false);
      // Swal.fire({
      //   icon: "warning",
      //   title: "Inventario sin alta",
      //   text: "Primero debe dar de alta el inventario para realizar un traslado.",
      //   background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
      //   color: `${isDarkMode ? "#ffffff" : "000000"}`,
      //   confirmButtonColor: `${isDarkMode ? "#6c757d" : "444"}`,
      //   customClass: { popup: "custom-border" },
      //   allowOutsideClick: false,
      //   confirmButtonText: "Registrar Alta",
      //   showCancelButton: true, // Agrega un segundo botón
      //   cancelButtonText: "Cerrar", // Texto del botón
      //   willClose: () => {
      //     document.body.style.overflow = "auto"; // Restaura el scroll
      //   }
      // }).then((result) => {
      //   if (result.isConfirmed) {
      //     //Al confirmar le paso como props el inventario que no ha sido dado de alta, con el fin que se renderize en el buscador de Reggistrar Altas
      //     navigate("/Altas/RegistrarAltas", {
      //       state: { prop_codigo_origen: Traslados.af_codigo_generico }
      //     });
      //     setLoading(false);
      //   }
      // });
      // return;
    } else {
      paginar(1);
      setMostrarModal(true);
      setLoadingBuscar(false); //Finaliza estado de carga     
    }
  };

  /*-------------Tabla Modal-------------------*/
  const handleSeleccionaTodos = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setFilasSeleccionadas(
        elementosActuales.map((_, index) =>
          (indicePrimerElemento + index).toString()
        )
      );
      // console.log("filas Seleccionadas ", filasSeleccionadas);
    } else {
      setFilasSeleccionadas([]);
    }
  };

  const setSeleccionaFilas = (index: number) => {
    setFilasSeleccionadas((prev) =>
      prev.includes(index.toString())
        ? prev.filter((rowIndex) => rowIndex !== index.toString())
        : [...prev, index.toString()]
    );
  };

  const handleAgregarSeleccionados = async () => {
    const selectedIndices = filasSeleccionadas.map(Number);
    const activosSeleccionados = selectedIndices.map((index) => {
      return {
        aF_CLAVE: parseInt(listaTrasladoSeleccion[index].aF_CLAVE),
        aF_CODIGO_GENERICO: listaTrasladoSeleccion[index].aF_CODIGO_GENERICO,
        deT_OBS: listaTrasladoSeleccion[index].deT_OBS,
        esP_NOMBRE: listaTrasladoSeleccion[index].esP_NOMBRE,
        deP_CORR_ORIGEN: listaTrasladoSeleccion[index].deP_CORR_ORIGEN
      };
    });

    const result = await Swal.fire({
      icon: "info",
      title: "Agregar articulo",
      text: `Confirme para agregar`,
      showDenyButton: false,
      showCancelButton: true,
      confirmButtonText: "Confirmar y Agregar",
      background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
      color: `${isDarkMode ? "#ffffff" : "000000"}`,
      confirmButtonColor: `${isDarkMode ? "#007bff" : "444"}`,
      customClass: {
        popup: "custom-border", // Clase personalizada para el borde
      }
    });

    // Verificar duplicados antes de mostrar la confirmación
    const duplicados = activosSeleccionados.filter(activo =>
      activosFijos.some(existente => existente.aF_CLAVE === activo.aF_CLAVE)
    );

    if (result.isConfirmed) {
      if (duplicados.length > 0) {
        // Crear la tabla HTML con los duplicados
        const tablaHTML = `
            <div style="max-height: 300px; overflow-y: auto;">
              <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
                <thead>
                  <tr style="background-color: ${isDarkMode ? '#333' : '#f5f5f5'};">
                    <th style="padding: 8px; border: 1px solid;  ${isDarkMode ? '#555' : '#ddd'}; text-align: center;">Nº Inventario</th>
                    <th style="padding: 8px; border: 1px solid;  ${isDarkMode ? '#555' : '#ddd'}; text-align: center;">Especie</th>
                  </tr>
                </thead>
                <tbody>
                  ${duplicados.map(item => `
                    <tr>
                      <td style="padding: 8px; border: 1px solid; text-align: center; width: 145px; ${isDarkMode ? '#555' : '#ddd'};">${item.aF_CODIGO_GENERICO}</td>
                      <td style="padding: 8px; border: 1px solid; text-align: center; width: 200px; ${isDarkMode ? '#555' : '#ddd'};">${item.esP_NOMBRE || 'Sin descripción'}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          `;
        Swal.fire({
          icon: "warning",
          title: "Artículos duplicados",
          html: `<p>Los siguientes artículos ya están agregados:</p>${tablaHTML}`,
          confirmButtonText: "Entendido",
          background: `${isDarkMode ? "#1e1e1e" : "#ffffff"}`,
          color: `${isDarkMode ? "#ffffff" : "#000000"}`,
          confirmButtonColor: `${isDarkMode ? "#007bff" : "444"}`,
          width: '600px',
          customClass: {
            popup: "custom-border",
          }
        });
        setFilasSeleccionadas([]);
        return;
      } else {
        Swal.fire({
          icon: "success",
          title: "Artículos Agregados",
          html: `Articulos agregados con exito!`,
          confirmButtonText: "Cerrar",
          background: `${isDarkMode ? "#1e1e1e" : "#ffffff"}`,
          color: `${isDarkMode ? "#ffffff" : "#000000"}`,
          confirmButtonColor: `${isDarkMode ? "#007bff" : "444"}`,
          width: '600px',
          customClass: {
            popup: "custom-border",
          }
        });
        setActivosFijos((prev) => [...prev, ...activosSeleccionados]);
        setFilasSeleccionadas([]);
        paginar1(1);
        // setMostrarModal(false);
      }
    }
  }
  /*-------------Tabla Activos Seleccionados-------------------*/
  const handleSeleccionaTodosTraslados = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setFilasSeleccionadasTraslados(
        elementosActuales1.map((_, index) =>
          (indicePrimerElemento1 + index).toString()
        )
      );
      // console.log("filas Seleccionadas ", filasSeleccionadas);
    } else {
      setFilasSeleccionadasTraslados([]);
    }
  };

  const setSeleccionaFilasTraslados = (index: number) => {
    setFilasSeleccionadasTraslados((prev) =>
      prev.includes(index.toString())
        ? prev.filter((rowIndex) => rowIndex !== index.toString())
        : [...prev, index.toString()]
    );
  };

  const handleQuitarSeleccionados = () => {
    // Convertir los índices seleccionados a números
    const selectedIndices = filasSeleccionadasTraslados.map(Number);
    // Filtrar los activos y eliminar los seleccionados
    setActivosFijos((prev) => {
      const actualizados = prev.filter((_, index) => !selectedIndices.includes(index));
      return actualizados;
    });
    // Limpiar las filas seleccionadas
    setFilasSeleccionadasTraslados([]);
    paginar1(1);
  };

  const handleSubmitTraslado = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      const result = await Swal.fire({
        icon: "info",
        title: "Confirmar Traslado",
        text: "¿Confirma que desea trasladar los artículos seleccionados con los datos proporcionados?",
        showCancelButton: true,
        confirmButtonText: "Confirmar y Trasladar",
        background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
        color: `${isDarkMode ? "#ffffff" : "000000"}`,
        confirmButtonColor: `${isDarkMode ? "#6c757d" : "444"}`,
        customClass: {
          popup: "custom-border", // Clase personalizada para el borde
        }
      });

      if (result.isConfirmed) {
        setLoading(true);
        const activosSeleccionados = activosFijos.map((item) => ({
          aF_CLAVE: item.aF_CLAVE,
          aF_CODIGO_GENERICO: item.aF_CODIGO_GENERICO,
          deP_CORR: item.deP_CORR_ORIGEN,//Dependencia Origen
          usuariO_CREA: objeto.IdCredencial.toString(),
          estabL_CORR: objeto.Roles[0].codigoEstablecimiento,
          deP_CORR_DESTINO: Traslados.deP_CORR_DESTINO, //dependencia Destino 
          traS_CO_REAL: Traslados.traS_CO_REAL,
          traS_MEMO_REF: Traslados.traS_MEMO_REF,
          traS_FECHA_MEMO: Traslados.traS_FECHA_MEMO,
          traS_OBS: Traslados.traS_OBS,
          traS_NOM_ENTREGA: Traslados.traS_NOM_ENTREGA,
          traS_NOM_RECIBE: Traslados.traS_NOM_RECIBE,
          traS_NOM_AUTORIZA: Traslados.traS_NOM_AUTORIZA
        }));

        const resultado = await registroTrasladoMultipleActions(activosSeleccionados);

        // console.log("datosTraslado", activosSeleccionados);

        if (resultado) {
          Swal.fire({
            icon: "success",
            title: "Registro Exitoso",
            text: `Su traslado ha sido registrado exitosamente`,
            background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
            color: `${isDarkMode ? "#ffffff" : "000000"}`,
            confirmButtonColor: `${isDarkMode ? "#6c757d" : "#444"}`,
            customClass: { popup: "custom-border" }
          });

          // Limpiar
          setFilasSeleccionadas([]);
          setMostrarModalTraslado(false);
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Ocurrió un problema al intentar trasladar los activos.",
            background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
            color: `${isDarkMode ? "#ffffff" : "000000"}`,
            confirmButtonColor: `${isDarkMode ? "#6c757d" : "#444"}`,
            customClass: { popup: "custom-border" }
          });
        }
        setLoading(false);
      }
    }
  };

  const handleCerrarModal = () => {
    setMostrarModal(false);
    if (mostrarModal) {
      Swal.fire({
        icon: "warning",
        title: "Limpiar Filtros",
        text: "Desea limpiar sus filtros?",
        background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
        color: `${isDarkMode ? "#ffffff" : "000000"}`,
        confirmButtonColor: `${isDarkMode ? "#6c757d" : "444"}`,
        customClass: { popup: "custom-border" },
        allowOutsideClick: false,
        confirmButtonText: "Limpiar",
        showCancelButton: true, // Agrega un segundo botón
        cancelButtonText: "Cerrar", // Texto del botón
        willClose: () => {
          document.body.style.overflow = "auto"; // Restaura el scroll
        }
      }).then((result) => {
        if (result.isConfirmed) {
          setBuscar((prev) => ({
            ...prev,
            aF_CODIGO_GENERICO: "",
            seR_CORR: "",
            deP_CORR_ORIGEN: 0,
            esP_CODIGO: "",
            marca: "",
            modelo: "",
            serie: ""
          }));
        }
      });
    }
  }

  /*-----------------------Tabla Resultado de busqueda----------------------*/
  // Lógica de Paginación actualizada 
  const indiceUltimoElemento = paginaActual * elementosPorPagina;
  const indicePrimerElemento = indiceUltimoElemento - elementosPorPagina;
  const elementosActuales = useMemo(
    () => listaTrasladoSeleccion.slice(indicePrimerElemento, indiceUltimoElemento),
    [listaTrasladoSeleccion, indicePrimerElemento, indiceUltimoElemento]);

  const totalPaginas = Array.isArray(listaTrasladoSeleccion)
    ? Math.ceil(listaTrasladoSeleccion.length / elementosPorPagina) : 0;
  const paginar = (numeroPagina: number) => setPaginaActual(numeroPagina);

  /*-----------------------Tabla Selecciones a Trasladar----------------------*/

  // Lógica de Paginación actualizada 
  const indiceUltimoElemento1 = paginaActual1 * elementosPorPagina1;
  const indicePrimerElemento1 = indiceUltimoElemento1 - elementosPorPagina1;
  const elementosActuales1 = useMemo(
    () => activosFijos.slice(indicePrimerElemento1, indiceUltimoElemento1),
    [activosFijos, indicePrimerElemento1, indiceUltimoElemento1]);

  const totalPaginas1 = Array.isArray(activosFijos)
    ? Math.ceil(activosFijos.length / elementosPorPagina1) : 0;
  const paginar1 = (numeroPagina1: number) => setPaginaActual1(numeroPagina1);


  return (
    <Layout>
      <Helmet>
        <title>Registrar Traslados</title>
      </Helmet>
      <MenuTraslados />

      <div className={`border p-4 rounded ${isDarkMode ? "darkModePrincipal border-secondary" : ""}`}>
        <h3 className="form-title fw-semibold border-bottom p-1">Registrar Traslados</h3>
        {/* Fila 1 */}
        {/* <div className={`mb-3 border p-1 rounded-4 ${tieneErroresBusqueda ? "border-danger" : ""}`}> */}
        <div className={`d-flex justify-content-between align-items-center m-1 p-3 hover-effect rounded-4 ${isDarkMode ? "bg-transparent " : ""}`} onClick={() => toggleRow("fila1")}>
          <h5 className="fw-semibold">PARÁMETROS DE BÚSQUEDA</h5>
          {isExpanded.fila1 ? (
            <CaretUpFill className="flex-shrink-0 h-5 w-5" aria-hidden="true" />
          ) : (
            <CaretDown className="flex-shrink-0 h-5 w-5" aria-hidden="true" />
          )}
        </div>
        <Collapse in={isExpanded.fila1} dimension="height">
          <div className="border-top">
            <Row className="p-1 row justify-content-center ">
              <Col md={4}>
                {/* N° Inventario */}
                <div className="mb-1">
                  <label className="fw-semibold">
                    Nº Inventario
                  </label>
                  <div className="d-flex align-items-center">
                    <input
                      aria-label="aF_CODIGO_GENERICO"
                      type="text"
                      className={`form-control ${isDarkMode ? "bg-dark text-light border-secondary" : ""}`}
                      maxLength={12}
                      name="aF_CODIGO_GENERICO"
                      placeholder="Eje: 1000000008"
                      onChange={handleChange}
                      value={Buscar.aF_CODIGO_GENERICO}
                    />
                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip id="tooltip-limpiar">Buscar Inventario</Tooltip>}
                    >
                      <Button
                        onClick={handleBuscar}
                        variant="primary"
                        className={`btn ${isDarkMode ? "btn-secondary" : "btn-primary"}  ms-1`}
                      >
                        {loadingBuscar ? (
                          <>
                            <Spinner
                              as="span"
                              animation="border"
                              size="sm"
                              role="status"
                              aria-hidden="true"
                            />
                          </>
                        ) : (
                          <Search
                            className={"flex-shrink-0 h-5 w-5"}
                            aria-hidden="true"
                          />
                        )}
                      </Button>
                    </OverlayTrigger>
                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip id="tooltip-limpiar">Limpiar Filtros</Tooltip>}
                    >
                      <Button
                        onClick={handleLimpiar}
                        variant="primary"
                        className={`btn ${isDarkMode ? "btn-secondary" : "btn-primary"} mx-1`}
                      >
                        <Eraser className={"flex-shrink-0 h-5 w-5 ms-1"} aria-hidden="true" />
                      </Button>
                    </OverlayTrigger>
                  </div>

                </div>
                {/* servicio Origen */}
                <div className="mb-1">
                  <label htmlFor="seR_CORR" className="fw-semibold fw-semibold">Servicio</label>
                  <select
                    aria-label="seR_CORR"
                    className={`form-select ${isDarkMode ? "bg-dark text-light border-secondary" : ""}`}
                    name="seR_CORR"
                    onChange={handleChange}
                    value={Buscar.seR_CORR}
                  >
                    <option value="">Seleccionar</option>
                    {comboTrasladoServicio.map((traeServicio) => (
                      <option
                        key={traeServicio.codigo}
                        value={traeServicio.codigo}
                      >
                        {traeServicio.descripcion}
                      </option>
                    ))}
                  </select>
                </div>
                {/* Dependencia */}
                <div className="mb-1">
                  <label htmlFor="deP_CORR_ORIGEN" className="fw-semibold">Dependencia</label>
                  <select
                    aria-label="deP_CORR_ORIGEN"
                    className={`form-select ${isDarkMode ? "bg-dark text-light border-secondary" : ""}`}
                    name="deP_CORR_ORIGEN"
                    onChange={handleChange}
                    value={Buscar.deP_CORR_ORIGEN}
                    disabled={!Buscar.seR_CORR}
                  >
                    <option value="">Seleccionar</option>
                    {comboDependenciaOrigen.map((traeDependencia) => (
                      <option
                        key={traeDependencia.codigo}
                        value={traeDependencia.codigo}
                      >
                        {traeDependencia.descripcion}
                      </option>
                    ))}
                  </select>

                </div>
                {/* Especie */}
                <div className="d-flex">
                  <div className="mb-1 w-100">
                    <label className="fw-semibold">
                      Buscar Especie
                    </label>
                    <Select
                      options={especieOptions}
                      onChange={(selectedOption) => { handleComboEspecieChange(selectedOption) }}
                      name="esP_CODIGO"
                      placeholder="Buscar"
                      className={`form-select-container`}
                      classNamePrefix="react-select"
                      isClearable
                      // isSearchable
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
                  </div>
                </div>
              </Col>
              <Col md={4}>
                <div className="ms-1">
                  <label className="fw-semibold">
                    Marca
                  </label>
                  <input
                    aria-label="marca"
                    type="text"
                    className={`form-control ${isDarkMode ? "bg-dark text-light border-secondary" : ""}`}
                    maxLength={50}
                    name="marca"
                    placeholder="Introduzca marca o parte de él"
                    onChange={handleChange}
                    value={Buscar.marca}
                  />
                </div>
                <div className="ms-1">
                  <label className="fw-semibold">
                    Modelo
                  </label>
                  <input
                    aria-label="modelo"
                    type="text"
                    className={`form-control ${isDarkMode ? "bg-dark text-light border-secondary" : ""}`}
                    maxLength={50}
                    name="modelo"
                    placeholder="Introduzca modelo o parte de él"
                    onChange={handleChange}
                    value={Buscar.modelo}
                  />
                </div>
                <div className="ms-1">
                  <label className="fw-semibold">
                    Serie
                  </label>
                  <input
                    aria-label="serie"
                    type="text"
                    className={`form-control ${isDarkMode ? "bg-dark text-light border-secondary" : ""}`}
                    maxLength={50}
                    name="serie"
                    placeholder="Ingrese serie o parte del número"
                    onChange={handleChange}
                    value={Buscar.serie}
                  />
                </div>
              </Col>
            </Row>
          </div>
        </Collapse>
      </div>
      {activosFijos.length === 0 ? (
        <p className="d-flex justify-content-center m-1 p-1 ">
          Seleccione artículos de la búsqueda para incluirlos aquí
        </p>
      ) : (
        <div className={`border p-4 rounded ${isDarkMode ? "darkModePrincipal border-secondary" : ""}`}>
          <div className={`d-flex justify-content-between align-items-center m-1 p-3 rounded-4 ${isDarkMode ? "bg-transparent text-light" : ""}`} onClick={() => toggleRow("fila2")}>
            <h5 className="fw-semibold">LISTADO A TRASLADAR</h5>
          </div>
          <Row className="p-1 row justify-content-center ">
            <Col md={8}>
              <div className="d-flex justify-content-end">
                {/* Boton elimina filas seleccionadas */}
                {filasSeleccionadasTraslados.length > 0 && (
                  <Button
                    variant="danger"
                    onClick={handleQuitarSeleccionados}
                    className="mb-1 p-2 mx-1"  // Alinea el spinner y el texto
                  >
                    <ArrowLeftRight className="flex-shrink-0 h-5 w-5 mx-1 mb-1" aria-hidden="true" />
                    {" Quitar "}
                    <span className="badge bg-light text-dark mx-1 mb-1">
                      {filasSeleccionadasTraslados.length}
                    </span>
                  </Button>
                )}
                <Button
                  variant="warning"
                  onClick={() => setMostrarModalTraslado(true)}
                  type="submit"
                  className="mb-1 p-2 mx-1"  // Alinea el spinner y el texto
                  disabled={loading}  // Desactiva el botón mientras carga
                >
                  {loading ? (
                    <>
                      {" Trasladar "}
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                        className="mb-1 p-2 mx-1"
                      />

                    </>
                  ) : (
                    <>
                      <ArrowLeftRight className="flex-shrink-0 h-5 w-5 mx-1 mb-1" aria-hidden="true" />
                      {"Trasladar"}
                      <span className="badge bg-light text-dark mx-1 mb-1">
                        {activosFijos.length}
                      </span>
                    </>
                  )}
                </Button>
              </div>
              <div className='table-responsive'>
                <table className={`table  ${isDarkMode ? "table-dark" : "table-hover table-striped "}`} >
                  <thead className={`sticky-top z-0 ${isDarkMode ? "table-dark" : "text-dark table-light "}`}>
                    <tr>
                      <th>
                        <Form.Check
                          type="checkbox"
                          className="text-center"
                          onChange={handleSeleccionaTodosTraslados}
                          checked={filasSeleccionadasTraslados.length === elementosActuales1.length && elementosActuales1.length > 0}
                        />
                      </th>
                      <th scope="col" className="text-nowrap text-center">N° Inventario</th>
                      <th scope="col" className="text-nowrap text-center">Descripción</th>
                      <th scope="col" className="text-nowrap text-center">Especie</th>
                    </tr>
                  </thead>
                  <tbody>
                    {elementosActuales1.map((lista, index) => {
                      let indexReal = indicePrimerElemento1 + index; // Índice real basado en la página
                      return (
                        <tr key={indexReal}>
                          <td className="text-center">
                            <Form.Check
                              type="checkbox"
                              onChange={() => setSeleccionaFilasTraslados(indexReal)}
                              checked={filasSeleccionadasTraslados.includes(indexReal.toString())}
                            />
                          </td>
                          <td className="text-nowrap">{lista.aF_CODIGO_GENERICO}</td>
                          <td className="text-nowrap">{lista.deT_OBS}</td>
                          <td className="text-nowrap">{lista.esP_NOMBRE}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              {/* Paginador */}
              <div className="paginador-container">
                <Pagination className="paginador-scroll ">
                  <Pagination.First
                    onClick={() => paginar1(1)}
                    disabled={paginaActual1 === 1}
                  />
                  <Pagination.Prev
                    onClick={() => paginar1(paginaActual1 - 1)}
                    disabled={paginaActual1 === 1}
                  />

                  {Array.from({ length: totalPaginas1 }, (_, i) => (
                    <Pagination.Item
                      key={i + 1}
                      active={i + 1 === paginaActual1}
                      onClick={() => paginar1(i + 1)}
                    >
                      {i + 1} {/* adentro de aqui esta page-link */}
                    </Pagination.Item>
                  ))}
                  <Pagination.Next
                    onClick={() => paginar1(paginaActual1 + 1)}
                    disabled={paginaActual1 === totalPaginas1}

                  />
                  <Pagination.Last
                    onClick={() => paginar1(totalPaginas1)}
                    disabled={paginaActual1 === totalPaginas1}

                  />
                </Pagination>
              </div>
            </Col>
          </Row>
        </div>
      )}
      {/* Modal lista seleccion traslados */}
      {listaTrasladoSeleccion.length > 0 && (
        <Modal show={mostrarModal} onHide={() => setMostrarModal(false)}
          size="xl"
          dialogClassName="draggable-modal"
          // scrollable={false}
          backdrop="static" // Evita que se cierre al hacer clic afuera
          keyboard={false}
        >
          <Modal.Header className={`modal-header`}>
            <div className="d-flex justify-content-between w-100">
              <Modal.Title className="fw-semibold">Resultado Busqueda</Modal.Title>
              <Button
                variant="transparent"
                className="border-0"
                onClick={handleCerrarModal}
              >
                <CloseButton
                  aria-hidden="true"
                  className={"flex-shrink-0 h-5 w-5"}
                />
              </Button>
            </div>
          </Modal.Header>
          <Modal.Body className={`${isDarkMode ? "darkModePrincipal" : ""}`}>
            <div className="bg-white shadow-sm sticky-top p-3">
              <Row>
                <Col md={6}>
                  {listaTrasladoSeleccion.length > 10 && (
                    <div className="d-flex align-items-center me-2">
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
                        {[10, 25, 50, 75, 100, listaTrasladoSeleccion.length].map((val) => (
                          <option key={val} value={val}>{val}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </Col>
                <Col md={6} className="d-flex justify-content-end">
                  {filasSeleccionadas.length > 0 ? (
                    <Button
                      variant={`${isDarkMode ? "secondary" : "primary"}`}
                      onClick={handleAgregarSeleccionados}
                      className="m-1 p-2 d-flex align-items-center">
                      Agregar
                      <span className="badge bg-light text-dark mx-1 mt-1">
                        {filasSeleccionadas.length}
                      </span>
                    </Button>
                  ) : (
                    <strong className="alert alert-dark border m-1 p-2 mx-2">
                      No hay filas seleccionadas
                    </strong>
                  )}
                </Col>
              </Row>
            </div>
            {/* Tabla activos*/}
            <div style={{ maxHeight: "75vh", overflowY: "auto" }} className="mt-2">
              {/* Tabla*/}
              {loading ? (
                <>
                  {/* <SkeletonLoader rowCount={elementosPorPagina} /> */}
                  <SkeletonLoader rowCount={10} columnCount={10} />
                </>
              ) : (
                <div className='table-responsive position-relative z-0'>
                  <div style={{ maxHeight: "70vh" }}>
                    <table className={`table ${isDarkMode ? "table-dark" : "table-hover table-striped "}`} >
                      <thead className={`sticky-top ${isDarkMode ? "table-dark" : "text-dark table-light "}`}>
                        <tr>
                          <th style={{ position: 'sticky', left: 0, zIndex: 2 }}>
                            <Form.Check
                              className="check-danger"
                              type="checkbox"
                              onChange={handleSeleccionaTodos}
                              checked={filasSeleccionadas.length === elementosActuales.length && elementosActuales.length > 0}
                            />
                          </th>
                          <th scope="col" className="text-nowrap text-center">Código</th>
                          <th scope="col" className="text-nowrap text-center">Nº Inventario</th>
                          <th scope="col" className="text-nowrap text-center">Descripción</th>
                          <th scope="col" className="text-nowrap text-center">Dependencia	Serv/Depto</th>
                          <th scope="col" className="text-nowrap text-center">Especie</th>
                          <th scope="col" className="text-nowrap text-center">Marca</th>
                          <th scope="col" className="text-nowrap text-center">Modelo</th>
                          <th scope="col" className="text-nowrap text-center">Serie</th>
                          <th scope="col" className="text-nowrap text-center">Código Dependencia</th>
                        </tr>
                      </thead>
                      <tbody>
                        {elementosActuales.map((lista, index) => {
                          const indexReal = indicePrimerElemento + index; // Índice real basado en la página
                          return (
                            <tr key={index}>
                              <td style={{ position: 'sticky', left: 0, zIndex: 2 }}>
                                <Form.Check
                                  type="checkbox"
                                  onChange={() => setSeleccionaFilas(indexReal)}
                                  checked={filasSeleccionadas.includes(indexReal.toString())}
                                />
                              </td>
                              <td className="text-nowrap text-center">{lista.aF_CLAVE}</td>
                              <td className="text-nowrap text-center">{lista.aF_CODIGO_GENERICO}</td>
                              <td className="text-nowrap text-center">{lista.deT_OBS}</td>
                              <td className="text-nowrap text-center">{lista.serviciO_DEPENDENCIA}</td>
                              <td className="text-nowrap text-center">{lista.esP_NOMBRE}</td>
                              <td className="text-nowrap text-center">{lista.deT_MARCA}</td>
                              <td className="text-nowrap text-center">{lista.deT_MODELO}</td>
                              <td className="text-nowrap text-center">{lista.deT_SERIE}</td>
                              <td className="text-nowrap text-center">{lista.deP_CORR_ORIGEN}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
            {/* Paginador */}
            <div className="paginador-container">
              <Pagination className="paginador-scroll">
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
            </div>
          </Modal.Body>
        </Modal>
      )
      }

      {/* Formulario de traslados */}
      < Modal show={mostrarModalTraslado} onHide={() => setMostrarModalTraslado(false)}
        size="lg"
        dialogClassName="modal-right"
        backdrop="static"
      //  keyboard={false}  // Evita el cierre al presionar la tecla Esc
      >
        <Modal.Header className={`${isDarkMode ? "darkModePrincipal" : ""}`} closeButton>
          <Modal.Title className="fw-semibold">
            Inventarios a Trasladar: {activosFijos.length}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className={`${isDarkMode ? "darkModePrincipal" : ""}`}>
          <form onSubmit={handleSubmitTraslado}>
            <div className="d-flex justify-content-end">
              <Button
                variant="primary"
                type="submit"
                className="m-1 p-2 d-flex align-items-center"  // Alinea el spinner y el texto
                disabled={loading}  // Desactiva el botón mientras carga
              >
                {loading ? (
                  <>
                    {" Trasladar "}
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      className="me-2"
                    />

                  </>
                ) : (
                  <>
                    <ArrowLeftRight className="flex-shrink-0 h-5 w-5 mx-1 mb-1" aria-hidden="true" />
                    {"Trasladar"}
                  </>
                )}
              </Button>
            </div>
            <Row>
              <Col>
                <div className="mb-1 position-relative z-1">
                  <label className="fw-semibold">
                    Servicio / Dependencia Destino
                  </label>
                  <Select
                    options={servicioFormOptions}
                    onChange={handleServicioFormChange}
                    name="servicio"
                    value={servicioFormOptions.find((option) => option.value === Traslados.deP_CORR_DESTINO) || null}
                    placeholder="Buscar"
                    className={`form-select-container ${error.traS_OBS ? "is-invalid" : ""}`}
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
                  {error.deP_CORR_DESTINO && (
                    <div className="invalid-feedback">{error.deP_CORR_DESTINO}</div>
                  )}
                </div>
                {/* Observaciones */}
                <div className="mb-1">
                  <label className="fw-semibold">
                    Observaciones
                  </label>
                  <textarea
                    className={`form-control ${isDarkMode ? "bg-dark text-light border-secondary" : ""} ${error.traS_OBS ? "is-invalid" : ""}`}
                    aria-label="traS_OBS"
                    name="traS_OBS"
                    rows={6}
                    maxLength={500}
                    style={{ minHeight: "8px", resize: "none" }}
                    onChange={handleChange}
                    value={Traslados.traS_OBS}
                  />
                  {error.traS_OBS && (
                    <div className="invalid-feedback">{error.traS_OBS}</div>
                  )}
                </div>
              </Col>
              <Col>
                {/* N° Memo Ref */}
                <div className="mb-1">
                  <label className="fw-semibold">
                    N° Memo Ref
                  </label>
                  <input
                    aria-label="traS_MEMO_REF"
                    type="text"
                    className={`form-control ${isDarkMode ? "bg-dark text-light border-secondary" : ""} ${error.traS_MEMO_REF ? "is-invalid" : ""}`}
                    maxLength={50}
                    name="traS_MEMO_REF"
                    onChange={handleChange}
                    value={Traslados.traS_MEMO_REF}
                  />
                  {error.traS_MEMO_REF && (
                    <div className="invalid-feedback">{error.traS_MEMO_REF}</div>
                  )}
                </div>
                {/* Fecha Memo */}
                <div className="mb-1">
                  <label className="fw-semibold">
                    Fecha Memo
                  </label>
                  <input
                    aria-label="traS_FECHA_MEMO"
                    type="date"
                    className={`form-control ${isDarkMode ? "bg-dark text-light border-secondary" : ""} ${error.traS_FECHA_MEMO ? "is-invalid" : ""}`}
                    name="traS_FECHA_MEMO"
                    onChange={handleChange}
                    value={Traslados.traS_FECHA_MEMO}
                    max={new Date().toISOString().split("T")[0]}
                  />
                  {error.traS_FECHA_MEMO && (
                    <div className="invalid-feedback">{error.traS_FECHA_MEMO}</div>
                  )}
                </div>
                {/* Entregado Por */}
                <div className="mb-1">
                  <label className="fw-semibold">
                    Entregado Por
                  </label>
                  <input
                    aria-label="traS_NOM_ENTREGA"
                    type="text"
                    className={`form-control ${isDarkMode ? "bg-dark text-light border-secondary" : ""
                      } ${error.traS_NOM_ENTREGA ? "is-invalid" : ""}`}
                    maxLength={50}
                    name="traS_NOM_ENTREGA"
                    onChange={handleChange}
                    value={Traslados.traS_NOM_ENTREGA}
                  />
                  {error.traS_NOM_ENTREGA && (
                    <div className="invalid-feedback">{error.traS_NOM_ENTREGA}</div>
                  )}
                </div>
                {/* Recibido Por */}
                <div className="mb-1">
                  <label className="fw-semibold">
                    Recibido Por
                  </label>
                  <input
                    aria-label="traS_NOM_RECIBE"
                    type="text"
                    className={`form-control ${isDarkMode ? "bg-dark text-light border-secondary" : ""
                      } ${error.traS_NOM_RECIBE ? "is-invalid" : ""}`}
                    maxLength={50}
                    name="traS_NOM_RECIBE"
                    onChange={handleChange}
                    value={Traslados.traS_NOM_RECIBE}
                  />
                  {error.traS_NOM_RECIBE && (
                    <div className="invalid-feedback">{error.traS_NOM_RECIBE}</div>
                  )}
                </div>
                {/* Jefe que Autoriza */}
                <div className="mb-1">
                  <label className="fw-semibold">
                    Jefe que Autoriza
                  </label>
                  <input
                    aria-label="traS_NOM_AUTORIZA"
                    type="text"
                    className={`form-control ${isDarkMode ? "bg-dark text-light border-secondary" : ""} ${error.traS_NOM_AUTORIZA ? "is-invalid" : ""}`}
                    maxLength={50}
                    name="traS_NOM_AUTORIZA"
                    onChange={handleChange}
                    value={Traslados.traS_NOM_AUTORIZA}
                  />
                  {error.traS_NOM_AUTORIZA && (
                    <div className="invalid-feedback">{error.traS_NOM_AUTORIZA}</div>
                  )}
                </div>
              </Col>
            </Row>
          </form>
        </Modal.Body>
      </Modal >
    </Layout >
  );
};

const mapStateToProps = (state: RootState) => ({
  token: state.loginReducer.token,
  comboTrasladoServicio: state.comboTrasladoServicioReducer.comboTrasladoServicio,
  comboEstablecimiento: state.comboEstablecimientoReducer.comboEstablecimiento,
  comboTrasladoEspecie: state.comboTrasladoEspecieReducer.comboTrasladoEspecie,
  comboDependenciaOrigen: state.comboDependenciaOrigenReducer.comboDependenciaOrigen,
  comboDependenciaDestino: state.comboDependenciaDestinoReducer.comboDependenciaDestino,
  listaTrasladoSeleccion: state.obtenerInventarioTrasladoReducers.listaTrasladoSeleccion,
  objeto: state.validaApiLoginReducers,
  isDarkMode: state.darkModeReducer.isDarkMode,
  comboEspecies: state.comboEspeciesBienReducers.comboEspecies,
  comboServicioInforme: state.comboServicioInformeReducers.comboServicioInforme,
});

export default connect(mapStateToProps, {
  registroTrasladoMultipleActions,
  comboTrasladoServicioActions,
  comboEstablecimientoActions,
  comboTrasladoEspecieActions,
  comboDependenciaOrigenActions,
  comboDependenciaDestinoActions,
  comboServicioInformeActions,
  comboEspeciesBienActions,
  registroTrasladoActions,
  obtenerInventarioTrasladoActions,
  listadoDeEspeciesBienActions
})(RegistrarTraslados);
