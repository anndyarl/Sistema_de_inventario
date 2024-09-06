

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

export const setMontoRecepcion = (montoRecepcion: string) => ({
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
