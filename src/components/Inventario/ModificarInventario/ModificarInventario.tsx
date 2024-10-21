import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useMemo, useState } from "react";
import { Button, Table, Form, Row, Col, Modal, Pagination } from "react-bootstrap";
import { RootState } from "../../../store";
import { connect } from "react-redux";
import Layout from "../../../hooks/layout/Layout";
import { obtenerInventarioActions } from "../../../redux/actions/Inventario/obtenerInventarioActions";
import { MODALIDAD, ORIGEN } from "../RegistrarInventario/Datos_inventario";
import { BIEN, CUENTA, DEPENDENCIA, DETALLE, ListaEspecie, SERVICIO } from "../RegistrarInventario/Datos_cuenta";
import { comboDependenciaActions } from "../../../redux/actions/combos/comboDependenciaActions";
import Swal from "sweetalert2";
import { comboDetalleActions } from "../../../redux/actions/combos/comboDetalleActions";
import { comboListadoDeEspeciesBienActions } from "../../../redux/actions/combos/comboListadoDeEspeciesBienActions";
import { comboCuentaActions } from "../../../redux/actions/combos/comboCuentaActions";
import { Pencil, Plus } from "react-bootstrap-icons";

export interface InventarioCompleto {
  aF_CLAVE: number;
  aF_CODIGO_GENERICO: string;
  aF_CODIGO_LARGO: string;
  deP_CORR: number;
  esP_CODIGO_M: string;
  aF_SECUENCIA: number;
  itE_CLAVE: number;
  aF_DESCRIPCION: string;
  aF_FINGRESO: string;
  aF_ESTADO: string;
  aF_CODIGO: string;
  aF_TIPO: string;
  aF_ALTA: string;
  aF_PRECIO_REF: number;
  aF_CANTIDAD: number;
  aF_ORIGEN: number;
  aF_RESOLUCION: string;
  aF_FECHA_SOLICITUD: string;
  aF_OCO_NUMERO_REF: string;
  usuariO_CREA: string;
  f_CREA: string;
  iP_CREA: string;
  usuariO_MOD: string;
  f_MOD: string;
  iP_MODt: string;
  aF_TIPO_DOC: number;
  proV_RUN: number;
  reG_EQM: string;
  aF_NUM_FAC: string;
  aF_FECHAFAC: string;
  aF_3UTM: string;
  iD_GRUPO: number;
  ctA_COD: string;
  transitoria: string;
  aF_MONTOFACTURA: number;
  esP_DESCOMPONE: string;
  aF_ETIQUETA: string;
  aF_VIDAUTIL: number;
  aF_VIGENTE: string;
  idprograma: number;
  idmodalidadcompra: number;
  idpropiedad: number;
  especie: string;
  deT_MARCA: string;
  deT_MODELO: string;
  deT_SERIE: string;
  deT_LOTE: string;
  deT_OBS: string;
  iP_MOD: string;
  deT_PRECIO: number;
  deT_RECEPCION: number;
  propietario: number;
  tipopropietario: number;
}

interface InventarioCompletoProps {
  datosInventarioCompleto: InventarioCompleto[];
  comboOrigen: ORIGEN[];
  comboModalidad: MODALIDAD[];
  comboServicio: SERVICIO[];
  comboDependencia: DEPENDENCIA[];
  comboCuenta: CUENTA[];
  comboBien: BIEN[];
  comboDetalle: DETALLE[];
  listaEspecie: ListaEspecie[];
  comboDependenciaActions: (comboServicio: string) => void; // Nueva prop para pasar el servicio seleccionado
  obtenerInventarioActions: (aF_CLAVE: number) => Promise<boolean>;
  comboDetalleActions: (bienSeleccionado: string) => void
  comboListadoDeEspeciesBienActions: (EST: number, IDBIEN: string) => Promise<void>;
  comboCuentaActions: (nombreEspecie: string) => void

  descripcionEspecie: string; // se utiliza solo para guardar la descripcion completa en el input de especie
}

