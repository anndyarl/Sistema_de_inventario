import { useEffect, useState } from 'react';
import { connect, useSelector } from 'react-redux';
import { RootState } from '../../../redux/reducers';
import { useLocation } from 'react-router-dom';
import { BlobProvider } from '@react-pdf/renderer';
import InfoActivoPDF from './InfoActivoPDF';

import { obtenerReimpresionEtiquetasAltasActions } from '../../../redux/actions/Altas/ImprimirEtiquetas/obtenerReimpresionEtiquetasAltasActions';
import { authActions } from '../../../redux/actions/auth/authActions';


interface Props {
    authActions: (usuario: string, password: string) => Promise<boolean>;
    obtenerReimpresionEtiquetasAltasActions: (fDesde: string, fHasta: string, establ_corr: number, altasCorr: number, af_codigo_generico: string, dep_corr: number) => Promise<boolean>;
}

const InfoActivo: React.FC<Props> = ({ authActions, obtenerReimpresionEtiquetasAltasActions }) => {

    const listaReimpresionEtiquetas = useSelector((state: RootState) => state.obtenerReimpresionEtiquetasAltasReducers.listaReimpresionEtiquetas);
    // const objeto = useSelector((state: RootState) => state.validaApiLoginReducers);
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const aF_CODIGO_GENERICO = params.get("codigoinv") ?? "";
    const [loading, setLoading] = useState(true);
    const [etiqueta, setEtiqueta] = useState<any | null>(null);
    const usuario = import.meta.env.VITE_USUARIO_API_LOGIN;
    const password = import.meta.env.VITE_PASSWORD_API_LOGIN;


    useEffect(() => {
        if (aF_CODIGO_GENERICO.length > 0) obtieneToken();
    }, [aF_CODIGO_GENERICO]);

    const obtieneToken = async () => {
        setLoading(true);
        try {
            const resultado = await authActions(usuario, password);
            if (resultado) {
                obtenerReimpresionEtiquetasAltasActions("", "", 0, 0, aF_CODIGO_GENERICO, 0);
                setLoading(false);
            }
        } catch (error) {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (listaReimpresionEtiquetas.length > 0) {
            const encontrada = listaReimpresionEtiquetas.find(
                (item) => item.aF_CODIGO_GENERICO === aF_CODIGO_GENERICO
            );
            setEtiqueta(encontrada ?? null);
        }
    }, [listaReimpresionEtiquetas, aF_CODIGO_GENERICO]);


    if (loading) {
        return <div className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
            style={{
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                zIndex: 1050,
            }}
        >
            <div className="text-center">
                <div className="spinner-border text-light mb-3" role="status" style={{ width: "3rem", height: "3rem" }} />
                <p className="text-white fw-semibold mb-0">Cargando Información, un momento...</p>
            </div>
        </div>;
    }

    if (!etiqueta) {
        return <div className="text-danger fw-bold vh-100 row align-content-center justify-content-center">No se encontró la etiqueta consultada.</div>;
    }

    return (
        // <BlobProvider document={<InfoActivoPDF row={[etiqueta]} />}>
        //     {({ url }) =>
        //         <iframe className='vh-100' src={url ?? ""} style={{ width: "100%", height: "100%", border: "none" }} />

        //     }
        // </BlobProvider>

        <BlobProvider document={<InfoActivoPDF row={[etiqueta]} />}>
            {({ url }) =>
                url ? (

                    <div className={`d-flex justify-content-center align-items-center vh-100 `}
                        style={{
                            backgroundColor: "rgba(0, 0, 0, 0.5)",
                            zIndex: 1050,
                        }}>
                        <div className="col-12 col-md-8 text-center">
                            <div className="m-4 rounded d-inline-block">
                                <p className="text-white mb-3">
                                    Haga clic en el botón de abajo para descargar el documento generado.
                                </p>

                                <a
                                    href={url}
                                    download={`${etiqueta}.pdf`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-primary btn-lg shadow rounded-pill px-4"
                                >
                                    Descargar PDF
                                </a>
                            </div>
                        </div>
                    </div>


                ) : (
                    <div>Generando PDF...</div>
                )
            }
        </BlobProvider >


        //    <BlobProvider document={<InfoActivoPDF row={[etiqueta]} />}>
        //     {({ url, loading }) => {
        //         useEffect(() => {
        //             if (!loading && url) {
        //                 window.open(url, "_blank");
        //             }
        //         }, [loading, url]);

        //         return loading ? <p>Generando PDF...</p> : null;
        //     }}
        // </BlobProvider>
    );
};

const mapStateToProps = (_: RootState) => ({
});

export default connect(mapStateToProps, {
    authActions,
    obtenerReimpresionEtiquetasAltasActions
})(InfoActivo);

