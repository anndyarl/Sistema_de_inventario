import { combineReducers } from 'redux';
import auth from './auth/auth';

import datosInventarioReducer from './Inventario/DatosInventarioReducer';
// import obtenerRecepcionReducer from './Inventario/obtenerRecepcionReducer.tsx.old';

//Form1
import origenPresupuestoReducer from './combos/comboOrigenReducers';
import modalidadCompraReducer from './combos/comboModalidadReducers';

//Form 2
import comboServicioReducer from './combos/comboServicioReducers';
import comboCuentaReducer from './combos/comboCuentaReducers';
import comboDependenciaReducer from './combos/comboDependenciaReducers';
import detallesReducer from './combos/comboDetallesReducers';
import comboListadoDeEspeciesBien from './combos/comboListadoDeEspeciesBienReducers';
import datosRecepcionReducer from './Inventario/DatosRecepcionReducer';
// import obtenerInventarioReducer from './Inventario/obtenerInventarioReducer.tsx.old';

const rootReducer = combineReducers({
    //Autentificación
    auth,
    //Obiene por numero de recepcion
    // obtenerRecepcionReducer,
    //OBtiene por numero de inventario
    // obtenerInventarioReducer,
    /*-------------Combos-----------------*/
    //Form1
    origenPresupuestoReducer,
    modalidadCompraReducer,

    //form 2
    comboServicioReducer,
    comboCuentaReducer,
    comboDependenciaReducer,
    comboListadoDeEspeciesBien,
    detallesReducer,

    // Form 3

    //formulario inventario
    datosInventarioReducer,
    datosRecepcionReducer

});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
