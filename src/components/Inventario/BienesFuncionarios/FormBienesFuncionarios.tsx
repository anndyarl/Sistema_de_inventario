import React, { useState } from 'react';
import '../../../styles/BienesFuncionario.css';
import Layout from "../../../hooks/layout/Layout";

const FileDropzone = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile1, setSelectedFile1] = useState<File | null>(null);
  const [selectedFile2, setSelectedFile2] = useState<File | null>(null);

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

  return (
    <Layout>
      <strong>Ingeso de Bienes del Funcionario</strong>
      {/* <div
        className="file-upload"
        style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '5px' }}
      > */}
      <form /* onSubmit={handleFormSubmit}*/>
        {/* Inputs agregados */}
        <div className="input-container">
          <label className="form-label">Rut Funcionario</label>
          <input
            type="text"
            // value={inputValue1}
            // onChange={(e) => setInputValue1(e.target.value)}
            className="form-control"
            placeholder="Ingrese rut del funcionario"
          />
          <label className="form-label">Destino</label>
          <input
            type="text"
            // value={inputValue2}
            // onChange={(e) => setInputValue2(e.target.value)}
            className="form-control"
            placeholder="Ingrese el destino del bien"
          />
        </div>
        {/* Funcionalidad para subir archivos */}
        <label className="form-label">Subir archivos</label>
        <div
          className={`dropzone ${isDragging ? 'dragging' : ''}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => document.getElementById('fileInput')?.click()}
        >
          {selectedFile1 && selectedFile2 ? (
            <p>
              Archivos seleccionados: {selectedFile1.name}, {selectedFile2.name}
            </p>
          ) : (
            <p>Arrastra y suelta los archivos aquí, o haz clic para seleccionar dos archivos</p>
          )}
        </div>
        <input
          type="file"
          // onChange={handleFileChange}
          id="fileInput"
          className="file-input"
          multiple
        />
        <button type="button" /*onClick={handleFileSubmit} */ className="submit-button">
          Enviar archivos
        </button>
        {/* <button type="submit" className="submit-button">
            Enviar formulario completo
          </button> */}
      </form>
      {/* </div> */}
    </Layout>

  );
};

export default FileDropzone;
