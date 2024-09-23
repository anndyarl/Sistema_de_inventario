import React from 'react';
import { Card, Row, Col } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { FolderPlus } from 'react-bootstrap-icons';
import Layout from '../../hooks/layout/Layout';


const classNames = (...classes: (string | boolean | undefined)[]): string => {
    return classes.filter(Boolean).join(' ');
};


const Inventario: React.FC = () => {

    return (
        <Layout>
            <>
                <Row className="align-items-center w-100">
                    <Col lg={4} md={6} className="mb-4">
                        <Card className="custom-card shadow p-3 border-0 rounded">
                            {/* <Card.Img
                                    variant="top"
                                    src="https://via.placeholder.com/150"
                                    alt="Card image 1"
                                    style={{ height: "350px", objectFit: "cover" }}
                                /> */}
                            <Card.Body>
                                <Card.Title className="text-center">Registrar Inventario</Card.Title>
                                <Card.Text className="text-center">
                                    Complete el formulario en tres etapas para una experiencia de usuario optimizada
                                </Card.Text>
                                <div className="d-flex justify-content-center">
                                    <div className="flex-grow-1">
                                        <NavLink key="FormularioCompleto" to="/FormularioCompleto" className="btn btn-primary text-white d-flex align-items-center justify-content-center py-2 px-3 mb-2 rounded text-decoration-none">
                                            <FolderPlus className={classNames('me-3 flex-shrink-0', 'h-5 w-5')} aria-hidden="true" />
                                            Nuevo
                                        </NavLink>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col lg={4} md={6} className="mb-4">
                        <Card className="custom-card shadow p-3 border-0 rounded">
                            {/* <Card.Img
                                    variant="top"
                                    src="https://via.placeholder.com/150"
                                    alt="Card image 2"
                                    style={{ height: "350px", objectFit: "cover" }}
                                /> */}
                            <Card.Body>
                                <Card.Title className="text-center">Modificar y Eliminar Inventario</Card.Title>
                                <Card.Text className="text-center">
                                    Busca el inventario que deseas modificar. Podrás editarlo o eliminarlo según necesites.
                                </Card.Text>
                                <div className="d-flex justify-content-center">
                                    <div className="flex-grow-1">
                                        <NavLink key="FormularioCompleto" to="/FormularioCompleto" className="btn btn-primary text-white d-flex align-items-center justify-content-center py-2 px-3 mb-2 rounded text-decoration-none">
                                            <FolderPlus className={classNames('me-3 flex-shrink-0', 'h-5 w-5')} aria-hidden="true" />
                                            Modificar / Eliminar
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

export default Inventario;
