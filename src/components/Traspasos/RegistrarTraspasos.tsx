import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Row, Col, Collapse, OverlayTrigger, Tooltip, Button, Spinner, Pagination, Modal, Form, CloseButton, ModalDialog } from "react-bootstrap";
import { connect } from "react-redux";
import Layout from "../../containers/hocs/layout/Layout";
import { RootState } from "../../store";
import { CaretDown, CaretUpFill, Eraser, Eye, FiletypePdf, Paperclip, Plus, Search, Send, Trash } from "react-bootstrap-icons";
import "../../styles/Traslados.css"
import Swal from "sweetalert2";
import { Objeto } from "../Navegacion/Profile";
import { Helmet } from "react-helmet-async";
import Select from "react-select";
import SkeletonLoader from "../Utils/SkeletonLoader";
import MenuTraspasos from "../Menus/MenuTraspasos";
import Draggable from "react-draggable";
import { useNavigate } from "react-router-dom";
import { BlobProvider } from "@react-pdf/renderer";
import DocumentoPDFResumenTraspaso from "./DocumentoPDFResumenTraspaso";
import { comboEstablecimientoActions } from "../../redux/actions/Traslados/Combos/comboEstablecimientoActions";
import { comboTrasladoServicioActions } from "../../redux/actions/Traslados/Combos/comboTrasladoServicioActions";
import { comboTrasladoEspecieActions } from "../../redux/actions/Traslados/Combos/comboTrasladoEspecieActions";
import { comboDependenciaDestinoActions } from "../../redux/actions/Traslados/Combos/comboDependenciaDestinoActions";
import { listadoDeEspeciesBienActions } from "../../redux/actions/Inventario/Combos/listadoDeEspeciesBienActions";
import { comboEspeciesBienActions } from "../../redux/actions/Inventario/Combos/comboEspeciesBienActions";
import { comboDependenciaOrigenActions } from "../../redux/actions/Traslados/Combos/comboDependenciaoOrigenActions";
import { registroTraspasoMultipleActions } from "../../redux/actions/Traspasos/registroTraspasoMultipleActions";
import { comboSerDepActions } from "../../redux/actions/Inventario/ModificarInventario/comboSerDepActions";
import { listadoTraspasosRecibidosActions } from "../../redux/actions/Traspasos/listadoTraspasosRecibidosActions";
import { listadoTraspasosEnviadosActions } from "../../redux/actions/Traspasos/listadoTraspasosEnviadosActions";
import { obtenerInventarioTraspasoActions } from "../../redux/actions/Traspasos/obtenerInventarioTraspasoActions";

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

/*----Props General---*/
export interface PropsTraspasos {
    // Activo
    aF_CLAVE: number;
    aF_CODIGO_GENERICO: string;
    esP_NOMBRE: string;

    // Detalle Activo
    deT_OBS: string;
    deT_MARCA: string;
    deT_MODELO: string;
    deT_SERIE: string;
    altaS_CORR?: number;

    // Traspaso
    n_TRASPASO: number;
    paS_FECHA: string;
    paS_MEMO_REF: string;
    paS_FECHA_MEMO: string;
    paS_OBS: string;
    paS_NOM_ENTREGA?: string;
    paS_NOM_RECIBE?: string;
    paS_NOM_AUTORIZA?: string;
    paS_ESTADO_AF: string;

    // Ubicación Origen
    estabL_CORR_ORIGEN?: number;
    seR_NOMBRE_ORIGEN: string;
    deP_CORR_ORIGEN: number;
    deP_NOMBRE_ORIGEN: string;

    // Ubicación Destino
    estabL_CORR?: number;
    seR_NOMBRE_DESTINO: string;
    deP_CORR?: number;
    deP_NOMBRE_DESTINO: string;

    // Auxiliar
    serviciO_DEPENDENCIA: string;
    serviciO_DEPENDENCIA_DESTINO: string;
}

interface ListaEspecie {
    estabL_CORR: number;
    esP_CODIGO: string;
    nombrE_ESP: string;
}


interface SERVICIO_DEPENDENCIA {
    deP_CORR: number;
    descripcion: string;
}
export interface TraspasoConAdjuntos {
    Entidad: any[];
    Adjuntos: any[];
}

interface PropsGeneral {
    registroTraspasoMultipleActions: (FormularioTraspaso: TraspasoConAdjuntos) => Promise<boolean>
    comboTrasladoServicio: TRASLADOSERVICIO[];
    comboTrasladoServicioActions: (establ_corr: number) => void;
    comboEstablecimiento: ESTABLECIMIENTO[];
    comboEstablecimientoActions: (establ_corr: number) => void;
    comboTrasladoEspecie: TRASLADOESPECIE[];
    comboTrasladoEspecieActions: (establ_corr: number) => void;
    comboDependenciaOrigen: SERVICIO_DEPENDENCIA[];
    comboDependenciaDestino: SERVICIO_DEPENDENCIA[];
    comboDependenciaOrigenActions: (comboServicioOrigen: string) => void; // Nueva prop para pasar el servicio seleccionado
    comboDependenciaDestinoActions: (comboServicioDestino: string) => void; // Nueva prop para pasar el servicio seleccionado 
    obtenerInventarioTraspasoActions: (aF_CODIGO_GENERICO: string, altaS_CORR: number, esP_CODIGO: string, deP_CORR: number, deT_MARCA: string, deT_MODELO: string, deT_SERIE: string, estabL_CORR: number) => Promise<boolean>
    listadoTraspasosEnviadosActions: (fDesde: string, fHasta: string, af_codigo_generico: string, tras_corr: number, establ_corr: number, usuario_crea: number, pas_estado_recibe: string) => Promise<boolean>;
    listadoTraspasosRecibidosActions: (fDesde: string, fHasta: string, af_codigo_generico: string, tras_corr: number, establ_corr: number, usuario_crea: number, pas_estado_recibe: string) => Promise<boolean>;
    listaTraspasoSeleccion: PropsTraspasos[];
    comboEspecies: ListaEspecie[];
    comboSerDepActions: (establ_corr: number) => void;//En buscador  
    comboEspeciesBienActions: (EST: number, IDBIEN: number) => Promise<boolean>; //Carga Combo Especie
    comboSerDep: SERVICIO_DEPENDENCIA[];
    token: string | null;
    isDarkMode: boolean;
    objeto: Objeto;
    listaSalidaTraspasos: PropsTraspasos[];
}


