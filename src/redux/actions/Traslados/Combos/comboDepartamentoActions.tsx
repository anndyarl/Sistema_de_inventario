import axios from "axios";
import { DEPARTAMENTO_REQUEST, DEPARTAMENTO_SUCCESS, DEPARTAMENTO_FAIL } from "../types";
import { Dispatch } from "redux";

// Acción para obtener servicio
export const comboDepartamentoActions = () => async (dispatch: Dispatch, getState: any) => {
  const token = getState().loginReducer.token; //token está en el estado de autenticación
  if (token) {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    };

    dispatch({ type: DEPARTAMENTO_REQUEST });

    try {
      const res = await axios.get(`${import.meta.env.VITE_CSRF_API_URL}/comboTraEstablecimientos`, config);// Cambiar por Departamento

      if (res.status === 200) {
        dispatch({
          type: DEPARTAMENTO_SUCCESS,
          payload: res.data,
        });
      } else {
        dispatch({ type: DEPARTAMENTO_FAIL });
      }
    } catch (err) {
      console.error("Error en la solicitud:", err);
      dispatch({ type: DEPARTAMENTO_FAIL });
    }
  } else {
    dispatch({ type: DEPARTAMENTO_FAIL });
  }
};
