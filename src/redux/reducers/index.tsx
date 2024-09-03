import { combineReducers } from 'redux';
import auth from './auth/auth'; // Asegúrate de que esta ruta es correcta
import origenPresupuestoReducer from './combos/comboTraeOrigenReducers';
import servicioReducer from './combos/comboTraeServicioReducers';

// Define el tipo de RootState basado en tus reducers
const rootReducer = combineReducers({
    auth,
    origenPresupuestoReducer,
    servicioReducer,   
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
