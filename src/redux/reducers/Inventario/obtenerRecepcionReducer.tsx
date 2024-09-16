import {
    RECEPCION_REQUEST,
    RECEPCION_SUCCESS,
    RECEPCION_FAIL,
  
  } from '../../actions/types';
  
  interface obtenerRecepcionState {
    loading: boolean;
    recepciones: Array<{
      numeroRecepcion: string,
      numeroOrdenCompra: string,
      numeroFactura: string,
      montoRecepcion: string,
      rutProveedor: string,
      fechaRecepcion: string,
      horaRecepcion: string,
      origen: string,
      fechaFactura: string,
      nombreProveedor: string,
  
    }>;
    error: string | null;
  }
  
  const initialState: obtenerRecepcionState = {
    loading: false,
    recepciones: [],
    error: null,
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
  
  export default obtenerRecepcionReducer;
  