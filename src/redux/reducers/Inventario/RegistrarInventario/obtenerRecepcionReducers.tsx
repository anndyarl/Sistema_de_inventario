
import {
    RECEPCION_REQUEST,
    RECEPCION_SUCCESS,
    RECEPCION_FAIL,
} from '../../../actions/Inventario/types';


// Define el tipo para el estado inicial
interface obtenerRecepcionState {
    loading: boolean;
    error: string | null;
    recepciones: Array<{
        numeroRecepcion: string,
        numeroOrdenCompra: string,
        numeroFactura: string,
        montoRecepcion: number,
        rutProveedor: string,
        fechaRecepcion: string,
        horaRecepcion: string,
        origen: string,
        fechaFactura: string,
        nombreProveedor: string,

    }>;
    nRecepcion: number;
    fechaRecepcion: string;
    nOrdenCompra: number;
    nFactura: string;
    origenPresupuesto: number;
    montoRecepcion: number;
    fechaFactura: string;
    rutProveedor: string;
    nombreProveedor: string;
    modalidadDeCompra: number;
}

// Estado inicial tipado
const initialState: obtenerRecepcionState = {
    loading: false,
    error: null,
    recepciones: [],
    nRecepcion: 0,
    fechaRecepcion: '',
    nOrdenCompra: 0,
    nFactura: '',
    origenPresupuesto: 0,
    montoRecepcion: 0,
    fechaFactura: '',
    rutProveedor: '',
    nombreProveedor: '',
    modalidadDeCompra: 0
};


// Reducer con tipos definidos
const obtenerRecepcionReducers = (state = initialState, action: any): obtenerRecepcionState => {
    switch (action.type) {
        case 'SET_N_RECEPCION':
            return { ...state, nRecepcion: action.payload };
        case 'SET_FECHA_RECEPCION':
            return { ...state, fechaRecepcion: action.payload };
        case 'SET_N_ORDEN_COMPRA':
            return { ...state, nOrdenCompra: action.payload };
        case 'SET_N_FACTURA':
            return { ...state, nFactura: action.payload };
        case 'SET_ORIGEN_PRESUPUESTO':
            return { ...state, origenPresupuesto: action.payload };
        case 'SET_MONTO_RECEPCION':
            return { ...state, montoRecepcion: action.payload };
        case 'SET_FECHA_FACTURA':
            return { ...state, fechaFactura: action.payload };
        case 'SET_RUT_PROVEEDOR':
            return { ...state, rutProveedor: action.payload };
        case 'SET_NOMBRE_PROVEEDOR':
            return { ...state, nombreProveedor: action.payload };
        case 'SET_MODALIDAD_COMPRA':
            return { ...state, modalidadDeCompra: action.payload };

        case RECEPCION_REQUEST:
            return {
                ...state,
                loading: true,
                error: null
            };
        case RECEPCION_SUCCESS:
            return {
                ...state,
                loading: false,
                nRecepcion: action.payload.numeroRecepcion,
                fechaRecepcion: action.payload.fechaRecepcion,
                nOrdenCompra: action.payload.numeroOrdenCompra,
                nFactura: action.payload.numeroFactura,
                origenPresupuesto: action.payload.origen,
                montoRecepcion: action.payload.montoRecepcion,
                fechaFactura: action.payload.fechaFactura,
                rutProveedor: action.payload.rutProveedor,
                nombreProveedor: action.payload.nombreProveedor,
                modalidadDeCompra: action.payload.modalidadDeCompra
            };
        case RECEPCION_FAIL:
            return {
                ...state,
                loading: false,
                error: action.error || 'Error desconocido', // Mejor manejo de errores
            };
        default:
            return state;
    }
};



export default obtenerRecepcionReducers;
