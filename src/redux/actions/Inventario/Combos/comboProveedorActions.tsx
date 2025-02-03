import axios from "axios";
import {
  PROVEEDORES_REQUEST,
  PROVEEDORES_SUCCESS,
  PROVEEDORES_FAIL
} from "../types";
import { Dispatch } from "redux";

// Acción para obtener servicio
export const comboProveedorActions = () => async (dispatch: Dispatch, getState: any) => {
  const token = getState().loginReducer.token; //token está en el estado de autenticación
  if (token) {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    };

    dispatch({ type: PROVEEDORES_REQUEST });

    try {
      const res = await axios.get(`${import.meta.env.VITE_CSRF_API_URL}/comboTraeListaProveedores`, config);

      if (res.status === 200) {
        dispatch({
          type: PROVEEDORES_SUCCESS,
          payload: res.data,
        });
      } else {
        dispatch({ type: PROVEEDORES_FAIL });
      }
    } catch (err) {
      console.error("Error en la solicitud:", err);
      dispatch({ type: PROVEEDORES_FAIL });
    }
  } else {
    dispatch({ type: PROVEEDORES_FAIL });
  }
};
