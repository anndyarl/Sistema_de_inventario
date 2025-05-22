import {
  VALIDA_PORTAL_REQUEST,
  VALIDA_PORTAL_SUCCESS,
  VALIDA_PORTAL_FAIL,
  COMBO_PROFILE_ESTABLECIMIENTO_FAIL
} from "../../actions/auth/types";

interface Roles {
  NombreRol: string;
  Descripcion: string;
  IdRol: number;
  IdAplicacion: number;
  codigoEstablecimiento: number;
  nombreEstablecimiento: string;
}

interface AuthState {
  IdCredencial: number;
  Nombre: string;
  Apellido1: string;
  Apellido2: string;
  Correo: string;
  Roles: Roles[];
  Establecimiento: number;
  usr_run: string;
  error: string | null;
  isAuthenticated: boolean;
  token: string | null;
  loading: boolean;
}

const initialState: AuthState = {
  IdCredencial: 0,
  Nombre: "",
  Apellido1: "",
  Apellido2: "",
  Correo: "",
  usr_run: "",
  Establecimiento: 0,
  Roles: [],
  error: null,
  isAuthenticated: false,
  token: null,
  loading: false,
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
            codigoEstablecimiento: rol.codigoEstablicimiento,
            nombreEstablecimiento: rol.nombreEstablecimiento
          }))
          : [],
        usr_run: action.payload.usr_run
      };
    case VALIDA_PORTAL_FAIL:
      return { ...state, isAuthenticated: false, error: action.payload, token: null, loading: false };
    case COMBO_PROFILE_ESTABLECIMIENTO_FAIL:
      return { ...initialState, isAuthenticated: false, token: null };
    default:
      return state;
  }
}

export default validaApiLoginReducers;
