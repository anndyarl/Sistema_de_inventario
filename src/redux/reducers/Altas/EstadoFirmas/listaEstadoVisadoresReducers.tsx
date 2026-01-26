
import { ListaEstadoFirmas } from '../../../../components/Altas/EstadoFirmas/EstadoFirmas ';
import {
    LISTA_ESTADO_VISADORES_REQUEST,
    LISTA_ESTADO_VISADORES_SUCCESS,
    LISTA_ESTADO_VISADORES_FAIL,
} from '../../../actions/Altas/types';

// Define el tipo para el estado inicial
interface DatosState {
    listaEstadoVisadores: ListaEstadoFirmas[];
    dataSeguimientoEstadoFirma?: number;
}
// Estado inicial tipado
const initialState: DatosState = {
    listaEstadoVisadores: [],
    dataSeguimientoEstadoFirma: 0
};

// Reducer con tipos definidos
const listaEstadoVisadoresReducers = (state = initialState, action: any) => {
    switch (action.type) {
        case 'SEGUIMIENTO_FIRMAS_ALTAS':
            return { ...state, dataSeguimientoEstadoFirma: action.payload };

        case LISTA_ESTADO_VISADORES_REQUEST:
            return { ...state, loading: true };
        case LISTA_ESTADO_VISADORES_SUCCESS:
            return {
                ...state,
                loading: false,
                listaEstadoVisadores: action.payload,
            };
        case LISTA_ESTADO_VISADORES_FAIL:
            return { ...state, loading: false, error: action.error };
        default:
            return state;
    }
};

export default listaEstadoVisadoresReducers;