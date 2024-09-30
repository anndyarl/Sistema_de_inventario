// Importa componentes al FormularioCompleto.tsx
import React, { useState, useEffect } from 'react';
import Layout from '../../hooks/layout/Layout';
import DatosInventario, { OrigenPresupuesto, ModalidadCompra } from './Datos_inventario';
import DatosCuenta, { Servicio, comboCuentas, Dependencia, ListaEspecie, Bien, Detalles } from './Datos_cuenta';
import DatosActivoFijo from './Datos_activo_fijo';
import Timeline from './Timeline';

// Redux global
import { RootState } from '../../redux/reducers';
import { connect } from 'react-redux';

//Actions redux
import { comboOrigenPresupuesto } from '../../redux/actions/combos/comboOrigenPresupuestoActions';
import { comboModalidadCompra } from '../../redux/actions/combos/comboModalidadCompraActions';
import { comboServicio } from '../../redux/actions/combos/comboServicioActions';
import { comboCuenta } from '../../redux/actions/combos/comboCuentaActions';
// import { comboBien } from '../../redux/actions/combos/comboBienActions.tsx.old';
import { comboDependencia } from '../../redux/actions/combos/comboDependenciaActions';
import { comboListadoDeEspeciesBien } from '../../redux/actions/combos/comboListadoDeEspeciesBienActions';
import { comboDetalles } from '../../redux/actions/combos/comboDetallesActions';



export interface FormInventario {
  datosInventario: Record<string, any>;
  datosCuenta: Record<string, any>;
  datosActivoFijo: Record<string, any>;
}

interface FormInventarioProps {
  //Trae props combos de Datos_inventario(formulario 1) 
  origenes: OrigenPresupuesto[];
  comboOrigenPresupuesto: (token: string) => void;
  modalidades: ModalidadCompra[];
  comboModalidadCompra: (token: string) => void;

  //Trae props combos de Datos_cuenta(formulario 2)
  servicios: Servicio[];
  comboServicio: (token: string) => void
  comboCuentas: comboCuentas[];
  comboCuenta: (token: string) => void
  dependencias: Dependencia[];
  comboDependencia: (servicioSeleccionado: string) => void;

  bien: Bien[];
  detalles: Detalles[];
  comboDetalles: (bienSeleccionado: string) => void

  listaEspecie: ListaEspecie[];
  comboListadoDeEspeciesBien: (EST: number, IDBIEN: string) => Promise<void>;

  token: string | null;
}

const FormInventario: React.FC<FormInventarioProps> = ({ origenes, modalidades, servicios, comboCuentas, listaEspecie, dependencias, bien, detalles, comboOrigenPresupuesto, comboModalidadCompra, comboServicio, comboCuenta, comboDependencia, comboListadoDeEspeciesBien, comboDetalles, token }) => {
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

  // Función para manejar la selección de servicio en el componente `DatosCuenta`
  const handleServicioSeleccionado = (codigoServicio: string) => {
    setServicioSeleccionado(codigoServicio);
    // console.log("Código del servicio seleccionado:", codigoServicio);
    comboDependencia(codigoServicio);
  };

  // Función para manejar la selección de bien en el componente `DatosCuenta`
  const handleBienSeleccionado = (codigoBien: string) => {
    setBienSeleccionado(codigoBien);
    console.log("Código del bien seleccionado:", codigoBien);
    comboDetalles(codigoBien); // aqui le paso codigo de bien
  };

  // Función para manejar la selección de detalles en el componente `DatosCuenta`
  const handleDetalleSeleccionado = (codigoDetalle: string) => {
    setDetalleSeleccionado(codigoDetalle);
    console.log("Código del detalle seleccionado:", codigoDetalle);

    comboListadoDeEspeciesBien(1, codigoDetalle); // aqui le paso codigo de detalle

  };

  useEffect(() => {
    // llamadas a las api inmediatamente que carga pagina Inventario
    if (token && origenes.length === 0) {
      comboOrigenPresupuesto(token);
    }

    if (token && modalidades.length === 0) {
      comboModalidadCompra(token);
    }

    if (token && servicios.length === 0) {
      comboServicio(token);
    }

    if (token && comboCuentas.length === 0) {
      comboCuenta(token);
    }

    //Carga combo bien con valor 0
    if (token && detalles.length === 0) {
      comboDetalles("0");
    }

    console.log("listadoEspecies en Datos_cuenta:", listaEspecie);
  }, [comboOrigenPresupuesto, comboModalidadCompra, comboServicio, comboListadoDeEspeciesBien]);


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
          origenes={origenes}
          modalidades={modalidades} />}

        {step === 1 && <DatosCuenta
          // Props para volver y avanzar
          onBack={handleBack}
          onNext={handleNext}
          //Lista combos
          servicios={servicios}
          comboCuentas={comboCuentas}
          listaEspecie={listaEspecie}
          bien={bien}
          dependencias={dependencias}
          detalles={detalles}

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
  origenes: state.origenPresupuestoReducer.origenes,
  servicios: state.servicioReducer.servicios,
  modalidades: state.modalidadCompraReducer.modalidades,
  comboCuentas: state.cuentaReducer.comboCuentas,
  dependencias: state.dependenciaReducer.dependencias,
  listaEspecie: state.comboListadoDeEspeciesBien.listadoDeEspecies,
  detalles: state.detallesReducer.detalles,
  token: state.auth.token
});

export default connect(mapStateToProps,
  {
    comboOrigenPresupuesto,
    comboServicio,
    comboModalidadCompra,
    comboCuenta,
    comboDependencia,
    comboListadoDeEspeciesBien,
    comboDetalles
  })(FormInventario);
