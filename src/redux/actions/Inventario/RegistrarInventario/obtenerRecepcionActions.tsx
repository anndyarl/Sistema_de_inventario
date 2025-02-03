import { Dispatch } from "redux";
import axios from "axios";
import { RECEPCION_REQUEST, RECEPCION_SUCCESS, RECEPCION_FAIL } from "../types";

// Acción para obtener la recepción por número
export const obtenerRecepcionActions =
  (nRecepcion: number) =>
    async (dispatch: Dispatch, getState: any): Promise<Boolean> => {
      const token = getState().loginReducer.token; //token está en el estado de autenticación

      if (token) {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        };

        dispatch({ type: RECEPCION_REQUEST });

        try {
          const res = await axios.get(`${import.meta.env.VITE_CSRF_API_URL}/comboTraeRecepcion?numero=${nRecepcion}`, config);

          if (res.status === 200) {
            const isEmpty = res.data && Object.values(res.data).every((value) => value == 0 || value == null || value == undefined);
            if (!isEmpty) {
              dispatch({
                type: RECEPCION_SUCCESS,
                payload: res.data,
              });
              return true;
            } else {
              return false;
            }
          } else {
            dispatch({
              type: RECEPCION_FAIL,
              error:
                "No se pudo obtener la recepción. Por favor, intente nuevamente.",
            });
            return false;
          }
        } catch (err) {
          console.error("Error en la solicitud:", err);
          dispatch({
            type: RECEPCION_FAIL,
            error: "Error en la solicitud. Por favor, intente nuevamente.",
          });
          return false;
        }
      } else {
        dispatch({
          type: RECEPCION_FAIL,
          error: "No se encontró un token de autenticación válido.",
        });
        return false;
      }
    };
