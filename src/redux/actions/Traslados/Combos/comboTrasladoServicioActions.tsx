import { TRASLADO_SERVICIO_REQUEST, TRASLADO_SERVICIO_SUCCESS, TRASLADO_SERVICIO_FAIL } from "../types";
import { Dispatch } from "redux";
import axiosInstance from "../../../../services/axiosConfig";

export const comboTrasladoServicioActions = (establ_corr: number) => async (dispatch: Dispatch) => {

  dispatch({ type: TRASLADO_SERVICIO_REQUEST });

  try {
    const res = await axiosInstance.get(`${import.meta.env.VITE_CSRF_API_URL}/comboTraeServicio?establ_corr=${establ_corr}`);

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
};
