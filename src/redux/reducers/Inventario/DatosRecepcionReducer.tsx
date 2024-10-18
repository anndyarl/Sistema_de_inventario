import { ActivoFijo } from '../../../components/Inventario/Datos_activo_fijo';
import {
  RECEPCION_REQUEST,
  RECEPCION_SUCCESS,
  RECEPCION_FAIL, 
} from '../../actions/types';


// Define el tipo para el estado inicial
interface DatosRecepcionState {
  nRecepcion: number;
  fechaRecepcion: string;
  nOrdenCompra: number;
  nFactura: string;
  origenPresupuesto: number;
  montoRecepcion: number[];
  fechaFactura: string;
  rutProveedor: string;
  nombreProveedor: string;
  modalidadDeCompra: number;
  totalEstadoGlobal: number;
  resetFormulario: [];
  precio: number;
  servicio: number;
  cuenta: number;
  dependencia: number;
  especie: string;
  bien: number;
  detalle: number;
  descripcionEspecie: string;
  nombreEspecie: string[];
  datosTablaActivoFijo: ActivoFijo[]
}

// Estado inicial tipado
const initialState: DatosRecepcionState = {
  nRecepcion: 0,
  fechaRecepcion: '',
  nOrdenCompra: 0,
  nFactura: '',
  origenPresupuesto: 0,
  montoRecepcion: [],
  fechaFactura: '',
  rutProveedor: '',
  nombreProveedor: '',
  modalidadDeCompra: 0,
  totalEstadoGlobal: 0,
  resetFormulario: [],
  precio: 0,
  servicio: 0,
  cuenta: 0,
  dependencia: 0,
  especie: '',
  bien: 0,
  detalle: 0,
  descripcionEspecie: '',
  nombreEspecie: [],
  datosTablaActivoFijo: [],
 };


// Reducer con tipos definidos
const datosRecepcionReducer = (state = initialState, action: any) => {
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
      return { ...state, modalidadDeCompra: action.payload };
    case 'SET_TOTAL_ACTIVO_FIJO':
      return { ...state, totalEstadoGlobal: action.payload };
    case 'SET_PRECIO':
      return { ...state, precio: action.payload };
    case 'SET_SERVICIO':
      return { ...state, servicio: action.payload };
    case 'SET_CUENTA':
      return { ...state, cuenta: action.payload };
    case 'SET_DEPENDENCIA':
      return { ...state, dependencia: action.payload };
    case 'SET_ESPECIE':
      return { ...state, especie: action.payload };
    case 'SET_DESCRIPCION_ESPECIE':
      return { ...state, descripcionEspecie: action.payload };
    case 'SET_NOMBRE_ESPECIE':
      return {
        ...state,
        nombreEspecie: [...state.nombreEspecie, action.payload], // Agrega el nuevo nombre al array
      };
    case 'SET_DATOS_TABLA_ACTIVO_FIJO':
      return {
        ...state,
        datosTablaActivoFijo: [...state.datosTablaActivoFijo, ...action.payload], // Agrega los nuevos datos en lugar de sobrescribir
      };
    case 'ELIMINAR_ACTIVO_TABLA':
      return {
        ...state,
        datosTablaActivoFijo: state.datosTablaActivoFijo.filter((_, i) => i !== action.payload), // Filtra por índice
      };
    case 'ELIMINAR_MULTIPLES_ACTIVOS_TABLA':
      return {
        ...state,
        datosTablaActivoFijo: state.datosTablaActivoFijo.filter((_, index) => !action.payload.includes(index)), // Filtra los elementos por índice
      };
    case 'ACTUALIZAR_SERIE_TABLA':
      return {
        ...state,
        datosTablaActivoFijo: state.datosTablaActivoFijo.map((activo, i) =>
          i === action.payload.index
            ? { ...activo, serie: action.payload.nuevaSerie }
            : activo
        )
      };
    case 'VACIAR_DATOS_TABLA':
      return {
        ...state,
        datosTablaActivoFijo: [], // Vacía completamente los datos de la tabla
      };
    case 'RESET_FORMULARIO':
      return { ...initialState, payload: initialState };
    case RECEPCION_REQUEST:
      return { ...state, loading: true };
    case RECEPCION_SUCCESS:
      return {
        ...state,
        loading: false,
        nRecepcion: action.payload.numeroRecepcion,
        fechaRecepcion: action.payload.fechaRecepcion,
        nOrdenCompra: action.payload.numeroOrdenCompra,
        nFactura: action.payload.numeroFactura,
        origenPresupuesto: action.payload.origen,
        montoRecepcion: action.payload.montoRecepcion,
        fechaFactura: action.payload.fechaFactura,
        rutProveedor: action.payload.rutProveedor,
        nombreProveedor: action.payload.nombreProveedor,
        modalidadDeCompra: action.payload.modalidadDeCompra   
      };   
    case RECEPCION_FAIL:
      return { ...state, loading: false, error: action.error };
    default:
      return state;
  }
};



export default datosRecepcionReducer;
