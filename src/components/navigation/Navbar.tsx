import React, { useEffect } from 'react';
import Profile from './Profile';

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
        <nav id="navbar" className="navbar navbar-expand-lg navbar-light justify-content-end">
            <Profile />
        </nav>
    );
}

export default Navbar;