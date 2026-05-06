import { ComboFuncionarioBE } from '../../../components/Bajas/BodegaExcluidos';
import {
    COMBO_FUNCIONARIO_BE_REQUEST,
    COMBO_FUNCIONARIO_BE_SUCCESS,
    COMBO_FUNCIONARIO_BE_FAIL
} from '../../actions/Bajas/BodegaExcluidos/comboFuncionarioBEActions';

interface FuncionarioBEState {
    loading: boolean;
    comboFuncionarioBE: ComboFuncionarioBE[];
    error: string | null;
}

const initialState: FuncionarioBEState = {
    loading: false,
    comboFuncionarioBE: [],
    error: null,
};

const comboFuncionarioBEReducer = (state = initialState, action: any): FuncionarioBEState => {
    switch (action.type) {
        case COMBO_FUNCIONARIO_BE_REQUEST:
            return {
                ...state,
                loading: true,
                error: null
            };
        case COMBO_FUNCIONARIO_BE_SUCCESS:
            return {
                ...state,
                loading: false,
                comboFuncionarioBE: action.payload
            };
        case COMBO_FUNCIONARIO_BE_FAIL:
            return {
                ...state,
                loading: false,
                error: 'Error al cargar funcionarios',
                comboFuncionarioBE: []
            };
        default:
            return state;
    }
};

export default comboFuncionarioBEReducer;