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
import obtenerfirmasAltasReducers from "./Altas/FirmarAltas/obtenerfirmasAltasReducers";
import obtenerUnidadesReducers from "./Altas/FirmarAltas/obtenerUnidadesReducers";

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
import comboEstablecimientosProfileReducers from "./auth/comboEstablecimientosProfileReducers";
import comboDependenciaOrigenReducer from "./Traslados/Combos/comboDependenciaOrigenReducers";
import comboDependenciaDestinoReducer from "./Traslados/Combos/comboDependenciaDestinoReducers";
import listadoTrasladosReducers from "./Traslados/listadoTrasladosReducers";
//--------------------- Otros ---------------------//
import respuestaReducer from "./Otros/respuestaReducer";

//--------------------- Mantenedores ---------------------//
import obtenerMaxServicioReducers from "./Mantenedores/Servicios/obtenerMaxServicioReducers";
import listadoMantenedorDependenciasReducers from "./Mantenedores/Dependencias/listadoMantenedorDependenciasReducers";
import listadoMantenedorServiciosReducers from "./Mantenedores/Servicios/listadoMantenedorServiciosReducers";
import listadoMantenedorProveedoresReducers from "./Mantenedores/Proveedores/listadoMantenedorProveedoresReducers";
import listadoMantenedorEspeciesReducers from "./Mantenedores/Especies/listadoMantenedorEspeciesReducers copy";
import comboCuentaMantenedorReducers from "./Mantenedores/Especies/comboCuentaMantenedorReducers";
import listadoMantenedorComponentesReducers from "./Mantenedores/Componentes/listadoMantenedorComponentesReducers";
import obtenerMaxInventarioReducers from "./Inventario/RegistrarInventario/obtenerMaxInventarioReducers";
import comboServicioInformeReducers from "./Informes/FolioPorServicioDependencia/comboServicioInformeReducers";
import comboCuentasInformeReducers from "./Informes/Listados/comboCuentasInformeReducers";




//--------------------- Combinación de Reducers ---------------------//
const appReducer = combineReducers({
  // Autenticación
  loginReducer,
  validaApiLoginReducers,

  //-------------- Registro de Inventario----------------//
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
  obtenerMaxInventarioReducers,
  //-------------- Fin Registro de Inventario----------------//

  // Modificar Inventario
  obtenerInventarioReducers,

  // Anular Inventario
  datosListaInventarioReducers,

  // Altas
  datosListaAltasReducers,
  obtenerEtiquetasAltasReducers,
  obtenerfirmasAltasReducers,
  obtenerUnidadesReducers,

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
  comboDependenciaOrigenReducer,
  comboDependenciaDestinoReducer,
  listadoTrasladosReducers,

  // Indicadores
  indicadoresReducers,

  // Modo Oscuro
  darkModeReducer,

  //Pregunta/Respuesta IA
  respuestaReducer,

  //Informes
  comboServicioInformeReducers,
  comboCuentasInformeReducers,

  //Mantenedores
  listadoMantenedorDependenciasReducers,
  listadoMantenedorServiciosReducers,
  listadoMantenedorProveedoresReducers,
  listadoMantenedorEspeciesReducers,
  listadoMantenedorComponentesReducers,
  comboEstablecimientosProfileReducers,
  obtenerMaxServicioReducers,
  comboCuentaMantenedorReducers
});

//--------------------- Root Reducer ---------------------//
const rootReducer = (state: any, action: any) => {
  if (action.type === "LOGOUT") {
    // Reinicia el estado general a su valor inicial, soloo mantiene el valor de darkModeReducer(Modo Oscuro)
    const { darkModeReducer } = state || {};
    state = {
      darkModeReducer
    };
  }

  //Esta funcion se encuentra en profile/configuraciones/datos
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
      indicadoresReducers,
      darkModeReducer,
    };
  }
  return appReducer(state, action);
};

//--------------------- Exportación ---------------------//
export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
