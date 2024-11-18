// store.ts
import { createStore, applyMiddleware } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import rootReducer from './redux/reducers'; 
import thunk, { ThunkMiddleware } from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

// Configuración de persistencia
const persistConfig = {
  key: 'root',
  storage,
  // whitelist: ['auth', 'datosInventarioReducer', 'comboDependenciaReducer', 'comboListadoDeEspeciesBien', 'comboCuentaReducer']// Se agregan los datos a persistir en el navegador
  whitelist: ['loginReducer','obtenerRecepcionReducers','datosCuentaReducers','datosActivoFijoReducers','comboServicioReducer','comboDependenciaReducer','comboListadoDeEspeciesBien','comboCuentaReducer']
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
// store.subscribe(() => {
//   console.log('Estado actualizado:', store.getState());
// });

// Creación del persistor
const persistor = persistStore(store);


persistor.subscribe(() => {
  const state = store.getState();
  console.log('Estado persistido:', state);
});


// Exportar los tipos de store
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

export { store, persistor };
