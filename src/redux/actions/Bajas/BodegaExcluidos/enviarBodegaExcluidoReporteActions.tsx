import axiosInstance from "../../../../services/axiosConfig";


export const ENVIAR_REVISION_BAJAS_REQUEST = "ENVIAR_REVISION_BAJAS_REQUEST";
export const ENVIAR_REVISION_BAJAS_SUCCESS = "ENVIAR_REVISION_BAJAS_SUCCESS";
export const ENVIAR_REVISION_BAJAS_FAIL = "ENVIAR_REVISION_BAJAS_FAIL";

export interface RevisionBaja {
    aF_CLAVE: string;
    bajaS_CORR: number;
    aF_CODIGO_GENERICO: string;
    nresolucion: string;
    especie: string;
    ncuenta: string;
    estado: number;
    oficina_destino: string;
    persona_entrega: string | number;
    useR_MOD?: number;
}

export const enviarDistribucionBajasActions =
    (formularioRevision: RevisionBaja[]) =>
        async (dispatch: any, getState: any): Promise<boolean> => {
            try {
                dispatch({ type: ENVIAR_REVISION_BAJAS_REQUEST });

                if (!formularioRevision || formularioRevision.length === 0) {
                    dispatch({
                        type: ENVIAR_REVISION_BAJAS_FAIL,
                        payload: "No hay datos para enviar.",
                    });
                    return false;
                }

                const { token } = getState().loginReducer;

                // 👉 Construcción del body (clave importante)
                const body = {
                    formularioRevision, // ⚠️ esto depende de cómo lo espera tu API
                };

                console.log("URL:", `${import.meta.env.VITE_CSRF_API_URL}/RegistraBodegaExcluidoReporte`);
                console.log("Body enviado:", body);
                console.log("Token de autenticación:", token);

                const res = await axiosInstance.post(
                    `${import.meta.env.VITE_CSRF_API_URL}/RegistraBodegaExcluidoReporte`,
                    body,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                console.log("Respuesta API:", res.data);

                dispatch({
                    type: ENVIAR_REVISION_BAJAS_SUCCESS,
                    payload: res.data,
                });

                return true;
            } catch (error: any) {
                console.error("Error al enviar revisión:", error);

                dispatch({
                    type: ENVIAR_REVISION_BAJAS_FAIL,
                    payload:
                        error.response?.data ||
                        error.message ||
                        "Error al enviar revisión de bajas",
                });

                return false;
            }
        };