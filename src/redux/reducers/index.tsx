import { combineReducers } from "redux";

import loginReducer from "./auth/auth";
//------------Registro inventario------------------//
//Form1
import datosRecepcionReducer from "./Inventario/datosRecepcionReducer";
import origenPresupuestoReducer from "./combos/comboOrigenReducers";
import modalidadCompraReducer from "./combos/comboModalidadReducers";

//Form 2
import comboServicioReducer from "./combos/comboServicioReducers";
import comboCuentaReducer from "./combos/comboCuentaReducers";
import comboDependenciaReducer from "./combos/comboDependenciaReducers";
import detallesReducer from "./combos/comboDetallesReducers";
import comboListadoDeEspeciesBien from "./combos/comboListadoDeEspeciesBienReducers";

//-----------Modificar Inventario --------------//
import datosInventarioReducer from "./Inventario/datosInventarioReducer";

//------------Anular Inventario-----------------//
import datosListaInventarioReducer from "./Inventario/datosListaInventarioReducer";
import comboProveedorReducers from "./combos/comboProveedorReducers";



const rootReducer = combineReducers({
  //Autentificación
  loginReducer,
  //------------Registro inventario------------------//
  //Form1
  datosRecepcionReducer,
  origenPresupuestoReducer,
  modalidadCompraReducer,
  comboProveedorReducers,

  //form 2
  comboServicioReducer,
  comboCuentaReducer,
  comboDependenciaReducer,
  comboListadoDeEspeciesBien,
  detallesReducer,


  datosInventarioReducer,

  //-----------Anular Inventario --------------//
  datosListaInventarioReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
