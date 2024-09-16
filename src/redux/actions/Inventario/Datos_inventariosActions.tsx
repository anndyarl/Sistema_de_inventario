import { Dispatch } from "redux";
import axios from 'axios';



export const setNRecepcion = (nRecepcion: string) => ({
  type: 'SET_N_RECEPCION',
  payload: nRecepcion,
});

export const setFechaRecepcion = (fechaRecepcion: string) => ({
  type: 'SET_FECHA_RECEPCION',
  payload: fechaRecepcion,
});

export const setNOrdenCompra = (nOrdenCompra: string) => ({
  type: 'SET_N_ORDEN_COMPRA',
  payload: nOrdenCompra,
});

// export const setHoraRecepcion = (horaRecepcion: string) => ({
//   type: 'SET_HORA_RECEPCION',
//   payload: horaRecepcion,
// });

export const setNFactura = (nFactura: string) => ({
  type: 'SET_N_FACTURA',
  payload: nFactura,
});

export const setOrigenPresupuesto = (origenPresupuesto: string) => ({
  type: 'SET_ORIGEN_PRESUPUESTO',
  payload: origenPresupuesto,
});

export const setMontoRecepcion = (montoRecepcion: number) => ({
  type: 'SET_MONTO_RECEPCION',
  payload: montoRecepcion,
});

export const setFechaFactura = (fechaFactura: string) => ({
  type: 'SET_FECHA_FACTURA',
  payload: fechaFactura,
});

export const setRutProveedor = (rutProveedor: string) => ({
  type: 'SET_RUT_PROVEEDOR',
  payload: rutProveedor,
});

export const setnombreProveedor = (nombreProveedor: string) => ({
  type: 'SET_NOMBRE_PROVEEDOR',
  payload: nombreProveedor,
});

export const setModalidadCompra = (modalidadCompra: string) => ({
  type: 'SET_MODALIDAD_COMPRA',
  payload: modalidadCompra,
});

export const setTotalActivoFijo = (total: number) => ({
  type: 'SET_TOTAL_ACTIVO_FIJO',
  payload: total,
});

export const setResetFormulario = () => ({
  type: 'RESET_FORMULARIO',
});


// Acción para enviar el formulario
export const postFormulario = (formularioCombinado: any) => async (dispatch: Dispatch) => {
 
    // dispatch({ type: POST_FORMULARIO_REQUEST });
    try {
      const response = await axios.post('/api_inv/api/inventario/comboTraeServicio', formularioCombinado);

      // Si el POST es exitoso
      if (response.status === 200) {
        // dispatch({
        //   type: POST_FORMULARIO_SUCCESS,
        //   payload: response.data,
        // });
        console.log('Formulario enviado correctamente');
      }
    } catch (error) {
      // dispatch({
      //   type: POST_FORMULARIO_FAILURE,
      //   error: error.message,
      // });
      console.error('Error al enviar el formulario:', error);
    }
 
};
