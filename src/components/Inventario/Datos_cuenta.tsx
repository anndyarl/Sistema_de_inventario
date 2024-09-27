import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useMemo } from 'react';
import { Modal, Button, Table, Form, Pagination, Row, Col } from 'react-bootstrap';

// Define el tipo de los elementos del combo `servicio`
export interface Servicio {
    codigo: number;
    nombrE_ORD: string;
    descripcion: string;
}

// Define el tipo de los elementos del combo `cuentas`
export interface comboCuentas {
    codigo: number;
    descripcion: string;
}

// Define el tipo de los elementos del combo `bien`
export interface Bien {
    codigo: number;
    descripcion: string;
}

// Define el tipo de los elementos del combo `dependencia`
export interface Dependencia {
    codigo: number;
    descripcion: string;
    nombrE_ORD: string;
}

// Define el tipo de los elementos del listado `especie`
export interface ListadoEspecies {
    codigo: number;
    descripcion: string;
    // nombrE_ESP: string;
}

// Define el tipo de props para el componente
interface Datos_cuentaProps {
    onNext: (cuenta: any) => void;
    onBack: () => void;
    servicios: Servicio[];
    comboCuentas: comboCuentas[];
    bien: Bien[];
    dependencias: Dependencia[];
    listadoEspecies: ListadoEspecies[] | undefined | null;


    onServicioSeleccionado: (codigoServicio: string) => void; // Nueva prop para pasar el servicio seleccionado
    servicioSeleccionado: string | null | undefined; // Estado que se pasa como prop para mantener el valor seleccionado

}

