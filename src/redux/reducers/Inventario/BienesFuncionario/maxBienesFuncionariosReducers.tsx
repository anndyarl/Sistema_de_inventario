import {
    MAX_BIENES_FUNCIONARIOS_REQUEST,
    MAX_BIENES_FUNCIONARIOS_SUCCESS,
    MAX_BIENES_FUNCIONARIOS_FAIL
} from '../../../actions/Inventario/types'

// Define el tipo para el estado inicial
interface PropsState {
    afCodigoGenerico: string;
}
// Estado inicial tipado
const initialState: PropsState = {
    afCodigoGenerico: ""
};

// Reducer con tipos definidos
const maxBienesFuncionariosReducers = (state = initialState, action: any) => {
    switch (action.type) {
        case MAX_BIENES_FUNCIONARIOS_REQUEST:
            return { ...state, loading: true };
        case MAX_BIENES_FUNCIONARIOS_SUCCESS:
            return {
                ...state,
                loading: false,
                afCodigoGenerico: action.payload,
            };
        case MAX_BIENES_FUNCIONARIOS_FAIL:
            return { ...state, loading: false, error: action.error };
        default:
            return state;
    }
};



export default maxBienesFuncionariosReducers;
