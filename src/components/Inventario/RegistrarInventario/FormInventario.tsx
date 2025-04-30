// Importa componentes al FormularioCompleto.tsx
import React, { useEffect, useState } from "react";
import Layout from "../../../containers/hocs/layout/Layout";
import DatosInventario, { ORIGEN, MODALIDAD, PROVEEDOR } from "./DatosInventario";
import DatosCuenta, {
  SERVICIO,
  CUENTA,
  DEPENDENCIA,
  ListaEspecie,
  BIEN,
  DETALLE,
} from "./DatosCuenta";
import DatosActivoFijo from "./DatosActivoFijo";
import Timeline from "./Timeline";

// Redux global
import { RootState } from "../../../redux/reducers";
import { connect } from "react-redux";
import { comboServicioActions } from "../../../redux/actions/Inventario/Combos/comboServicioActions";
import { comboDependenciaActions } from "../../../redux/actions/Inventario/Combos/comboDependenciaActions";
import { comboDetalleActions } from "../../../redux/actions/Inventario/Combos/comboDetalleActions";
import { comboCuentaActions } from "../../../redux/actions/Inventario/Combos/comboCuentaActions";
import MenuInventario from "../../Menus/MenuInventario";
import { comboModalidadesActions } from "../../../redux/actions/Inventario/Combos/comboModalidadCompraActions";
import { comboProveedorActions } from "../../../redux/actions/Inventario/Combos/comboProveedorActions";
import { listadoDeEspeciesBienActions } from "../../../redux/actions/Inventario/Combos/listadoDeEspeciesBienActions";

import { Helmet } from "react-helmet-async";
import { comboOrigenPresupuestosActions } from "../../../redux/actions/Inventario/Combos/comboOrigenPresupuestoActions";
import { Objeto } from "../../Navegacion/Profile";
import Swal from "sweetalert2";

export interface FormInventario {
  datosInventario: Record<string, any>;
  datosCuenta: Record<string, any>;
  datosActivoFijo: Record<string, any>;
}

interface FormInventarioProps {
  //Trae props combos de Datos_inventario(formulario 1)
  comboOrigen: ORIGEN[];
  comboOrigenPresupuestosActions: () => void;
  comboModalidad: MODALIDAD[];

  comboModalidadesActions: () => void;
  comboProveedor: PROVEEDOR[];
  comboProveedorActions: () => void;

  //Trae props combos de Datos_cuenta(formulario 2)
  comboServicio: SERVICIO[];
  comboServicioActions: (establ_corr: number) => void;
  comboCuenta: CUENTA[];
  comboCuentaActions: (nombreEspecie: string) => void;
  comboDependencia: DEPENDENCIA[];
  comboDependenciaActions: (servicioSeleccionado: string) => void;

  comboBien: BIEN[];
  comboDetalle: DETALLE[];
  comboDetalleActions: (bienSeleccionado: string) => void;

  listaEspecie: ListaEspecie[];
  listadoDeEspeciesBienActions: (EST: number, IDBIEN: number, esP_CODIGO: string) => Promise<boolean>;

  token: string | null;
  objeto: Objeto; //Objeto que obtiene los datos del usuario

}

