import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useMemo } from 'react';
import { Modal, Button, Table, Form, Pagination, Row, Col } from 'react-bootstrap';

// Define el tipo de los elementos del combo `servicio`
export interface Servicio {
    codigo: string;
    nombrE_ORD: string;
    descripcion: string;
}

// Define el tipo de props para el componente
interface Datos_cuentaProps {
    onNext: (cuenta: any) => void;
    onBack: () => void;
    servicios: Servicio[];
}

// Define el tipo de los elementos del combo `especie`
export interface Especie {
    codigoEspecie: string;
    descripcionEspecie: string;
}

const Datos_cuenta: React.FC<Datos_cuentaProps> = ({ onNext, onBack, servicios }) => {
    const [Servicio] = useState<Servicio[]>(servicios);
    const [elementoSeleccionado, setElementoSeleccionado] = useState<Servicio | null>(null);
   //Cuenta es la variable de estado
    const [Cuenta, setCuenta] = useState({
        servicio: '',
        dependencia: '',
        cuenta: '',
        bien: '',
        detalles: '',
        codigoEspecie: '',
        descripcionEspecie: ''
    });
    const [mostrarModal, setMostrarModal] = useState(false);
    const [filasSeleccionadas, setFilasSeleccionadas] = useState<string[]>([]);
    const [paginaActual, setPaginaActual] = useState(1);
    const elementosPorPagina = 10;

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        const { name, value } = e.target;
        console.log('Detección en tiempo real Formulario Cuentas', { name, value });
        setCuenta(cuentaPrevia => ({ ...cuentaPrevia, [name]: value }));
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

    const handleSeleccionFila = (index: number) => {
        const item = Servicio[index];
        setFilasSeleccionadas([index.toString()]);
        setElementoSeleccionado(item);
        console.log("Elemento seleccionado", item);
    };

    const handleSubmitSeleccionado = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (elementoSeleccionado) {
            setCuenta(cuentaPrevia => ({
                ...cuentaPrevia,
                codigoEspecie: elementoSeleccionado.codigo,
                descripcionEspecie: elementoSeleccionado.descripcion
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
    const elementosActuales = useMemo(() => servicios.slice(indicePrimerElemento, indiceUltimoElemento), [servicios, indicePrimerElemento, indiceUltimoElemento]);
    const totalPaginas = Math.ceil(servicios.length / elementosPorPagina);

    const paginar = (numeroPagina: number) => setPaginaActual(numeroPagina);


    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div className="border-top p-1 rounded">
                    <div>
                        <h3 className="form-title">Datos cuenta</h3>
                    </div>
                    <div className="mt-4 border-top">
                        <Row>
                            <Col md={6}>
                                <div className="mb-1">
                                    <dt className="text-muted">Servicio</dt>
                                    <dd className="d-flex align-items-center">
                                        <select className="form-select" name="servicio" onChange={handleChange}>
                                            <option value="">Seleccione un origen</option>
                                            {servicios.map((servicio) => (
                                                <option key={servicio.codigo} value={servicio.codigo}>
                                                    {servicio.nombrE_ORD}
                                                </option>
                                            ))}
                                        </select>
                                    </dd>
                                </div>
                                <div className="cmb-1">
                                    <dt className="text-muted">Dependencia</dt>
                                    <dd className="d-flex align-items-center">
                                        <select name="dependencia" className="form-select" onChange={handleChange} value={Cuenta.dependencia}>
                                            <option value="">Selecciona una opción</option>
                                            <option value="backend">Backend Developer</option>
                                            <option value="frontend">Frontend Developer</option>
                                            <option value="fullstack">Full Stack Developer</option>
                                        </select>
                                    </dd>
                                </div>
                            </Col>
                            <Col md={6}>
                                <div className="mb-1">
                                    <dt className="text-muted">cuenta</dt>
                                    <dd className="d-flex align-items-center">
                                        <select name="cuenta" className="form-select" onChange={handleChange} value={Cuenta.cuenta}>
                                            <option value="">Selecciona una opción</option>
                                            <option value="backend">Backend Developer</option>
                                            <option value="frontend">Frontend Developer</option>
                                            <option value="fullstack">Full Stack Developer</option>
                                        </select>
                                    </dd>
                                </div>
                                <div className="mb-1">
                                    <dt className="text-muted">Especie</dt>
                                    <dd className="d-flex align-items-center">
                                        <Button variant="primary" onClick={() => setMostrarModal(true)}>+</Button>
                                        <select className="form-select" onChange={handleChange} value={Cuenta.codigoEspecie} disabled>
                                            <option value="" disabled>
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
                                            <option value="">Selecciona una opción</option>
                                            <option value="backend">Backend Developer</option>
                                            <option value="frontend">Frontend Developer</option>
                                            <option value="fullstack">Full Stack Developer</option>
                                        </select>
                                    </dd>
                                </div>
                                <div className="mb-1">
                                    <dt className="text-muted">Detalles</dt>
                                    <dd className="d-flex align-items-center">
                                        <select name="detalles" className="form-select" onChange={handleChange} value={Cuenta.detalles}>
                                            <option value="">Selecciona una opción</option>
                                            <option value="backend">Backend Developer</option>
                                            <option value="frontend">Frontend Developer</option>
                                            <option value="fullstack">Full Stack Developer</option>
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
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th></th>
                                <th>Codigo Especie</th>
                                <th>Nombre Especie</th>
                            </tr>
                        </thead>
                        <tbody>
                            {elementosActuales.map((activo, index) => (
                                <tr key={index}>
                                    <td>
                                        <Form.Check
                                            type="checkbox"
                                            onChange={() => handleSeleccionFila(indicePrimerElemento + index)}
                                            checked={filasSeleccionadas.includes((indicePrimerElemento + index).toString())}
                                        />
                                    </td>
                                    <td>{activo.codigo}</td>
                                    <td>{activo.descripcion}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    {/* Paginador*/}
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
        </div>


    );
};



export default (Datos_cuenta);
