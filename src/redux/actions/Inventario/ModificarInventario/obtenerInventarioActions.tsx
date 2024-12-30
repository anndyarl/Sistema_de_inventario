import { Dispatch } from "redux";
import axios from "axios";
import {
  OBTENER_INVENTARIO_REQUEST,
  OBTENER_INVENTARIO_SUCCESS,
  OBTENER_INVENTARIO_FAIL
} from "../types";

// Acción para obtener la recepción por af_clave
export const obtenerInventarioActions =
  (nInventario: string) =>
    async (dispatch: Dispatch, getState: any): Promise<boolean> => {
      const token = getState().loginReducer.token;

      if (token) {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        };

        dispatch({ type: OBTENER_INVENTARIO_REQUEST });

        try {
          const res = await axios.get(`/api_inv/api/inventario/TraeInvxID?AF_CLAVE=${nInventario}`, config);

          if (res.status === 200) {
            const isEmpty = res.data && Object.values(res.data).every((value) => value === 0 || value === null || value === undefined);
            if (!isEmpty) {
              dispatch({
                type: OBTENER_INVENTARIO_SUCCESS,
                payload: res.data,
              });
              return true;
            } else {
              return false;
            }
          } else {
            dispatch({
              type: OBTENER_INVENTARIO_FAIL,
              error:
                "No se pudo obtener el inventario. Por favor, intente nuevamente.",
            });
            return false;
          }
        } catch (err) {
          // console.error("Error en la solicitud:", err);
          dispatch({
            type: OBTENER_INVENTARIO_FAIL,
            error: "Error en la solicitud. Por favor, intente nuevamente.",
          });
          return false;
        }
      } else {
        dispatch({
          type: OBTENER_INVENTARIO_FAIL,
          error: "No se encontró un token de autenticación válido.",
        });
        return false;
      }
    };