const FormInventario: React.FC<FormInventarioProps> = ({
  objeto,
  token,
  comboOrigen,
  comboModalidad,
  comboProveedor,
  comboServicio,
  comboCuenta,
  comboDependencia,
  listaEspecie,
  comboDetalle,
  comboBien,
  comboOrigenPresupuestosActions,
  comboModalidadesActions,
  comboProveedorActions,
  comboCuentaActions,
  comboServicioActions,
  comboDependenciaActions,
  listadoDeEspeciesBienActions,
  comboDetalleActions

}) => {
  const [step, setStep] = useState<number>(0);
  // Estado para gestionar el servicio seleccionado
  const [servicioSeleccionado, setServicioSeleccionado] = useState<string>();
  const [bienSeleccionado, setBienSeleccionado] = useState<string>();
  const [detalleSeleccionado, setDetalleSeleccionado] = useState<number>();
  const [especieSeleccionado, setEspecieSeleccionado] = useState<string>();
  const [formularios, setFormularios] = useState<FormInventario>({
    datosInventario: {},
    datosCuenta: {},
    datosActivoFijo: {},
  });

  useEffect(() => {
    // Hace todas las llamadas a las api una vez carga el componente padre(FormInventario)
    if (token) {
      // Verifica si las acciones ya fueron disparadas
      if (comboOrigen.length === 0) comboOrigenPresupuestosActions();
      if (comboModalidad.length === 0) comboModalidadesActions();
      if (comboServicio.length === 0) comboServicioActions(objeto.Roles[0].codigoEstablicimiento);
      if (comboBien.length === 0) comboDetalleActions("0");
      if (comboProveedor.length === 0) comboProveedorActions();
    }

    //Carga combo bien con valor 0
    comboDetalleActions("0");
  }, [
    comboOrigenPresupuestosActions,
    comboModalidadesActions,
    comboServicioActions,
    comboDetalleActions,
    comboProveedorActions
  ]);
  // Función para manejar la selección de dependencia en base al servicio seleccionado del componente `DatosCuenta`
  const handleServicioSeleccionado = (codigoServicio: string) => {
    setServicioSeleccionado(codigoServicio);
    // console.log("Código del servicio seleccionado:", codigoServicio);
    comboDependenciaActions(codigoServicio);
  };

  // Función para manejar la selección del detalle en base al bien seleccionado en el componente `DatosCuenta`
  const handleBienSeleccionado = (codigoBien: string) => {
    setBienSeleccionado(codigoBien);
    // console.log("Código del bien seleccionado:", codigoBien);
    comboDetalleActions(codigoBien); // aqui le paso codigo de bien
  };

  // Función para manejar la selección de detalles en el componente `DatosCuenta`
  const handleDetalleSeleccionado = async (codigoDetalle: number) => {
    setDetalleSeleccionado(codigoDetalle);
    // console.log("Código del detalle seleccionado:", codigoDetalle);
    let resultado = await listadoDeEspeciesBienActions(objeto.Roles[0].codigoEstablicimiento, codigoDetalle, ""); // aqui le paso codigo de detalle

    if (!resultado) {
      Swal.fire({
        icon: "warning",
        title: "Sin resultados",
        text: "No se encontró la lista de especies consultada.",
        confirmButtonText: "Ok",
      });
      return;
    };
  }

  // Función para manejar la selección de la especie en el componente `DatosCuenta`
  const handleEspecieSeleccionado = (nombreEspecie: string) => {
    setEspecieSeleccionado(nombreEspecie);
    // console.log("nombre Especie del listado seleccionado:", nombreEspecie);
    comboCuentaActions(nombreEspecie); // aqui le paso codigo de detalle
  };

  const handleNext = (data: Record<string, any>) => {
    // Guardar los datos del formulario actual
    switch (step) {
      case 0:
        setFormularios((prevData) => ({ ...prevData, datosInventario: data }));
        break;
      case 1:
        setFormularios((prevData) => ({ ...prevData, datosCuenta: data }));
        break;
      case 2:
        setFormularios((prevData) => ({ ...prevData, datosActivoFijo: data }));
        break;
      default:
        break;
    }

    // Pasar al siguiente formulario
    if (step < 2) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };
  //Vuelve al primer componente del formularioCompleto(Datos_Inventario)
  const handleReset = () => {
    setFormularios({
      datosInventario: {},
      datosCuenta: {},
      datosActivoFijo: {},
    });
    setStep(0);
  };

  return (
    <Layout>
      <Helmet>
        <title>Registrar Inventario</title>
      </Helmet>
      <MenuInventario />
      <Timeline Formulario_actual={step} />
      {step === 0 && (
        <DatosInventario
          onNext={handleNext}
          comboOrigen={comboOrigen}
          comboModalidad={comboModalidad}
          comboProveedor={comboProveedor}
        />
      )}

      {step === 1 && (
        <DatosCuenta
          onBack={handleBack}
          onNext={handleNext}
          comboServicio={comboServicio}
          comboCuenta={comboCuenta}
          listaEspecie={listaEspecie}
          comboBien={comboBien}
          comboDependencia={comboDependencia}
          comboDetalle={comboDetalle}
          onServicioSeleccionado={handleServicioSeleccionado}
          onBienSeleccionado={handleBienSeleccionado}
          onDetalleSeleccionado={handleDetalleSeleccionado}
          onEspecieSeleccionado={handleEspecieSeleccionado}
          servicioSeleccionado={servicioSeleccionado}
          bienSeleccionado={bienSeleccionado}
          detalleSeleccionado={detalleSeleccionado}
          especieSeleccionado={especieSeleccionado}
        />
      )}

      {step === 2 && (
        <DatosActivoFijo
          onBack={handleBack}
          onNext={handleNext}
          onReset={handleReset}
          formInventario={formularios}
        />
      )}
    </Layout>
  );
};

//mapea los valores del estado global de Redux
const mapStateToProps = (state: RootState) => ({
  token: state.loginReducer.token,
  comboOrigen: state.comboOrigenPresupuestoReducer.comboOrigen,
  comboServicio: state.comboServicioReducer.comboServicio,
  comboModalidad: state.comboModalidadCompraReducer.comboModalidad,
  comboCuenta: state.comboCuentaReducer.comboCuenta,
  comboDependencia: state.comboDependenciaReducer.comboDependencia,
  comboDetalle: state.detallesReducer.comboDetalle,
  comboBien: state.detallesReducer.comboBien,
  comboProveedor: state.comboProveedorReducers.comboProveedor,
  listaEspecie: state.listadoDeEspeciesBienReducers.listadoDeEspecies,
  objeto: state.validaApiLoginReducers
});

export default connect(mapStateToProps, {
  comboServicioActions,
  comboDependenciaActions,
  listadoDeEspeciesBienActions,
  comboDetalleActions,
  comboCuentaActions,
  comboOrigenPresupuestosActions,
  comboModalidadesActions,
  comboProveedorActions
})(FormInventario);
