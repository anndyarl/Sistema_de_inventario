import { useState } from 'react';
import DatosInventario from '../Inventario/Datos_inventario';
import DatosCuenta from '../Inventario/Datos_cuenta';
import DatosActivoFijo from '../Inventario/Datos_activo_fijo';

const FormularioCompleto = () => {
    const [step, setStep] = useState(0);
    const [formData, setFormData] = useState({
        datosInventario: {},
        datosCuenta: {},
        datosActivoFijo: {}
    });

    const handleNext = (data) => {
        // Guardar los datos del formulario actual
        switch (step) {
            case 0:
                setFormData(prevData => ({ ...prevData, datosInventario: data }));
                break;
            case 1:
                setFormData(prevData => ({ ...prevData, datosCuenta: data }));
                break;
            case 2:
                setFormData(prevData => ({ ...prevData, datosActivoFijo: data }));
                break;
            default:
                break;
        }

        // Pasar al siguiente formulario
        if (step == 2) {
            handleSubmit();            
        } else {
            setStep(step + 1);
        }
    };

    const handleSubmit = () => {
        //manejar el envio del formualrio a la API aqui
        console.log('Enviando datos:', formData);
        // Ejemplo de llamada a una función de envío
        // submitForm(formData);
    };

    return (
        <div>
            {step === 0 && <DatosInventario onNext={handleNext} />}
            {step === 1 && <DatosCuenta onNext={handleNext} />}
            {step === 2 && <DatosActivoFijo onNext={handleNext} />}
        </div>
        
    );
};

export default FormularioCompleto;
