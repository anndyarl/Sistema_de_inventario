import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useMemo, useEffect } from 'react';
import { Modal, Button, Table, Form, Pagination, Row, Col } from 'react-bootstrap';
import { PencilFill } from 'react-bootstrap-icons';
import { RootState } from '../../store';
import { connect, useDispatch } from 'react-redux';

import { setTotalActivoFijoActions, setServicioActions, setDependenciaActions, setCuentaActions, setEspecieActions, setDatosTabla, eliminarActivoDeTabla, eliminarMultiplesActivosDeTabla, actualizarSerieEnTabla, vaciarDatosTabla, setBienActions, setDetalleActions } from '../../redux/actions/Inventario/Datos_inventariosActions';
import { postFormInventarioActions } from '../../redux/actions/Inventario/postFormInventarioActions';

import {
  setNRecepcionActions, setFechaRecepcionActions, setNOrdenCompraActions, setNFacturaActions,
  setOrigenPresupuestoActions, setMontoRecepcionActions, setFechaFacturaActions,
  setRutProveedorActions, setnombreProveedorActions, setModalidadCompraActions
} from '../../redux/actions/Inventario/Datos_inventariosActions';
import { FormInventario } from './FormInventario';

import Swal from 'sweetalert2';

const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}


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
  color?: string;

}

interface Datos_activo_fijoProps {
  onNext: (data: ActivoFijo[]) => void;
  onBack: () => void;
  onReset: () => void; // vuelva a al componente Datos_inventario
  montoRecepcion: number; //declaro un props para traer montoRecepción del estado global 
  formInventario: FormInventario;
  token: string | null;
  nombreEspecie: string[]; //Para obtener del estado global de redux 
  datosTabla: ActivoFijo[];
  general?: string; // Campo para errores generales
  generalTabla?: string;
}

