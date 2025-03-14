import React, { useState } from "react";
import ReactDOM from 'react-dom';
import { Modal, Spinner } from "react-bootstrap";
import Swal from "sweetalert2";
import { QRCodeSVG } from 'qrcode.react';
import Layout from "../../../containers/hocs/layout/Layout";
import MenuAltas from "../../Menus/MenuAltas";
import { RootState } from "../../../store";
import { obtenerEtiquetasAltasActions } from "../../../redux/actions/Altas/ImprimirEtiquetas/obtenerEtiquetasAltasActions";
import { InventarioCompleto } from "../../Inventario/ModificarInventario";
import { Helmet } from "react-helmet-async";
import { BlobProvider } from "@react-pdf/renderer";
import DocumentoPDF from "./DocumentoPDF";
import { connect } from "react-redux";
import '../../../styles/ImprimirEtiqueta.css'


interface DatosEtiquetaProps {
    aF_CODIGO_LARGO: string,
    aF_DESCRIPCION: string,
    aF_UBICACION: string,
    aF_FECHA_ALTA: string,
    aF_NCUENTA: string;
    qrImage: string;
}
interface DatosProps {
    obtenerEtiquetasAltasActions: (aF_CLAVE: string) => Promise<boolean>;
    datosEtiqueta: DatosEtiquetaProps[];
    isDarkMode: boolean;
}
const ImprimirEtiqueta: React.FC<DatosProps> = ({ obtenerEtiquetasAltasActions, datosEtiqueta, isDarkMode }) => {

    const [error, setError] = useState<Partial<InventarioCompleto> & {}>({});
    const [Inventario, setInventario] = useState({ aF_CLAVE: "" });
    const [loading, setLoading] = useState(false); // Estado para controlar la carga
    const [mostrarModal, setMostrarModal] = useState(false);
    const [Etiqueta, setEtiqueta] = useState({
        aF_CODIGO_LARGO: "",
        aF_DESCRIPCION: "",
        aF_UBICACION: "",
        aF_FECHA_ALTA: "",
        aF_NCUENTA: "",
        qrImage: ""
    });
    const validate = () => {
        let tempErrors: Partial<any> & {} = {};
        // Validación para N° de Recepción (debe ser un número)
        if (!Inventario.aF_CLAVE) {
            setLoading(false);
            tempErrors.aF_CLAVE = "Debe ingresar un número.";
        }


        setError(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setInventario((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const generateQRCodeBase64 = (value: string): Promise<string> => {
        return new Promise((resolve, reject) => {
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');

            if (context) {
                const qrSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                document.body.appendChild(qrSvg);

                ReactDOM.render(<QRCodeSVG value={value} level="H" />, qrSvg);

                const svgData = new XMLSerializer().serializeToString(qrSvg);
                const img = new Image();

                img.onload = () => {
                    canvas.width = img.width;
                    canvas.height = img.height;
                    context.drawImage(img, 0, 0);

                    const qrBase64 = canvas.toDataURL('image/png');
                    document.body.removeChild(qrSvg);
                    resolve(qrBase64); // Resuelve la promesa con la imagen QR en base64
                };

                img.onerror = () => reject(new Error("Error al cargar la imagen QR."));
                img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
            } else {
                reject(new Error("El contexto del canvas no está disponible."));
            }
        });
    };

    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (validate()) {
            setLoading(true);
            let resultado = await obtenerEtiquetasAltasActions(Inventario.aF_CLAVE);
            if (resultado) {
                setLoading(false);
                Swal.fire({
                    icon: "success",
                    title: "QR disponible",
                    text: "Código QR generado correctamente.",
                    showCancelButton: true,
                    showConfirmButton: false,
                    cancelButtonText: "Cerrar",
                    background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
                    color: `${isDarkMode ? "#ffffff" : "000000"}`,
                    confirmButtonColor: `${isDarkMode ? "#007bff" : "444"}`,
                    customClass: {
                        popup: "custom-border",
                    }
                });

            } else {
                setLoading(false);
                Swal.fire({
                    icon: "error",
                    title: ":'(",
                    text: "No se encontraron resultados, inténte otro registro.",
                    background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
                    color: `${isDarkMode ? "#ffffff" : "000000"}`,
                    confirmButtonColor: `${isDarkMode ? "#007bff" : "444"}`,
                    customClass: {
                        popup: "custom-border",
                    }
                });
            }
        }
    };

    return (
        <Layout>
            <Helmet>
                <title>Imprimir Etiquetas</title>
            </Helmet>
            <MenuAltas />
            <form onSubmit={handleFormSubmit}>
                <div className={`border border-botom p-4 rounded v-100 ${isDarkMode ? "darkModePrincipal text-light border-secondary" : ""}`}>
                    <h3 className="form-title fw-semibold border-bottom p-1">Imprimir Etiquetas</h3>
                    <div className="row justify-content-center">
                        {/* Contenedor de Input */}
                        <div className="col-12 col-md-6 text-center" style={{ maxWidth: "300px" }}>
                            <label>Ingrese número de Inventario</label>
                            <input
                                aria-label="aF_CLAVE"
                                type="text"
                                className={`form-select text-center ${isDarkMode ? "bg-dark text-light border-secondary" : ""} ${error.aF_CLAVE ? "is-invalid" : ""}`}
                                maxLength={12}
                                size={50}
                                name="aF_CLAVE"
                                placeholder="12345..."
                                onChange={handleChange}
                                value={Inventario.aF_CLAVE}
                            />
                            {error.aF_CLAVE && (
                                <div className="invalid-feedback fw-semibold">{error.aF_CLAVE}</div>
                            )}
                        </div>

                        {/* Contenedor del Botón */}
                        <div className="col-12 text-center">
                            <button type="submit" disabled={loading} className={`btn mt-3 ${isDarkMode ? "btn-secondary" : "btn-primary"}`}>
                                {loading ? (
                                    <>
                                        {" Generando... "}
                                        <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                                    </>
                                ) : (
                                    "Generar QR"
                                )}
                            </button>
                        </div>

                        {datosEtiqueta.map((traeEtiqueta) => (
                            <div
                                key={traeEtiqueta.aF_CODIGO_LARGO}
                                className="position-relative d-flex justify-content-center align-items-center mt-5"
                            >
                                <div className="d-flex border w-50 p-4 justify-content-center position-relative tarjeta-hover rounded-3">
                                    {/* QR con mayor resolución y corrección */}
                                    <QRCodeSVG
                                        value={`Cod. Bien: ${traeEtiqueta.aF_CODIGO_LARGO} ` +
                                            `Nom. Bien: ${traeEtiqueta.aF_DESCRIPCION} ` +
                                            `F. Alta: ${traeEtiqueta.aF_FECHA_ALTA} ` +
                                            `Cta. Contable: ${traeEtiqueta.aF_NCUENTA}`}
                                        size={150}
                                        level="H"
                                        className="mx-4 mt-3"
                                    />

                                    {/* Datos del activo */}
                                    <div className="text-start mt-3 rounded">
                                        <p className="fs-0.09em mb-1">{traeEtiqueta.aF_UBICACION}</p>
                                        <p className="fw-semibold mb-1">{traeEtiqueta.aF_CODIGO_LARGO}</p>
                                        <p className="fs-0.09em">{traeEtiqueta.aF_DESCRIPCION}</p>
                                    </div>

                                    {/* Capa de oscurecimiento con texto */}
                                    <div className="overlay"
                                        onClick={async () => {
                                            const primerElemento = datosEtiqueta[0];
                                            if (primerElemento) {
                                                try {
                                                    const qrBase64 = await generateQRCodeBase64(
                                                        `Cod. Bien: ${primerElemento.aF_CODIGO_LARGO} ` +
                                                        `Nom. Bien: ${primerElemento.aF_DESCRIPCION} ` +
                                                        `F. Alta: ${primerElemento.aF_FECHA_ALTA} ` +
                                                        `Cta. Contable: ${primerElemento.aF_NCUENTA}`
                                                    );
                                                    setEtiqueta({
                                                        ...primerElemento,
                                                        qrImage: qrBase64,
                                                    });
                                                    setMostrarModal(true);
                                                } catch (error) {
                                                    // console.error("Error al generar el QR:", error);
                                                }
                                            }
                                        }}>
                                        <span className="overlay-text">Haga clic para imprimir</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </form>
            <Modal
                show={mostrarModal}
                onHide={() => setMostrarModal(false)}
                dialogClassName="modal-right" size="lg">
                <Modal.Header className={isDarkMode ? "darkModePrincipal" : ""} closeButton>
                    <Modal.Title className="fw-semibold">Imprimir QR</Modal.Title>
                </Modal.Header>
                <Modal.Body className={` ${isDarkMode ? "darkModePrincipal" : ""}`}>
                    <BlobProvider document={<DocumentoPDF Etiqueta={Etiqueta}

                    />}>
                        {({ url, loading }) =>
                            loading ? (
                                <p>Generando QR...</p>
                            ) : (

                                <iframe
                                    src={url ? `${url}` : ''}
                                    title="Vista Previa del PDF"
                                    style={{
                                        width: "100%",
                                        height: "500px",
                                        border: "none",
                                    }}
                                ></iframe>

                            )
                        }
                    </BlobProvider>
                </Modal.Body>
            </Modal>
        </Layout >
    );
};

const mapStateToProps = (state: RootState) => ({
    datosEtiqueta: state.obtenerEtiquetasAltasReducers.datosEtiqueta,
    isDarkMode: state.darkModeReducer.isDarkMode,
});

export default connect(mapStateToProps, {
    obtenerEtiquetasAltasActions
})(ImprimirEtiqueta);
