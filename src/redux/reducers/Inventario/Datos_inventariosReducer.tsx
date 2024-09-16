// Define el tipo para el estado inicial
interface DatosInventarioState {
  nRecepcion: string;
  fechaRecepcion: string;
  nOrdenCompra: string;
  nFactura: string;
  origenPresupuesto: string;
  montoRecepcion: number;
  fechaFactura: string;
  rutProveedor: string;
  nombreProveedor: string;
  modalidadCompra: string;
  totalActivoFijo: number;

  resetFormulario: [];
}

// Estado inicial tipado
const initialState: DatosInventarioState = {
  nRecepcion: '',
  fechaRecepcion: '',
  nOrdenCompra: '',
  nFactura: '',
  origenPresupuesto: '',
  montoRecepcion: 0,
  fechaFactura: '',
  rutProveedor: '',
  nombreProveedor: '',
  modalidadCompra: '',
  totalActivoFijo: 0,
  resetFormulario: [],

};


// Reducer con tipos definidos
const datos_inventarioReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case 'SET_N_RECEPCION':
      return { ...state, nRecepcion: action.payload };
    case 'SET_FECHA_RECEPCION':
      return { ...state, fechaRecepcion: action.payload };
    case 'SET_N_ORDEN_COMPRA':
      return { ...state, nOrdenCompra: action.payload };
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
    case 'SET_MODALIDAD_COMPRA':
      return { ...state, modalidadCompra: action.payload };
    case 'SET_TOTAL_ACTIVO_FIJO':
      return { ...state, totalActivoFijo: action.payload };
    case 'SET_TOTAL_ACTIVO_FIJO':
      return { ...state, totalActivoFijo: action.payload };
    case 'RESET_FORMULARIO':
      return { ...initialState, payload: initialState };
    default:
      return state;
  }
};



export default datos_inventarioReducer;