const Datos_activo_fijo: React.FC<Datos_activo_fijoProps> = ({ onNext, onBack, onReset, montoRecepcion, nombreEspecie, formInventario, token, datosTabla }) => {
  const [activosFijos, setActivosFijos] = useState<ActivoFijo[]>([]);

  const [currentActivo, setCurrentActivo] = useState<ActivoFijo>({
    id: '', vidaUtil: '', fechaIngreso: '', marca: '', cantidad: '',
    modelo: '', observaciones: '', serie: '', precio: '', especie: ''
  });
  const dispatch = useDispatch();

  const [error, setError] = useState<Partial<ActivoFijo> & { general?: string, generalTabla?: string }>({});
  //-------Modal-------//
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarModalConfirmar, setMostrarModalConfirmar] = useState(false);
  //-------Fin Modal-------//

  //-------Tabla-------//
  const [editingSerie, setEditingSerie] = useState<string | null>(null);
  const [filasSeleccionadas, setFilasSeleccionadas] = useState<string[]>([]);
  const [paginaActual, setCurrentPage] = useState(1);
  const [elementosPorPagina] = useState(10);
  // const [total, setTotal] = useState<number>(0);
  //-------Fin Tabla-------//

  const precio = parseFloat(currentActivo.precio) || 0;
  const cantidad = parseInt(currentActivo.cantidad, 10) || 0;

  // Combina el estado local de react con el estado local de redux
  const datos = useMemo(() => {
    return datosTabla.length > 0 ? datosTabla : activosFijos;
  }, [datosTabla, activosFijos]);

  const indiceUltimoElemento = paginaActual * elementosPorPagina;
  const indicePrimerElemento = indiceUltimoElemento - elementosPorPagina;
  const elementosActuales = useMemo(() =>
    datos.slice(indicePrimerElemento, indiceUltimoElemento),
    [datos, indicePrimerElemento, indiceUltimoElemento]
  );
  const totalPaginas = Math.ceil(datos.length / elementosPorPagina);

  // Calcula el total del precio de la tabla
  const totalSum = useMemo(() => {
    return datos.reduce((sum, activo) => sum + parseFloat(activo.precio), 0);
  }, [datos]);

  // Calcular el total de cantidad por el precio
  const newTotal = cantidad * precio;
  const pendiente = montoRecepcion - totalSum;



  //---------------------------------------------------------//

  //Validaciones
  const validate = () => {
    let tempErrors: Partial<ActivoFijo> & { general?: string } = {};
    if (!currentActivo.vidaUtil) tempErrors.vidaUtil = "Vida útil es obligatoria";
    if (!/^\d+$/.test(currentActivo.vidaUtil)) tempErrors.vidaUtil = "Vida útil debe ser un número";
    if (!currentActivo.fechaIngreso) tempErrors.fechaIngreso = "Fecha de Ingreso es obligatoria";
    if (!currentActivo.marca) tempErrors.marca = "Marca es obligatoria";
    if (!currentActivo.modelo) tempErrors.modelo = "Modelo es obligatoria";
    // if (!currentActivo.serie) tempErrors.serie = "Serie es obligatoria";
    if (!currentActivo.cantidad) tempErrors.cantidad = "Cantidad es obligatoria";
    if (!/^\d+$/.test(currentActivo.cantidad)) tempErrors.cantidad = "Cantidad debe ser un número";
    if (!currentActivo.precio) tempErrors.precio = "Precio es obligatorio";
    if (!/^\d+(\.\d{1,2})?$/.test(currentActivo.precio)) tempErrors.precio = "Precio debe ser un número válido con hasta dos decimales";
    if (!currentActivo.observaciones) tempErrors.observaciones = "Observaciones es obligatoria";

    if (newTotal == 0) {
      tempErrors.general = `Debe ingresar un valor mayor a cero`;
    }
    if (newTotal > pendiente) {
      tempErrors.general = `Monto ingresado es mayor al monto recepción pendiente $${pendiente}`;
    }
    if (newTotal > montoRecepcion) {
      tempErrors.general = `La cantidad ingresada excede al facturado $${montoRecepcion}`;
    }


    setError(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };


  //handleChange maneja actualizaciones en tiempo real campo por campo
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setCurrentActivo(prevData => ({ ...prevData, [name]: value }));
    console.log('Detección en tiempo real (otros campos)', { name, value });
  };

  const handleCambiaSerie = (index: number, newSerie: string) => {
    setActivosFijos(prevActivos => {
      // Limpiar el mensaje de error general cuando se empieza a escribir una nueva serie
      setError(prevErrors => ({
        ...prevErrors,
        generalTabla: undefined // Limpiar el mensaje de error inmediatamente
      }));

      // Comprobar si la nueva serie ya existe en otro activo
      const serieExists = prevActivos.some((activo, i) => activo.serie === newSerie && i !== index);
      console.log('Detección en tiempo real (serie)', { index, newSerie });

      if (serieExists) {
        setError(prevErrors => ({
          ...prevErrors,
          generalTabla: "Esta serie ya existe en otro activo. Introduce un valor único."
        }));
        return prevActivos; // Retornar sin modificar si la serie ya existe
      }

      // Actualizar el estado local
      const updatedActivos = prevActivos.map((activo, i) =>
        i === index ? { ...activo, serie: newSerie } : activo
      );

      // Despachar la acción para actualizar la serie en Redux
      dispatch(actualizarSerieEnTabla(index, newSerie));

      return updatedActivos;
    });
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


  // const handleClone = (activo: ActivoFijo) => {
  //   const clonedActivo = { ...activo };
  //   setActivosFijos(prev => [...prev, clonedActivo]);
  // };

  // Funcion para generar colores aleatorios con el fin para distinguir las filas de ultimas especies


  const handleAgregar = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // let counter = 0;
    // const generateCorrelativeId = () => {
    //   counter += 1;
    //   return String(counter);
    // };

    if (validate()) {
      // SweetAlert2: mostrar alerta de éxito

      const cantidad = parseInt(currentActivo.cantidad, 10);
      const ultimaEspecie = nombreEspecie[nombreEspecie.length - 1] || '';


      const newActivos = Array.from({ length: cantidad }, (_, index) => ({
        ...currentActivo,
        id: String(Date.now() + index),
        especie: ultimaEspecie,
        color: getRandomColor() // asigna un color distinto para cada activo
      }));
      setActivosFijos(prev => [...prev, ...newActivos]);

      // Despacha el array de nuevos activos a Redux
      if (newTotal < montoRecepcion) {
        dispatch(setDatosTabla(newActivos)); // Cambiado de currentActivo a newActivos
      }


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
        especie: '',
        color: ''
      });

      // const coincidePendiente = totalEstadoGlobal + pendiente
      // if (totalEstadoGlobal === 0) {
      //   dispatch(setTotalActivoFijoActions(total)); //establece total activo fijo en el estado global
      // }
      // if (coincidePendiente === montoRecepcion) {
      //   dispatch(setTotalActivoFijoActions(coincidePendiente)); //agrega el pendiente
      // }

      setMostrarModal(false); //Cierra modal
    }
  };

  const handleEliminar = (index: number/*, precio: number*/) => {
    setActivosFijos(prev => prev.filter((_, i) => i !== index));
    // const totalEstadoActualizado = totalEstadoGlobal - precio // calcula el total activo fijo del estado global  - el precio de la tabla seleccionada
    // dispatch(setTotalActivoFijoActions(totalEstadoActualizado));
    dispatch(eliminarActivoDeTabla(index));
  };

  const handleEliminarSeleccionados = () => {
    // Convertir los índices seleccionados a números
    const selectedIndices = filasSeleccionadas.map(Number);

    // Sumar los precios de los activos seleccionados
    // const totalPrecioSeleccionado = selectedIndices.reduce((acc, index) => {
    //   const activo = activosFijos[index]; // Obtén el activo correspondiente
    //   return acc + parseFloat(activo.precio); // Suma el precio del activo seleccionado
    // }, 0);

    // Filtrar los activos para eliminar los seleccionados
    setActivosFijos((prev) => prev.filter((_, index) => !selectedIndices.includes(index)));
    dispatch(eliminarMultiplesActivosDeTabla(selectedIndices));

    // Actualizar el total en el estado global restando la suma de los precios seleccionados
    // const totalEstadoActualizado = totalEstadoGlobal - totalPrecioSeleccionado;
    // dispatch(setTotalActivoFijoActions(totalEstadoActualizado));

    // Limpiar las filas seleccionadas
    setFilasSeleccionadas([]);
  };

  //-------------Fin Funciones de la tabla --------------------//

  const handleVolver = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    onBack();
  };

  const handleShowModal = () => {
    if (pendiente == 0) {
      // setMostrarModalConfirmar(true);
      onNext(activosFijos);

      Swal.fire({
        icon: 'info',
        // title: 'Confirmar',
        text: 'Confirmar el envio del formulario',
        showDenyButton: false,
        showCancelButton: true,
        confirmButtonText: "Confirmar y Enviar",


      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          Swal.fire("Registrado!", "", "success");
          handleFinalSubmit()
        }
      });
    } else {
      // SweetAlert2: mostrar alerta de error
      Swal.fire({
        icon: 'warning',
        title: 'Pendiente',
        text: `Tienes un monto pendiente de $${pendiente}`
      });
    }


    console.log("formulario datos activo fijo:", activosFijos);
  };

  const handleFinalSubmit = async () => {
    // Combina todos los datos en un solo objeto
    // const total = 0;
    // const FormulariosCombinados = {
    //   ...formInventario.datosInventario,
    //   ...formInventario.datosCuenta,
    //   activosFijos: formInventario.datosActivoFijo,
    // };
    if (token) {
      postFormInventarioActions(formInventario.datosInventario);
      Swal.fire({
        icon: 'success',
        title: 'Registro exitoso',
        text: 'El formulario se ha enviado y registrado con éxito!',
      });
    }




    //Resetea todo el formualario al estado inicial
    // dispatch(setTotalActivoFijoActions(total));
    dispatch(setNRecepcionActions(0));
    dispatch(setFechaRecepcionActions(''));
    dispatch(setNOrdenCompraActions(0));
    dispatch(setNFacturaActions(''));
    dispatch(setOrigenPresupuestoActions(0));
    dispatch(setMontoRecepcionActions(0));
    dispatch(setFechaFacturaActions(''));
    dispatch(setRutProveedorActions(''));
    dispatch(setnombreProveedorActions(''));
    dispatch(setModalidadCompraActions(0));
    dispatch(setServicioActions(0));
    dispatch(setDependenciaActions(0));
    dispatch(setCuentaActions(0));
    dispatch(setBienActions(0));
    dispatch(setDetalleActions(0));
    dispatch(setEspecieActions(''));
    dispatch(vaciarDatosTabla());
    onReset(); // retorna a Datos_inventario

    // Log para verificar los datos combinados
    // console.log("Formulario completo combinado:", FormulariosCombinados)
    console.log("Formulario confirmado y enviado", formInventario.datosInventario)
    // console.log("Total activo fijo", total);

  };



  console.log('Datos Tabla:', datosTabla);
  console.log('Elementos actuales:', elementosActuales);
  const paginar = (numeroPagina: number) => setCurrentPage(numeroPagina);

  if (datosTabla.length === 0) {
    console.log('datosTabla está vacío');
  }

  return (
    <>
      {/* Total Activo Fijo*/}
      <div className="justify-content-end navbar navbar-light">
        <div className="navbar-nav mb-2 mb-lg-0 me-3">
          <p className="nav-item nav-link mb-0">
            <strong>Monto Recepción:</strong> ${montoRecepcion.toLocaleString('es-ES', { minimumFractionDigits: 0 })}
          </p>
        </div>
      </div>

      <h3 className="form-title mb-4">Detalle Activo</h3>
      {/* habilita Boton Modal formulario si solo monto recepcion y total coinciden y si la especie tiene datos */}
      {totalSum != montoRecepcion && nombreEspecie.length > 0 && (
        <Button variant="primary" onClick={() => setMostrarModal(true)} className="mb-1 me-2">+</Button>
      )}

      {/* Boton elimina filas seleccionadas */}
      {filasSeleccionadas.length > 0 && (
        <Button variant="danger" onClick={handleEliminarSeleccionados} className="mb-1">
          Eliminar Seleccionados
        </Button>
      )}
      {/* Mostrar errores generales */}
      {error.generalTabla && (
        <div className="alert alert-danger" role="alert">
          {error.generalTabla}
        </div>
      )}
      {/* Tabla */}
      {datos.length === 0 ? (
        <p>No hay datos para mostrar.</p>
      ) : (
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
              <th>Especie</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {elementosActuales.map((activo, index) => (
              <tr key={index} style={{ backgroundColor: activo.color || 'transparent' }}>
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
                      data-index={index}
                      // Agregar clase condicional si hay un error en la serie
                      className={error?.generalTabla ? 'is-invalid' : ''}
                    />
                  ) : (
                    <span style={{ display: 'flex', alignItems: 'center' }}>
                      {activo.serie || 'editar'}
                      <PencilFill style={{ marginLeft: '8px', color: '#6c757d' }} /> {/* Ícono de lápiz */}
                    </span>
                  )}
                </td>
                <td>${parseFloat(activo.precio).toLocaleString('es-ES', { minimumFractionDigits: 0 })}</td>
                <td> {activo.especie}</td>
                <td>
                  {/* <Button variant="outline-secondary" size="sm" onClick={() => handleClone(activo)} className="me-2">
                  Clonar
                </Button> */}
                  <Button variant="outline-danger" size="sm" onClick={() => handleEliminar(index/*, parseFloat(activo.precio */)}>
                    Eliminar
                  </Button>
                </td>
              </tr>

            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={6} className="text-right"><strong>Total activo fijo:</strong></td>
              <td><strong>${totalSum.toLocaleString('es-ES', { minimumFractionDigits: 0 })}</strong></td>
            </tr>
          </tfoot>
        </Table >
      )}


      {/* Paginador*/}
      {
        elementosActuales.length > 0 && (
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
        )
      }

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
          {/* Mostrar errores generales en el modal */}
          {error.general && (
            <div className="alert alert-danger" role="alert">
              {error.general}
            </div>
          )}
          <form onSubmit={handleAgregar}>
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
                {/* <div className="mb-1">
                  <label htmlFor="serie" className="form-label">Serie</label>
                  <input type="text" className={`form-control ${error.serie ? 'is-invalid' : ''}`} id="serie" name="serie" onChange={handleChange} value={currentActivo.serie} />
                  {error.serie && <div className="invalid-feedback">{error.serie}</div>}
                </div> */}

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
                  <textarea className={`form-control ${error.observaciones ? 'is-invalid' : ''}`} id="observaciones" name="observaciones" rows={3} style={{ minHeight: '5px', resize: 'none' }} onChange={handleChange} value={currentActivo.observaciones} />
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
          <form onSubmit={handleAgregar}>
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
  montoRecepcion: state.datosInventarioReducer.montoRecepcion,
  totalEstadoGlobal: state.datosInventarioReducer.totalEstadoGlobal,
  nombreEspecie: state.datosInventarioReducer.nombreEspecie,
  resetFormulario: state.datosInventarioReducer.resetFormulario,
  datosTabla: state.datosInventarioReducer.datosTabla,
  token: state.auth.token // se utiliza el token aqui para pasarselo al postFormInventario

});
export default connect(mapStateToProps, {
  setTotalActivoFijoActions,
  postFormInventarioActions

})(Datos_activo_fijo);