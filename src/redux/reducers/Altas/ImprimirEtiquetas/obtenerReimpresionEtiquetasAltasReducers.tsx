
import { ListaEtiquetas } from '../../../../components/Altas/ImprimirEtiqueta/ImprimirEtiqueta';
import {
    REIMPRESION_ETIQUETAS_ALTAS_REQUEST,
    REIMPRESION_ETIQUETAS_ALTAS_SUCCESS,
    REIMPRESION_ETIQUETAS_ALTAS_FAIL
} from '../../../actions/Altas/types';

// Define el tipo para el estado inicial
interface PropsState {
    loading: boolean;
    listaReimpresionEtiquetas: ListaEtiquetas[];
    error: string | null;
}

// Estado inicial tipado
const initialState: PropsState = {
    loading: false,
    listaReimpresionEtiquetas: [],
    error: null,
};

// Reducer con tipos definidos
const obtenerReimpresionEtiquetasAltasReducers = (state = initialState, action: any): PropsState => {
    switch (action.type) {
        case REIMPRESION_ETIQUETAS_ALTAS_REQUEST:
            return {
                ...state,
                loading: true,
                error: null
            };
        case REIMPRESION_ETIQUETAS_ALTAS_SUCCESS:
            return {
                ...state,
                loading: false,
                listaReimpresionEtiquetas: action.payload
            };
        case REIMPRESION_ETIQUETAS_ALTAS_FAIL:
            return {
                ...state,
                loading: false,
                error: action.error,
                listaReimpresionEtiquetas: []
            };
        default:
            return state;
    }
};

export default obtenerReimpresionEtiquetasAltasReducers;
