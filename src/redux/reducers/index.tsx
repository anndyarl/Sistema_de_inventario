import { combineReducers } from 'redux';
import auth from './auth/auth'; // Asegúrate de que esta ruta es correcta
import origenPresupuestoReducer from './combos/comboTraeOrigenReducers';
import servicioReducer from './combos/comboTraeServicioReducers';
import datos_inventarioReducer from './Inventario/Datos_inventariosReducer';
import { logout } from '../actions/auth/auth';

// Define el tipo de RootState basado en tus reducers
const rootReducer = combineReducers({
    auth,
    origenPresupuestoReducer,
    servicioReducer,   
    datos_inventarioReducer,
    logout

});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
