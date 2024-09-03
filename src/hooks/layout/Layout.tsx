import React, { ReactNode, useEffect } from "react";
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '../../redux/reducers';
import Sidebar from "../../components/navigation/Sidebar";
import Navbar from "../../components/navigation/Navbar";
// import { setToken } from '../../redux/actions/auth/auth'; // Asegúrate de que la acción esté importada correctamente
import { Link } from "react-router-dom";

interface OwnProps {
  children: ReactNode;
}

// Define el componente Layout
const Layout: React.FC<PropsFromRedux & OwnProps> = ({ children, isAuthenticated }) =>
{  
    // Si no está autenticado, puedes redirigir o mostrar un mensaje
    if (!isAuthenticated) {
        return  <div className="container d-flex justify-content-center align-items-center vh-100">
                <div className="col-12 col-md-8 border p-4 rounded shadow-sm bg-white">
                    <h1 className="form-heading">Sesión expirada</h1>
                    <p className="form-heading fs-09em">
                           No está autenticado. Por favor, inicie sesión nuevamente.
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
    }
    return (
        <>                        
                {/* Layout Container */}              
                <div className="d-flex">    
               
                    {/* Static Sidebar for Desktop */} 
                    <div className="d-none d-md-flex flex-column fixed-left w-20 h-botton border-right bg-color z-index-1">     
                     
                        <div className="flex-1 overflow-auto pt-3 pb-3">                              
                            <div className="logo-container">
                                <Link to="/" className="m-2 mt-2">
                                <img src="" alt="SSMSO LOGO" width={160} height={160} />
                                </Link>
                            </div>    
                           
                            <nav className="mt-5">                         
                                <Sidebar />
                            </nav>
                        </div>
                    </div>                     
                    {/* Main Content Area */}                                    
                    <div className="d-flex w-100 justify-content-center">   
                        <main className="d-flex p-1 w-75">                       
                                <div>
                                 <Navbar/>  
                                {/* Aquí renderiza los Componentes*/}    
                                {children} 
                                </div>                      
                        </main>
                    </div>
                </div>

            
        </>
    );
};


// Define la función mapStateToProps que mapea el estado global de Redux a las props del componente
const mapStateToProps = (state: RootState) => ({
  // Mapea la propiedad isAuthenticated desde el estado de autenticación a las props del componente
  isAuthenticated: state.auth.isAuthenticated,

  // Mapea el token desde el estado de autenticación a las props del componente
//   token: state.auth.token, 
});

// Define la función mapDispatchToProps para despachar acciones a Redux desde el componente
const mapDispatchToProps = { 
  // Asocia la acción setToken con las props del componente para poder actualizar el token en el estado global
//   setToken,
};

// Conecta el componente a Redux utilizando las funciones mapStateToProps y mapDispatchToProps
const connector = connect(mapStateToProps, mapDispatchToProps);

// Define un tipo para las props derivadas de la conexión a Redux
type PropsFromRedux = ConnectedProps<typeof connector>;

// Exporta el componente conectado, permitiéndole acceder al estado global y despachar acciones
export default connector(Layout);

