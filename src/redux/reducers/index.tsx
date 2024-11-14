import { combineReducers } from "redux";

import loginReducer from "./auth/auth";
//------------Registro inventario------------------//
//Form1
import obtenerRecepcionReducers from "./Inventario/RegistrarInventario/obtenerRecepcionReducers";
import origenPresupuestoReducer from "./Inventario/Combos/comboOrigenReducers";
import modalidadCompraReducer from "./Inventario/Combos/comboModalidadReducers";
import comboProveedorReducers from "./Inventario/Combos/comboProveedorReducers";

//Form 2
import datosCuentaReducers from "./Inventario/RegistrarInventario/datosCuentaReducers";
import comboServicioReducer from "./Inventario/Combos/comboServicioReducers";
import comboCuentaReducer from "./Inventario/Combos/comboCuentaReducers";
import comboDependenciaReducer from "./Inventario/Combos/comboDependenciaReducers";
import detallesReducer from "./Inventario/Combos/comboDetallesReducers";
import comboListadoDeEspeciesBien from "./Inventario/Combos/comboListadoDeEspeciesBienReducers";

//Form 3
import datosActivoFijoReducers from "./Inventario/RegistrarInventario/datosActivoFijoReducers";
//-----------Modificar Inventario --------------//
import datosInventarioReducers from "./Inventario/ModificarInventario/datosInventarioReducer";
//------------Anular Inventario-----------------//
import datosListaInventarioReducers from "./Inventario/AnularInventario/datosListaInventarioReducers";
//------------Registrar Altas----------------//
import datosListaAltasReducers from "./Altas/RegistroAltas/datosListaAltasReducers";



const rootReducer = combineReducers({
  //Autentificación
  loginReducer,
  //------------Registro inventario------------------//
  //Form1
  obtenerRecepcionReducers,
  origenPresupuestoReducer,//cambiar nombre a combo
  modalidadCompraReducer,//cambiar nombre a combo
  comboProveedorReducers,

  //form 2
  datosCuentaReducers,
  comboServicioReducer,
  comboCuentaReducer,
  comboDependenciaReducer,
  comboListadoDeEspeciesBien,
  detallesReducer,

  //form 3
  datosActivoFijoReducers,

  datosInventarioReducers,

  //-----------Anular Inventario --------------//
  datosListaInventarioReducers,

  datosListaAltasReducers
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
