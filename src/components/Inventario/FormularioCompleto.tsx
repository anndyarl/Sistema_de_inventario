// Importa componentes al FormularioCompleto.tsx
import React, { useState, useEffect } from 'react';
import DatosInventario from '../Inventario/Datos_inventario';
import DatosCuenta, { Bien } from '../Inventario/Datos_cuenta';
import DatosActivoFijo from '../Inventario/Datos_activo_fijo';
import Timeline from './Timeline';

// Redux
import { RootState } from '../../redux/reducers';
import { connect } from 'react-redux';

//Actions redux
import { comboOrigenPresupuesto } from '../../redux/actions/combos/comboOrigenPresupuestoActions';
import { comboModalidadCompra } from '../../redux/actions/combos/comboModalidadCompraActions';
import { comboServicio } from '../../redux/actions/combos/comboServicioActions';
import { comboCuenta } from '../../redux/actions/combos/comboCuentaActions';

// Importa la interfaz desde Datos_inventario.tsx
import { OrigenPresupuesto } from '../../components/Inventario/Datos_inventario';
import { ModalidadCompra } from '../../components/Inventario/Datos_inventario';
import { Servicio } from '../../components/Inventario/Datos_cuenta';
import { comboCuentas } from '../../components/Inventario/Datos_cuenta';

import Layout from '../../hooks/layout/Layout';
import { comboBien } from '../../redux/actions/combos/comboBienActions';


export interface FormularioCompleto {
  datosInventario: Record<string, any>;
  datosCuenta: Record<string, any>;
  datosActivoFijo: Record<string, any>;
}

interface FormularioCompletoProps {
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

  token: string | null;
}

const FormularioCompleto: React.FC<FormularioCompletoProps> = ({ origenes, modalidades, servicios, comboCuentas, bien, comboOrigenPresupuesto, comboModalidadCompra, comboServicio, comboCuenta, comboBien, token }) => {
  const [step, setStep] = useState<number>(0);
  const [formularios, setFormualarios] = useState<FormularioCompleto>({
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


  }, [comboOrigenPresupuesto, comboModalidadCompra, comboServicio]);



  const handleNext = (data: Record<string, any>) => {
    // Guardar los datos del formulario actual
    switch (step) {
      case 0:
        setFormualarios((prevData) => ({ ...prevData, datosInventario: data }));
        break;
      case 1:
        setFormualarios((prevData) => ({ ...prevData, datosCuenta: data }));
        break;
      case 2:
        setFormualarios((prevData) => ({ ...prevData, datosActivoFijo: data }));
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

  const handleSubmit = () => {
    // Manejar el envío del formulario a la API aquí
    console.log('Enviando datos:', formularios);
    // Ejemplo de llamada a una función de envío
    // submitForm(formData);
  };

  return (
    <Layout>
      <div className="container">
        <Timeline Formulario_actual={step} />
        {step === 0 && <DatosInventario onNext={handleNext} origenes={origenes} modalidades={modalidades} />}
        {step === 1 && <DatosCuenta onBack={handleBack} onNext={handleNext} servicios={servicios} comboCuentas={comboCuentas} bien={bien} />}
        {step === 2 && <DatosActivoFijo onBack={handleBack} onNext={handleNext} formularioCompleto={formularios} />}
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
  token: state.auth.token
});

export default connect(mapStateToProps,
  {
    comboOrigenPresupuesto,
    comboServicio,
    comboModalidadCompra,
    comboCuenta,
    comboBien
  })(FormularioCompleto);