const RegistrarTraspasos: React.FC<PropsGeneral> = ({
    registroTraspasoMultipleActions,
    comboSerDepActions,
    comboTrasladoServicioActions,
    comboEstablecimientoActions,
    comboTrasladoEspecieActions,
    comboDependenciaOrigenActions,
    comboDependenciaDestinoActions,
    obtenerInventarioTraspasoActions,
    comboEspeciesBienActions,
    listadoTraspasosEnviadosActions,
    listadoTraspasosRecibidosActions,
    comboTrasladoServicio,
    comboEstablecimiento,
    comboTrasladoEspecie,
    comboDependenciaOrigen,
    comboEspecies,
    comboSerDep,
    listaTraspasoSeleccion,
    listaSalidaTraspasos,
    objeto,
    token,
    isDarkMode }) => {
    const [loading, setLoading] = useState(false); // Estado para controlar la carga
    const [loadingBuscar, setLoadingBuscar] = useState(false); // Estado para controlar la carga
    const [error, setError] = useState<Partial<PropsTraspasos> & {}>({});
    const [mostrarModal, setMostrarModal] = useState(false);
    const [mostrarModalTraslado, setMostrarModalTraslado] = useState(false);
    const [mostrarModalResumen, setMostrarModalResumen] = useState(false);
    const [modalMostrarExportar, setModalMostrarExportar] = useState(false);
    const [loadingExportar, setLoadingExportar] = useState(false);
    const [paginaActual, setPaginaActual] = useState(1);
    const [paginaActual1, setPaginaActual1] = useState(1);
    const [paginaActual2, setPaginaActual2] = useState(1);
    const [filasSeleccionadas, setFilasSeleccionadas] = useState<string[]>([]);
    const [filasSeleccionadasTraslados, setFilasSeleccionadasTraslados] = useState<string[]>([]);
    const [activosFijos, setActivosFijos] = useState<PropsTraspasos[]>([]);
    const navigate = useNavigate();
    const [Paginacion, setPaginacion] = useState({
        nPaginacion: 10
    });
    const elementosPorPagina = Paginacion.nPaginacion;

    const [Paginacion1, setPaginacion1] = useState({
        nPaginacion1: 10
    });
    const elementosPorPagina1 = Paginacion1.nPaginacion1;

    const [Paginacion2, setPaginacion2] = useState({
        nPaginacion2: 10
    });
    const elementosPorPagina2 = Paginacion2.nPaginacion2;

    const [Buscar, setBuscar] = useState({
        aF_CODIGO_GENERICO: "",
        altaS_CORR: 0,
        seR_CORR: "",
        deP_CORR_ORIGEN: 0,
        esP_CODIGO: "",
        marca: "",
        modelo: "",
        serie: ""
    });

    //Primera Letra en mayúscula
    const PrimeraMayuscula = (str: string) =>
        str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

    const [Traspasos, setTraspasos] = useState({
        usuario_crea: objeto.IdCredencial.toString(),
        deP_CORR: 0, //Dependencia Destino
        traS_CO_REAL: 0,
        paS_MEMO_REF: "",
        paS_FECHA_MEMO: "",
        paS_OBS: "",
        paS_NOM_ENTREGA: PrimeraMayuscula(objeto.Nombre).trim() + " " + PrimeraMayuscula(objeto.Apellido1).trim(),
        // paS_NOM_RECIBE: "",
        paS_NOM_AUTORIZA: "",
        estabL_CORR: 0 //Establecimiento Destino
    });

    const [anexos, setAnexos] = useState<File[]>([]);
    const [_, setNombreDocumento] = useState<string>("");

    const inputRef = useRef<HTMLInputElement>(null);

    const handleFileInput = () => {
        inputRef.current?.click();
    };

    const handleChangeFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const nuevosArchivos = Array.from(e.target.files);

            setAnexos((prev) => {
                const nombresPrevios = new Set(prev.map((file) => file.name));
                const archivosFiltrados = nuevosArchivos.filter((file) => !nombresPrevios.has(file.name));
                return [...prev, ...archivosFiltrados];
            });
        }
    };

    const convertirArchivosABase64 = async (archivos: File[]): Promise<{ nombre: string, contenido: string }[]> => {
        const resultado: { nombre: string, contenido: string }[] = [];

        for (const archivo of archivos) {
            const contenido = await new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve((reader.result as string).split(",")[1]);
                reader.onerror = reject;
                reader.readAsDataURL(archivo);
            });

            resultado.push({
                nombre: archivo.name,
                contenido
            });

            setNombreDocumento(archivo.name);//Guardo el nombre del documento adjunto
            // console.log("archivo.name", archivo.name);
        }

        return resultado;
    };

    const especieOptions = comboEspecies.map((item) => ({
        value: item.esP_CODIGO,
        label: item.nombrE_ESP,
    }));

    const handleComboEspecieChange = (selectedOption: any) => {
        const value = selectedOption ? selectedOption.value : "";
        setBuscar((prev) => ({ ...prev, esP_CODIGO: value }));
    };

    const servicioFormOptions = comboSerDep.map((item) => ({
        value: item.deP_CORR,
        label: item.descripcion,
    }));

    const handleServicioFormChange = (selectedOption: any) => {
        const value = selectedOption ? selectedOption.value : 0;
        setTraspasos((prevInventario) => ({ ...prevInventario, deP_CORR: value }));
    };

    const validateForm = () => {
        let tempErrors: Partial<any> & {} = {};
        if (!Traspasos.deP_CORR) tempErrors.deP_CORR = "Campo obligatorio.";
        if (!Traspasos.paS_OBS) tempErrors.paS_OBS = "Campo obligatorio.";
        if (!Traspasos.paS_MEMO_REF) tempErrors.paS_MEMO_REF = "Campo obligatorio.";
        if (!Traspasos.paS_FECHA_MEMO) tempErrors.paS_FECHA_MEMO = "Campo obligatorio.";
        if (!Traspasos.paS_NOM_ENTREGA) tempErrors.paS_NOM_ENTREGA = "Campo obligatorio.";
        // if (!Traspasos.paS_NOM_RECIBE) tempErrors.paS_NOM_RECIBE = "Campo obligatorio.";
        if (!Traspasos.paS_NOM_AUTORIZA) tempErrors.paS_NOM_AUTORIZA = "Campo obligatorio.";
        if (!Traspasos.estabL_CORR) tempErrors.estabL_CORR = "Campo obligatorio.";
        setError(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    useEffect(() => {
        if (token) {
            // Verifica si las acciones ya fueron disparadas
            if (comboTrasladoServicio.length === 0) comboTrasladoServicioActions(objeto.Roles[0].codigoEstablecimiento);
            if (comboEstablecimiento.length === 0) comboEstablecimientoActions(objeto.Roles[0].codigoEstablecimiento);
            if (comboTrasladoEspecie.length === 0) comboTrasladoEspecieActions(objeto.Roles[0].codigoEstablecimiento);
            if (comboEspecies.length === 0) comboEspeciesBienActions(objeto.Roles[0].codigoEstablecimiento, 0);

        }
    }, [comboTrasladoServicioActions,
        comboEstablecimientoActions,
        comboTrasladoEspecieActions,
        comboEspecies]);

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        // Validación específica para af_codigo_generico: solo permitir números
        if (name === "aF_CODIGO_GENERICO" && !/^[0-9]*$/.test(value) || (name === "altaS_CORR" && !/^[0-9]*$/.test(value))) {
            return; // Salir si contiene caracteres no numéricos
        }
        // Convierte `value` a número
        let newValue: string | number = ["deP_CORR_ORIGEN", "deP_CORR", "n_TRASLADO", "seR_CORR", "estabL_CORR"].includes(name)
            ? parseFloat(value) || 0 // Convierte a `number`, si no es válido usa 0
            : value;

        setBuscar((prev) => ({
            ...prev,
            [name]: newValue,
        }));

        setTraspasos((prev) => ({
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

        setPaginacion2((prevState) => ({
            ...prevState,
            [name]: value,
        }));


        if (name === "nPaginacion") {
            paginar1(1);
        }

        if (name === "nPaginacion1") {
            paginar1(1);
        }

        if (name === "nPaginacion2") {
            paginar1(1);
        }


        if (name === "seR_CORR") {
            comboDependenciaOrigenActions(value);
        }

        if (name === "paS_DET_CORR") {
            comboDependenciaDestinoActions(value);
        }

        if (name === "estabL_CORR") {
            comboSerDepActions(parseInt(value));
        }
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
            altaS_CORR: 0,
            seR_CORR: "",
            deP_CORR_ORIGEN: 0,
            esP_CODIGO: "",
            marca: "",
            modelo: "",
            serie: ""
        }));
    }

    const handleLimpiarFormulario = () => {
        setTraspasos((prev) => ({
            ...prev,
            deP_CORR: 0,
            traS_CO_REAL: 0,
            paS_MEMO_REF: "",
            paS_FECHA_MEMO: "",
            paS_OBS: "",
            // paS_NOM_ENTREGA: "",
            // paS_NOM_RECIBE: "",
            paS_NOM_AUTORIZA: "",
            estabL_CORR_D: 0
        }));
    }

    const handleBuscar = async (e: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLInputElement>) => {
        let resultado = false;
        e.preventDefault();
        setLoadingBuscar(true); // Inicia el estado de carga
        if (Buscar.aF_CODIGO_GENERICO.trim() === "" &&
            Buscar.altaS_CORR === 0 &&
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
                confirmButtonColor: `${isDarkMode ? "#6c757d" : "#0d6efd"}`,
                customClass: {
                    popup: "custom-border",
                }
            });
            setLoadingBuscar(false);
            return;
        }


        resultado = await obtenerInventarioTraspasoActions(Buscar.aF_CODIGO_GENERICO, Buscar.altaS_CORR, Buscar.esP_CODIGO, Buscar.deP_CORR_ORIGEN, Buscar.marca, Buscar.modelo, Buscar.serie, objeto.Roles[0].codigoEstablecimiento);

        if (!resultado) {
            Swal.fire({
                icon: "warning",
                title: "Sin Resultados",
                text: "No hay registros disponibles para mostrar.",
                background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
                color: `${isDarkMode ? "#ffffff" : "000000"}`,
                confirmButtonColor: `${isDarkMode ? "#6c757d" : "#0d6efd"}`,
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

    //Se agrega datos especificos para luego pasar al envio (handleSubmitTraspaso)
    const handleAgregarSeleccionados = async () => {
        const selectedIndices = filasSeleccionadas.map(Number);
        const activosSeleccionados = selectedIndices.map((index) => {
            const item = listaTraspasoSeleccion[index];
            return {
                aF_CLAVE: item.aF_CLAVE,
                aF_CODIGO_GENERICO: item.aF_CODIGO_GENERICO,
                esP_NOMBRE: item.esP_NOMBRE,
                deT_MARCA: item.deT_MARCA,
                deT_MODELO: item.deT_MODELO,
                deT_SERIE: item.deT_SERIE,
                deT_OBS: item.deT_OBS,
                deP_CORR_ORIGEN: item.deP_CORR_ORIGEN,
                serviciO_DEPENDENCIA: item.serviciO_DEPENDENCIA,
            } as PropsTraspasos;
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
            confirmButtonColor: `${isDarkMode ? "#6c757d" : "#0d6efd"}`,
            customClass: {
                popup: "custom-border", // Clase personalizada para el borde
            }
        });
        console.log(activosSeleccionados);
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
                    confirmButtonColor: `${isDarkMode ? "#6c757d" : "#0d6efd"}`,
                    width: '600px',
                    customClass: {
                        popup: "custom-border",
                    }
                });
                setFilasSeleccionadas([]);
                return;
            } else {
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

    const handleSubmitTraspaso = async () => {
        if (validateForm()) {
            const result = await Swal.fire({
                icon: "info",
                title: "Confirmar Traspaso",
                text: "¿Confirma que desea Traspasar los bienes seleccionados con los datos proporcionados?",
                showCancelButton: true,
                confirmButtonText: "Confirmar y Traspasar",
                background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
                color: `${isDarkMode ? "#ffffff" : "000000"}`,
                confirmButtonColor: `${isDarkMode ? "#6c757d" : "#0d6efd"}`,
                customClass: {
                    popup: "custom-border", // Clase personalizada para el borde
                }
            });

            if (result.isConfirmed) {
                setMostrarModalTraslado(false);
                setLoading(true);
                const anexosBase64 = await convertirArchivosABase64(anexos);

                const Entidad = activosFijos.map((item) => ({
                    aF_CLAVE: item.aF_CLAVE,
                    aF_CODIGO_GENERICO: item.aF_CODIGO_GENERICO,
                    paS_OBS: Traspasos.paS_OBS,
                    deP_CORR_ORIGEN: item.deP_CORR_ORIGEN,//Dependencia Origen
                    deP_CORR: Traspasos.deP_CORR, //dependencia Destino 
                    usuariO_CREA: objeto.IdCredencial.toString(),
                    // traS_CO_REAL: Traspasos.traS_CO_REAL,
                    paS_MEMO_REF: Traspasos.paS_MEMO_REF,
                    paS_FECHA_MEMO: Traspasos.paS_FECHA_MEMO,
                    paS_NOM_ENTREGA: Traspasos.paS_NOM_ENTREGA,
                    // paS_NOM_RECIBE: Traspasos.paS_NOM_RECIBE,
                    paS_NOM_AUTORIZA: Traspasos.paS_NOM_AUTORIZA,
                    estabL_CORR_ORIGEN: objeto.Roles[0].codigoEstablecimiento, //establecimiento de origen
                    estabL_CORR: Traspasos.estabL_CORR, //establecimiento de destino
                    serviciO_DEPENDENCIA: item.serviciO_DEPENDENCIA.toUpperCase(), // nombre del servicio y la dependencia de origen
                    serviciO_DEPENDENCIA_DESTINO: comboSerDep.find(item => item.deP_CORR === Traspasos.deP_CORR)?.descripcion || "",
                    deT_MARCA: item.deT_MARCA,
                    deT_MODELO: item.deT_MODELO,
                    deT_SERIE: item.deT_SERIE,
                    deT_OBS: item.deT_OBS,
                    esP_NOMBRE: item.esP_NOMBRE
                }));

                const Adjuntos = anexosBase64.map((anexo) => ({
                    nombre: anexo.nombre,
                    contenido: anexo.contenido
                }));

                const TraspasoConAdjuntos = {
                    Entidad,
                    Adjuntos
                };
                console.log("TraspasoconAdjuntos", TraspasoConAdjuntos.Entidad);
                const resultado = await registroTraspasoMultipleActions(TraspasoConAdjuntos);
                if (resultado) {
                    mostrarAlerta();
                    listadoTraspasosRecibidosActions("", "", "", 0, objeto.Roles[0].codigoEstablecimiento, objeto.IdCredencial, "");
                    listadoTraspasosEnviadosActions("", "", "", 0, objeto.Roles[0].codigoEstablecimiento, objeto.IdCredencial, "");
                    handleLimpiar();
                    handleLimpiarFormulario();
                    setFilasSeleccionadas([]);
                    setFilasSeleccionadasTraslados([]);
                    setActivosFijos([]);
                    anexos.splice(0, anexos.length);
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: "Ocurrió un problema al intentar Traspasar los activos.",
                        background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
                        color: `${isDarkMode ? "#ffffff" : "000000"}`,
                        confirmButtonColor: `${isDarkMode ? "#6c757d" : "#0d6efd"}`,
                        customClass: { popup: "custom-border" }
                    });
                }

                setLoading(false);
            }
        }
    };

    const mostrarAlerta = () => {
        document.body.style.overflow = "hidden"; // Evita que el fondo se desplace       
        Swal.fire({
            icon: "success",
            title: "Registro Exitoso",
            text: `Se han registrado correctamente los trapasos seleccionados, Presione "OK" para visualizar un resumen de los datos ingresados.`,
            background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
            color: `${isDarkMode ? "#ffffff" : "000000"}`,
            confirmButtonColor: `${isDarkMode ? "#6c757d" : "#0d6efd"}`,
            customClass: { popup: "custom-border" },
            allowOutsideClick: false,
            showCancelButton: false, // Agrega un segundo botón
            cancelButtonText: "Cerrar", // Texto del botón
            willClose: () => {
                document.body.style.overflow = "auto"; // Restaura el scroll
            }

        }).then((result) => {
            if (result.isConfirmed) {
                setMostrarModalResumen(true);
            }
        });
    };

    const handleCerrarModal = () => {
        setMostrarModal(false);
        if (mostrarModal) {
            Swal.fire({
                icon: "info",
                title: "Limpiar Filtros",
                text: "¿Desea limpiar los filtros para iniciar una nueva búsqueda?",
                background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
                color: `${isDarkMode ? "#ffffff" : "000000"}`,
                confirmButtonColor: `${isDarkMode ? "#6c757d" : "#0d6efd"}`,
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
                        altaS_CORR: 0,
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

    const handleAbrirModalExportar = () => {
        setLoadingExportar(true);
        // Espera un ciclo de evento para mostrar el modal
        setTimeout(() => {
            setModalMostrarExportar(true);
        }, 50); //se ajusta este tiempo para que cargue de inmediato
    };

    const formatearFecha = (fecha: string) => {
        if (!fecha) return "";
        const [anio, mes, dia] = fecha.split("T")[0].split("-");
        return `${dia}/${mes}/${anio}`;
    };

    // const handleSeguimiento = () => {
    //     navigate("/Traspaso/FirmarAltas", {
    //         state: { prop_altaS_CORR: listaSalidaTraspasos[0]?.n_TRASPASO }
    //     });
    // }
    /*-----------------------Tabla Resultado de busqueda----------------------*/
    // Lógica de Paginación actualizada 
    const indiceUltimoElemento = paginaActual * elementosPorPagina;
    const indicePrimerElemento = indiceUltimoElemento - elementosPorPagina;
    const elementosActuales = useMemo(
        () => listaTraspasoSeleccion.slice(indicePrimerElemento, indiceUltimoElemento),
        [listaTraspasoSeleccion, indicePrimerElemento, indiceUltimoElemento]);

    const totalPaginas = Array.isArray(listaTraspasoSeleccion)
        ? Math.ceil(listaTraspasoSeleccion.length / elementosPorPagina) : 0;
    const paginar = (numeroPagina: number) => setPaginaActual(numeroPagina);

    /*-----------------------Tabla Selecciones a Traspasar----------------------*/

    // Lógica de Paginación actualizada 
    const indiceUltimoElemento1 = paginaActual1 * elementosPorPagina1;
    const indicePrimerElemento1 = indiceUltimoElemento1 - elementosPorPagina1;
    const elementosActuales1 = useMemo(
        () => activosFijos.slice(indicePrimerElemento1, indiceUltimoElemento1),
        [activosFijos, indicePrimerElemento1, indiceUltimoElemento1]);

    const totalPaginas1 = Array.isArray(activosFijos)
        ? Math.ceil(activosFijos.length / elementosPorPagina1) : 0;
    const paginar1 = (numeroPagina1: number) => setPaginaActual1(numeroPagina1);

    /*-----------------------Tabla resumen----------------------*/

    // Lógica de Paginación actualizada 
    const indiceUltimoElemento2 = paginaActual2 * elementosPorPagina2;
    const indicePrimerElemento2 = indiceUltimoElemento2 - elementosPorPagina2;
    const elementosActuales2 = useMemo(
        () => listaSalidaTraspasos.slice(indicePrimerElemento2, indiceUltimoElemento2),
        [listaSalidaTraspasos, indicePrimerElemento2, indiceUltimoElemento2]);

    const totalPaginas2 = Array.isArray(listaSalidaTraspasos)
        ? Math.ceil(listaSalidaTraspasos.length / elementosPorPagina2) : 0;
    const paginar2 = (numeroPagina2: number) => setPaginaActual2(numeroPagina2);

    return (
        <Layout>
            <Helmet>
                <title>Registrar Traspasos</title>
            </Helmet>
            <MenuTraspasos />
            <div className="table-responsive position-relative z-0 hide-scrollbar" >
                <div style={{ maxHeight: "80vh" }}>
                    <div className={`border p-2 rounded ${isDarkMode ? "darkModePrincipal border-secondary" : ""}`}>
                        <h3 className="form-title fw-semibold border-bottom p-1">Registrar Traspasos</h3>
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
                                                    onKeyDown={(e) => {
                                                        if (e.key === "Enter") {
                                                            handleBuscar(e);
                                                        }
                                                    }}
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
                                        <div className="ms-1">
                                            <label className="fw-semibold">
                                                Nº Alta
                                            </label>
                                            <input
                                                aria-label="altaS_CORR"
                                                type="text"
                                                className={`form-control ${isDarkMode ? "bg-dark text-light border-secondary" : ""}`}
                                                maxLength={10}
                                                name="altaS_CORR"
                                                placeholder="0"
                                                onChange={handleChange}
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter") {
                                                        handleBuscar(e);
                                                    }
                                                }}
                                                value={Buscar.altaS_CORR}
                                            />
                                        </div>
                                        {/* servicio */}
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
                                                        key={traeDependencia.deP_CORR}
                                                        value={traeDependencia.deP_CORR}
                                                    >
                                                        {traeDependencia.descripcion}
                                                    </option>
                                                ))}
                                            </select>

                                        </div>
                                    </Col>
                                    <Col md={4}>
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
                                                    value={especieOptions.find(option => option.value === Buscar.esP_CODIGO) || null}

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
                                                            height: 100
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
                                        {/* Marca */}
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
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter") {
                                                        handleBuscar(e);
                                                    }
                                                }}
                                                value={Buscar.marca}
                                            />
                                        </div>
                                        {/* Modelo */}
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
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter") {
                                                        handleBuscar(e);
                                                    }
                                                }}
                                                value={Buscar.modelo}
                                            />
                                        </div>
                                        {/* Serie */}
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
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter") {
                                                        handleBuscar(e);
                                                    }
                                                }}
                                                value={Buscar.serie}
                                            />
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                        </Collapse>
                    </div>
                    {activosFijos.length === 0 ? (
                        <Row className="p-1 row justify-content-center ">
                            <Col md={8}>
                                <p className={`text-center m-2 px-5 pt-1 pb-1 rounded border-0 fs-09em fw-semibold ${isDarkMode ? 'bg-dark text-light border border-secondary' : 'bg-light text-muted border'}`}>
                                    Seleccione artículos de la búsqueda para incluirlos aquí
                                </p>
                            </Col>
                        </Row>
                    ) : (
                        <div className={`border p-4 rounded ${isDarkMode ? "darkModePrincipal border-secondary" : ""}`}>
                            <div className={`d-flex justify-content-between align-items-center  border-bottom  ${isDarkMode ? "bg-transparent text-light" : ""}`} onClick={() => toggleRow("fila2")}>
                                <h5 className="fw-semibold">LISTADO A TRASPASAR</h5>
                            </div>
                            <Row className="p-1 row justify-content-center ">
                                <Col md={8}>
                                    <Row className="g-2 align-items-center flex-column flex-lg-row justify-content-between">
                                        {/* Tamaño de página */}
                                        <Col xs={12} lg="auto">
                                            {listaTraspasoSeleccion.length > 10 && (
                                                <div className="d-flex align-items-center justify-content-center justify-content-lg-start">
                                                    <label htmlFor="nPaginacion1" className="form-label fw-semibold mb-0 me-2">
                                                        Tamaño de página:
                                                    </label>
                                                    <select
                                                        aria-label="Seleccionar tamaño de página"
                                                        className={`form-select form-select-sm w-auto ${isDarkMode ? "bg-dark text-light border-secondary" : ""}`}
                                                        name="nPaginacion1"
                                                        onChange={handleChange}
                                                        value={Paginacion1.nPaginacion1}
                                                    >
                                                        {[10, 15, 20, 25, 50, 100].map((val) => (
                                                            <option key={val} value={val}>{val}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            )}
                                        </Col>

                                        {/* Botón o mensaje */}
                                        <Col xs={12} lg={3}>
                                            <div className="d-flex flex-column flex-sm-row justify-content-center justify-content-lg-end align-items-stretch">
                                                {filasSeleccionadasTraslados.length > 0 && (
                                                    <Button
                                                        variant="danger"
                                                        onClick={handleQuitarSeleccionados}
                                                        className="p-2 mb-2 mb-sm-0 mx-sm-1 w-100 d-flex align-items-center justify-content-center"
                                                    >
                                                        Quitar
                                                        <span className="badge bg-light text-dark mx-1 mt-1">
                                                            {filasSeleccionadasTraslados.length}
                                                        </span>
                                                    </Button>
                                                )}

                                                {/* Botón Traspasar */}

                                                <Button
                                                    variant="warning"
                                                    onClick={() => setMostrarModalTraslado(true)}
                                                    className="p-2 mb-2 mb-sm-0 mx-sm-1 w-100 d-flex align-items-center justify-content-center"

                                                >
                                                    <Send className="flex-shrink-0 h-5 w-5 mx-1" aria-hidden="true" />
                                                    Traspasar
                                                    <span className="badge bg-light text-dark mx-1 mt-1">
                                                        {activosFijos.length}
                                                    </span>

                                                </Button>
                                            </div>
                                        </Col>
                                    </Row>

                                    <div className='table-responsive'>
                                        <table className={`table  ${isDarkMode ? "table-dark" : "table-hover table-striped "}`} >
                                            <thead className={`sticky-top z-0 ${isDarkMode ? "table-dark" : "text-dark table-light "}`}>
                                                <tr>
                                                    <th style={{ position: 'sticky', left: 0 }}>
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
                                                            <td className="text-center" style={{ position: 'sticky', left: 0 }}>
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
                                </Col>
                            </Row>
                        </div>
                    )}
                    {/* Modal lista seleccion traslados */}
                    {listaTraspasoSeleccion.length > 0 && (
                        <Modal show={mostrarModal} onHide={() => setMostrarModal(false)}
                            size="xl"
                            dialogClassName="draggable-modal"
                            // scrollable={false}
                            backdrop="static" // Evita que se cierre al hacer clic afuera
                            keyboard={false}

                        >
                            {/* Mensaje */}
                            <div className={`py-2 rounded fw-semibold fs-09em
                                  ${isDarkMode
                                    ? "bg-success text-light border border-secondary"
                                    : "bg-primary bg-opacity-10 text-primary border-none"
                                }`}
                            >
                                <p>Se han agregado <strong >{activosFijos.length}</strong> bienes. </p>

                            </div>
                            <Modal.Header className={`${isDarkMode ? "darkModePrincipal" : ""}`}>

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
                                <div className="bg-white shadow-sm sticky-top">
                                    <Row className={`${isDarkMode ? "darkModePrincipal" : ""}`}>
                                        <Col md={6}>
                                            {listaTraspasoSeleccion.length > 10 && (
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
                                                        {[10, 15, 20, 25, 50, 100].map((val) => (
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
                                                            <th style={{ position: 'sticky', left: 0 }}>
                                                                <Form.Check
                                                                    className="check-danger"
                                                                    type="checkbox"
                                                                    onChange={handleSeleccionaTodos}
                                                                    checked={filasSeleccionadas.length === elementosActuales.length && elementosActuales.length > 0}
                                                                />
                                                            </th>
                                                            <th scope="col" className="text-nowrap">Código</th>
                                                            <th scope="col" className="text-nowrap">Nº Inventario</th>
                                                            <th scope="col" className="text-nowrap">Nº Alta</th>
                                                            <th scope="col" className="text-nowrap">Descripción</th>
                                                            <th scope="col" className="text-nowrap">Dependencia	Serv/Depto</th>
                                                            <th scope="col" className="text-nowrap">Especie</th>
                                                            <th scope="col" className="text-nowrap">Marca</th>
                                                            <th scope="col" className="text-nowrap">Modelo</th>
                                                            <th scope="col" className="text-nowrap">Serie</th>
                                                            <th scope="col" className="text-nowrap">Código Dependencia</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {elementosActuales.map((lista, index) => {
                                                            const indexReal = indicePrimerElemento + index; // Índice real basado en la página
                                                            return (
                                                                <tr key={index}>
                                                                    <td style={{ position: 'sticky', left: 0 }}>
                                                                        <Form.Check
                                                                            type="checkbox"
                                                                            onChange={() => setSeleccionaFilas(indexReal)}
                                                                            checked={filasSeleccionadas.includes(indexReal.toString())}
                                                                        />
                                                                    </td>
                                                                    <td className="text-nowrap">{lista.aF_CLAVE}</td>
                                                                    <td className="text-nowrap">{lista.aF_CODIGO_GENERICO}</td>
                                                                    <td className="text-nowrap">{lista.altaS_CORR}</td>
                                                                    <td className="text-nowrap">{lista.deT_OBS}</td>
                                                                    <td className="text-nowrap">{lista.serviciO_DEPENDENCIA}</td>
                                                                    <td className="text-nowrap">{lista.esP_NOMBRE}</td>
                                                                    <td className="text-nowrap">{lista.deT_MARCA}</td>
                                                                    <td className="text-nowrap">{lista.deT_MODELO}</td>
                                                                    <td className="text-nowrap">{lista.deT_SERIE}</td>
                                                                    <td className="text-nowrap">{lista.deP_CORR_ORIGEN}</td>
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
                                <div className="paginador-container position-relative z-0">
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
                    )}
                </div>
            </div>
            {/* Formulario de traspasar */}
            < Modal show={mostrarModalTraslado} onHide={() => setMostrarModalTraslado(false)}
                size="lg"
                dialogClassName="modal-right"
                backdrop="static"
                keyboard={false}  // Evita el cierre al presionar la tecla Esc
            >
                <Modal.Header className={`bg-warning text-muted`} closeButton>
                    <Modal.Title className="fw-semibold">
                        <Send className={"flex-shrink-0 h-5 w-5 me-2 mb-1"} aria-hidden="true" />
                        Bienes a Traspasar
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className={`${isDarkMode ? "darkModePrincipal" : ""}`}>
                    <h5 className="fw-semibold">Ubicación del centro de destino</h5>
                    <div className={`d-flex flex-column flex-md-row align-items-center 
                           bg-light border-start border-4 border-warning shadow-sm rounded p-2 gap-2 mb-2`}>
                        <p className="fw-semibold  small text-dark">
                            Escoga su propio centro para traslados externos.
                        </p>
                    </div>

                    <form onSubmit={handleSubmitTraspaso}>
                        <Col >
                            <div className="d-flex flex-column flex-sm-row justify-content-end align-items-stretch">
                                {/* Botón Traspasar */}
                                <Button
                                    variant="warning"
                                    onClick={handleSubmitTraspaso}
                                    className="p-2 mb-2 mb-sm-0 mx-sm-1"
                                    disabled={anexos.length == 0}
                                >
                                    {loading ? (
                                        <>
                                            {`Un momento... `}
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
                                            <Send className="flex-shrink-0 h-5 w-5 mx-1" aria-hidden="true" />
                                            Traspasar
                                            <p className="badge bg-light text-muted ms-2 ">{activosFijos.length}</p>
                                        </>
                                    )}
                                </Button>
                                <Button
                                    variant="danger"
                                    onClick={handleLimpiarFormulario}
                                    className="p-2 mb-2 mb-sm-0 mx-sm-1"
                                >
                                    <Eraser className={"flex-shrink-0 h-5 w-5 mx-1"} aria-hidden="true" />
                                    Limpiar
                                </Button>
                            </div>
                        </Col>
                        <Row>
                            <Col md={6}>
                                <div className="mt-1">
                                    <label className="fw-semibold">Establecimiento</label>
                                    <select
                                        aria-label="establecimiento"
                                        className={`form-select ${isDarkMode ? "bg-dark text-light border-secondary" : ""} ${error.estabL_CORR ? "is-invalid" : ""}`}
                                        name="estabL_CORR"
                                        onChange={handleChange}
                                        value={Traspasos.estabL_CORR}
                                    >
                                        <option value="">Seleccionar</option>
                                        {comboEstablecimiento.map((traeDependencia) => (
                                            <option key={traeDependencia.codigo} value={traeDependencia.codigo}>
                                                {traeDependencia.descripcion}
                                            </option>
                                        ))}
                                    </select>
                                    {error.estabL_CORR && (
                                        <div className="invalid-feedback fw-semibold">{error.estabL_CORR}</div>
                                    )}
                                </div>
                                <div className="mb-1 position-relative z-1">
                                    <label className="fw-semibold">
                                        Servicio / Dependencia Destino
                                    </label>
                                    <Select
                                        aria-label="Sevicio-Dependencia"
                                        options={servicioFormOptions}
                                        onChange={handleServicioFormChange}
                                        name="deP_CORR"
                                        value={servicioFormOptions.find((option) => option.value === Traspasos.deP_CORR) || null}
                                        placeholder="Buscar"
                                        className={`form-select-container ${error.paS_OBS ? "is-invalid" : ""}`}
                                        isDisabled={Traspasos.estabL_CORR === 0}
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
                                    {error.deP_CORR && (
                                        <div className="invalid-feedback">{error.deP_CORR}</div>
                                    )}
                                </div>
                                {/* N° Memo Ref */}
                                <div className="mb-1">
                                    <label className="fw-semibold">
                                        N° Memo Ref
                                    </label>
                                    <input
                                        aria-label="paS_MEMO_REF"
                                        type="text"
                                        className={`form-control ${isDarkMode ? "bg-dark text-light border-secondary" : ""} ${error.paS_MEMO_REF ? "is-invalid" : ""}`}
                                        maxLength={50}
                                        name="paS_MEMO_REF"
                                        onChange={handleChange}
                                        value={Traspasos.paS_MEMO_REF}
                                    />
                                    {error.paS_MEMO_REF && (
                                        <div className="invalid-feedback">{error.paS_MEMO_REF}</div>
                                    )}
                                </div>
                                {/* Fecha Memo */}
                                <div className="mb-1">
                                    <label className="fw-semibold">
                                        Fecha Memo
                                    </label>
                                    <input
                                        aria-label="paS_FECHA_MEMO"
                                        type="date"
                                        className={`form-control ${isDarkMode ? "bg-dark text-light border-secondary" : ""} ${error.paS_FECHA_MEMO ? "is-invalid" : ""}`}
                                        name="paS_FECHA_MEMO"
                                        onChange={handleChange}
                                        value={Traspasos.paS_FECHA_MEMO}
                                        max={new Date().toISOString().split("T")[0]}
                                    />
                                    {error.paS_FECHA_MEMO && (
                                        <div className="invalid-feedback">{error.paS_FECHA_MEMO}</div>
                                    )}
                                </div>

                            </Col>
                            <Col md={6}>
                                <div className="border border-1 mt-4 p-4 pb-5 rounded-2">
                                    <h5 className="fw-semibold mb-4">Datos de Recepción</h5>
                                    {/* Entregado Por */}
                                    <div className="mb-1">
                                        <label className="fw-semibold">
                                            Entregado Por
                                        </label>
                                        <input
                                            aria-label="paS_NOM_ENTREGA"
                                            type="text"
                                            className={`form-control ${isDarkMode ? "bg-dark text-light border-secondary" : ""
                                                } ${error.paS_NOM_ENTREGA ? "is-invalid" : ""}`}
                                            maxLength={50}
                                            name="paS_NOM_ENTREGA"
                                            onChange={handleChange}
                                            disabled
                                            value={Traspasos.paS_NOM_ENTREGA}
                                        />
                                        {error.paS_NOM_ENTREGA && (
                                            <div className="invalid-feedback">{error.paS_NOM_ENTREGA}</div>
                                        )}
                                    </div>
                                    {/* Recibido Por */}
                                    {/* <div className="mb-1">
                                        <label className="fw-semibold">
                                            Recibido Por
                                        </label>
                                        <input
                                            aria-label="paS_NOM_RECIBE"
                                            type="text"
                                            className={`form-control ${isDarkMode ? "bg-dark text-light border-secondary" : ""
                                                } ${error.paS_NOM_RECIBE ? "is-invalid" : ""}`}
                                            maxLength={50}
                                            name="paS_NOM_RECIBE"
                                            onChange={handleChange}
                                            value={Traspasos.paS_NOM_RECIBE}
                                        />
                                        {error.paS_NOM_RECIBE && (
                                            <div className="invalid-feedback">{error.paS_NOM_RECIBE}</div>
                                        )}
                                    </div> */}
                                    {/* Jefe que Autoriza */}
                                    <div className="mb-1">
                                        <label className="fw-semibold">
                                            Jefe que Autoriza
                                        </label>
                                        <input
                                            aria-label="paS_NOM_AUTORIZA"
                                            type="text"
                                            className={`form-control ${isDarkMode ? "bg-dark text-light border-secondary" : ""} ${error.paS_NOM_AUTORIZA ? "is-invalid" : ""}`}
                                            maxLength={50}
                                            name="paS_NOM_AUTORIZA"
                                            onChange={handleChange}
                                            value={Traspasos.paS_NOM_AUTORIZA}
                                        />
                                        {error.paS_NOM_AUTORIZA && (
                                            <div className="invalid-feedback">{error.paS_NOM_AUTORIZA}</div>
                                        )}
                                    </div>
                                </div>
                            </Col>
                            <Col>

                                <div className="border border-1 mt-4 p-4 pb-5 rounded-2">
                                    {/* Observaciones */}
                                    <div className="mb-1">
                                        <label className="fw-semibold">
                                            Observaciones
                                        </label>
                                        <textarea
                                            className={`form-control ${isDarkMode ? "bg-dark text-light border-secondary" : ""} ${error.paS_OBS ? "is-invalid" : ""}`}
                                            aria-label="paS_OBS"
                                            name="paS_OBS"
                                            rows={2}
                                            maxLength={500}
                                            style={{ minHeight: "8px", resize: "none" }}
                                            placeholder="Escriba una observacion aquí..."
                                            onChange={handleChange}
                                            value={Traspasos.paS_OBS}
                                        />
                                        {error.paS_OBS && (
                                            <div className="invalid-feedback">{error.paS_OBS}</div>
                                        )}
                                    </div>

                                    {anexos.length > 0 ? (
                                        <div className='table-responsive'>
                                            <table className={`table ${isDarkMode ? "table-dark" : "table-hover"}`}>
                                                <thead className={`sticky-top z-0 ${isDarkMode ? "table-dark" : "text-dark "}`}>
                                                    <tr>
                                                        <th className="fw-semibold text-center">Eliminar</th>
                                                        <th className="fw-semibold text-center">Documentos</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {anexos.map((file, index) => (
                                                        <tr key={index} >
                                                            <td>
                                                                <Button
                                                                    size="sm"
                                                                    variant="danger"
                                                                    className="rounded"
                                                                    onClick={() => { setAnexos(prev => prev.filter((_, i) => i !== index)); }}
                                                                >
                                                                    <Trash className={"flex-shrink-0 h-5 w-5  "} aria-hidden="true" />
                                                                </Button>
                                                            </td>
                                                            <td className="text-center"> {file.name}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>

                                            </table>
                                            {anexos.length > 2 ? (
                                                <></>
                                            ) : (
                                                <div className="ms-2">
                                                    <Button
                                                        size="sm"
                                                        variant="primary"
                                                        className="rounded"
                                                        onClick={handleFileInput}
                                                    >
                                                        <Plus width={18} height={18} aria-hidden="true" />
                                                    </Button>
                                                    <input
                                                        aria-label="file"
                                                        ref={inputRef}
                                                        type="file"
                                                        multiple
                                                        accept=".pdf,.doc,.docx,.jpg,.png"
                                                        style={{ display: "none" }}
                                                        className={anexos.length >= 2 ? "disabled" : ""}
                                                        onChange={handleChangeFiles}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <>
                                            <div className={`text-center m-2 px-5 pt-1 pb-1 rounded border-0 fs-09em fw-semibold ${isDarkMode ? 'bg-dark text-light border border-secondary' : 'bg-light text-muted border'}`}>
                                                <a

                                                    className="mx-1 text-decoration-none text-muted"
                                                    style={{ cursor: 'pointer' }}
                                                    onClick={handleFileInput}
                                                >
                                                    <Paperclip width={18} height={18} aria-hidden="true" />
                                                    <span> Haga clic aquí para agregar documento</span>
                                                </a>
                                                <input
                                                    aria-label="file"
                                                    ref={inputRef}
                                                    type="file"
                                                    multiple
                                                    accept=".pdf,.doc,.docx,.jpg,.png"
                                                    style={{ display: "none" }}
                                                    className={anexos.length >= 2 ? "disabled" : ""}
                                                    onChange={handleChangeFiles}
                                                />
                                            </div>
                                        </>
                                    )}

                                </div>
                            </Col>
                        </Row>
                    </form>
                </Modal.Body>
            </Modal>

            {/* Modal Resumen Traspasos */}
            {listaSalidaTraspasos.length > 0 && (
                <>
                    <Modal show={mostrarModalResumen} onHide={() => setMostrarModalResumen(false)} size="xl">
                        {/* Mensaje */}
                        <div className="py-2 rounded fw-semibold fs-09em bg-success bg-opacity-10 text-success border-none"
                        >
                            Se han traspasado <strong>{listaSalidaTraspasos.length}</strong> bienes correctamente.
                        </div>
                        <Modal.Header className={`${isDarkMode ? "darkModePrincipal" : ""}`} closeButton>
                            <Modal.Title className="fw-semibold">Resumen de Traspasos</Modal.Title>
                        </Modal.Header>

                        <div className={` d-flex justify-content-end p-4 border-bottom ${isDarkMode ? "darkModePrincipal" : ""}`}>
                            <Button
                                className={`px-4 py-2 mx-1 fw-semibold ${isDarkMode ? "btn-secondary" : "btn-primary"}`}
                                onClick={() => {
                                    navigate("/traspasos/ListadoTraspasos");
                                }}
                            >
                                Ir a Listado de Traspasos
                            </Button>
                            <Button
                                variant={`${isDarkMode ? "secondary" : "primary"}`}
                                onClick={handleAbrirModalExportar}
                                disabled={listaSalidaTraspasos.length === 0 || loadingExportar}
                            >
                                {loadingExportar ? (
                                    <>
                                        Un Momento...
                                        <Spinner as="span" className="ms-1" animation="border" size="sm" role="status" aria-hidden="true" />
                                    </>
                                ) : (
                                    <>
                                        <FiletypePdf
                                            className="flex-shrink-0 h-5 w-5 mx-2"
                                            aria-hidden="true"
                                        />
                                        Exportar
                                        <span className="badge bg-light text-dark mx-1 mt-1">
                                            {/* {listaSalidaTraspasos.length} */}
                                        </span>
                                    </>
                                )}
                            </Button>
                        </div>
                        <Modal.Body id="pdf-content" className={`${isDarkMode ? "darkModePrincipal" : ""}`}>
                            <Row className="mb-4 d-flex justify-content-between">
                                <Col md={4}>
                                    <p><strong>Traspaso N° </strong> {listaSalidaTraspasos[0]?.n_TRASPASO}</p>
                                </Col>
                                <Col md={4}>
                                    <p><span className="fw-semibold">Fecha Traspaso: </span>{listaSalidaTraspasos[0]?.paS_FECHA}</p>
                                    <p><span className="fw-semibold">Nº Memorandum: </span>{listaSalidaTraspasos[0]?.paS_MEMO_REF}</p>
                                    <p ><span className="fw-semibold">Fecha Memorandum: </span>{formatearFecha(listaSalidaTraspasos[0]?.paS_FECHA_MEMO)}</p>
                                </Col>
                            </Row>
                            <Row className="mb-4">
                                <Col md={4}>
                                    <p className="fw-semibold">Origen</p>
                                    <p>        {listaSalidaTraspasos[0]?.serviciO_DEPENDENCIA}
                                        ({listaSalidaTraspasos[0].estabL_CORR_ORIGEN === 1 ? "SSMSO" :
                                            listaSalidaTraspasos[0].estabL_CORR_ORIGEN === 2 ? "CASR" :
                                                listaSalidaTraspasos[0].estabL_CORR_ORIGEN === 3 ? "HSJM" : "-"})</p>

                                </Col>
                                <Col md={4}>
                                    <p className="fw-semibold">Destino</p>
                                    <p> {listaSalidaTraspasos[0]?.serviciO_DEPENDENCIA_DESTINO}
                                        ({listaSalidaTraspasos[0].estabL_CORR === 1 ? "SSMSO" :
                                            listaSalidaTraspasos[0].estabL_CORR === 2 ? "CASR" :
                                                listaSalidaTraspasos[0].estabL_CORR === 3 ? "HSJM" : "-"})</p>

                                </Col>
                            </Row>
                            <Col className="row align-items-center justify-content-center gap-2 px-2">

                                {listaSalidaTraspasos.length > 10 && (
                                    <div className="d-flex align-items-center justify-content-center justify-content-lg-start">
                                        <label htmlFor="nPaginacion2" className="form-label fw-semibold mb-0 me-2">
                                            Tamaño de página:
                                        </label>
                                        <select
                                            aria-label="Seleccionar tamaño de página"
                                            className={`form-select form-select-sm w-auto ${isDarkMode ? "bg-dark text-light border-secondary" : ""}`}
                                            name="nPaginacion2"
                                            onChange={handleChange}
                                            value={Paginacion2.nPaginacion2}
                                        >
                                            {[10, 15, 20, 25, 50, 100].map((val) => (
                                                <option key={val} value={val}>{val}</option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                            </Col>

                            <div className="table-responsive" style={{ maxHeight: "50vh", overflowY: "auto" }}>
                                <table className={`table ${isDarkMode ? "table-dark" : "table-hover table-striped"}`}>
                                    <thead>
                                        <tr>
                                            <th className="text-center">Nº Inventario</th>
                                            <th className="text-center">Especie</th>
                                            <th className="text-center">Marca</th>
                                            <th className="text-center">Modelo</th>
                                            <th className="text-center">Serie</th>
                                            <th className="text-center">Observación</th>
                                            <th className="text-center">Estado</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {elementosActuales2.length > 0 ? (
                                            elementosActuales2.map((item, index) => (
                                                <tr key={index}>
                                                    <td className="text-center">{item.aF_CODIGO_GENERICO || 'N/A'}</td>
                                                    <td className="text-center">{item.esP_NOMBRE || 'N/A'}</td>
                                                    <td className="text-center">{item.deT_MARCA || 'N/A'}</td>
                                                    <td className="text-center">{item.deT_MODELO || 'N/A'}</td>
                                                    <td className="text-center">{item.deT_SERIE || 'N/A'}</td>
                                                    <td className="text-center">{item.deT_OBS || 'N/A'}</td>
                                                    <td className="text-center">{item.paS_ESTADO_AF || 'N/A'}</td>
                                                    {/* <td>{item.n_TRASPASO || 'N/A'}</td> */}
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td className="text-center">No hay registros</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            {/* Paginador */}
                            {listaSalidaTraspasos.length > 10 && (
                                <div className="paginador-container mt-3">
                                    <Pagination className="paginador-scroll justify-content-center">
                                        <Pagination.First onClick={() => paginar2(1)} disabled={paginaActual2 === 1} />
                                        <Pagination.Prev
                                            onClick={() => paginar2(paginaActual2 - 1)}
                                            disabled={paginaActual2 === 1}
                                        />
                                        {Array.from({ length: totalPaginas2 }, (_, i) => (
                                            <Pagination.Item
                                                key={i + 1}
                                                active={i + 1 === paginaActual2}
                                                onClick={() => paginar2(i + 1)}
                                            >
                                                {i + 1}
                                            </Pagination.Item>
                                        ))}
                                        <Pagination.Next
                                            onClick={() => paginar2(paginaActual2 + 1)}
                                            disabled={paginaActual2 === totalPaginas2}
                                        />
                                        <Pagination.Last
                                            onClick={() => paginar2(totalPaginas2)}
                                            disabled={paginaActual2 === totalPaginas2}
                                        />
                                    </Pagination>
                                </div>
                            )}
                        </Modal.Body>
                    </Modal>
                    {
                        loading && (
                            <div
                                className="position-fixed top-0 start-0 w-100 h-100 z-99999 d-flex justify-content-center align-items-center"
                                style={{
                                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                                    // zIndex: 1050,
                                }}
                            >
                                <div className="text-center">
                                    <div className="spinner-border text-light mb-3" role="status" style={{ width: "3rem", height: "3rem" }} />
                                    <p className="text-white fw-semibold mb-0">Enviando, un momento...</p>
                                </div>
                            </div>
                        )
                    }
                </>
            )
            }

            {/* Modal PDF Excel Word */}
            <Modal
                show={modalMostrarExportar}
                onHide={() => setModalMostrarExportar(false)}
                size="xl"
                centered={false}
                animation={false}
                handle=".modal-header"
                cancel=".modal-body"
                dialogAs={(props) => (
                    <Draggable
                        handle=".modal-header"
                        cancel=".modal-body"
                    >
                        <ModalDialog {...props} />
                    </Draggable>
                )}
            >
                <Modal.Header className={`${isDarkMode ? "darkModePrincipal" : ""}`} closeButton
                    style={{
                        cursor: "move",
                        userSelect: "none"
                    }}
                >
                    <Modal.Title className="fw-semibold">Exportar</Modal.Title>
                </Modal.Header>
                <Modal.Body className={` ${isDarkMode ? "darkModePrincipal" : ""}`}>
                    {/*Aqui se renderiza las propiedades de la tabla en el pdf */}
                    <BlobProvider
                        document={
                            <DocumentoPDFResumenTraspaso
                                listaSalidaTraspasos={listaSalidaTraspasos}
                            />
                        }
                    >
                        {({ url, loading }) => {
                            // Cuando el PDF termina de cargarse, apagamos el spinner
                            useEffect(() => {
                                if (!loading) {
                                    setLoadingExportar(false);
                                }
                            }, [loading]);

                            return loading ? (
                                <p>Generando vista previa...</p>
                            ) : (
                                <>
                                    <iframe
                                        src={url ?? ""}
                                        title="Vista Previa del PDF"
                                        style={{
                                            width: "100%",
                                            height: "900px",
                                            border: "none"
                                        }}
                                    ></iframe>
                                </>
                            );
                        }}
                    </BlobProvider>
                </Modal.Body>
            </Modal>
        </Layout >

    );
};

const mapStateToProps = (state: RootState) => ({
    token: state.loginReducer.token,
    comboTrasladoServicio: state.comboTrasladoServicioReducer.comboTrasladoServicio || [],
    comboEstablecimiento: state.comboEstablecimientoReducer.comboEstablecimiento || [],
    comboTrasladoEspecie: state.comboTrasladoEspecieReducer.comboTrasladoEspecie || [],
    comboDependenciaOrigen: state.comboDependenciaOrigenReducer.comboDependenciaOrigen || [],
    comboDependenciaDestino: state.comboDependenciaDestinoReducer.comboDependenciaDestino || [],
    listaTraspasoSeleccion: state.obtenerInventarioTraspasoReducers.listaTrapasoSeleccion || [],
    objeto: state.validaApiLoginReducers,
    isDarkMode: state.darkModeReducer.isDarkMode,
    comboEspecies: state.comboEspeciesBienReducers.comboEspecies || [],
    comboSerDep: state.comboServDepReducers.comboSerDep || [],
    listaSalidaTraspasos: state.listaSalidaTraspasosReducers.listaSalidaTraspasos || []
});
export default connect(mapStateToProps, {
    registroTraspasoMultipleActions,
    comboTrasladoServicioActions,
    comboEstablecimientoActions,
    comboTrasladoEspecieActions,
    comboDependenciaOrigenActions,
    comboDependenciaDestinoActions,
    comboSerDepActions,
    comboEspeciesBienActions,
    obtenerInventarioTraspasoActions,
    listadoDeEspeciesBienActions,
    listadoTraspasosRecibidosActions,
    listadoTraspasosEnviadosActions
})(RegistrarTraspasos);
