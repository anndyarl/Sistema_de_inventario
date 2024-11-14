// reducers/origenPresupuestoReducer.tsx
import {
  RECEPCION_REQUEST,
  RECEPCION_SUCCESS,
  RECEPCION_FAIL,

} from '../../../actions/Inventario/types';

interface nRecepcionState {
  loading: boolean;
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
  error: string | null;
}

const initialState: nRecepcionState = {
  loading: false,
  recepciones: [],
  error: null,
};

const nRecepcionReducer = (state = initialState, action: any): nRecepcionState => {
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
        recepciones: action.payload
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

export default nRecepcionReducer;
