
import { InventarioProps } from '../../../../components/Inventario/RegistrarInventario/DatosInventario';
import {
    RECEPCION_REQUEST,
    RECEPCION_SUCCESS,
    RECEPCION_FAIL,
} from '../../../actions/Inventario/types';


// Define el tipo para el estado inicial
interface obtenerRecepcionState {
    loading: boolean;
    error: string | null;
    recepciones: InventarioProps[];
    nRecepcion: number;
    fechaRecepcion: string;
    nOrdenCompra: string;
    nFactura: string;
    origenPresupuesto: number;
    montoRecepcion: number;
    fechaFactura: string;

    /*----------Modalidad Compra-----------*/
    modalidadDeCompra: number;
    otraModalidad: string;
    showInput: boolean;
    /*----------Fin Modalidad Compra-----------*/
    /*----------Proveedor-----------*/
    rutProveedor: string;
    otroProveedor: string;
    showInputProveedor: boolean;
    /*----------Fin Proveedor-----------*/
}

// Estado inicial tipado
const initialState: obtenerRecepcionState = {
    loading: false,
    error: null,
    recepciones: [],
    nRecepcion: 0,
    fechaRecepcion: '',
    nOrdenCompra: '',
    nFactura: '',
    origenPresupuesto: 0,
    montoRecepcion: 0,
    fechaFactura: '',
    /*----------Modalidad Compra-----------*/
    modalidadDeCompra: 0,
    otraModalidad: '',
    showInput: false,
    /*----------Fin Modalidad Compra-----------*/
    /*----------Proveedor-----------*/
    rutProveedor: '',
    otroProveedor: '',
    showInputProveedor: false
    /*----------Fin Proveedor-----------*/
};


// Reducer con tipos definidos
const obtenerRecepcionReducers = (state = initialState, action: any): obtenerRecepcionState => {
    switch (action.type) {

        //Guarda el estado de cada tipeo en sus elemento de entradas
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
        /*----------Modalidad Compra-----------*/
        case 'SET_MODALIDAD_COMPRA':
            return { ...state, modalidadDeCompra: action.payload };
        case 'SET_OTRA_MODALIDAD_COMPRA':
            return { ...state, otraModalidad: action.payload };
        case 'SET_MOSTRAR_MODALIDAD_COMPRA':
            return { ...state, showInput: action.payload };
        /*----------Fin Modalidad Compra-----------*/

        /*----------Proveedor-----------*/
        case 'SET_RUT_PROVEEDOR':
            return { ...state, rutProveedor: action.payload };
        case 'SET_OTRO_PROVEEDOR':
            return { ...state, otroProveedor: action.payload };
        case 'SET_MOSTRAR_PROVEEDOR':
            return { ...state, showInputProveedor: action.payload };
        /*----------Fin Proveedor-----------*/

        case RECEPCION_REQUEST:
            return {
                ...state,
                loading: true,
                error: null
            };
        //Trae la busqueda
        case RECEPCION_SUCCESS:
            return {
                ...state,
                loading: false,
                nRecepcion: action.payload.repeticiones[0].nRecepcion,
                fechaRecepcion: action.payload.fechaRecepcion,
                nOrdenCompra: action.payload.numeroOrdenCompra,
                nFactura: action.payload.repeticiones[0].nFactura,
                origenPresupuesto: action.payload.origen,
                montoRecepcion: action.payload.montoRecepcion,
                fechaFactura: action.payload.fechaFactura,
                rutProveedor: action.payload.rutProveedor,
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
