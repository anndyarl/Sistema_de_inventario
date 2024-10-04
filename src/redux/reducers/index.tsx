import { combineReducers } from 'redux';
import auth from './auth/auth';

import datosInventarioReducer from './Inventario/DatosInventariosReducer';
import obtenerRecepcionReducer from './Inventario/obtenerRecepcionReducer';

//Form1
import origenPresupuestoReducer from './combos/comboOrigenReducers';
import modalidadCompraReducer from './combos/comboModalidadReducers';

//Form 2
import comboServicioReducer from './combos/comboServicioReducers';
import comboCuentaReducer from './combos/comboCuentaReducers';
import comboDependenciaReducer from './combos/comboDependenciaReducers';
import detallesReducer from './combos/comboDetallesReducers';
import comboListadoDeEspeciesBien from './combos/comboListadoDeEspeciesBienReducers';

const rootReducer = combineReducers({
    //Autentificación
    auth,
    obtenerRecepcionReducer,
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

    //formulario inventaro
    datosInventarioReducer,

});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
