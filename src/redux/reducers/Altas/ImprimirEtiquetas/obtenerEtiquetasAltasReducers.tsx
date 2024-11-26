
import {
    ETIQUETAS_ALTAS_REQUEST,
    ETIQUETAS_ALTAS_SUCCESS,
    ETIQUETAS_ALTAS_FAIL
} from '../../../actions/Altas/types';

// Define el tipo para el estado inicial
interface DatosEtiquetaState {
    datosEtiqueta: Array<{
        aF_CODIGO_LARGO: string,
        aF_DESCRIPCION: string,
        aF_UBICACION: string
    }>;
}

// Estado inicial tipado
const initialState: DatosEtiquetaState = {
    datosEtiqueta: []
};

// Reducer con tipos definidos
const obtenerEtiquetasAltasReducers = (state = initialState, action: any) => {
    switch (action.type) {
        case ETIQUETAS_ALTAS_REQUEST:
            return { ...state, loading: true };
        case ETIQUETAS_ALTAS_SUCCESS:
            return {
                ...state,
                loading: false,
                datosEtiqueta: action.payload,
            };
        case ETIQUETAS_ALTAS_FAIL:
            return { ...state, loading: false, error: action.error };
        default:
            return state;
    }
};



export default obtenerEtiquetasAltasReducers;
