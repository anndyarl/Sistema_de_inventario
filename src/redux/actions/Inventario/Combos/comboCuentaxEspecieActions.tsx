import axios from "axios";
import { CUENTA_REQUEST, CUENTA_SUCCESS, CUENTA_FAIL } from "../types";
import { Dispatch } from "redux";

// Acción para obtener servicio
export const comboCuentaxEspecieActions = (esp_codigo: string) => async (dispatch: Dispatch, getState: any) => {
  const token = getState().loginReducer.token; //token está en el estado de autenticación
  if (token) {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    };

    dispatch({ type: CUENTA_REQUEST });

    try {
      const res = await axios.get(`${import.meta.env.VITE_CSRF_API_URL}/comboTraeCuentaXEspecie?esp_codigo=${esp_codigo}`, config);

      if (res.status === 200) {
        dispatch({
          type: CUENTA_SUCCESS,
          payload: res.data,
        });
      } else {
        dispatch({ type: CUENTA_FAIL });
      }
    } catch (err) {
      console.error("Error en la solicitud:", err);
      dispatch({ type: CUENTA_FAIL });
    }
  } else {
    dispatch({ type: CUENTA_FAIL });
  }
};
