// reducers/origenPresupuestoReducer.ts
import { ListaEspecie } from '../../../../components/Inventario/RegistrarInventario/DatosCuenta';
import {
    LISTADO_ESPECIES_BIEN_REQUEST,
    LISTADO_ESPECIES_BIEN_SUCCESS,
    COMBO_ESPECIES_BIEN_SUCCESS,
    LISTADO_ESPECIES_BIEN_FAIL,

} from '../../../actions/Inventario/types';

interface ListadoDeEspeciesBienState {
    loading: boolean;
    listadoDeEspecies: ListaEspecie[];
    comboEspecies: ListaEspecie[];
    error: string | null;
}

const initialState: ListadoDeEspeciesBienState = {
    loading: false,
    listadoDeEspecies: [],
    comboEspecies: [],
    error: null,
};

const listadoDeEspeciesBienReducers = (state = initialState, action: any): ListadoDeEspeciesBienState => {
    switch (action.type) {
        case LISTADO_ESPECIES_BIEN_REQUEST:
            return {
                ...state,
                loading: true,
                error: null
            };
        case LISTADO_ESPECIES_BIEN_SUCCESS:
            return {
                ...state,
                loading: false,
                listadoDeEspecies: action.payload
            };
        case COMBO_ESPECIES_BIEN_SUCCESS:
            return {
                ...state,
                loading: false,
                comboEspecies: action.payload
            };
        case LISTADO_ESPECIES_BIEN_FAIL:
            return {
                ...state,
                loading: false,
                error: action.error
            };
        default:
            return state;
    }
};

export default listadoDeEspeciesBienReducers;