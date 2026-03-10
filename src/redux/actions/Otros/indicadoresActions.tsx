import { Dispatch } from "redux";
import {
  LISTA_INDICADORES_REQUEST,
  LISTA_UTM_SUCCESS,
  LISTA_UF_SUCCESS,
  LISTA_DOLAR_SUCCESS,
  LISTA_BITCOIN_SUCCESS,
  LISTA_IPC_SUCCESS,
  LISTA_INDICADORES_FAIL,
} from "./types";
import axios from "axios";

export const indicadoresActions = () => async (dispatch: Dispatch): Promise<boolean> => {
  dispatch({ type: LISTA_INDICADORES_REQUEST });

  let res;

  try {
    try {
      res = await axios.get("https://mindicador.cl/api", { timeout: 5000 });
      console.log("Datos obtenidos desde mindicador");
    } catch (error) {
      res = await axios.get("https://findic.cl/api", { timeout: 5000 });
      console.log("Datos obtenidos desde findic");
    }

    const utm = res.data.utm;
    const uf = res.data.uf;
    const dolar = res.data.dolar;
    const bitcoin = res.data.bitcoin;
    const ipc = res.data.ipc;

    if (res.status === 200) {
      dispatch({ type: LISTA_UTM_SUCCESS, payload: utm });
      dispatch({ type: LISTA_UF_SUCCESS, payload: uf });
      dispatch({ type: LISTA_DOLAR_SUCCESS, payload: dolar });
      dispatch({ type: LISTA_BITCOIN_SUCCESS, payload: bitcoin });
      dispatch({ type: LISTA_IPC_SUCCESS, payload: ipc });
      return true;
    } else {
      throw new Error("Respuesta no válida");
    }
  } catch (err) {
    dispatch({
      type: LISTA_INDICADORES_FAIL,
      error: "No se pudieron obtener los indicadores desde ninguna fuente.",
    });
    return false;
  }
};