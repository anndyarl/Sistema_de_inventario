import { combineReducers } from "redux";

//--------------------- Autenticación ---------------------//
import loginReducer from "./auth/auth";

//--------------------- Registro de Inventario ---------------------//
// Formulario 1
import obtenerRecepcionReducers from "./Inventario/RegistrarInventario/obtenerRecepcionReducers";
import origenPresupuestoReducer from "./Inventario/Combos/comboOrigenReducers"; // Cambiar nombre a combo
import modalidadCompraReducer from "./Inventario/Combos/comboModalidadReducers"; // Cambiar nombre a combo
import comboProveedorReducers from "./Inventario/Combos/comboProveedorReducers";

// Formulario 2
import datosCuentaReducers from "./Inventario/RegistrarInventario/datosCuentaReducers";
import comboServicioReducer from "./Inventario/Combos/comboServicioReducers";
import comboCuentaReducer from "./Inventario/Combos/comboCuentaReducers";
import comboDependenciaReducer from "./Inventario/Combos/comboDependenciaReducers";
import comboListadoDeEspeciesBien from "./Inventario/Combos/comboListadoDeEspeciesBienReducers";
import detallesReducer from "./Inventario/Combos/comboDetallesReducers";

// Formulario 3
import datosActivoFijoReducers from "./Inventario/RegistrarInventario/datosActivoFijoReducers";

//--------------------- Modificar Inventario ---------------------//
import datosInventarioReducers from "./Inventario/ModificarInventario/datosInventarioReducer";

//--------------------- Anular Inventario ---------------------//
import datosListaInventarioReducers from "./Inventario/AnularInventario/datosListaInventarioReducers";

//--------------------- Registrar Altas ---------------------//
import datosListaAltasReducers from "./Altas/AnularAltas/datosListaAltasReducers";
import obtenerEtiquetasAltasReducers from "./Altas/ImprimirEtiquetas/obtenerEtiquetasAltasReducers";

//--------------------- Registrar Bajas ---------------------//
import datosListaBajasReducers from "./Bajas/datosListaBajasReducers";

//--------------------- Bienes de Funcionarios ---------------------//
import datosBienesFuncionarioReducers from "./Inventario/BienesFuncionario/datosBienesFuncionarioReducers";

//--------------------- Indicadores ---------------------//
import indicadoresReducers from "./Otros/indicadoresReducers";

//--------------------- Modo Oscuro ---------------------//
import darkModeReducer from "./Otros/darkModeReducer";
import comboTrasladoServicioReducer from "./Traslados/Combos/comboTrasladoServicioReducers";
import comboEstablecimientoReducer from "./Traslados/Combos/comboEstablecimientoReducer";
import comboTrasladoEspecieReducer from "./Traslados/Combos/comboTrasladoEspecieReducers";
import comboDepartamentoReducer from "./Traslados/Combos/comboDepartamentoReducer";

//--------------------- Combinación de Reducers ---------------------//
const appReducer = combineReducers({
  // Autenticación
  loginReducer,

  // Inventario
  // Formulario 1
  obtenerRecepcionReducers,
  origenPresupuestoReducer, // Cambiar nombre a combo
  modalidadCompraReducer, // Cambiar nombre a combo
  comboProveedorReducers,

  // Formulario 2
  datosCuentaReducers,
  comboServicioReducer,
  comboCuentaReducer,
  comboDependenciaReducer,
  comboListadoDeEspeciesBien,
  detallesReducer,

  // Formulario 3
  datosActivoFijoReducers,

  // Modificar Inventario
  datosInventarioReducers,

  // Anular Inventario
  datosListaInventarioReducers,

  // Altas
  datosListaAltasReducers,
  obtenerEtiquetasAltasReducers,

  // Bajas
  datosListaBajasReducers,

  // Bienes de Funcionarios
  datosBienesFuncionarioReducers,

  // Traslado
  comboEstablecimientoReducer,
  comboTrasladoServicioReducer,
  comboTrasladoEspecieReducer,
  comboDepartamentoReducer,

  // Indicadores
  indicadoresReducers,

  // Modo Oscuro
  darkModeReducer,
});

//--------------------- Root Reducer ---------------------//
const rootReducer = (state: any, action: any) => {
  if (action.type === "LOGOUT") {
    // Reinicia el estado a su valor inicial
    state = undefined;
  }
  return appReducer(state, action);
};

//--------------------- Exportación ---------------------//
export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
