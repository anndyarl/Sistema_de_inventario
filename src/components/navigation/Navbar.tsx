import React, { useEffect } from 'react';
import Logout from './Logout';

function Navbar() {

    useEffect(() => {
        const handleScroll = () => {
            const navbar = document.getElementById('navbar');
            if (navbar) {
                if (window.scrollY > 50) {
                    navbar.classList.add('shadow-navbar', 'bg-white');
                } else {
                    navbar.classList.remove('shadow-navbar', 'bg-white');
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);


    return (
        <nav id="navbar" className="navbar navbar-expand-lg navbar-light ">
            <div className="container-fluid border-bottom">
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse justify-content-start" id="navbarNav">
                    <div className="navbar-nav mb-2 mb-lg-0 me-3">

                        <p className="nav-item nav-link mb-0">
                            <strong>UTM:</strong> $47.396
                        </p>
                        <p className="nav-item nav-link mb-0">
                            <strong>Dependencia:</strong> Finanzas
                        </p>
                        <p className="nav-item nav-link mb-0">
                            <strong>Establecimiento:</strong> Hopital San jose de Maipo
                        </p>
                    </div>
                </div>
                <div className="d-flex justify-content-end align-items-center">
                    {/*Logout */}
                    <div className="dropdown">
                        <a
                            className="btn btn-border-none  outline-none dropdown-toggle"
                            type="button"
                            id="userDropdown"
                            data-bs-toggle="dropdown"
                            aria-haspopup="true"
                            aria-expanded="false"
                        >
                            <i className="fa fa-user"></i>
                            <strong className="fs-6 ">Andy Riquelme</strong>
                        </a>
                        <div className="dropdown-menu" aria-labelledby="userDropdown">
                            <Logout />
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;