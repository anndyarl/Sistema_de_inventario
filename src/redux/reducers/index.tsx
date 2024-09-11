import { combineReducers } from 'redux';
import auth from './auth/auth'; // Asegúrate de que esta ruta es correcta
import origenPresupuestoReducer from './combos/comboOrigenReducers';
import modalidadCompraReducer from './combos/comboModalidadReducers';
import servicioReducer from './combos/comboServicioReducers';

import datos_inventarioReducer from './Inventario/Datos_inventariosReducer';




// Define el tipo de RootState basado en tus reducers
const rootReducer = combineReducers({
    //Autentificaciòn
    auth,

    //combos
    origenPresupuestoReducer,
    servicioReducer,  
    modalidadCompraReducer,
    

    //formulario inventaro
    datos_inventarioReducer,

  
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
