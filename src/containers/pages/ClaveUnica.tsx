"use client"

import type React from "react"
import { useState } from "react"
import { connect } from "react-redux"
import type { RootState } from "../../redux/reducers"
import { Navigate, useNavigate } from "react-router-dom"
import { Button, Spinner } from "react-bootstrap"
import ssmso_logo from "../../assets/img/SSMSO-LOGO.png"
import { ChevronDown } from "lucide-react"

interface Props {
  isAuthenticated: boolean | null
  isDarkMode: boolean
}

const ClaveUnica: React.FC<Props> = ({ isAuthenticated }) => {
  const [loading, setLoading] = useState(false)

  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)
  const navigate = useNavigate(); // Hook para redirigir
  const handleClaveUnica = () => {
    setLoading(true)
    const redirectUrl = import.meta.env.VITE_CSRF_CLAVE_UNICA
    window.location.href = redirectUrl
    setLoading(false)
  }

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index)
  }
  const faqItems = [
    {
      question: "¿Cómo obtengo mi usuario?",
      answer:
        "Puede ingresar al Sistema de Inventario utilizando su Clave Única. Si el acceso es denegado, contacte al Departamento de Informática al anexo 2505 o escriba a desarrollo@ssmso.cl para solicitar la habilitación de su cuenta.",
    },
    {
      question: "¿Cómo accedo al sistema?",
      answer:
        "El Sistema de Inventario es una aplicación web que no requiere instalación. Solo necesita acceder mediante la URL correspondiente y contar con su Clave Única habilitada para el módulo de activos fijos, otorgada por el Área de Desarrollo."
    },
    {
      question: "¿Cómo obtengo o cambio mi contraseña?",
      answer:
        "Si necesita una contraseña inicial o desea restablecerla, comuníquese con el Departamento de Informática al anexo 2505 o escriba a desarrollo@ssmso.cl.",
    },
    {
      question: "¿Con quién me contacto si tengo problemas con el sistema?",
      answer:
        "En caso de inconvenientes, puede comunicarse con la Unidad de Desarrollo del Departamento de Informática al anexo 262505 o vía correo electrónico a desarrollo@ssmso.cl. Horario de atención: lunes a viernes de 08:30 a 17:30 hrs.",
    },
  ];
  const handlePrueba = () => {
    navigate("/Login");
  };

  if (isAuthenticated) {
    return <Navigate to="/Inicio" />
  }

  return (
    <div className="min-vh-100 d-flex flex-column flex-md-row">
      {/* Left Section - Login Form */}
      <div className="col-12 col-md-6 d-flex align-items-center justify-content-center p-4">
        <div className="bg-white rounded-4 shadow-sm p-4 w-100" style={{ maxWidth: 400 }}>
          <div className="text-center mb-4">
            <img src={ssmso_logo || "/placeholder.svg"} alt="SSMSO Logo" width={120} className="img-fluid" />
          </div>

          <div className="text-center mb-4">
            <p className="text-muted mb-0" style={{ fontSize: "14px" }}>
              Para iniciar sesión con Clave Única,
            </p>
            <p className="text-muted" style={{ fontSize: "14px" }}>
              haz clic en el botón de abajo
            </p>
          </div>

          <Button
            onClick={handleClaveUnica}
            disabled={loading}
            className="w-100 py-3 mb-3 fw-medium rounded-3"
            style={{ border: "none", fontSize: "16px" }}
          >
            {loading ? (
              <>
                <Spinner as="span" animation="border" size="sm" className="me-2" />
                Iniciando sesión...
              </>
            ) : (
              <>
                {/* Ícono de Clave Única */}
                <svg width="20" height="20" className="me-2" viewBox="0 0 25 25" fill="none">
                  {/* ... paths ... */}
                </svg>
                Iniciar sesión con Clave Única
              </>
            )}
          </Button>

          <Button
            onClick={handlePrueba}
            disabled={loading}
            variant="primary"
            className="w-100 py-3 mb-3 fw-medium rounded-3"
            type="submit"
          >
            Acceso prueba
          </Button>
        </div>
      </div>

      {/* Right Section - Info Panel */}
      <div className="col-12 col-md-6 p-4 bg-color">
        <div className="h-100 d-flex flex-column">
          {/* Card de bienvenida */}
          <div className="bg-white bg-opacity-10 backdrop-blur rounded-4 p-4 mb-4 text-white position-relative">
            <h4 className="fw-bold mb-2">Sistema de Activo Fijo</h4>
            <p className="mb-3" style={{ fontSize: "14px" }}>
              Plataforma de gestión de inventario de la Red Pública Salud Sur Oriente.
            </p>
          </div>

          {/* Preguntas frecuentes */}
          <div className="flex-grow-1 overflow-auto">
            <h4 className="text-white fw-bold mb-4">Preguntas frecuentes</h4>
            <div className="space-y-2">
              {faqItems.map((item, index) => (
                <div key={index} className="bg-white bg-opacity-10 backdrop-blur rounded-3 mb-2">
                  <button
                    className="w-100 d-flex justify-content-between align-items-center p-3 bg-transparent border-0 text-white text-start"
                    onClick={() => toggleFaq(index)}
                  >
                    <span style={{ fontSize: "14px" }}>{item.question}</span>
                    <ChevronDown
                      size={16}
                      className={`transition-transform ${expandedFaq === index ? "rotate-180" : ""}`}
                    />
                  </button>
                  {expandedFaq === index && (
                    <div className="px-3 pb-3 text-white" style={{ fontSize: "13px" }}>
                      <p className="mb-0 opacity-75">{item.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <footer className="text-white text-center mt-4" style={{ fontSize: "12px" }}>
            <p className="mb-0">Departamento de Informática | Unidad de Desarrollo 2025</p>
            <p className="mb-0">Servicio de Salud Metropolitano Sur Oriente</p>
          </footer>
        </div>
      </div>
    </div>
  );

}

const mapStateToProps = (state: RootState) => ({
  isAuthenticated: state.validaApiLoginReducers.isAuthenticated,
  isDarkMode: state.darkModeReducer.isDarkMode,
  token: state.loginReducer.token,
})

export default connect(mapStateToProps, {})(ClaveUnica)
