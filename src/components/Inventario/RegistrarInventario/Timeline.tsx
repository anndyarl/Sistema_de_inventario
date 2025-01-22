// Timeline.tsx
import React from 'react';
import '../../../styles/Timeline.css';
import { RootState } from '../../../store';
import { connect } from 'react-redux';

interface TimelineProps {
  Formulario_actual: number;
  isDarkMode: boolean;
}

const Timeline: React.FC<TimelineProps> = ({ Formulario_actual, isDarkMode }) => {
  //Defino mi arreglo
  const formularios = ["Registro Inventario", "Detalles Inventario", "Detalles Activo"];

  return (
    //mapeamos el arreglo(formulario) en un indice pasa saber su posicion, con un nombre(formulario) para identificarlo
    <div className="timeline">
      {formularios.map((_, index) => (

        <React.Fragment key={index}>
          {/* Icono del paso */}
          <div className={`timeline-step ${Formulario_actual >= index ? 'completed' : ''}`}>
            <div className={` ${isDarkMode ? "timeline-icon darkMode" : "timeline-icon"} ${Formulario_actual >= index ? 'completed' : ''}`}>
              {index + 1}
            </div>
          </div>

          {/* Conector entre pasos */}
          {index < formularios.length - 1 && (
            <div className={`timeline-connector ${Formulario_actual > index ? 'active' : ''}`}></div>

          )}

        </React.Fragment>

      ))}

    </div>

  );
};

//mapea los valores del estado global de Redux
const mapStateToProps = (state: RootState) => ({
  isDarkMode: state.darkModeReducer.isDarkMode
});

export default connect(mapStateToProps, {
})(Timeline);

