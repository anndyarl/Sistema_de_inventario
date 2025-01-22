import {
    PREGUNTA_IA_REQUEST,
    PREGUNTA_IA_SUCCESS,
    PREGUNTA_IA_FAIL,
} from "../../actions/Otros/types";

const initialState = {
    loading: false,
    respuestaIA: "",
    error: null,
    contadorSolicitudes: 0, // Contador de solicitudes
};

const respuestaReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case PREGUNTA_IA_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
                contadorSolicitudes: state.contadorSolicitudes + 1, // Incrementar el contador
            };
        case PREGUNTA_IA_SUCCESS:
            return {
                ...state,
                loading: false,
                respuestaIA: action.payload,
            };
        case PREGUNTA_IA_FAIL:
            return {
                ...state,
                loading: false,
                error: action.error,
            };
        default:
            return state;
    }
};

export default respuestaReducer;
