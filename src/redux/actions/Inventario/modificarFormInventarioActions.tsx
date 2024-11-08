import { Dispatch } from "redux";
import axios from "axios";
import {
  POST_FORMULARIO_REQUEST,
  POST_FORMULARIO_SUCCESS,
  POST_FORMULARIO_FAIL,
} from "../types";

export const modificarFormInventarioActions =
  (FormulariosCombinados: Record<string, any>) => async (dispatch: Dispatch, getState: any): Promise<boolean> => {
    const token = getState().loginReducer.token; // Token está en el estado de autenticación

    if (token) {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };
      if (
        !FormulariosCombinados ||
        Object.keys(FormulariosCombinados).length === 0
      ) {
        console.error("El objeto datosInventario está vacío.");
        return false;
      }
      const body = JSON.stringify({
        FormulariosCombinados,
      });

      dispatch({ type: POST_FORMULARIO_REQUEST });

      try {
        const response = await axios.post(`/api_inv/api/inventario/actualizaActivoFijo/`, body, config);

        if (response.status === 200) {
          dispatch({
            type: POST_FORMULARIO_SUCCESS,
            payload: response.data,
          });
          return true;
        }
      } catch (error: any) {
        // Manejo detallado del error
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "Error al enviar el formulario";
        dispatch({
          type: POST_FORMULARIO_FAIL,
          payload: errorMessage,
        });
        console.error("Error al enviar el formulario:", errorMessage);
        return false; // Retorna false en caso de error
      }
    } else {
      console.error("Sin token"); // Mensaje en caso de que no haya token
      return false;
    }

    return false; // Retorno por defecto (esto nunca debería ser alcanzado)
  };
