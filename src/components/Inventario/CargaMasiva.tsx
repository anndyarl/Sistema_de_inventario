import React, { useRef, useState } from "react";
import Layout from "../../containers/hocs/layout/Layout";
import { FileEarmarkArrowDown } from "react-bootstrap-icons";
import MenuInventario from "../Menus/MenuInventario";
import { RootState } from "../../store";
import { connect } from "react-redux";
import { Helmet } from "react-helmet-async";


interface AdjuntoProps {
  archivoExcel: string;
  isDarkMode: boolean;
}

const CargaMasiva: React.FC<AdjuntoProps> = ({ isDarkMode }) => {

  const fileInputRefArchivoExcel = useRef<HTMLInputElement>(null);
  const [selectedArchivoExcel, setSelectedArchivoExcel] = useState<File | null>(null);
  const [isDraggingAutorizacion, setIsDraggingAutorizacion] = useState(false);
  const [error, setError] = useState<Partial<AdjuntoProps> & {}>({});
  const [__, setAdjunto] = useState({ archivoExcel: "" });
  const validate = () => {
    let tempErrors: Partial<any> & {} = {};
    const allowedTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];

    // Validación de archivos: autorizacion
    if (!selectedArchivoExcel) {
      tempErrors.archivoExcel =
        "Debe adjuntar el archivo excel para la carga masiva de inventarios";
    } else if (!allowedTypes.includes(selectedArchivoExcel.type)) {
      tempErrors.archivoExcel = "Solo se permiten archivos xlsx.";
    }

    setError(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };
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
      setSelectedArchivoExcel(file);

      // Actualiza el estado del funcionario con el archivo en el campo comprobanteDePago
      setAdjunto((prevAdjunto) => ({
        ...prevAdjunto,
        file: file.name,
      }));
    }
  };
  //Adjuntar por click
  const handleFileSelectAutorizacion = () => {
    if (fileInputRefArchivoExcel.current) {
      fileInputRefArchivoExcel.current.click();
    }
  };
  //----------------Fin Autorización --------------//
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setAdjunto((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    // Verificar si es un input de tipo "archivoExcel" y si tiene archivos seleccionados
    if (e.target instanceof HTMLInputElement && e.target.type === "file") {
      const file = e.target.files?.[0];
      if (file) {
        // Si el archivo es válido, establecerlo en el estado correspondiente
        if (name === "archivoExcel") {
          setSelectedArchivoExcel(file);
          setError({ ...error, archivoExcel: "" }); // Limpiar errores si el archivo es válido
        }
      }
    }
  };
  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validate()) {
      // console.log("archivo excel", Adjunto);

      // const resultado = await cargaMasivaActions(Adjunto.file);

      // if (resultado) {
      //   Swal.fire({
      //     icon: "success",
      //     title: "Envío exitoso",
      //     text: "¡Se ha registrado con éxito!",
      //   });
      // } else {
      //   Swal.fire({
      //     icon: "error",
      //     title: "Error",
      //     text: "Hubo un problema al enviar el registro.",
      //   });
      // }
    }
  };
  const handleDescargaExcel = () => {
    const excelTemplateUrl = "/test_carga_masiva600.xlsx"; //Ubicación del archivo fisico

    // Crea un elemento de anclaje temporal
    const link = document.createElement("a"); //Crea un elemento <a> en el DOM.
    link.href = excelTemplateUrl; //Establece la URL (href) del archivo que se desea descargar.
    link.download = "test_carga_masiva600.xlsx"; // Define el nombre del archivo

    // Añade al cuerpo, hacer clic programáticamente y eliminar
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Layout>
      <Helmet>
        <title>Carga Masiva</title>
      </Helmet>
      <MenuInventario />
      <div className="border-bottom shadow-sm p-4 rounded">
        <h3 className="form-title fw-semibold border-bottom p-1">
          Registro de cargas masivas
        </h3>
        <form onSubmit={handleFormSubmit}>
          <div className="mb-1">
            <label className="fw-semibold">Descargar plantilla Excel</label>
            <div className="d-flex align-items-center">
              <button
                onClick={handleDescargaExcel}
                className="btn btn-success d-flex align-items-center justify-content-center"
                title="Descargar plantilla Excel"              >
                <FileEarmarkArrowDown className="h-5 w-5 m-1" aria-hidden="true" />

              </button>
            </div>
          </div>

          <div className="mb-1">
            <div className="d-flex align-items-center ">
              <div
                className={`dropzone ${isDraggingAutorizacion ? "dragging" : ""
                  }`}
                onDrop={handleDropAutorizacion}
                onDragOver={handleDragOverAutorizacion}
                onClick={handleFileSelectAutorizacion}
              >
                {selectedArchivoExcel ? (
                  <p>Archivo seleccionado: {selectedArchivoExcel.name}</p>
                ) : (
                  <p>
                    Arrastra y suelta el archivo aquí, o haz clic para
                    seleccionar
                  </p>
                )}
              </div>
              <input
                aria-label="Archivo de autorización"
                type="file"
                ref={fileInputRefArchivoExcel} // Asigna la referencia al input
                className={`file-input ${error.archivoExcel ? "is-invalid" : ""} w-100`}
                name="archivoExcel"
                onChange={handleChange}
                value=""
              />
            </div>
            {error.archivoExcel && (
              <div className="invalid-feedback fw-semibold d-block">
                {error.archivoExcel}
              </div>
            )}
          </div>

          <div className="p-1 rounded d-flex justify-content-center ">
            <button type="submit" className={`btn ${isDarkMode ? "btn-secondary" : "btn-primary"}`}>
              Enviar
            </button>
          </div>
        </form>
      </div>

    </Layout>
  );
};

//mapea los valores del estado global de Redux
const mapStateToProps = (state: RootState) => ({
  isDarkMode: state.darkModeReducer.isDarkMode
});

export default connect(mapStateToProps, {

})(CargaMasiva);

