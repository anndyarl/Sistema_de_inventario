// reducer.ts
import { SET_N_RECEPCION } 
from '../../actions/types';

const initialState = {
  nRecepcion: '',
};

const datos_inventarioReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case SET_N_RECEPCION:
      return { ...state,
         nRecepcion: action.payload
        };
    default:
      return state;
  }
};

export default datos_inventarioReducer;
