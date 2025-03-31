// src/redux/reducers/themeReducer.ts

import { MOSTRAR_N_PAGINACION } from "../../actions/Otros/types";


interface ThemeState {
    nPaginacion: number;
}

const initialState: ThemeState = {
    nPaginacion: 10,
};

const mostrarNPaginacionReducer = (state = initialState, action: any): ThemeState => {
    switch (action.type) {
        case MOSTRAR_N_PAGINACION:
            return {
                ...state,
                nPaginacion: action.payload,
            };
        default:
            return state;
    }
};

export default mostrarNPaginacionReducer;
