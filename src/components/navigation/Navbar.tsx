import { useEffect, Fragment, useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from '../../redux/reducers';
import { Dialog, Transition } from '@headlessui/react';
import logoSSMSO from '../../assets/img/logoSSMSO.jpg'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import user_default from '../../assets/img/user_default.png'
import Sidebar from './Sidebar';
import { Link } from 'react-router-dom';

// Define los tipos de las props que esperas en el componente Navbar
type NavbarProps = {
    utm: string;
    userName: string;
};

function Navbar({ utm, userName }: NavbarProps) {
   const [sidebarOpen, setSidebarOpen] = useState(false); // esto es para cuando estas en modo mobile
    const [open, setOpen] = useState(false);

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
                <button className="btn btn-light d-flex align-items-center p-1  ">
                    <div className="ml-3">
                        <p className="mb-0 font-weight-bold text-dark">Andy Riquelme {userName}</p>
                    </div>
                </button>
            </div>
        </div>
    </div>

       {/* Mobile Sidebar */}
            <Transition.Root show={sidebarOpen} as={Fragment}>
                <Dialog as="div" className="modal" onClose={setSidebarOpen}>
                    <Transition.Child as={Fragment} enter="modal-fade-in" enterFrom="opacity-0" enterTo="opacity-100" leave="modal-fade-out" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <div className="modal-backdrop" />
                    </Transition.Child>

                    <div className="modal-dialog modal-side">
                        <Transition.Child as={Fragment} enter="modal-slide-in" enterFrom="-translate-x-full" enterTo="translate-x-0" leave="modal-slide-out" leaveFrom="translate-x-0" leaveTo="-translate-x-full">
                            <Dialog.Panel className="sidebar-mobile bg-white">
                                <Transition.Child as={Fragment} enter="modal-fade-in" enterFrom="opacity-0" enterTo="opacity-100" leave="modal-fade-out" leaveFrom="opacity-100" leaveTo="opacity-0">
                                    <div className="sidebar-close-button">
                                        <button type="button" className="btn-close" aria-label="Close" onClick={()=> setSidebarOpen(false)}
                                                    >
                                                        <span className="sr-only">Close sidebar</span>
                                                        <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                                                    </button>
                                    </div>
                                </Transition.Child>

                                <div className="sidebar-content">
                                    <div className="logo-container">
                                        <Link to="/" className="ml-4 mt-2">
                                        <img src={logoSSMSO} alt="SSMSO LOGO" width={160} height={160} />
                                        </Link>
                                    </div>
                                    <nav className="mt-5">
                                        <Sidebar />
                                    </nav>
                                </div>

                                <div className="sidebar-footer p-2 border-top">
                                    <button onClick={()=> setOpen(true)} className="w-100">
                                                    <div className="d-flex align-items-center">
                                                        <div>
                                                            <img
                                                                className="rounded-circle"
                                                                src={user_default}
                                                                alt="Profile"
                                                                width={30}
                                                                height={30}
                                                            />
                                                        </div>
                                                        <div className="ml-3">
                                                            <p className="font-weight-medium text-dark">Andy Riquelme</p>
                                                            {/* <p className="text-muted">View profile</p> */}
                                                        </div>
                                                    </div>
                                                </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                        <div className="w-14 flex-shrink-0"></div>
                    </div>
                </Dialog>
            </Transition.Root>
           {/* Mobile Sidebar Toggle Button */}
                    <div className="sticky-top bg-white p-3 d-md-none">
                        <button type="button" className="btn btn-outline-secondary" onClick={()=> setSidebarOpen(true)} >
                                        <span className="sr-only">Open sidebar</span>
                                        <Bars3Icon className="h-6 w-4" aria-hidden="true" />
                        </button>
                    </div>    

       {/* Logout Confirmation Dialog */}
            <Transition.Root show={open} as={Fragment}>
                <Dialog as="div" className="modal" onClose={setOpen}>
                    <Transition.Child as={Fragment} enter="modal-fade-in" enterFrom="opacity-0" enterTo="opacity-100" leave="modal-fade-out" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <div className="modal-backdrop" />
                    </Transition.Child>

                    <div className="modal-dialog">
                        <Transition.Child as={Fragment} enter="modal-slide-in" enterFrom="opacity-0 translate-y-4" enterTo="opacity-100 translate-y-0" leave="modal-slide-out" leaveFrom="opacity-100 translate-y-0" leaveTo="opacity-0 translate-y-4">
                            <Dialog.Panel className="modal-content bg-white rounded-lg shadow">
                                <div className="modal-header justify-content-center">
                                    <div className="rounded-circle bg-light p-2">
                                        <img className="rounded-circle" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="Profile" width={40} height={40} />
                                    </div>
                                </div>
                                <div className="modal-body text-center">
                                    <Dialog.Title as="h3" className="text-lg font-weight-medium">
                                        Confirm logout
                                    </Dialog.Title>
                                    <div className="mt-2">
                                        <p className="text-muted">
                                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur amet labore.
                                        </p>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-success w-100" onClick={()=> setOpen(false)}
                                                >
                                                    Logout
                            </button>
                                    <button type="button" className="btn btn-secondary w-100 mt-2" onClick={()=> setOpen(false)}
                                                >
                                                    Cancel
                                                </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition.Root>
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
