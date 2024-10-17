import { ActivoFijo } from '../../../components/Inventario/Datos_activo_fijo';
import {
  RECEPCION_REQUEST,
  RECEPCION_SUCCESS,
  RECEPCION_FAIL,
  INVENTARIO_REQUEST,
  INVENTARIO_SUCCESS
} from '../../actions/types';


// Define el tipo para el estado inicial
interface DatosInventarioState {
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
  datosTabla: ActivoFijo[],
  aF_ORIGEN: string,
}

// Estado inicial tipado
const initialState: DatosInventarioState = {
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
  datosTabla: [],
  aF_ORIGEN: ''
};


// Reducer con tipos definidos
const datosInventarioReducer = (state = initialState, action: any) => {
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
    // return {
    //   ...state,
    //   montoRecepcion: [...state.montoRecepcion, action.payload],
    // }
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
    case 'SET_DATOS_TABLA':
      return {
        ...state,
        datosTabla: [...state.datosTabla, ...action.payload], // Agrega los nuevos datos en lugar de sobrescribir
      };
    case 'ELIMINAR_ACTIVO_TABLA':
      return {
        ...state,
        datosTabla: state.datosTabla.filter((_, i) => i !== action.payload), // Filtra por índice
      };
    case 'ELIMINAR_MULTIPLES_ACTIVOS_TABLA':
      return {
        ...state,
        datosTabla: state.datosTabla.filter((_, index) => !action.payload.includes(index)), // Filtra los elementos por índice
      };
    case 'ACTUALIZAR_SERIE_TABLA':
      return {
        ...state,
        datosTabla: state.datosTabla.map((activo, i) =>
          i === action.payload.index
            ? { ...activo, serie: action.payload.nuevaSerie }
            : activo
        )
      };
    case 'VACIAR_DATOS_TABLA':
      return {
        ...state,
        datosTabla: [], // Vacía completamente los datos de la tabla
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
    case INVENTARIO_REQUEST:
      return { ...state, loading: true };
    case INVENTARIO_SUCCESS:
      return {
        ...state,
        loading: false,
        aF_CLAVE: 0,
        aF_CODIGO_GENERICO: "3000000001",
        aF_CODIGO_LARGO: "3000000001",
        deP_CORR: 0,
        esP_CODIGO: "",
        aF_SECUENCIA: 0,
        itE_CLAVE: 0,
        aF_DESCRIPCION: "Locker 3 Cuerpos",
        aF_FINGRESO: "9/4/2024 12:48:13 PM",
        aF_ESTADO: "S ",
        aF_CODIGO: "469-003-1178-01",
        aF_TIPO: "COMPRAEXTRA",
        aF_ALTA: "S",
        aF_PRECIO_REF: 77338,
        aF_CANTIDAD: 1,
        aF_ORIGEN: action.payload.aF_ORIGEN,
        aF_RESOLUCION: "674308",
        aF_FECHA_SOLICITUD: "6/13/2017 12:00:00 AM",
        aF_OCO_NUMERO_REF: "165665",
        usuariO_CREA: "lbriones",
        f_CREA: "0",
        iP_CREA: "0",
        usuariO_MOD: "0",
        f_MOD: "0",
        iP_MODt: "",
        aF_TIPO_DOC: 1,
        proV_RUN: 0,
        reG_EQM: "0",
        aF_NUM_FAC: "0",
        aF_FECHAFAC: "0",
        aF_3UTM: "N",
        iD_GRUPO: 64,
        ctA_COD: "0",
        transitoria: "0",
        aF_MONTOFACTURA: 618705,
        esP_DESCOMPONE: "0",
        aF_ETIQUETA: "0",
        aF_VIDAUTIL: 0,
        aF_VIGENTE: "0",
        idprograma: 0,
        idmodalidadcompra: 0,
        idpropiedad: 0,
        especie: "0",
        deT_MARCA: "acolchado celeste",
        deT_MODELO: "con apoya brazo",
        deT_SERIE: "con ruedas",
        deT_LOTE: "0",
        deT_OBS: "0",
        iP_MOD: "0",
        deT_PRECIO: 38212254,
        deT_RECEPCION: 0,
        propietario: 0,
        tipopropietario: 0,

      };
    case RECEPCION_FAIL:
      return { ...state, loading: false, error: action.error };
    default:
      return state;
  }
};



export default datosInventarioReducer;
