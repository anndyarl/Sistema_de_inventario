// FormularioCompleto.tsx
import React, { useState, useEffect } from 'react';
import DatosInventario from '../Inventario/Datos_inventario';
import DatosCuenta from '../Inventario/Datos_cuenta';
import DatosActivoFijo from '../Inventario/Datos_activo_fijo';
import Timeline from './Timeline';

// Redux
import { connect } from 'react-redux';
import { comboTraeOrigen } from '../../redux/actions/combos/comboTraeOrigenActions'; 
import { comboTraeServicio } from '../../redux/actions/combos/comboTraeServicioActions'; 
import { RootState } from '../../redux/reducers'; 
import { setNRecepcion } from '../../redux/actions/Inventario/Datos_inventariosActions';

// Importa la interfaz OrigenPresupuesto desde Datos_inventario.tsx
import { OrigenPresupuesto } from '../../components/Inventario/Datos_inventario';
import { Servicio } from '../../components/Inventario/Datos_cuenta';
import { InventarioProps } from '../../components/Inventario/Datos_inventario';

interface FormData {
  datosInventario: Record<string, any>;
  datosCuenta: Record<string, any>;
  datosActivoFijo: Record<string, any>;
}

interface FormularioCompletoProps {
  //Trae props OrigenPresupuesto de Datos_inventario(formulario 1) 
  origenes: OrigenPresupuesto[];  
  comboTraeOrigen: (token: string) => void;

  //Trae props Servicio de Datos_cuenta(formulario 2)
  servicios: Servicio[];  
  comboTraeServicio: (token: string) => void
  token: string | null; 
 
  //trae props InventarioProps de Datos_inventario(formulario 1) 
  nRecepcion: string;
}

const FormularioCompleto: React.FC<FormularioCompletoProps> = ({ origenes, servicios, comboTraeOrigen, comboTraeServicio, nRecepcion, token }) => {
  const [step, setStep] = useState<number>(0);
  const [formData, setFormData] = useState<FormData>({
    datosInventario: {},
    datosCuenta: {},
    datosActivoFijo: {},
  });

  useEffect(() => {
       // Llama a la API comboTraeOrigen solo si está vacío
    if (token && origenes.length === 0) {
      comboTraeOrigen(token);
      console.log("Token local:", token)      
      console.log("origenes", origenes);      
      }

      if (token && servicios.length === 0) {
        comboTraeServicio(token)
        console.log("Token local:", token)      
        console.log("servicios", servicios);      
        }
  }, [comboTraeOrigen, comboTraeServicio]);
  
 

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

  const handleSubmit = () => {
    // Manejar el envío del formulario a la API aquí
    console.log('Enviando datos:', formData);
    // Ejemplo de llamada a una función de envío
    // submitForm(formData);
  };

  return (
    <div>
      <Timeline Formulario_actual={step} /> 
      {step === 0 && <DatosInventario onNext={handleNext} origenes={origenes}   />}
      {step === 1 && <DatosCuenta onNext={handleNext} servicios={servicios} />}
      {step === 2 && <DatosActivoFijo onNext={handleNext} nRecepcion={nRecepcion}/>}
    </div>
  );
};

//mapea los valores del estado global de Redux 
const mapStateToProps = (state: RootState) => ({
  origenes: state.origenPresupuestoReducer.origenes,
  servicios: state.servicioReducer.servicios,
  token: state.auth.token,
  nRecepcion: state.datos_inventarioReducer.nRecepcion
});

export default connect(mapStateToProps,
   {
     comboTraeOrigen, 
     comboTraeServicio,
     setNRecepcion 
    })(FormularioCompleto);