const ModificarInventario: React.FC<InventarioCompletoProps> = ({
  datosInventarioCompleto,
  comboOrigen,
  comboModalidad,
  comboServicio,
  comboDependencia,
  comboCuenta,
  comboBien,
  comboDetalle,
  listaEspecie,
  descripcionEspecie,
  comboDependenciaActions,
  obtenerInventarioActions,
  comboDetalleActions,
  comboListadoDeEspeciesBienActions,
  comboCuentaActions
}) => {
  const [Inventario, setInventario] = useState({
    aF_CLAVE: 0,
    aF_FINGRESO: '',
    aF_ORIGEN: 0,
    aF_NUM_FAC: '',
    aF_MONTOFACTURA: 0,
    proV_RUN: 0,
    idmodalidadcompra: 0,
    aF_FECHAFAC: '',
    deP_CORR: 0,
    esP_CODIGO_M: ''



  });
  const [Especies, setEspecies] = useState({
    estableEspecie: 0,
    codigoEspecie: "",
    nombreEspecie: "",
    descripcionEspecie: ""
  });

  const [mostrarModal, setMostrarModal] = useState(false);
  const [filasSeleccionadas, setFilasSeleccionadas] = useState<string[]>([]);
  const [elementoSeleccionado, setElementoSeleccionado] = useState<ListaEspecie>();
  const [paginaActual, setPaginaActual] = useState(1);
  const elementosPorPagina = 350;
  const [isDisabled, setIsDisabled] = useState(true);
  const [isDisabledNInventario, setIsDisabledNInventario] = useState(false);
  const [error, setError] = useState<Partial<InventarioCompleto> & {}>({});
  const classNames = (...classes: (string | boolean | undefined)[]): string => {
    return classes.filter(Boolean).join(' ');
  };

  // Asegúrate de que el array tiene datos
  const index = 0; // Cambia esto al índice que desees
  const ultimoDatoInventarioCompleto = datosInventarioCompleto[datosInventarioCompleto.length - 1] || '';
  const aF_CLAVE = datosInventarioCompleto[index]?.aF_CLAVE || 0;
  const aF_FINGRESO = datosInventarioCompleto[index]?.aF_FINGRESO
    ? new Date(datosInventarioCompleto[index]?.aF_FINGRESO).toISOString().split('T')[0]
    : '';

  const aF_ORIGEN = ultimoDatoInventarioCompleto?.aF_ORIGEN || 0;
  const aF_NUM_FAC = ultimoDatoInventarioCompleto?.aF_NUM_FAC || '';
  const aF_MONTOFACTURA = ultimoDatoInventarioCompleto?.aF_MONTOFACTURA || 0;
  const proV_RUN = ultimoDatoInventarioCompleto?.proV_RUN || 0;
  const idmodalidadcompra = ultimoDatoInventarioCompleto?.idmodalidadcompra || 0;
  const aF_FECHAFAC = ultimoDatoInventarioCompleto?.aF_FECHAFAC
    ? new Date(ultimoDatoInventarioCompleto?.aF_FECHAFAC).toISOString().split('T')[0]
    : '';
  const deP_CORR = ultimoDatoInventarioCompleto?.deP_CORR || 0;



  useEffect(() => {
    setInventario({
      aF_CLAVE,
      aF_FINGRESO,
      aF_ORIGEN,
      aF_NUM_FAC,
      aF_MONTOFACTURA,
      proV_RUN,
      idmodalidadcompra,
      aF_FECHAFAC,
      deP_CORR
    });
  }, [
    aF_CLAVE,
    aF_FINGRESO,
    aF_ORIGEN,
    aF_NUM_FAC,
    aF_MONTOFACTURA,
    proV_RUN,
    idmodalidadcompra,
    aF_FECHAFAC,
    deP_CORR
  ]);
  const validate = () => {
    let tempErrors: Partial<any> & {} = {};
    // Validación para N° de Recepción (debe ser un número)
    if (!Inventario.aF_FINGRESO) tempErrors.aF_FINGRESO = "La fecha de Recepción es obligatorio.";
    if (!Inventario.aF_ORIGEN) tempErrors.aF_ORIGEN = "El Origen de Presupuesto es obligatorio.";
    if (!Inventario.aF_NUM_FAC) tempErrors.aF_NUM_FAC = "El N° de Factura es obligatorio.";
    if (!Inventario.aF_MONTOFACTURA) tempErrors.montoRecepcion = "El Monto de Recepción es obligatorio.";
    else if (!/^\d+(\.\d{1,2})?$/.test(String(Inventario.aF_MONTOFACTURA))) tempErrors.montoRecepcion =
      "El Monto debe ser un número válido con hasta dos decimales.";
    if (!Inventario.proV_RUN) tempErrors.proV_RUN = "El Rut del Proveedor es obligatorio.";
    if (!Inventario.idmodalidadcompra) tempErrors.idmodalidadcompra = "La Modalidad de Compra es obligatoria.";
    if (!Inventario.aF_FECHAFAC) tempErrors.aF_FECHAFAC = "La Fecha de Recepción es obligatoria.";

    setError(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validate()) {

    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setInventario((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    if (name === 'servicio') {
      comboDependenciaActions(value);
    }

    if (name === 'bien') {
      comboDetalleActions(value);
      console.log("Código del bien seleccionado:", value);
    }
    if (name === 'detalles') {
      comboListadoDeEspeciesBienActions(1, value);
      console.log("Código del detalle seleccionado:", value);
    }
  };
  //Se usa useEffect en este caso de Especie ya que por handleChange no detecta el cambio
  // debido que este se pasa por una seleccion desde el modal en la selccion que se hace desde el listado
  useEffect(() => {
    // Detecta si el valor de 'especie' ha cambiado
    if (Especies.codigoEspecie) {
      comboCuentaActions(Especies.codigoEspecie); // aqui le paso codigo de detalle
      console.log("Código de especie seleccionado:", Especies.codigoEspecie);
    }

  }, [Especies.codigoEspecie]);


  const handleInventarioSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!Inventario.aF_CLAVE) {
      Swal.fire({
        icon: "warning",
        title: "Por favor, ingrese un número de inventario",
        confirmButtonText: "Ok",
      });
      return;
    }
    const resultado = await obtenerInventarioActions(Inventario.aF_CLAVE);
    if (!resultado) {
      Swal.fire({
        icon: "error",
        title: "No se encontraron resultados, inténtelo con otro registro. ",
        confirmButtonText: "Ok",
      });
      setIsDisabled(true);
      setIsDisabledNInventario(false)

    }
    else {
      setIsDisabled(false);
      setIsDisabledNInventario(true)
    }
    console.log("array", datosInventarioCompleto);
  };

  const handleInventarioCambiarSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    //Limpia todo el formulario
  }


  const handleSubmitSeleccionado = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (typeof elementoSeleccionado === 'object' && elementoSeleccionado !== null) {
      const estableEspecie = (elementoSeleccionado as ListaEspecie).estabL_CORR;
      const codigoEspecie = (elementoSeleccionado as ListaEspecie).esP_CODIGO;
      const nombreEspecie = `${(elementoSeleccionado as ListaEspecie).nombrE_ESP}`;
      const descripcionEspecie = (elementoSeleccionado as ListaEspecie).esP_CODIGO + " | " + `${(elementoSeleccionado as ListaEspecie).nombrE_ESP}`;
      // Actualiza tanto el estado 'Especies' como el estado 'Cuenta.especie'
      setEspecies({ estableEspecie, codigoEspecie, nombreEspecie, descripcionEspecie });
      setInventario(inventarioPrevia => ({
        ...inventarioPrevia,
        especie: estableEspecie.toString(),  // Actualiza el campo 'especie' en el estado de 'Inventario'
      }));
      // Resetea el estado de las filas seleccionadas para desmarcar el checkbox
      setFilasSeleccionadas([]);

      setMostrarModal(false); // Cierra el modal
    } else {
      console.log("No se ha seleccionado ningún elemento.");
    }
  };
  //Selecciona fila del listado de especies
  const handleSeleccionFila = (index: number) => {
    const item = listaEspecie[index];
    setFilasSeleccionadas([index.toString()]);
    setElementoSeleccionado(item);
    // console.log("Elemento seleccionado", item);
  };
  // Lógica de Paginación actualizada
  const indiceUltimoElemento = paginaActual * elementosPorPagina;
  const indicePrimerElemento = indiceUltimoElemento - elementosPorPagina;
  const elementosActuales = useMemo(() => listaEspecie.slice(indicePrimerElemento, indiceUltimoElemento), [listaEspecie, indicePrimerElemento, indiceUltimoElemento]);
  const totalPaginas = Math.ceil(listaEspecie.length / elementosPorPagina);
  // const totalPaginas = Array.isArray(listaEspecie) ? Math.ceil(listaEspecie.length / elementosPorPagina) : 0;


  const paginar = (numeroPagina: number) => setPaginaActual(numeroPagina);
  return (
    <Layout>
      <form onSubmit={handleSubmit}>
        <div className="border-top p-1 rounded">
          <h3 className="form-title">Modificar Inventario</h3>

          <div className="shadow-sm p-5 m-1">
            <Row>
              <Col md={4}>
                <div className="mb-1">
                  <dt className="text-muted">N° Inventario</dt>
                  <div className="d-flex align-items-center">
                    <input type="text" className="form-control" disabled={isDisabledNInventario} maxLength={12} name="aF_CLAVE" placeholder="Buscar inventario" onChange={handleChange} value={Inventario.aF_CLAVE || aF_CLAVE} />

                    {isDisabledNInventario == true ? (
                      <Button onClick={handleInventarioCambiarSubmit} variant="primary" className="ms-1" >
                        <Pencil className={classNames('flex-shrink-0', 'h-5 w-5')} aria-hidden="true" />
                      </Button>
                    ) : (
                      <Button onClick={handleInventarioSubmit} variant="primary" className="ms-1" >
                        <Plus className={classNames('flex-shrink-0', 'h-5 w-5')} aria-hidden="true" />
                      </Button>

                    )}
                  </div>
                </div>
                <div className="mb-1">
                  <dt className="text-muted">Fecha Recepción</dt>
                  <input type="date" className={`form-control ${error.aF_FINGRESO ? "is-invalid" : ""} w-100`}
                    maxLength={12} name="aF_FINGRESO" onChange={handleChange} value={Inventario.aF_FINGRESO || aF_FINGRESO}
                    disabled={isDisabled} />
                  {error.aF_FINGRESO && (
                    <div className="invalid-feedback d-block">
                      {error.aF_FINGRESO}
                    </div>
                  )}
                </div>

                <div className="mb-1">
                  <dt className="text-muted">N° Orden de compra</dt>
                  <input type="text" className="form-control" maxLength={12} name="nOrdenCompra" onChange={handleChange} value="" disabled={isDisabled} />
                </div>

                <div className="mb-1">
                  <dt className="text-muted">Nº factura</dt>
                  <input type="text" className={`form-control ${error.aF_NUM_FAC ? "is-invalid" : ""} w-100`} maxLength={12} name="aF_NUM_FAC" onChange={handleChange} value={Inventario.aF_NUM_FAC || aF_NUM_FAC} disabled={isDisabled} />
                </div>

                <div className="mb-1">
                  <dt className="text-muted">Origen Presupuesto</dt>
                  <select className={`form-control ${error.aF_ORIGEN ? "is-invalid" : ""} w-100`} name="aF_ORIGEN" onChange={handleChange} value={Inventario.aF_ORIGEN || aF_ORIGEN} disabled={isDisabled}>
                    <option value="">Seleccione un origen</option>
                    {comboOrigen.map((traeOrigen) => (
                      <option key={traeOrigen.codigo} value={traeOrigen.codigo}>
                        {traeOrigen.descripcion}
                      </option>
                    ))}
                  </select>
                </div>
              </Col>

              <Col md={4}>
                <div className="mb-1">
                  <dt className="text-muted">Monto Recepción</dt>
                  <input type="text" className="form-control" maxLength={12} name="aF_MONTOFACTURA" onChange={handleChange} value={Inventario.aF_MONTOFACTURA || aF_MONTOFACTURA} disabled={isDisabled} />
                </div>

                <div className="mb-1">
                  <dt className="text-muted">Fecha Factura</dt>
                  <input type="date" className="form-control" name="aF_FECHAFAC" onChange={handleChange} value={Inventario.aF_FECHAFAC || aF_FECHAFAC} disabled={isDisabled} />
                </div>

                <div className="mb-1">
                  <dt className="text-muted">Rut Proveedor</dt>
                  <input type="text" className="form-control" maxLength={12} name="proV_RUN" onChange={handleChange} value={Inventario.proV_RUN || proV_RUN} disabled={isDisabled} />
                </div>

                <div className="mb-1">
                  <dt className="text-muted">Nombre Proveedor</dt>
                  <input type="text" className="form-control" maxLength={30} name="nombreProveedor" onChange={handleChange} value="" disabled={isDisabled} />
                </div>

                <div className="mb-1">
                  <dt className="text-muted">Modalida de Compra</dt>
                  <select className="form-control" name="idmodalidadcompra" onChange={handleChange} value={Inventario.idmodalidadcompra || idmodalidadcompra} disabled={isDisabled}>
                    <option value="">Seleccione una modalidad</option>
                    {comboModalidad.map((traeModalidad) => (
                      <option key={traeModalidad.codigo} value={traeModalidad.codigo}>
                        {traeModalidad.descripcion}
                      </option>
                    ))}
                  </select>
                </div>
              </Col>
              <Col md={4}>
                <div className="mb-1">
                  <dt className="text-muted">Servicio</dt>
                  <select className="form-select" name="servicio" onChange={handleChange} value='' disabled={isDisabled}>
                    <option value="">Seleccione un origen</option>
                    {comboServicio.map((traeServicio) => (
                      <option key={traeServicio.codigo} value={traeServicio.codigo}>
                        {traeServicio.nombrE_ORD}
                      </option>
                    ))}
                  </select>

                </div>
                <div className="cmb-1">
                  <dt className="text-muted">Dependencia</dt>
                  <select className="form-select" name="dependencia" onChange={handleChange} value={Inventario.deP_CORR || deP_CORR} disabled={isDisabled}>
                    <option value="" >Selecciona una opción</option>
                    {comboDependencia.map((traeDependencia) => (
                      <option key={traeDependencia.codigo} value={traeDependencia.codigo}>
                        {traeDependencia.nombrE_ORD}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-1">
                  <dt className="text-muted">Cuenta</dt>
                  <select className="form-select" name="cuenta" onChange={handleChange} value='' disabled={isDisabled}>
                    <option value="">Selecciona una opción</option>
                    {comboCuenta.map((traeCuentas) => (
                      <option key={traeCuentas.codigo} value={traeCuentas.codigo}>
                        {traeCuentas.descripcion}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-1">
                  <dt className="text-muted">Especie</dt>
                  <dd className="d-flex align-items-center">
                    <input
                      type="text"
                      name="especie"
                      value={Especies.descripcionEspecie || descripcionEspecie || 'Haz clic en más para seleccionar una especie'}
                      onChange={handleChange}
                      disabled
                      className="form-control"
                    />
                    {/* Botón para abrir el modal y seleccionar una especie */}
                    <Button variant="primary" onClick={() => setMostrarModal(true)} className="ms-1" disabled={isDisabled} >+</Button>
                  </dd>
                </div>
              </Col>
            </Row>
          </div>
          <div className="p-1 rounded bg-white d-flex justify-content-end">
            {isDisabled === false && (
              <button type="submit" className="btn btn-primary">
                Confirmar
              </button>
            )}
          </div>
        </div>
      </form>

      {/* Modal formulario Activos Fijo*/}
      <Modal show={mostrarModal} onHide={() => setMostrarModal(false)} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Listado de Especies</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* <div>
                        {error.general && (
                            <p className="alert alert-danger">{error.general}</p>
                        )}
                    </div> */}
          <form onSubmit={handleSubmitSeleccionado}>
            <Row>
              <div className="d-flex justify-content-end ">
                {/* <Button variant="secondary" onClick={() => setShowModal(false)} className="me-2">
                                    Cancelar
                                </Button> */}
                <Button variant="primary" type="submit">Seleccionar</Button>
              </div>
              <Col md={6}>
                <div className="mb-1">
                  <dt className="text-muted">Bien</dt>
                  <dd className="d-flex align-items-center">
                    <select name="bien" className="form-select" onChange={handleChange} >
                      {comboBien.map((traeBien) => (
                        <option key={traeBien.codigo} value={traeBien.codigo}>
                          {traeBien.descripcion}
                        </option>
                      ))}
                    </select>
                  </dd>
                </div>
                <div className="mb-1">
                  <dt className="text-muted">Detalles</dt>
                  <dd className="d-flex align-items-center">
                    <select name="detalles" className="form-select" onChange={handleChange} >
                      <option value="">Selecciona una opción</option>
                      {comboDetalle.map((traeDetalles) => (
                        <option key={traeDetalles.codigo} value={traeDetalles.codigo}>
                          {traeDetalles.descripcion}
                        </option>
                      ))}
                    </select>
                  </dd>
                </div>
                <div className="mb-1">
                  <dd className="d-flex align-items-center">
                    <input type="text" name="" className="form-control" />
                    <Button variant="primary">Buscar</Button>
                  </dd>
                </div>
              </Col>
            </Row>
          </form>

          {/* Tabla*/}
          <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th></th>
                  <th>Establecimiento</th>
                  <th>Nombre</th>
                  <th>Especie</th>
                </tr>
              </thead>
              <tbody>
                {elementosActuales.map((listadoEspecies, index) => (
                  <tr key={index}>
                    <td>
                      <Form.Check
                        type="checkbox"
                        onChange={() => handleSeleccionFila(indicePrimerElemento + index)}
                        checked={filasSeleccionadas.includes((indicePrimerElemento + index).toString())}
                      />
                    </td>
                    <td>{listadoEspecies.estabL_CORR}</td>
                    <td>{listadoEspecies.esP_CODIGO}</td>
                    <td>{listadoEspecies.nombrE_ESP}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>


          {/* Paginador */}
          < Pagination className="d-flex justify-content-end">
            <Pagination.First onClick={() => paginar(1)} disabled={paginaActual === 1} />
            <Pagination.Prev onClick={() => paginar(paginaActual - 1)} disabled={paginaActual === 1} />

            {Array.from({ length: totalPaginas }, (_, i) => (

              <Pagination.Item
                key={i + 1}
                active={i + 1 === paginaActual}
                onClick={() => paginar(i + 1)}
              >
                {i + 1}
              </Pagination.Item>

            ))}
            <Pagination.Next onClick={() => paginar(paginaActual + 1)} disabled={paginaActual === totalPaginas} />
            <Pagination.Last onClick={() => paginar(totalPaginas)} disabled={paginaActual === totalPaginas} />
          </Pagination>
        </Modal.Body>

      </Modal >
    </Layout>
  );
};

const mapStateToProps = (state: RootState) => ({
  datosInventarioCompleto: state.datosInventarioReducer.datosInventarioCompleto,
  comboOrigen: state.origenPresupuestoReducer.comboOrigen,
  comboServicio: state.comboServicioReducer.comboServicio,
  comboModalidad: state.modalidadCompraReducer.comboModalidad,
  comboCuenta: state.comboCuentaReducer.comboCuenta,
  comboDependencia: state.comboDependenciaReducer.comboDependencia,
  comboDetalle: state.detallesReducer.comboDetalle,
  comboBien: state.detallesReducer.comboBien,
  listaEspecie: state.comboListadoDeEspeciesBien.listadoDeEspecies,
  descripcionEspecie: state.datosRecepcionReducer.descripcionEspecie
});

export default connect(mapStateToProps,
  {
    comboDependenciaActions,
    obtenerInventarioActions,
    comboDetalleActions,
    comboListadoDeEspeciesBienActions,
    comboCuentaActions

  })(ModificarInventario);
