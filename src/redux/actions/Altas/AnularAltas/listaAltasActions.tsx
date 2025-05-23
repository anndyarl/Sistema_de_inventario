import { Dispatch } from "redux";
import axios from "axios";
import {
  LISTA_ALTAS_REQUEST,
  LISTA_ALTAS_SUCCESS,
  LISTA_ALTAS_FAIL,
} from "../types";

export const listaAltasActions = () => async (dispatch: Dispatch, getState: any): Promise<boolean> => {
  const token = getState().loginReducer.token; //token está en el estado de autenticación

  if (token) {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    };

    dispatch({ type: LISTA_ALTAS_REQUEST });

    try {
      const res = await axios.get(`${import.meta.env.VITE_CSRF_API_URL}/TraeAFAltas`, config);
      // console.log("Respuesta del servidor obtener lista altas:", res);

      if (res.status === 200) {
        if (res.data?.length) {
          dispatch({
            type: LISTA_ALTAS_SUCCESS,
            payload: res.data,
          });
          return true;
        } else {
          dispatch({
            type: LISTA_ALTAS_FAIL,
            error:
              "Status 200, pero con arreglo de datos vacío",
          });
          return false;
        }
      } else {
        dispatch({
          type: LISTA_ALTAS_FAIL,
          error:
            "No se pudo obtener el listado del inventario. Por favor, intente nuevamente.",
        });
        return false;
      }
    } catch (err) {
      // console.error("Error en la solicitud:", err);
      dispatch({
        type: LISTA_ALTAS_FAIL,
        error: "Error en la solicitud. Por favor, intente nuevamente.",
      });
      return false;
    }
  } else {
    dispatch({
      type: LISTA_ALTAS_FAIL,
      error: "No se encontró un token de autenticación válido.",
    });
    return false;
  }
};
