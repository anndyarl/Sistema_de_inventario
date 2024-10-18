import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState } from "react";
import { Button, Table, Form, Row, Col } from "react-bootstrap";
import { PencilFill } from "react-bootstrap-icons";
import { AppDispatch, RootState } from "../../../store";
import { connect, useDispatch } from "react-redux";
import Layout from "../../../hooks/layout/Layout";
import { obtenerInventarioActions } from "../../../redux/actions/Inventario/obtenerInventarioActions";

export interface InventarioCompleto {
  aF_CLAVE: number;
  aF_CODIGO_GENERICO: string;
  aF_CODIGO_LARGO: string;
  deP_CORR: number;
  esP_CODIGO: string;
  aF_SECUENCIA: number;
  itE_CLAVE: number;
  aF_DESCRIPCION: string;
  aF_FINGRESO: string;
  aF_ESTADO: string;
  aF_CODIGO: string;
  aF_TIPO: string;
  aF_ALTA: string;
  aF_PRECIO_REF: number;
  aF_CANTIDAD: number;
  aF_ORIGEN: number;
  aF_RESOLUCION: string;
  aF_FECHA_SOLICITUD: string;
  aF_OCO_NUMERO_REF: string;
  usuariO_CREA: string;
  f_CREA: string;
  iP_CREA: string;
  usuariO_MOD: string;
  f_MOD: string;
  iP_MODt: string;
  aF_TIPO_DOC: number;
  proV_RUN: number;
  reG_EQM: string;
  aF_NUM_FAC: string;
  aF_FECHAFAC: string;
  aF_3UTM: string;
  iD_GRUPO: number;
  ctA_COD: string;
  transitoria: string;
  aF_MONTOFACTURA: number;
  esP_DESCOMPONE: string;
  aF_ETIQUETA: string;
  aF_VIDAUTIL: number;
  aF_VIGENTE: string;
  idprograma: number;
  idmodalidadcompra: number;
  idpropiedad: number;
  especie: string;
  deT_MARCA: string;
  deT_MODELO: string;
  deT_SERIE: string;
  deT_LOTE: string;
  deT_OBS: string;
  iP_MOD: string;
  deT_PRECIO: number;
  deT_RECEPCION: number;
  propietario: number;
  tipopropietario: number;
}

interface InventarioCompletoProps {
  datosInventarioCompleto: InventarioCompleto[];
}

