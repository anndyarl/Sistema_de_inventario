import axios from "axios";
import { TRASLADO_SERVICIO_REQUEST, TRASLADO_SERVICIO_SUCCESS, TRASLADO_SERVICIO_FAIL } from "../types";
import { Dispatch } from "redux";

// Acción para obtener servicio
export const comboTrasladoServicioActions = () => async (dispatch: Dispatch, getState: any) => {
  const token = getState().loginReducer.token; //token está en el estado de autenticación
  if (token) {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    };

    dispatch({ type: TRASLADO_SERVICIO_REQUEST });

    try {
      const res = await axios.get("https://sidra.ssmso.cl/api_erp_inv_qa/api/inventario/comboTraeTrasladoServicio", config);

      if (res.status === 200) {
        dispatch({
          type: TRASLADO_SERVICIO_SUCCESS,
          payload: res.data,
        });
      } else {
        dispatch({ type: TRASLADO_SERVICIO_FAIL });
      }
    } catch (err) {
      console.error("Error en la solicitud:", err);
      dispatch({ type: TRASLADO_SERVICIO_FAIL });
    }
  } else {
    dispatch({ type: TRASLADO_SERVICIO_FAIL });
  }
};
