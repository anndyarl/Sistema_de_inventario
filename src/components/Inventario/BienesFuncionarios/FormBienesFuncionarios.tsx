import React, { useRef, useState } from "react";
import Layout from "../../../containers/hocs/layout/Layout";
import { Col, Row } from "react-bootstrap";
import "../../../styles/BienesFuncionario.css";
import {
  CuentaProps,
  DEPENDENCIA,
  SERVICIO,
} from "../RegistrarInventario/Datos_cuenta";
import Swal from "sweetalert2";
import { connect } from "react-redux";
import { RootState } from "../../../store";

import { registrarBienFuncionarioActions } from "../../../redux/actions/Inventario/RegistroBienesFuncionario/registrarBienFuncionarioActions";
import { comboServicioActions } from "../../../redux/actions/Inventario/Combos/comboServicioActions";
import { comboDependenciaActions } from "../../../redux/actions/Inventario/Combos/comboDependenciaActions";
import MenuInventario from "../../Menus/MenuInventario";


interface FuncionarioProps {
  rutFuncionario: string;
  servicio: number;
  dependencia: number;
  autorizacion: string;
  comprobanteDePago: string;
}
interface FormFuncionarioProps {
  comboServicio: SERVICIO[];
  comboDependencia: DEPENDENCIA[];
  comboDependenciaActions: (comboServicio: string) => void; // Nueva prop para pasar el servicio seleccionado
  registrarBienFuncionarioActions: (
    rutFuncionario: string,
    comboServicio: number,
    comboDependencia: number,
    comprobanteDePago: File,
    autorizacion: File
  ) => Promise<Boolean>;
}
const FormInventarioFuncionario: React.FC<FormFuncionarioProps> = ({
  comboServicio,
  comboDependencia,
  comboDependenciaActions,
  registrarBienFuncionarioActions,
}) => {
  const fileInputRef1 = useRef<HTMLInputElement>(null);
  const fileInputRef2 = useRef<HTMLInputElement>(null);
  const [selectedFileComprobante, setSelectedFileComprobante] = useState<File | null>(null);
  const [selectedFileAutorizacion, setSelectedFileAutorizacion] = useState<File | null>(null);
  const [isDraggingComprobante, setIsDraggingComprobante] = useState(false);
  const [isDraggingAutorizacion, setIsDraggingAutorizacion] = useState(false);
  const [error, setError] = useState<
    Partial<FuncionarioProps> & Partial<CuentaProps> & {}
  >({});
  const [Funcionario, setFuncionario] = useState({
    rutFuncionario: "",
    servicio: 0,
    dependencia: 0,
    comprobanteDePago: "",
    autorizacion: "",
  });

  const validate = () => {
    let tempErrors: Partial<any> & {} = {};
    const allowelabelypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "image/jpeg",
      "image/png",
      "image/jpg",
    ];
    // Validación para N° de Recepción (debe ser un número)
    if (!Funcionario.rutFuncionario)
      tempErrors.rutFuncionario = "El rut del funcionario es obligatorio.";
    if (!Funcionario.servicio)
      tempErrors.servicio = "El Servicio es obligatoria.";
    if (!Funcionario.dependencia)
      tempErrors.dependencia = "La dependencia es obligatoria.";

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
      tempErrors.comprobanteDePago =
        "Solo se permiten archivos PDF, DOCX o JPG.";
    }

    setError(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  // Función para formatear el RUT
  const formatRut = (rut: string) => {
    // Remover puntos y guion para limpiar el formato
    const cleanRut = rut.replace(/[.-]/g, "");

    // Separar el número del dígito verificador
    const number = cleanRut.slice(0, -1);
    const verifier = cleanRut.slice(-1);

    // Formatear con puntos y guion
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "-" + verifier;
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFuncionario((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    if (name === "servicio") {
      comboDependenciaActions(value);
    }
    // Formatear si el campo es rutFuncionario
    if (name === "rutFuncionario") {
      const cleanedValue = value
        .toUpperCase() // Convierte a mayúscula para permitir la "K"
        .replace(/[^0-9K.-]/g, ""); // Permite solo números, ".", "-", y "K"

      const formattedRut = formatRut(cleanedValue); // Aplica el formato
      setFuncionario((prevFuncionario) => ({
        ...prevFuncionario,
        [name]: formattedRut,
      }));
    } else {
      setFuncionario((prevFuncionario) => ({
        ...prevFuncionario,
        [name]: value,
      }));
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

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (validate()) {
      if (selectedFileComprobante && selectedFileAutorizacion) {
        const resultado = await registrarBienFuncionarioActions(
          Funcionario.rutFuncionario,
          Funcionario.servicio,
          Funcionario.dependencia,
          selectedFileComprobante,
          selectedFileAutorizacion
        );

        if (resultado) {
          Swal.fire({
            icon: "success",
            title: "Envío exitoso",
            text: "¡Se ha registrado con éxito!",
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Hubo un problema al enviar el registro.",
          });
        }
      } else {
        setError({
          ...error,
          comprobanteDePago: selectedFileComprobante ? "" : "El comprobante de pago es obligatorio.",
          autorizacion: selectedFileAutorizacion ? "" : "La autorización es obligatoria.",
        });
      }
    }
  };

  return (
    <Layout>
      <MenuInventario />
      <div className="border-bottom shadow-sm p-4 rounded">
        <h3 className="form-title fw-semibold border-bottom p-1">
          Registro Bienes de Funcioanarios
        </h3>
        <form onSubmit={handleFormSubmit}>
          <Row className="d-flex align-items-center">
            <Col md={4}>
              <div className="mb-1">
                <label htmlFor="rutFuncionario" className="text-muted fw-semibold fw-semibold">Rut Funcionario</label>
                <input
                  aria-label="rutFuncionario"  // Asociado al label
                  type="text"
                  className={`form-control ${error.rutFuncionario ? "is-invalid" : ""
                    } w-100`}
                  maxLength={12}
                  name="rutFuncionario"
                  onChange={handleChange}
                  value={Funcionario.rutFuncionario}
                />
                {error.rutFuncionario && (
                  <div className="invalid-feedback d-block">
                    {error.rutFuncionario}
                  </div>
                )}
              </div>
              <div className="border shadow-sm p-4 rounded">
                <h5 className="fw-semibold border-bottom p-1">Destino</h5>
                <div className="mb-1">
                  <label htmlFor="servicio" className="text-muted fw-semibold fw-semibold">Servicio</label>
                  <select
                    aria-label="servicio"
                    className="form-select"
                    name="servicio"
                    onChange={handleChange}
                    value={Funcionario.servicio || ""}
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
                    <div className="invalid-feedback d-block">
                      {error.servicio}
                    </div>
                  )}
                </div>
                <div className="mb-1">
                  <label htmlFor="dependencia" className="text-muted fw-semibold fw-semibold">Dependencia</label>
                  <select
                    aria-label="dependencia"
                    className="form-select"
                    name="dependencia"
                    disabled={!Funcionario.servicio}
                    onChange={handleChange}
                    value={Funcionario.dependencia}
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
                    <div className="invalid-feedback d-block">
                      {error.dependencia}
                    </div>
                  )}
                </div>
              </div>
            </Col>
            <Col md={4} className="d-flex align-items-center">
              <div className="mb-1 w-100">
                <label htmlFor="comprobanteDePago" className="text-muted fw-semibold fw-semibold ">Comprobante de Pago</label>
                <div
                  className={`dropzone p-1 ${isDraggingComprobante ? "dragging" : ""
                    }`}
                  onDrop={handleDropComprobante}
                  onDragOver={handleDragOverComprobante}
                  onClick={handleFileSelectComprobante}
                >
                  {selectedFileComprobante ? (
                    <p>Archivo seleccionado: {selectedFileComprobante.name}</p>
                  ) : (
                    <p>
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
                  <div className="invalid-feedback d-block">
                    {error.comprobanteDePago}
                  </div>
                )}
              </div>
            </Col>
            <Col md={4} className="d-flex align-items-center">
              <div className="mb-1 w-100">
                <label htmlFor="autorizacion" className="text-muted fw-semibold fw-semibold">Autorización</label>
                <div
                  className={`dropzone p-1 ${isDraggingAutorizacion ? "dragging" : ""
                    }`}
                  onDrop={handleDropAutorizacion}
                  onDragOver={handleDragOverAutorizacion}
                  onClick={handleFileSelectAutorizacion}
                >
                  {selectedFileAutorizacion ? (
                    <p>Archivo seleccionado: {selectedFileAutorizacion.name}</p>
                  ) : (
                    <p>
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
                  <div className="invalid-feedback d-block">
                    {error.autorizacion}
                  </div>
                )}
              </div>
            </Col>
          </Row>

          <div className="p-1 rounded bg-white d-flex justify-content-end ">
            <button type="submit" className="btn btn-primary">
              Validar
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

const mapStateToProps = (state: RootState) => ({
  comboServicio: state.comboServicioReducer.comboServicio,
  comboDependencia: state.comboDependenciaReducer.comboDependencia,
});

export default connect(mapStateToProps, {
  comboServicioActions,
  comboDependenciaActions,
  registrarBienFuncionarioActions,
})(FormInventarioFuncionario);
