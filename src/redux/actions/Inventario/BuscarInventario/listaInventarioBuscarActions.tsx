import { Dispatch } from "redux";
import axios from "axios";
import {
  LISTA_INVENTARIO_BUSCAR_REQUEST,
  LISTA_INVENTARIO_BUSCAR_SUCCESS,
  LISTA_INVENTARIO_BUSCAR_FAIL,
} from "../types";
import { LOGOUT } from "../../auth/types";

export const listaInventarioBuscarActions = (af_codigo_generico: string, FechaInicio: string, FechaTermino: string, deP_CORR: number,
  esP_CODIGO: string, nrecepcion: string, marca: string, modelo: string,
  serie: string, order_compra: string, altaS_CORR: number, estabL_CORR: number) => async (dispatch: Dispatch, getState: any): Promise<boolean> => {
    const token = getState().loginReducer.token; //token está en el estado de autenticación

    if (token) {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      };

      dispatch({ type: LISTA_INVENTARIO_BUSCAR_REQUEST });

      try {
        const res = await axios.get(`${import.meta.env.VITE_CSRF_API_URL}/traeListaInventarioBuscar?af_codigo_generico=${af_codigo_generico}&altaS_CORR=${altaS_CORR}&FechaInicio=${FechaInicio}&FechaTermino=${FechaTermino}&deP_CORR=${deP_CORR}&esP_CODIGO=${esP_CODIGO}&nrecepcion=${nrecepcion}&marca=${marca}&modelo=${modelo}&serie=${serie}&order_compra=${order_compra}&estabL_CORR=${estabL_CORR}`, config
        );

        if (res.status === 200) {
          if (res.data?.length) {
            dispatch({
              type: LISTA_INVENTARIO_BUSCAR_SUCCESS,
              payload: res.data,
            });
            return true;
          } else {
            dispatch({
              type: LISTA_INVENTARIO_BUSCAR_FAIL,
              error: "No se pudo obtener los datos. Por favor, intente nuevamente.",
            });
            return false;
          }
        } else {
          dispatch({
            type: LISTA_INVENTARIO_BUSCAR_FAIL,
            error:
              "No se pudo obtener el listado de altas. Por favor, intente nuevamente.",
          });
          return false;
        }
      } catch (err: any) {
        console.error("Error en la solicitud:", err);
        dispatch({
          type: LISTA_INVENTARIO_BUSCAR_FAIL,
          error: "Error en la solicitud:", err,
        });
        // dispatch({ type: LOGOUT });
        return false;
      }
    } else {
      dispatch({
        type: LISTA_INVENTARIO_BUSCAR_FAIL,
        error: "No se encontró un token de autenticación válido.",
      });
      dispatch({ type: LOGOUT });
      return false;
    }
  };
