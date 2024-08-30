import '../../styles/Login.css';

interface Props {

}

const ClaveUnica: React.FC<Props> = ({}) => {

    return (        
        <div className="container d-flex justify-content-center align-items-center min-v0">
            <div className="col-12 col-md-8 border p-4 rounded shadow-sm bg-white">
                <h1 className="form-heading">Sistema de Inventario</h1>
                <p className="form-heading fs-09em">
                    Sistema de apoyo en la gestión administrativa, Servicio de Salud Metropolitano Sur Oriente 
                    Departamento de Informática Unidad de Desarrollo 2020
                </p>
                <div className="p-4 rounded shadow-sm bg-white d-flex justify-content-center">
                    {/* <a href="claveunica" className="btn btn-primary">
                        Clave Única
                    </a> */}
                       <a href="/Login" className="btn btn-primary">
                        Clave Única
                    </a>
                </div>
                <p className="botto-text">Diseñado por Departamento de Informática - Unidad de Desarrollo 2024</p>
            </div>
        </div>
      
    );
};

export default (ClaveUnica);
