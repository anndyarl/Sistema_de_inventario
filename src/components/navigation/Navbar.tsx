import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../../redux/reducers"; // Asegúrate de ajustar la ruta al archivo donde defines RootState
import { Link, NavLink } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css'; // Importa Bootstrap si no lo has hecho ya

// Define una interfaz para las props que el componente podría recibir
interface NavbarProps extends PropsFromRedux {}

// Define el componente Navbar tipado con las props
const Navbar: React.FC<NavbarProps> = () => {
    return (
        <div className="d-flex">
            <div className="bg-light border-right" id="sidebar">
                <div className="sidebar-header">
                    <Link to="/" className="d-flex align-items-center justify-content-center py-4">
                        {/* Aquí puedes agregar un logo o imagen */}
                        {/* <img
                            src={'https://bafybeiczl4dcxupma2zeyilkukfl4yge64axnhajd722wxgin62mtts6uy.ipfs.w3s.link/murkivamarketing.png'}
                            width={160}
                            height={160}
                            className=""
                        /> */}
                    </Link>
                </div>
                <div className="list-group">
                    <NavLink to="/Inventario" className="list-group-item list-group-item-action">Inventario</NavLink>
                    <NavLink to="/Traslados" className="list-group-item list-group-item-action">Traslados</NavLink>
                    <NavLink to="/Altas" className="list-group-item list-group-item-action">Altas</NavLink>
                    <NavLink to="/Bajas" className="list-group-item list-group-item-action">Bajas</NavLink>
                    <NavLink to="/Donaciones" className="list-group-item list-group-item-action">Donaciones</NavLink>
                    <NavLink to="/Informes" className="list-group-item list-group-item-action">Informes</NavLink>
                    <NavLink to="/Configuracion" className="list-group-item list-group-item-action">Configuración</NavLink>
                </div>
            </div>
            <div className="container-fluid">
                {/* Aquí iría el contenido principal de tu aplicación */}
            </div>
        </div>
    );
};

// Mapea el estado al componente (en este caso vacío)
const mapStateToProps = (state: RootState) => ({});

// Si tienes funciones que quieres mapear, las añades aquí
const mapDispatchToProps = {};

// Conecta el componente a Redux y tipa las props correctamente
const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(Navbar);