const ModificarInventario: React.FC<InventarioCompletoProps> = ({
  datosInventarioCompleto,
}) => {
  const [Inventario, setInventario] = useState({
    aF_CLAVE: 0,
    aF_ORIGEN: 0,
    aF_MONTOFACTURA: 0
  });
  const dispatch = useDispatch<AppDispatch>();
  // Asegúrate de que el array tiene datos
  const index = 0; // Cambia esto al índice que desees
  const aF_CLAVE = datosInventarioCompleto[index]?.aF_CLAVE || '';
  const aF_FINGRESO = datosInventarioCompleto[index]?.aF_FINGRESO || '';
  const aF_ORIGEN = datosInventarioCompleto[index]?.aF_ORIGEN || 0;
  const aF_NUM_FAC = datosInventarioCompleto[index]?.aF_NUM_FAC || '';
  const aF_MONTOFACTURA = datosInventarioCompleto[index]?.aF_MONTOFACTURA || '';
  const proV_RUN = datosInventarioCompleto[index]?.proV_RUN || 0;
  const idmodalidadcompra = datosInventarioCompleto[index]?.idmodalidadcompra || '';
  const aF_FECHAFAC = datosInventarioCompleto[index]?.aF_FECHAFAC || '';

  const [error, setError] = useState({ nRecepcion: false });

  console.log('aF_FINGRESO:', datosInventarioCompleto[index]?.aF_FINGRESO || '');
  console.log('aF_ORIGEN:', datosInventarioCompleto[index]?.aF_ORIGEN || 0);
  console.log('aF_NUM_FAC:', datosInventarioCompleto[index]?.aF_NUM_FAC || '');
  console.log('aF_MONTOFACTURA:', datosInventarioCompleto[index]?.aF_MONTOFACTURA || '');
  console.log('proV_RUN:', datosInventarioCompleto[index]?.proV_RUN || '');
  console.log('idmodalidadcompra:', datosInventarioCompleto[index]?.idmodalidadcompra || '');
  console.log('aF_FECHAFAC:', datosInventarioCompleto[index]?.aF_FECHAFAC || '');



  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Aquí se manejaría la lógica del formulario
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setInventario((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleInventarioSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    dispatch(obtenerInventarioActions(Inventario.aF_CLAVE));
  };

  const comboOrigen = []; // Definir este arreglo correctamente
  const comboModalidad = []; // Definir este arreglo correctamente

  return (
    <Layout>
      <form onSubmit={handleSubmit}>
        <div className="border-top p-1 rounded">
          <h3 className="form-title">Modificar Inventario</h3>

          <div className="mt-4 border-top">
            <Row>
              <Col md={4}>
                <div className="mb-1">
                  <label htmlFor="aF_CLAVE" className="form-label">
                    N° Inventario
                  </label>
                  <div className="d-flex align-items-center">
                    <input type="text" className="form-control" maxLength={12} name="aF_CLAVE" onChange={handleChange} value={Inventario.aF_CLAVE} />
                    <Button onClick={handleInventarioSubmit} variant="primary" className="ms-2">
                      +
                    </Button>
                  </div>
                </div>

                <div className="mb-1">
                  <label htmlFor="fechaRecepcion" className="form-label">
                    Fecha Recepción
                  </label>
                  <input type="date" className="form-control" name="fechaRecepcion" onChange={handleChange} value="" />
                </div>

                <div className="mb-1">
                  <label htmlFor="nOrdenCompra" className="form-label">
                    N° Orden de compra
                  </label>
                  <input type="text" className="form-control" maxLength={12} name="nOrdenCompra" onChange={handleChange} value="" />
                </div>

                <div className="mb-1">
                  <label htmlFor="nFactura" className="form-label">
                    N° Factura
                  </label>
                  <input type="text" className="form-control" maxLength={12} name="nFactura" onChange={handleChange} value="" />
                </div>

                <div className="mb-1">
                  <label htmlFor="origenPresupuesto" className="form-label">
                    Origen Presupuesto
                  </label>
                  <select className="form-control" name="aF_ORIGEN" onChange={handleChange} value={aF_ORIGEN}>
                    <option value="">Seleccione un origen</option>
                    {/* {comboOrigen.map((traeOrigen) => (
                      <option key={traeOrigen.codigo} value={traeOrigen.codigo}>
                        {traeOrigen.descripcion}
                      </option>
                    ))} */}
                  </select>
                </div>
              </Col>

              <Col md={4}>
                <div className="mb-1">
                  <label htmlFor="montoRecepcion" className="form-label">
                    Monto Recepción
                  </label>
                  <input type="text" className="form-control" maxLength={12} name="aF_MONTOFACTURA" onChange={handleChange} value={Inventario.aF_MONTOFACTURA || aF_MONTOFACTURA} />
                </div>

                <div className="mb-1">
                  <label htmlFor="fechaFactura" className="form-label">
                    Fecha Factura
                  </label>
                  <input type="date" className="form-control" name="fechaFactura" onChange={handleChange} value="" />
                </div>

                <div className="mb-1">
                  <label htmlFor="rutProveedor" className="form-label">
                    Rut Proveedor
                  </label>
                  <input type="text" className="form-control" maxLength={12} name="rutProveedor" onChange={handleChange} value="" />
                </div>

                <div className="mb-1">
                  <label htmlFor="nombreProveedor" className="form-label">
                    Nombre Proveedor
                  </label>
                  <input type="text" className="form-control" maxLength={30} name="nombreProveedor" onChange={handleChange} value="" />
                </div>

                <div className="mb-1">
                  <label htmlFor="modalidadDeCompra" className="form-label">
                    Modalidad de Compra
                  </label>
                  <select className="form-control" name="modalidadDeCompra" onChange={handleChange} value="">
                    <option value="">Seleccione una modalidad</option>
                    {/* {comboModalidad.map((traeModalidad) => (
                      <option key={traeModalidad.codigo} value={traeModalidad.codigo}>
                        {traeModalidad.descripcion}
                      </option>
                    ))} */}
                  </select>
                </div>
              </Col>
              <Col md={4}>
                <div className="mb-1">
                  <label htmlFor="servicio" className="form-label">
                    Servicio
                  </label>
                  <select className="form-select" name="servicio" onChange={handleChange} value={Inventario.aF_ORIGEN}>
                    <option value="">Seleccione un origen</option>
                    {/* {comboServicio.map((traeServicio) => (
                        <option key={traeServicio.codigo} value={traeServicio.codigo}>
                          {traeServicio.nombrE_ORD}
                        </option>
                      ))} */}
                  </select>

                </div>
                <div className="cmb-1">
                  <label htmlFor="modalidadDeCompra" className="form-label">
                    Dependencia
                  </label>
                  <select className="form-select" name="dependencia" onChange={handleChange} value=''>
                    <option value="" >Selecciona una opción</option>
                    {/* {comboDependencia.map((traeDependencia) => (
                        <option key={traeDependencia.codigo} value={traeDependencia.codigo}>
                          {traeDependencia.nombrE_ORD}
                        </option>
                      ))} */}
                  </select>

                </div>

                <div className="mb-1">
                  <label htmlFor="modalidadDeCompra" className="form-label">
                    Especie
                  </label> {/* Botón para abrir el modal y seleccionar una especie */} {/*
						<Button variant="primary" onClick={()=> setMostrarModal(true)}>+</Button> */}
                  <input type="text" name="especie" value='' onChange={handleChange} />

                </div>

                <div className="mb-1">
                  <label htmlFor="modalidadDeCompra" className="form-label">
                    Cuenta
                  </label>
                  <select className="form-select" name="cuenta" onChange={handleChange} value=''>
                    {/* <option value="">Selecciona una opción</option>
                      {comboCuenta.map((traeCuentas) => (
                        <option key={traeCuentas.codigo} value={traeCuentas.codigo}>
                          {traeCuentas.descripcion}
                        </option>
                      ))} */}
                  </select>
                </div>
              </Col>
            </Row>
          </div>

          {/*
			<div className="p-1 rounded bg-white d-flex justify-content-end">
				<button type="submit" className="btn btn-primary">
              Siguiente
            </button>
			</div> */}
        </div>
      </form>
    </Layout>
  );
};

const mapStateToProps = (state: RootState) => ({
  datosInventarioCompleto: state.datosInventarioReducer.datosInventarioCompleto,
});

export default connect(mapStateToProps)(ModificarInventario);
