
import { ListaEtiquetas } from '../../../../components/Altas/ImprimirEtiqueta/ImprimirEtiqueta';
import {
    ETIQUETAS_ALTAS_REQUEST,
    ETIQUETAS_ALTAS_SUCCESS,
    ETIQUETAS_ALTAS_FAIL
} from '../../../actions/Altas/types';

// Define el tipo para el estado inicial
interface PropsState {
    loading: boolean;
    listaEtiquetas: ListaEtiquetas[];
    error: string | null;
}

// Estado inicial tipado
const initialState: PropsState = {
    loading: false,
    listaEtiquetas: [],
    error: null,

};

// Reducer con tipos definidos
const obtenerEtiquetasAltasReducers = (state = initialState, action: any): PropsState => {
    switch (action.type) {
        case ETIQUETAS_ALTAS_REQUEST:
            return {
                ...state,
                loading: true,
                error: null
            };
        case ETIQUETAS_ALTAS_SUCCESS:
            return {
                ...state,
                loading: false,
                listaEtiquetas: action.payload
            };
        case ETIQUETAS_ALTAS_FAIL:
            return {
                ...state,
                loading: false,
                error: action.error
            };
        default:
            return state;
    }
};



export default obtenerEtiquetasAltasReducers;
