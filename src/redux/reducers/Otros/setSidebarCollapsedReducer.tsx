// src/redux/reducers/themeReducer.ts

import { SIDEBAR_COLLAPSED } from "../../actions/Otros/types";

interface ThemeState {
    isSidebarCollapsed: boolean;
}

const initialState: ThemeState = {
    isSidebarCollapsed: false, // Modo claro por defecto
};

const setSidebarCollapsedReducer = (state = initialState, action: any): ThemeState => {
    switch (action.type) {
        case SIDEBAR_COLLAPSED:
            return {
                ...state,
                isSidebarCollapsed: !state.isSidebarCollapsed,
            };
        default:
            return state;
    }
};

export default setSidebarCollapsedReducer;
