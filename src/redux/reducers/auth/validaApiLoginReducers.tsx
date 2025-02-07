import {
  VALIDA_PORTAL_REQUEST,
  VALIDA_PORTAL_SUCCESS,
  VALIDA_PORTAL_FAIL,
} from "../../actions/auth/types";

// Define la estructura del estado
interface AuthState {
  Objeto: Array<{
    IdCredencial: number;
    Nombre: string;
    Apellido1: string;
    Apellido2: string;
    Correo: string;
    Rut: string;
    Dv: string;
    NombreUsuario: string;
    Roles: Array<{
      NombreRol: string;
      Descripcion: string;
      IdRol: number;
      IdAplicacion: number;
      CodigoEstablicimiento: number;
      NombreEstablecimiento: string;
      NombreCompletoEstab: boolean;
      IdAppChild: number;
    }>;

  }>;
  error: string | null;
  isAuthenticated: boolean | null;
}

// Estado inicial
const initialState: AuthState = {
  Objeto: [
    {
      IdCredencial: 0,
      Nombre: "",
      Apellido1: "",
      Apellido2: "",
      Correo: "",
      Rut: "",
      Dv: "",
      NombreUsuario: "",
      Roles: [
        {
          NombreRol: "",
          Descripcion: "",
          IdRol: 0,
          IdAplicacion: 0,
          CodigoEstablicimiento: 0,
          NombreEstablecimiento: "",
          NombreCompletoEstab: false,
          IdAppChild: 0,
        },
      ],
    },
  ],
  error: null,
  isAuthenticated: false,
};


function validaApiLoginReducers(state = initialState, action: any): AuthState {
  switch (action.type) {
    case VALIDA_PORTAL_REQUEST:
      return { ...state, error: null };
    case VALIDA_PORTAL_SUCCESS:
      return { ...state, isAuthenticated: true };
    case VALIDA_PORTAL_FAIL:
      return { ...state, isAuthenticated: false, error: action.payload, };
    default:
      return state;
  }
}
export default validaApiLoginReducers;
