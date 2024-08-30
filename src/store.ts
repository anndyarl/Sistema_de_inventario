import { createStore, applyMiddleware, Store } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Esto usa localStorage para persistir
import rootReducer, { RootState } from './redux/reducers'; // Asegúrate de que esto esté correcto
import thunk, { ThunkMiddleware } from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

// Configuración de persistencia
const persistConfig = {
  key: 'root', // Clave principal para el almacenamiento
  storage, // Usa localStorage para almacenar el estado persistido
  whitelist: ['auth'], // Solo persiste el reducer de 'auth'
};

// Reducer persistente
const persistedReducer = persistReducer<RootState>(persistConfig, rootReducer);
const middleware = [thunk as ThunkMiddleware<RootState>];

// Creación del store con el reducer persistente y middleware
const store: Store<RootState> = createStore(
  persistedReducer,
  composeWithDevTools(applyMiddleware(...middleware)) // Aplica el middleware y devtools en desarrollo
);

// Creación del persistor
const persistor = persistStore(store);

// Exporta el store y persistor
export { store, persistor };
