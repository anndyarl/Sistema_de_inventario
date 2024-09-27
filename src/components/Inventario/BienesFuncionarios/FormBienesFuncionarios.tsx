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
  );
};

export default FileDropzone;
