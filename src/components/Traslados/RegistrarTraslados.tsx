import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import { Row, Col, Collapse, Button, } from "react-bootstrap";
import { connect } from "react-redux";
import Layout from "../../containers/hocs/layout/Layout";
import { RootState } from "../../store";
import { CuentaProps, ListaEspecie, SERVICIO } from "../Inventario/RegistrarInventario/Datos_cuenta";
import { comboServicioActions } from "../../redux/actions/Inventario/Combos/comboServicioActions";
import { ArrowBarDown, ArrowBarUp, ArrowUp, CaretDown, CaretUp, CaretUpFill, Dash, Plus } from "react-bootstrap-icons";
import { motion, AnimatePresence, easeInOut, easeOut } from "framer-motion";
import "../../styles/Traslados.css"
// Define el tipo de los elementos del combo `servicio`
interface TrasladosProps {
  comboServicio: SERVICIO[];
  comboServicioActions: () => void;
  // listaEspecie: ListaEspecie[];
  token: string | null;
}
interface BusquedaProps {
  establecimiento: number;
  servicio: number;
  deP_CORR_ORIGEN: number;//departamento
  especie: number;
  aF_CLAVE: number; //nInventario
  marca: string;
  modelo: string;
  serie: string;
}

interface UbicacionDestino {
  servicioDestino: number;
  deP_CORR: number; //departamentoDestino
  enComododato: string;
  traS_CO_REAL: string; //traspasoReal
  traS_MEMO_REF: string;//nMemoRef
  traS_FECHA_MEMO: string; // fechaMemo
  traS_OB: string; //observaciones
}

