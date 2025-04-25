
import {
    OBTENER_INVENTARIO_REQUEST,
    OBTENER_INVENTARIO_SUCCESS,
    OBTENER_INVENTARIO_FAIL,
} from '../../../actions/Inventario/types';


// Define el tipo para el estado inicial
interface obtenerInventarioState {
    loading: boolean;
    error: string | null;
    aF_CODIGO_GENERICO: string;
    aF_FECHA_SOLICITUD: string; // fechaRecepcion 
    aF_OCO_NUMERO_REF: number; // nOrdenCompra
    aF_NUM_FAC: string// nFactura
    aF_ORIGEN: number;  //origenPresupuesto
    aF_MONTOFACTURA: number; //montoRecepcion
    aF_FECHAFAC: string; //fechaFactura
    proV_RUN: number; // rutProveedor
    idprograma: number; //servicio
    deP_CORR: number; //dependencia
    idmodalidadcompra: number; // modalidadDeCompra
    especie: string; //especie
    ctA_COD: string;
    //-------Tabla---------//
    aF_VIDAUTIL: number;
    aF_FINGRESO: string;
    deT_MARCA: string;
    deT_MODELO: string;
    deT_SERIE: string;
    deT_PRECIO: number;
    deT_OBS: string;
}

// Estado inicial tipado
const initialState: obtenerInventarioState = {
    loading: false,
    error: null,

    aF_CODIGO_GENERICO: "", // nRecepcion
    aF_FECHA_SOLICITUD: "", // fechaRecepcion 
    aF_OCO_NUMERO_REF: 0, // nOrdenCompra
    aF_NUM_FAC: "",// nFactura
    aF_ORIGEN: 0,  //origenPresupuesto
    aF_MONTOFACTURA: 0, //montoRecepcion
    aF_FECHAFAC: "", //fechaFactura
    proV_RUN: 0, // rutProveedor
    idprograma: 0, //servicio
    deP_CORR: 0, //dependencia
    idmodalidadcompra: 0, // modalidadDeCompra
    especie: "", //especie
    ctA_COD: "",
    //-------Tabla---------//
    aF_VIDAUTIL: 0,
    aF_FINGRESO: "",
    deT_MARCA: "",
    deT_MODELO: "",
    deT_SERIE: "",
    deT_PRECIO: 0,
    deT_OBS: ""
};


// Reducer con tipos definidos
const obtenerInventarioReducers = (state = initialState, action: any): obtenerInventarioState => {
    switch (action.type) {
        case 'SET_N_RECEPCION_MOD':
            return { ...state, aF_CODIGO_GENERICO: action.payload };
        case 'SET_FECHA_RECEPCION_MOD':
            return { ...state, aF_FECHA_SOLICITUD: action.payload };
        case 'SET_N_ORDEN_COMPRA_MOD':
            return { ...state, aF_OCO_NUMERO_REF: action.payload };
        case 'SET_N_FACTURA_MOD':
            return { ...state, aF_NUM_FAC: action.payload };
        case 'SET_ORIGEN_PRESUPUESTO_MOD':
            return { ...state, aF_ORIGEN: action.payload };
        case 'SET_MONTO_RECEPCION_MOD':
            return { ...state, aF_MONTOFACTURA: action.payload };
        case 'SET_FECHA_FACTURA_MOD':
            return { ...state, aF_FECHAFAC: action.payload };
        case 'SET_RUT_PROVEEDOR_MOD':
            return { ...state, proV_RUN: action.payload };
        case 'SET_SERVICIO_MOD':
            return { ...state, idprograma: action.payload };
        case 'SET_DEPENDENCIA_MOD':
            return { ...state, deP_CORR: action.payload };
        case 'SET_MODALIDAD_COMPRA_MOD':
            return { ...state, idmodalidadcompra: action.payload };
        case 'SET_ESPECIE_MOD':
            return { ...state, especie: action.payload };
        case 'SET_CUENTA_MOD':
            return { ...state, ctA_COD: action.payload };
        //--------------------TABLA-----------------//
        case 'SET_VIDAUTIL_MOD':
            return { ...state, aF_VIDAUTIL: action.payload };
        case 'SET_FINGRESO_MOD':
            return { ...state, aF_FINGRESO: action.payload };
        case 'SET_MARCA_MOD':
            return { ...state, deT_MARCA: action.payload };
        case 'SET__MODELO_MOD':
            return { ...state, deT_MODELO: action.payload };
        case 'SET_SERIE_MOD':
            return { ...state, deT_SERIE: action.payload };
        case 'SET_PRECIO_MOD':
            return { ...state, deT_PRECIO: action.payload };
        case 'SET_OBS_MOD':
            return { ...state, deT_OBS: action.payload };

        case OBTENER_INVENTARIO_REQUEST:
            return {
                ...state,
                loading: true,
                error: null
            };
        case OBTENER_INVENTARIO_SUCCESS:
            return {
                ...state,
                loading: false,
                aF_CODIGO_GENERICO: action.payload.aF_CODIGO_GENERICO,
                aF_FECHA_SOLICITUD: action.payload.aF_FECHA_SOLICITUD,
                aF_OCO_NUMERO_REF: action.payload.aF_OCO_NUMERO_REF,
                aF_NUM_FAC: action.payload.aF_NUM_FAC,
                aF_ORIGEN: action.payload.aF_ORIGEN,
                aF_MONTOFACTURA: action.payload.aF_MONTOFACTURA,
                aF_FECHAFAC: action.payload.aF_FECHAFAC,
                proV_RUN: action.payload.proV_RUN,
                idprograma: action.payload.idprograma,//servicio
                deP_CORR: action.payload.deP_CORR, //dependencia                     
                idmodalidadcompra: action.payload.idmodalidadcompra,
                especie: action.payload.especie,
                ctA_COD: action.payload.ctA_COD,
                aF_VIDAUTIL: action.payload.aF_VIDAUTIL,
                aF_FINGRESO: action.payload.aF_FINGRESO,
                deT_MARCA: action.payload.deT_MARCA,
                deT_MODELO: action.payload.deT_MODELO,
                deT_SERIE: action.payload.deT_SERIE,
                deT_PRECIO: action.payload.deT_PRECIO,
                deT_OBS: action.payload.deT_OBS
            };
        case OBTENER_INVENTARIO_FAIL:
            return {
                ...state,
                loading: false,
                error: action.error || 'Error desconocido', // Mejor manejo de errores
            };
        default:
            return state;
    }
};



export default obtenerInventarioReducers;
