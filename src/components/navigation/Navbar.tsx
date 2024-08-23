import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../../redux/reducers"; // Asegúrate de ajustar la ruta al archivo donde defines RootState
import { Link, NavLink } from "react-router-dom";

// Define una interfaz para las props que el componente podría recibir
interface NavbarProps extends PropsFromRedux {}

// Define el componente Navbar tipado con las props
const Navbar: React.FC<NavbarProps> = () => {
    return (
         <nav data-scroll data-scroll-id="hey" id='navbar'  className='w-full py-6 top-0 transition duration-300 ease-in-out z-40 fixed'>
            <div className="px-4 sm:px-6">
                <div className="-ml-4 -mt-2 hidden lg:flex flex-wrap items-center justify-between sm:flex-nowrap md:px-14 px-2">
                    <Link to='/' className="ml-4 mt-2">
                    {/* <img
                        src={'https://bafybeiczl4dcxupma2zeyilkukfl4yge64axnhajd722wxgin62mtts6uy.ipfs.w3s.link/murkivamarketing.png'}
                        width={160}
                        height={160}
                        className=""
                    /> */}
                    </Link>
                    <div className="ml-4 mt-2 flex-shrink-0">
                    <NavLink to='/Inventario' className="text-lg inline-flex font-medium leading-6 text-gray-900 border-b-2 border-white hover:border-orange-500 transition duration-300 ease-in-out mx-4 bg-orange-200 px-4 py-2 rounded-md">Inventario</NavLink>
                    <NavLink to='/Traslados' className="text-lg inline-flex font-medium leading-6 text-gray-900 border-b-2 border-white hover:border-orange-500 transition duration-300 ease-in-out mx-4">Traslados</NavLink>
                    <NavLink to='/Altas' className="text-lg inline-flex font-medium leading-6 text-gray-900 border-b-2 border-white hover:border-orange-500 transition duration-300 ease-in-out mx-4">Altas</NavLink>
                    <NavLink to='/Bajas' className="text-lg inline-flex font-medium leading-6 text-gray-900 border-b-2 border-white hover:border-orange-500 transition duration-300 ease-in-out mx-4">Bajas</NavLink>
                    <NavLink to='/Donaciones' className="text-lg inline-flex font-medium leading-6 text-gray-900 border-b-2 border-white hover:border-orange-500 transition duration-300 ease-in-out mx-4">Donaciones</NavLink>
                    <NavLink to='/Informes' className="text-lg inline-flex font-medium leading-6 text-gray-900 border-b-2 border-white hover:border-orange-500 transition duration-300 ease-in-out mx-4">Informes</NavLink>
                    <NavLink to='/Configuración' className="text-lg inline-flex font-medium leading-6 text-gray-900 border-b-2 border-white hover:border-orange-500 transition duration-300 ease-in-out mx-4">Configuración</NavLink>
                                   
                    </div>
                </div>
               
            </div>
        </nav>
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