interface DatosRecepcion {
  traS_NOM_ENTREG: string; //entrgadoPor
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



const RegistrarTraslados: React.FC<TrasladosProps> = ({ comboServicio, comboServicioActions, token }) => {

  const [loading, setLoading] = useState(false); // Estado para controlar la carga
  const [error, setError] = useState<Partial<BusquedaProps> & Partial<UbicacionDestino> & Partial<DatosRecepcion>>({});
  const [Traslados, setTraslados] = useState({
    aF_CLAVE: 0, //nInventario
    deP_CORR_ORIGEN: 0,//departmento
    deP_CORR: 0, //departamento destino
    traS_MEMO_REF: "",
    traS_OB: "",
    marca: "",
    modelo: "",
    serie: "",
    servicio: 0,
    traS_NOM_ENTREG: "",
    traS_NOM_RECIBE: "",
    traS_NOM_AUTORIZA: "",
    n_TRASLADO: 0
  });
  useEffect(() => {
    if (token) {
      // Verifica si las acciones ya fueron disparadas
      if (comboServicio.length === 0) comboServicioActions();
    }
  }, [comboServicioActions]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTraslados((prevTraslado) => ({
      ...prevTraslado,
      [name]: value,
    }));
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
    console.log("formulario", Traslados)
  }

  return (
    <Layout>
      <form onSubmit={handleFormSubmit}>
        <div className="border-bottom shadow-sm p-4 rounded">
          <h3 className="form-title fw-semibold border-bottom p-1">Registrar Traslados</h3>
          {/* Fila 1 */}
          <div className="mb-3 border p-1 rounded-4">
            <div className="d-flex justify-content-between align-items-center m-1 p-3 hover-effect rounded-4" onClick={() => toggleRow("fila1")}>
              <h5 className="text-muted fw-semibold">Parámetros de Búsqueda</h5>
              {isExpanded.fila1 ? (
                <CaretUpFill className="flex-shrink-0 h-5 w-5" aria-hidden="true" />
              ) : (
                <CaretDown className="flex-shrink-0 h-5 w-5" aria-hidden="true" />
              )}
            </div>
            <Collapse in={isExpanded.fila1} dimension="height" >
              <div className="border-top">
                <Row className="p-1">
                  <Col>
                    <div className="mb-1">
                      <label className=" text-muted fw-semibold">Establecimiento</label>
                      <select
                        aria-label="servicio"
                        className={`form-select ${error.servicio ? "is-invalid" : ""
                          }`}
                        name="servicio"
                        onChange={handleChange}
                        value={Traslados.servicio}
                      >
                        <option value="">Seleccione un origen</option>
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
                        <div className="invalid-feedback">{error.servicio}</div>
                      )}
                    </div>
                    <div className="mb-1">
                      <label className=" text-muted fw-semibold">Servicio</label>
                      <select
                        aria-label="servicio"
                        className={`form-select ${error.servicio ? "is-invalid" : ""
                          }`}
                        name="servicio"
                        onChange={handleChange}
                        value={Traslados.servicio}
                      >
                        <option value="">Seleccione un origen</option>
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
                        <div className="invalid-feedback">{error.servicio}</div>
                      )}
                    </div>
                    <div className="mb-1">
                      <label className="text-muted fw-semibold">Departamento</label>
                      <select
                        aria-label="deP_CORR_ORIGEN"
                        className={`form-select ${error.servicio ? "is-invalid" : ""
                          }`}
                        name="deP_CORR_ORIGEN"
                        onChange={handleChange}
                        value={Traslados.deP_CORR_ORIGEN}
                      >
                        <option value="">Seleccione un origen</option>
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
                        <div className="invalid-feedback">{error.servicio}</div>
                      )}
                    </div>
                    <div className="mb-1">
                      <label className="text-muted fw-semibold">Especie</label>
                      <select
                        aria-label="servicio"
                        className={`form-select ${error.servicio ? "is-invalid" : ""
                          }`}
                        name="servicio"
                        onChange={handleChange}
                        value={Traslados.servicio}
                      >
                        <option value="">Seleccione un origen</option>
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
                        <div className="invalid-feedback">{error.servicio}</div>
                      )}
                    </div>
                  </Col>
                  <Col>
                    <div className="mb-1">
                      <label className="text-muted fw-semibold">N° Inventario</label>
                      <input
                        aria-label="aF_CLAVE"
                        type="text"
                        className={`form-control ${error.aF_CLAVE ? "is-invalid" : ""
                          }`}
                        maxLength={20}
                        name="aF_CLAVE"
                        onChange={handleChange}
                        value={Traslados.aF_CLAVE}
                      />
                      {error.aF_CLAVE && (
                        <div className="invalid-feedback">{error.aF_CLAVE}</div>
                      )}
                    </div>
                    <div className="mb-1">
                      <label className="text-muted fw-semibold">Marca</label>
                      <input
                        aria-label="marca"
                        type="text"
                        className={`form-control ${error.marca ? "is-invalid" : ""
                          }`}
                        maxLength={50}
                        name="marca"
                        onChange={handleChange}
                        value={Traslados.marca}
                      />
                      {error.aF_CLAVE && (
                        <div className="invalid-feedback">{error.marca}</div>
                      )}
                    </div>
                    <div className="mb-1">
                      <label className="text-muted fw-semibold">Modelo</label>
                      <input
                        aria-label="modelo"
                        type="text"
                        className={`form-control ${error.modelo ? "is-invalid" : ""
                          }`}
                        maxLength={50}
                        name="modelo"
                        onChange={handleChange}
                        value={Traslados.modelo}
                      />
                      {error.aF_CLAVE && (
                        <div className="invalid-feedback">{error.modelo}</div>
                      )}
                    </div>
                    <div className="mb-1">
                      <label className="text-muted fw-semibold">Serie</label>
                      <input
                        aria-label="serie"
                        type="text"
                        className={`form-control ${error.serie ? "is-invalid" : ""
                          }`}
                        maxLength={50}
                        name="serie"
                        onChange={handleChange}
                        value={Traslados.serie}
                      />
                      {error.aF_CLAVE && (
                        <div className="invalid-feedback">{error.serie}</div>
                      )}
                    </div>
                  </Col>
                </Row>
              </div>
            </Collapse>
          </div>

          {/* Fila 2 */}
          <div className="mb-3 border p-1 rounded-4">
            <div className="d-flex justify-content-between align-items-center m-1 p-3 hover-effect rounded-4" onClick={() => toggleRow("fila2")}>
              <h5 className="text-muted fw-semibold">Seleccione ubicación de destino </h5>
              {isExpanded.fila2 ? (
                <CaretUpFill className="flex-shrink-0 h-5 w-5" aria-hidden="true" />
              ) : (
                <CaretDown className="flex-shrink-0 h-5 w-5" aria-hidden="true" />
              )}
            </div>
            <Collapse in={isExpanded.fila2} >
              <div className="border-top">
                <Row className="p-1">
                  <Col>
                    <div className="mb-1">
                      <label className="text-muted fw-semibold">Servicio</label>
                      <select
                        aria-label="servicio"
                        className={`form-select ${error.servicio ? "is-invalid" : ""
                          }`}
                        name="servicio"
                        onChange={handleChange}
                        value={Traslados.servicio}
                      >
                        <option value="">Seleccione un origen</option>
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
                        <div className="invalid-feedback">{error.servicio}</div>
                      )}
                    </div>
                    <div className="mb-3">
                      <label className="text-muted fw-semibold">Departamento</label>
                      <select
                        aria-label="deP_CORR"
                        className={`form-select ${error.deP_CORR ? "is-invalid" : ""
                          }`}
                        name="deP_CORR"
                        onChange={handleChange}
                        value={Traslados.deP_CORR}
                      >
                        <option value="">Seleccione un origen</option>
                        {comboServicio.map((traeServicio) => (
                          <option
                            key={traeServicio.codigo}
                            value={traeServicio.codigo}
                          >
                            {traeServicio.nombrE_ORD}
                          </option>
                        ))}
                      </select>
                      {error.deP_CORR && (
                        <div className="invalid-feedback">{error.deP_CORR}</div>
                      )}
                    </div>
                    <div className="mb-1 p-2 d-flex justify-content-center">
                      <div className="form-check">
                        <input aria-label="comoDato" className="form-check-input m-1" type="radio" name="flexRadioDefault" />
                        <label className="form-check-label text-muted fw-semibold" >
                          En Comodato
                        </label>
                      </div>
                      <div className="form-check">
                        <input aria-label="traspasoReal" className="form-check-input m-1" type="radio" name="flexRadioDefault" checked />
                        <label className="form-check-label text-muted fw-semibold">
                          Traspaso Real
                        </label>
                      </div>
                    </div>
                  </Col>
                  <Col>
                    <div className="mb-1">
                      <label className="text-muted fw-semibold">N° Memo Ref</label>
                      <input
                        aria-label="traS_MEMO_REF"
                        type="text"
                        className={`form-control ${error.traS_MEMO_REF ? "is-invalid" : ""
                          }`}
                        maxLength={50}
                        name="traS_MEMO_REF"
                        onChange={handleChange}
                        value={Traslados.traS_MEMO_REF}
                      />
                      {error.traS_MEMO_REF && (
                        <div className="invalid-feedback">{error.traS_MEMO_REF}</div>
                      )}
                    </div>
                    <div className="mb-1">
                      <label className="text-muted fw-semibold">Fecha Memo</label>
                      <input
                        aria-label="fechaFactura"
                        type="date"
                        className="form-control"
                        // className={`form-control ${error.fechaFactura ? "is-invalid" : ""}`}
                        name="fechaFactura"
                        onChange={handleChange}
                      // value={Inventario.fechaFactura}
                      />
                      {/* {error.fechaFactura && (
                  <div className="invalid-feedback">{error.fechaFactura}</div>
                )} */}
                    </div>
                    <div className="mb-1">
                      <label className=" text-muted fw-semibold">Observaciones</label>
                      <textarea
                        className={`form-control ${error.traS_OB ? "is-invalid" : ""}`}
                        aria-label="traS_OB"
                        name="traS_OB"
                        rows={4}
                        maxLength={500}
                        style={{ minHeight: "8px", resize: "none" }}
                        onChange={handleChange}
                        value={Traslados.traS_OB}
                      />
                      {error.traS_OB && (
                        <div className="invalid-feedback">
                          {error.traS_OB}
                        </div>
                      )}
                    </div>

                  </Col>
                </Row>
              </div>
            </Collapse>
          </div>
          {/* Fila 3 */}
          <div className="mb-3 border p-1 rounded-4">
            <div className="d-flex justify-content-between align-items-center m-1 p-3 hover-effect rounded-4" onClick={() => toggleRow("fila3")}>
              <h5 className="text-muted fw-semibold">Datos de recepción </h5>
              {isExpanded.fila3 ? (
                <CaretUpFill className="flex-shrink-0 h-5 w-5" aria-hidden="true" />
              ) : (
                <CaretDown className="flex-shrink-0 h-5 w-5" aria-hidden="true" />
              )}
            </div>
            <Collapse in={isExpanded.fila3} >
              <div className="border-top">
                <Row className="p-1">
                  <Col>
                    <div className="mb-1">
                      <label className="text-muted fw-semibold">Entregado Por</label>
                      <input
                        aria-label="traS_NOM_ENTREG"
                        type="text"
                        className={`form-control ${error.traS_NOM_ENTREG ? "is-invalid" : ""
                          }`}
                        maxLength={50}
                        name="traS_NOM_ENTREG"
                        onChange={handleChange}
                        value={Traslados.traS_NOM_ENTREG}
                      />
                      {error.traS_NOM_ENTREG && (
                        <div className="invalid-feedback">{error.traS_NOM_ENTREG}</div>
                      )}
                    </div>
                    <div className="mb-1">
                      <label className="text-muted fw-semibold">Recibido Por</label>
                      <input
                        aria-label="traS_NOM_RECIBE"
                        type="text"
                        className={`form-control ${error.traS_NOM_RECIBE ? "is-invalid" : ""
                          }`}
                        maxLength={50}
                        name="traS_NOM_RECIBE"
                        onChange={handleChange}
                        value={Traslados.traS_NOM_RECIBE}
                      />
                      {error.traS_NOM_RECIBE && (
                        <div className="invalid-feedback">{error.traS_NOM_RECIBE}</div>
                      )}
                    </div>
                    <div className="mb-1">
                      <label className="text-muted fw-semibold">Jefe que Autoriza</label>
                      <input
                        aria-label="traS_NOM_AUTORIZA"
                        type="text"
                        className={`form-control ${error.traS_NOM_AUTORIZA ? "is-invalid" : ""
                          }`}
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
                    <div className="mb-1">
                      <label className="text-muted fw-semibold">Nª de Traslado</label>
                      <p>{Traslados.n_TRASLADO}</p>
                    </div>
                  </Col>
                </Row>
              </div>
            </Collapse>
          </div>
          {/* Botón de Validar */}
          <div className="rounded bg-white d-flex justify-content-end m-2">
            <button type="submit" className="btn btn-primary">
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
  comboServicio: state.comboServicioReducer.comboServicio,
});

export default connect(mapStateToProps, {
  comboServicioActions
})(RegistrarTraslados);
