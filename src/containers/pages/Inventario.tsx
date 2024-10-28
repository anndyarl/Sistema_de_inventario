import React, { useEffect } from 'react';
import { Card, Row, Col } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { Plus, Pencil, Trash } from 'react-bootstrap-icons';
import Layout from '../../hocs/layout/Layout';
import { MODALIDAD, ORIGEN } from '../../components/Inventario/RegistrarInventario/Datos_inventario';
import { BIEN, SERVICIO } from '../../components/Inventario/RegistrarInventario/Datos_cuenta';
import { comboOrigenPresupuestosActions } from '../../redux/actions/combos/comboOrigenPresupuestoActions';
import { comboModalidadesActions } from '../../redux/actions/combos/comboModalidadCompraActions';
import { comboServicioActions } from '../../redux/actions/combos/comboServicioActions';
import { comboDetalleActions } from '../../redux/actions/combos/comboDetalleActions';
import { RootState } from '../../store';
import { connect } from 'react-redux';


const classNames = (...classes: (string | boolean | undefined)[]): string => {
    return classes.filter(Boolean).join(' ');
};

interface FormInventarioProps {
    //Trae props combos de Datos_inventario(formulario 1) 
    comboOrigen: ORIGEN[];
    comboOrigenPresupuestosActions: () => void;
    comboModalidad: MODALIDAD[];

    comboModalidadesActions: () => void;

    //Trae props combos de Datos_cuenta(formulario 2)
    comboServicio: SERVICIO[];
    comboServicioActions: () => void

    comboBien: BIEN[];
    comboDetalleActions: (bienSeleccionado: string) => void
    token: string | null;
}

const Inventario: React.FC<FormInventarioProps> = ({ comboOrigen, comboModalidad, comboServicio, comboBien, token, comboOrigenPresupuestosActions, comboModalidadesActions, comboServicioActions, comboDetalleActions }) => {
    useEffect(() => {
        // Hace todas las llamadas a las api una vez carga el componente padre(FormInventario)
        if (token) {
            // Verifica si las acciones ya fueron disparadas
            if (comboOrigen.length === 0) comboOrigenPresupuestosActions();
            if (comboModalidad.length === 0) comboModalidadesActions();
            if (comboServicio.length === 0) comboServicioActions();
            if (comboBien.length === 0) comboDetalleActions("0");
        }

        //Carga combo bien con valor 0 
        comboDetalleActions("0");
    }, [comboOrigenPresupuestosActions, comboModalidadesActions, comboServicioActions, comboDetalleActions]);

    return (
        <Layout>
            <>
                <Row>
                    <Col lg={6} md={6} className="mb-4">
                        <Card className="custom-card shadow p-3 border-0 rounded">
                            <Card.Body>
                                <Card.Title className="text-center fw-semibold">Registrar Inventario</Card.Title>
                                <Card.Text className="text-center m-2">
                                    Complete el registro de un nuevo inventario en tres sencillos pasos.
                                </Card.Text>
                                <div className="d-flex justify-content-center">
                                    <div className="flex-grow-1">
                                        <NavLink
                                            key="FormInventario"
                                            to="/FormInventario"
                                            className="btn btn-primary text-white d-flex align-items-center justify-content-center py-2 px-3 mb-2 rounded text-decoration-none"
                                        >
                                            <Plus className={classNames("me-3 flex-shrink-0", "h-5 w-5")} aria-hidden="true" />
                                            Nuevo
                                        </NavLink>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col lg={6} md={6} className="mb-4">
                        <Card className="custom-card shadow p-3 border-0 rounded">
                            <Card.Body>
                                <Card.Title className="text-center fw-semibold">Modificar Inventario</Card.Title>
                                <Card.Text className="text-center m-2">
                                    Encuentre y modifique el inventario existente.
                                </Card.Text>
                                <div className="d-flex justify-content-center">
                                    <div className="flex-grow-1">
                                        <NavLink
                                            key="ModificarInventario"
                                            to="/ModificarInventario"
                                            className="btn btn-primary text-white d-flex align-items-center justify-content-center py-2 px-3 mb-2 rounded text-decoration-none"
                                        >
                                            <Pencil className={classNames("me-3 flex-shrink-0", "h-5 w-5")} aria-hidden="true" />
                                            Modificar
                                        </NavLink>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col lg={6} md={6} className="mb-4">
                        <Card className="custom-card shadow p-3 border-0 rounded">
                            <Card.Body>
                                <Card.Title className="text-center fw-semibold">Anular Inventario</Card.Title>
                                <Card.Text className="text-center m-2">
                                    Para anular un inventario, búsquelo previamente por fecha de inicio y término.
                                </Card.Text>
                                <div className="d-flex justify-content-center">
                                    <div className="flex-grow-1">
                                        <NavLink
                                            key="AnularInventario"
                                            to="/AnularInventario"
                                            className="btn btn-primary text-white d-flex align-items-center justify-content-center py-2 px-3 mb-2 rounded text-decoration-none"
                                        >
                                            <Trash className={classNames("me-3 flex-shrink-0", "h-5 w-5")} aria-hidden="true" />
                                            Eliminar
                                        </NavLink>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col lg={6} md={6} className="mb-4">
                        <Card className="custom-card shadow p-3 border-0 rounded">
                            <Card.Body>
                                <Card.Title className="text-center fw-semibold">Bienes de Funcionarios</Card.Title>
                                <Card.Text className="text-center m-2">
                                    Registre los bienes asignados a funcionarios.
                                </Card.Text>
                                <div className="d-flex justify-content-center">
                                    <div className="flex-grow-1">
                                        <NavLink
                                            key="FormBienesFuncionarios"
                                            to="/FormBienesFuncionarios"
                                            className="btn btn-primary text-white d-flex align-items-center justify-content-center py-2 px-3 mb-2 rounded text-decoration-none"
                                        >
                                            <Plus className={classNames("me-3 flex-shrink-0", "h-5 w-5")} aria-hidden="true" />
                                            Nuevo
                                        </NavLink>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>


                </Row>

            </>
        </Layout>
    );

};

const mapStateToProps = (state: RootState) => ({
    token: state.auth.token,
    comboOrigen: state.origenPresupuestoReducer.comboOrigen,
    comboServicio: state.comboServicioReducer.comboServicio,
    comboModalidad: state.modalidadCompraReducer.comboModalidad,
    comboCuenta: state.comboCuentaReducer.comboCuenta,
    comboDependencia: state.comboDependenciaReducer.comboDependencia,
    comboBien: state.detallesReducer.comboBien,

});

export default connect(mapStateToProps,
    {
        comboOrigenPresupuestosActions,
        comboModalidadesActions,
        comboServicioActions,
        comboDetalleActions,

    })(Inventario);