import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import { Row, Col, Collapse } from "react-bootstrap";
import { connect, useDispatch } from "react-redux";
import Layout from "../../containers/hocs/layout/Layout";
import { RootState } from "../../store";
import { CaretDown, CaretUpFill } from "react-bootstrap-icons";

import "../../styles/Traslados.css"
import { comboEstablecimientoActions } from "../../redux/actions/Traslados/Combos/comboEstablecimientoActions";
import { comboTrasladoServicioActions } from "../../redux/actions/Traslados/Combos/comboTrasladoServicioActions";
import { comboTrasladoEspecieActions } from "../../redux/actions/Traslados/Combos/comboTrasladoEspecieActions";
import { Helmet } from "react-helmet-async";
import { DEPENDENCIA } from "../Inventario/RegistrarInventario/DatosCuenta";
import { comboDependenciaOrigenActions } from "../../redux/actions/Traslados/Combos/comboDependenciaoOrigenActions";
import { comboDependenciaDestinoActions } from "../../redux/actions/Traslados/Combos/comboDependenciaDestinoActions";
import MenuTraslados from "../Menus/MenuTraslados";
import { registroTrasladoActions } from "../../redux/actions/Traslados/RegistroTrasladoActions";
import Swal from "sweetalert2";
import { Objeto } from "../Navegacion/Profile";

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
interface BusquedaProps {
  servicioOrigen: number;
  dependenciaOrigen: number; //deP_CORR_ORIGEN
  especie: number;
  aF_CLAVE: number; //nInventario
  marca: string;
  modelo: string;
  serie: string;
}

interface UbicacionDestino {
  servicioDestino: number;
  dependenciaDestino: number; //deP_CORR
  enComododato: string;
  traS_CO_REAL: number; //traspasoReal
  traS_MEMO_REF: string; //nMemoRef
  traS_FECHA_MEMO: string; //fechaMemo
  traS_OBS: string; //observaciones
}

interface DatosRecepcion {
  traS_NOM_ENTREGA: string; //entrgadoPor
  traS_NOM_RECIBE: string; //recibidoPor
  traS_NOM_AUTORIZA: string; //jefeAutoriza
  n_TRASLADO: number; //nTraslado
}

// "usuariO_MOD": "string",
// "usuariO_CREA": "string",
// "traS_FECHA": "2024-12-06T13:34:57.021Z",
// "traS_ESTADO_AF": "string",
// "traS_DET_CORR": 0,
// "traS_CORR": 0,                     
// "iP_MOD": "string",
// "iP_CREA": "string",
// "f_MOD": "2024-12-06T13:34:57.021Z",
// "f_CREA": "2024-12-06T13:34:57.021Z",
// "estaD_D": 0,

interface TrasladosProps {
  comboTrasladoServicio: TRASLADOSERVICIO[];
  comboTrasladoServicioActions: () => void;
  comboEstablecimiento: ESTABLECIMIENTO[];
  comboEstablecimientoActions: () => void;
  comboTrasladoEspecie: TRASLADOESPECIE[];
  comboTrasladoEspecieActions: () => void;
  comboDependenciaOrigen: DEPENDENCIA[];
  comboDependenciaDestino: DEPENDENCIA[];
  comboDependenciaOrigenActions: (comboServicioOrigen: string) => void; // Nueva prop para pasar el servicio seleccionado
  comboDependenciaDestinoActions: (comboServicioDestino: string) => void; // Nueva prop para pasar el servicio seleccionado
  registroTrasladoActions: (FormularioTraslado: Record<string, any>) => Promise<boolean>
  token: string | null;
  isDarkMode: boolean;
  objeto: Objeto;
}


