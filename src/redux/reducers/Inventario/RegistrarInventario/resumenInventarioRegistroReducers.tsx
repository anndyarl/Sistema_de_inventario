
import {
  POST_FORMULARIO_REQUEST,
  POST_FORMULARIO_SUCCESS,
  POST_FORMULARIO_FAIL
} from '../../../actions//Inventario/types'

// Define el tipo para el estado inicial
interface DatosBajasState {
  loading: boolean;
  error: any;
  fechaFacturaR: string;
  fechaRecepcionR: string;
  modalidadDeCompraR: number;
  otraModalidadR: number | null;
  montoRecepcionR: number;
  nFacturaR: string;
  nOrdenCompraR: string;
  nRecepcionR: number;
  origenPresupuestoR: number;
  rutProveedorR: number;
  servicioR: number;
  cantidadR: number;
  cuentaR: number;
  dependenciaR: number;
  especieR: string;

  activosFijos: Array<{
    id: string;
    vidaUtil: string;
    fechaIngreso: string;
    marca: string;
    cantidad: string;
    modelo: string;
    observaciones: string;
    serie: string;
    precio: string;
    especie: string;
    color: string;
  }>

}

// Estado inicial tipado
const initialState: DatosBajasState = {
  loading: false,
  error: null,
  fechaFacturaR: '',
  fechaRecepcionR: '',
  modalidadDeCompraR: 0,
  otraModalidadR: 0,
  montoRecepcionR: 0,
  nFacturaR: '',
  nOrdenCompraR: '',
  nRecepcionR: 0,
  origenPresupuestoR: 0,
  rutProveedorR: 0,
  servicioR: 0,
  cantidadR: 0,
  cuentaR: 0,
  dependenciaR: 0,
  especieR: '',
  activosFijos: []
};

// Reducer con tipos definidos
const resumenInventarioRegistroReducers = (state = initialState, action: any) => {
  switch (action.type) {
    case POST_FORMULARIO_REQUEST:
      return { ...state, loading: true };
    case POST_FORMULARIO_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        fechaFacturaR: action.payload.fechaFactura,
        fechaRecepcionR: action.payload.fechaRecepcion,
        modalidadDeCompraR: action.payload.modalidadDeCompra,
        otraModalidadR: action.payload.otraModalidad,
        montoRecepcionR: action.payload.montoRecepcion,
        nFacturaR: action.payload.nFactura,
        nOrdenCompraR: action.payload.nOrdenCompra,
        nRecepcionR: action.payload.nRecepcion,
        origenPresupuestoR: action.payload.origenPresupuesto,
        rutProveedorR: action.payload.rutProveedor,
        usuarioCreaR: action.payload,
        servicioR: action.payload.servicio,
        cantidadR: action.payload.cantidad,
        cuentaR: action.payload.cuenta,
        dependenciaR: action.payload.dependencia,
        especieR: action.payload.especie,
        activosFijos: action.payload.activosFijos
      };
    case POST_FORMULARIO_FAIL:
      return { ...state, loading: false, error: action.error };
    default:
      return state;
  }
};



export default resumenInventarioRegistroReducers;
