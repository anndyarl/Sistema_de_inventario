import {
  VALIDA_PORTAL_REQUEST,
  VALIDA_PORTAL_SUCCESS,
  VALIDA_PORTAL_FAIL,
} from "../../actions/auth/types";

interface Roles {
  NombreRol: string;
  Descripcion: string;
  IdRol: number;
  IdAplicacion: number;
  CodigoEstablicimiento: number;
  NombreEstablecimiento: string;
  NombreCompletoEstab: boolean;
  IdAppChild: number;
}

interface AuthState {
  IdCredencial: number;
  Nombre: string;
  Apellido1: string;
  Apellido2: string;
  Correo: string;
  Rut: string;
  Dv: string;
  NombreUsuario: string;
  Roles: Roles[];
  error: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  IdCredencial: 0,
  Nombre: "",
  Apellido1: "",
  Apellido2: "",
  Correo: "",
  Rut: "",
  Dv: "",
  NombreUsuario: "",
  Roles: [],
  error: null,
  isAuthenticated: false,
};

function validaApiLoginReducers(state = initialState, action: any): AuthState {
  switch (action.type) {
    case VALIDA_PORTAL_REQUEST:
      return { ...state, error: null };

    case VALIDA_PORTAL_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        IdCredencial: action.payload.idCredencial,
        Nombre: action.payload.nombre,
        Apellido1: action.payload.apellido1,
        Apellido2: action.payload.apellido2,
        Correo: action.payload.correo,
        Roles: action.payload.roles
          ? action.payload.roles.map((rol: any) => ({
            NombreRol: rol.nombre,
            Descripcion: rol.descripcion,
            IdRol: rol.idRol,
            IdAplicacion: rol.idAplicacion,
            CodigoEstablicimiento: 0, // Ajusta estos valores si los necesitas
            NombreEstablecimiento: "",
            NombreCompletoEstab: false,
            IdAppChild: 0,
          }))
          : [],
      };

    case VALIDA_PORTAL_FAIL:
      return { ...state, isAuthenticated: false, error: action.payload };

    default:
      return state;
  }
}

export default validaApiLoginReducers;
