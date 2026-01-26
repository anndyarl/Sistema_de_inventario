import { Dispatch } from "redux";
import axios from "axios";
import { ListaEstadoVisadores } from "../../../../components/Altas/EstadoFirmas/EstadoFirmas ";

// Acción para obtener la recepción por número
export const consultaFirmaVisadoresActions = (idocumento: number) => async (dispatch: Dispatch, getState: any): Promise<Array<ListaEstadoVisadores> | null> => {
  const token = getState().loginReducer.token; //token está en el estado de autenticación

  if (token) {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    };

    try {
      const res = await axios.get(`${import.meta.env.VITE_CSRF_API_URL}/TraeEstadoVisadores?idocumento=${idocumento}`, config);
      if (res.status === 200) {
        if (res.data?.length) {
          dispatch({
            type: null,
            payload: res.data,
          });
          return res.data;
        } else {
          dispatch({
            type: null,
            error:
              "Status 200, pero con arreglo de datos vacío",
          });
          return null;
        }
      } else {
        dispatch({
          type: null,
          error:
            "No se pudo obtener el estado de la firma Por favor, intente nuevamente.",
        });
        return null;
      }
    } catch (err: any) {
      dispatch({
        type: null,
        error: "Error en la solicitud:", err,
      });
      return null;
    }
  } else {
    dispatch({
      type: null,
      error: "No se encontró un token de autenticación válido.",
    });
    return null;
  }
};
