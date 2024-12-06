import { Dispatch } from "redux";
import axios from "axios";
import {
  LISTA_INDICADORES_REQUEST,
  LISTA_UTM_SUCCESS,
  LISTA_UF_SUCCESS,
  LISTA_DOLAR_SUCCESS,
  LISTA_BITCOIN_SUCCESS,
  LISTA_INDICADORES_FAIL,
} from "./types";

export const indicadoresActions = () => async (dispatch: Dispatch): Promise<boolean> => {
  dispatch({ type: LISTA_INDICADORES_REQUEST });
  try {
    const res = await axios.get(`https://mindicador.cl/api`);

    const utm = res.data.utm;
    const uf = res.data.uf;
    const dolar = res.data.dolar;
    const bitcoin = res.data.bitcoin;


    console.log("Respuesta del servidor miidicador:", res.data);
    if (res.status === 200) {
      dispatch({
        type: LISTA_UTM_SUCCESS,
        payload: utm,
      });
      dispatch({
        type: LISTA_UF_SUCCESS,
        payload: uf,
      });
      dispatch({
        type: LISTA_DOLAR_SUCCESS,
        payload: dolar,
      });
      dispatch({
        type: LISTA_BITCOIN_SUCCESS,
        payload: bitcoin,
      });
      return true;
    } else {
      dispatch({
        type: LISTA_INDICADORES_FAIL,
        error:
          "No se pudo obtener el listado del inventario. Por favor, intente nuevamente.",
      });
      return false;
    }
  } catch (err) {
    console.error("Error en la solicitud:", err);
    dispatch({
      type: LISTA_INDICADORES_FAIL,
      error: "Error en la solicitud. Por favor, intente nuevamente.",
    });
    return false;
  }
};
