import { combineReducers } from "redux";

//--------------------- Autenticación ---------------------//
import loginReducer from "./auth/auth";
import validaApiLoginReducers from "./auth/validaApiLoginReducers";

//--------------------- Registro de Inventario ---------------------//
// Formulario 1
import obtenerRecepcionReducers from "./Inventario/RegistrarInventario/obtenerRecepcionReducers";
import comboOrigenPresupuestoReducer from "./Inventario/Combos/comboOrigenReducers";
import comboModalidadCompraReducer from "./Inventario/Combos/comboModalidadReducers";
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
// import datosInventarioReducers from "./Inventario/ModificarInventario/datosInventarioReducer";
import obtenerInventarioReducers from "./Inventario/ModificarInventario/obtenerInventarioReducers";
//--------------------- Anular Inventario ---------------------//
import datosListaInventarioReducers from "./Inventario/AnularInventario/datosListaInventarioReducers";

//--------------------- Registrar Altas ---------------------//
import datosListaAltasReducers from "./Altas/AnularAltas/datosListaAltasReducers";
import obtenerEtiquetasAltasReducers from "./Altas/ImprimirEtiquetas/obtenerEtiquetasAltasReducers";

//--------------------- Registrar Bajas ---------------------//
import datosListadoGeneralBajasReducers from "./Bajas/datosListadoGeneralBajasReducers";
import datosListaBajasReducers from "./Bajas/datosListaBajasReducers";
import obtenerListaRematesReducers from "./Bajas/datosListaRematesReducers";
import obtenerListaExcluidosReducers from "./Bajas/datosListaExcluidosReducers";

//--------------------- Bienes de Funcionarios ---------------------//
import datosBienesFuncionarioReducers from "./Inventario/BienesFuncionario/datosBienesFuncionarioReducers";

//--------------------- Indicadores ---------------------//
import indicadoresReducers from "./Otros/indicadoresReducers";

//--------------------- Modo Oscuro ---------------------//
import darkModeReducer from "./Otros/darkModeReducer";

//--------------------- Traslados ---------------------//
import comboTrasladoServicioReducer from "./Traslados/Combos/comboTrasladoServicioReducers";
import comboEstablecimientoReducer from "./Traslados/Combos/comboEstablecimientoReducer";
import comboTrasladoEspecieReducer from "./Traslados/Combos/comboTrasladoEspecieReducers";
import comboDepartamentoReducer from "./Traslados/Combos/comboDepartamentoReducer";

//--------------------- Otros ---------------------//
import respuestaReducer from "./Otros/respuestaReducer";

//--------------------- Mantenedores ---------------------//
import listadoMantenedorDependenciasReducers from "./Mantenedores/listadoMantenedorDependenciasReducers";
import listadoMantenedorServiciosReducers from "./Mantenedores/listadoMantenedorServiciosReducers";



//--------------------- Combinación de Reducers ---------------------//
const appReducer = combineReducers({
  // Autenticación
  loginReducer,
  validaApiLoginReducers,

  // Registro de Inventario
  // Formulario 1
  obtenerRecepcionReducers,
  comboOrigenPresupuestoReducer,
  comboModalidadCompraReducer,
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
  obtenerInventarioReducers,

  // Anular Inventario
  datosListaInventarioReducers,

  // Altas
  datosListaAltasReducers,
  obtenerEtiquetasAltasReducers,

  // Bajas
  datosListadoGeneralBajasReducers,
  datosListaBajasReducers,
  obtenerListaRematesReducers,
  obtenerListaExcluidosReducers,

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

  //Pregunta/Respuesta IA
  respuestaReducer,


  //Mantenedores
  listadoMantenedorDependenciasReducers,
  listadoMantenedorServiciosReducers
});

//--------------------- Root Reducer ---------------------//
const rootReducer = (state: any, action: any) => {
  if (action.type === "LOGOUT") {
    // Guarda el estado actual de darkModeReducer
    const { darkModeReducer } = state || {};
    // Reinicia el estado general a su valor inicial, preservando darkModeReducer
    state = {
      darkModeReducer, // Mantiene el estado de darkModeReducer     
    };
  }
  if (action.type === "LIMPIAR_DATA") {
    //Se limpian todo los datos menos los listados aquí
    const {
      loginReducer,
      validaApiLoginReducers,
      comboOrigenPresupuestoReducer,
      comboModalidadCompraReducer,
      comboProveedorReducers,
      comboServicioReducer,
      comboCuentaReducer,
      comboDependenciaReducer,
      comboListadoDeEspeciesBien,
      detallesReducer,
      comboEstablecimientoReducer,
      comboTrasladoServicioReducer,
      comboTrasladoEspecieReducer,
      comboDepartamentoReducer,
      indicadoresReducers,
      darkModeReducer,
    } = state || {};

    state = {
      loginReducer,
      validaApiLoginReducers,
      comboOrigenPresupuestoReducer,
      comboModalidadCompraReducer,
      comboProveedorReducers,
      comboServicioReducer,
      comboCuentaReducer,
      comboDependenciaReducer,
      comboListadoDeEspeciesBien,
      detallesReducer,
      comboEstablecimientoReducer,
      comboTrasladoServicioReducer,
      comboTrasladoEspecieReducer,
      comboDepartamentoReducer,
      indicadoresReducers,
      darkModeReducer,
    };
  }
  return appReducer(state, action);
};

//--------------------- Exportación ---------------------//
export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
