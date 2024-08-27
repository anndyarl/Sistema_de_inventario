import { createStore, applyMiddleware, Store } from 'redux';
import thunk, { ThunkMiddleware } from 'redux-thunk';
import rootReducer from './redux/reducers';
import { composeWithDevTools } from 'redux-devtools-extension';

// Tipos para el estado inicial y el store
interface RootState {
    // Define aquí la estructura de tu estado
    // Por ejemplo:
    // user: UserState;
    // posts: PostState;
}

const initialState: RootState = {
       auth: {
        user: null,
        access: null,
        isAuthenticated: false,
        loading: false
    }
} as RootState;

const middleware = [thunk as ThunkMiddleware<RootState>];

const store: Store<RootState> = createStore(
    rootReducer,
    initialState,
    // applyMiddleware(...middleware) // Para deshabilitar devtools en producción
    composeWithDevTools(applyMiddleware(...middleware)) // Para ver el icono verde en el navegador en desarrollo
);

export default store;
