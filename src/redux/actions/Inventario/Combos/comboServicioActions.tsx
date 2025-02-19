import axios from 'axios';
import {
  SERVICIO_REQUEST,
  SERVICIO_SUCCESS,
  SERVICIO_FAIL,
} from '../types';
import { Dispatch } from 'redux';


// Acción para obtener servicio
export const comboServicioActions = (establ_corr: number) => async (dispatch: Dispatch, getState: any) => {
  const token = getState().loginReducer.token; //token está en el estado de autenticación
  if (token) {
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      },
    };

    dispatch({ type: SERVICIO_REQUEST });

    try {
      const res = await axios.get(`http://localhost:5076/api/inventario/comboTraeServicio?establ_corr=${establ_corr}`, config);

      if (res.status === 200) {
        dispatch({
          type: SERVICIO_SUCCESS,
          payload: res.data
        });
      } else {
        dispatch({ type: SERVICIO_FAIL });
      }
    } catch (err) {
      console.error("Error en la solicitud:", err);
      dispatch({ type: SERVICIO_FAIL });
    }
  } else {
    dispatch({ type: SERVICIO_FAIL });
  }
};
