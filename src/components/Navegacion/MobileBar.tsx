// src/components/MobileBar.tsx

import { Signature } from "lucide-react";
import { Button } from "react-bootstrap";
import { ArrowLeftRight, Box, PlusCircle, QrCodeScan } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";

const MobileBar: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="mobile-bar d-md-none bg-light shadow-lg p-2 border-top w-100 z-1050">
            <div className="d-flex justify-content-around align-items-center">
                <Button className="btn btn-link text-dark" onClick={() => navigate("/Inventario/FormInventario")}>
                    <Box size={24} />
                </Button>
                <Button className="btn btn-link text-dark" onClick={() => navigate("/Altas/RegistrarAltas")}>
                    <PlusCircle size={24} />
                </Button>
                <Button className="btn btn-link text-dark" onClick={() => navigate("/Inventario/LevantamientoFisico")}>
                    <QrCodeScan size={28} />
                </Button>

                <Button className="btn btn-link text-dark" onClick={() => navigate("/Altas/FirmarAltas")}>
                    <Signature size={24} />
                </Button>
                <Button className="btn btn-link text-dark" onClick={() => navigate("/Traslados/RegistrarTraslados")}>
                    <ArrowLeftRight size={24} />
                </Button>
            </div>
        </div>
    );
};

export default MobileBar;
