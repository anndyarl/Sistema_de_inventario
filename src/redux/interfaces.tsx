
// Definición del tipo para datosPersona
export interface RolUnico {
    DV: string;
    numero: string; // o el tipo adecuado para `numero`
    tipo: string;
  }
  
  export interface Nombre {
    apellidos: string[];
    nombres: string[];
  }
  
  export interface DatosPersona {
    RolUnico: RolUnico;
    sub: string;
    name: Nombre;
  }