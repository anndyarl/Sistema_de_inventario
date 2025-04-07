
interface datosCuentaState {
    servicio: number;
    cuenta: number;
    dependencia: number;
    especie: string;
    descripcionEspecie: string;
    nombreEspecie: string[];
}

// Estado inicial tipado
const initialState: datosCuentaState = {
    servicio: 0,
    cuenta: 0,
    dependencia: 0,
    especie: '',
    descripcionEspecie: '',
    nombreEspecie: [],
};

// Reducer con tipos definidos
const datosCuentaReducers = (state = initialState, action: any) => {
    switch (action.type) {
        case 'SET_SERVICIO':
            return { ...state, servicio: action.payload };
        case 'SET_CUENTA':
            return { ...state, cuenta: action.payload };
        case 'SET_DEPENDENCIA':
            return { ...state, dependencia: action.payload };
        case 'SET_ESPECIE':
            return { ...state, especie: action.payload };
        case 'SET_ESPECIE':
            return { ...state, especie: action.payload };
        case 'SET_DESCRIPCION_ESPECIE':
            return { ...state, descripcionEspecie: action.payload };
        case 'SET_NOMBRE_ESPECIE':
            return {
                ...state,
                nombreEspecie: [...state.nombreEspecie, action.payload], // Agrega el nuevo nombre al array
            };
        default:
            return state;
    }
};



export default datosCuentaReducers;
