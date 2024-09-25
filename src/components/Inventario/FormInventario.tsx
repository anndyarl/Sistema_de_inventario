// Importa componentes al FormularioCompleto.tsx
import React, { useState, useEffect } from 'react';
import Layout from '../../hooks/layout/Layout';
import DatosInventario, { OrigenPresupuesto, ModalidadCompra } from './Datos_inventario';
import DatosCuenta, { Servicio, comboCuentas, Dependencia, Bien, } from './Datos_cuenta';
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
import { comboBien } from '../../redux/actions/combos/comboBienActions';
import { comboDependencia } from '../../redux/actions/combos/comboDependenciaActions';


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
  bien: Bien[];
  comboBien: (token: string) => void
  dependencias: Dependencia[];
  comboDependencia: (servicioSeleccionado: number) => void;


  token: string | null;
}

const FormInventario: React.FC<FormInventarioProps> = ({ origenes, modalidades, servicios, comboCuentas, bien, dependencias, comboOrigenPresupuesto, comboModalidadCompra, comboServicio, comboCuenta, comboBien, comboDependencia, token }) => {
  const [step, setStep] = useState<number>(0);
  // Estado para almacenar el valor seleccionado del servicio
  const [servicioSeleccionado, setServicioSeleccionado] = useState<number | null>(null);

  const [formularios, setFormularios] = useState<FormInventario>({
    datosInventario: {},
    datosCuenta: {},
    datosActivoFijo: {},
  });



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

    if (token && bien.length === 0) {
      comboBien(token);
    }

    if (servicioSeleccionado !== null && dependencias.length === 0) {
      comboDependencia(servicioSeleccionado);
      console.log("seleccionado desde formInventario", servicioSeleccionado)
    }


  }, [comboOrigenPresupuesto, comboModalidadCompra, comboServicio, comboDependencia]);


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
        {step === 0 && <DatosInventario onNext={handleNext} origenes={origenes} modalidades={modalidades} />}
        {step === 1 && <DatosCuenta onBack={handleBack} onNext={handleNext} servicios={servicios} comboCuentas={comboCuentas} bien={bien} dependencias={dependencias} />}
        {step === 2 && <DatosActivoFijo onBack={handleBack} onNext={handleNext} formInventario={formularios} onReset={handleReset} />}
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
  bien: state.bienReducer.bien,
  dependencias: state.dependenciaReducer.dependencias,
  token: state.auth.token
});

export default connect(mapStateToProps,
  {
    comboOrigenPresupuesto,
    comboServicio,
    comboModalidadCompra,
    comboCuenta,
    comboBien,
    comboDependencia
  })(FormInventario);
