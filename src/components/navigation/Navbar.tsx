import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';


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
            <div className="container-fluid">
                <NavLink className="navbar-brand" to="/">SSMSO</NavLink>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
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
            </div>
        </nav>
    );
}

export default Navbar;