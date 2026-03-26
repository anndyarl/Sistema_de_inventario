import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useMemo, useState } from "react";
import { Button, Col, Modal, Row, Spinner } from "react-bootstrap";
import { RootState } from "../../store.ts";
import { connect } from "react-redux";
import Layout from "../../containers/hocs/layout/Layout.tsx";
import Swal from "sweetalert2";
import SkeletonLoader from "../Utils/SkeletonLoader.tsx";
import { registrarMantenedorDependenciasActions } from "../../redux/actions/Mantenedores/Dependencias/registrarMantenedorDependenciasActions.tsx";
import { Objeto } from "../Navegacion/Profile.tsx";
import { Helmet } from "react-helmet-async";
import MenuTraslados from "../Menus/MenuTraslados.tsx";
import { listadoTrasladosActions } from "../../redux/actions/Traslados/listadoTrasladosActions.tsx";
import { CircleFill, Download, Eraser, Eye, FiletypePdf, GeoFill, Search } from "react-bootstrap-icons";
import { TablaGenerica } from "../Utils/TablaGenerica.tsx";
import { PageSizeSelector } from "../Utils/PageSizeSelector.tsx";
import { obtenerAdjuntosActions } from "../../redux/actions/Traslados/obtenerAdjuntosActions.tsx";

interface FechasProps {
  fDesde: string;
  fHasta: string;
}
export interface listadoTraslados {
  aF_CODIGO_GENERICO: string,
  usuariO_MOD: string,
  usuariO_CREA: string,
  traS_OBS: string,
  traS_NOM_RECIBE: string,
  traS_NOM_ENTREGA: string,
  traS_NOM_AUTORIZA: string,
  traS_MEMO_REF: string,
  traS_FECHA_MEMO: string,
  traS_FECHA: string,
  traS_ESTADO_AF: string,
  traS_DET_CORR: number,
  traS_CORR: number,
  traS_CO_REAL: number,
  n_TRASLADO: number,
  iP_MOD: string,
  iP_CREA: string,
  f_MOD: number,
  f_CREA: number,
  estabL_D: number,
  deP_CORR_ORIGEN: number,
  deP_CORR: number,
  aF_CLAVE: number,
  seR_NOMBRE_ORIGEN: string,
  deP_NOMBRE_ORIGEN: string;
  seR_NOMBRE_DESTINO: string,
  deP_NOMBRE_DESTINO: string;
  traS_ACTIVO: number;
  esP_NOMBRE: string;
}
interface ListaAdjuntos {
  nombre: string;
  contenido: string;
}
interface GeneralProps {
  listadoTraslados: listadoTraslados[];
  listadoTrasladosAdjuntos: ListaAdjuntos[];
  listadoTrasladosActions: (fDesde: string, fHasta: string, af_codigo_generico: string, tras_corr: number, establ_corr: number) => Promise<boolean>;
  registrarMantenedorDependenciasActions: (formModal: Record<string, any>) => Promise<boolean>;
  obtenerAdjuntosActions: (numTraslado: number) => Promise<boolean>;
  token: string | null;
  isDarkMode: boolean;
  objeto: Objeto; //Objeto que obtiene los datos del usuario
}

