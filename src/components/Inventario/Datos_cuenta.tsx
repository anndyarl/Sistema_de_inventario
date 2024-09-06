import 'bootstrap/dist/css/bootstrap.min.css'; 

import React, { useState } from 'react'; 


// Define el tipo de los elementos del combo `servicio`
export interface Servicio {
    codigo: string;
    nombrE_ORD: string;
    descripcion: string;
  }

// Define el tipo de props para el componente
interface Datos_cuentaProps {
    onNext: (data: any) => void;
    onBack: () => void; 
    servicios: Servicio[];   
}

const Datos_cuenta: React.FC<Datos_cuentaProps> = ({ onNext, onBack, servicios }) => {
    const [data, setData] = useState({
        servicio: '',
        dependencia: '',
        especie: '',
        cuenta: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        const { name, value } = e.target;
        setData(prevData => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onNext(data);
    };

    const handleBack = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();   
        onBack();
      };


  

    return (
            <form onSubmit={handleSubmit}>
                
                <div className="border-top p-1 rounded">
                    <div>
                        <h3 className="form-title">Datos Cuenta</h3>
                    </div>
                    <div className="mt-4 border-top">
                        <dl className="row">                           
                            <div className="col-sm-12 col-md-4 mb-3">
                            <dt className="text-muted">Servicio</dt>
                            <dd className="d-flex align-items-center">
                                <select className="form-select" name="servicio" onChange={handleChange}>
                                <option value="">Seleccione un origen</option>
                                {servicios.map((servicio) => (
                                    <option key={servicio.codigo} value={servicio.codigo}>
                                    {servicio.nombrE_ORD} 
                                    </option>
                                ))}
                                </select>
                            </dd>
                            </div> 
                            <div className="col-sm-12 col-md-4 mb-3">
                                <dt className="text-muted">Dependencia</dt>
                                <dd className="d-flex align-items-center">
                                    <select name="dependencia" className="form-select" onChange={handleChange} value={data.dependencia}>
                                        <option value="">Selecciona una opción</option>
                                        <option value="backend">Backend Developer</option>
                                        <option value="frontend">Frontend Developer</option>
                                        <option value="fullstack">Full Stack Developer</option>
                                    </select>
                                </dd>
                            </div>
                            <div className="col-sm-12 col-md-4 mb-3">
                                <dt className="text-muted">Cuenta</dt>
                                <dd className="d-flex align-items-center">
                                    <select name="cuenta" className="form-select" onChange={handleChange} value={data.cuenta}>
                                        <option value="">Selecciona una opción</option>
                                        <option value="backend">Backend Developer</option>
                                        <option value="frontend">Frontend Developer</option>
                                        <option value="fullstack">Full Stack Developer</option>
                                    </select>
                                </dd>
                            </div>           
                            <div className="col-sm-12 col-md-6 mb-3">
                                <dt className="text-muted">Especie</dt>
                                <dd className="d-flex align-items-center">
                                    <input type="file" name="especie" className="form-control" onChange={(e) => handleChange(e as any)} />
                                </dd>
                            </div>
                                           
                        </dl>
                    </div>
                </div>
                <div className="p-1 rounded bg-white d-flex justify-content-between">              
                      <button onClick={handleBack} className="btn btn-primary m-1">Volver</button> 
                      <button type="submit" className="btn btn-primary m-1">Siguiente</button>                
                </div>
            </form>
    );
};



export default (Datos_cuenta);
