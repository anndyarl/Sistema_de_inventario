import { ActivoFijo } from "../../../../components/Inventario/RegistrarInventario/DatosActivoFijo";

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
/*-----------------------Proveedor----------------------*/
export const setRutProveedorActions = (rutProveedor: number | string) => ({
  type: 'SET_RUT_PROVEEDOR',
  payload: rutProveedor,
});
export const setOtroProveedorActions = (otroProveedor: string) => ({
  type: 'SET_OTRO_PROVEEDOR',
  payload: otroProveedor,
});
export const showInputProveedorActions = (showInputproveedor: boolean) => ({
  type: 'SET_MOSTRAR_PROVEEDOR',
  payload: showInputproveedor,
});
/*-----------------------Fin Proveedor----------------------*/

/*-----------------------Modalidad de compra----------------------*/
export const setModalidadCompraActions = (modalidadDeCompra: number) => ({
  type: 'SET_MODALIDAD_COMPRA',
  payload: modalidadDeCompra,
});
export const setOtraModalidadActions = (otraModalidad: string) => ({
  type: 'SET_OTRA_MODALIDAD_COMPRA',
  payload: otraModalidad,
});
export const showInputActions = (showInput: boolean) => ({
  type: 'SET_MOSTRAR_MODALIDAD_COMPRA',
  payload: showInput,
});
/*----------------------Fin Modalidad de compra----------------------*/
export const setTotalActivoFijoActions = (total: number) => ({
  type: 'SET_TOTAL_ACTIVO_FIJO',
  payload: total,
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
export const setEspecieActions = (especie: string) => ({
  type: 'SET_ESPECIE',
  payload: especie,
});
export const setDescripcionEspecieActions = (descripcionEspecie: string) => ({
  type: 'SET_DESCRIPCION_ESPECIE',
  payload: descripcionEspecie,
});
export const setBienActions = (bien: number) => ({
  type: 'SET_BIEN',
  payload: bien,
});
export const setDetalleActions = (detalle: number) => ({
  type: 'SET_DETALLE',
  payload: detalle,
});
export const setListadoEspecieActions = (listado: number) => ({
  type: 'SET_LISTADO_ESPECIE',
  payload: listado,
});
export const setNombreEspecieActions = (nombreEspecie: string) => ({
  type: 'SET_NOMBRE_ESPECIE',
  payload: nombreEspecie,
});
export const setResetFormularioActions = () => ({
  type: 'RESET_FORMULARIO',
});
export const setDatosTablaActivoFijo = (datosTablaActivoFijo: ActivoFijo[]) => ({
  type: 'SET_DATOS_TABLA_ACTIVO_FIJO',
  payload: datosTablaActivoFijo,
});
export const eliminarActivoDeTabla = (index: number) => ({
  type: 'ELIMINAR_ACTIVO_TABLA',
  payload: index,
});
export const eliminarMultiplesActivosDeTabla = (indices: number[]) => ({
  type: 'ELIMINAR_MULTIPLES_ACTIVOS_TABLA',
  payload: indices,
});
export const actualizarSerieEnTabla = (index: number, nuevaSerie: string) => ({
  type: 'ACTUALIZAR_SERIE_TABLA',
  payload: { index, nuevaSerie }
});
export const vaciarDatosTabla = () => ({
  type: 'VACIAR_DATOS_TABLA',
});

export const setVidaUtilActions = (vidaUtil: string) => ({
  type: 'SET_VIDA_UTIL',
  payload: vidaUtil,
});

export const setFechaIngresoActions = (fechaIngreso: string) => ({
  type: 'SET_FECHA_INGRESO',
  payload: fechaIngreso,
});

export const setMarcaActions = (marca: string) => ({
  type: 'SET_MARCA',
  payload: marca,
});
export const setModeloActions = (modelo: string) => ({
  type: 'SET_MODELO',
  payload: modelo,
});

export const setPrecioActions = (precio: string) => ({
  type: 'SET_PRECIO',
  payload: precio,
});

export const setCantidadActions = (cantidad: string) => ({
  type: 'SET_CANTIDAD',
  payload: cantidad,
});

export const setObservacionesActions = (observaciones: string) => ({
  type: 'SET_OBSERVACIONES',
  payload: observaciones,
});


