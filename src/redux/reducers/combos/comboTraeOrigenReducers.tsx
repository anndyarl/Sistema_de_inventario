// reducers/origenPresupuestoReducer.ts
import {
   ORIGEN_REQUEST,
   ORIGEN_SUCCESS,
   ORIGEN_FAIL,   
   
  } from '../../actions/types';
  
  interface OrigenPresupuestoState {
    loading: boolean;
    origenes: Array<{ codigo: string; descripcion: string }>;
    error: string | null;
  }
  
  const initialState: OrigenPresupuestoState = {
    loading: false,
    origenes: [],
    error: null,
  };
  
  const origenPresupuestoReducer = (state = initialState, action: any): OrigenPresupuestoState => {
    switch (action.type) {
      case ORIGEN_REQUEST:
        return {
          ...state, 
          loading: true,
          error: null 
        };
      case ORIGEN_SUCCESS:
        return { 
          ...state, 
          loading: false,
          origenes: action.payload 
        };
      case ORIGEN_FAIL:
        return { 
          ...state, 
          loading: false,
          error: action.error
         };
      default:
        return state;
    }
  };
  
  export default origenPresupuestoReducer;
  