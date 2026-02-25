import { ORIGEN_LOGIN } from "./types";
// Determina si el inicio de sesión se realizó desde el ERP o desde el acceso directo (inventario.ssmso.cl).
// Según el origen, redirige al usuario a la sección correspondiente.
export const setOrigenLoginActions = (origen: number) => ({
  type: ORIGEN_LOGIN,
  payload: origen,
});