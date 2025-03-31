import { MOSTRAR_N_PAGINACION } from "./types";

export const setMostrarNPaginacionActions = (paginacion: number) => ({
    type: MOSTRAR_N_PAGINACION,
    payload: paginacion,
});

