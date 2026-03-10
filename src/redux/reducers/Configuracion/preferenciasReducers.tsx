
interface ThemeState {
    tiempoSesion: number;
}

const initialState: ThemeState = {
    tiempoSesion: 30,
};

const preferenciasReducers = (state = initialState, action: any): ThemeState => {
    switch (action.type) {
        case 'SET_TIEMPO_SESSION':
            return {
                ...state,
                tiempoSesion: action.payload,
            };
        default:
            return state;
    }
};

export default preferenciasReducers;
