

// datos_inventarioReducer.js

const initialState = {
  nRecepcion: '',
  fechaRecepcion: '',
  nOrdenCompra: '',
  horaRecepcion: '',
  nFactura: '',
  origenPresupuesto: '',
  montoRecepcion: '',
  fechaFactura: '',
  rutProveedor: '',
  nombreProveedor: '',
};

const datos_inventarioReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case 'SET_N_RECEPCION':
      return { ...state, nRecepcion: action.payload };
    case 'SET_FECHA_RECEPCION':
      return { ...state, fechaRecepcion: action.payload };
    case 'SET_N_ORDEN_COMPRA':
      return { ...state, nOrdenCompra: action.payload };
    case 'SET_HORA_RECEPCION':
      return { ...state, horaRecepcion: action.payload };
    case 'SET_N_FACTURA':
      return { ...state, nFactura: action.payload };
    case 'SET_ORIGEN_PRESUPUESTO':
      return { ...state, origenPresupuesto: action.payload };
    case 'SET_MONTO_RECEPCION':
      return { ...state, montoRecepcion: action.payload };
    case 'SET_FECHA_FACTURA':
      return { ...state, fechaFactura: action.payload };
    case 'SET_RUT_PROVEEDOR':
      return { ...state, rutProveedor: action.payload };
    case 'SET_NOMBRE_PROVEEDOR':
      return { ...state, nombreProveedor: action.payload };
    default:
      return state;
  }
};

export default datos_inventarioReducer;

