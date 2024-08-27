

import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../../redux/reducers"; // Asegúrate de ajustar la ruta al archivo donde defines RootState

// Define una interfaz para las props que el componente podría recibir
interface FooterProps extends PropsFromRedux {}

// Define el componente Navbar tipado con las props
const Footer: React.FC<FooterProps> = () => {
    return (
        <nav>Footer</nav>
    );
};

// Mapea el estado al componente (en este caso vacío)
const mapStateToProps = (state: RootState) => ({});

// Si tienes funciones que quieres mapear, las añades aquí
const mapDispatchToProps = {};

// Conecta el componente a Redux y tipa las props correctamente
const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(Footer);