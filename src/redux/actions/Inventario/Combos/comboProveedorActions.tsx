import {
  COMBO_PROVEEDORES_REQUEST,
  COMBO_PROVEEDORES_SUCCESS,
  COMBO_PROVEEDORES_FAIL
} from "../types";
import { Dispatch } from "redux";
import axiosInstance from "../../../../services/axiosConfig";

export const comboProveedorActions = () => async (dispatch: Dispatch): Promise<boolean> => {

  dispatch({ type: COMBO_PROVEEDORES_REQUEST });

  try {
    const res = await axiosInstance.get(`${import.meta.env.VITE_CSRF_API_URL}/comboTraeListaProveedores`);

    if (res.status === 200) {
      dispatch({
        type: COMBO_PROVEEDORES_SUCCESS,
        payload: res.data,
      });
      return true;
    } else {
      dispatch({ type: COMBO_PROVEEDORES_FAIL });
      return false;
    }
  } catch (err) {
    console.error("Error en la solicitud:", err);
    dispatch({ type: COMBO_PROVEEDORES_FAIL });
    return false;
  }
};