const ListadoTraslados: React.FC<GeneralProps> = ({ listadoTrasladosActions, obtenerAdjuntosActions, listadoTraslados, listadoTrasladosAdjuntos, token, isDarkMode, objeto }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Partial<FechasProps> & {}>({});

  // Estados para ordenamiento
  const [sortColumn, setSortColumn] = useState<keyof listadoTraslados | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [paginaActual, setPaginaActual] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  //-------------------Estados de archivos adjuntos ------------------//
  const [mostrarModalAdjuntos, setmostrarModalAdjuntos] = useState<number | null>(null);
  const [elementoSeleccionado, setElementoSeleccionado] = useState<any[]>([]);
  const [listaAdjuntos, setListaAdjuntos] = useState<number | null>(null);
  const [loadingAdjuntos, setLoadingAdjuntos] = useState(false);
  //-------------------Fin Estados de archivos adjuntos ------------------//
  const [ListadoTraslado, setListadoTraslado] = useState({
    fDesde: "",
    fHasta: "",
    tras_corr: 0,
    af_codigo_generico: ""
  });

  const validate = () => {
    let tempErrors: Partial<any> & {} = {};

    // Validar que si hay fecha de inicio, fHasta haber fecha de término
    if (ListadoTraslado.fDesde && !ListadoTraslado.fHasta) {
      tempErrors.fHasta = "Debe ingresar una fecha de término.";
    }

    // Validar que si hay fecha de término, debe haber fecha de inicio
    if (!ListadoTraslado.fDesde && ListadoTraslado.fHasta) {
      tempErrors.fDesde = "Debe ingresar una fecha de inicio.";
    }

    // Si ambas fechas están presentes, validar el rango
    if (ListadoTraslado.fDesde && ListadoTraslado.fHasta) {
      if (ListadoTraslado.fDesde > ListadoTraslado.fHasta) {
        tempErrors.fDesde = "La fecha de inicio no puede ser mayor a la fecha de término.";
        tempErrors.fHasta = "La fecha de término no puede ser menor a la fecha de inicio.";
      }
    }

    setError(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const listaAuto = async () => {
    if (token) {
      if (listadoTraslados.length === 0) {
        setLoading(true);
        const resultado = await listadoTrasladosActions("", "", "", 0, objeto.Roles[0].codigoEstablecimiento);
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
          setLoading(false);
        }
        else {
          setLoading(false);
        }
      }
    }
  };

  useEffect(() => {
    listaAuto()
  }, [listadoTrasladosActions, token, listadoTraslados.length]); // Asegúrate de incluir dependencias relevantes

  useEffect(() => {
    setPaginaActual(1);
  }, []);


  const handleLimpiar = () => {
    setListadoTraslado((prevListadoTraslado) => ({
      ...prevListadoTraslado,
      fDesde: "",
      fHasta: "",
      tras_corr: 0,
      af_codigo_generico: ""
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
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

    // Actualizar estado
    setListadoTraslado((prevState) => ({
      ...prevState,
      [name]: newValue,
    }));
  };

  const handleBuscar = async (e: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLInputElement>) => {
    e.preventDefault();

    if (!validate()) {
      setLoading(false);
      return;
    }
    let resultado = false;

    resultado = await listadoTrasladosActions(ListadoTraslado.fDesde, ListadoTraslado.fHasta, ListadoTraslado.af_codigo_generico, ListadoTraslado.tras_corr, objeto.Roles[0].codigoEstablecimiento);

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
      resultado = await listadoTrasladosActions("", "", "", 0, objeto.Roles[0].codigoEstablecimiento);
      setLoading(false); //Finaliza estado de carga
      return;
    } else {
      setLoading(false); //Finaliza estado de carga
    }

  };

  // PASO 1: Primero ordenamos TODOS los datos según la columna seleccionada
  const datosOrdenados = useMemo(() => {
    if (!sortColumn) return listadoTraslados;

    return [...listadoTraslados].sort((a, b) => {
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];

      // Manejar valores numéricos
      if (!isNaN(Number(aValue)) && !isNaN(Number(bValue))) {
        return sortDirection === 'asc'
          ? Number(aValue) - Number(bValue)
          : Number(bValue) - Number(aValue);
      }

      // Manejar valores de texto
      const aString = aValue?.toString() || '';
      const bString = bValue?.toString() || '';

      return sortDirection === 'asc'
        ? aString.localeCompare(bString)
        : bString.localeCompare(aString);
    });
  }, [listadoTraslados, sortColumn, sortDirection]);

  // PASO 3: Paginación (para la vista, NO para la exportación)
  const totalRegistros = listadoTraslados.length;
  const totalPaginas = Math.ceil(totalRegistros / pageSize);
  const indiceInicio = (paginaActual - 1) * pageSize;
  const indiceFin = indiceInicio + pageSize;

  // Para la vista usamos los datos ordenados pero paginados
  const elementosActuales = useMemo(() => {
    return datosOrdenados.slice(indiceInicio, indiceFin);
  }, [datosOrdenados, indiceInicio, indiceFin]);

  // Función para manejar el ordenamiento
  const handleSort = (column: keyof listadoTraslados, direction: 'asc' | 'desc') => {
    setSortColumn(column);
    setSortDirection(direction);
    // No reseteamos la selección al ordenar
  };

  // Primero, define la función de formateo de usuario fuera del componente o en un utils
  const formatearUsuario = (usuario: string): string => {
    return usuario === '62511' ? 'Andy Riquelme' :
      usuario === '18124' ? 'Rodrigo Toledo' :
        usuario === 'JCASTILLO' || usuario === 'jcastillo' || usuario === '1770' ? 'Jaime Castillo' :
          usuario === 'DROJASP' || usuario === 'drojasp' || usuario === '66098' ? 'Daniel Rojas' :
            usuario === '1234567' || usuario === '18667' ? 'Felipe Almonte' :
              usuario === 'JVARGAS' || usuario === 'jvargas' || usuario === '6405' ? 'Jonathan Vargas' :
                usuario === 'GFARIAS' || usuario === 'gfarias' || usuario === '888' ? 'Gabriela Farias' :
                  usuario === '61870' ? 'Elena Navarro' :
                    usuario === '68321' ? 'Ivan Acevedo' :
                      usuario === '67234' ? 'Ignacio Avilés' :
                        usuario === '6601' ? 'Benjamin Bulboa' :
                          usuario === '67404' ? 'Ademir Pindea' :
                            usuario === '21479' ? 'Nelsn Quiroz' :
                              usuario === '66098' ? 'Daniel Rojas' :
                                usuario === 'KREYESD' || usuario === 'kreyesd' || usuario === '66099' ? 'Katherine Reyes' :
                                  usuario;
  };

  const handleAbrirModal = async (aF_CLAVE: number, item: listadoTraslados) => {
    try {
      setmostrarModalAdjuntos(aF_CLAVE);
      console.log(aF_CLAVE, item)
      setElementoSeleccionado([item]);
      // Verificar si los adjuntos ya están cargados para este traslado
      if (listaAdjuntos !== item.n_TRASLADO) {
        setLoadingAdjuntos(true);
        const resultado = await obtenerAdjuntosActions(item.n_TRASLADO);
        if (resultado) {
          setListaAdjuntos(item.n_TRASLADO);
        }
        setLoadingAdjuntos(false);
      }
    } catch (error) {
      console.error("Error al cargar adjuntos:", error);
      setLoadingAdjuntos(false);
    }
  };

  const handleDescargarAdjunto = async (lista: any) => {

    const contenido = listadoTrasladosAdjuntos?.[lista]?.contenido || lista?.contenido;
    const nombreArchivo = lista?.nombre || "documento";

    if (!contenido) {
      console.warn("Sin contenido en el adjunto");
      return;
    }

    // Limpia el base64 (quita saltos de línea o espacios)
    const base64Limpio = contenido.replace(/\s/g, "").trim();

    function detectarTipo(base64: string): string {
      if (base64.startsWith("JVBERi0")) return "pdf";
      if (base64.startsWith("/9j/")) return "jpeg";
      if (base64.startsWith("iVBOR")) return "png";
      if (base64.startsWith("R0lGOD")) return "gif";
      return "png"; // fallback
    };

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



  // Definición de las columnas
  const columnas = [
    {
      key: 'aF_CODIGO_GENERICO' as keyof listadoTraslados,
      className: 'text-nowrap',
      cellClassName: 'text-nowrap',
      header: 'N° Inventario'
    },
    { key: 'n_TRASLADO' as keyof listadoTraslados, header: 'N° Traslado' },
    { key: 'traS_FECHA' as keyof listadoTraslados, header: 'Fecha Traslado' },
    { key: 'esP_NOMBRE' as keyof listadoTraslados, header: 'Especie' },
    {
      key: 'seR_NOMBRE_ORIGEN' as keyof listadoTraslados,
      header: (
        <>
          Ubicación Origen
          <CircleFill className="flex-shrink-0 h-5 w-5 mx-3 text-warning" aria-hidden="true" />
        </>
      ),
      render: (_: any, item: listadoTraslados) => `${item.seR_NOMBRE_ORIGEN} ${item.deP_NOMBRE_ORIGEN}`
    },
    {
      key: 'seR_NOMBRE_DESTINO' as keyof listadoTraslados,
      header: (
        <>
          Ubicación Actual
          <CircleFill className="flex-shrink-0 h-5 w-5 mx-3 text-success" aria-hidden="true" />
        </>
      ),
      render: (_: any, item: listadoTraslados) => `${item.seR_NOMBRE_DESTINO} ${item.deP_NOMBRE_DESTINO}`
    },
    { key: 'traS_MEMO_REF' as keyof listadoTraslados, header: 'Memo de Referencia' },
    { key: 'traS_FECHA_MEMO' as keyof listadoTraslados, header: 'Fecha Memo' },
    {
      key: 'usuariO_CREA' as keyof listadoTraslados,
      header: 'Usuario Crea',
      render: (value: string) => formatearUsuario(value)
    },
    {
      key: 'traS_OBS' as keyof listadoTraslados,
      header: 'Observaciones',
      render: (value: string) => parseInt(value) == 0 ? "Sin observaciones" : value
    },
    { key: 'traS_NOM_ENTREGA' as keyof listadoTraslados, header: 'Nombre Entrega' },
    { key: 'traS_NOM_RECIBE' as keyof listadoTraslados, header: 'Nombre Recibe' },
    { key: 'traS_NOM_AUTORIZA' as keyof listadoTraslados, header: 'Nombre Autoriza' },
    {
      key: 'aF_CLAVE' as keyof listadoTraslados,
      header: 'Documentos',
      className: 'text-center fixed',
      cellClassName: 'text-center',
      style: {  // ← Dobles llaves
        position: 'fixed',
        left: 0,
        backgroundColor: 'white', // Opcional: para que no se vea transparente al hacer sticky
        zIndex: 1 // Opcional: para asegurar que quede por encima
      },
      disableSort: true,
      render: (aF_CLAVE: number, lista: any) => (
        <Button
          type="button"
          variant="primary"
          className="fw-semibold"
          onClick={() => handleAbrirModal(aF_CLAVE, lista)}
        >
          <Eye
            className="flex-shrink-0"
            width={20}
            height={20}
            aria-hidden="true"
          />
        </Button>
      )
    },
  ];



  //------------------------------ Fin ------------------------------------//
  return (
    <Layout>
      <Helmet>
        <title>Listado de Traslados</title>
      </Helmet>
      <MenuTraslados />
      <div className="table-responsive position-relative z-0 hide-scrollbar" >
        <div style={{ maxHeight: "80vh" }}>
          <div className="border-bottom shadow-sm p-2 rounded">
            <h3 className="form-title fw-semibold border-bottom p-1">Listado de Traslados</h3>
            <Row className="border rounded p-2 m-2">
              <Col md={3} sm={12}>
                <div className="mb-2 ">
                  <div className="flex-grow-1 mb-2">
                    <label htmlFor="fDesde" className="form-label fw-semibold small">Desde</label>
                    <div className="input-group">
                      <input
                        aria-label="Fecha Desde"
                        type="date"
                        className={`form-control ${isDarkMode ? "bg-dark text-light border-secondary" : ""} ${error.fDesde ? "is-invalid" : ""}`}
                        name="fDesde"
                        onChange={handleChange}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleBuscar(e);
                          }
                        }}
                        value={ListadoTraslado.fDesde}
                        max={new Date().toLocaleDateString("sv-SE", { timeZone: "America/Santiago" })}
                      />
                    </div>
                    {error.fDesde && <div className="invalid-feedback d-block">{error.fDesde}</div>}
                  </div>

                  <div className="flex-grow-1">
                    <label htmlFor="fHasta" className="form-label fw-semibold small">Hasta</label>
                    <div className="input-group">
                      <input
                        aria-label="Fecha Hasta"
                        type="date"
                        className={`form-control ${isDarkMode ? "bg-dark text-light border-secondary" : ""} ${error.fHasta ? "is-invalid" : ""}`}
                        name="fHasta"
                        onChange={handleChange}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleBuscar(e);
                          }
                        }}
                        value={ListadoTraslado.fHasta}
                        max={new Date().toLocaleDateString("sv-SE", { timeZone: "America/Santiago" })}
                      />
                    </div>
                    {error.fHasta && <div className="invalid-feedback d-block">{error.fHasta}</div>}

                  </div>
                  <small className="fw-semibold">Filtre los resultados por fecha de Traslado.</small>
                </div>
              </Col>

              <Col md={2} sm={12}>
                <div className="mb-1">
                  <label htmlFor="af_codigo_generico" className="form-label fw-semibold small">Nº Inventario</label>
                  <input
                    aria-label="af_codigo_generico"
                    type="text"
                    className={`form-control ${isDarkMode ? "bg-dark text-light border-secondary" : ""}`}
                    name="af_codigo_generico"
                    placeholder="Ej: 1000000008"
                    onChange={handleChange}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleBuscar(e);
                      }
                    }}
                    maxLength={12}
                    value={ListadoTraslado.af_codigo_generico}
                  />
                </div>
                <div className="mb-1">
                  <label htmlFor="tras_corr" className="fw-semibold">Nº Traslado</label>
                  <input
                    aria-label="tras_corr"
                    type="text"
                    className={`form-select ${isDarkMode ? "bg-dark text-light border-secondary" : ""}`}
                    name="tras_corr"
                    size={10}
                    placeholder="Eje: 1000000008"
                    maxLength={12}
                    onChange={handleChange}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleBuscar(e);
                      }
                    }}
                    value={ListadoTraslado.tras_corr}
                  />
                </div>
              </Col>

              {/* Columna 5: Botones de Acción */}
              <Col lg={2} md={3} sm={12}>
                <div className="d-flex flex-column gap-2 mt-4">
                  <Button
                    onClick={handleBuscar}
                    variant={`${isDarkMode ? "secondary" : "primary"}`}
                    className="w-100"
                  // disabled={loading}
                  >
                    {loading ? (
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

                  <Button onClick={handleLimpiar} variant={`${isDarkMode ? "secondary" : "primary"}`} className="w-100">
                    Limpiar
                    <Eraser className="flex-shrink-0 h-5 w-5 ms-1" aria-hidden="true" />
                  </Button>
                </div>
              </Col>
            </Row>

            {/* Controles de página y exportación */}
            <Row className="g-2 align-items-center flex-column flex-lg-row justify-content-between">
              <Col xs={12} lg="auto">
                {listadoTraslados.length > 10 && (
                  <PageSizeSelector
                    pageSize={pageSize}
                    total={listadoTraslados.length}
                    totalFiltrados={totalRegistros}
                    onChange={(size) => setPageSize(size)}
                    isDarkMode={isDarkMode}
                  />
                )}
              </Col>
            </Row>

            {/* Tabla con selección */}
            {loading ? (
              <SkeletonLoader rowCount={10} />
            ) : (
              <TablaGenerica<listadoTraslados>
                data={elementosActuales}
                columns={columnas}
                isDarkMode={isDarkMode}
                onSortChange={handleSort}
                sortColumn={sortColumn}
                sortDirection={sortDirection}
              />
            )}

            {/* Paginador */}
            {totalPaginas > 1 && (
              <div className="mt-3 paginador-scroll">
                <ul className="pagination pagination-sm justify-content-center">
                  <li className={`page-item ${paginaActual === 1 ? "disabled" : ""}`}>
                    <button
                      className="page-link"
                      onClick={() => setPaginaActual(1)}
                    >
                      Primera
                    </button>
                  </li>
                  <li className={`page-item ${paginaActual === 1 ? "disabled" : ""}`}>
                    <button
                      className="page-link"
                      onClick={() => setPaginaActual(paginaActual - 1)}
                    >
                      Anterior
                    </button>
                  </li>

                  {Array.from({ length: Math.min(20, totalPaginas) }, (_, i) => {
                    let pageNum;
                    if (totalPaginas <= 20) {
                      pageNum = i + 1;
                    } else if (paginaActual <= 3) {
                      pageNum = i + 1;
                    } else if (paginaActual >= totalPaginas - 2) {
                      pageNum = totalPaginas - 19 + i;
                    } else {
                      pageNum = paginaActual - 2 + i;
                    }

                    return (
                      <li
                        key={pageNum}
                        className={`page-item ${paginaActual === pageNum ? "active" : ""}`}
                      >
                        <button
                          className="page-link"
                          onClick={() => setPaginaActual(pageNum)}
                        >
                          {pageNum}
                        </button>
                      </li>
                    );
                  })}

                  <li className={`page-item ${paginaActual === totalPaginas ? "disabled" : ""}`}>
                    <button
                      className="page-link"
                      onClick={() => setPaginaActual(paginaActual + 1)}
                    >
                      Siguiente
                    </button>
                  </li>
                  <li className={`page-item ${paginaActual === totalPaginas ? "disabled" : ""}`}>
                    <button
                      className="page-link"
                      onClick={() => setPaginaActual(totalPaginas)}
                    >
                      Última
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Detalle adjuntos */}

      <Modal
        show={mostrarModalAdjuntos !== null}
        onHide={() => setmostrarModalAdjuntos(null)}
        size="xl"
        centered
      >
        <Modal.Header closeButton className={isDarkMode ? "darkModePrincipal" : ""}>
          <Modal.Title className="fw-semibold d-flex align-items-center gap-2">
            <span>Documentos del Traslado</span>

          </Modal.Title>
        </Modal.Header>

        <Modal.Body className={isDarkMode ? "darkModePrincipal" : ""}>
          {elementoSeleccionado?.[0] && (
            <span className="text-muted small">
              Nº Traslado: <strong>{elementoSeleccionado[0].n_TRASLADO}</strong>
              {" | "}
              Código AF: <strong>{elementoSeleccionado[0].aF_CODIGO_GENERICO}</strong>
            </span>
          )}
          <Row className="g-1">
            <Col lg={12}>
              {loadingAdjuntos ? (
                <div className="text-center py-5">
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden">Cargando documentos...</span>
                  </Spinner>
                  <p className="mt-2">Cargando documentos...</p>
                </div>
              ) : listadoTrasladosAdjuntos && listadoTrasladosAdjuntos.length > 0 ? (
                <div className={`border rounded-3 p-3 ${isDarkMode ? "border-secondary" : ""}`}>
                  <div className="table-responsive">
                    <table className={`table table-sm mb-0 ${isDarkMode ? "table-dark" : "table-hover"}`}>
                      <thead className={isDarkMode ? "table-dark" : "table-light"}>
                        <tr>
                          <th scope="col">Nombre del Documento</th>
                          <th scope="col" className="text-center" style={{ width: "100px" }}>
                            Descargar
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {listadoTrasladosAdjuntos.map((adjunto, idx) => (
                          <tr key={idx}>
                            <td>
                              <FiletypePdf className="me-2 text-danger" size={18} />
                              {adjunto.nombre || `documento_${idx + 1}`}
                            </td>
                            <td className="text-center">
                              <Button
                                size="sm"
                                variant={isDarkMode ? "outline-light" : "outline-primary"}
                                onClick={() => handleDescargarAdjunto(adjunto)}
                                title="Descargar documento"
                              >
                                <Download className="h-4 w-4" aria-hidden="true" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="text-center py-5">
                  <p className={`pt-1 pb-1 mb-1 rounded border-0 fs-09em fw-semibold ${isDarkMode ? 'bg-dark text-light border border-secondary' : 'bg-light text-muted border'}`}>
                    No hay documentos adjuntos para este traslado
                  </p>
                </div>
              )}
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
                    </div>
                    <div>
                      <label className="fw-semibold small text-muted">Servicio/Dependencia Origen</label>
                      <div
                        className={`rounded border px-3 py-2 ${isDarkMode ? "bg-dark border-secondary text-light" : "bg-light border-muted text-dark"}`}

                      >
                        <p className="fs-05em text-start"> {elementoSeleccionado[0]?.seR_NOMBRE_ORIGEN + " " + elementoSeleccionado[0]?.deP_NOMBRE_ORIGEN || "Sin Información"}</p>
                      </div>
                    </div>
                  </Col>

                  <Col md={12} className="mb-1 p-1">
                    <div className="mb-3">
                      <label className="fw-semibold small d-flex align-items-center mb-1">
                        <GeoFill className="me-2 text-success" width={15} height={15} aria-hidden="true" />
                        Destino
                      </label>
                    </div>
                    <div>
                      <label className="fw-semibold small text-muted">Servicio/Dependencia Destino</label>
                      <div
                        className={`rounded border px-3 py-2 ${isDarkMode ? "bg-dark border-secondary text-light" : "bg-light border-muted text-dark"}`}
                      >
                        <p className="fs-05em text-start">  {elementoSeleccionado[0]?.seR_NOMBRE_DESTINO + " " + elementoSeleccionado[0]?.deP_NOMBRE_DESTINO || "Sin Información"}</p>
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
        </Modal.Body>
      </Modal>

    </Layout >
  );
};

const mapStateToProps = (state: RootState) => ({
  listadoTraslados: state.listadoTrasladosReducers.listadoTraslados,
  listadoTrasladosAdjuntos: state.listadoTrasladosAdjuntosReducers.listadoTrasladosAdjuntos,
  token: state.loginReducer.token,
  isDarkMode: state.darkModeReducer.isDarkMode,
  comboServicio: state.comboServicioReducer.comboServicio,
  objeto: state.validaApiLoginReducers,
});

export default connect(mapStateToProps, {
  listadoTrasladosActions,
  registrarMantenedorDependenciasActions,
  obtenerAdjuntosActions
})(ListadoTraslados);