const RegistrarTraslados: React.FC<TrasladosProps> = ({ registroTrasladoActions, comboTrasladoServicioActions, comboEstablecimientoActions, comboTrasladoEspecieActions, comboDependenciaOrigenActions, comboDependenciaDestinoActions, comboTrasladoServicio, comboEstablecimiento, comboTrasladoEspecie, comboDependenciaOrigen, comboDependenciaDestino, objeto, token, isDarkMode }) => {

  // const [loading, setLoading] = useState(false); // Estado para controlar la carga
  const [error, setError] = useState<Partial<BusquedaProps> & Partial<UbicacionDestino> & Partial<DatosRecepcion> & {}>({});
  const [Traslados, setTraslados] = useState({
    aF_CLAVE: 0, //nInventario
    deP_CORR_ORIGEN: 0,//deP_CORR_ORIGEN
    deP_CORR: 0, //deP_CORR
    traS_MEMO_REF: "",
    traS_FECHA_MEMO: "",
    traS_OBS: "",
    marca: "",
    modelo: "",
    serie: "",
    servicioOrigen: 0,
    servicioDestino: 0,
    traS_NOM_ENTREGA: "",
    traS_NOM_RECIBE: "",
    traS_NOM_AUTORIZA: "",
    n_TRASLADO: 0,
    especie: 0,
    usuario_crea: objeto.IdCredencial.toString()
  });
  const validateForm = () => {
    let tempErrors: Partial<any> & {} = {};
    if (!Traslados.servicioOrigen) tempErrors.servicioOrigen = "Campo obligatorio.";
    if (!Traslados.deP_CORR_ORIGEN) tempErrors.deP_CORR_ORIGEN = "Campo obligatorio.";
    if (!Traslados.servicioDestino) tempErrors.servicioDestino = "Campo obligatorio.";
    if (!Traslados.deP_CORR) tempErrors.deP_CORR = "Campo obligatorio.";
    if (!Traslados.traS_NOM_ENTREGA) tempErrors.traS_NOM_ENTREGA = "Campo obligatorio.";
    if (!Traslados.traS_OBS) tempErrors.traS_OBS = "Campo obligatorio.";
    if (!Traslados.traS_MEMO_REF) tempErrors.traS_MEMO_REF = "Campo obligatorio.";
    if (!Traslados.traS_FECHA_MEMO) tempErrors.traS_FECHA_MEMO = "Campo obligatorio.";
    if (!Traslados.traS_NOM_RECIBE) tempErrors.traS_NOM_RECIBE = "Campo obligatorio.";
    if (!Traslados.traS_NOM_AUTORIZA) tempErrors.traS_NOM_AUTORIZA = "Campo obligatorio.";
    // if (!Traslados.n_TRASLADO) tempErrors.n_TRASLADO = "Campo obligatorio.";
    if (!Traslados.especie) tempErrors.especie = "Campo obligatorio.";
    setError(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };
  useEffect(() => {
    if (token) {
      // Verifica si las acciones ya fueron disparadas
      if (comboTrasladoServicio.length === 0) comboTrasladoServicioActions();
      if (comboEstablecimiento.length === 0) comboEstablecimientoActions();
      if (comboTrasladoEspecie.length === 0) comboTrasladoEspecieActions();
    }
  }, [comboTrasladoServicioActions, comboEstablecimientoActions, comboTrasladoEspecieActions]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    // Convierte `value` a número
    let newValue: string | number = ["aF_CLAVE", "deP_CORR_ORIGEN", "deP_CORR", "n_TRASLADO"].includes(name)
      ? parseFloat(value) || 0 // Convierte a `number`, si no es válido usa 0
      : value;

    setTraslados((prevTraslados) => ({
      ...prevTraslados,
      [name]: newValue,
    }));

    if (name === "servicioOrigen") {
      comboDependenciaOrigenActions(value);
    }
    if (name === "servicioDestino") {
      comboDependenciaDestinoActions(value);
    }

  };

  const [isExpanded, setIsExpanded] = useState({
    fila1: false,
    fila2: false,
    fila3: false,
  });

  const toggleRow = (fila: keyof typeof isExpanded) => {
    setIsExpanded((prevState) => ({
      ...prevState,
      [fila]: !prevState[fila],
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
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
          const resultado = await registroTrasladoActions(Traslados);
          if (resultado) {
            Swal.fire({
              icon: "success",
              title: "Registro Exitoso",
              text: `Su formulario ha sido registrado exitosamente`,
              background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
              color: `${isDarkMode ? "#ffffff" : "000000"}`,
              confirmButtonColor: `${isDarkMode ? "#007bff" : "444"}`,
              customClass: { popup: "custom-border" }
            });

          } else {
            Swal.fire({
              icon: "error",
              title: "Error",
              text: "Hubo un problema al enviar el formulario.",
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
  }

  return (
    <Layout>
      <Helmet>
        <title>Registrar Traslados</title>
      </Helmet>
      <MenuTraslados />
      <form onSubmit={handleFormSubmit}>
        <div className={`border p-4 rounded ${isDarkMode ? "darkModePrincipal border-secondary" : ""}`}>
          <h3 className="form-title fw-semibold border-bottom p-1">Registrar Traslados</h3>
          {/* Fila 1 */}
          <div className="mb-3 border p-1 rounded-4">
            <div
              className={`d-flex justify-content-between align-items-center m-1 p-3 hover-effect rounded-4 ${isDarkMode ? "bg-transparent " : ""}`} onClick={() => toggleRow("fila1")}>
              <h5 className="fw-semibold">Parámetros de Búsqueda</h5>
              {isExpanded.fila1 ? (
                <CaretUpFill className="flex-shrink-0 h-5 w-5" aria-hidden="true" />
              ) : (
                <CaretDown className="flex-shrink-0 h-5 w-5" aria-hidden="true" />
              )}
            </div>
            <Collapse in={isExpanded.fila1} dimension="height">
              <div className="border-top">
                <Row className="p-1">
                  <Col>
                    {/* servicio Origen */}
                    <div className="mb-1">
                      <label htmlFor="servicioOrigen" className="fw-semibold fw-semibold">Servicio Origen</label>
                      <select
                        aria-label="servicioOrigen"
                        className={`form-select ${isDarkMode ? "bg-dark text-light border-secondary" : ""} ${error.servicioOrigen ? "is-invalid" : ""}`}
                        name="servicioOrigen"
                        onChange={handleChange}
                        value={Traslados.servicioOrigen || 0}
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
                      {error.servicioOrigen && (
                        <div className="invalid-feedback fw-semibold d-block">
                          {error.servicioOrigen}
                        </div>
                      )}
                    </div>
                    {/* Dependencia/ Departamento */}
                    <div className="mb-1">
                      <label htmlFor="deP_CORR_ORIGEN" className="fw-semibold">Dependencia Origen</label>
                      <select
                        aria-label="deP_CORR_ORIGEN"
                        className={`form-select ${isDarkMode ? "bg-dark text-light border-secondary" : ""} ${error.dependenciaOrigen ? "is-invalid" : ""}`}
                        name="deP_CORR_ORIGEN"
                        disabled={!Traslados.servicioOrigen}
                        onChange={handleChange}
                        value={Traslados.deP_CORR_ORIGEN || 0}
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
                      {error.dependenciaOrigen && (
                        <div className="invalid-feedback fw-semibold d-block">
                          {error.dependenciaOrigen}
                        </div>
                      )}
                    </div>

                    {/* Especie */}
                    <div className="mb-1">
                      <label className="fw-semibold">
                        Especie
                      </label>
                      <select
                        aria-label="especie"
                        className={`form-select ${isDarkMode ? "bg-dark text-light border-secondary" : ""
                          } ${error.especie ? "is-invalid" : ""}`}
                        name="especie"
                        onChange={handleChange}
                        value={Traslados.especie}
                      >
                        <option value="">Seleccione un origen</option>
                        {comboTrasladoEspecie.map((traeEspecie) => (
                          <option key={traeEspecie.codigo} value={traeEspecie.codigo}>
                            {traeEspecie.descripcion}
                          </option>
                        ))}
                      </select>
                      {error.especie && (
                        <div className="invalid-feedback">{error.especie}</div>
                      )}
                    </div>
                  </Col>
                  <Col>
                    {/* N° Inventario */}
                    <div className="mb-1">
                      <label className="fw-semibold">
                        N° Inventario
                      </label>
                      <input
                        aria-label="aF_CLAVE"
                        type="text"
                        className={`form-control ${isDarkMode ? "bg-dark text-light border-secondary" : ""
                          } ${error.aF_CLAVE ? "is-invalid" : ""}`}
                        maxLength={20}
                        name="aF_CLAVE"
                        onChange={handleChange}
                        value={Traslados.aF_CLAVE}
                      />
                      {error.aF_CLAVE && (
                        <div className="invalid-feedback">{error.aF_CLAVE}</div>
                      )}
                    </div>

                    {/* Marca */}
                    <div className="mb-1">
                      <label className="fw-semibold">
                        Marca
                      </label>
                      <input
                        aria-label="marca"
                        type="text"
                        className={`form-control ${isDarkMode ? "bg-dark text-light border-secondary" : ""
                          } ${error.marca ? "is-invalid" : ""}`}
                        maxLength={50}
                        name="marca"
                        onChange={handleChange}
                        value={Traslados.marca}
                      />
                      {error.marca && (
                        <div className="invalid-feedback">{error.marca}</div>
                      )}
                    </div>

                    {/* Modelo */}
                    <div className="mb-1">
                      <label className="fw-semibold">
                        Modelo
                      </label>
                      <input
                        aria-label="modelo"
                        type="text"
                        className={`form-control ${isDarkMode ? "bg-dark text-light border-secondary" : ""
                          } ${error.modelo ? "is-invalid" : ""}`}
                        maxLength={50}
                        name="modelo"
                        onChange={handleChange}
                        value={Traslados.modelo}
                      />
                      {error.modelo && (
                        <div className="invalid-feedback">{error.modelo}</div>
                      )}
                    </div>

                    {/* Serie */}
                    <div className="mb-1">
                      <label className="fw-semibold">
                        Serie
                      </label>
                      <input
                        aria-label="serie"
                        type="text"
                        className={`form-control ${isDarkMode ? "bg-dark text-light border-secondary" : ""
                          } ${error.serie ? "is-invalid" : ""}`}
                        maxLength={50}
                        name="serie"
                        onChange={handleChange}
                        value={Traslados.serie}
                      />
                      {error.serie && (
                        <div className="invalid-feedback">{error.serie}</div>
                      )}
                    </div>
                  </Col>
                </Row>
              </div>
            </Collapse>
          </div>

          {/* Fila 2 */}
          <div className={`mb-3 border p-1 rounded-4 ${isDarkMode ? "darkModePrincipal text-light" : ""}`}>
            <div className={`d-flex justify-content-between align-items-center m-1 p-3 hover-effect rounded-4 ${isDarkMode ? "bg-transparent text-light" : ""}`} onClick={() => toggleRow("fila2")}>
              <h5 className="fw-semibold">Seleccione ubicación de destino</h5>
              {isExpanded.fila2 ? (
                <CaretUpFill className="flex-shrink-0 h-5 w-5" aria-hidden="true" />
              ) : (
                <CaretDown className="flex-shrink-0 h-5 w-5" aria-hidden="true" />
              )}
            </div>
            <Collapse in={isExpanded.fila2}>
              <div className="border-top">
                <Row className="p-1">
                  <Col>
                    {/* Servicio */}
                    <div className="mb-1">
                      <label htmlFor="servicioDestino" className="fw-semibold fw-semibold">Servicio Destino</label>
                      <select
                        aria-label="servicioDestino"
                        className={`form-select ${isDarkMode ? "bg-dark text-light border-secondary" : ""} ${error.servicioDestino ? "is-invalid" : ""}`}
                        name="servicioDestino"
                        onChange={handleChange}
                        value={Traslados.servicioDestino || 0}
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
                      {error.servicioDestino && (
                        <div className="invalid-feedback fw-semibold d-block">
                          {error.servicioDestino}
                        </div>
                      )}
                    </div>
                    {/* Dependencia/ Departamento */}
                    <div className="mb-1">
                      <label htmlFor="deP_CORR" className="fw-semibold">Dependencia Destino</label>
                      <select
                        aria-label="deP_CORR"
                        className={`form-select ${isDarkMode ? "bg-dark text-light border-secondary" : ""} ${error.dependenciaDestino ? "is-invalid" : ""}`}
                        name="deP_CORR"
                        disabled={!Traslados.servicioDestino}
                        onChange={handleChange}
                        value={Traslados.deP_CORR || 0}
                      >
                        <option value="">Seleccionar</option>
                        {comboDependenciaDestino.map((traeDependencia) => (
                          <option
                            key={traeDependencia.codigo}
                            value={traeDependencia.codigo}
                          >
                            {traeDependencia.descripcion}
                          </option>
                        ))}
                      </select>
                      {error.dependenciaDestino && (
                        <div className="invalid-feedback fw-semibold d-block">
                          {error.dependenciaDestino}
                        </div>
                      )}
                    </div>
                    {/* Radios */}
                    <div className="mb-1 p-2 d-flex justify-content-center">
                      <div className="form-check">
                        <input
                          aria-label="traS_CO_REAL"
                          className={`form-check-input ${isDarkMode ? "bg-dark border-secondary" : ""
                            } m-1`}
                          type="radio"
                          name="traS_CO_REAL"
                          value={1}
                        />
                        <label className={`form-check-label fw-semibold ${isDarkMode ? "text-light" : "text-muted"}`}>
                          En Comodato
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          aria-label="traS_CO_REAL"
                          className={`form-check-input ${isDarkMode ? "bg-dark border-secondary" : ""
                            } m-1`}
                          type="radio"
                          name="traS_CO_REAL"
                          value={0}
                          defaultChecked
                        />
                        <label className={`form-check-label fw-semibold ${isDarkMode ? "text-light" : "text-muted"}`}>
                          Traspaso Real
                        </label>
                      </div>
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
                        className={`form-control ${isDarkMode ? "bg-dark text-light border-secondary" : ""
                          } ${error.traS_MEMO_REF ? "is-invalid" : ""}`}
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
                        className={`form-control ${isDarkMode ? "bg-dark text-light border-secondary" : ""
                          } ${error.traS_FECHA_MEMO ? "is-invalid" : ""}`}
                        name="traS_FECHA_MEMO"
                        onChange={handleChange}
                      />
                      {error.traS_FECHA_MEMO && (
                        <div className="invalid-feedback">{error.traS_FECHA_MEMO}</div>
                      )}
                    </div>

                    {/* Observaciones */}
                    <div className="mb-1">
                      <label className="fw-semibold">
                        Observaciones
                      </label>
                      <textarea
                        className={`form-control ${isDarkMode ? "bg-dark text-light border-secondary" : ""
                          } ${error.traS_OBS ? "is-invalid" : ""}`}
                        aria-label="traS_OBS"
                        name="traS_OBS"
                        rows={4}
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
                </Row>
              </div>
            </Collapse>
          </div>

          {/* Fila 3 */}
          <div className={`mb-3 border p-1 rounded-4 ${isDarkMode ? "darkModePrincipal text-light" : ""}`}>
            <div className={`d-flex justify-content-between align-items-center m-1 p-3 hover-effect rounded-4 ${isDarkMode ? "bg-transparent text-light" : ""}`} onClick={() => toggleRow("fila3")}>
              <h5 className="fw-semibold">Datos de recepción</h5>
              {isExpanded.fila3 ? (
                <CaretUpFill className="flex-shrink-0 h-5 w-5" aria-hidden="true" />
              ) : (
                <CaretDown className="flex-shrink-0 h-5 w-5" aria-hidden="true" />
              )}
            </div>
            <Collapse in={isExpanded.fila3}>
              <div className="border-top">
                <Row className="p-1">
                  <Col>
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
                  <Col>
                    {/* N° de Traslado */}
                    <div className="mb-1">
                      <label className="fw-semibold">
                        N° de Traslado
                      </label>
                      <p className={`${isDarkMode ? "text-light" : "text-dark"}`}>
                        {Traslados.n_TRASLADO}
                      </p>
                    </div>
                  </Col>
                </Row>
              </div>
            </Collapse>
          </div>

          {/* Botón de Validar */}
          <div className="rounded d-flex justify-content-end m-2">
            <button type="submit" className={`btn ${isDarkMode ? "btn-secondary" : "btn-primary"}  m-1`}>
              Validar
            </button>
          </div>
        </div>
      </form >
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
  objeto: state.validaApiLoginReducers,
  isDarkMode: state.darkModeReducer.isDarkMode
});

export default connect(mapStateToProps, {
  comboTrasladoServicioActions,
  comboEstablecimientoActions,
  comboTrasladoEspecieActions,
  comboDependenciaOrigenActions,
  comboDependenciaDestinoActions,
  registroTrasladoActions
})(RegistrarTraslados);
