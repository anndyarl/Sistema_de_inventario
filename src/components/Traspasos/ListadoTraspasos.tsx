import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useMemo, useState } from "react";
import { Button, Col, Modal, Pagination, Row, Spinner } from "react-bootstrap";
import { RootState } from "../../store.ts";
import { connect } from "react-redux";
import Layout from "../../containers/hocs/layout/Layout.tsx";
import Swal from "sweetalert2";
import SkeletonLoader from "../Utils/SkeletonLoader.tsx";
import { Objeto } from "../Navegacion/Profile.tsx";
import { Helmet } from "react-helmet-async";
import { ArrowBarLeft, ArrowBarRight, ArrowRepeat, ArrowsCollapseVertical, Check2Circle, CircleFill, Clock, Download, Eraser, ExclamationCircle, GeoFill, Search, XCircle } from "react-bootstrap-icons";
import MenuTraspasos from "../Menus/MenuTraspasos.tsx";
import { registrarMantenedorDependenciasActions } from "../../redux/actions/Mantenedores/Dependencias/registrarMantenedorDependenciasActions.tsx";
import { recibeTraspasoActions } from "../../redux/actions/Traspasos/recibeTraspasoActions.tsx";
import { listadoTraspasosRecibidosActions } from "../../redux/actions/Traspasos/listadoTraspasosRecibidosActions.tsx";
import { limpiarDataActions } from "../../redux/actions/Configuracion/preferenciasActions.tsx";
import { listadoTraspasosEnviadosActions } from "../../redux/actions/Traspasos/listadoTraspasosEnviadosActions.tsx";
import { obtenerAdjuntosActions } from "../../redux/actions/Traspasos/obtenerAdjuntosActions.tsx";
interface FechasProps {
  fDesde: string;
  fHasta: string;
}
export interface listadoTraspasos {
  aF_CODIGO_GENERICO: string;
  n_TRASPASO: number;
  aF_CLAVE: number;
  paS_FECHA: string;
  esP_CODIGO: string;
  esP_NOMBRE: string;
  coD_ESTABL_ORIGEN: number
  seR_NOMBRE_ORIGEN: string;
  deP_NOMBRE_ORIGEN: string;
  coD_ESTABL_DESTINO: number
  seR_NOMBRE_DESTINO: string;
  deP_NOMBRE_DESTINO: string;
  paS_MEMO_REF: string;
  paS_FECHA_MEMO: string;
  paS_OBS: string;
  paS_NOM_ENTREGA: string;
  paS_NOM_RECIBE: string;
  paS_NOM_AUTORIZA: string;
  paS_ESTADO_AF: string;
  establecimientO_ORIGEN: number;
  establecimientO_DESTINO: number;
  usuariO_CREA: number | string;
  estabL_CORR_ORIGEN: number;
  estabL_CORR: number;
  deP_CORR_ORIGEN: number;
  deP_CORR: number;
  traS_CO_REAL: number;
  paS_DET_CORR: number;
  paS_ESTADO_RECIBE: string;
  paS_CORR: number;
}

interface ListaAdjuntos {
  nombre: string;
  contenido: string;
}
interface GeneralProps {
  listadoTraspasos: listadoTraspasos[];
  listadoTraspasosRecibidos: listadoTraspasos[];
  listadoTraspasosAdjuntos: ListaAdjuntos[];
  listadoTraspasosEnviadosActions: (fDesde: string, fHasta: string, af_codigo_generico: string, tras_corr: number, establ_corr: number, usuario_crea: number, pas_estado_recibe: string) => Promise<boolean>;
  listadoTraspasosRecibidosActions: (fDesde: string, fHasta: string, af_codigo_generico: string, tras_corr: number, establ_corr: number, usuario_crea: number, pas_estado_recibe: string) => Promise<boolean>;
  registrarMantenedorDependenciasActions: (formModal: Record<string, any>) => Promise<boolean>;
  recibeTraspasoActions: (RecibeTraspaso: Record<string, any>) => Promise<boolean>;
  limpiarDataActions: () => Promise<boolean>;
  obtenerAdjuntosActions: (numTraspaso: number) => Promise<boolean>;
  token: string | null;
  isDarkMode: boolean;
  objeto: Objeto; //Objeto que obtiene los datos del usuario
}

