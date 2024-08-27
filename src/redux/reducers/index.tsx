import { combineReducers } from 'redux';
import auth from './auth'; // Asegúrate de que esta ruta es correcta
// Importa tus reducers aquí
// import userReducer from './userReducer';
// import postReducer from './postReducer';

// Define el tipo de RootState basado en tus reducers
const rootReducer = combineReducers({
    auth,
    // user: userReducer,
    // posts: postReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
