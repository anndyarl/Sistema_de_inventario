import axios from "axios";
import {
  LISTADO_ESPECIES_BIEN_REQUEST,
  LISTADO_ESPECIES_BIEN_SUCCESS,
  LISTADO_ESPECIES_BIEN_FAIL,
} from "../types";
import { Dispatch } from "redux";

// Acción para obtener servicio
export const listadoDeEspeciesBienActions = (EST: number, IDBIEN: number, esP_CODIGO: string) => async (dispatch: Dispatch, getState: any): Promise<boolean> => {
  const token = getState().loginReducer.token; //token está en el estado de autenticación
  if (token) {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    };

    dispatch({ type: LISTADO_ESPECIES_BIEN_REQUEST });

    try {
      const res = await axios.get(`${import.meta.env.VITE_CSRF_API_URL}/comboListadoDeEspeciesBienPar?EST=${EST}&IDBIEN=${IDBIEN}&esP_CODIGO=${esP_CODIGO}`, config);

      if (res.status === 200) {
        if (res.data?.length) {
          dispatch({
            type: LISTADO_ESPECIES_BIEN_SUCCESS,
            payload: res.data,
          });
          return true;
        }
        else {
          dispatch({ type: LISTADO_ESPECIES_BIEN_FAIL });
          return false;
        }
      } else {
        dispatch({
          type: LISTADO_ESPECIES_BIEN_FAIL,
          error:
            "No se pudo obtener el listado de especies. Por favor, intente nuevamente.",
        });
        return false;
      }
    } catch (err) {
      // console.error("Error en la solicitud:", err);
      dispatch({ type: LISTADO_ESPECIES_BIEN_FAIL });
      return false;
    }
  } else {
    dispatch({ type: LISTADO_ESPECIES_BIEN_FAIL });
    return false;
  }
};
