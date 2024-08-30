import React, { useState } from 'react';
import DatosInventario from '../Inventario/Datos_inventario';
import DatosCuenta from '../Inventario/Datos_cuenta';
import DatosActivoFijo from '../Inventario/Datos_activo_fijo';
import Timeline from './Timeline'; // Asegúrate de importar el componente Timeline

interface FormData {
  datosInventario: Record<string, any>;
  datosCuenta: Record<string, any>;
  datosActivoFijo: Record<string, any>;
}

// Simula la función `comboTraeOrigen`
const mockComboTraeOrigen = async (token: string) => {
  // Aquí simulas la llamada a la API que devuelve los datos esperados
  return [
    { codigo: '001', descripcion: 'Presupuesto 1' },
    { codigo: '002', descripcion: 'Presupuesto 2' }
  ];
};

const FormularioCompleto: React.FC = () => {
  const [step, setStep] = useState<number>(0);
  const [formData, setFormData] = useState<FormData>({
    datosInventario: {},
    datosCuenta: {},
    datosActivoFijo: {},
  });

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
      {step === 0 && <DatosInventario onNext={handleNext} comboTraeOrigen={mockComboTraeOrigen} />}
      {step === 1 && <DatosCuenta onNext={handleNext} />}
      {step === 2 && <DatosActivoFijo onNext={handleNext} />}
    </div>
  );
};

export default FormularioCompleto;
