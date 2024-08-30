import React, { ReactNode, Fragment, useState } from "react";
import { connect, ConnectedProps } from "react-redux";
import { Link } from 'react-router-dom';
import Sidebar from "../../components/navigation/Sidebar";
import Navbar from "../../components/navigation/Navbar";


interface LayoutProps {
    children: ReactNode;
}

function Layout({ children }: LayoutProps) {


    return (
         <>   
          <div className="d-flex">  
               <Navbar/>  
         </div>
                      
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
                <div className="flex-1 d-md-flex flex-column ">     
                    <main className="d-flex">
                            <div className="container p-1">
                               {/* Aquí renderiza los Componentes*/}    
                               {children} 
                            </div>                      
                    </main>
                </div>
            </div>

         
        </>
    );
}

const mapStateToProps = (state: any) => ({   
});

// Tipos de las props conectadas con `connect`
const connector = connect(mapStateToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(Layout);
