import React, { useEffect, useRef, useState } from "react";

import { Button, Col, Row, Spinner } from "react-bootstrap";
import Swal from "sweetalert2";
import { QRCodeSVG, QRCodeCanvas } from 'qrcode.react';
import Layout from "../../containers/hocs/layout/Layout";
import MenuAltas from "../Menus/MenuAltas";

import { connect } from "react-redux";

import { RootState } from "../../store";
import { obtenerEtiquetasAltasActions } from "../../redux/actions/Altas/ImprimirEtiquetas/obtenerEtiquetasAltasActions";
import { InventarioCompleto } from "../Inventario/ModificarInventario/ModificarInventario";

interface DatosEtiquetaPrps {
    aF_CODIGO_LARGO: string,
    aF_DESCRIPCION: string,
    aF_UBICACION: string
}
interface DatosProps {
    obtenerEtiquetasAltasActions: (aF_CLAVE: string) => Promise<boolean>;
    datosEtiqueta: DatosEtiquetaPrps[];

}
const ImprimirEtiqueta: React.FC<DatosProps> = ({ obtenerEtiquetasAltasActions, datosEtiqueta }) => {

    const [error, setError] = useState<Partial<InventarioCompleto> & {}>({});
    const [Inventario, setInventario] = useState({ aF_CLAVE: "" });
    const [loading, setLoading] = useState(false); // Estado para controlar la carga

    // useEffect(() => {
    //     setInventario({
    //         aF_CLAVE,
    //         datosEtiqueta
    //     });
    // }, [
    //     aF_CLAVE,
    //     datosEtiqueta
    // ]);
    const validate = () => {
        let tempErrors: Partial<any> & {} = {};
        // Validación para N° de Recepción (debe ser un número)
        if (!Inventario.aF_CLAVE) {
            setLoading(false);
            tempErrors.aF_CLAVE = "Debe ingresar un número obligatorio.";
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
    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        if (validate()) {
            let resultado = await obtenerEtiquetasAltasActions(Inventario.aF_CLAVE);
            if (resultado) {
                Swal.fire({
                    icon: "success",
                    // title: "Código QR generado correctamente",
                    text: "Código QR generado correctamente",
                });
                setLoading(false);
            } else {
                Swal.fire({
                    icon: "error",
                    title: ":'(",
                    text: "No se encontraron resultados, inténte otro registro.",
                });
                setLoading(false);
            }
        };

    };
    return (
        <Layout>
            <MenuAltas />
            <form onSubmit={handleFormSubmit}>
                <div className="border-bottom shadow-sm p-4 rounded">
                    <h3 className="form-title fw-semibold border-bottom p-1">Generación código QR</h3>
                    <div className="row justify-content-center">
                        {/* Contenedor de Input */}
                        <div className="col-12 col-md-6 text-center">
                            <input
                                aria-label="aF_CLAVE"
                                type="text"
                                className={`form-control text-center ${error.aF_CLAVE ? "is-invalid" : ""}`}
                                maxLength={12}
                                name="aF_CLAVE"
                                placeholder="Ingrese un número de inventario"
                                onChange={handleChange}
                                value={Inventario.aF_CLAVE}
                            />
                            {error.aF_CLAVE && (
                                <div className="invalid-feedback">{error.aF_CLAVE}</div>
                            )}
                        </div>

                        {/* Contenedor del Botón */}
                        <div className="col-12 text-center">
                            <button type="submit" disabled={loading} className="btn btn-primary mt-3">
                                {loading ? (
                                    <>
                                        {" Generando... "}
                                        <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                                    </>
                                ) : (
                                    "Generar"
                                )}
                            </button>
                        </div>

                        {/* Contenedor del QR y sus datos */}
                        {datosEtiqueta.map((traeEtiqueta) => (
                            <div key={traeEtiqueta.aF_CODIGO_LARGO} className="col-12 text-center mt-4">
                                <p className="fw-semibold border-bottom p-1 w-100"></p>
                                <h3 className="mb-1 text-semibold">{traeEtiqueta.aF_CODIGO_LARGO}</h3>
                                <p className="mb-1 text-muted">{traeEtiqueta.aF_DESCRIPCION}</p>
                                <p className="mb-3 text-muted">{traeEtiqueta.aF_UBICACION}</p>
                                <div className="mb-1 d-flex justify-content-center">
                                    <QRCodeSVG value={traeEtiqueta.aF_CODIGO_LARGO} size={200} level="L" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </form>


        </Layout>
    );
};

const mapStateToProps = (state: RootState) => ({
    datosEtiqueta: state.obtenerEtiquetasAltasReducers.datosEtiqueta,
});

export default connect(mapStateToProps, { obtenerEtiquetasAltasActions })(ImprimirEtiqueta);
