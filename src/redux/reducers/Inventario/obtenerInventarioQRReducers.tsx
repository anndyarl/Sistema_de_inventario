
import { ListaSeleccion } from '../../../components/Inventario/LevantamientoFisico';
import {
    OBTIENE_INV_QR_REQUEST,
    OBTIENE_INV_QR_SUCCESS,
    OBTIENE_INV_QR_FAIL,
} from '../../actions/Inventario/types';


// Define el tipo para el estado inicial
interface obtenerInventarioState {
    loading: boolean;
    error: string | null;
    listaSeleccion: ListaSeleccion[];

}

// Estado inicial tipado
const initialState: obtenerInventarioState = {
    loading: false,
    error: null,
    listaSeleccion: [],
};


// Reducer con tipos definidos
const obtenerInventarioQRReducers = (state = initialState, action: any): obtenerInventarioState => {
    switch (action.type) {

        case OBTIENE_INV_QR_REQUEST:
            return {
                ...state,
                loading: true,
                error: null
            };
        case OBTIENE_INV_QR_SUCCESS:
            return {
                ...state,
                loading: false,
                listaSeleccion: action.payload,
            };
        case OBTIENE_INV_QR_FAIL:
            return {
                ...state,
                loading: false,
                error: action.error || 'Error desconocido', // Mejor manejo de errores
            };
        default:
            return state;
    }
};

export default obtenerInventarioQRReducers;
