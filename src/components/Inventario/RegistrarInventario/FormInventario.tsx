// Importa componentes al FormularioCompleto.tsx
import React, { useState } from "react";
import Layout from "../../../containers/hocs/layout/Layout";
import DatosInventario, { ORIGEN, MODALIDAD, PROVEEDOR } from "./Datos_inventario";
import DatosCuenta, {
  SERVICIO,
  CUENTA,
  DEPENDENCIA,
  ListaEspecie,
  BIEN,
  DETALLE,
} from "./Datos_cuenta";
import DatosActivoFijo from "./Datos_activo_fijo";
import Timeline from "./Timeline";

// Redux global
import { RootState } from "../../../redux/reducers";
import { connect } from "react-redux";
import { comboServicioActions } from "../../../redux/actions/Inventario/Combos/comboServicioActions";
import { comboDependenciaActions } from "../../../redux/actions/Inventario/Combos/comboDependenciaActions";
import { comboListadoDeEspeciesBienActions } from "../../../redux/actions/Inventario/Combos/comboListadoDeEspeciesBienActions";
import { comboDetalleActions } from "../../../redux/actions/Inventario/Combos/comboDetalleActions";
import { comboCuentaActions } from "../../../redux/actions/Inventario/Combos/comboCuentaActions";
import MenuInventario from "../../Menus/MenuInventario";

export interface FormInventario {
  datosInventario: Record<string, any>;
  datosCuenta: Record<string, any>;
  datosActivoFijo: Record<string, any>;
}

interface FormInventarioProps {
  //Trae props combos de Datos_inventario(formulario 1)
  comboOrigen: ORIGEN[];
  comboModalidad: MODALIDAD[];
  comboProveedor: PROVEEDOR[];

  //Trae props combos de Datos_cuenta(formulario 2)
  comboServicio: SERVICIO[];
  comboServicioActions: () => void;
  comboCuenta: CUENTA[];
  comboCuentaActions: (nombreEspecie: string) => void;
  comboDependencia: DEPENDENCIA[];
  comboDependenciaActions: (servicioSeleccionado: string) => void;

  comboBien: BIEN[];
  comboDetalle: DETALLE[];
  comboDetalleActions: (bienSeleccionado: string) => void;

  listaEspecie: ListaEspecie[];
  comboListadoDeEspeciesBienActions: (EST: number, IDBIEN: string) => Promise<void>;
}

const FormInventario: React.FC<FormInventarioProps> = ({
  comboOrigen,
  comboModalidad,
  comboProveedor,
  comboServicio,
  comboCuenta,
  comboDependencia,
  listaEspecie,
  comboDetalle,
  comboBien,
  comboCuentaActions,
  comboDependenciaActions,
  comboListadoDeEspeciesBienActions,
  comboDetalleActions

}) => {
  const [step, setStep] = useState<number>(0);
  // Estado para gestionar el servicio seleccionado
  const [servicioSeleccionado, setServicioSeleccionado] = useState<string>();
  const [bienSeleccionado, setBienSeleccionado] = useState<string>();
  const [detalleSeleccionado, setDetalleSeleccionado] = useState<string>();
  const [especieSeleccionado, setEspecieSeleccionado] = useState<string>();
  const [formularios, setFormularios] = useState<FormInventario>({
    datosInventario: {},
    datosCuenta: {},
    datosActivoFijo: {},
  });


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
  const handleDetalleSeleccionado = (codigoDetalle: string) => {
    setDetalleSeleccionado(codigoDetalle);
    // console.log("Código del detalle seleccionado:", codigoDetalle);
    comboListadoDeEspeciesBienActions(1, codigoDetalle); // aqui le paso codigo de detalle
  };

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

      <MenuInventario />

      <div className="container mt-2">
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
      </div>

    </Layout>
  );
};

//mapea los valores del estado global de Redux
const mapStateToProps = (state: RootState) => ({
  comboOrigen: state.origenPresupuestoReducer.comboOrigen,
  comboServicio: state.comboServicioReducer.comboServicio,
  comboModalidad: state.modalidadCompraReducer.comboModalidad,
  comboCuenta: state.comboCuentaReducer.comboCuenta,
  comboDependencia: state.comboDependenciaReducer.comboDependencia,
  comboDetalle: state.detallesReducer.comboDetalle,
  comboBien: state.detallesReducer.comboBien,
  comboProveedor: state.comboProveedorReducers.comboProveedor,
  listaEspecie: state.comboListadoDeEspeciesBien.listadoDeEspecies,
});

export default connect(mapStateToProps, {
  comboServicioActions,
  comboDependenciaActions,
  comboListadoDeEspeciesBienActions,
  comboDetalleActions,
  comboCuentaActions,
})(FormInventario);
