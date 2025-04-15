
import {
    OBTENER_SERVICIO_NOMBRE_REQUEST,
    OBTENER_SERVICIO_NOMBRE_SUCCESS,
    OBTENER_SERVICIO_NOMBRE_FAIL,

} from '../../../actions/Inventario/types';


// Define el tipo para el estado inicial
interface obtenerState {
    loading: boolean;
    error: string | null;
    listaServicioNombre: Array<{
        seR_COD: string;
        nombre: string;
    }>;
}

// Estado inicial tipado
const initialState: obtenerState = {
    loading: false,
    error: null,
    listaServicioNombre: [],
};


// Reducer con tipos definidos
const obtenerServicioNombreReducers = (state = initialState, action: any): obtenerState => {
    switch (action.type) {
        case OBTENER_SERVICIO_NOMBRE_REQUEST:
            return {
                ...state,
                loading: true,
                error: null
            };
        //Trae la busqueda
        case OBTENER_SERVICIO_NOMBRE_SUCCESS:
            return {
                ...state,
                loading: false,
                listaServicioNombre: action.payload
            };
        case OBTENER_SERVICIO_NOMBRE_FAIL:
            return {
                ...state,
                loading: false,
                error: action.error || 'Error desconocido', // Mejor manejo de errores
            };
        default:
            return state;
    }
};


export default obtenerServicioNombreReducers;
