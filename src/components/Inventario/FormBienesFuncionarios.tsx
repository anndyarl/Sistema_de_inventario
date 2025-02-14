import React, { useEffect, useRef, useState } from "react";
import Layout from "../../containers/hocs/layout/Layout";
import { Button, Col, Row } from "react-bootstrap";
import "../../styles/BienesFuncionario.css";
import {
  CuentaProps,
  DEPENDENCIA,
  SERVICIO,
} from "./RegistrarInventario/DatosCuenta";
import Swal from "sweetalert2";
import { connect, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../../store";

import { registrarBienFuncionarioActions } from "../../redux/actions/Inventario/RegistroBienesFuncionario/registrarBienFuncionarioActions";
import { comboServicioActions } from "../../redux/actions/Inventario/Combos/comboServicioActions";
import { comboDependenciaActions } from "../../redux/actions/Inventario/Combos/comboDependenciaActions";
import MenuInventario from "../Menus/MenuInventario";
import { setDependenciaBienesFuncionarioActions, setRutBienesFuncionarioActions, setServicioBienesFuncionarioActions } from "../../redux/actions/Inventario/RegistroBienesFuncionario/datosRegistroBeneficiarioActions";
import { validate, format } from 'rut.js';
import { Helmet } from "react-helmet-async";


interface FuncionarioProps {
  rutFuncionario?: string;  // Opcional si no siempre es necesario
  servicio: number;
  dependencia: number;
  autorizacion?: string;
  comprobanteDePago?: string;
}

interface FormFuncionarioProps extends FuncionarioProps {
  comboServicio: SERVICIO[];
  comboDependencia: DEPENDENCIA[];
  comboServicioActions: () => void;
  comboDependenciaActions: (comboServicio: string) => void; // Nueva prop para pasar el servicio seleccionado
  registrarBienFuncionarioActions: (
    rutFuncionario: string,
    comboServicio: number,
    comboDependencia: number,
    comprobanteDePago: File,
    autorizacion: File,
  ) => Promise<boolean>;
  token: string | null;
  isDarkMode: boolean;
}
const FormInventarioFuncionario: React.FC<FormFuncionarioProps> = ({
  token,
  comboServicio,
  comboDependencia,
  rutFuncionario,
  servicio,
  dependencia,
  comprobanteDePago,
  autorizacion,
  isDarkMode,
  comboServicioActions,
  comboDependenciaActions,
  registrarBienFuncionarioActions,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const fileInputRef1 = useRef<HTMLInputElement>(null);
  const fileInputRef2 = useRef<HTMLInputElement>(null);
  const [selectedFileComprobante, setSelectedFileComprobante] = useState<File | null>(null);
  const [selectedFileAutorizacion, setSelectedFileAutorizacion] = useState<File | null>(null);
  const [isDraggingComprobante, setIsDraggingComprobante] = useState(false);
  const [isDraggingAutorizacion, setIsDraggingAutorizacion] = useState(false);
  const [error, setError] = useState<Partial<FuncionarioProps> & Partial<CuentaProps> & {}>({});
  // const [loading, setLoading] = useState(false); // Estado para controlar la carga

  const [Funcionario, setFuncionario] = useState<FuncionarioProps>({
    rutFuncionario: "",
    servicio: 0,
    dependencia: 0,
    comprobanteDePago: "",
    autorizacion: "",
  });

  useEffect(() => {
    setFuncionario({
      rutFuncionario,
      servicio,
      dependencia,
      comprobanteDePago,
      autorizacion,
    });
  }, [rutFuncionario, servicio, dependencia, comprobanteDePago, autorizacion]);

  useEffect(() => {
    //carga automaticamente si no se ha llamado a combo servicios
    if (token) {
      if (comboServicio.length === 0) comboServicioActions();
    }
  }, [comboServicioActions]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let newValue = value;
    setFuncionario((prevState) => ({
      ...prevState,
      [name]: value,
    }));


    if (name === "rutFuncionario") {
      setFuncionario((prevState) => ({
        ...prevState,
        rutFuncionario: format(newValue),
      }));
      dispatch(setRutBienesFuncionarioActions(format(newValue)));
    }

    if (name === "servicio") {
      comboDependenciaActions(value);
      dispatch(setServicioBienesFuncionarioActions(parseInt(value)));
    }
    if (name === "dependencia") {
      dispatch(setDependenciaBienesFuncionarioActions(parseInt(value)));
    }

    // Verificar si es un input de tipo "file" y si tiene archivos seleccionados
    if (e.target instanceof HTMLInputElement && e.target.type === "file") {
      const file = e.target.files?.[0];
      if (file) {
        // Si el archivo es válido, establecerlo en el estado correspondiente
        if (name === "comprobanteDePago") {
          setSelectedFileComprobante(file);
          setError({ ...error, comprobanteDePago: "" }); // Limpiar errores si el archivo es válido
        } else if (name === "autorizacion") {
          setSelectedFileAutorizacion(file);
          setError({ ...error, autorizacion: "" }); // Limpiar errores si el archivo es válido
        }
      }
    }
  };

  const validateForm = () => {
    let tempErrors: Partial<any> & {} = {};
    const allowelabelypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "image/jpeg",
      "image/png",
      "image/jpg",
    ];

    if (!Funcionario.rutFuncionario)
      tempErrors.rutFuncionario = "El rut del funcionario es obligatorio.";
    else if (!validate(Funcionario.rutFuncionario)) {
      tempErrors.rutFuncionario = "El rut es incorrecto";
      // console.log(validate(Funcionario.rutFuncionario));
    }
    if (!Funcionario.servicio)
      tempErrors.servicio = "El Servicio es obligatoria.";
    if (!Funcionario.dependencia)
      tempErrors.dependencia = "La Dependencia es obligatoria.";
    // Validación de archivos: autorizacion
    if (!selectedFileAutorizacion) {
      tempErrors.autorizacion = "La autorización es obligatoria.";
    } else if (!allowelabelypes.includes(selectedFileAutorizacion.type)) {
      tempErrors.autorizacion = "Solo se permiten archivos PDF, DOCX o JPG.";
    }
    // Validación de archivos: comprobanteDePago
    if (!selectedFileComprobante) {
      tempErrors.comprobanteDePago = "El comprobante de pago es obligatorio.";
    } else if (!allowelabelypes.includes(selectedFileComprobante.type)) {
      tempErrors.comprobanteDePago = "Solo se permiten archivos PDF, DOCX o JPG.";
    }
    setError(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };
  //----------------Comprobante de Pago --------------//
  //Habilita el estado arrastrar
  const handleDragOverComprobante = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingComprobante(true);
  };
  //Adjuntar por arrastre
  const handleDropComprobante = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingComprobante(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      setSelectedFileComprobante(file);

      // Actualiza el estado del funcionario con el archivo en el campo comprobanteDePago
      setFuncionario((prevFuncionario) => ({
        ...prevFuncionario,
        comprobanteDePago: file.name,
      }));
    }
  };
  //Adjuntar por click
  const handleFileSelectComprobante = () => {
    if (fileInputRef1.current) {
      fileInputRef1.current.click();
    }
  };
  //----------------Fin Comprobante de Pago --------------//

  //----------------Autorización --------------//
  //Habilita el estado arrastrar
  const handleDragOverAutorizacion = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingAutorizacion(true);
  };
  //Adjuntar por arrastre
  const handleDropAutorizacion = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingAutorizacion(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      setSelectedFileAutorizacion(file);

      // Actualiza el estado del funcionario con el archivo en el campo comprobanteDePago
      setFuncionario((prevFuncionario) => ({
        ...prevFuncionario,
        autorizacion: file.name,
      }));
    }
  };
  //Adjuntar por click
  const handleFileSelectAutorizacion = () => {
    if (fileInputRef2.current) {
      fileInputRef2.current.click();
    }
  };
  //----------------Fin Autorización --------------//
  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      const result = await Swal.fire({
        icon: "info",
        title: "Confirmar registro",
        text: "¿Desea registrar los bienes del funcionario con la información proporcionada?",
        showCancelButton: true,
        confirmButtonText: "Confirmar y registrar",
        cancelButtonText: "Cancelar",
        background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
        color: `${isDarkMode ? "#ffffff" : "000000"}`,
        confirmButtonColor: `${isDarkMode ? "#007bff" : "444"}`,
        customClass: {
          popup: "custom-border", // Clase personalizada para el borde
        }
      });
      if (result.isConfirmed) {
        // setLoading(true);
        if (selectedFileComprobante && selectedFileAutorizacion) {
          const resultado = await registrarBienFuncionarioActions(
            Funcionario.rutFuncionario || "",
            Funcionario.servicio,
            Funcionario.dependencia,
            selectedFileComprobante,
            selectedFileAutorizacion
          );
          if (resultado) {
            Swal.fire({
              icon: "success",
              title: "Registro exitoso",
              text: "¡Se ha registrado con éxito!",
              background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
              color: `${isDarkMode ? "#ffffff" : "000000"}`,
              confirmButtonColor: `${isDarkMode ? "#007bff" : "444"}`,
              customClass: {
                popup: "custom-border", // Clase personalizada para el borde
              }
            });
            // setLoading(false);
          } else {
            Swal.fire({
              icon: "error",
              title: "Error",
              text: "Hubo un problema al enviar el registro.",
              background: `${isDarkMode ? "#1e1e1e" : "ffffff"}`,
              color: `${isDarkMode ? "#ffffff" : "000000"}`,
              confirmButtonColor: `${isDarkMode ? "#007bff" : "444"}`,
              customClass: {
                popup: "custom-border", // Clase personalizada para el borde
              }
            });
            // setLoading(false);
          }
        } else {
          setError({
            ...error,
            comprobanteDePago: selectedFileComprobante ? "" : "El comprobante de pago es obligatorio.",
            autorizacion: selectedFileAutorizacion ? "" : "La autorización es obligatoria.",
          });
          // setLoading(false);
        }
        dispatch(setRutBienesFuncionarioActions(""));
        dispatch(setServicioBienesFuncionarioActions(0));
        dispatch(setDependenciaBienesFuncionarioActions(0));
        setSelectedFileComprobante(null);
        setSelectedFileAutorizacion(null);
        setFuncionario({
          ...Funcionario,
          comprobanteDePago: "",
          autorizacion: "",
        });
      }

    }
  };

  return (
    <Layout>
      <Helmet>
        <title>Bienes de Funcionarios</title>
      </Helmet>
      <MenuInventario />
      <form onSubmit={handleFormSubmit}>
        <div className={`border border-botom p-4 rounded ${isDarkMode ? "darkModePrincipal text-light border-secondary" : ""}`}>
          <h3 className="form-title fw-semibold border-bottom p-1">
            Registro Bienes de Funcionarios
          </h3>
          <Row className="d-flex align-items-center">
            <Col md={4}>
              <div className="mb-1">
                <label htmlFor="rutFuncionario" className="fw-semibold">Rut Funcionario</label>
                <input
                  aria-label="rutFuncionario"  // Asociado al label
                  type="text"
                  className={`form-select ${isDarkMode ? "bg-dark text-light border-secondary" : ""
                    } ${error.rutFuncionario ? "is-invalid" : ""} w-100`}
                  maxLength={12}
                  size={10}
                  name="rutFuncionario"
                  onChange={handleChange}
                  value={Funcionario.rutFuncionario || ""}
                  placeholder="12.345.678-9"
                />
                {error.rutFuncionario && (
                  <div className="invalid-feedback fw-semibold d-block">
                    {error.rutFuncionario}
                  </div>
                )}
              </div>

              <div className={`border p-2 ${isDarkMode ? "border-secondary" : ""} ${error.servicio ? "is-invalid" : ""}`} >
                <h6 className="text-center fw-semibold">Destino</h6>
                <div className="mb-1">
                  <label htmlFor="servicio" className="fw-semibold fw-semibold">Servicio</label>
                  <select
                    aria-label="servicio"
                    className={`form-select ${isDarkMode ? "bg-dark text-light border-secondary" : ""} ${error.servicio ? "is-invalid" : ""}`}
                    name="servicio"
                    onChange={handleChange}
                    value={Funcionario.servicio || 0}
                  >
                    <option value="">Seleccione un origen</option>
                    {comboServicio.map((traeServicio) => (
                      <option
                        key={traeServicio.codigo}
                        value={traeServicio.codigo}
                      >
                        {traeServicio.nombrE_ORD}
                      </option>
                    ))}
                  </select>
                  {error.servicio && (
                    <div className="invalid-feedback fw-semibold d-block">
                      {error.servicio}
                    </div>
                  )}
                </div>
                <div className="mb-1">
                  <label htmlFor="dependencia" className="fw-semibold">Dependencia</label>
                  <select
                    aria-label="dependencia"
                    className={`form-select ${isDarkMode ? "bg-dark text-light border-secondary" : ""
                      } ${error.dependencia ? "is-invalid" : ""}`}
                    name="dependencia"
                    disabled={!Funcionario.servicio}
                    onChange={handleChange}
                    value={Funcionario.dependencia || 0}
                  >
                    <option value="">Selecciona una opción</option>
                    {comboDependencia.map((traeDependencia) => (
                      <option
                        key={traeDependencia.codigo}
                        value={traeDependencia.codigo}
                      >
                        {traeDependencia.nombrE_ORD}
                      </option>
                    ))}
                  </select>
                  {error.dependencia && (
                    <div className="invalid-feedback fw-semibold d-block">
                      {error.dependencia}
                    </div>
                  )}
                </div>
              </div>
            </Col>
            <Col md={4} className="d-flex align-items-center">
              <div className="mb-1 w-100">
                <label htmlFor="comprobanteDePago" className="fw-semibold ">Comprobante de Pago</label>
                <div
                  className={`dropzone p-1 ${isDraggingComprobante ? "dragging" : ""
                    }`}
                  onDrop={handleDropComprobante}
                  onDragOver={handleDragOverComprobante}
                  onClick={handleFileSelectComprobante}
                >
                  {selectedFileComprobante ? (
                    <p className="file-name fw-semibold">{selectedFileComprobante.name}</p>
                  ) : (
                    <p className="file-name fw-semibold">
                      Arrastra y suelta el archivo aquí, o haz clic para
                      seleccionar
                    </p>
                  )}
                </div>
                <input
                  aria-label="comprobanteDePago"
                  type="file"
                  ref={fileInputRef1} // Asigna la referencia al input
                  className={`file-input ${error.comprobanteDePago ? "is-invalid" : ""
                    } w-100`}
                  name="comprobanteDePago"
                  onChange={handleChange}
                  accept=".pdf, .docx, .jpg" // Solo permite los tipos de archivos especificados
                  value=""
                />
                {error.comprobanteDePago && (
                  <div className="invalid-feedback fw-semibold d-block">
                    {error.comprobanteDePago}
                  </div>
                )}
              </div>
            </Col>
            <Col md={4} className="d-flex align-items-center">
              <div className="mb-1 w-100">
                <label htmlFor="autorizacion" className="fw-semibold">Autorización</label>
                <div
                  className={`dropzone p-1 ${isDraggingAutorizacion ? "dragging" : ""
                    }`}
                  onDrop={handleDropAutorizacion}
                  onDragOver={handleDragOverAutorizacion}
                  onClick={handleFileSelectAutorizacion}
                >
                  {selectedFileAutorizacion ? (
                    <p className="file-name fw-semibold">{selectedFileAutorizacion.name}</p>
                  ) : (
                    <p className="file-name fw-semibold">
                      Arrastra y suelta el archivo aquí, o haz clic para
                      seleccionar
                    </p>
                  )}
                </div>
                <input
                  aria-label="autorizacion"
                  type="file"
                  ref={fileInputRef2} // Asigna la referencia al input
                  className={`file-input ${error.autorizacion ? "is-invalid" : ""
                    } w-100`}
                  name="autorizacion"
                  onChange={handleChange}
                  accept=".pdf, .docx, .jpg" // Solo permite los tipos de archivos especificados
                  value=""
                />
                {error.autorizacion && (
                  <div className="invalid-feedback fw-semibold d-block">
                    {error.autorizacion}
                  </div>
                )}
              </div>
            </Col>
          </Row>

          <div className="d-flex justify-content-end p-1">
            <Button type="submit" className={`btn ${isDarkMode ? "btn-secondary" : "btn-primary"}`}>Validar</Button>
          </div>
        </div>
      </form>
    </Layout>
  );
};


const mapStateToProps = (state: RootState) => ({
  token: state.loginReducer.token,
  comboServicio: state.comboServicioReducer.comboServicio,
  comboDependencia: state.comboDependenciaReducer.comboDependencia,
  rutFuncionario: state.datosBienesFuncionarioReducers.rutFuncionario,
  servicio: state.datosBienesFuncionarioReducers?.servicio || 0,
  dependencia: state.datosBienesFuncionarioReducers?.dependencia || 0,
  isDarkMode: state.darkModeReducer.isDarkMode,
  // comprobanteDePago: state.datosBienesFuncionarioReducers?.comprobanteDePago || "",
  // autorizacion: state.datosBienesFuncionarioReducers?.autorizacion || "",
});

export default connect(mapStateToProps, {
  comboServicioActions,
  comboDependenciaActions,
  registrarBienFuncionarioActions
})(FormInventarioFuncionario);