const ListadoTraspasos: React.FC<GeneralProps> = ({ listadoTraspasosEnviadosActions, listadoTraspasosRecibidosActions, recibeTraspasoActions, limpiarDataActions, obtenerAdjuntosActions, listadoTraspasos, listadoTraspasosRecibidos, listadoTraspasosAdjuntos, token, isDarkMode, objeto }) => {
  const [loadingEnviados, setLoadingEnviados] = useState(false);
  const [loadingRecibidos, setLoadingRecibidos] = useState(false);
  const [errorEnviados, setErrorEnviados] = useState<Partial<FechasProps> & {}>({});
  const [errorRecibidos, setErrorRecibidos] = useState<Partial<FechasProps> & {}>({});
  const [___, setEsCreador] = useState(false);
  const [estadoRecibido, setEstadoRecibido] = useState<number>(0);
  const [estadoEnviado, setEstadoEnviado] = useState<number>(0);

  const [expandedColumn, setExpandedColumn] = useState<"recibidos" | "enviados" | null>(null)
  const handleExpandColumn = (column: "recibidos" | "enviados") => {
    setExpandedColumn(expandedColumn === column ? null : column)
  }

  //--------------- Lógica de Paginación traspasos enviados ----------------//
  const [mostrarModalEnviados, setMostrarModalEnviados] = useState<number | null>(null);
  const [_, setElementoSeleccionado] = useState<string[]>([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const [Paginacion, setPaginacion] = useState({ nPaginacion: 10 });
  const elementosPorPagina = Paginacion.nPaginacion;
  const indiceUltimoElemento = paginaActual * elementosPorPagina;
  const indicePrimerElemento = indiceUltimoElemento - elementosPorPagina;
  const elementosActuales = useMemo(() => listadoTraspasos.slice(indicePrimerElemento, indiceUltimoElemento),
    [listadoTraspasos, indicePrimerElemento, indiceUltimoElemento]
  );
  const totalPaginas = Array.isArray(listadoTraspasos)
    ? Math.ceil(listadoTraspasos.length / elementosPorPagina)
    : 0;
  const paginar = (numeroPagina: number) => setPaginaActual(numeroPagina);
  //------------------------------ Fin ------------------------------------//

  //--------------- Lógica de Paginación traspasos recibidos ----------------//
  const [mostrarModalRecibidos, setMostrarModalRecibidos] = useState<number | null>(null);
  const [__, setElementoSeleccionado1] = useState<string[]>([]);
  const [paginaActual1, setPaginaActual1] = useState(1);
  const [Paginacion1, setPaginacion1] = useState({ nPaginacion1: 10 });
  const elementosPorPagina1 = Paginacion1.nPaginacion1;
  const indiceUltimoElemento1 = paginaActual1 * elementosPorPagina1;
  const indicePrimerElemento1 = indiceUltimoElemento1 - elementosPorPagina1;
  const elementosActuales1 = useMemo(() => listadoTraspasosRecibidos.slice(indicePrimerElemento1, indiceUltimoElemento1),
    [listadoTraspasosRecibidos, indicePrimerElemento1, indiceUltimoElemento1]
  );

  const totalPaginas1 = Array.isArray(listadoTraspasosRecibidos)
    ? Math.ceil(listadoTraspasosRecibidos.length / elementosPorPagina1)
    : 0;
  const paginar1 = (numeroPagina: number) => setPaginaActual1(numeroPagina);
  const [contadorEnviados, setContadorEnviados] = useState(0);
  const [contadorRecibidos, setContadorRecibidos] = useState(0);

  //------------------------------ Fin ------------------------------------//

  //--------------- Lógica de Paginación traspasos adjuntos ----------------// 
  const [PaginacionAdj, setPaginacionAdj] = useState({ nPaginacionAdj: 10 });
  const elementosPorPaginaAdj = PaginacionAdj.nPaginacionAdj;
  const indiceUltimoElementoAdj = elementosPorPaginaAdj;
  const indicePrimerElementoAdj = indiceUltimoElementoAdj - elementosPorPaginaAdj;
  const elementosActualesAdj = useMemo(() => listadoTraspasosAdjuntos.slice(indicePrimerElementoAdj, indiceUltimoElementoAdj),
    [listadoTraspasosAdjuntos, indicePrimerElementoAdj, indiceUltimoElementoAdj]
  );
  // En la sección de estados, agrega:
  const [loadingAdjuntos, setLoadingAdjuntos] = useState(false);
  const [adjuntosCargados, setAdjuntosCargados] = useState<number | null>(null);
  // const totalPaginasAdj = Array.isArray(listadoTraspasosAdjuntos)
  //   ? Math.ceil(listadoTraspasosAdjuntos.length / elementosPorPaginaAdj)
  //   : 0;
  // const paginarAdj = (numeroPagina: number) => setPaginaActualAdj(numeroPagina);

  //------------------------------ Fin ------------------------------------//

  const validateEnviados = () => {
    let tempErrors: Partial<any> & {} = {};

    // Validar que si hay fecha de inicio, fHasta haber fecha de término
    if (ListaEnviados.fDesde && !ListaEnviados.fHasta) {
      tempErrors.fHasta = "Debe ingresar una fecha de término.";
    }

    // Validar que si hay fecha de término, debe haber fecha de inicio
    if (!ListaEnviados.fDesde && ListaEnviados.fHasta) {
      tempErrors.fDesde = "Debe ingresar una fecha de inicio.";
    }

    // Si ambas fechas están presentes, validar el rango
    if (ListaEnviados.fDesde && ListaEnviados.fHasta) {
      if (ListaEnviados.fDesde > ListaEnviados.fHasta) {
        tempErrors.fDesde = "La fecha de inicio no puede ser mayor a la fecha de término.";
        tempErrors.fHasta = "La fecha de término no puede ser menor a la fecha de inicio.";
      }
    }

    setErrorEnviados(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const validateRecibidos = () => {
    let tempErrors: Partial<any> & {} = {};

    // Validar que si hay fecha de inicio, fHasta haber fecha de término   
    if (ListaRecibidos.fDesde && !ListaRecibidos.fHasta) {
      tempErrors.fHasta = "Debe ingresar una fecha de término.";
    }

    // Validar que si hay fecha de término, debe haber fecha de inicio  
    if (!ListaRecibidos.fDesde && ListaRecibidos.fHasta) {
      tempErrors.fDesde = "Debe ingresar una fecha de inicio.";
    }

    // Si ambas fechas están presentes, validar el rango   
    if (ListaRecibidos.fDesde && ListaRecibidos.fHasta) {
      if (ListaRecibidos.fDesde > ListaRecibidos.fHasta) {
        tempErrors.fDesde = "La fecha de inicio no puede ser mayor a la fecha de término.";
        tempErrors.fHasta = "La fecha de término no puede ser menor a la fecha de inicio.";
      }
    }

    setErrorRecibidos(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  //Primera Letra en mayúscula
  const PrimeraMayuscula = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

  const [ListaEnviados, setListaEnviados] = useState({
    fDesde: "",
    fHasta: "",
    tras_corr: 0,
    af_codigo_generico: "",
    paS_ESTADO_RECIBE: ""
  });

  const [ListaRecibidos, setListaRecibidos] = useState({
    fDesde: "",
    fHasta: "",
    tras_corr: 0,
    af_codigo_generico: "",
    paS_ESTADO_RECIBE: ""
  });

  //Se actualiza el contador que indica el total de traspasos enviados y recibidos
  useEffect(() => {
    if (listadoTraspasos.length > contadorEnviados) {
      setContadorEnviados(listadoTraspasos.length);
    }
    if (listadoTraspasosRecibidos.length > contadorRecibidos) {
      setContadorRecibidos(listadoTraspasosRecibidos.length);
    }
  }, [listadoTraspasos.length, listadoTraspasosRecibidos.length]);

  useEffect(() => {
    listaAutoEnviados();
    listaAutoRecibidos();

  }, [token]); // Asegúrate de incluir dependencias relevantes

  const listaAutoEnviados = async () => {
    //Carga Lista enviados
    if (listadoTraspasos.length == 0) {
      setLoadingEnviados(true);
      const resultado = await listadoTraspasosEnviadosActions("", "", "", 0, objeto.Roles[0].codigoEstablecimiento, objeto.IdCredencial, "");

      if (!resultado) {
        setLoadingEnviados(false);
      }
      else {
        setLoadingEnviados(false);
      }
    }

  };

  const listaAutoRecibidos = async () => {
    //Carga Lista recibidos
    if (listadoTraspasosRecibidos.length == 0) {
      setLoadingRecibidos(true);
      const resultado = await listadoTraspasosRecibidosActions("", "", "", 0, objeto.Roles[0].codigoEstablecimiento, objeto.IdCredencial, "");
      if (!resultado) {
        setLoadingRecibidos(false);
      }
      else {
        setLoadingRecibidos(false);
      }
    }
  };

  const handleLimpiarEnviados = () => {
    setListaEnviados((prev) => ({
      ...prev,
      fDesde: "",
      fHasta: "",
      tras_corr: 0,
      af_codigo_generico: ""
    }));
  };

  const handleLimpiarRecibidos = () => {
    setListaRecibidos((prev) => ({
      ...prev,
      fDesde: "",
      fHasta: "",
      tras_corr: 0,
      af_codigo_generico: ""
    }));
  };

  const handleChangeEnviados = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    // Validación específica para af_codigo_generico: solo permitir números
    // if (name === "af_codigo_generico" && !/^[0-9]*$/.test(value)) {
    //   return; // Salir si contiene caracteres no numéricos
    // }
    // Convertir a número solo si el campo está en la lista
    const camposNumericos = ["tras_corr", "establ_corr"];
    const newValue: string | number = camposNumericos.includes(name)
      ? parseFloat(value) || 0
      : value;


    setListaEnviados((prevState) => ({
      ...prevState,
      [name]: newValue,
    }));

    setPaginacion((prevState) => ({
      ...prevState,
      [name]: newValue,
    }));

    setPaginacionAdj((prevState) => ({
      ...prevState,
      [name]: newValue,
    }));

  };

  const handleChangeRecibidos = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    // Validación específica para af_codigo_generico: solo permitir números
    // if (name === "af_codigo_generico" && !/^[0-9]*$/.test(value)) {
    //   return; // Salir si contiene caracteres no numéricos
    // }
    // Convertir a número solo si el campo está en la lista
    const camposNumericos = ["tras_corr", "establ_corr"];
    const newValue: string | number = camposNumericos.includes(name)
      ? parseFloat(value) || 0
      : value;


    setListaRecibidos((prevState) => ({
      ...prevState,
      [name]: newValue,
    }));

    setPaginacion1((prevState) => ({
      ...prevState,
      [name]: newValue,
    }));

  };

  const handleBuscarEnviados = async (e: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLInputElement>) => {
    e.preventDefault();

    if (!validateEnviados()) {
      setLoadingEnviados(false);
      return;
    }
    let resultado = false;

    resultado = await listadoTraspasosEnviadosActions(ListaEnviados.fDesde, ListaEnviados.fHasta, ListaEnviados.af_codigo_generico, ListaEnviados.tras_corr, objeto.Roles[0].codigoEstablecimiento, objeto.IdCredencial, ListaEnviados.paS_ESTADO_RECIBE);


    if (!resultado) {
      Swal.fire({
        icon: "warning",
        title: "Sin Resultados",
        text: "No se encontraron resultados para la consulta realizada.",
        confirmButtonText: "Ok",
        background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
        color: `${isDarkMode ? "#ffffff" : "000000"}`,
        confirmButtonColor: `${isDarkMode ? "#6c757d" : "#0d6efd"}`,
        customClass: {
          popup: "custom-border", // Clase personalizada para el borde
        }
      });

      setLoadingEnviados(false); //Finaliza estado de carga
      return;
    } else {
      setLoadingEnviados(false); //Finaliza estado de carga
    }
    paginar(1);
  };

  const handleBuscarRecibidos = async (e: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (!validateRecibidos()) {
      setLoadingRecibidos(false);
      return;
    }
    let resultado = false;

    resultado = await listadoTraspasosRecibidosActions(ListaRecibidos.fDesde, ListaRecibidos.fHasta, ListaRecibidos.af_codigo_generico, ListaRecibidos.tras_corr, objeto.Roles[0].codigoEstablecimiento, objeto.IdCredencial, ListaRecibidos.paS_ESTADO_RECIBE);

    if (!resultado) {
      Swal.fire({
        icon: "warning",
        title: "Sin Resultados",
        text: "No se encontraron resultados para la consulta realizada.",
        confirmButtonText: "Ok",
        background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
        color: `${isDarkMode ? "#ffffff" : "000000"}`,
        confirmButtonColor: `${isDarkMode ? "#6c757d" : "#0d6efd"}`,
        customClass: {
          popup: "custom-border", // Clase personalizada para el borde
        }
      });

      setLoadingRecibidos(false); //Finaliza estado de carga
      return;
    } else {

      setLoadingRecibidos(false); //Finaliza estado de carga
    }
    paginar1(1);
  };

  const handleActualizar = async () => {
    limpiarDataActions();
    setListaEnviados((prevState) => ({
      ...prevState,
      paS_ESTADO_RECIBE: "",
    }));
    setListaRecibidos((prevState) => ({
      ...prevState,
      paS_ESTADO_RECIBE: "",
    }));
    listadoTraspasosEnviadosActions("", "", ListaEnviados.af_codigo_generico, ListaEnviados.tras_corr, objeto.Roles[0].codigoEstablecimiento, objeto.IdCredencial, ListaEnviados.paS_ESTADO_RECIBE);
    listadoTraspasosRecibidosActions("", "", ListaRecibidos.af_codigo_generico, ListaRecibidos.tras_corr, objeto.Roles[0].codigoEstablecimiento, objeto.IdCredencial, ListaRecibidos.paS_ESTADO_RECIBE);

  };

  const handleVerEnviados = async (index: number, lista: any) => {
    setMostrarModalEnviados(index);
    // Actualiza lista eliminando el elemento seleccionado
    setElementoSeleccionado((prev) => prev.filter((_, i) => i !== index));
    // Validar si el usuario actual es el creador según su establecimiento
    const esCreadorActual = objeto.Roles[0].codigoEstablecimiento === lista.coD_ESTABL_ORIGEN;
    setEsCreador(esCreadorActual);
    const estadoEnviado = parseInt(lista.paS_ESTADO_RECIBE);
    setEstadoEnviado(estadoEnviado);

    const numTraspaso = parseInt(lista.n_TRASPASO);

    // Verificar si los adjuntos ya están cargados para este traspaso
    if (adjuntosCargados !== numTraspaso) {
      setLoadingAdjuntos(true);
      await obtenerAdjuntosActions(numTraspaso);
      setAdjuntosCargados(numTraspaso);
      setLoadingAdjuntos(false);
    }
  };

  const handleVerRecibidos = async (index: number, lista: any) => {
    setMostrarModalRecibidos(index);
    // Actualiza lista eliminando el elemento seleccionado
    setElementoSeleccionado1((prev) => prev.filter((_, i) => i !== index));
    const estadoRecibido = parseInt(lista.paS_ESTADO_RECIBE);
    setEstadoRecibido(estadoRecibido);

    const numTraspaso = parseInt(lista.n_TRASPASO);

    // Verificar si los adjuntos ya están cargados para este traspaso
    if (adjuntosCargados !== numTraspaso) {
      setLoadingAdjuntos(true);
      await obtenerAdjuntosActions(numTraspaso);
      setAdjuntosCargados(numTraspaso);
      setLoadingAdjuntos(false);
    }
  };

  const handleCerrarModalEnviados = (index: number) => {
    setElementoSeleccionado((prevSeleccionadas) =>
      prevSeleccionadas.filter((fila) => fila !== index.toString())
    );
    setMostrarModalEnviados(null); //Cierra modal del indice seleccionado 

  };

  const handleCerrarModalRecibidos = (index: number) => {
    setElementoSeleccionado1((prevSeleccionadas) =>
      prevSeleccionadas.filter((fila) => fila !== index.toString())
    );
    setMostrarModalRecibidos(null); //Cierra modal del indice seleccionado       
  };

  const handleSubmitSI = async (aF_CLAVE: number) => {
    const result = await Swal.fire({
      icon: "info",
      title: "Confirmar recepción",
      text: "Está indicando que el bien ha sido enviado y recibido correctamente en su establecimiento.",
      showCancelButton: true,
      confirmButtonText: "Marcar como recibido",
      background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
      color: `${isDarkMode ? "#ffffff" : "000000"}`,
      cancelButtonText: "Cerrar",
      confirmButtonColor: `${isDarkMode ? "#6c757d" : "#198754"}`,
      customClass: { popup: "custom-border" }
    });

    if (result.isConfirmed) {

      if (mostrarModalEnviados) {
        setLoadingEnviados(true);
      } else {
        setLoadingRecibidos(false);
      }

      const RecibeTraspaso = {
        aF_CLAVE,
        pas_estado_recibe: "1",
        paS_NOM_RECIBE: PrimeraMayuscula(objeto.Nombre) + " " + PrimeraMayuscula(objeto.Apellido1)
      };

      const resultado = await recibeTraspasoActions(RecibeTraspaso);
      if (resultado) {

        Swal.fire({
          icon: "success",
          title: "Recepción confirmada",
          text: "La recepción del activo en su establecimiento ha sido registrada correctamente.",
          background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
          color: `${isDarkMode ? "#ffffff" : "000000"}`,
          confirmButtonColor: `${isDarkMode ? "#6c757d" : "#0d6efd"}`,
          customClass: {
            popup: "custom-border", // Clase personalizada para el borde
          }
        });

        if (mostrarModalEnviados) {
          setMostrarModalEnviados(null);
          listadoTraspasosEnviadosActions("", "", "", 0, objeto.Roles[0].codigoEstablecimiento, objeto.IdCredencial, ListaEnviados.paS_ESTADO_RECIBE);
        }
        else {
          setMostrarModalRecibidos(null);
          listadoTraspasosRecibidosActions("", "", "", 0, objeto.Roles[0].codigoEstablecimiento, objeto.IdCredencial, ListaRecibidos.paS_ESTADO_RECIBE);
        }

      } else {
        Swal.fire({
          icon: "error",
          title: ":'(",
          text: "Hubo un problema al editar la especie.",
          background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
          color: `${isDarkMode ? "#ffffff" : "000000"}`,
          confirmButtonColor: `${isDarkMode ? "#6c757d" : "#0d6efd"}`,
          customClass: {
            popup: "custom-border", // Clase personalizada para el borde
          }
        });
      }
      if (mostrarModalEnviados) {
        setLoadingEnviados(false);
      } else {
        setLoadingRecibidos(false);
      }
    }
  };

  const handleSubmitNO = async (aF_CLAVE: number) => {
    const result = await Swal.fire({
      icon: "error",
      title: "Rechazar recepción",
      // text: "El bien rechazado ",
      showCancelButton: true,
      confirmButtonText: "Marcar como rechazado",
      background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
      color: `${isDarkMode ? "#ffffff" : "000000"}`,
      cancelButtonText: "Cerrar",
      confirmButtonColor: "#f27474",
      customClass: { popup: "custom-border" }
    });

    if (result.isConfirmed) {
      if (mostrarModalEnviados) {
        setLoadingEnviados(true);
      } else {
        setLoadingRecibidos(false);
      }

      const RecibeTraspaso = {
        aF_CLAVE,
        pas_estado_recibe: "2",
        paS_NOM_RECIBE: PrimeraMayuscula(objeto.Nombre) + "" + PrimeraMayuscula(objeto.Apellido1)
      };

      const resultado = await recibeTraspasoActions(RecibeTraspaso);
      if (resultado) {
        Swal.fire({
          icon: "warning",
          text: "El activo ha sido marcado como rechazado.",
          background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
          color: `${isDarkMode ? "#ffffff" : "000000"}`,
          confirmButtonColor: `${isDarkMode ? "#6c757d" : "#0d6efd"}`,
          customClass: {
            popup: "custom-border", // Clase personalizada para el borde
          }
        });

        if (mostrarModalEnviados) {
          setMostrarModalEnviados(null);
          listadoTraspasosEnviadosActions("", "", "", 0, objeto.Roles[0].codigoEstablecimiento, objeto.IdCredencial, ListaEnviados.paS_ESTADO_RECIBE);
        }
        else {
          setMostrarModalRecibidos(null);
          listadoTraspasosRecibidosActions("", "", "", 0, objeto.Roles[0].codigoEstablecimiento, objeto.IdCredencial, ListaRecibidos.paS_ESTADO_RECIBE);
        }

      } else {
        Swal.fire({
          icon: "error",
          title: ":'(",
          text: "Hubo un problema al editar la especie.",
          background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
          color: `${isDarkMode ? "#ffffff" : "000000"}`,
          confirmButtonColor: `${isDarkMode ? "#6c757d" : "#0d6efd"}`,
          customClass: {
            popup: "custom-border", // Clase personalizada para el borde
          }
        });
      }
      if (mostrarModalEnviados) {
        setLoadingEnviados(false);
      } else {
        setLoadingRecibidos(false);
      }
    }
  };

  function detectarTipo(base64: string): string {
    if (base64.startsWith("JVBERi0")) return "pdf";
    if (base64.startsWith("/9j/")) return "jpeg";
    if (base64.startsWith("iVBOR")) return "png";
    if (base64.startsWith("R0lGOD")) return "gif";
    return "png"; // fallback
  };

  const handleDescargarAdjunto = (lista: any) => {
    const contenido = listadoTraspasosAdjuntos?.[lista]?.contenido || lista?.contenido;
    const nombreArchivo = lista?.nombre || "documento";

    if (!contenido) {
      console.warn("Sin contenido en el adjunto");
      return;
    }

    // Limpia el base64 (quita saltos de línea o espacios)
    const base64Limpio = contenido.replace(/\s/g, "").trim();

    // Detecta tipo de archivo
    const tipo = detectarTipo(base64Limpio);
    const mimeType =
      tipo === "pdf"
        ? "application/pdf"
        : tipo === "docx"
          ? "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          : tipo === "doc"
            ? "image/jpeg"
            : tipo === "png"
              ? "image/png"
              : tipo === "gif"
                ? "image/gif"
                : "application/octet-stream";

    // Convierte base64 → Blob
    const byteCharacters = atob(base64Limpio);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const blob = new Blob([new Uint8Array(byteNumbers)], { type: mimeType });

    // Crea una URL temporal tipo blob:
    const blobUrl = URL.createObjectURL(blob);

    // Crea un link invisible para descargar el archivo
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = `${nombreArchivo}.${tipo === "jpeg" ? "jpg" : tipo}`; // agrega extensión correcta
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Limpia la URL del blob después de un momento
    setTimeout(() => URL.revokeObjectURL(blobUrl), 3000);
  };

  return (
    <Layout>
      <Helmet>
        <title>Listado de Traspasos</title>

      </Helmet>
      <MenuTraspasos />
      <div className="table-responsive position-relative z-0 hide-scrollbar" >
        <div style={{ maxHeight: "80vh" }}>
          <div className="border-bottom shadow-sm p-2 rounded">
            <div className="d-flex justify-content-between">
              <h3 className="form-title fw-semibold border-bottom p-1">Listado de Traspasos</h3>
              <div className="d-flex align-items-center text-warning">
                <p className="fw-bold bg-success text-white px-2 small rounded-2 ">Actualizar Enviados y Recibidos</p>
                <button
                  type="button"
                  onClick={handleActualizar}
                  className="btn btn-success d-flex align-items-center justify-content-center m-1 p-2 rounded-circle"
                  title="Actualizar"
                  aria-label="Actualizar información"
                >
                  <ArrowRepeat
                    aria-hidden="true"
                    width={25}
                    height={25}
                  />
                </button>


              </div>
            </div>
            <Row>
              {/*Traspasos enviados */}
              <Col className={`border border-1 rounded ${expandedColumn === "enviados" ? "col-12" : ""} ${expandedColumn === "recibidos" ? "d-none" : ""} `}>
                <div className="d-flex justify-content-between pt-2">
                  <h5 className={`p-2 fs-5 border-start border-4 border-primary ${isDarkMode ? "bg-dark text-light" : "bg-light"} rounded fw-semibold`}>
                    Enviados {contadorEnviados > 0 && (<span className="badge bg-primary ms-2">{contadorEnviados}</span>
                    )}
                  </h5>
                  {expandedColumn ? (
                    <ArrowsCollapseVertical
                      className="cursor-pointer border p-1 rounded hide-icon"
                      aria-hidden="true"
                      width={35}
                      height={35}
                      onClick={() => handleExpandColumn("enviados")}
                    />
                  ) : (
                    <ArrowBarRight
                      className="cursor-pointer border p-1 rounded hide-icon"
                      aria-hidden="true"
                      width={35}
                      height={35}
                      onClick={() => handleExpandColumn("enviados")}
                    />
                  )}
                </div>
                <Row className="border rounded p-2 m-2">
                  <Col className={`${expandedColumn === "enviados" ? "col-3" : ""} ${expandedColumn === "recibidos" ? "col-12" : ""}`}>
                    <div className="mb-2 ">
                      <div className="flex-grow-1 mb-2">
                        <label htmlFor="fDesde" className="form-label fw-semibold small">Desde</label>
                        <div className="input-group">
                          <input
                            aria-label="Fecha Desde"
                            type="date"
                            className={`form-control ${isDarkMode ? "bg-dark text-light border-secondary" : ""} ${errorEnviados.fDesde ? "is-invalid" : ""}`}
                            name="fDesde"
                            onChange={handleChangeEnviados}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                handleBuscarEnviados(e);
                              }
                            }}
                            value={ListaEnviados.fDesde}
                            max={new Date().toLocaleDateString("sv-SE", { timeZone: "America/Santiago" })}
                          />
                        </div>
                        {errorEnviados.fDesde && <div className="invalid-feedback d-block">{errorEnviados.fDesde}</div>}
                      </div>

                      <div className="flex-grow-1">
                        <label htmlFor="fHasta" className="form-label fw-semibold small">Hasta</label>
                        <div className="input-group">
                          <input
                            aria-label="Fecha Hasta"
                            type="date"
                            className={`form-control ${isDarkMode ? "bg-dark text-light border-secondary" : ""} ${errorEnviados.fHasta ? "is-invalid" : ""}`}
                            name="fHasta"
                            onChange={handleChangeEnviados}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                handleBuscarEnviados(e);
                              }
                            }}
                            value={ListaEnviados.fHasta}
                            max={new Date().toLocaleDateString("sv-SE", { timeZone: "America/Santiago" })}
                          />
                        </div>
                        {errorEnviados.fHasta && <div className="invalid-feedback d-block">{errorEnviados.fHasta}</div>}

                      </div>
                      <small className="fw-semibold">Filtre los resultados por fecha de Traspasos.</small>
                    </div>
                  </Col>

                  <Col className={`${expandedColumn === "enviados" ? "col-3" : ""} ${expandedColumn === "recibidos" ? "col-12" : ""}`}>
                    <div className="mb-1">
                      <label htmlFor="af_codigo_generico" className="form-label fw-semibold small">Nº Inventario</label>
                      <input
                        aria-label="af_codigo_generico"
                        type="text"
                        className={`form-control ${isDarkMode ? "bg-dark text-light border-secondary" : ""}`}
                        name="af_codigo_generico"
                        placeholder="Ej: 1000000008"
                        onChange={handleChangeEnviados}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleBuscarEnviados(e);
                          }
                        }}
                        maxLength={12}
                        value={ListaEnviados.af_codigo_generico}
                      />
                    </div>
                    <div className="mb-1">
                      <label htmlFor="tras_corr" className="fw-semibold">Nº Traspaso</label>
                      <input
                        aria-label="tras_corr"
                        type="text"
                        className={`form-select ${isDarkMode ? "bg-dark text-light border-secondary" : ""}`}
                        name="tras_corr"
                        size={10}
                        placeholder="Eje: 1000000008"
                        onChange={handleChangeEnviados}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleBuscarEnviados(e);
                          }
                        }}
                        maxLength={12}
                        value={ListaEnviados.tras_corr}
                      />
                    </div>
                  </Col>

                  {/* Columna 5: Botones de Acción */}
                  <Col className={`${expandedColumn === "enviados" ? "col-2" : ""} ${expandedColumn === "recibidos" ? "col-12" : ""}`}>
                    <div className="mb-1">
                      <label className="fw-semibold">Estado</label>
                      <select
                        aria-label="estado"
                        className={`form-select ${isDarkMode ? "bg-dark text-light border-secondary" : ""} `}
                        name="paS_ESTADO_RECIBE"
                        onChange={handleChangeEnviados}
                        value={ListaEnviados.paS_ESTADO_RECIBE}
                      >
                        <option value="">Selecccionar</option>
                        <option value="0">Sin Validación</option>
                        <option value="1">Recibidos</option>
                        <option value="2">Rechazado</option>
                      </select>
                    </div>
                    <div className="d-flex gap-2 mt-4">
                      <div></div>
                      <Button
                        onClick={handleBuscarEnviados}
                        variant={`${isDarkMode ? "secondary" : "primary"}`}
                        className="w-100"
                      // disabled={loading}
                      >
                        {loadingEnviados ? (
                          <>
                            Buscar
                            <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="ms-1" />
                          </>
                        ) : (
                          <>
                            Buscar
                            <Search className="flex-shrink-0 h-5 w-5 ms-1" aria-hidden="true" />
                          </>
                        )}
                      </Button>

                      <Button onClick={handleLimpiarEnviados} variant={`${isDarkMode ? "secondary" : "primary"}`} className="w-100">
                        Limpiar
                        <Eraser className="flex-shrink-0 h-5 w-5 ms-1" aria-hidden="true" />
                      </Button>
                    </div>
                  </Col>
                </Row>
                <Row className="g-2 align-items-center flex-column flex-lg-row justify-content-between">
                  {/* Tamaño de página */}
                  <Col xs={12} lg="auto">
                    {listadoTraspasos.length > 10 && (
                      <div className="d-flex align-items-center justify-content-center justify-content-lg-start">
                        <label htmlFor="nPaginacion" className="form-label fw-semibold mb-0 me-2">
                          Tamaño de página:
                        </label>
                        <select
                          aria-label="Seleccionar tamaño de página"
                          className={`form-select form-select-sm w-auto ${isDarkMode ? "bg-dark text-light border-secondary" : ""}`}
                          name="nPaginacion"
                          onChange={handleChangeEnviados}
                          value={Paginacion.nPaginacion}
                        >
                          {[10, 15, 20, 25, 50, 100].map((val) => (
                            <option key={val} value={val}>{val}</option>
                          ))}
                        </select>
                      </div>
                    )}
                  </Col>
                </Row>


                {loadingEnviados ? (
                  <>
                    <SkeletonLoader rowCount={elementosPorPagina} />
                  </>
                ) : (
                  <>
                    {listadoTraspasos.length > 0 ? (
                      <>
                        <div className='table-responsive'>
                          <table className={`table  ${isDarkMode ? "table-dark" : "table-hover table-striped "}`} >
                            <thead className={`sticky-top z-0 ${isDarkMode ? "table-dark" : "text-dark table-light "}`}>
                              <tr>
                                <th scope="col" className="text-nowrap small">Estado</th>
                                <th scope="col" className="text-nowrap small">N° Inventario</th>
                                <th scope="col" className="text-nowrap small">N° Traspaso</th>
                                <th scope="col" className="text-nowrap small">Fecha Traspaso</th>
                                <th scope="col" className="text-nowrap small">Nombre Especie</th>
                                <th scope="col" className="text-nowrap small">Entregado por</th>
                                <th scope="col" className={`small ${expandedColumn === "enviados" ? "" : "d-none"}`}>Ubicación Destino<CircleFill className={"flex-shrink-0 h-5 w-5 ms-1 text-success"} aria-hidden="true" /></th>
                                <th scope="col" className="text-nowrap sticky rounded-top small">
                                  <b>Acción</b>
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {elementosActuales.map((Lista, index) => {
                                let indexReal = indicePrimerElemento + index; // Índice real basado en la página
                                return (
                                  <tr key={indexReal}>
                                    {/* <td>
                        <Form.Check
                          type="checkbox"
                          onChange={() => setSeleccionaFila(indexReal)}
                          checked={filasSeleccionada.includes((indexReal).toString())}
                        />
                        </td> */}
                                    <td className="text-nowrap small">
                                      {Lista.paS_ESTADO_RECIBE === "0" ? <span className="badge bg-primary w-100 small"> Sin Validación</span>
                                        : Lista.paS_ESTADO_RECIBE === "1" ? <span className="badge bg-success w-100 small">Recibido</span>
                                          : Lista.paS_ESTADO_RECIBE === "2" ? <span className="badge bg-danger w-100 small">Rechazado</span> : <span>-</span>}
                                    </td>

                                    <td className="text-nowrap small">{Lista.aF_CODIGO_GENERICO}</td>
                                    <td className="text-nowrap small">{Lista.n_TRASPASO}</td>
                                    <td className="text-nowrap small">{Lista.paS_FECHA}</td>
                                    <td className="text-nowrap small">{Lista.esP_NOMBRE}</td>
                                    <td className="text-nowrap small">{
                                      Lista.usuariO_CREA === '62511' ? 'Andy Riquelme' :
                                        Lista.usuariO_CREA === '18124' ? 'Rodrigo Toledo' :
                                          Lista.usuariO_CREA === 'JCASTILLO' || Lista.usuariO_CREA === 'jcastillo' || Lista.usuariO_CREA === 1770 ? 'Jaime Castillo' :
                                            Lista.usuariO_CREA === 'DROJASP' || Lista.usuariO_CREA === 'drojasp' || Lista.usuariO_CREA === 66098 ? 'Daniel Rojas' :
                                              Lista.usuariO_CREA === '1234567' || Lista.usuariO_CREA === '18667' ? 'Felipe Almonte' :
                                                Lista.usuariO_CREA === 'JVARGAS' || Lista.usuariO_CREA === 'jvargas' || Lista.usuariO_CREA === 6405 ? 'Jonathan Vargas' :
                                                  Lista.usuariO_CREA === 'GFARIAS' || Lista.usuariO_CREA === 'gfarias' || Lista.usuariO_CREA === 888 ? 'Gabriela Farias' :
                                                    Lista.usuariO_CREA === 61870 ? 'Elena Navarro' :
                                                      Lista.usuariO_CREA === 68321 ? 'Ivan Acevedo' :
                                                        Lista.usuariO_CREA === 67234 ? 'Ignacio Avilés' :
                                                          Lista.usuariO_CREA === 6601 ? 'Benjamin Bulboa' :
                                                            Lista.usuariO_CREA === 67404 ? 'Ademir Pindea' :
                                                              Lista.usuariO_CREA === 21479 ? 'Nelsn Quiroz' :
                                                                Lista.usuariO_CREA === 66098 ? 'Daniel Rojas' :
                                                                  Lista.usuariO_CREA === 'KREYESD' || Lista.usuariO_CREA === 'kreyesd' || Lista.usuariO_CREA === '66099' ? 'Katherine Reyes' : Lista.usuariO_CREA


                                    }</td>
                                    <td className={`small ${expandedColumn === "enviados" ? "" : "d-none"}`}>{Lista.seR_NOMBRE_DESTINO} {Lista.deP_NOMBRE_DESTINO}</td>
                                    <td className="text-nowrap sticky rounded small">
                                      <Button
                                        variant="outline-primary"
                                        className="fw-semibold  ps-3 pe-3 small"
                                        onClick={() => handleVerEnviados(index, Lista)}
                                      >
                                        Ver
                                      </Button>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                        {/* Paginador */}
                        <div className="paginador-container position-relative z-0">
                          <Pagination className="paginador-scroll ">
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
                                {i + 1} {/* adentro de aqui esta page-link */}
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
                      </>
                    ) : (
                      <p className={`text-center  pt-1 pb-1 mb-1 rounded border-0 fs-09em fw-semibold ${isDarkMode ? 'bg-dark text-light border border-secondary' : 'bg-light text-muted border'}`}>
                        No hay resultados para mostrar.
                      </p>
                    )}
                  </>
                )}

              </Col>
              {/*Traspasos recibidos */}
              <Col className={`border border-1 rounded ${expandedColumn === "recibidos" ? "col-12" : ""} ${expandedColumn === "enviados" ? "d-none" : ""}`}>
                <div className="d-flex justify-content-between pt-2">
                  <h5 className={`p-2 fs-5 border-start border-4 border-success ${isDarkMode ? "bg-dark text-light" : "bg-light"} rounded fw-semibold`}>
                    Recibidos {contadorRecibidos > 0 && (<span className="badge bg-success ms-2">{contadorRecibidos}</span>
                    )}
                  </h5>

                  {expandedColumn ? (
                    <ArrowsCollapseVertical
                      className="flex-shrink-0 cursor-pointer border p-1 rounded hide-icon"
                      aria-hidden="true"
                      width={35}
                      height={35}
                      onClick={() => handleExpandColumn("recibidos")}
                    />
                  ) : (
                    <ArrowBarLeft
                      className="flex-shrink-0 cursor-pointer border p-1 rounded hide-icon"
                      aria-hidden="true"
                      width={35}
                      height={35}
                      onClick={() => handleExpandColumn("recibidos")}
                    />
                  )}
                </div>
                <Row className="border rounded p-2 m-2">
                  <Col className={`${expandedColumn === "recibidos" ? "col-3" : ""} ${expandedColumn === "enviados" ? "col-12" : ""}`}>
                    <div className="mb-2 ">
                      <div className="flex-grow-1 mb-2">
                        <label htmlFor="fDesde" className="form-label fw-semibold small">Desde</label>
                        <div className="input-group">
                          <input
                            aria-label="Fecha Desde"
                            type="date"
                            className={`form-control ${isDarkMode ? "bg-dark text-light border-secondary" : ""} ${errorRecibidos.fDesde ? "is-invalid" : ""}`}
                            name="fDesde"
                            onChange={handleChangeRecibidos}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                handleBuscarRecibidos(e);
                              }
                            }}
                            value={ListaRecibidos.fDesde}
                            max={new Date().toLocaleDateString("sv-SE", { timeZone: "America/Santiago" })}
                          />
                        </div>
                        {errorRecibidos.fDesde && <div className="invalid-feedback d-block">{errorRecibidos.fDesde}</div>}
                      </div>

                      <div className="flex-grow-1">
                        <label htmlFor="fHasta" className="form-label fw-semibold small">Hasta</label>
                        <div className="input-group">
                          <input
                            aria-label="Fecha Hasta"
                            type="date"
                            className={`form-control ${isDarkMode ? "bg-dark text-light border-secondary" : ""} ${errorRecibidos.fHasta ? "is-invalid" : ""}`}
                            name="fHasta"
                            onChange={handleChangeRecibidos}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                handleBuscarRecibidos(e);
                              }
                            }}
                            value={ListaRecibidos.fHasta}
                            max={new Date().toLocaleDateString("sv-SE", { timeZone: "America/Santiago" })}
                          />
                        </div>
                        {errorRecibidos.fHasta && <div className="invalid-feedback d-block">{errorRecibidos.fHasta}</div>}

                      </div>
                      <small className="fw-semibold">Filtre los resultados por fecha de Traspasos.</small>
                    </div>
                  </Col>

                  <Col className={`${expandedColumn === "recibidos" ? "col-3" : ""} ${expandedColumn === "enviados" ? "col-12" : ""}`}>
                    <div className="mb-1">
                      <label htmlFor="af_codigo_generico" className="form-label fw-semibold small">Nº Inventario</label>
                      <input
                        aria-label="af_codigo_generico"
                        type="text"
                        className={`form-control ${isDarkMode ? "bg-dark text-light border-secondary" : ""}`}
                        name="af_codigo_generico"
                        placeholder="Ej: 1000000008"
                        onChange={handleChangeRecibidos}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleBuscarRecibidos(e);
                          }
                        }}
                        maxLength={12}
                        value={ListaRecibidos.af_codigo_generico}
                      />
                    </div>
                    <div className="mb-1">
                      <label htmlFor="tras_corr" className="fw-semibold">Nº Traspaso</label>
                      <input
                        aria-label="tras_corr"
                        type="text"
                        className={`form-select ${isDarkMode ? "bg-dark text-light border-secondary" : ""}`}
                        name="tras_corr"
                        size={10}
                        placeholder="Eje: 1000000008"
                        onChange={handleChangeRecibidos}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleBuscarRecibidos(e);
                          }
                        }}
                        maxLength={12}
                        value={ListaRecibidos.tras_corr}
                      />
                    </div>
                  </Col>

                  {/* Columna 5: Botones de Acción */}
                  <Col className={`${expandedColumn === "recibidos" ? "col-2" : ""} ${expandedColumn === "enviados" ? "col-12" : ""}`}>
                    <div className="mt-1">
                      <label className="fw-semibold">Estado</label>
                      <select
                        aria-label="estado"
                        className={`form-select ${isDarkMode ? "bg-dark text-light border-secondary" : ""} `}
                        name="paS_ESTADO_RECIBE"
                        onChange={handleChangeRecibidos}
                        value={ListaRecibidos.paS_ESTADO_RECIBE}
                      >
                        <option value="">Selecccionar</option>
                        <option value="0">Sin Validación</option>
                        <option value="1">Recibidos</option>
                        <option value="2">Rechazado</option>
                      </select>
                    </div>
                    <div className="d-flex gap-2 mt-4">
                      <Button
                        onClick={handleBuscarRecibidos}
                        variant={`${isDarkMode ? "secondary" : "primary"}`}
                        className="w-100"
                      // disabled={loading}
                      >
                        {loadingRecibidos ? (
                          <>
                            Buscar
                            <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="ms-1" />
                          </>
                        ) : (
                          <>
                            Buscar
                            <Search className="flex-shrink-0 h-5 w-5 ms-1" aria-hidden="true" />
                          </>
                        )}
                      </Button>

                      <Button onClick={handleLimpiarRecibidos} variant={`${isDarkMode ? "secondary" : "primary"}`} className="w-100">
                        Limpiar
                        <Eraser className="flex-shrink-0 h-5 w-5 ms-1" aria-hidden="true" />
                      </Button>
                    </div>
                  </Col>
                </Row>
                <Row className="g-2 align-items-center flex-column flex-lg-row justify-content-between">
                  {/* Tamaño de página */}
                  <Col xs={12} lg="auto">
                    {listadoTraspasosRecibidos.length > 10 && (
                      <div className="d-flex align-items-center justify-content-center justify-content-lg-start">
                        <label htmlFor="nPaginacion" className="form-label fw-semibold mb-0 me-2">
                          Tamaño de página:
                        </label>
                        <select
                          aria-label="Seleccionar tamaño de página"
                          className={`form-select form-select-sm w-auto ${isDarkMode ? "bg-dark text-light border-secondary" : ""}`}
                          name="nPaginacion"
                          onChange={handleChangeRecibidos}
                          value={Paginacion.nPaginacion}
                        >
                          {[10, 15, 20, 25, 50, 100].map((val) => (
                            <option key={val} value={val}>{val}</option>
                          ))}
                        </select>
                      </div>
                    )}
                  </Col>
                </Row>


                {loadingRecibidos ? (
                  <>
                    <SkeletonLoader rowCount={elementosPorPagina1} />
                  </>
                ) : (
                  <>
                    {listadoTraspasosRecibidos.length > 0 ? (
                      <>
                        <div className='table-responsive'>
                          <table className={`table  ${isDarkMode ? "table-dark" : "table-hover table-striped "}`} >
                            <thead className={`sticky-top z-0 ${isDarkMode ? "table-dark" : "text-dark table-light "}`} >
                              <tr >
                                <th scope="col" className="text-nowrap small">Estado</th>
                                <th scope="col" className="text-nowrap small">N° Inventario</th>
                                <th scope="col" className="text-nowrap small">N° Traspaso</th>
                                <th scope="col" className="text-nowrap small">Fecha Traspaso</th>
                                <th scope="col" className="text-nowrap small">Nombre Especie</th>
                                <th scope="col" className="text-nowrap small">Entregado por</th>
                                <th scope="col" className={` ${expandedColumn === "recibidos" ? "" : "d-none"}`}>Ubicación Origen<CircleFill className={"flex-shrink-0 h-5 w-5 ms-1 text-warning"} aria-hidden="true" /></th>
                                <th scope="col" className="text-nowrap sticky rounded-top small">
                                  <b>Acción</b>
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {elementosActuales1.map((Lista, index) => {
                                let indexReal = indicePrimerElemento1 + index; // Índice real basado en la página
                                return (
                                  <tr key={indexReal}>
                                    <td className="text-nowrap small">
                                      {Lista.paS_ESTADO_RECIBE === "0" ? <span className="badge bg-primary w-100 small"> Sin Validación</span>
                                        : Lista.paS_ESTADO_RECIBE === "1" ? <span className="badge bg-success w-100 small">Recibido</span>
                                          : Lista.paS_ESTADO_RECIBE === "2" ? <span className="badge bg-danger w-100 small">Rechazado</span> : <span>-</span>}
                                    </td>
                                    <td className="text-nowrap small">{Lista.aF_CODIGO_GENERICO}</td>
                                    <td className="text-nowrap small">{Lista.n_TRASPASO}</td>
                                    <td className="text-nowrap small">{Lista.paS_FECHA}</td>
                                    <td className="text-nowrap small" >{Lista.esP_NOMBRE}</td>
                                    <td className="text-nowrap small">{
                                      Lista.usuariO_CREA === '62511' ? 'Andy Riquelme' :
                                        Lista.usuariO_CREA === '18124' ? 'Rodrigo Toledo' :
                                          Lista.usuariO_CREA === 'JCASTILLO' || Lista.usuariO_CREA === 'jcastillo' || Lista.usuariO_CREA === 1770 ? 'Jaime Castillo' :
                                            Lista.usuariO_CREA === 'DROJASP' || Lista.usuariO_CREA === 'drojasp' || Lista.usuariO_CREA === 66098 ? 'Daniel Rojas' :
                                              Lista.usuariO_CREA === '1234567' || Lista.usuariO_CREA === '18667' ? 'Felipe Almonte' :
                                                Lista.usuariO_CREA === 'JVARGAS' || Lista.usuariO_CREA === 'jvargas' || Lista.usuariO_CREA === 6405 ? 'Jonathan Vargas' :
                                                  Lista.usuariO_CREA === 'GFARIAS' || Lista.usuariO_CREA === 'gfarias' || Lista.usuariO_CREA === 888 ? 'Gabriela Farias' :
                                                    Lista.usuariO_CREA === 61870 ? 'Elena Navarro' :
                                                      Lista.usuariO_CREA === 68321 ? 'Ivan Acevedo' :
                                                        Lista.usuariO_CREA === 67234 ? 'Ignacio Avilés' :
                                                          Lista.usuariO_CREA === 6601 ? 'Benjamin Bulboa' :
                                                            Lista.usuariO_CREA === 67404 ? 'Ademir Pindea' :
                                                              Lista.usuariO_CREA === 21479 ? 'Nelsn Quiroz' :
                                                                Lista.usuariO_CREA === 66098 ? 'Daniel Rojas' :
                                                                  Lista.usuariO_CREA === 'KREYESD' || Lista.usuariO_CREA === 'kreyesd' || Lista.usuariO_CREA === '66099' ? 'Katherine Reyes' : Lista.usuariO_CREA


                                    }</td>
                                    <td className={`small ${expandedColumn === "recibidos" ? "" : "d-none"}`}>{Lista.seR_NOMBRE_ORIGEN} {Lista.deP_NOMBRE_ORIGEN}</td>
                                    <td className="text-nowrap sticky-col-right-0 rounded small">
                                      <Button
                                        variant="outline-success"
                                        className="fw-semibold ps-3 pe-3 small"
                                        onClick={() => handleVerRecibidos(index, Lista)}
                                      >
                                        Validar
                                      </Button>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                        {/* Paginador */}
                        <div className="paginador-container position-relative z-0">
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
                      </>
                    ) : (
                      <p className={`text-center  pt-1 pb-1 mb-1 rounded border-0 fs-09em fw-semibold ${isDarkMode ? 'bg-dark text-light border border-secondary' : 'bg-light text-muted border'}`}>
                        No hay resultados para mostrar.
                      </p>
                    )}
                  </>
                )}

              </Col>
            </Row>
          </div>
        </div >
      </div >
      {/* Detalle de traspasos enviados */}
      {
        elementosActuales.map((fila, index) => (
          <Modal
            key={index}
            show={mostrarModalEnviados === index}
            onHide={() => handleCerrarModalEnviados(index)}
            size="xl"
            centered
          >
            {/* Estado */}
            {estadoEnviado === 0 ? (
              <>
                <div className="py-2 rounded fw-semibold fs-09em bg-warning bg-opacity-10 text-warning border-none">
                  <Clock className="me-2 flex-shrink-0" aria-hidden="true" />
                  Esperando Validación
                </div>
              </>
            ) : (
              estadoEnviado === 1 ? (
                <>
                  <div className="py-2 rounded fw-semibold fs-09em bg-success bg-opacity-10 text-success border-none">
                    <Check2Circle className="me-2 flex-shrink-0" aria-hidden="true" />
                    Marcado como recibido</div>
                </>
              ) : (
                <>
                  <div className="py-2 rounded fw-semibold fs-09em bg-danger bg-opacity-10 text-danger border-none">
                    <XCircle className="me-2 flex-shrink-0" aria-hidden="true" />
                    Marcado como rechazado</div>
                </>
              ))}
            <Modal.Header closeButton className={isDarkMode ? "darkModePrincipal" : ""}>
              <Modal.Title className="fw-semibold">Traspaso Enviado</Modal.Title>
            </Modal.Header>

            <Modal.Body className={isDarkMode ? "darkModePrincipal" : ""}>
              <Row className="g-1">

                {/* Información General del Traspaso */}
                <Col lg={6}>
                  <div className={`border rounded-3 p-1 h-100 ${isDarkMode ? "border-secondary" : ""}`}>
                    <h5 className="fw-semibold mb-3 pb-1 border-bottom">Información del Traspaso</h5>
                    <Row className="g-1">
                      <Col md={6}>
                        <label className="fw-semibold small text-muted">Nº Inventario</label>
                        <div
                          className={`rounded border px-3 py-1 ${isDarkMode ? "bg-dark border-secondary text-light" : "bg-light border-muted text-dark"}`}
                        >
                          {fila.aF_CODIGO_GENERICO || "Sin Información"}
                        </div>
                      </Col>
                      <Col md={6}>
                        <label className="fw-semibold small text-muted">Nº Traspaso</label>
                        <div
                          className={`rounded border px-3 py-1 ${isDarkMode ? "bg-dark border-secondary text-light" : "bg-light border-muted text-dark"}`}
                        >
                          {fila.n_TRASPASO || "Sin Información"}
                        </div>
                      </Col>
                      <Col md={6}>
                        <label className="fw-semibold small text-muted">Fecha Traspaso</label>
                        <div
                          className={`rounded border px-3 py-1 ${isDarkMode ? "bg-dark border-secondary text-light" : "bg-light border-muted text-dark"}`}
                        >
                          {fila.paS_FECHA || "No definida"}
                        </div>
                      </Col>
                      <Col md={6}>
                        <label className="fw-semibold small text-muted">Fecha del Memo</label>
                        <div
                          className={`rounded border px-3 py-1 ${isDarkMode ? "bg-dark border-secondary text-light" : "bg-light border-muted text-dark"}`}
                        >
                          {fila.paS_FECHA_MEMO || "No definida"}
                        </div>
                      </Col>
                      <Col md={6}>
                        <label className="fw-semibold small text-muted">N° Memo de Referencia</label>
                        <div
                          className={`rounded border px-3 py-1 ${isDarkMode ? "bg-dark border-secondary text-light" : "bg-light border-muted text-dark"}`}
                        >
                          {fila.paS_MEMO_REF || "Sin Información"}
                        </div>
                      </Col>

                      <Col md={6}>
                        <label className="fw-semibold small text-muted">Codigo Especie</label>
                        <div
                          className={`rounded border px-3 py-1 ${isDarkMode ? "bg-dark border-secondary text-light" : "bg-light border-muted text-dark"}`}
                        >
                          {fila.esP_CODIGO || "Sin Información"}
                        </div>
                      </Col>
                      <Col md={12}>
                        <label className="fw-semibold small text-muted">Especie</label>
                        <div
                          className={`rounded border px-3 py-1 ${isDarkMode ? "bg-dark border-secondary text-light" : "bg-light border-muted text-dark"}`}
                        >
                          {fila.esP_NOMBRE || "Sin Información"}
                        </div>
                      </Col>
                      <Col md={12}>
                        <label className="fw-semibold small text-muted">Estado</label>
                        <div
                          className={`rounded border px-3 py-1 ${isDarkMode ? "bg-dark border-secondary text-light" : "bg-light border-muted text-dark"}`}
                        >
                          {fila.paS_ESTADO_AF || "No definida"}
                        </div>
                      </Col>
                    </Row>
                  </div>
                </Col>

                {/* Origen y Destino */}
                <Col lg={6}>
                  <div className={`border rounded-3 p-1 h-100 ${isDarkMode ? "border-secondary" : ""}`}>
                    <h5 className="fw-semibold mb-3 pb-1 border-bottom">Establecimiento</h5>
                    <Row className="g-1">
                      <Col md={12} className="mb-1 border-bottom p-1">
                        <div className="mb-3">
                          <label className="fw-semibold small d-flex align-items-center mb-1">
                            <GeoFill className="me-2 text-warning" width={15} height={15} aria-hidden="true" />
                            Origen
                          </label>
                          <div
                            className={`rounded border px-3 py-2 ${isDarkMode ? "bg-dark border-secondary text-light" : "bg-light border-muted text-dark"}`}
                          >
                            <p className="fs-05em text-start">   {fila.establecimientO_ORIGEN || "Sin Información"}</p>
                          </div>
                        </div>
                        <div>
                          <label className="fw-semibold small text-muted">Servicio/Dependencia Origen</label>
                          <div
                            className={`rounded border px-3 py-2 ${isDarkMode ? "bg-dark border-secondary text-light" : "bg-light border-muted text-dark"}`}

                          >
                            <p className="fs-05em text-start"> {fila.seR_NOMBRE_ORIGEN + " " + fila.deP_NOMBRE_ORIGEN || "Sin Información"}</p>
                          </div>
                        </div>
                      </Col>

                      <Col md={12} className="mb-1 p-1">
                        <div className="mb-3">
                          <label className="fw-semibold small d-flex align-items-center mb-1">
                            <GeoFill className="me-2 text-success" width={15} height={15} aria-hidden="true" />
                            Destino
                          </label>
                          <div
                            className={`rounded border px-3 py-2 ${isDarkMode ? "bg-dark border-secondary text-light" : "bg-light border-muted text-dark"}`}
                          >
                            <p className="fs-05em text-start">  {fila.establecimientO_DESTINO || "Sin Información"}</p>
                          </div>
                        </div>
                        <div>
                          <label className="fw-semibold small text-muted">Servicio/Dependencia Destino</label>
                          <div
                            className={`rounded border px-3 py-2 ${isDarkMode ? "bg-dark border-secondary text-light" : "bg-light border-muted text-dark"}`}
                          >
                            <p className="fs-05em text-start">  {fila.seR_NOMBRE_DESTINO + " " + fila.deP_NOMBRE_DESTINO || "Sin Información"}</p>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </div>
                </Col>

                {/* Observaciones */}
                <Col lg={12}>
                  <div className={`border rounded-3 p-2 ${isDarkMode ? "border-secondary" : ""}`}>
                    <label className="fw-semibold mb-2">Observaciones</label>
                    <div
                      className={`rounded border px-3 py-2 ${isDarkMode ? "bg-dark border-secondary text-light" : "bg-light border-muted text-dark"}`}
                      style={{ whiteSpace: "pre-wrap", minHeight: "80px" }}
                    >
                      {fila.paS_OBS || "Sin observaciones"}
                    </div>
                  </div>
                </Col>

                {/* Recepción y Validación */}
                <Col lg={6}>
                  <div className={`border rounded-3 p-3 ${isDarkMode ? "border-secondary" : ""}`}>
                    <h5 className="fw-semibold mb-3 pb-1 border-bottom">Despacho</h5>
                    <div className="mb-1">
                      <label className="fw-semibold small">Entregado Por</label>
                      <p className="d-flex align-items-center mb-0">
                        {fila.paS_NOM_ENTREGA || "Sin Información"}
                        <Check2Circle className="mx-1 text-success flex-shrink-0" aria-hidden="true" />
                      </p>

                    </div>
                    <div className="mb-1">
                      <label className="fw-semibold small">Recibido Por</label>
                      <p className="d-flex align-items-center mb-0">
                        {fila.paS_NOM_RECIBE === "X" ? (
                          <>
                            Esperando Validación
                            <ExclamationCircle className="mx-1 text-warning flex-shrink-0" aria-hidden="true" />
                          </>
                        ) : fila.paS_NOM_RECIBE ? (
                          <>
                            {fila.paS_NOM_RECIBE}
                            <Check2Circle className="mx-1 text-success flex-shrink-0" aria-hidden="true" />
                          </>
                        ) : (
                          "Sin Información"
                        )}
                      </p>
                    </div>
                    <div>
                      <label className="fw-semibold small">Jefe que Autoriza</label>
                      <p className="d-flex align-items-center mb-0">
                        {fila.paS_NOM_AUTORIZA || "Sin Información"}
                        <Check2Circle className="mx-1 text-success flex-shrink-0 fs-bold" aria-hidden="true" />
                      </p>
                    </div>
                  </div>
                </Col>

                {/* Documentos */}
                <Col lg={6}>
                  {listadoTraspasosAdjuntos.length > 0 ? (
                    <div className={`border rounded-3 p-3 h-100 ${isDarkMode ? "border-secondary" : ""}`}>
                      <h5 className="fw-semibold mb-3 pb-1 border-bottom">Documentos</h5>
                      {loadingAdjuntos ? (
                        <>
                          Cargando documentos...
                          <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                            className="ms-2"
                          />
                        </>
                      ) : (
                        <div className="table-responsive">
                          <table className={`table table-sm mb-0 ${isDarkMode ? "table-dark" : "table-hover"}`}>
                            <thead className={isDarkMode ? "table-dark" : "table-light"}>
                              <tr>
                                <th scope="col">Nombre</th>
                                <th scope="col" className="text-center" style={{ width: "100px" }}>
                                  Descargar
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {elementosActualesAdj.map((Lista, index) => {
                                const indexReal = indicePrimerElementoAdj + index
                                return (
                                  <tr key={indexReal}>
                                    <td>{Lista.nombre}</td>
                                    <td className="text-center">
                                      <Button
                                        size="sm"
                                        variant={isDarkMode ? "outline-light" : "outline-primary"}
                                        onClick={() => handleDescargarAdjunto(Lista)}
                                      >
                                        <Download className="h-4 w-4" aria-hidden="true" />
                                      </Button>
                                    </td>
                                  </tr>
                                )
                              })}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  ) : (
                    <>
                      <p className={`text-center  pt-1 pb-1 mb-1 rounded border-0 fs-09em fw-semibold ${isDarkMode ? 'bg-dark text-light border border-secondary' : 'bg-light text-muted border'}`}>
                        Sin documentos adjuntos
                      </p>
                    </>
                  )}
                </Col>
              </Row>
            </Modal.Body>
          </Modal>
        ))
      }

      {/* Detalle de traspasos recibidos */}
      {
        elementosActuales1.map((fila, index) => (
          <Modal
            key={index}
            show={mostrarModalRecibidos === index}
            onHide={() => handleCerrarModalRecibidos(index)}
            size="xl"
            centered
          >
            {/* Validación */}
            {estadoRecibido === 0 ? (
              <>
                <p className="py-2 mb-1 rounded fw-semibold fs-09em bg-info bg-opacity-10 text-muted border-none">¿Ha recibido el bien en su establecimiento?</p >
                <div className="d-flex gap-2 w-50 justify-content-center mx-auto">
                  <Button variant="success" className="w-25" size="sm" onClick={() => handleSubmitSI(fila.aF_CLAVE)}>
                    Sí, recibido
                  </Button>
                  <Button variant="danger" className="w-25" size="sm" onClick={() => handleSubmitNO(fila.aF_CLAVE)}>
                    No, rechazar
                  </Button>
                </div>
              </>
            ) : (
              estadoRecibido === 1 ? (
                <>
                  <div className="py-2 rounded fw-semibold fs-09em bg-success bg-opacity-10 text-success border-none">
                    <Check2Circle className="me-2 flex-shrink-0" aria-hidden="true" />
                    Marcado como recibido</div>
                </>
              ) : (
                <>
                  <div className="py-2 rounded fw-semibold fs-09em bg-danger bg-opacity-10 text-danger border-none">
                    <XCircle className="me-2 flex-shrink-0" aria-hidden="true" />
                    Marcado como rechazado</div>
                </>
              ))}
            <Modal.Header closeButton className={isDarkMode ? "darkModePrincipal" : ""}>
              <Modal.Title className="fw-semibold">Traspaso Recibido</Modal.Title>
            </Modal.Header>

            <Modal.Body className={isDarkMode ? "darkModePrincipal" : ""}>

              <Row className="g-1">
                {/* Información General del Traspaso */}
                <Col lg={6}>
                  <div className={`border rounded-3 p-1 h-100 ${isDarkMode ? "border-secondary" : ""}`}>
                    <h5 className="fw-semibold mb-3 pb-1 border-bottom">Información del Traspaso</h5>
                    <Row className="g-1">
                      <Col md={6}>
                        <label className="fw-semibold small text-muted">Nº Inventario</label>
                        <div
                          className={`rounded border px-3 py-1 ${isDarkMode ? "bg-dark border-secondary text-light" : "bg-light border-muted text-dark"}`}
                        >
                          {fila.aF_CODIGO_GENERICO || "Sin Información"}
                        </div>
                      </Col>
                      <Col md={6}>
                        <label className="fw-semibold small text-muted">Nº Traspaso</label>
                        <div
                          className={`rounded border px-3 py-1 ${isDarkMode ? "bg-dark border-secondary text-light" : "bg-light border-muted text-dark"}`}
                        >
                          {fila.n_TRASPASO || "Sin Información"}
                        </div>
                      </Col>
                      <Col md={6}>
                        <label className="fw-semibold small text-muted">Fecha Traspaso</label>
                        <div
                          className={`rounded border px-3 py-1 ${isDarkMode ? "bg-dark border-secondary text-light" : "bg-light border-muted text-dark"}`}
                        >
                          {fila.paS_FECHA || "No definida"}
                        </div>
                      </Col>
                      <Col md={6}>
                        <label className="fw-semibold small text-muted">Fecha del Memo</label>
                        <div
                          className={`rounded border px-3 py-1 ${isDarkMode ? "bg-dark border-secondary text-light" : "bg-light border-muted text-dark"}`}
                        >
                          {fila.paS_FECHA_MEMO || "No definida"}
                        </div>
                      </Col>

                      <Col md={6}>
                        <label className="fw-semibold small text-muted">N° Memo de Referencia</label>
                        <div
                          className={`rounded border px-3 py-1 ${isDarkMode ? "bg-dark border-secondary text-light" : "bg-light border-muted text-dark"}`}
                        >
                          {fila.paS_MEMO_REF || "Sin Información"}
                        </div>
                      </Col>

                      <Col md={6}>
                        <label className="fw-semibold small text-muted">Codigo Especie</label>
                        <div
                          className={`rounded border px-3 py-1 ${isDarkMode ? "bg-dark border-secondary text-light" : "bg-light border-muted text-dark"}`}
                        >
                          {fila.esP_CODIGO || "Sin Información"}
                        </div>
                      </Col>
                      <Col md={12}>
                        <label className="fw-semibold small text-muted">Especie</label>
                        <div
                          className={`rounded border px-3 py-1 ${isDarkMode ? "bg-dark border-secondary text-light" : "bg-light border-muted text-dark"}`}
                        >
                          {fila.esP_NOMBRE || "Sin Información"}
                        </div>
                      </Col>
                      <Col md={12}>
                        <label className="fw-semibold small text-muted">Estado</label>
                        <div
                          className={`rounded border px-3 py-1 ${isDarkMode ? "bg-dark border-secondary text-light" : "bg-light border-muted text-dark"}`}
                        >
                          {fila.paS_ESTADO_AF || "No definida"}
                        </div>
                      </Col>
                    </Row>
                  </div>
                </Col>

                {/* Origen y Destino */}
                <Col lg={6}>
                  <div className={`border rounded-3 p-1 h-100 ${isDarkMode ? "border-secondary" : ""}`}>
                    <h5 className="fw-semibold mb-3 pb-1 border-bottom">Establecimiento</h5>
                    <Row className="g-1">
                      <Col md={12} className="mb-1 border-bottom p-1">
                        <div className="mb-3">
                          <label className="fw-semibold small d-flex align-items-center mb-1">
                            <GeoFill className="me-2 text-success" width={15} height={15} aria-hidden="true" />
                            Destino
                          </label>
                          <div
                            className={`rounded border px-3 py-2 ${isDarkMode ? "bg-dark border-secondary text-light" : "bg-light border-muted text-dark"}`}
                          >
                            <p className="fs-05em text-start">  {fila.establecimientO_DESTINO || "Sin Información"}</p>
                          </div>
                        </div>
                        <div>
                          <label className="fw-semibold small text-muted">Servicio/Dependencia Destino</label>
                          <div
                            className={`rounded border px-3 py-2 ${isDarkMode ? "bg-dark border-secondary text-light" : "bg-light border-muted text-dark"}`}
                          >
                            <p className="fs-05em text-start">  {fila.seR_NOMBRE_DESTINO + " " + fila.deP_NOMBRE_DESTINO || "Sin Información"}</p>
                          </div>
                        </div>
                      </Col>
                      <Col md={12} className="mb-1 p-1">
                        <div className="mb-3">
                          <label className="fw-semibold small d-flex align-items-center mb-1">
                            <GeoFill className="me-2 text-warning" width={15} height={15} aria-hidden="true" />
                            Origen
                          </label>
                          <div
                            className={`rounded border px-3 py-2 ${isDarkMode ? "bg-dark border-secondary text-light" : "bg-light border-muted text-dark"}`}
                          >
                            <p className="fs-05em text-start">  {fila.establecimientO_ORIGEN || "Sin Información"}</p>
                          </div>
                        </div>
                        <div>
                          <label className="fw-semibold small text-muted">Servicio/Dependencia Origen</label>
                          <div
                            className={`rounded border px-3 py-2 ${isDarkMode ? "bg-dark border-secondary text-light" : "bg-light border-muted text-dark"}`}
                          >
                            <p className="fs-05em text-start">  {fila.seR_NOMBRE_ORIGEN + " " + fila.deP_NOMBRE_ORIGEN || "Sin Información"}</p>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </div>
                </Col>

                {/* Observaciones */}
                <Col lg={12}>
                  <div className={`border rounded-3 p-2 ${isDarkMode ? "border-secondary" : ""}`}>
                    <label className="fw-semibold mb-2">Observaciones</label>
                    <div
                      className={`rounded border px-3 py-2 ${isDarkMode ? "bg-dark border-secondary text-light" : "bg-light border-muted text-dark"}`}
                      style={{ whiteSpace: "pre-wrap", minHeight: "80px" }}
                    >
                      {fila.paS_OBS || "Sin observaciones"}
                    </div>
                  </div>
                </Col>

                {/* Recepción y Validación */}
                <Col lg={6}>
                  <div className={`border rounded-3 p-3 ${isDarkMode ? "border-secondary" : ""}`}>
                    <h5 className="fw-semibold mb-3 pb-1 border-bottom">Recepción</h5>
                    <div className="mb-1">
                      <label className="fw-semibold small">Entregado Por</label>
                      <p className="d-flex align-items-center mb-0">
                        {fila.paS_NOM_ENTREGA || "Sin Información"}
                        <Check2Circle className="mx-1 text-success flex-shrink-0" aria-hidden="true" />
                      </p>

                    </div>
                    <div className="mb-1">
                      <label className="fw-semibold small">Recibido Por</label>
                      <p className="d-flex align-items-center mb-0">
                        {objeto?.Nombre && PrimeraMayuscula(objeto.Nombre)}{" "}{objeto?.Apellido1 && PrimeraMayuscula(objeto.Apellido1)}
                        <Check2Circle className="mx-1 text-success flex-shrink-0" aria-hidden="true" />
                      </p>
                    </div>
                    <div>
                      <label className="fw-semibold small">Jefe que Autoriza</label>
                      <p className="d-flex align-items-center mb-0">
                        {fila.paS_NOM_AUTORIZA || "Sin Información"}
                        <Check2Circle className="mx-1 text-success flex-shrink-0 fs-bold" aria-hidden="true" />
                      </p>
                    </div>
                  </div>


                </Col>

                {/* Documentos */}
                <Col lg={6}>
                  {listadoTraspasosAdjuntos.length > 0 ? (
                    <div className={`border rounded-3 p-3 h-100 ${isDarkMode ? "border-secondary" : ""}`}>
                      <h5 className="fw-semibold mb-3 pb-1 border-bottom">Documentos</h5>
                      {loadingAdjuntos ? (
                        <>
                          Cargando documentos...
                          <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                            className="ms-2"
                          />
                        </>
                      ) : (
                        <div className="table-responsive">
                          <table className={`table table-sm mb-0 ${isDarkMode ? "table-dark" : "table-hover"}`}>
                            <thead className={isDarkMode ? "table-dark" : "table-light"}>
                              <tr>
                                <th scope="col">Nombre</th>
                                <th scope="col" className="text-center" style={{ width: "100px" }}>
                                  Descargar
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {elementosActualesAdj.map((Lista, index) => {
                                const indexReal = indicePrimerElementoAdj + index
                                return (
                                  <tr key={indexReal}>
                                    <td>{Lista.nombre}</td>
                                    <td className="text-center">
                                      <Button
                                        size="sm"
                                        variant={isDarkMode ? "outline-light" : "outline-primary"}
                                        onClick={() => handleDescargarAdjunto(Lista)}
                                      >
                                        <Download className="h-4 w-4" aria-hidden="true" />
                                      </Button>
                                    </td>
                                  </tr>
                                )
                              })}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  ) : (
                    <>
                      <p className={`text-center  pt-1 pb-1 mb-1 rounded border-0 fs-09em fw-semibold ${isDarkMode ? 'bg-dark text-light border border-secondary' : 'bg-light text-muted border'}`}>
                        Sin documentos adjuntos
                      </p>
                    </>
                  )}
                </Col>
              </Row>
            </Modal.Body>
          </Modal>
        ))
      }

    </Layout >
  );
};

const mapStateToProps = (state: RootState) => ({
  listadoTraspasos: state.listadoTraspasosReducers.listadoTraspasos,
  listadoTraspasosRecibidos: state.listadoTraspasosRecibidosReducers.listadoTraspasosRecibidos,
  listadoTraspasosAdjuntos: state.listadoTraspasosAdjuntosReducers.listadoTraspasosAdjuntos,
  token: state.loginReducer.token,
  isDarkMode: state.darkModeReducer.isDarkMode,
  comboServicio: state.comboServicioReducer.comboServicio,
  objeto: state.validaApiLoginReducers,
});

export default connect(mapStateToProps, {
  listadoTraspasosEnviadosActions,
  listadoTraspasosRecibidosActions,
  registrarMantenedorDependenciasActions,
  recibeTraspasoActions,
  limpiarDataActions,
  obtenerAdjuntosActions
})(ListadoTraspasos);

