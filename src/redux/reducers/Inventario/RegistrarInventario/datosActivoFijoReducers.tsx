import { ActivoFijo } from '../../../../components/Inventario/RegistrarInventario/DatosActivoFijo';


// Define el tipo para el estado inicial
interface DatosRecepcionState {
    resetFormulario: [];
    especie: string;
    descripcionEspecie: string;
    nombreEspecie: string[];
    datosTablaActivoFijo: ActivoFijo[];
    vidaUtil: string;
    fechaIngreso: string;
    marca: string;
    cantidad: string;
    modelo: string;
    observaciones: string;
    precio: string;
    resultadoRegistro: number;
}

// Estado inicial tipado
const initialState: DatosRecepcionState = {
    resetFormulario: [],
    especie: '',
    descripcionEspecie: '',
    nombreEspecie: [],
    datosTablaActivoFijo: [],
    vidaUtil: "",
    fechaIngreso: "",
    marca: "",
    cantidad: "",
    modelo: "",
    observaciones: "",
    precio: "",
    resultadoRegistro: 0
};


// Reducer con tipos definidos
const datosActivoFijoReducers = (state = initialState, action: any) => {
    switch (action.type) {
        case 'SET_ESPECIE':
            return { ...state, especie: action.payload };
        case 'SET_DESCRIPCION_ESPECIE':
            return { ...state, descripcionEspecie: action.payload };
        case 'SET_NOMBRE_ESPECIE':
            return {
                ...state,
                nombreEspecie: [...state.nombreEspecie, action.payload], // Agrega el nuevo nombre al array
            };
        case 'SET_DATOS_TABLA_ACTIVO_FIJO':
            return {
                ...state,
                datosTablaActivoFijo: [...state.datosTablaActivoFijo, ...action.payload], // Agrega los nuevos datos en lugar de sobrescribir
            };
        case 'ELIMINAR_ACTIVO_TABLA':
            return {
                ...state,
                datosTablaActivoFijo: state.datosTablaActivoFijo.filter((_, i) => i !== action.payload), // Filtra por índice
            };
        case 'ELIMINAR_MULTIPLES_ACTIVOS_TABLA':
            return {
                ...state,
                datosTablaActivoFijo: state.datosTablaActivoFijo.filter((_, index) => !action.payload.includes(index)), // Filtra los elementos por índice
            };
        case 'ACTUALIZAR_SERIE_TABLA':
            return {
                ...state,
                datosTablaActivoFijo: state.datosTablaActivoFijo.map((activo, i) =>
                    i === action.payload.index
                        ? { ...activo, serie: action.payload.nuevaSerie }
                        : activo
                )
            };
        case 'VACIAR_DATOS_TABLA':
            return {
                ...state,
                datosTablaActivoFijo: [], // Vacía completamente los datos de la tabla
            };
        case 'RESET_FORMULARIO':
            return { ...initialState, payload: initialState };
        default:
            return state;
        case 'SET_VIDA_UTIL':
            return { ...state, vidaUtil: action.payload };
        case 'SET_FECHA_INGRESO':
            return { ...state, fechaIngreso: action.payload };
        case 'SET_MARCA':
            return { ...state, marca: action.payload };
        case 'SET_MODELO':
            return { ...state, modelo: action.payload };
        case 'SET_PRECIO':
            return { ...state, precio: action.payload };
        case 'SET_CANTIDAD':
            return { ...state, cantidad: action.payload };
        case 'SET_OBSERVACIONES':
            return { ...state, observaciones: action.payload };
        case 'SET_INVENTARIO_REGISTRADO':
            return { ...state, resultadoRegistro: action.payload };
    }
};



export default datosActivoFijoReducers;
