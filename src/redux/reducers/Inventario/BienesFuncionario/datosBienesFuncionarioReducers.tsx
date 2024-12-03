
interface datosBieneFuncioanrioState {
    rutFuncionario: string;
    servicio: number;
    dependencia: number;
}

// Estado inicial tipado
const initialState: datosBieneFuncioanrioState = {
    rutFuncionario: "",
    servicio: 0,
    dependencia: 0
};



// Reducer con tipos definidos
const datosBienesFuncionarioReducers = (state = initialState, action: any) => {
    switch (action.type) {
        case 'SET_RUT_FUNCIONARIO':
            return { ...state, rutFuncionario: action.payload };
        case 'SET_SERVICIO_BIENES_FUNCIONARIO':
            return { ...state, servicio: action.payload };
        case 'SET_DEPENDENCIA_BIENES_FUNCIONARIO':
            return { ...state, dependencia: action.payload };

        default:
            return state;
    }
};



export default datosBienesFuncionarioReducers;
