import 'bootstrap/dist/css/bootstrap.min.css'; 

import React from 'react'; 

// Define el tipo de props para el componente
export interface Button_BackProps {  
    onBack: () => void;    
}

const Button_back: React.FC<Button_BackProps> = ({onBack}) => {
   
    const handleBack = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();   
        onBack();
      };

    return (
    <div className="p-1 rounded bg-white d-flex justify-content-between">              
        <button onClick={handleBack} className="btn btn-primary m-1">Volver</button>                     
    </div>          
    );
};

export default (Button_back);
