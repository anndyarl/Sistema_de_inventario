
export const setRutBienesFuncionarioActions = (rutFuncionario: string) => ({
  type: 'SET_RUT_FUNCIONARIO',
  payload: rutFuncionario,
});
export const setServicioBienesFuncionarioActions = (servicio: number) => ({
  type: 'SET_SERVICIO_BIENES_FUNCIONARIO',
  payload: servicio,
});
export const setDependenciaBienesFuncionarioActions = (dependencia: number) => ({
  type: 'SET_DEPENDENCIA_BIENES_FUNCIONARIO',
  payload: dependencia,
});




