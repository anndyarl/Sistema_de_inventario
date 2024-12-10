import axios from "axios";
import { ESTABLECIMIENTO_REQUEST, ESTABLECIMIENTO_SUCCESS, ESTABLECIMIENTO_FAIL } from "../types";
import { Dispatch } from "redux";

// Acción para obtener servicio
export const comboEstablecimientoActions = () => async (dispatch: Dispatch, getState: any) => {
  const token = getState().loginReducer.token; //token está en el estado de autenticación
  if (token) {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    };

    dispatch({ type: ESTABLECIMIENTO_REQUEST });

    try {
      const res = await axios.get("/api_inv/api/inventario/comboTraEstablecimientos", config);

      if (res.status === 200) {
        dispatch({
          type: ESTABLECIMIENTO_SUCCESS,
          payload: res.data,
        });
      } else {
        dispatch({ type: ESTABLECIMIENTO_FAIL });
      }
    } catch (err) {
      console.error("Error en la solicitud:", err);
      dispatch({ type: ESTABLECIMIENTO_FAIL });
    }
  } else {
    dispatch({ type: ESTABLECIMIENTO_FAIL });
  }
};
