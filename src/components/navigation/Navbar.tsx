import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Sun, Moon } from 'react-bootstrap-icons';

function Navbar() {
    const [darkMode, setDarkMode] = useState(false);
    const [utm, setUtm] = useState('50.000');
  

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

    useEffect(() => {
        if (darkMode) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    }, [darkMode]);

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    return (
        <nav id="navbar" className="navbar navbar-expand-lg navbar-light">
            <div className="container-fluid">
                <NavLink className="navbar-brand" to="/">SSMSO</NavLink>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
                    <div className="navbar-nav mb-2 mb-lg-0 me-3">                       
                        <p className="nav-item nav-link mb-0">
                            <strong>UTM:</strong> {utm}
                        </p>
                        <p className="nav-item nav-link mb-0">
                            <strong>UTM:</strong> {utm}
                        </p>
                        <p className="nav-item nav-link mb-0">
                            <strong>UTM:</strong> {utm}
                        </p>
                    </div>
                   
                </div>
            </div>
        </nav>
    );
}

export default Navbar;