import {SET_N_RECEPCION} from '../types';

export const setNRecepcion = (nRecepcion: string) => ({
  type: SET_N_RECEPCION,
  payload: nRecepcion,
});