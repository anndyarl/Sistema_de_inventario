import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/reducers';
import { useLocation } from 'react-router-dom';
import { BlobProvider } from '@react-pdf/renderer';
import InfoActivoPDF from './InfoActivoPDF';
import { obtenerEtiquetasAltasActions } from '../../../redux/actions/Altas/ImprimirEtiquetas/obtenerEtiquetasAltasActions';
import { AppDispatch } from '../../../store';

const InfoActivo: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const listaEtiquetas = useSelector((state: RootState) => state.obtenerEtiquetasAltasReducers.listaEtiquetas);
    const objeto = useSelector((state: RootState) => state.validaApiLoginReducers);
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const aF_CODIGO_GENERICO = params.get("codigoinv");

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const cargarDatos = async () => {
            if (listaEtiquetas.length === 0) {
                await dispatch(obtenerEtiquetasAltasActions("", "", objeto.Roles[0].codigoEstablecimiento, 0, ""));
            }
            setLoading(false);
        };

        cargarDatos();
    }, [aF_CODIGO_GENERICO]);

    const etiqueta = listaEtiquetas.find(item => item.aF_CODIGO_GENERICO === aF_CODIGO_GENERICO);

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
        <BlobProvider document={<InfoActivoPDF row={[etiqueta]} />}>
            {({ url }) =>
                <iframe className='vh-100' src={url ?? ""} style={{ width: "100%", height: "100%", border: "none" }} />
            }
        </BlobProvider>
    );
};

export default InfoActivo;
