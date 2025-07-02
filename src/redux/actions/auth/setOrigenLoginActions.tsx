import { ORIGEN_LOGIN } from "./types";

export const setOrigenLoginActions = (origen: number) => ({
  type: ORIGEN_LOGIN,
  payload: origen,
});