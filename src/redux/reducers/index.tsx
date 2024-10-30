import { combineReducers } from "redux";

//------------Registro inventario------------------//
//Form1
import datosRecepcionReducer from "./Inventario/DatosRecepcionReducer";
import origenPresupuestoReducer from "./combos/comboOrigenReducers";
import modalidadCompraReducer from "./combos/comboModalidadReducers";

//Form 2
import comboServicioReducer from "./combos/comboServicioReducers";
import comboCuentaReducer from "./combos/comboCuentaReducers";
import comboDependenciaReducer from "./combos/comboDependenciaReducers";
import detallesReducer from "./combos/comboDetallesReducers";
import comboListadoDeEspeciesBien from "./combos/comboListadoDeEspeciesBienReducers";

//-----------Modificar Inventario --------------//
import datosInventarioReducer from "./Inventario/DatosInventarioReducer";
import datosListaInventarioReducer from "./Inventario/datosListaInventarioReducer";
import loginReducer from "./auth/auth";

//-----------Anular Inventario --------------//

// import obtenerInventarioReducer from './Inventario/obtenerInventarioReducer.tsx.old';

const rootReducer = combineReducers({
  //Autentificación
  loginReducer,
  //------------Registro inventario------------------//
  //Form1
  datosRecepcionReducer,
  origenPresupuestoReducer,
  modalidadCompraReducer,

  //form 2
  comboServicioReducer,
  comboCuentaReducer,
  comboDependenciaReducer,
  comboListadoDeEspeciesBien,
  detallesReducer,

  //-----------Modificar Inventario --------------//
  datosInventarioReducer,

  //-----------Anular Inventario --------------//
  datosListaInventarioReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
