
import {
    LISTA_TRASLADOS_REQUEST,
    LISTA_TRASLADOS_SUCCESS,
    LISTA_TRASLADOS_FAIL
} from '../../actions/Traslados/types'

// Define el tipo para el estado inicial
interface PropsState {
    listadoTraslados: Array<{
        aF_CODIGO_GENERICO: string,
        usuariO_MOD: string,
        usuariO_CREA: string,
        traS_OBS: string,
        traS_NOM_RECIBE: string,
        traS_NOM_ENTREGA: string,
        traS_NOM_AUTORIZA: string,
        traS_MEMO_REF: string,
        traS_FECHA_MEMO: number,
        traS_FECHA: string,
        traS_ESTADO_AF: string,
        traS_DET_CORR: number,
        traS_CORR: number,
        traS_CO_REAL: number,
        n_TRASLADO: number,
        iP_MOD: string,
        iP_CREA: string,
        f_MOD: number,
        f_CREA: number,
        estaD_D: number,
        deP_CORR_ORIGEN: number,
        deP_CORR: number,
        aF_CLAVE: number,
        seR_NOMBRE_ORIGEN: string,
        deP_NOMBRE_ORIGEN: string;
        seR_NOMBRE_DESTINO: string,
        deP_NOMBRE_DESTINO: string;
    }>;
}
// Estado inicial tipado
const initialState: PropsState = {
    listadoTraslados: []
};

// Reducer con tipos definidos
const listadoTrasladosReducers = (state = initialState, action: any) => {
    switch (action.type) {
        case LISTA_TRASLADOS_REQUEST:
            return { ...state, loading: true };
        case LISTA_TRASLADOS_SUCCESS:
            return {
                ...state,
                loading: false,
                listadoTraslados: action.payload,
            };
        case LISTA_TRASLADOS_FAIL:
            return { ...state, loading: false, error: action.error };
        default:
            return state;
    }
};



export default listadoTrasladosReducers;
