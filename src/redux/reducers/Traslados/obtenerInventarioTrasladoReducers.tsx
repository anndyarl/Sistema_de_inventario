
import {
    OBTIENE_INV_TRASLADOS_REQUEST,
    OBTIENE_INV_TRASLADOS_SUCCESS,
    OBTIENE_INV_TRASLADOS_FAIL,
} from '../../actions/Traslados/types';


// Define el tipo para el estado inicial
interface obtenerInventarioState {
    loading: boolean;
    error: string | null;
    aF_CLAVE: number;
    seR_CORR: number;
    deP_CORR_ORIGEN: number; //deP_CORR_ORIGEN
    esP_CODIGO: string;
    af_codigo_generico: string; //nInventario
    marca: string;
    modelo: string;
    serie: string;
    traS_DET_CORR: number;
    dependenciaDestino: number; //deP_CORR
    enComododato: string;
    traS_CO_REAL: number; //traspasoReal
    traS_MEMO_REF: string; //nMemoRef
    traS_FECHA_MEMO: string; //fechaMemo
    deT_OBS: string; //observaciones
    traS_NOM_ENTREGA: string; //entrgadoPor
    traS_NOM_RECIBE: string; //recibidoPor
    traS_NOM_AUTORIZA: string; //jefeAutoriza
    n_TRASLADO: number; //nTraslado

}

// Estado inicial tipado
const initialState: obtenerInventarioState = {
    loading: false,
    error: null,
    aF_CLAVE: 0,
    seR_CORR: 0,
    deP_CORR_ORIGEN: 0, //deP_CORR_ORIGEN
    esP_CODIGO: "",
    af_codigo_generico: "", //nInventario
    marca: "",
    modelo: "",
    serie: "",
    traS_DET_CORR: 0,
    dependenciaDestino: 0, //deP_CORR
    enComododato: "",
    traS_CO_REAL: 0, //traspasoReal
    traS_MEMO_REF: "",//nMemoRef
    traS_FECHA_MEMO: "", //fechaMemo
    deT_OBS: "", //observaciones
    traS_NOM_ENTREGA: "", //entrgadoPor
    traS_NOM_RECIBE: "", //recibidoPor
    traS_NOM_AUTORIZA: "", //jefeAutoriza
    n_TRASLADO: 0,//nTraslado

};


// Reducer con tipos definidos
const obtenerInventarioTrasladoReducers = (state = initialState, action: any): obtenerInventarioState => {
    switch (action.type) {
        case 'SET_AF_CODIGO_GENERICO':
            return { ...state, af_codigo_generico: action.payload };
        case 'SET_MARCA_MOD':
            return { ...state, marca: action.payload };
        case 'SET__MODELO_MOD':
            return { ...state, modelo: action.payload };
        case 'SET_SERIE_MOD':
            return { ...state, serie: action.payload };
        case 'SET_OBS_MOD':
            return { ...state, deT_OBS: action.payload };

        case OBTIENE_INV_TRASLADOS_REQUEST:
            return {
                ...state,
                loading: true,
                error: null
            };
        case OBTIENE_INV_TRASLADOS_SUCCESS:
            return {
                ...state,
                loading: false,
                aF_CLAVE: action.payload.aF_CLAVE,
                af_codigo_generico: action.payload.aF_CODIGO_GENERICO,
                seR_CORR: action.payload.seR_CORR,
                deP_CORR_ORIGEN: action.payload.deP_CORR_ORIGEN,
                esP_CODIGO: action.payload.esP_CODIGO,
                marca: action.payload.deT_MARCA,
                modelo: action.payload.deT_MODELO,
                serie: action.payload.deT_SERIE,
                deT_OBS: action.payload.deT_OBS
            };
        case OBTIENE_INV_TRASLADOS_FAIL:
            return {
                ...state,
                loading: false,
                error: action.error || 'Error desconocido', // Mejor manejo de errores
            };
        default:
            return state;
    }
};

export default obtenerInventarioTrasladoReducers;
