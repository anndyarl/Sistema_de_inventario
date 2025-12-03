import {
    BUSCAR_BIENES_FUNCIONARIOS_REQUEST,
    BUSCAR_BIENES_FUNCIONARIOS_SUCCESS,
    BUSCAR_BIENES_FUNCIONARIOS_FAIL
} from '../../../actions/Inventario/types'

// Define el tipo para el estado inicial
interface PropsState {
    buscarBienesFuncionarios: any[];
}
// Estado inicial tipado
const initialState: PropsState = {
    buscarBienesFuncionarios: []
};

// Reducer con tipos definidos
const buscarBienesFuncionariosReducers = (state = initialState, action: any) => {
    switch (action.type) {
        case BUSCAR_BIENES_FUNCIONARIOS_REQUEST:
            return { ...state, loading: true };
        case BUSCAR_BIENES_FUNCIONARIOS_SUCCESS:
            return {
                ...state,
                loading: false,
                buscarBienesFuncionarios: action.payload,
            };
        case BUSCAR_BIENES_FUNCIONARIOS_FAIL:
            return { ...state, loading: false, error: action.error };
        default:
            return state;
    }
};



export default buscarBienesFuncionariosReducers;
