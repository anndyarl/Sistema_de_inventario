// Importa componentes al FormularioCompleto.tsx
import React, { useState, useEffect } from 'react';
import DatosInventario from '../Inventario/Datos_inventario';
import DatosCuenta from '../Inventario/Datos_cuenta';
import DatosActivoFijo from '../Inventario/Datos_activo_fijo';
import Timeline from './Timeline';

// Redux
import { RootState } from '../../redux/reducers'; 
import { connect } from 'react-redux';

//Actions redux
import { comboOrigenPresupuesto } from '../../redux/actions/combos/comboOrigenPresupuestoActions'; 
import { comboModalidadCompra } from '../../redux/actions/combos/comboModalidadCompraActions';
import { comboServicio } from '../../redux/actions/combos/comboServicioActions'; 

// Importa la interfaz desde Datos_inventario.tsx
import { OrigenPresupuesto } from '../../components/Inventario/Datos_inventario';
import { ModalidadCompra } from '../../components/Inventario/Datos_inventario';
import { Servicio } from '../../components/Inventario/Datos_cuenta';


interface FormData {
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


  token: string | null;
}

const FormularioCompleto: React.FC<FormularioCompletoProps> = ({ origenes, modalidades, servicios, comboOrigenPresupuesto, comboModalidadCompra, comboServicio, token }) => {
  const [step, setStep] = useState<number>(0);
  const [formData, setFormData] = useState<FormData>({
    datosInventario: {},
    datosCuenta: {},
    datosActivoFijo: {},
  });

  useEffect(() => {
       // Llama a la API comboTraeOrigen solo si está vacío
    if (token && origenes.length === 0) {
      comboOrigenPresupuesto(token);         
      console.log("origenes", origenes);      
      }

    if (token && modalidades.length === 0) {
        comboModalidadCompra(token)         
        console.log("modalidades", modalidades);      
      }

    if (token && servicios.length === 0) {
        comboServicio(token)    
        console.log("servicios", servicios);      
      }

      
  }, [comboOrigenPresupuesto, comboModalidadCompra, comboServicio]);
  
 

  const handleNext = (data: Record<string, any>) => {
    // Guardar los datos del formulario actual
    switch (step) {
      case 0:
        setFormData((prevData) => ({ ...prevData, datosInventario: data }));
        break;
      case 1:
        setFormData((prevData) => ({ ...prevData, datosCuenta: data }));
        break;
      case 2:
        setFormData((prevData) => ({ ...prevData, datosActivoFijo: data }));
        break;
      default:
        break;
    }

    // Pasar al siguiente formulario
    if (step === 2) {
      handleSubmit();
    } else {
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
    console.log('Enviando datos:', formData);
    // Ejemplo de llamada a una función de envío
    // submitForm(formData);
  };

  return (
    <div>
      <Timeline Formulario_actual={step} /> 
      {step === 0 && <DatosInventario onNext={handleNext}  origenes={origenes}  modalidades={modalidades} />}
      {step === 1 && <DatosCuenta onNext={handleNext} onBack={handleBack} servicios={servicios} />}
      {step === 2 && <DatosActivoFijo onNext={handleNext} onBack={handleBack}/>}
    </div>
  );
};

//mapea los valores del estado global de Redux 
const mapStateToProps = (state: RootState) => ({
  origenes: state.origenPresupuestoReducer.origenes,
  servicios: state.servicioReducer.servicios,
  modalidades: state.modalidadCompraReducer.modalidades,
  token: state.auth.token
});

export default connect(mapStateToProps,
   {
    comboOrigenPresupuesto, 
    comboServicio,   
    comboModalidadCompra   
    })(FormularioCompleto);
