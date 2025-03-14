import axios from 'axios';
import {
  COMBO_SERVICIO_INFORME_REQUEST,
  COMBO_SERVICIO_INFORME_SUCCESS,
  COMBO_SERVICIO_INFORME_FAIL,
} from './types';
import { Dispatch } from 'redux';


// Acción para obtener COMBO_SERVICIO_INFORME
export const comboServicioInformeActions = (establ_corr: number) => async (dispatch: Dispatch, getState: any) => {
  const token = getState().loginReducer.token; //token está en el estado de autenticación
  if (token) {
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      },
    };

    dispatch({ type: COMBO_SERVICIO_INFORME_REQUEST });

    try {
      const res = await axios.get(`${import.meta.env.VITE_CSRF_API_URL}/comboTraeServicio?establ_corr=${establ_corr}`, config);

      if (res.status === 200) {
        dispatch({
          type: COMBO_SERVICIO_INFORME_SUCCESS,
          payload: res.data
        });
      } else {
        dispatch({ type: COMBO_SERVICIO_INFORME_FAIL });
      }
    } catch (err) {
      console.error("Error en la solicitud:", err);
      dispatch({ type: COMBO_SERVICIO_INFORME_FAIL });
    }
  } else {
    dispatch({ type: COMBO_SERVICIO_INFORME_FAIL });
  }
};