const Datos_cuenta: React.FC<Datos_cuentaProps> = ({ onNext, onBack, servicios, comboCuentas, bien, dependencias, listadoEspecies, onServicioSeleccionado }) => {

    //Cuenta es la variable de estado
    const [Cuenta, setCuenta] = useState({
        servicio: '',
        dependencia: '',
        cuenta: '',
        bien: '',
        detalles: '',
        especie: '',
        codigoEspecie: 0,
        descripcionEspecie: '',

    });
    const [mostrarModal, setMostrarModal] = useState(false);
    const [filasSeleccionadas, setFilasSeleccionadas] = useState<string[]>([]);
    const [elementoSeleccionado, setElementoSeleccionado] = useState<ListadoEspecies>();
    const [paginaActual, setPaginaActual] = useState(1);
    const elementosPorPagina = 10;

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        const { name, value } = e.target;
        console.log('Detección en tiempo real Formulario Cuentas', { name, value });
        setCuenta(cuentaPrevia => ({ ...cuentaPrevia, [name]: value }));

        if (name === 'servicio') {
            // Llama a la función para enviar el servicio seleccionado al componente padre
            onServicioSeleccionado(value);
        }

    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onNext(Cuenta);
        console.log("Formulario Datos cuenta:", Cuenta);
    };

    const handleVolver = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        onBack();
    };

    //Selecciona fila del listado de especies
    const handleSeleccionFila = (index: number) => {
        const item = listadoEspecies[index];
        setFilasSeleccionadas([index.toString()]);
        setElementoSeleccionado(item);
        console.log("Elemento seleccionado", item);
    };

    const handleSubmitSeleccionado = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (typeof elementoSeleccionado === 'object' && elementoSeleccionado !== null) {
            setCuenta(cuentaPrevia => ({
                ...cuentaPrevia,
                codigoEspecie: (elementoSeleccionado as ListadoEspecies).codigo,
                descripcionEspecie: (elementoSeleccionado as ListadoEspecies).descripcion
            }));
            setMostrarModal(false);
            console.log("Elemento seleccionado:", elementoSeleccionado);
        } else {
            console.log("No se ha seleccionado ningún elemento.");
        }
    };

    // Lógica de Paginación actualizada
    const indiceUltimoElemento = paginaActual * elementosPorPagina;
    const indicePrimerElemento = indiceUltimoElemento - elementosPorPagina;
    const elementosActuales = useMemo(() => listadoEspecies.slice(indicePrimerElemento, indiceUltimoElemento), [listadoEspecies, indicePrimerElemento, indiceUltimoElemento]);
    // const totalPaginas = Math.ceil(listadoEspecies.length / elementosPorPagina);
    const totalPaginas = Array.isArray(listadoEspecies) ? Math.ceil(listadoEspecies.length / elementosPorPagina) : 0;


    const paginar = (numeroPagina: number) => setPaginaActual(numeroPagina);


    return (
        <>
            <form onSubmit={handleSubmit}>
                <div className="border-top p-1 rounded">
                    <div>
                        <h3 className="form-title">Detalle Inventario</h3>
                    </div>
                    <div className="mt-4 border-top">
                        <Row>
                            <Col md={6}>
                                <div className="mb-1">
                                    <dt className="text-muted">Servicio</dt>
                                    <dd className="d-flex align-items-center">
                                        <select className="form-select" name="servicio" onChange={handleChange} value={Cuenta.servicio || ''}>
                                            <option value="">Seleccione un origen</option>
                                            {servicios.map((traeServicio) => (
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
                                            {dependencias.map((traeDependencia) => (
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
                                    <dt className="text-muted">Cuenta</dt>
                                    <dd className="d-flex align-items-center">
                                        <select className="form-select" name="cuenta" onChange={handleChange} value={Cuenta.cuenta}>
                                            <option value="">Selecciona una opción</option>
                                            {comboCuentas.map((traeCuentas) => (
                                                <option key={traeCuentas.codigo} value={traeCuentas.codigo}>
                                                    {traeCuentas.descripcion}
                                                </option>
                                            ))}
                                        </select>
                                    </dd>
                                </div>
                                <div className="mb-1">
                                    <dt className="text-muted">Especie</dt>
                                    <dd className="d-flex align-items-center">
                                        {/* si el listado tiene datos se habilita el boton */}
                                        <Button variant="primary" onClick={() => setMostrarModal(true)}>+</Button>

                                        <select className="form-select" name="especie" onChange={handleChange} value={Cuenta.especie} disabled>
                                            <option value="" >
                                                {Cuenta.descripcionEspecie || 'Haz clic en más para seleccionar una especie'}
                                            </option>
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
            <Modal show={mostrarModal} onHide={() => setMostrarModal(false)} size="lg">
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
                                        <select name="bien" className="form-select" onChange={handleChange} value={Cuenta.bien}>
                                            {bien.map((traeBien) => (
                                                <option key={traeBien.codigo} value={traeBien.codigo}>
                                                    {traeBien.descripcion}
                                                </option>
                                            ))}
                                        </select>
                                    </dd>
                                </div>
                                {/* <div className="mb-1">
                                    <dt className="text-muted">Detalles</dt>
                                    <dd className="d-flex align-items-center">
                                        <select name="detalles" className="form-select" onChange={handleChange} value={Cuenta.detalles}>
                                            <option value="">Selecciona una opción</option>
                                            {listadoEspecies.map((traeListado) => (
                                                <option key={traeListado.codigo} value={traeListado.codigo}>
                                                    {traeListado.descripcion}
                                                </option>
                                            ))}
                                        </select>
                                    </dd>
                                </div> */}
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
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th></th>
                                <th>Establecimiento</th>
                                <th>Nombre</th>
                                {/* <th>Especie</th> */}
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
                                    <td>{listadoEspecies.codigo}</td>
                                    <td>{listadoEspecies.descripcion}</td>
                                    {/* <td>{listadoEspecies.nombrE_ESP}</td> */}
                                </tr>
                            ))}
                        </tbody>
                    </Table>

                    {/* Paginador */}
                    <Pagination className="d-flex justify-content-end">
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
            </Modal>
        </>


    );
};



export default (Datos_cuenta);
