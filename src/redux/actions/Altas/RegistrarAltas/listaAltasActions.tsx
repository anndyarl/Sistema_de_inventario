import { Dispatch } from "redux";
import axiosInstance from "../../../../services/axiosConfig";
import {
  OBTENER_ALTAS_REQUEST,
  OBTENER_ALTAS_SUCCESS,
  OBTENER_ALTAS_FAIL,
} from "../types";

export const listaAltasActions = (fDesde: string, fHasta: string, af_codigo_generico: string, altas_corr: number, establ_corr: number) => async (dispatch: Dispatch, getState: any): Promise<boolean> => {

  //Ver token antes de la petición / sólo para desarrollo
  // const token = getState().loginReducer?.token;
  // console.log("INICIANDO PETICIÓN - Hora:", new Date().toLocaleTimeString());
  // console.log("Token actual:", token ? token.substring(0, 30) + "..." : "No hay token");
  const token = getState().loginReducer.token;
  // Ver cuándo expira el token
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log("Token expira:", new Date(payload.exp * 1000).toLocaleTimeString());
    } catch (e) { }
  }

  dispatch({ type: OBTENER_ALTAS_REQUEST });

  try {
    const res = await axiosInstance.get(`${import.meta.env.VITE_CSRF_API_URL}/TraeAFAltas?fDesde=${fDesde}&fHasta=${fHasta}&af_codigo_generico=${af_codigo_generico}&altas_corr${altas_corr}&establ_corr=${establ_corr}`);
    dispatch({
      type: OBTENER_ALTAS_SUCCESS,
      payload: res.data,
    });
    return true;

  } catch (err: any) {
    dispatch({
      type: OBTENER_ALTAS_FAIL,
      error: err.response?.data?.mensaje || "Error en la solicitud",
    });
    return false;
  }
};