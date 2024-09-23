import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useMemo, useEffect } from 'react';
import { Modal, Button, Table, Form, Pagination, Row, Col } from 'react-bootstrap';
import { PencilFill } from 'react-bootstrap-icons';
import { RootState } from '../../store';
import { connect, useDispatch } from 'react-redux';
import { FormularioCompleto } from '../../components/Inventario/FormularioCompleto';
import { setTotalActivoFijo, postFormulario } from '../../redux/actions/Inventario/Datos_inventariosActions';


interface ActivoFijo {
  id: string;
  vidaUtil: string;
  fechaIngreso: string;
  marca: string;
  cantidad: string;
  modelo: string;
  observaciones: string;
  serie: string;
  precio: string;
  general: string;

}

interface Datos_activo_fijoProps {
  onNext: (data: ActivoFijo[]) => void;
  onBack: () => void;
  montoRecepcion: string; //declaro un props para traer montoRecepción del estado global
  totalAF: number;
  formularioCompleto: FormularioCompleto;
}
interface GeneralErrors {
  general?: string; // Agrega un campo para Error generales
}

const Datos_activo_fijo: React.FC<Datos_activo_fijoProps> = ({ onNext, onBack, montoRecepcion, totalAF, formularioCompleto }) => {
  const [activosFijos, setActivosFijos] = useState<ActivoFijo[]>([]);
  const [currentActivo, setCurrentActivo] = useState<ActivoFijo>({
    id: '', vidaUtil: '', fechaIngreso: '', marca: '', cantidad: '',
    modelo: '', observaciones: '', serie: '', precio: '', general: ''
  });

  const [error, Error] = useState<Partial<ActivoFijo>>({});
  //Modal
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarModalConfirmar, setMostrarModalConfirmar] = useState(false);
  //Tabla
  const [editingSerie, setEditingSerie] = useState<string | null>(null);
  const [filasSeleccionadas, setFilasSeleccionadas] = useState<string[]>([]);
  const [paginaActual, setCurrentPage] = useState(1);
  const [elementosPorPagina] = useState(10);

  const [total, setTotal] = useState<number>(0);


  const dispatch = useDispatch();
  const precio = parseFloat(currentActivo.precio) || 0;
  const cantidad = parseInt(currentActivo.cantidad, 10) || 0;

  // Calcular el total cuando cambien la cantidad o el precio
  useEffect(() => {
    const newTotal = cantidad * precio;
    setTotal(newTotal);
  }, [cantidad, precio]);
  //---------------------------------------------------------//

  //Validaciones
  const validate = () => {
    let tempErrors: Partial<ActivoFijo> & GeneralErrors = {};
    if (!currentActivo.vidaUtil) tempErrors.vidaUtil = "Vida útil es obligatoria";
    if (!/^\d+$/.test(currentActivo.vidaUtil)) tempErrors.vidaUtil = "Vida útil debe ser un número";
    if (!currentActivo.fechaIngreso) tempErrors.fechaIngreso = "Fecha de Ingreso es obligatoria";
    if (!currentActivo.marca) tempErrors.marca = "Marca es obligatoria";
    if (!currentActivo.modelo) tempErrors.modelo = "Modelo es obligatoria";
    if (!currentActivo.serie) tempErrors.serie = "Serie es obligatoria";
    if (!currentActivo.cantidad) tempErrors.cantidad = "Cantidad es obligatoria";
    if (!/^\d+$/.test(currentActivo.cantidad)) tempErrors.cantidad = "Cantidad debe ser un número";
    if (!currentActivo.precio) tempErrors.precio = "Precio es obligatorio";
    if (!/^\d+(\.\d{1,2})?$/.test(currentActivo.precio)) tempErrors.precio = "Precio debe ser un número válido con hasta dos decimales";
    if (!currentActivo.observaciones) tempErrors.observaciones = "Observaciones es obligatoria";

    // Validación para el total activo fijo
    if (!totalActivoFijo()) {
      tempErrors.general = "El precio y la cantidad ingresados deben coincidir con el monto de recepción, que es de $" + (montoRecepcion);
      // tempErrors.cantidad = " ";
      // tempErrors.precio = " ";
      console.log("monto recepcion", montoRecepcion)
    }

    Error(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  // Función para verificar si el total coincide con el monto de recepción
  const totalActivoFijo = () => {
    return total === parseFloat(montoRecepcion);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let counter = 0;
    const generateCorrelativeId = () => {
      counter += 1;
      return String(counter);
    };

    if (validate()) {
      const newActivos = Array.from({ length: cantidad }, () => ({ ...currentActivo, id: generateCorrelativeId(), }));
      setActivosFijos(prev => [...prev, ...newActivos]);
      setCurrentActivo({
        id: '',
        vidaUtil: '',
        fechaIngreso: '',
        marca: '',
        cantidad: '',
        modelo: '',
        observaciones: '',
        serie: '',
        precio: '',
        general: '',
      });

      dispatch(setTotalActivoFijo(total)); //establece total activo fijo en estado global
      setMostrarModal(false); //Cierra modal
    }
  };

  //handleChange maneja actualizaciones en tiempo real campo por campo
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    // console.log('detectección en tiempo real', { name, value });
    setCurrentActivo(prevData => ({ ...prevData, [name]: value }));
  };

  const handleCambiaSerie = (index: number, newSerie: string) => {
    setActivosFijos(prevActivos =>
      prevActivos.map((activo, i) =>
        i === index ? { ...activo, serie: newSerie } : activo
      )
    );
  };

  //-------------Funciones de la tabla --------------------//
  const handleSerieBlur = () => {
    setEditingSerie(null);
  };

  const setSeleccionaFilas = (index: number) => {
    setFilasSeleccionadas(prev =>
      prev.includes(index.toString()) ? prev.filter(rowIndex => rowIndex !== index.toString()) : [...prev, index.toString()]
    );
  };

  const handleSeleccionaTodos = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setFilasSeleccionadas(elementosActuales.map((_, index) => (indicePrimerElemento + index).toString()));
    } else {
      setFilasSeleccionadas([]);
    }
  };

  const handleEliminarSeleccionados = () => {
    const selectedIndices = filasSeleccionadas.map(Number);
    setActivosFijos(prev => prev.filter((_, index) => !selectedIndices.includes(index)));
    setFilasSeleccionadas([]);
  };

  // const handleClone = (activo: ActivoFijo) => {
  //   const clonedActivo = { ...activo };
  //   setActivosFijos(prev => [...prev, clonedActivo]);
  // };

  const handleEliminar = (index: number) => {
    setActivosFijos(prev => prev.filter((_, i) => i !== index));
  };

  //-------------Fin Funciones de la tabla --------------------//

  const handleVolver = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    onBack();
  };

  const handleShowModal = () => {
    onNext(activosFijos);
    setMostrarModalConfirmar(true);
    // console.log("formulario datos activo fijo:", activosFijos);
  };

  const handleFinalSubmit = async () => {
    // Combina todos los datos en un solo objeto
    const total = 0;
    const FormulariosCombinados = {
      ...formularioCompleto.datosInventario,
      ...formularioCompleto.datosCuenta,
      activosFijos: formularioCompleto.datosActivoFijo,
    };
    postFormulario(FormulariosCombinados);
    // Log para verificar los datos combinados
    console.log("Formulario completo combinado:", FormulariosCombinados);
    dispatch(setTotalActivoFijo(total));
    // console.log("Total activo fijo", total);
    // console.log("Formulario reseteado a su estado inicial");

  };


  // Lógica de Paginación actualizada
  const indiceUltimoElemento = paginaActual * elementosPorPagina;
  const indicePrimerElemento = indiceUltimoElemento - elementosPorPagina;
  const elementosActuales = useMemo(() => activosFijos.slice(indicePrimerElemento, indiceUltimoElemento), [activosFijos, indicePrimerElemento, indiceUltimoElemento]);
  const totalPaginas = Math.ceil(activosFijos.length / elementosPorPagina);

  const paginar = (numeroPagina: number) => setCurrentPage(numeroPagina);

  return (
    <>
      {/* Total Activo Fijo*/}
      <div className="justify-content-end navbar navbar-light">
        <div className="navbar-nav mb-2 mb-lg-0 me-3">
          <p className="nav-item nav-link mb-0">
            <strong>Total Activo Fijo:</strong> ${totalAF.toLocaleString('es-ES', { minimumFractionDigits: 0 })}
          </p>
        </div>
      </div>

      <h3 className="form-title mb-4">Detalle Activo</h3>
      {/* Boton abre Modal formulario activos fijo */}
      {total !== parseFloat(montoRecepcion) && (
        <Button variant="primary" onClick={() => setMostrarModal(true)} className="mb-1 me-2">+</Button>
      )}

      {/* Boton elimina filas seleccionadas */}
      {filasSeleccionadas.length > 0 && (
        <Button variant="danger" onClick={handleEliminarSeleccionados} className="mb-1">
          Eliminar Seleccionados
        </Button>
      )}

      {/* Tabla*/}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>
              <Form.Check type="checkbox" onChange={handleSeleccionaTodos} checked={filasSeleccionadas.length === elementosActuales.length && elementosActuales.length > 0} />
            </th>
            <th>Vida Útil</th>
            <th>Fecha Ingreso</th>
            <th>Marca</th>
            <th>Modelo</th>
            <th>Serie</th>
            <th>Precio</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {elementosActuales.map((activo, index) => (
            <tr key={index}>
              <td>
                <Form.Check type="checkbox" onChange={() => setSeleccionaFilas(index)} checked={filasSeleccionadas.includes(index.toString())} />
              </td>
              <td>{activo.vidaUtil}</td>
              <td>{activo.fechaIngreso}</td>
              <td>{activo.marca}</td>
              <td>{activo.modelo}</td>
              <td className="fixed-width" onClick={() => setEditingSerie(index.toString())}>
                {editingSerie === index.toString() ? (
                  <Form.Control
                    type="text"
                    value={activo.serie}
                    onChange={(e) => handleCambiaSerie(index, e.target.value)}
                    onBlur={handleSerieBlur}
                    autoFocus
                    maxLength={10}
                    pattern="\d*"
                  />
                ) : (
                  <span style={{ display: 'flex', alignItems: 'center' }}>
                    {activo.serie || 'editar'}
                    <PencilFill style={{ marginLeft: '8px', color: '#6c757d' }} /> {/* Ícono de lápiz */}
                  </span>
                )}
              </td>
              <td>${parseFloat(activo.precio).toLocaleString('es-ES', { minimumFractionDigits: 0 })}</td>
              <td>
                {/* <Button variant="outline-secondary" size="sm" onClick={() => handleClone(activo)} className="me-2">
                  Clonar
                </Button> */}
                <Button variant="outline-danger" size="sm" onClick={() => handleEliminar(index)}>
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Paginador*/}
      {elementosActuales.length > 0 && (
        <Pagination className="d-flex justify-content-end">
          <Pagination.First onClick={() => paginar(1)} disabled={paginaActual === 1} />
          <Pagination.Prev onClick={() => paginar(paginaActual - 1)} disabled={paginaActual === 1} />
          {Array.from({ length: totalPaginas }, (_, i) => (
            <Pagination.Item key={i + 1} active={i + 1 === paginaActual} onClick={() => paginar(i + 1)}>
              {i + 1}
            </Pagination.Item>
          ))}
          <Pagination.Next onClick={() => paginar(paginaActual + 1)} disabled={paginaActual === totalPaginas} />
          <Pagination.Last onClick={() => paginar(totalPaginas)} disabled={paginaActual === totalPaginas} />
        </Pagination>
      )}

      {/* Botones volver y confirmar*/}
      <div className="d-flex justify-content-end mt-3 justify-content-between">
        <Button onClick={handleVolver} className="btn btn-primary m-1">Volver</Button>

        {elementosActuales.length > 0 && (
          <Button variant="btn btn-primary m-1" onClick={handleShowModal}>Confirmar</Button>
        )}
      </div>

      {/* Modal formulario Activos Fijo*/}
      <Modal show={mostrarModal} onHide={() => setMostrarModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Agregar Activo Fijo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            {error.general && (
              <p className="alert alert-danger">{error.general}</p>
            )}
          </div>
          <form onSubmit={handleSubmit}>
            <Row>
              <div className="d-flex justify-content-end ">
                {/* <Button variant="secondary" onClick={() => setMostrarModal(false)} className="me-2">
                  Cancelar
                </Button> */}
                <Button type="submit" variant="primary">
                  Agregar
                </Button>
              </div>
              <Col md={6}>
                <div className="mb-1">
                  <label htmlFor="vidaUtil" className="form-label">Vida Útil</label>
                  <input type="text" className={`form-control ${error.vidaUtil ? 'is-invalid' : ''}`} id="vidaUtil" name="vidaUtil" onChange={handleChange} value={currentActivo.vidaUtil} />
                  {error.vidaUtil && <div className="invalid-feedback">{error.vidaUtil}</div>}
                </div>

                <div className="mb-1">
                  <label htmlFor="fechaIngreso" className="form-label">Fecha Ingreso</label>
                  <input type="date" className={`form-control ${error.fechaIngreso ? 'is-invalid' : ''}`} id="fechaIngreso" name="fechaIngreso" onChange={handleChange} value={currentActivo.fechaIngreso} />
                  {error.fechaIngreso && <div className="invalid-feedback">{error.fechaIngreso}</div>}
                </div>

                <div className="mb-1">
                  <label htmlFor="marca" className="form-label">Marca</label>
                  <input type="text" className={`form-control ${error.marca ? 'is-invalid' : ''}`} id="marca" name="marca" onChange={handleChange} value={currentActivo.marca} />
                  {error.marca && <div className="invalid-feedback">{error.marca}</div>}
                </div>

                <div className="mb-1">
                  <label htmlFor="modelo" className="form-label">Modelo</label>
                  <input type="text" className={`form-control ${error.modelo ? 'is-invalid' : ''}`} id="modelo" name="modelo" onChange={handleChange} value={currentActivo.modelo} />
                  {error.modelo && <div className="invalid-feedback">{error.modelo}</div>}
                </div>

              </Col>

              <Col md={6}>
                <div className="mb-1">
                  <label htmlFor="serie" className="form-label">Serie</label>
                  <input type="text" className={`form-control ${error.serie ? 'is-invalid' : ''}`} id="serie" name="serie" onChange={handleChange} value={currentActivo.serie} />
                  {error.serie && <div className="invalid-feedback">{error.serie}</div>}
                </div>

                <div className="mb-1">
                  <label htmlFor="precio" className="form-label">Precio</label>
                  <input type="text" className={`form-control ${error.precio ? 'is-invalid' : ''}`} id="precio" name="precio" onChange={handleChange} value={currentActivo.precio} />
                  {error.precio && <div className="invalid-feedback">{error.precio}</div>}
                </div>

                <div className="mb-1">
                  <label htmlFor="cantidad" className="form-label">Cantidad</label>
                  <input type="text" className={`form-control ${error.cantidad ? 'is-invalid' : ''}`} id="cantidad" name="cantidad" onChange={handleChange} value={currentActivo.cantidad} />
                  {error.cantidad && <div className="invalid-feedback">{error.cantidad}</div>}
                </div>

                <div className="mb-1">
                  <label htmlFor="observaciones" className="form-label">Observaciones</label>
                  <textarea className={`form-control ${error.observaciones ? 'is-invalid' : ''}`} id="observaciones" name="observaciones" rows={2} style={{ minHeight: '5px', resize: 'none' }} onChange={handleChange} value={currentActivo.observaciones} />
                  {error.observaciones && <div className="invalid-feedback">{error.observaciones}</div>}
                </div>
              </Col>
            </Row>
          </form>
        </Modal.Body>
      </Modal>


      {/* Modal  Confirmar */}
      <Modal show={mostrarModalConfirmar} onHide={() => setMostrarModalConfirmar(false)} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>
            <svg xmlns="http://www.w3.org/2000/svg" width="29" height="29" fill="currentColor" className="bi bi-exclamation-circle mr-1 mb-1" viewBox="0 0 16 16">
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
              <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0M7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0z" />
            </svg>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>

          <p className="form-heading fs-09em">
            Confirmar el envio del formualrio completo
          </p>
          <form onSubmit={handleSubmit}>
            <div className="form-group d-flex justify-content-center">
              <Button variant="btn btn-primary m-1" onClick={handleFinalSubmit}>Confirmar y Enviar</Button>
              <Button variant="btn btn-secondary m-1" onClick={() => setMostrarModalConfirmar(false)} className="me-2">Cancelar</Button>
            </div>
          </form>

        </Modal.Body>
      </Modal>

    </>
  );
};

const mapStateToProps = (state: RootState) => ({
  montoRecepcion: state.datos_inventarioReducer.montoRecepcion,
  totalAF: state.datos_inventarioReducer.totalActivoFijo,
  resetFormulario: state.datos_inventarioReducer.resetFormulario

});
export default connect(mapStateToProps, {
  setTotalActivoFijo

})(Datos_activo_fijo);