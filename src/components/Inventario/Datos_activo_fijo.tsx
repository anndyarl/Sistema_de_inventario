
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useMemo } from 'react';
import { Modal, Button, Table, Form, Pagination, Row, Col } from 'react-bootstrap';

interface ActivoFijoData {
  id: string;
  vidaUtil: string;
  fechaIngreso: string;
  marca: string;
  cantidad: string;
  modelo: string;
  observaciones: string;
  serie: string;
  precio: string;

}

interface Datos_activo_fijoProps {
  onNext: (data: ActivoFijoData[]) => void;
  onBack: () => void; 

}

const Datos_activo_fijo: React.FC<Datos_activo_fijoProps> = ({ onNext, onBack }) => {
  const [activosFijos, setActivosFijos] = useState<ActivoFijoData[]>([]);
  const [currentActivo, setCurrentActivo] = useState<ActivoFijoData>({
    id: '',
    vidaUtil: '',
    fechaIngreso: '',
    marca: '',
    cantidad: '1',
    modelo: '',
    observaciones: '',
    serie: '',
    precio: '',
  });
  const [errors, setErrors] = useState<Partial<ActivoFijoData>>({});
  const [showModal, setShowModal] = useState(false);
  const [showModalConfirmar, setShowModalConfirmar] = useState(false);
  const [editingSerie, setEditingSerie] = useState<string | null>(null);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  //handleChange maneja actualizaciones en tiempo real campo por campo
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentActivo(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSerieChange = (index: number, newSerie: string) => {
    setActivosFijos(prevActivos => 
      prevActivos.map((activo, i) => 
        i === index ? { ...activo, serie: newSerie } : activo
      )
    );
  };

  const handleSerieBlur = () => {
    setEditingSerie(null);
  };

  const handleRowSelect = (index: number) => {
    setSelectedRows(prev => 
      prev.includes(index.toString()) ? prev.filter(rowIndex => rowIndex !== index.toString()) : [...prev, index.toString()]
    );
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedRows(currentItems.map((_, index) => (indexOfFirstItem + index).toString()));
    } else {
      setSelectedRows([]);
    }
  };

  const handleDeleteSelected = () => {
    const selectedIndices = selectedRows.map(Number);
    setActivosFijos(prev => prev.filter((_, index) => !selectedIndices.includes(index)));
    setSelectedRows([]);
  };

  const validate = () => {
    let tempErrors: Partial<ActivoFijoData> = {};
    if (!currentActivo.vidaUtil) tempErrors.vidaUtil = "Vida útil es obligatoria.";
    if (!/^\d+$/.test(currentActivo.vidaUtil)) tempErrors.vidaUtil = "Vida útil debe ser un número.";
    if (!currentActivo.fechaIngreso) tempErrors.fechaIngreso = "Fecha de Ingreso es obligatoria.";
    if (!currentActivo.marca) tempErrors.marca = "Marca es obligatoria.";
    if (!currentActivo.cantidad) tempErrors.cantidad = "Cantidad es obligatoria.";
    if (!/^\d+$/.test(currentActivo.cantidad)) tempErrors.cantidad = "Cantidad debe ser un número.";
    if (!currentActivo.precio) tempErrors.precio = "Precio es obligatorio.";
    if (!/^\d+(\.\d{1,2})?$/.test(currentActivo.precio)) tempErrors.precio = "Precio debe ser un número válido con hasta dos decimales.";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validate()) {
      const cantidad = parseInt(currentActivo.cantidad, 10);
      const newActivos = Array.from({ length: cantidad }, () => ({
        ...currentActivo,
        id: '1', // Mismo ID para todos los activos
      }));
      setActivosFijos(prev => [...prev, ...newActivos]);
      setCurrentActivo({
        id: '',
        vidaUtil: '',
        fechaIngreso: '',
        marca: '',
        cantidad: '1',
        modelo: '',
        observaciones: '',
        serie: '',
        precio: '',
      });
      setShowModal(false);   
    }
  };

  const handleClone = (activo: ActivoFijoData) => {
    const clonedActivo = { ...activo };
    setActivosFijos(prev => [...prev, clonedActivo]);
  };

  // const handleDelete = (index: number) => {
  //   setActivosFijos(prev => prev.filter((_, i) => i !== index));
  // };

  const handleFinalSubmit = () => {
    onNext(activosFijos);
  };

  const handleBack = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();   
    onBack();
  };
 
  const handleShowModal = () => {
    setShowModalConfirmar(true); 
  };


  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = useMemo(() => activosFijos.slice(indexOfFirstItem, indexOfLastItem), [activosFijos, indexOfFirstItem, indexOfLastItem]);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(activosFijos.length / itemsPerPage);
 
  return (
      <div className="border-top p-1 rounded">
        <h3 className="form-title mb-4">Datos Activo Fijo</h3>

        <Button variant="primary" onClick={() => setShowModal(true)} className="mb-3 me-2">
          + 
        </Button> 
        {selectedRows.length > 0 && (
          <Button variant="danger" onClick={handleDeleteSelected} className="mb-3">
            Eliminar Seleccionados
          </Button>
        )}

        <Table striped bordered hover>
          <thead>
            <tr>
              <th>
                <Form.Check type="checkbox" onChange={handleSelectAll} checked={selectedRows.length === currentItems.length && currentItems.length > 0} />
              </th>
              <th>Vida Útil</th>
              <th>Fecha Ingreso</th>
              <th>Marca</th>
              <th>Modelo</th>
              <th>Serie</th>
              <th>Precio</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((activo, index) => (
              <tr key={indexOfFirstItem + index}>
                <td>
                  <Form.Check type="checkbox" onChange={() => handleRowSelect(indexOfFirstItem + index)} checked={selectedRows.includes((indexOfFirstItem + index).toString())} />
                </td>
                <td>{activo.vidaUtil}</td>
                <td>{activo.fechaIngreso}</td>
                <td>{activo.marca}</td>
                <td>{activo.modelo}</td>
                <td onClick={() => setEditingSerie((indexOfFirstItem + index).toString())}>
                  {editingSerie === (indexOfFirstItem + index).toString() ? (
                    <Form.Control type="text" value={activo.serie} onChange={(e) => handleSerieChange(indexOfFirstItem + index, e.target.value)} onBlur={handleSerieBlur} autoFocus />
                  ) : (
                    activo.serie || 'editar'
                  )}
                </td>
                <td>{activo.precio}</td>
                <td>
                  <Button variant="outline-secondary" size="sm" onClick={() => handleClone(activo)} className="me-2">
                    Clonar
                  </Button>
                  {/* <Button variant="outline-danger" size="sm" onClick={() => handleDelete(indexOfFirstItem + index)}>
                    Eliminar
                  </Button> */}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

         {/* Paginador*/}    
       <Pagination>
          <Pagination.First onClick={() => paginate(1)} disabled={currentPage === 1} />
          <Pagination.Prev onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} />
          {Array.from({ length: totalPages }, (_, i) => (
            <Pagination.Item key={i + 1} active={i + 1 === currentPage} onClick={() => paginate(i + 1)}>
              {i + 1}
            </Pagination.Item>
          ))}
          <Pagination.Next onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} />
          <Pagination.Last onClick={() => paginate(totalPages)} disabled={currentPage === totalPages} />
        </Pagination>

   

        <div className="d-flex mt-3 justify-content-between">
           <button onClick={handleBack} className="btn btn-primary m-1">Volver</button>          
          <Button variant="btn btn-primary m-1" onClick={handleShowModal}>Confirmar</Button>
        </div>     


         {/* Modal formulario Activos Fijo*/}    
        <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Agregar Activo Fijo</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={handleSubmit}>
              <Row>
                <div className="d-flex justify-content-end ">
                <Button variant="secondary" onClick={() => setShowModal(false)} className="me-2">
              Cancelar
            </Button>
            <Button type="submit" variant="primary">
              Agregar
            </Button>
                </div>
                <Col md={6}>

                  <div className="mb-3">
                    <label htmlFor="vidaUtil" className="form-label">Vida Útil</label>
                    <input type="text" className={`form-control ${errors.vidaUtil ? 'is-invalid' : ''}`} id="vidaUtil" name="vidaUtil" onChange={handleChange} value={currentActivo.vidaUtil} />
                    {errors.vidaUtil && <div className="invalid-feedback">{errors.vidaUtil}</div>}
                  </div>

                  <div className="mb-3">
                    <label htmlFor="fechaIngreso" className="form-label">Fecha Ingreso</label>
                    <input type="date" className={`form-control ${errors.fechaIngreso ? 'is-invalid' : ''}`} id="fechaIngreso" name="fechaIngreso" onChange={handleChange} value={currentActivo.fechaIngreso} />
                    {errors.fechaIngreso && <div className="invalid-feedback">{errors.fechaIngreso}</div>}
                  </div>

                  <div className="mb-3">
                    <label htmlFor="marca" className="form-label">Marca</label>
                    <input type="text" className={`form-control ${errors.marca ? 'is-invalid' : ''}`} id="marca" name="marca" onChange={handleChange} value={currentActivo.marca} />
                    {errors.marca && <div className="invalid-feedback">{errors.marca}</div>}
                  </div>

                  <div className="mb-3">
                    <label htmlFor="modelo" className="form-label">Modelo</label>
                    <input type="text" className="form-control" id="modelo" name="modelo" onChange={handleChange} value={currentActivo.modelo} />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="serie" className="form-label">Serie</label>
                    <input type="text" className="form-control" id="serie" name="serie" onChange={handleChange} value={currentActivo.serie} />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="precio" className="form-label">Precio</label>
                    <input type="text" className={`form-control ${errors.precio ? 'is-invalid' : ''}`} id="precio" name="precio" onChange={handleChange} value={currentActivo.precio} />
                    {errors.precio && <div className="invalid-feedback">{errors.precio}</div>}
                  </div>
                </Col>
                
                <Col md={6}>
                  <div className="mb-3">
                    <label htmlFor="cantidad" className="form-label">Cantidad</label>
                    <input type="text" className={`form-control ${errors.cantidad ? 'is-invalid' : ''}`} id="cantidad" name="cantidad" onChange={handleChange} value={currentActivo.cantidad} />
                    {errors.cantidad && <div className="invalid-feedback">{errors.cantidad}</div>}
                  </div>

                  <div className="mb-3">
                    <label htmlFor="observaciones" className="form-label">Observaciones</label>
                    <textarea className="form-control" id="observaciones" name="observaciones" rows={15} style={{ minHeight: '382px', resize: 'none' }} onChange={handleChange} value={currentActivo.observaciones} />
                  </div>
                </Col>
              </Row>
            </form>
          </Modal.Body>
        </Modal>        

          {/* Modal  Confirmar */}    
          <Modal show={showModalConfirmar} onHide={() => setShowModalConfirmar(false)} size="xl">
          <Modal.Header closeButton>
            <Modal.Title>
            <svg xmlns="http://www.w3.org/2000/svg" width="29" height="29" fill="currentColor" className="bi bi-exclamation-circle mr-1 mb-1" viewBox="0 0 16 16">
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
            <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0M7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0z"/>
          </svg>
              </Modal.Title>
          </Modal.Header>
          <Modal.Body>
           
                <p className="form-heading fs-09em">
                  Confirmar el envio del formualrio completo
                </p>              
                <form  onSubmit={handleSubmit}>   
                   <div className="form-group d-flex justify-content-center">                                  
                   <div className="form-group d-flex justify-content-center">   
                      <Button variant="btn btn-primary m-1" onClick={handleFinalSubmit}>Confirmar y Enviar</Button>
                      <Button variant="btn btn-secondary m-1" onClick={() => setShowModalConfirmar(false)} className="me-2">Cancelar</Button>      
                    </div>  
                    </div>
                </form>              
      
          </Modal.Body>
        </Modal>
  
      </div> 
  );
};

export default Datos_activo_fijo;