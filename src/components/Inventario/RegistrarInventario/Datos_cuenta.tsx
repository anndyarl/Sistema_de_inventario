import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button, Table, Form, Pagination, Row, Col } from 'react-bootstrap';
import React, { useState, useMemo, useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../../../store';
import { setDependenciaActions, setServicioActions, setCuentaActions, setEspecieActions, setDescripcionEspecieActions, setNombreEspecieActions } from '../../../redux/actions/Inventario/Datos_inventariosActions';
import { Plus } from 'react-bootstrap-icons';

// Define el tipo de los elementos del combo `servicio`
export interface SERVICIO {
    codigo: number;
    nombrE_ORD: string;
    descripcion: string;
}

// Define el tipo de los elementos del combo `cuentas`
export interface CUENTA {
    codigo: number;
    descripcion: string;
}

// Define el tipo de los elementos del combo `dependencia`
export interface DEPENDENCIA {
    codigo: number;
    descripcion: string;
    nombrE_ORD: string;
}

// Define el tipo de los elementos del combo `ListaEspecie`
export interface BIEN {
    codigo: string;
    descripcion: string;
}

// Define el tipo de los elementos del combo `detalles`
export interface DETALLE {
    codigo: string;
    descripcion: string;
}

// Define el tipo de los elementos del combo `ListaEspecie`
export interface ListaEspecie {
    estabL_CORR: number;
    esP_CODIGO: string;
    nombrE_ESP: string;
}

interface CuentaProps {
    servicio: number;
    cuenta: number;
    dependencia: number;
    especie: string;
}

// Define el tipo de props para el componente, extendiendo InventarioProps
interface Datos_cuentaProps extends CuentaProps {
    onNext: (Cuenta: CuentaProps) => void;
    onBack: () => void;
    comboServicio: SERVICIO[];
    comboCuenta: CUENTA[];
    comboDependencia: DEPENDENCIA[];
    //Dentro del modal
    comboBien: BIEN[];
    comboDetalle: DETALLE[];
    listaEspecie: ListaEspecie[];
    onServicioSeleccionado: (codigoServicio: string) => void; // Nueva prop para pasar el servicio seleccionado
    servicioSeleccionado: string | null | undefined; // Estado que se pasa como prop para mantener el valor seleccionado
    onBienSeleccionado: (codigoBien: string) => void; // Nueva prop para pasar el bien seleccionado
    bienSeleccionado: string | null | undefined; // Estado que se pasa como prop para mantener el valor seleccionado
    onDetalleSeleccionado: (codigoDetalle: string) => void; // Nueva prop para pasar el detalle seleccionado
    detalleSeleccionado: string | null | undefined; // Estado que se pasa como prop para mantener el valor seleccionado
    onEspecieSeleccionado: (nombreEspecie: string) => void; // Nueva prop para pasar el detalle seleccionado
    especieSeleccionado: string | null | undefined;

    descripcionEspecie: string; // se utiliza solo para guardar la descripcion completa en el input de especie
    bien: number;
    detalles: number;
}

const Datos_cuenta: React.FC<Datos_cuentaProps> = ({
    onNext,
    onBack,
    //Combos
    comboServicio,
    comboCuenta,
    comboDependencia,
    comboBien,
    comboDetalle,
    listaEspecie,
    //inputs
    servicio,
    cuenta,
    dependencia,
    especie,
    // bien,
    // detalles,
    descripcionEspecie,
    onServicioSeleccionado,
    onBienSeleccionado,
    onDetalleSeleccionado,
    onEspecieSeleccionado }) => {

    //Cuenta es la variable de estado
    const [Cuenta, setCuenta] = useState({
        servicio: 0,
        cuenta: 0,
        dependencia: 0,
        especie: ''
    });

    const [Especies, setEspecies] = useState({
        estableEspecie: 0,
        codigoEspecie: "",
        nombreEspecie: "",
        descripcionEspecie: ""
    });
    const dispatch = useDispatch<AppDispatch>();
    const [mostrarModal, setMostrarModal] = useState(false);
    const [filasSeleccionadas, setFilasSeleccionadas] = useState<string[]>([]);
    const [elementoSeleccionado, setElementoSeleccionado] = useState<ListaEspecie>();
    const [paginaActual, setPaginaActual] = useState(1);
    const elementosPorPagina = 350;
    const classNames = (...classes: (string | boolean | undefined)[]): string => {
        return classes.filter(Boolean).join(' ');
    };
    useEffect(() => {
        setCuenta({
            servicio,
            cuenta,
            dependencia,
            especie,
        });

    }, [servicio, cuenta, dependencia, especie]);

    //Se usa useEffect en este caso de Especie ya que por handleChange no detecta el cambio
    // debido que este se pasa por una seleccion desde el modal en la selccion que se hace desde el listado
    useEffect(() => {
        // Detecta si el valor de 'especie' ha cambiado
        if (Especies.codigoEspecie) {
            onEspecieSeleccionado(Especies.codigoEspecie);
        }
    }, [Especies.codigoEspecie]);



    const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        const { name, value } = e.target;
        // Actualiza el estado de 'cuenta' con el nuevo valor
        setCuenta(cuentaPrevia => ({ ...cuentaPrevia, [name]: value }));


        // Otras condiciones para diferentes campos del formulario
        if (name === 'servicio') {
            onServicioSeleccionado(value);
        }
        if (name === 'bien') {
            onBienSeleccionado(value);
        }
        if (name === 'detalles') {
            onDetalleSeleccionado(value);
        }
    };
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        dispatch(setServicioActions(Cuenta.servicio));
        dispatch(setCuentaActions(Cuenta.cuenta));
        dispatch(setDependenciaActions(Cuenta.dependencia));
        dispatch(setEspecieActions(Cuenta.especie));
        dispatch(setDescripcionEspecieActions(Especies.descripcionEspecie));
        if (parseInt(Especies.codigoEspecie) > 0) {
            dispatch(setNombreEspecieActions(Especies.codigoEspecie));
        }

        onNext(Cuenta);
        console.log("Formulario Datos cuenta:", Cuenta);
    };

    const handleVolver = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        dispatch(setServicioActions(Cuenta.servicio));
        dispatch(setCuentaActions(Cuenta.cuenta));
        dispatch(setDependenciaActions(Cuenta.dependencia));
        dispatch(setEspecieActions(Cuenta.especie));
        dispatch(setDescripcionEspecieActions(Especies.descripcionEspecie));
        if (parseInt(Especies.codigoEspecie) > 0) {
            dispatch(setNombreEspecieActions(Especies.codigoEspecie));
        }
        onBack();
    };

    //Selecciona fila del listado de especies
    const handleSeleccionFila = (index: number) => {
        const item = listaEspecie[index];
        setFilasSeleccionadas([index.toString()]);
        setElementoSeleccionado(item);
        // console.log("Elemento seleccionado", item);
    };

    const handleSubmitSeleccionado = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (typeof elementoSeleccionado === 'object' && elementoSeleccionado !== null) {
            const estableEspecie = (elementoSeleccionado as ListaEspecie).estabL_CORR;
            const codigoEspecie = (elementoSeleccionado as ListaEspecie).esP_CODIGO;
            const nombreEspecie = `${(elementoSeleccionado as ListaEspecie).nombrE_ESP}`;
            const descripcionEspecie = (elementoSeleccionado as ListaEspecie).esP_CODIGO + " | " + `${(elementoSeleccionado as ListaEspecie).nombrE_ESP}`;
            // Actualiza tanto el estado 'Especies' como el estado 'Cuenta.especie'
            setEspecies({ estableEspecie, codigoEspecie, nombreEspecie, descripcionEspecie });
            setCuenta(cuentaPrevia => ({
                ...cuentaPrevia,
                especie: codigoEspecie.toString(),  // Actualiza el campo 'especie' en el estado de 'Cuenta'
            }));
            // Resetea el estado de las filas seleccionadas para desmarcar el checkbox
            setFilasSeleccionadas([]);

            setMostrarModal(false); // Cierra el modal
        } else {
            console.log("No se ha seleccionado ningún elemento.");
        }
    };

    // Lógica de Paginación actualizada
    const indiceUltimoElemento = paginaActual * elementosPorPagina;
    const indicePrimerElemento = indiceUltimoElemento - elementosPorPagina;
    const elementosActuales = useMemo(() => listaEspecie.slice(indicePrimerElemento, indiceUltimoElemento), [listaEspecie, indicePrimerElemento, indiceUltimoElemento]);
    const totalPaginas = Math.ceil(listaEspecie.length / elementosPorPagina);
    // const totalPaginas = Array.isArray(listaEspecie) ? Math.ceil(listaEspecie.length / elementosPorPagina) : 0;


    const paginar = (numeroPagina: number) => setPaginaActual(numeroPagina);

    return (
        <>
            <form onSubmit={handleSubmit}>
                <div className="border-top p-1 rounded">
                    <div>
                        <h3 className="form-title">Detalle Inventario</h3>
                    </div>
                    <div className="shadow-sm p-5 m-1">
                        <Row>
                            <Col md={6}>
                                <div className="mb-1">
                                    <dt className="text-muted">Servicio</dt>
                                    <dd className="d-flex align-items-center">
                                        <select className="form-select" name="servicio" onChange={handleChange} value={Cuenta.servicio || ''}>
                                            <option value="">Seleccione un origen</option>
                                            {comboServicio.map((traeServicio) => (
                                                <option key={traeServicio.codigo} value={traeServicio.codigo}>
                                                    {traeServicio.nombrE_ORD}
                                                </option>
                                            ))}
                                        </select>
                                    </dd>
                                </div>
                                <div className="cmb-1">
                                    <dt className="text-muted">Dependencia</dt>
                                    <dd className="d-flex align-items-center">
                                        <select className="form-select" name="dependencia" disabled={!Cuenta.servicio} onChange={handleChange} value={Cuenta.dependencia}>
                                            <option value="" >Selecciona una opción</option>
                                            {comboDependencia.map((traeDependencia) => (
                                                <option key={traeDependencia.codigo} value={traeDependencia.codigo}>
                                                    {traeDependencia.nombrE_ORD}
                                                </option>
                                            ))}
                                        </select>
                                    </dd>
                                </div>
                            </Col>
                            <Col md={6}>
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
                                        <Button variant="primary" onClick={() => setMostrarModal(true)} className="ms-1">
                                            <Plus className={classNames('flex-shrink-0', 'h-5 w-5')} aria-hidden="true" />
                                        </Button>
                                    </dd>
                                </div>

                                <div className="mb-1">
                                    <dt className="text-muted">Cuenta</dt>
                                    <dd className="d-flex align-items-center">
                                        <select className="form-select" name="cuenta" disabled={!Cuenta.especie} onChange={handleChange} value={Cuenta.cuenta}>
                                            <option value="">Selecciona una opción</option>
                                            {comboCuenta.map((traeCuentas) => (
                                                <option key={traeCuentas.codigo} value={traeCuentas.codigo}>
                                                    {traeCuentas.descripcion}
                                                </option>
                                            ))}
                                        </select>
                                    </dd>
                                </div>


                            </Col>
                        </Row>
                    </div>
                </div>
                <div className="p-1 rounded bg-white d-flex justify-content-between">
                    <Button onClick={handleVolver} className="btn btn-primary m-1">Volver</Button>
                    <Button type="submit" className="btn btn-primary m-1">Siguiente</Button>
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

        </>


    );
};


//mapea los valores del estado global de Redux 
const mapStateToProps = (state: RootState) => ({
    servicio: state.datosRecepcionReducer.servicio,
    cuenta: state.datosRecepcionReducer.cuenta,
    dependencia: state.datosRecepcionReducer.dependencia,
    especie: state.datosRecepcionReducer.especie,
    bien: state.datosRecepcionReducer.bien,
    detalles: state.datosRecepcionReducer.detalle,
    descripcionEspecie: state.datosRecepcionReducer.descripcionEspecie

});

export default connect(mapStateToProps,
    {

    })(Datos_cuenta);
