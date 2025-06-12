
import {
  REGISTRAR_BIENES_BAJAS_REQUEST,
  REGISTRAR_BIENES_BAJAS_SUCCESS,
  REGISTRAR_BIENES_BAJAS_FAIL
} from '../../actions/Bajas/types';

// Define el tipo para el estado inicial
interface DatosInventarioState {
  listaSalidaBajas: Array<{
    aF_CLAVE: number;
    nresolucion: number;
  }>;

}// Estado inicial tipado
const initialState: DatosInventarioState = {
  listaSalidaBajas: []
};

// Reducer con tipos definidos
const datosBajasRegistradaReducers = (state = initialState, action: any) => {
  switch (action.type) {

    case REGISTRAR_BIENES_BAJAS_REQUEST:
      return { ...state, loading: true };
    case REGISTRAR_BIENES_BAJAS_SUCCESS:
      return {
        ...state,
        loading: false,
        listaSalidaBajas: action.payload,
      };
    case REGISTRAR_BIENES_BAJAS_FAIL:
      return { ...state, loading: false, error: action.error };
    default:
      return state;
  }
};



export default datosBajasRegistradaReducers;
