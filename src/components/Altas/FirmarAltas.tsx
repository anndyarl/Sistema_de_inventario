import React, { useEffect, useMemo, useState, useRef } from "react";
import { Pagination, Button, Form, Modal } from "react-bootstrap";
import { connect } from "react-redux";
import Swal from "sweetalert2";
import SignatureCanvas from 'react-signature-canvas';
import { Pencil } from "react-bootstrap-icons";

import SkeletonLoader from "../Utils/SkeletonLoader";
import { RootState } from "../../store";
import { registrarBajasActions } from "../../redux/actions/Bajas/registrarBajasActions";
import { listaBajasActions } from "../../redux/actions/Bajas/listaBajasActions";
import MenuAltas from "../Menus/MenuAltas";
import Layout from "../../containers/hocs/layout/Layout";

export interface ListaBajas {
    bajaS_CORR: string;
    aF_CLAVE: number;
    id: number;
    vutiL_RESTANTE: number;
    vutiL_AGNOS: number;
    useR_MOD: number;
    saldO_VALOR: number;
    observaciones: string;
    nresolucion: number;
    ncuenta: string;
    iniciaL_VALOR: number;
    fechA_BAJA: string;
    especie: string;
    deP_ACUMULADA: number;
}

interface DatosBajas {
    listaBajas: ListaBajas[];
    listaBajasActions: () => Promise<boolean>;
    registrarBajasActions: (activos: { aF_CLAVE: number; bajaS_CORR: string; nresolucion: number; observaciones: string; fechA_BAJA: string }[]) => Promise<boolean>;
    token: string | null;
    isDarkMode: boolean;
}

