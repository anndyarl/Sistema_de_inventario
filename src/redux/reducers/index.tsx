import { combineReducers } from 'redux';
import auth from './auth/auth'; // Asegúrate de que esta ruta es correcta
import origenPresupuestoReducer from './combos/comboOrigenReducers';
import modalidadCompraReducer from './combos/comboModalidadReducers';
import servicioReducer from './combos/comboServicioReducers';

import datos_inventarioReducer from './Inventario/Datos_inventariosReducer';
import obtenerRecepcionReducer from './Inventario/obtenerRecepcionReducer';
import cuentaReducer from './combos/comboCuentaReducers';
import bienReducer from './combos/comboBienReducers';


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
    bienReducer,


    //formulario inventaro
    datos_inventarioReducer,


});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
