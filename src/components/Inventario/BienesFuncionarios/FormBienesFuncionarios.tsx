import React, { useState } from "react";
import Layout from "../../../hocs/layout/Layout";
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
import { comboDependenciaActions } from "../../../redux/actions/combos/comboDependenciaActions";
import { comboServicioActions } from "../../../redux/actions/combos/comboServicioActions";

interface FuncionarioProps {
  rutFuncionario: string;
}
interface FormFuncionarioProps {
  comboServicio: SERVICIO[];
  comboDependencia: DEPENDENCIA[];
  comboDependenciaActions: (comboServicio: string) => void; // Nueva prop para pasar el servicio seleccionado
}
const FormInventarioFuncionario: React.FC<FormFuncionarioProps> = ({
  comboServicio,
  comboDependencia,
  comboDependenciaActions,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile1, setSelectedFile1] = useState<File | null>(null);
  const [selectedFile2, setSelectedFile2] = useState<File | null>(null);
  const [error, setError] = useState<
    Partial<FuncionarioProps> & Partial<CuentaProps> & {}
  >({});
  const [Funcionario, setFuncionario] = useState({
    rutFuncionario: "",
    servicio: 0,
    dependencia: 0,
  });

  const validate = () => {
    let tempErrors: Partial<any> & {} = {};
    // Validación para N° de Recepción (debe ser un número)
    if (!Funcionario.rutFuncionario)
      tempErrors.rutFuncionario = "El rut del funcionario es obligatorio.";
    if (!Funcionario.servicio)
      tempErrors.servicio = "El Servicio es obligatoria.";
    if (!Funcionario.dependencia)
      tempErrors.dependencia = "La dependencia es obligatoria.";

    setError(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };
  // Manejador del evento de drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);

    if (files.length >= 2) {
      setSelectedFile1(files[0]);
      setSelectedFile2(files[1]);
    }
  };

  // Manejador para cuando el archivo está sobre la zona de drop
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  // Manejador cuando el archivo sale de la zona de drop
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
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

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let resultado = false;
    console.log("datos biene funcionario", Funcionario);
    // resultado = await postFormBienFuncionarioActions(Funcionario);
    if (resultado) {
      Swal.fire({
        icon: "success",
        title: "Envio exitoso",
        text: "Se ha registrado con éxito!",
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un problema al enviar el registro.",
      });
    }
  };

  return (
    <Layout>
      <div className="border-bottom shadow-sm p-4 rounded">
        <h3 className="form-title fw-semibold border-bottom p-1">
          Registro Bienes de Funcioanarios
        </h3>
        <form onSubmit={handleFormSubmit}>
          <Row>
            <Col md={6}>
              <div className="mb-1">
                <dt className="text-muted">Rut Funcionario</dt>
                <div className="d-flex align-items-center">
                  <input
                    type="text"
                    className={`form-control ${
                      error.rutFuncionario ? "is-invalid" : ""
                    } w-100`}
                    maxLength={12}
                    name="rutFuncionario"
                    onChange={handleChange}
                    value={Funcionario.rutFuncionario}
                  />
                </div>
              </div>
              <div className="mb-1">
                <dt className="text-muted">Servicio</dt>
                <dd className="d-flex align-items-center">
                  <select
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
                </dd>
              </div>
              <div className="mb-1">
                <dt className="text-muted">Dependencia</dt>
                <dd className="d-flex align-items-center">
                  <select
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
                </dd>
              </div>
            </Col>
            <Col md={6}>
              <div className="mb-1">
                <dt className="text-muted">Subir archivos</dt>
                <dd className="d-flex align-items-center">
                  <div
                    className={`dropzone ${isDragging ? "dragging" : ""}`}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onClick={() =>
                      document.getElementById("fileInput")?.click()
                    }
                  >
                    {selectedFile1 && selectedFile2 ? (
                      <p>
                        Archivos seleccionados: {selectedFile1.name},{" "}
                        {selectedFile2.name}
                      </p>
                    ) : (
                      <p>
                        Arrastra y suelta los archivos aquí, o haz clic para
                        seleccionar dos archivos
                      </p>
                    )}
                  </div>
                  <input
                    type="file"
                    // onChange={handleFileChange}
                    id="fileInput"
                    className="file-input"
                    multiple
                  />
                </dd>
              </div>
              <div className="mb-1">
                <dt className="text-muted">Subir archivos</dt>
                <dd className="d-flex align-items-center">
                  <div
                    className={`dropzone ${isDragging ? "dragging" : ""}`}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onClick={() =>
                      document.getElementById("fileInput")?.click()
                    }
                  >
                    {selectedFile1 && selectedFile2 ? (
                      <p>
                        Archivos seleccionados: {selectedFile1.name},{" "}
                        {selectedFile2.name}
                      </p>
                    ) : (
                      <p>
                        Arrastra y suelta los archivos aquí, o haz clic para
                        seleccionar dos archivos
                      </p>
                    )}
                  </div>
                  <input
                    type="file"
                    // onChange={handleFileChange}
                    id="fileInput"
                    className="file-input"
                    multiple
                  />
                </dd>
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
})(FormInventarioFuncionario);