const FirmarAltas: React.FC<DatosBajas> = ({ listaBajas, listaBajasActions, registrarBajasActions, token, isDarkMode }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Partial<ListaBajas>>({});
    const [mostrarModal, setMostrarModal] = useState(false);
    const [loadingRegistro, setLoadingRegistro] = useState(false);
    const [filasSeleccionadas, setFilasSeleccionadas] = useState<string[]>([]);
    const [paginaActual, setPaginaActual] = useState(1);
    const elementosPorPagina = 10;
    let indexReal = 0;//Indice para manejar el valor real de cada fila y para manejar check
    const sigCanvas = useRef<SignatureCanvas>(null);
    const [isSigned, setIsSigned] = useState(false);
    const [bajas, setBajas] = useState({
        nresolucion: 0,
        observaciones: "",
        fechA_BAJA: ""
    });

    const validate = () => {
        let tempErrors: Partial<ListaBajas> = {};
        // if (!bajas.nresolucion) tempErrors.nresolucion = "Número de resolución es obligatorio.";
        if (!bajas.fechA_BAJA) tempErrors.fechA_BAJA = "Fecha de Baja es obligatoria.";
        if (!bajas.observaciones) tempErrors.observaciones = "Observación es obligatoria.";
        setError(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const clearSignature = () => {
        if (sigCanvas.current) {
            sigCanvas.current.clear();
            setIsSigned(false);
        }
    };

    const handleSignatureEnd = () => {
        setIsSigned(sigCanvas.current ? !sigCanvas.current.isEmpty() : false);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!validate()) return;
        if (!sigCanvas.current || sigCanvas.current.isEmpty()) {
            setError(prev => ({ ...prev, signature: "La firma es obligatoria." }));
            return;
        }

        const signatureImage = sigCanvas.current.toDataURL();
        const selectedIndices = filasSeleccionadas.map(Number);

        const result = await Swal.fire({
            icon: "info",
            title: "Registrar Bajas",
            text: "Confirme para registrar los datos ingresados",
            showCancelButton: true,
            confirmButtonText: "Confirmar y Registrar",
            background: isDarkMode ? "#1e1e1e" : "#ffffff",
            color: isDarkMode ? "#ffffff" : "#000000",
            confirmButtonColor: isDarkMode ? "#007bff" : "#444",
            customClass: { popup: "custom-border" }
        });

        if (result.isConfirmed) {
            setLoadingRegistro(true);
            const formularioBajas = selectedIndices.map(index => ({
                aF_CLAVE: listaBajas[index].aF_CLAVE,
                bajaS_CORR: listaBajas[index].bajaS_CORR,
                ...bajas,
                firma: signatureImage
            }));

            try {
                console.log("formulario", formularioBajas);
                const resultado = await registrarBajasActions(formularioBajas);
                if (resultado) {
                    Swal.fire({
                        icon: "success",
                        title: "Bajas Registradas",
                        text: "Se han registrado correctamente",
                        background: isDarkMode ? "#1e1e1e" : "#ffffff",
                        color: isDarkMode ? "#ffffff" : "#000000",
                        confirmButtonColor: isDarkMode ? "#007bff" : "#444",
                        customClass: { popup: "custom-border" }
                    });
                    await listaBajasActions();
                    setFilasSeleccionadas([]);
                    setMostrarModal(false);
                } else {
                    throw new Error("Fallo al registrar bajas");
                }
            } catch (error) {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Hubo un problema al registrar",
                    background: isDarkMode ? "#1e1e1e" : "#ffffff",
                    color: isDarkMode ? "#ffffff" : "#000000",
                    confirmButtonColor: isDarkMode ? "#007bff" : "#444",
                    customClass: { popup: "custom-border" }
                });
            } finally {
                setLoadingRegistro(false);
            }
        }
    };

    useEffect(() => {
        const fetchBajas = async () => {
            if (token && listaBajas.length === 0) {
                setLoading(true);
                try {
                    const resultado = await listaBajasActions();
                    if (!resultado) {
                        throw new Error("Error al cargar la lista de bajas");
                    }
                } catch (error) {
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: "Error en la solicitud. Por favor, recargue nuevamente la página.",
                        background: isDarkMode ? "#1e1e1e" : "#ffffff",
                        color: isDarkMode ? "#ffffff" : "#000000",
                        confirmButtonColor: isDarkMode ? "#007bff" : "#444",
                        customClass: { popup: "custom-border" }
                    });
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchBajas();
    }, [listaBajasActions, token, listaBajas.length, isDarkMode]);

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setBajas(prev => ({
            ...prev,
            [name]: name === "nresolucion" ? parseFloat(value) || 0 : value,
        }));
    };

    const setSeleccionaFilas = (index: number) => {
        setFilasSeleccionadas(prev =>
            prev.includes(index.toString())
                ? prev.filter(rowIndex => rowIndex !== index.toString())
                : [...prev, index.toString()]
        );
        setMostrarModal(true);
    };

    const handleSeleccionaTodos = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setFilasSeleccionadas(
                elementosActuales.map((_, index) => (indicePrimerElemento + index).toString())
            );
        } else {
            setFilasSeleccionadas([]);
        }
    };

    const handleCerrarModal = (indexReal: number) => {
        setMostrarModal(false);
        setFilasSeleccionadas((prevSeleccionadas) =>
            prevSeleccionadas.filter((fila) => fila !== indexReal.toString())
        );
    };
    const indiceUltimoElemento = paginaActual * elementosPorPagina;
    const indicePrimerElemento = indiceUltimoElemento - elementosPorPagina;
    const elementosActuales = useMemo(
        () => listaBajas.slice(indicePrimerElemento, indiceUltimoElemento),
        [listaBajas, indicePrimerElemento, indiceUltimoElemento]
    );
    const totalPaginas = Math.ceil(listaBajas.length / elementosPorPagina);
    const paginar = (numeroPagina: number) => setPaginaActual(numeroPagina);

    return (
        <Layout>
            <MenuAltas />
            <div className="border-bottom shadow-sm p-4 rounded">
                <h3 className="form-title fw-semibold border-bottom p-1">Firmar Altas</h3>
                {loading ? (
                    <SkeletonLoader rowCount={elementosPorPagina} />
                ) : (
                    <div className='table-responsive'>
                        <table className={`table ${isDarkMode ? "table-dark" : "table-hover table-striped"}`}>
                            <thead className={`sticky-top ${isDarkMode ? "table-dark" : "text-dark table-light"}`}>
                                <tr>
                                    <th>
                                        <Form.Check
                                            type="checkbox"
                                            onChange={handleSeleccionaTodos}
                                            checked={filasSeleccionadas.length === elementosActuales.length && elementosActuales.length > 0}
                                        />
                                    </th>
                                    <th scope="col">Codigo</th>
                                    <th scope="col">N° Inventario</th>
                                    <th scope="col">Vida útil</th>
                                    <th scope="col">En años</th>
                                    <th scope="col">N° Cuenta</th>
                                    <th scope="col">Especie</th>
                                    <th scope="col">Depreciación Acumulada</th>
                                </tr>
                            </thead>
                            <tbody>
                                {elementosActuales.map((listaBaja, index) => (
                                    <tr key={indicePrimerElemento + index}>
                                        <td>
                                            <Form.Check
                                                type="checkbox"
                                                onChange={() => setSeleccionaFilas(indicePrimerElemento + index)}
                                                checked={filasSeleccionadas.includes((indicePrimerElemento + index).toString())}
                                            />
                                        </td>
                                        <td>{listaBaja.bajaS_CORR}</td>
                                        <td>{listaBaja.aF_CLAVE}</td>
                                        <td>{listaBaja.vutiL_RESTANTE}</td>
                                        <td>{listaBaja.vutiL_AGNOS}</td>
                                        <td>{listaBaja.ncuenta}</td>
                                        <td>{listaBaja.especie}</td>
                                        <td>{listaBaja.deP_ACUMULADA}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
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
            </div>
            <Modal show={mostrarModal}
                onHide={() => handleCerrarModal(indexReal)}
                dialogClassName="modal-right" >
                <Modal.Header className={isDarkMode ? "darkModePrincipal" : ""} closeButton>
                    <Modal.Title className="fw-semibold">Firme Alta seleccionada</Modal.Title>
                </Modal.Header>
                <Modal.Body className={` ${isDarkMode ? "darkModePrincipal" : ""}`}>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3 ">
                            <label htmlFor="signature" className="fw-semibold">Ingrese su firma</label>
                            <div className={`border ${isDarkMode ? "border-secondary" : "border-primary"} rounded p-2`}>
                                <SignatureCanvas
                                    ref={sigCanvas}
                                    canvasProps={{
                                        className: 'signature-canvas',
                                    }}
                                    backgroundColor={isDarkMode ? '#343a40' : '#f8f9fa'}
                                    penColor={isDarkMode ? '#ffffff' : '#000000'}
                                    onEnd={handleSignatureEnd}
                                />
                            </div>
                            {/* {error.signature && <div className="text-danger">{error.signature}</div>} */}
                            <div className="mt-2 d-flex justify-content-between">
                                <Button
                                    type="button"
                                    variant={isDarkMode ? "outline-secondary" : "outline-primary"}
                                    onClick={clearSignature}
                                    disabled={!isSigned}
                                >
                                    Limpiar firma
                                </Button>
                                <Button
                                    type="submit"
                                    variant={isDarkMode ? "secondary" : "primary"}
                                    disabled={!isSigned || loadingRegistro}
                                >
                                    {loadingRegistro ? "Procesando..." : (
                                        <>
                                            <Pencil className="flex-shrink-0 h-5 w-5 mx-1 ms-0" aria-hidden="true" />
                                            Firmar y enviar
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>

                    </form>
                </Modal.Body>
            </Modal>
        </Layout>
    );
};

const mapStateToProps = (state: RootState) => ({
    listaBajas: state.datosListaBajasReducers.listaBajas,
    token: state.loginReducer.token,
    isDarkMode: state.darkModeReducer.isDarkMode
});

export default connect(mapStateToProps, {
    listaBajasActions,
    registrarBajasActions
})(FirmarAltas);

