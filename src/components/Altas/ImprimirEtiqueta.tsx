import React, { useEffect, useRef, useState } from "react";

import { Button, Col, Row } from "react-bootstrap";
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
    const [Inventario, setInventario] = useState({
        aF_CLAVE: "",
    });
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
        if (!Inventario.aF_CLAVE) tempErrors.aF_CLAVE = "Debe ingresar un número obligatorio.";

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
        if (validate()) {
            let resultado = await obtenerEtiquetasAltasActions(Inventario.aF_CLAVE);
            if (resultado) {
                Swal.fire({
                    icon: "success",
                    title: "Código QR generado",
                    text: "Se ha generado un código QR al número ingresado",
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: ":'(",
                    text: "No se encontraron resultados, inténte otro registro.",
                });
            }
        };

    };
    return (
        <Layout>
            <MenuAltas />
            <div className="container mt-2">
                <div className="border-bottom shadow-sm p-4 rounded vh-100">
                    <h3 className="form-title fw-semibold border-bottom p-1">
                        Generación código QR
                    </h3>

                    <form onSubmit={handleFormSubmit}>

                        <div className="d-flex justify-content-center mb-1">
                            <label className="text-muted fw-semibold">Nº Inventario</label>
                        </div>
                        <div className="d-flex justify-content-center ">
                            <input
                                aria-label="aF_CLAVE"
                                type="text"
                                className={`form-control text-center  ${error.aF_CLAVE ? "is-invalid" : ""
                                    } w-25`}
                                maxLength={12}
                                name="aF_CLAVE"
                                placeholder="Ingrese un número de inventario"
                                onChange={handleChange}
                                value={Inventario.aF_CLAVE}

                            />
                        </div>
                        {error.aF_CLAVE && (
                            <div className="d-flex justify-content-center invalid-feedback d-block">
                                {error.aF_CLAVE}
                            </div>
                        )}

                        <div className="p-1 rounded bg-white d-flex justify-content-center ">
                            <button type="submit" className="btn btn-primary">
                                Generar
                            </button>
                        </div>
                        {datosEtiqueta.map((traeEtiqueta) => (
                            <div key={traeEtiqueta.aF_CODIGO_LARGO} >
                                <div className="d-flex justify-content-center m-5">
                                    <QRCodeSVG value={traeEtiqueta.aF_CODIGO_LARGO} size={128} />
                                    <div className="m-2">
                                        <h3 className="text-semibold mb-1">{traeEtiqueta.aF_CODIGO_LARGO}</h3>
                                        <p className="mb-1">{traeEtiqueta.aF_DESCRIPCION}</p>
                                        <p className="mb-1">{traeEtiqueta.aF_UBICACION}</p>
                                    </div>
                                </div>


                                {/* <QRCodeCanvas value={traeEtiqueta.aF_CODIGO_LARGO} size={128} /> */}
                            </div>
                        ))}


                    </form>
                </div>
            </div>
        </Layout>
    );
};

const mapStateToProps = (state: RootState) => ({
    datosEtiqueta: state.obtenerEtiquetasAltasReducers.datosEtiqueta,
});

export default connect(mapStateToProps, { obtenerEtiquetasAltasActions })(ImprimirEtiqueta);
