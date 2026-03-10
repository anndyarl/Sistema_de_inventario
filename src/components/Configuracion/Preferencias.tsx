// Preferencias.tsx - SIN connect
import React, { useState } from "react";
import { Col, Row } from "react-bootstrap";
import General from "./General";
import Datos from "./Datos";
import Firma from "./Firma";
import Indicadores from "./Indicadores";
import Versionamiento from "./Versionamiento";
import Seguridad from "./Seguridad";
import { Database, Gear, Git, Shield } from "react-bootstrap-icons";

interface NavItem {
    name: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

interface PreferenciasProps {
    isDarkMode: boolean;
    activo: string;
}

const Preferencias: React.FC<PreferenciasProps> = ({ isDarkMode, activo }) => {
    const [activeTab, setActiveTab] = useState(activo);

    const navigation: NavItem[] = [
        { name: 'General', icon: Gear },
        { name: 'Datos', icon: Database },
        { name: 'Seguridad', icon: Shield },
        { name: 'Versionamiento', icon: Git },
    ];

    const handleClick = (name: string) => {
        setActiveTab(name);
    };

    const getTabContent = () => {
        switch (activeTab) {
            case 'General':
                return <General />;
            case 'Datos':
                return <Datos />;
            case 'Seguridad':
                return <Seguridad />;
            case 'Firma':
                return <Firma />;
            case 'Indicadores':
                return <Indicadores />;
            case 'Versionamiento':
                return <Versionamiento />;
            default:
                return <General />;
        }
    };

    const classNames = (...classes: (string | boolean | undefined)[]): string => {
        return classes.filter(Boolean).join(" ");
    };

    return (
        <Row>
            <Col md={3}>
                {navigation.map((item) => (
                    <button
                        key={item.name}
                        onClick={() => handleClick(item.name)}
                        type="button"
                        className={classNames(
                            "btn btn-outline-secondary fw-semibold d-flex align-items-center py-2 px-3 mb-2 rounded w-100 border-0",
                            activeTab === item.name ? 'bg-secondary text-white' : ''
                        )}
                    >
                        <item.icon className="me-3 flex-shrink-0 h-5 w-5" aria-hidden="true" />
                        {item.name}
                    </button>
                ))}
            </Col>

            <Col md={9}>
                <div className={isDarkMode ? "darkModePrincipal" : ""}>
                    {getTabContent()}
                </div>
            </Col>
        </Row>
    );
};

export default Preferencias; // Exportación directa, sin connect