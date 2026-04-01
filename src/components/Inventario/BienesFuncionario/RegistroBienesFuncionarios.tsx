
import React, { useEffect, useMemo, useRef, useState } from "react";
import Layout from "../../../containers/hocs/layout/Layout";
import { Button, Col, Form, Modal, OverlayTrigger, Pagination, Row, Spinner, Tooltip } from "react-bootstrap";
import "../../../styles/BienesFuncionario.css";
import {
  CuentaProps,
  DEPENDENCIA,
  SERVICIO,
} from "../RegistrarInventario/DatosCuenta";
import Swal from "sweetalert2";
import { connect, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../../../store";
import { registrarBienFuncionarioActions } from "../../../redux/actions/Inventario/RegistroBienesFuncionario/registrarBienFuncionarioActions";
import { comboServicioActions } from "../../../redux/actions/Inventario/Combos/comboServicioActions";
import { comboDependenciaActions } from "../../../redux/actions/Inventario/Combos/comboDependenciaActions";
import MenuInventario from "../../Menus/MenuInventario";
import { setDependenciaBienesFuncionarioActions, setRutBienesFuncionarioActions, setServicioBienesFuncionarioActions, setAfCodigoGenericoActions } from "../../../redux/actions/Inventario/RegistroBienesFuncionario/datosRegistroBeneficiarioActions";
import { validate, format } from 'rut.js';
import { Helmet } from "react-helmet-async";
import { listadoBienesFuncionariosActions } from "../../../redux/actions/Inventario/RegistroBienesFuncionario/listadoBienesFuncionariosActions";
import { Search } from "react-bootstrap-icons";
import SkeletonLoader from "../../Utils/SkeletonLoader";
import { InventarioCompleto } from "../AnularInventario";
import { buscarBienesDeFuncionariosActions } from "../../../redux/actions/Inventario/RegistroBienesFuncionario/buscarBienesDeFuncionariosActions";
import { useNavigate } from "react-router-dom";
import { ListadoBienesFuncionarios } from "./ListadoBienesFuncionarios";
import { Objeto } from "../../Navegacion/Profile";

interface FuncionarioProps {
  rutFuncionario?: string;  // Opcional si no siempre es necesario
  servicio: number;
  dependencia: number;
  autorizacion?: string;
  comprobanteDePago?: string;
  afCodigoGenerico?: string;
  archivos?: string; //para manejar error global de adjuntos
}

interface FormFuncionarioProps extends FuncionarioProps {
  comboServicio: SERVICIO[];
  comboDependencia: DEPENDENCIA[];
  buscarBienesFuncionarios: InventarioCompleto[];
  listadoBienesFuncionarios: ListadoBienesFuncionarios[];
  comboServicioActions: (establ_corr: number) => void;
  comboDependenciaActions: (comboServicio: number) => void; // Nueva prop para pasar el servicio seleccionado
  registrarBienFuncionarioActions: (
    rutFuncionario: string,
    comboServicio: number,
    comboDependencia: number,
    comprobanteDePago: File | null,
    autorizacion: File | null,
    afCodigoGenerico: string
  ) => Promise<boolean>;
  listadoBienesFuncionariosActions: (establ_corr: number) => Promise<boolean>;
  buscarBienesDeFuncionariosActions: (establ_corr: number) => Promise<InventarioCompleto[] | null>;
  token: string | null;
  isDarkMode: boolean;
  objeto: Objeto;
}
const RegistroBienesFuncionarios: React.FC<FormFuncionarioProps> = ({
  objeto,
  comboServicio,
  comboDependencia,
  isDarkMode,
  buscarBienesFuncionarios,
  listadoBienesFuncionarios,
  comboServicioActions,
  comboDependenciaActions,
  registrarBienFuncionarioActions,
  listadoBienesFuncionariosActions,
  buscarBienesDeFuncionariosActions
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const fileInputRef1 = useRef<HTMLInputElement>(null);
  const fileInputRef2 = useRef<HTMLInputElement>(null);
  const [selectedFileComprobante, setSelectedFileComprobante] = useState<File | null>(null);
  const [selectedFileAutorizacion, setSelectedFileAutorizacion] = useState<File | null>(null);
  const [isDraggingComprobante, setIsDraggingComprobante] = useState(false);
  const [isDraggingAutorizacion, setIsDraggingAutorizacion] = useState(false);
  const [error, setError] = useState<Partial<FuncionarioProps> & Partial<CuentaProps> & {}>({});
  const [mostrarMensaje, setMostrarMensaje] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingBuscarInventario, setLoadingBuscarInventario] = useState(false);
  const [mostrarModalInventarios, setMostrarModalInventarios] = useState(false);
  const [paginaActual, setPaginaActual] = useState(1);
  const [terminoBusqueda, setTerminoBusqueda] = useState("");
  const [Paginacion, setPaginacion] = useState({ nPaginacion: 10 });
  const elementosPorPagina = Paginacion.nPaginacion;
  const [filasSeleccionadas, setFilasSeleccionadas] = useState<string[]>([]);
  const [elementoSeleccionado, setElementoSeleccionado] = useState<InventarioCompleto>();
  const navigate = useNavigate();
  const [Funcionario, setFuncionario] = useState<FuncionarioProps>({
    rutFuncionario: "",
    servicio: 0,
    dependencia: 0,
    comprobanteDePago: "",
    autorizacion: "",
    afCodigoGenerico: ""
  });

  const datosFiltrados = useMemo(() => {
    if (!terminoBusqueda.trim()) {
      return buscarBienesFuncionarios;
    }

    const termino = terminoBusqueda.toLowerCase();
    return buscarBienesFuncionarios.filter((item) => {
      // Función auxiliar para convertir código de usuario a nombre

      return (
        item.aF_CODIGO_GENERICO.toString().includes(termino) ||
        item.deP_NOMBRE.toLowerCase().includes(termino) ||
        item.esP_NOMBRE.toLowerCase().includes(termino)
      );
    });
  }, [buscarBienesFuncionarios, terminoBusqueda]);

  // Lógica de Paginación actualizada
  const indiceUltimoElemento = paginaActual * elementosPorPagina;
  const indicePrimerElemento = indiceUltimoElemento - elementosPorPagina;
  const elementosActuales = useMemo(() => datosFiltrados.slice(indicePrimerElemento, indiceUltimoElemento),
    [datosFiltrados, indicePrimerElemento, indiceUltimoElemento]
  );
  // const totalPaginas = Math.ceil(datosInventarioCompleto.length / elementosPorPagina);
  const totalPaginas = Array.isArray(datosFiltrados)
    ? Math.ceil(datosFiltrados.length / elementosPorPagina)
    : 0;
  const paginar = (numeroPagina: number) => setPaginaActual(numeroPagina);

  useEffect(() => {
    // carga inicial de combos
    if (comboServicio.length === 0) {
      comboServicioActions(objeto.Roles[0].codigoEstablecimiento);
    }

    autoBienesFuncionario();
    setPaginaActual(1);
  }, [buscarBienesFuncionarios, mostrarMensaje, elementoSeleccionado, terminoBusqueda, isDarkMode]);

  const autoBienesFuncionario = async () => {
    // Si ya se mostró el mensaje o no hay afCodigoGenerico, no hacer nada
    if (mostrarMensaje) return;
    const listadoBusqueda = await buscarBienesDeFuncionariosActions(objeto.Roles[0].codigoEstablecimiento);

    if (listadoBusqueda) {
      const ultimoRegistro = listadoBusqueda[0];
      const aF_CODIGO_GENERICO = (ultimoRegistro as InventarioCompleto).aF_CODIGO_GENERICO;
      const seR_CORR = (ultimoRegistro as InventarioCompleto).seR_CORR;
      const deP_CORR = (ultimoRegistro as InventarioCompleto).deP_CORR;

      comboDependenciaActions(seR_CORR);

      setFuncionario((Prev) => ({
        ...Prev,
        afCodigoGenerico: aF_CODIGO_GENERICO,
        servicio: seR_CORR,
        dependencia: deP_CORR
      }));

      Swal.fire({
        icon: "info",
        title: "Inventario encontrado",
        html: `Se ha agregado al formulario el último inventario registrado <b>Nº ${ultimoRegistro.aF_CODIGO_GENERICO}</b> correspondiente a un bien de funcionario. Si desea cambiarlo, utilice la búsqueda.`,
        background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
        color: `${isDarkMode ? "#ffffff" : "000000"}`,
        confirmButtonColor: `${isDarkMode ? "#6c757d" : "#0d6efd"}`,
        customClass: { popup: "custom-border" },
      });
    }
    else {
      return;
    }
    setMostrarMensaje(true);
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let newValue = value;

    setFuncionario((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    setPaginacion((preBajas) => ({
      ...preBajas,
      [name]: newValue,
    }));

    if (name === "rutFuncionario") {
      setFuncionario((prevState) => ({
        ...prevState,
        rutFuncionario: format(newValue),
      }));
      dispatch(setRutBienesFuncionarioActions(format(newValue)));
    }
    if (name === "servicio") {
      comboDependenciaActions(Number(value));
      dispatch(setServicioBienesFuncionarioActions(parseInt(value)));
    }
    if (name === "dependencia") {
      dispatch(setDependenciaBienesFuncionarioActions(parseInt(value)));
    }
    if (name === "afCodigoGenerico") {
      dispatch(setAfCodigoGenericoActions(value));
    }
    // Verificar si es un input de tipo "file" y si tiene archivos seleccionados
    if (e.target instanceof HTMLInputElement && e.target.type === "file") {
      const file = e.target.files?.[0];
      if (file) {
        // Si el archivo es válido, establecerlo en el estado correspondiente
        if (name === "comprobanteDePago") {
          setSelectedFileComprobante(file);
          setError({ ...error, comprobanteDePago: "" }); // Limpiar errores si el archivo es válido
        } else if (name === "autorizacion") {
          setSelectedFileAutorizacion(file);
          setError({ ...error, autorizacion: "" }); // Limpiar errores si el archivo es válido
        }
      }
    }
  };

  const validateForm = () => {
    let tempErrors: Partial<any> & {} = {};
    const allowelabelypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "image/jpeg",
      "image/png",
      "image/jpg",
    ];

    // Validaciones de campos obligatorios
    if (!Funcionario.rutFuncionario) tempErrors.rutFuncionario = "Campo obligatorio.";
    else if (!validate(Funcionario.rutFuncionario)) {
      tempErrors.rutFuncionario = "El rut es incorrecto";
    }
    if (!Funcionario.afCodigoGenerico) tempErrors.afCodigoGenerico = "Campo obligatorio.";
    if (!Funcionario.servicio) tempErrors.servicio = "Campo obligatorio.";
    if (!Funcionario.dependencia) tempErrors.dependencia = "Campo obligatorio.";

    // Validación: Al menos un documento debe estar presente
    const tieneAutorizacion = Funcionario.autorizacion && selectedFileAutorizacion;
    const tieneComprobante = Funcionario.comprobanteDePago && selectedFileComprobante;

    if (!tieneAutorizacion && !tieneComprobante) {
      tempErrors.archivos = "Debe adjuntar al menos un documento (Comprobante de Pago o Autorización).";
    }

    // Validación de tipo de archivo para autorización (solo si se envió)
    if (selectedFileAutorizacion && !allowelabelypes.includes(selectedFileAutorizacion.type)) {
      tempErrors.autorizacion = "Solo se permiten archivos PDF, DOCX o JPG.";
    }

    // Validación de tipo de archivo para comprobante (solo si se envió)
    if (selectedFileComprobante && !allowelabelypes.includes(selectedFileComprobante.type)) {
      tempErrors.comprobanteDePago = "Solo se permiten archivos PDF, DOCX o JPG.";
    }

    setError(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };
  //----------------Comprobante de Pago --------------//
  //Habilita el estado arrastrar
  const handleDragOverComprobante = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingComprobante(true);
  };
  //Adjuntar por arrastre
  const handleDropComprobante = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingComprobante(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      setSelectedFileComprobante(file);

      // Actualiza el estado del funcionario con el archivo en el campo comprobanteDePago
      setFuncionario((prevFuncionario) => ({
        ...prevFuncionario,
        comprobanteDePago: file.name,
      }));
    }
  };
  //Adjuntar por click
  const handleFileSelectComprobante = () => {
    if (fileInputRef1.current) {
      fileInputRef1.current.click();
    }
  };
  //----------------Fin Comprobante de Pago --------------//

  //----------------Autorización --------------//
  //Habilita el estado arrastrar
  const handleDragOverAutorizacion = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingAutorizacion(true);
  };
  //Adjuntar por arrastre
  const handleDropAutorizacion = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingAutorizacion(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      setSelectedFileAutorizacion(file);

      // Actualiza el estado del funcionario con el archivo en el campo comprobanteDePago
      setFuncionario((prevFuncionario) => ({
        ...prevFuncionario,
        autorizacion: file.name,
      }));
    }
  };
  //Adjuntar por click
  const handleFileSelectAutorizacion = () => {
    if (fileInputRef2.current) {
      fileInputRef2.current.click();
    }
  };

  //----------------Fin Autorización --------------//
  const handleFormSubmit = async () => {
    if (validateForm()) {
      const result = await Swal.fire({
        icon: "info",
        title: "Confirmar registro",
        text: "¿Desea registrar los bienes del funcionario con la información proporcionada?",
        showCancelButton: true,
        confirmButtonText: "Confirmar y registrar",
        cancelButtonText: "Cancelar",
        background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
        color: `${isDarkMode ? "#ffffff" : "000000"}`,
        confirmButtonColor: `${isDarkMode ? "#6c757d" : "#0d6efd"}`,
        customClass: {
          popup: "custom-border", // Clase personalizada para el borde
        }
      });
      if (result.isConfirmed) {
        setLoading(true);
        console.log(Funcionario.rutFuncionario,
          Funcionario.servicio,
          Funcionario.dependencia,
          selectedFileComprobante,
          selectedFileAutorizacion,
          Funcionario.afCodigoGenerico);
        const resultado = await registrarBienFuncionarioActions(
          Funcionario.rutFuncionario || "",
          Funcionario.servicio,
          Funcionario.dependencia,
          selectedFileComprobante,
          selectedFileAutorizacion,
          Funcionario.afCodigoGenerico || ""
        );

        if (resultado) {
          Swal.fire({
            icon: "success",
            title: "Registro exitoso",
            text: `Se ha registrado con exito el bien del funcionario asociado al número de inventario ${Funcionario.afCodigoGenerico}`,
            background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
            color: `${isDarkMode ? "#ffffff" : "000000"}`,
            confirmButtonColor: `${isDarkMode ? "#6c757d" : "#0d6efd"}`,
            customClass: {
              popup: "custom-border", // Clase personalizada para el borde
            }
          });
          listadoBienesFuncionariosActions(objeto.Roles[0].codigoEstablecimiento)
          dispatch(setRutBienesFuncionarioActions(""));
          dispatch(setServicioBienesFuncionarioActions(0));
          dispatch(setDependenciaBienesFuncionarioActions(0));
          setSelectedFileComprobante(null);
          setSelectedFileAutorizacion(null);
          setFuncionario({
            ...Funcionario,
            rutFuncionario: "",
            servicio: 0,
            dependencia: 0,
            comprobanteDePago: "",
            autorizacion: "",
            afCodigoGenerico: ""
          });
          setLoading(false);
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Hubo un problema al enviar el registro.",
            background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
            color: `${isDarkMode ? "#ffffff" : "000000"}`,
            confirmButtonColor: `${isDarkMode ? "#6c757d" : "#0d6efd"}`,
            customClass: {
              popup: "custom-border", // Clase personalizada para el borde
            }
          });
          setLoading(false);
        }
      }
    }
  };

  const handleBuscarInventario = async (e: React.KeyboardEvent<HTMLInputElement> | React.MouseEvent<HTMLButtonElement>) => {

    e.preventDefault();
    setLoadingBuscarInventario(true);
    const resultado = await buscarBienesDeFuncionariosActions(objeto.Roles[0].codigoEstablecimiento);
    if (!resultado) {
      Swal.fire({
        icon: "warning",
        title: "Sin Resultados",
        text: "Inventarios no encontrados",
        confirmButtonText: "Ok",
        background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
        color: `${isDarkMode ? "#ffffff" : "000000"}`,
        confirmButtonColor: `${isDarkMode ? "#6c757d" : "#0d6efd"}`,
        customClass: {
          popup: "custom-border",
        }
      });
      setMostrarModalInventarios(true);
      setLoadingBuscarInventario(false);

      // return;
    } else {
      setFilasSeleccionadas([]);
      setMostrarModalInventarios(true);
      setLoadingBuscarInventario(false);
    }
  };

  //Selecciona fila del listado inventarios
  const handleSeleccionFilaInventario = async (aF_CODIGO_GENERICO: string) => {
    const item = buscarBienesFuncionarios.find(
      (x) => x.aF_CODIGO_GENERICO.toString() === aF_CODIGO_GENERICO
    );

    setFilasSeleccionadas([aF_CODIGO_GENERICO.toString()]);
    setElementoSeleccionado(item);
    const resultado = await listadoBienesFuncionariosActions(objeto.Roles[0].codigoEstablecimiento);


    if (resultado) {
      //Comparar listado de bienes con numero de inventario con los registrados para evitar duplicidad
      const itemListadosRegistrados = listadoBienesFuncionarios.find(
        (x) => x.aF_CODIGO_GENERICO.toString() === aF_CODIGO_GENERICO
      );
      console.log("item", itemListadosRegistrados?.aF_CODIGO_GENERICO);

      if (itemListadosRegistrados?.aF_CODIGO_GENERICO == item?.aF_CODIGO_GENERICO) {
        console.log("AF_codigo_generico ya existe");
      }
      else {
        console.log("AF_codigo_generico no existe");
      }
    }
  };

  const handleInventarioSeleccionado = () => {
    if (typeof elementoSeleccionado === "object" && elementoSeleccionado !== null) {
      const af_codigo_generico = (elementoSeleccionado as InventarioCompleto).aF_CODIGO_GENERICO;
      const seR_CORR = (elementoSeleccionado as InventarioCompleto).seR_CORR;
      const deP_CORR = (elementoSeleccionado as InventarioCompleto).deP_CORR;

      comboDependenciaActions(seR_CORR);
      // Actualiza el estado según la seleccion
      setFuncionario((Prev) => ({
        ...Prev,
        afCodigoGenerico: af_codigo_generico,
        servicio: seR_CORR,
        dependencia: deP_CORR
      }));
      // console.log(Funcionario)
      setMostrarModalInventarios(false);
    }
  };

  return (
    <Layout>
      <Helmet>
        <title>Bienes de Funcionarios</title>
      </Helmet>
      <MenuInventario />
      <div className="table-responsive position-relative z-0 hide-scrollbar" >
        <div style={{ maxHeight: "80vh" }}>

          <div className={`border border-botom p-2 rounded ${isDarkMode ? "darkModePrincipal text-light border-secondary" : ""}`}>
            <h4 className="text-lg-start text-center fw-semibold border-bottom p-1">
              Registro Bienes de Funcionarios
            </h4>
            <div className={`d-flex flex-column flex-md-row align-items-center 
                 bg-light border-start border-4 border-warning shadow-sm rounded p-2 gap-2 mb-2`}>
              <p className="fw-semibold  small text-dark">
                Para registrar nuevos bienes de funcionarios, primero debe crear su número de inventario
              </p>
              <Button
                onClick={() => navigate("/Inventario/FormInventario")}
                className={`btn ${isDarkMode ? "btn-secondary" : "btn-primary"} px-4 fw-semibold`}
              >
                Aquí
              </Button>
            </div>

            <Row className="d-flex">
              <Col md={4}>
                <div className="mb-1">
                  <label htmlFor="rutFuncionario" className="fw-semibold">Rut Funcionario</label>
                  <input
                    aria-label="rutFuncionario"  // Asociado al label
                    type="text"
                    className={`form-select ${isDarkMode ? "bg-dark text-light border-secondary" : ""
                      } ${error.rutFuncionario ? "is-invalid" : ""} w-100`}
                    maxLength={12}
                    size={10}
                    name="rutFuncionario"
                    onChange={handleChange}
                    value={Funcionario.rutFuncionario || ""}
                    placeholder="12.345.678-9"
                  />
                  {error.rutFuncionario && (
                    <div className="invalid-feedback fw-semibold d-block">
                      {error.rutFuncionario}
                    </div>
                  )}
                </div>
                <div className="mb-1">
                  <label className="fw-semibold">
                    Nº de inventario
                  </label>
                  <div className="d-flex align-items-center">
                    <input
                      aria-label="afCodigoGenerico"
                      type="text"
                      className={`form-control ${isDarkMode ? "bg-dark text-light border-secondary" : ""}`}
                      maxLength={12}
                      name="afCodigoGenerico"
                      placeholder="Eje: 1000000008"
                      onChange={handleChange}
                      value={Funcionario.afCodigoGenerico || ""}
                      disabled
                    />
                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip id="tooltip-limpiar">Buscar Inventario</Tooltip>}
                    >
                      <Button
                        onClick={handleBuscarInventario}
                        variant="primary"
                        className={`btn ${isDarkMode ? "btn-secondary" : "btn-primary"}  ms-1`}
                      >
                        {loadingBuscarInventario ? (
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
                            className="flex-shrink-0 h-5 w-5"
                            aria-hidden="true"
                          />
                        )}
                      </Button>
                    </OverlayTrigger>
                  </div>
                  {error.afCodigoGenerico && (
                    <div className="invalid-feedback fw-semibold d-block">
                      {error.afCodigoGenerico}
                    </div>
                  )}
                </div>

                <div className={`border p-2 ${isDarkMode ? "border-secondary" : ""} ${error.servicio ? "is-invalid" : ""}`} >
                  <h6 className="text-center fw-semibold">Destino</h6>
                  <div className="mb-1">
                    <label htmlFor="servicio" className="fw-semibold fw-semibold">Servicio</label>
                    <select
                      aria-label="servicio"
                      className={`form-select ${isDarkMode ? "bg-dark text-light border-secondary" : ""} ${error.servicio ? "is-invalid" : ""}`}
                      name="servicio"
                      onChange={handleChange}
                      value={Funcionario.servicio || 0}
                    >
                      <option value="">Seleccione</option>
                      {comboServicio.map((traeServicio) => (
                        <option
                          key={traeServicio.codigo}
                          value={traeServicio.codigo}
                        >
                          {traeServicio.nombrE_ORD}
                        </option>
                      ))}
                    </select>
                    {error.servicio && (
                      <div className="invalid-feedback fw-semibold d-block">
                        {error.servicio}
                      </div>
                    )}
                  </div>
                  <div className="mb-1">
                    <label htmlFor="dependencia" className="fw-semibold">Dependencia</label>
                    <select
                      aria-label="dependencia"
                      className={`form-select ${isDarkMode ? "bg-dark text-light border-secondary" : ""
                        } ${error.dependencia ? "is-invalid" : ""}`}
                      name="dependencia"
                      disabled={!Funcionario.servicio}
                      onChange={handleChange}
                      value={Funcionario.dependencia || 0}
                    >
                      <option value="">Selecciona una opción</option>
                      {comboDependencia.map((traeDependencia) => (
                        <option
                          key={traeDependencia.deP_CORR}
                          value={traeDependencia.deP_CORR}
                        >
                          {traeDependencia.descripcion}
                        </option>
                      ))}
                    </select>
                    {error.dependencia && (
                      <div className="invalid-feedback fw-semibold d-block">
                        {error.dependencia}
                      </div>
                    )}
                  </div>
                </div>
              </Col>

              <Col md={8}>
                <div className="d-lg-flex d-sm-none gap-4 p-1">
                  <div className="mb-1 w-100">
                    <label htmlFor="comprobanteDePago" className="fw-semibold ">Comprobante de Pago</label>
                    <div
                      className={`dropzone p-1 ${isDraggingComprobante ? "dragging" : ""
                        }`}
                      onDrop={handleDropComprobante}
                      onDragOver={handleDragOverComprobante}
                      onClick={handleFileSelectComprobante}
                    >
                      {selectedFileComprobante ? (
                        <p className="file-name fw-semibold">{selectedFileComprobante.name}</p>
                      ) : (
                        <p className="file-name fw-semibold">
                          Arrastra y suelta el archivo aquí, o haz clic para
                          seleccionar
                        </p>
                      )}
                    </div>
                    <input
                      aria-label="comprobanteDePago"
                      type="file"
                      ref={fileInputRef1} // Asigna la referencia al input
                      className={`file-input ${error.comprobanteDePago ? "is-invalid" : ""
                        } w-100`}
                      name="comprobanteDePago"
                      onChange={handleChange}
                      accept=".pdf, .docx, .jpg" // Solo permite los tipos de archivos especificados
                      value=""
                    />
                    {error.comprobanteDePago && (
                      <div className="invalid-feedback fw-semibold d-block">
                        {error.comprobanteDePago}
                      </div>
                    )}
                  </div>

                  <div className="mb-1 w-100">
                    <label htmlFor="autorizacion" className="fw-semibold">Autorización</label>
                    <div
                      className={`dropzone p-1 ${isDraggingAutorizacion ? "dragging" : ""
                        }`}
                      onDrop={handleDropAutorizacion}
                      onDragOver={handleDragOverAutorizacion}
                      onClick={handleFileSelectAutorizacion}
                    >
                      {selectedFileAutorizacion ? (
                        <p className="file-name fw-semibold">{selectedFileAutorizacion.name}</p>
                      ) : (
                        <p className="file-name fw-semibold">
                          Arrastra y suelta el archivo aquí, o haz clic para
                          seleccionar
                        </p>
                      )}
                    </div>
                    <input
                      aria-label="autorizacion"
                      type="file"
                      ref={fileInputRef2} // Asigna la referencia al input
                      className={`file-input ${error.autorizacion ? "is-invalid" : ""
                        } w-100`}
                      name="autorizacion"
                      onChange={handleChange}
                      accept=".pdf, .docx, .jpg" // Solo permite los tipos de archivos especificados
                      value=""
                    />
                    {error.autorizacion && (
                      <div className="invalid-feedback fw-semibold d-block">
                        {error.autorizacion}
                      </div>
                    )}
                  </div>
                </div>
                {/* Mensaje de error global para documentos */}
                {error.archivos && (
                  <div className="alert alert-danger alert-dismissible fade show mt-2 mb-0 py-2" role="alert">
                    <i className="bi bi-exclamation-triangle"></i>
                    {error.archivos}
                  </div>
                )}
              </Col>
            </Row>
            <div className="d-flex justify-content-end p-1">
              <Button type="submit" onClick={handleFormSubmit} className={`btn ${isDarkMode ? "btn-secondary" : "btn-primary"}`}>Validar</Button>
            </div>
          </div>
        </div>
      </div>


      {/* Modal lista seleccion Inventario */}
      <Modal show={mostrarModalInventarios} onHide={() => setMostrarModalInventarios(false)}
        size="xl"
        dialogClassName="draggable-modal"
      // scrollable={false}
      // backdrop="static" // Evita que se cierre al hacer clic afuera
      // keyboard={false}
      >
        <Modal.Header className={`modal-header`} closeButton>
          <Modal.Title className="fw-semibold">Resultado Busqueda</Modal.Title>
        </Modal.Header>
        <Modal.Body className={`${isDarkMode ? "darkModePrincipal" : ""}`}>
          <div className="bg-white shadow-sm sticky-top">
            <Row className="g-2 align-items-center flex-column flex-lg-row justify-content-between mb-2">
              <Col xs={12} lg="auto" className="flex-grow-1">
                <div className="position-relative">
                  <Search
                    className="position-absolute top-50 start-0 translate-middle-y ms-3"
                    size={18}
                    style={{ color: isDarkMode ? "#adb5bd" : "#6c757d" }}
                  />
                  <Form.Control
                    type="text"
                    placeholder="Buscar en todas las columnas..."
                    value={terminoBusqueda}
                    onChange={(e) => setTerminoBusqueda(e.target.value)}
                    className={`ps-5 ${isDarkMode ? "bg-dark text-light border-secondary" : ""}`}
                    style={{ maxWidth: "400px" }}
                  />
                </div>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                {buscarBienesFuncionarios.length > 10 &&
                  < div className="d-flex align-items-center me-2">
                    <label htmlFor="nPaginacion" className="form-label fw-semibold mb-0 me-2">
                      Tamaño de página:
                    </label>
                    <select
                      aria-label="Seleccionar tamaño de página"
                      className={`form-select form-select-sm w-auto ${isDarkMode ? "bg-dark text-light border-secondary" : ""}`}
                      name="nPaginacion1"
                      onChange={handleChange}
                      value={Paginacion.nPaginacion}
                    >
                      {[10, 15, 20, 25, 50, 100].map((val) => (
                        <option key={val} value={val}>{val}</option>
                      ))}
                    </select>
                  </div>
                }
              </Col>
              <Col md={6} className="d-flex justify-content-end">
                {filasSeleccionadas.length > 0 ? (
                  <Button
                    variant={`${isDarkMode ? "secondary" : "primary"}`}
                    onClick={handleInventarioSeleccionado}
                    className="m-1 p-2 d-flex align-items-center">
                    Seleccionar
                  </Button>
                ) : (
                  <strong className="alert alert-dark border m-1 p-2 mx-2">
                    No hay filas seleccionadas
                  </strong>
                )}
              </Col>
            </Row>

            <div className="mb-2">
              <small className={`${isDarkMode ? "text-light" : "text-muted"}`}>
                Mostrando {datosFiltrados.length} de {buscarBienesFuncionarios.length} registros
              </small>
            </div>

          </div>

          {/* Tabla*/}
          {loadingBuscarInventario ? (
            <>
              <SkeletonLoader rowCount={10} columnCount={10} />
            </>
          ) : (
            <>
              {buscarBienesFuncionarios.length > 0 ? (
                <>
                  <div className='table-responsive position-relative z-0'>
                    <table className={`table ${isDarkMode ? "table-dark" : "table-hover table-striped "}`} >
                      <thead className={`sticky-top ${isDarkMode ? "table-dark" : "text-dark table-light "}`}>
                        <tr>
                          <th scope="col" className="text-nowrap"></th>
                          <th scope="col" className="text-nowrap">Nº Inventario</th>
                          <th scope="col" className="text-nowrap">Servicio / Dependencia</th>
                          <th scope="col" className="text-nowrap">Especie</th>
                          <th scope="col" className="text-nowrap">Cuenta</th>
                        </tr>
                      </thead>
                      <tbody>
                        {elementosActuales.map((lista, index) => {
                          return (
                            <tr key={index}>
                              <td style={{ position: 'sticky', left: 0 }}>
                                <Form.Check
                                  type="checkbox"
                                  onChange={() => handleSeleccionFilaInventario(lista.aF_CODIGO_GENERICO)}
                                  checked={filasSeleccionadas.includes(lista.aF_CODIGO_GENERICO.toString())}
                                />
                              </td>
                              <td className="text-nowrap">{lista.aF_CODIGO_GENERICO}</td>
                              <td className="text-nowrap">{lista.deP_NOMBRE}</td>
                              <td className="text-nowrap">{lista.esP_NOMBRE}</td>
                              <td className="text-nowrap">{lista.ctA_COD}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
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
                </>
              ) : (
                <p className={`text-center  pt-1 pb-1 mb-1 rounded border-0 fs-09em fw-semibold ${isDarkMode ? 'bg-dark text-light border border-secondary' : 'bg-light text-muted border'}`}>
                  No hay resultados para mostrar.
                </p>
              )}
            </>
          )}
        </Modal.Body>
      </Modal>
      {loading && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1050,
          }}
        >
          <div className="text-center">
            <div className="spinner-border text-light mb-3" role="status" style={{ width: "3rem", height: "3rem" }} />
            <p className="text-white fw-semibold mb-0">Enviando, un momento...</p>
          </div>
        </div>
      )}
    </Layout>
  );
};

const mapStateToProps = (state: RootState) => ({
  token: state.loginReducer.token,
  comboServicio: state.comboServicioReducer.comboServicio,
  comboDependencia: state.comboDependenciaReducer.comboDependencia,
  rutFuncionario: state.datosBienesFuncionarioReducers.rutFuncionario,
  servicio: state.datosBienesFuncionarioReducers?.servicio || 0,
  dependencia: state.datosBienesFuncionarioReducers?.dependencia || 0,
  isDarkMode: state.darkModeReducer.isDarkMode,
  objeto: state.validaApiLoginReducers,
  buscarBienesFuncionarios: state.buscarBienesFuncionariosReducers.buscarBienesFuncionarios,
  listadoBienesFuncionarios: state.listadoBienesFuncionariosReducers.listadoBienesFuncionarios
});

export default connect(mapStateToProps, {
  comboServicioActions,
  comboDependenciaActions,
  registrarBienFuncionarioActions,
  listadoBienesFuncionariosActions,
  buscarBienesDeFuncionariosActions
})(RegistroBienesFuncionarios);
