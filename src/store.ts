// store.ts
import { createStore, applyMiddleware, Store } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import rootReducer from './redux/reducers'; // Ajusta según la estructura de tu proyecto
import thunk, { ThunkMiddleware } from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

// Configuración de persistencia
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'Datos_inventariosReducer'], // Reducer que deseas persistir
};

// Reducer persistente
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Middleware con tipos correctos
const middleware = [thunk as ThunkMiddleware];

// Creación del store con el reducer persistente y middleware
const store = createStore(
  persistedReducer,
  composeWithDevTools(applyMiddleware(...middleware))
);

// Creación del persistor
const persistor = persistStore(store);

// Exportar los tipos de store
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

export { store, persistor };
