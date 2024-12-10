// src/redux/reducers/themeReducer.ts

import { DARK_MODE } from "../../actions/Otros/types";


interface ThemeState {
    isDarkMode: boolean;
}

const initialState: ThemeState = {
    isDarkMode: false, // Modo claro por defecto
};

const darkModeReducer = (state = initialState, action: any): ThemeState => {
    switch (action.type) {
        case DARK_MODE:
            return {
                ...state,
                isDarkMode: !state.isDarkMode,
            };
        default:
            return state;
    }
};

export default darkModeReducer;
