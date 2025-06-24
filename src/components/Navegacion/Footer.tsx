import { Database, Gear, Git, Info } from 'react-bootstrap-icons';
import { RootState } from '../../store';
import { connect } from 'react-redux';
import { Col, Modal, Row } from 'react-bootstrap';
import Versionamiento, { ListaVersionamiento } from '../Configuracion/Versionamiento';
const classNames = (...classes: (string | boolean | undefined)[]): string => {
    return classes.filter(Boolean).join(" ");
};
import { useState } from "react";
import { NavItem } from './Sidebar';
import General from '../Configuracion/General';
import Datos from '../Configuracion/Datos';
// import Firma from '../Configuracion/Firma';
// import Indicadores from '../Configuracion/Indicadores';
interface Props {
    isDarkMode: boolean;
    listaVersionamiento: ListaVersionamiento[];
}
const Footer: React.FC<Props> = ({ listaVersionamiento, isDarkMode }) => {
    const Ambiente = import.meta.env.VITE_AMBIENTE;

    const [mostrarModal, setMostrarModal] = useState(false);

    const ModalContent: React.FC = () => {
        const [activeTab, setActiveTab] = useState('Versionamiento');
        const navigation: NavItem[] = [
            { name: 'General', icon: Gear },
            { name: 'Datos', icon: Database },
            // { name: 'Firma', icon: Signature },
            // { name: 'Indicadores', icon: BarChart },
            { name: 'Versionamiento', icon: Git },
        ];

        const handleClick = (name: string) => {
            setActiveTab(name);
        };

        return (
            <>
                <Row>
                    <Col md={4}>
                        {navigation.map((item) => (
                            <button
                                key={item.name}
                                onClick={() => handleClick(item.name)}
                                type="button"
                                className={` ${activeTab === item.name ? 'bg-secondary text-white' : ''} btn btn-outline-secondary fw-semibold d-flex align-items-center py-2 px-3 mb-2 rounded w-100 border-0 `}
                            >
                                <item.icon className={classNames('me-3 flex-shrink-0', 'h-5 w-5')} aria-hidden="true" />
                                {item.name}
                            </button>
                        ))}
                    </Col>
                    <Col md={8}>
                        {activeTab === 'General' && <General />}
                        {activeTab === 'Datos' && <Datos />}
                        {/* {activeTab === 'Firma' && <Firma />}
                    {activeTab === 'Indicadores' && <Indicadores />} */}
                        {activeTab === 'Versionamiento' && <Versionamiento />}
                    </Col>
                </Row >
            </>
        );
    };
    const version = listaVersionamiento[0]?.numerO_VERSION || "";
    return (
        <>
            <footer className={`p-3  ${isDarkMode ? "bg-color-dark" : "bg-light"}`}>
                <div className="d-flex align-items-center">
                    <Info className="mx-1 h-4 w-4" aria-hidden="true" />
                    <p className='fs-09em'>
                        Copyright © 2025 Todos los derechos reservados SSMSO. <b className='text-warning'>{Ambiente}</b>
                        <a onClick={() => setMostrarModal(true)} className={`fw-normal mx-1 text-decoration-none`} style={{ cursor: "pointer" }}><b className={`fw-semibold ${isDarkMode ? "text-white" : "text-dark"}`}>{version}</b></a>
                    </p>
                </div>
            </footer>

            <Modal size="xl" show={mostrarModal} onHide={() => setMostrarModal(false)} /* backdrop="static" keyboard={false} */>
                <Modal.Header className={`${isDarkMode ? "darkModePrincipal" : ""}`} closeButton>
                    <Modal.Title>Preferencias</Modal.Title>
                </Modal.Header>
                <Modal.Body className={`${isDarkMode ? "darkModePrincipal" : ""}`}>
                    <ModalContent />
                </Modal.Body>
            </Modal>

        </>
    );
}
//mapea los valores del estado global de Redux
const mapStateToProps = (state: RootState) => ({
    isDarkMode: state.darkModeReducer.isDarkMode,
    listaVersionamiento: state.listaVersionamientoReducers.listaVersionamiento,
});

export default connect(mapStateToProps, {
})(Footer);
