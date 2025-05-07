import axios from "axios";
import { TRASLADO_ESPECIE_REQUEST, TRASLADO_ESPECIE_SUCCESS, TRASLADO_ESPECIE_FAIL } from "../types";
import { Dispatch } from "redux";

// Acción para obtener servicio
export const comboTrasladoEspecieActions = (establ_corr: number) => async (dispatch: Dispatch, getState: any) => {
  const token = getState().loginReducer.token; //token está en el estado de autenticación
  if (token) {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    };

    dispatch({ type: TRASLADO_ESPECIE_REQUEST });

    try {
      const res = await axios.get(`${import.meta.env.VITE_CSRF_API_URL}/comboTraeTrasladoEspecie?establ_corr=${establ_corr}`, config);

      if (res.status === 200) {
        dispatch({
          type: TRASLADO_ESPECIE_SUCCESS,
          payload: res.data,
        });
      } else {
        dispatch({ type: TRASLADO_ESPECIE_FAIL });
      }
    } catch (err) {
      console.error("Error en la solicitud:", err);
      dispatch({ type: TRASLADO_ESPECIE_FAIL });
    }
  } else {
    dispatch({ type: TRASLADO_ESPECIE_FAIL });
  }
};
