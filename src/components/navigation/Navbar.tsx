import { useEffect } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '../../redux/reducers'; // Asegúrate de tener este tipo definido correctamente
// Define los tipos de las props que esperas en el componente Navbar
type NavbarProps = {
    utm: string;
    userName: string;
};

function Navbar({ utm, userName }: NavbarProps) {

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
      <nav id="navbar" className="navbar navbar-expand-lg navbar-light bg-light w-100 fixed-top">
    <div className="container">
        {/* Navbar Links and User Info */}
        <div className="collapse navbar-collapse" id="navbarNav">
            <div className="d-flex align-items-center ml-auto">
                {/* UTm Paragraph */}
                <p className="mb-0 mr-3">UTM: {utm}</p>
                
                {/* User Info Button */}
                <button className="btn btn-light d-flex align-items-center p-1 rounded shadow-sm border">
                    <div className="ml-3">
                        <p className="mb-0 font-weight-bold text-dark">Andy Riquelme {userName}</p>
                    </div>
                </button>
            </div>
        </div>
    </div>
</nav>


    );
}

// Define el tipo del estado global
const mapStateToProps = (state: RootState) => ({
    // utm: state.utm, // Asegúrate de que 'utm' esté en tu estado global
    // userName: state.userName, // Asegúrate de que 'userName' esté en tu estado global
});

const connector = connect(mapStateToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(Navbar);
