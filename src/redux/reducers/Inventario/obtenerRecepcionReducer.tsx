import {
  RECEPCION_REQUEST,
  RECEPCION_SUCCESS,
  RECEPCION_FAIL,

} from '../../actions/types';

interface obtenerRecepcionState {
  loading: boolean;
  error: string | null;
  nRecepcion: string;
  fechaRecepcion: string;
  nOrdenCompra: string;
  nFactura: string;
  origenPresupuesto: number;
  montoRecepcion: string;
  fechaFactura: string;
  rutProveedor: string;
  nombreProveedor: string;
  modalidadDeCompra: string;
}

const initialState: obtenerRecepcionState = {
  loading: false,
  error: null,
  nRecepcion: '',
  fechaRecepcion: '',
  nOrdenCompra: '',
  nFactura: '',
  origenPresupuesto: 0,
  montoRecepcion: '',
  fechaFactura: '',
  rutProveedor: '',
  nombreProveedor: '',
  modalidadDeCompra: '',

};

const obtenerRecepcionReducer = (state = initialState, action: any): obtenerRecepcionState => {
  switch (action.type) {
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
        modalidadDeCompra: action.payload.modalidadDeCompra,
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

export default obtenerRecepcionReducer;
