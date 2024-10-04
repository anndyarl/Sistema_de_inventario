export const setNRecepcionActions = (nRecepcion: number) => ({
  type: 'SET_N_RECEPCION',
  payload: nRecepcion,
});

export const setFechaRecepcionActions = (fechaRecepcion: string) => ({
  type: 'SET_FECHA_RECEPCION',
  payload: fechaRecepcion,
});

export const setNOrdenCompraActions = (nOrdenCompra: number) => ({
  type: 'SET_N_ORDEN_COMPRA',
  payload: nOrdenCompra,
});

export const setNFacturaActions = (nFactura: string) => ({
  type: 'SET_N_FACTURA',
  payload: nFactura,
});

export const setOrigenPresupuestoActions = (origenPresupuesto: number) => ({
  type: 'SET_ORIGEN_PRESUPUESTO',
  payload: origenPresupuesto,
});

export const setMontoRecepcionActions = (montoRecepcion: number) => ({
  type: 'SET_MONTO_RECEPCION',
  payload: montoRecepcion,
});

export const setFechaFacturaActions = (fechaFactura: string) => ({
  type: 'SET_FECHA_FACTURA',
  payload: fechaFactura,
});

export const setRutProveedorActions = (rutProveedor: string) => ({
  type: 'SET_RUT_PROVEEDOR',
  payload: rutProveedor,
});

export const setnombreProveedorActions = (nombreProveedor: string) => ({
  type: 'SET_NOMBRE_PROVEEDOR',
  payload: nombreProveedor,
});

export const setModalidadCompraActions = (modalidadDeCompra: number) => ({
  type: 'SET_MODALIDAD_COMPRA',
  payload: modalidadDeCompra,
});

export const setTotalActivoFijoActions = (total: number) => ({
  type: 'SET_TOTAL_ACTIVO_FIJO',
  payload: total,
});
export const setPrecioActions = (precio: number) => ({
  type: 'SET_PRECIO',
  payload: precio,
});
export const setServicioActions = (servicio: number) => ({
  type: 'SET_SERVICIO',
  payload: servicio,
});
export const setCuentaActions = (cuenta: number) => ({
  type: 'SET_CUENTA',
  payload: cuenta,
});
export const setDependenciaActions = (dependencia: number) => ({
  type: 'SET_DEPENDENCIA',
  payload: dependencia,
});
export const setEspecieActions = (especie: number) => ({
  type: 'SET_ESPECIE',
  payload: especie,
});

export const setResetFormularioActions = () => ({
  type: 'RESET_FORMULARIO',
});


