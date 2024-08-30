// Timeline.tsx
import React from 'react';
import '../../styles/Timeline.css';

interface TimelineProps {
  Formulario_actual: number;
}

const Timeline: React.FC<TimelineProps> = ({ Formulario_actual }) => {
  //Defino mi arreglo
  const formularios = ["Datos Inventario", "Datos Cuenta", "Datos Activo Fijo"];

  return (   
      //mapeamos el arreglo(formulario) en un indice pasa saber su posicion, con un nombre(formulario) para identificarlo
   <div className="timeline">
  {formularios.map((formulario, index) => (
    <React.Fragment key={index}>
      {/* Icono del paso */}
      <div className={`timeline-step ${Formulario_actual >= index ? 'completed' : ''}`}>
        <div className={`timeline-icon ${Formulario_actual >= index ? 'completed' : ''}`}>
          {index + 1}
        </div>
      </div>

      {/* Conector entre pasos */}
      {index < formularios.length - 1 && (
        <div
          className={`timeline-connector ${Formulario_actual > index ? 'active' : ''}`}
        ></div>
      )}
    </React.Fragment>
  ))}
</div>
  );
};

export default Timeline;
