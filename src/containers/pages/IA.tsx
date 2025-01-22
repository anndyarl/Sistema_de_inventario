import React, { useState, useEffect } from 'react';
import Layout from "../hocs/layout/Layout";
import { Button, Spinner, Alert } from 'react-bootstrap';
import { connect } from 'react-redux';
import { RootState } from '../../store';
// import { preguntaActions } from '../../redux/actions/Otros/preguntaActions.tsx.old';

interface Props {
  isDarkMode: boolean;
  preguntaActions: (pregunta: string) => void;
  respuestaIA: string; // Suponiendo que la respuesta de la IA se almacena en Redux
  loadingIA: boolean; // Para controlar el estado de carga de la IA
  errorIA: string | null; // Para manejar errores
}

const IA: React.FC<Props> = ({ isDarkMode, preguntaActions, respuestaIA, loadingIA, errorIA }) => {
  const [ia, setIa] = useState({
    pregunta: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setIa((preIa) => ({
      ...preIa,
      [name]: value,
    }));
  };

  const handleAsk = async () => {
    preguntaActions(ia.pregunta); // Llamar a la acción para preguntar a la IA
  };

  return (
    <Layout>
      <div>
        <h1>Consultas con IA - Inventario</h1>
        <input
          type="text"
          placeholder="Haz una pregunta sobre el inventario"
          value={ia.pregunta} // Mostrar el valor actual de la pregunta
          name="pregunta"
          onChange={handleChange}
          className="form-control mb-2"
        />

        <Button
          onClick={handleAsk}
          className={`btn btn-primary text-center mb-2 border-0 ${isDarkMode ? "bg-secondary" : "bg-primary"}`}
          disabled={loadingIA}
        >
          {loadingIA ? (
            <>
              Consultando...
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
                className="ms-1"
              />
            </>
          ) : (
            'Consultar IA'
          )}
        </Button>

        {errorIA && <Alert variant="danger">{errorIA}</Alert>} {/* Mostrar error si existe */}

        <div>
          <h2>Respuesta de la IA:</h2>
          <p>{respuestaIA || "Esperando respuesta..."}</p> {/* Mostrar la respuesta o un mensaje de espera */}
        </div>
      </div>
    </Layout>
  );
};

const mapStateToProps = (state: RootState) => ({
  isAuthenticated: state.loginReducer.isAuthenticated,
  isDarkMode: state.darkModeReducer.isDarkMode,
  respuestaIA: state.respuestaReducer.respuestaIA, // Suponiendo que la respuesta se guarda en estado
  loadingIA: state.respuestaReducer.loading, // Estado de carga de la IA
  errorIA: state.respuestaReducer.error, // Estado de error de la IA
});

export default connect(mapStateToProps, {
  // preguntaActions
})(IA);
