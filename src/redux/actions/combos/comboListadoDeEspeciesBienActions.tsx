import axios from "axios";
import {
  LISTADO_ESPECIES_BIEN_REQUEST,
  LISTADO_ESPECIES_BIEN_SUCCESS,
  LISTADO_ESPECIES_BIEN_FAIL,
} from "../types";
import { Dispatch } from "redux";

// Acción para obtener servicio
export const comboListadoDeEspeciesBienActions =
  (EST: number, IDBIEN: string) =>
  async (dispatch: Dispatch, getState: any) => {
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
        const res = await axios.get(
          `/api_inv/api/inventario/comboListadoDeEspeciesBienPar?EST=${EST}&IDBIEN=${IDBIEN}`,
          config
        );

        if (res.status === 200) {
          dispatch({
            type: LISTADO_ESPECIES_BIEN_SUCCESS,
            payload: res.data,
          });
        } else {
          dispatch({ type: LISTADO_ESPECIES_BIEN_FAIL });
        }
      } catch (err) {
        console.error("Error en la solicitud:", err);
        dispatch({ type: LISTADO_ESPECIES_BIEN_FAIL });
      }
    } else {
      dispatch({ type: LISTADO_ESPECIES_BIEN_FAIL });
    }
  };
