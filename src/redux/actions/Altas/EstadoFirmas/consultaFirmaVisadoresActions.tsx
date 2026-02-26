import { Dispatch } from "redux";
import { ListaEstadoVisadores } from "../../../../components/Altas/EstadoFirmas/EstadoFirmas ";
import axiosInstance from "../../../../services/axiosConfig";

export const consultaFirmaVisadoresActions = (idocumento: number) => async (dispatch: Dispatch): Promise<Array<ListaEstadoVisadores> | null> => {

  try {
    const res = await axiosInstance.get(`${import.meta.env.VITE_CSRF_API_URL}/TraeEstadoVisadores?idocumento=${idocumento}`);
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
};
