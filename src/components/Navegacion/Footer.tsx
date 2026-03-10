import { Info } from 'react-bootstrap-icons';
import { RootState } from '../../store';
import { connect } from 'react-redux';
import { Modal } from 'react-bootstrap';
import { useState } from "react";
import Preferencias from '../Configuracion/Preferencias'; // Importamos Preferencias
import { ListaVersionamiento } from '../Configuracion/Versionamiento';



interface Props {
    isDarkMode: boolean;
    listaVersionamiento: ListaVersionamiento[];
    activo?: string;
}

const Footer: React.FC<Props> = ({ listaVersionamiento, isDarkMode, activo = "Versionamiento" }) => {
    const Ambiente = import.meta.env.VITE_AMBIENTE;
    const [mostrarModal, setMostrarModal] = useState(false);

    const version = listaVersionamiento[0]?.numerO_VERSION || "";

    return (
        <>
            <footer className={`p-3 ${isDarkMode ? "bg-color-dark" : "bg-light"} border-top`}>
                <div className="d-flex align-items-center">
                    <p className='fs-09em'>
                        <Info width={22} height={22} aria-hidden="true" />
                        Copyright © 2025 Todos los derechos reservados SSMSO.
                        <b className='text-warning'>{Ambiente}</b>
                        <a
                            onClick={() => setMostrarModal(true)}
                            className={`fw-normal mx-1 text-decoration-none`}
                            style={{ cursor: "pointer" }}
                        >
                            <b className={`fw-semibold ${isDarkMode ? "text-white" : "text-dark"}`}>
                                {version}
                            </b>
                        </a>
                    </p>
                </div>
            </footer>

            <Modal size="xl" show={mostrarModal} onHide={() => setMostrarModal(false)}>
                <Modal.Header className={`${isDarkMode ? "darkModePrincipal" : ""}`} closeButton>
                    <Modal.Title>Preferencias</Modal.Title>
                </Modal.Header>
                <Modal.Body className={`${isDarkMode ? "darkModePrincipal" : ""}`}>
                    {/* Usamos el componente Preferencias directamente */}
                    <Preferencias isDarkMode={isDarkMode} activo={activo} />
                </Modal.Body>
            </Modal>
        </>
    );
};

const mapStateToProps = (state: RootState) => ({
    isDarkMode: state.darkModeReducer.isDarkMode,
    listaVersionamiento: state.listaVersionamientoReducers.listaVersionamiento,
});

export default connect(mapStateToProps)(Footer);