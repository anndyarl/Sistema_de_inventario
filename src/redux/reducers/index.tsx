import { combineReducers } from 'redux';
import auth from './auth/auth';
import origenPresupuestoReducer from './combos/comboOrigenReducers';
import modalidadCompraReducer from './combos/comboModalidadReducers';
import servicioReducer from './combos/comboServicioReducers';

import datos_inventarioReducer from './Inventario/Datos_inventariosReducer';
import obtenerRecepcionReducer from './Inventario/obtenerRecepcionReducer';
import cuentaReducer from './combos/comboCuentaReducers';
// import bienReducer from './combos/comboBienReducers.tsx.old';
import dependenciaReducer from './combos/comboDependenciaReducers';
import comboListadoDeEspeciesBien from './combos/comboListadoDeEspeciesBienReducers';
import detallesReducer from './combos/comboDetallesReducers';


// import nRecepcionReducer from './combos/comboRecepcionReducers';
// Define el tipo de RootState basado en tus reducers
const rootReducer = combineReducers({
    //Autentificaciòn
    auth,

    //combos
    origenPresupuestoReducer,
    servicioReducer,
    modalidadCompraReducer,
    obtenerRecepcionReducer,
    cuentaReducer,
    // bienReducer,
    dependenciaReducer,
    comboListadoDeEspeciesBien,
    detallesReducer,

    //formulario inventaro
    datos_inventarioReducer,

});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
