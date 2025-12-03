import {
    LISTA_BIENES_FUNCIONARIOS_REQUEST,
    LISTA_BIENES_FUNCIONARIOS_SUCCESS,
    LISTA_BIENES_FUNCIONARIOS_FAIL
} from '../../../actions/Inventario/types'

// Define el tipo para el estado inicial
interface PropsState {
    listadoBienesFuncionarios: any[];
}
// Estado inicial tipado
const initialState: PropsState = {
    listadoBienesFuncionarios: []
};

// Reducer con tipos definidos
const listadoBienesFuncionariosReducers = (state = initialState, action: any) => {
    switch (action.type) {
        case LISTA_BIENES_FUNCIONARIOS_REQUEST:
            return { ...state, loading: true };
        case LISTA_BIENES_FUNCIONARIOS_SUCCESS:
            return {
                ...state,
                loading: false,
                listadoBienesFuncionarios: action.payload,
            };
        case LISTA_BIENES_FUNCIONARIOS_FAIL:
            return { ...state, loading: false, error: action.error };
        default:
            return state;
    }
};



export default listadoBienesFuncionariosReducers;
