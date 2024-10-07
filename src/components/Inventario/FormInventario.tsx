// Importa componentes al FormularioCompleto.tsx
import React, { useState, useEffect } from 'react';
import Layout from '../../hooks/layout/Layout';
import DatosInventario, { ORIGEN, MODALIDAD } from './Datos_inventario';
import DatosCuenta, { SERVICIO, CUENTA, DEPENDENCIA, ListaEspecie, BIEN, DETALLE } from './Datos_cuenta';
import DatosActivoFijo from './Datos_activo_fijo';
import Timeline from './Timeline';

// Redux global
import { RootState } from '../../redux/reducers';
import { connect } from 'react-redux';

//Actions redux
import { comboOrigenPresupuestosActions } from '../../redux/actions/combos/comboOrigenPresupuestoActions';
import { comboModalidadesActions } from '../../redux/actions/combos/comboModalidadCompraActions';
import { comboServicioActions } from '../../redux/actions/combos/comboServicioActions';
import { comboCuentaActions } from '../../redux/actions/combos/comboCuentaActions';
import { comboDependenciaActions } from '../../redux/actions/combos/comboDependenciaActions';
import { comboListadoDeEspeciesBienActions } from '../../redux/actions/combos/comboListadoDeEspeciesBienActions';
import { comboDetalleActions } from '../../redux/actions/combos/comboDetalleActions';



export interface FormInventario {
  datosInventario: Record<string, any>;
  datosCuenta: Record<string, any>;
  datosActivoFijo: Record<string, any>;
}

interface FormInventarioProps {
  //Trae props combos de Datos_inventario(formulario 1) 
  comboOrigen: ORIGEN[];
  comboOrigenPresupuestosActions: (token: string) => void;
  comboModalidad: MODALIDAD[];

  comboModalidadesActions: (token: string) => void;

  //Trae props combos de Datos_cuenta(formulario 2)
  comboServicio: SERVICIO[];
  comboServicioActions: (token: string) => void
  comboCuenta: CUENTA[];
  comboCuentaActions: (token: string) => void
  comboDependencia: DEPENDENCIA[];
  comboDependenciaActions: (servicioSeleccionado: string) => void;

  comboBien: BIEN[];
  comboDetalle: DETALLE[];
  comboDetalleActions: (bienSeleccionado: string) => void

  listaEspecie: ListaEspecie[];
  comboListadoDeEspeciesBienActions: (EST: number, IDBIEN: string) => Promise<void>;

  token: string | null;
}

const FormInventario: React.FC<FormInventarioProps> = ({ comboOrigen, comboModalidad, comboServicio, comboCuenta, comboDependencia, listaEspecie, comboDetalle, comboBien, comboOrigenPresupuestosActions, comboModalidadesActions, comboServicioActions, comboCuentaActions, comboDependenciaActions, comboListadoDeEspeciesBienActions, comboDetalleActions, token }) => {
  const [step, setStep] = useState<number>(0);
  // Estado para gestionar el servicio seleccionado
  const [servicioSeleccionado, setServicioSeleccionado] = useState<string>();
  const [bienSeleccionado, setBienSeleccionado] = useState<string>();
  const [detalleSeleccionado, setDetalleSeleccionado] = useState<string>();


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
    console.log("Código del bien seleccionado:", codigoBien);
    comboDetalleActions(codigoBien); // aqui le paso codigo de bien
  };

  // Función para manejar la selección de detalles en el componente `DatosCuenta`
  const handleDetalleSeleccionado = (codigoDetalle: string) => {
    setDetalleSeleccionado(codigoDetalle);
    console.log("Código del detalle seleccionado:", codigoDetalle);

    comboListadoDeEspeciesBienActions(1, codigoDetalle); // aqui le paso codigo de detalle

  };

  useEffect(() => {
    // Hace todas las llamadas a las api una vez carga el componente padre(FormInventario)

    if (token) {
      // Verifica si las acciones ya fueron disparadas
      if (comboOrigen.length === 0) comboOrigenPresupuestosActions(token);
      if (comboModalidad.length === 0) comboModalidadesActions(token);
      if (comboServicio.length === 0) comboServicioActions(token);
      if (comboCuenta.length === 0) comboCuentaActions(token);
      if (comboBien.length === 0) comboDetalleActions("0");
    }

    //Carga combo bien con valor 0 
    comboDetalleActions("0");

    console.log("listadoEspecies en Datos_cuenta:", listaEspecie);
  }, [comboOrigenPresupuestosActions, comboModalidadesActions, comboServicioActions, comboCuentaActions, comboDetalleActions, comboListadoDeEspeciesBienActions]);


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
      <div className="container">
        <Timeline Formulario_actual={step} />

        {step === 0 && <DatosInventario
          // Props para avanzar
          onNext={handleNext}
          //Lista combos
          comboOrigen={comboOrigen}
          comboModalidad={comboModalidad}
        />}

        {step === 1 && <DatosCuenta
          // Props para volver y avanzar
          onBack={handleBack}
          onNext={handleNext}
          //Lista combos
          comboServicio={comboServicio}
          comboCuenta={comboCuenta}
          listaEspecie={listaEspecie}
          comboBien={comboBien}
          comboDependencia={comboDependencia}
          comboDetalle={comboDetalle}


          //Props desde Datos_cuentas
          onServicioSeleccionado={handleServicioSeleccionado}
          onBienSeleccionado={handleBienSeleccionado}
          onDetalleSeleccionado={handleDetalleSeleccionado}

          //Estados seleccionados desde Datos_cuenta
          servicioSeleccionado={servicioSeleccionado}
          bienSeleccionado={bienSeleccionado}
          detalleSeleccionado={detalleSeleccionado} />}

        {step === 2 && <DatosActivoFijo
          // Props para volver y avanzar
          onBack={handleBack}
          onNext={handleNext}
          onReset={handleReset}
          //Props fomrulario completo
          formInventario={formularios} />}

      </div>
    </Layout>
  );
};

//mapea los valores del estado global de Redux 
const mapStateToProps = (state: RootState) => ({
  token: state.auth.token,
  comboOrigen: state.origenPresupuestoReducer.comboOrigen,
  comboServicio: state.comboServicioReducer.comboServicio,
  comboModalidad: state.modalidadCompraReducer.comboModalidad,
  comboCuenta: state.comboCuentaReducer.comboCuenta,
  comboDependencia: state.comboDependenciaReducer.comboDependencia,
  comboDetalle: state.detallesReducer.comboDetalle,
  comboBien: state.detallesReducer.comboBien,
  listaEspecie: state.comboListadoDeEspeciesBien.listadoDeEspecies,
});

export default connect(mapStateToProps,
  {
    comboOrigenPresupuestosActions,
    comboModalidadesActions,
    comboServicioActions,
    comboDependenciaActions,
    comboListadoDeEspeciesBienActions,
    comboDetalleActions,
    comboCuentaActions,

  })(FormInventario);
