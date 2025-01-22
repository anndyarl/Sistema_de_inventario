
import React, { useRef, useState } from "react"
import SignatureCanvas from 'react-signature-canvas';
import { Button } from "react-bootstrap";
import { Pencil } from "react-bootstrap-icons";
import { RootState } from "../../store";
import { connect } from "react-redux";

interface GeneralProps {
    isDarkMode: boolean;
}
const Firma: React.FC<GeneralProps> = ({ isDarkMode }) => {
    const sigCanvas = useRef<SignatureCanvas>(null);
    const [isSigned, setIsSigned] = useState(false);
    const [__, setSignatureImage] = useState<string | undefined>();
    const [_, setError] = useState({});
    const clearSignature = () => {
        if (sigCanvas.current) {
            sigCanvas.current.clear();
            setIsSigned(false);
        }
    };

    const handleSignatureEnd = () => {
        setIsSigned(sigCanvas.current ? !sigCanvas.current.isEmpty() : false);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (sigCanvas.current && !sigCanvas.current.isEmpty()) {
            const firma = sigCanvas.current.toDataURL('image/png'); //capta la firma dibujada en una imagen
            setSignatureImage(firma);// Asigna la imagen al estado para poder renderizarlo
        } else {
            setError((prev) => ({ ...prev, firma: "La firma es obligatoria." }));
        }
    };
    return (
        <>
            <div className="d-flex border-bottom justify-content-between align-items-center p-2">
                <p>Contenedor de Firma</p>
            </div>
            <div className="d-flex border-bottom justify-content-between align-items-center p-2">
                <form onSubmit={handleSubmit}>
                    <div className="mb-3 ">
                        <label htmlFor="signature" className="fw-semibold">Crear firma</label>
                        <div className={`border ${isDarkMode ? "border-secondary" : "border-primary"} rounded p-2`}>
                            <SignatureCanvas
                                ref={sigCanvas}
                                canvasProps={{
                                    className: 'signature-canvas',
                                }}
                                backgroundColor={isDarkMode ? '#343a40' : '#f8f9fa'}
                                penColor={isDarkMode ? '#ffffff' : '#000000'}
                                onEnd={handleSignatureEnd}
                            />
                        </div>

                        {/* {error.signature && <div className="text-danger">{error.signature}</div>} */}
                        <div className="mt-2 d-flex justify-content-between">
                            <Button
                                type="button"
                                variant={isDarkMode ? "outline-secondary" : "outline-primary"}
                                onClick={clearSignature}
                                disabled={!isSigned}
                            >
                                Limpiar firma
                            </Button>
                            <Button
                                type="submit"
                                variant={isDarkMode ? "secondary" : "primary"}
                                disabled={!isSigned}                            >
                                <>
                                    <Pencil className="flex-shrink-0 h-5 w-5 mx-1 ms-0" aria-hidden="true" />
                                    Guardar
                                </>
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
};

const mapStateToProps = (state: RootState) => ({
    isDarkMode: state.darkModeReducer.isDarkMode
});

export default connect(mapStateToProps, {

})(Firma);

