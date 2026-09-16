import { Link, useNavigate } from "react-router-dom";
import { Navbar as BsNavbar, Nav, Container, NavDropdown } from 'react-bootstrap'
import { toast } from 'react-toastify'
import Swal from "sweetalert2";
import { useAuth } from "../context/AuthContext.jsx";
import authService from "../services/authService.js";
import logo from '../assets/logo-step.png';

const Navbar = () => {
    const { user, logout } = useAuth()
    const navigate = useNavigate()

    const handleLogout = async () => {
        const result = await Swal.fire({
            title: '¿Deseas cerrar la sesión?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Si, quiero salir',
            cancelButtonText: 'Cancelar'
        })

        if (result.isConfirmed) {
            try {
                await authService.logout()
            } catch {
                // si falla el endpoint igual cerramos la sesión local
            }
            logout()
            toast.success('Sesión cerrada')
            navigate('/login')
        }
    }

    return (
        <BsNavbar bg="dark" variant="dark" expand="lg">
            <Container>
                <BsNavbar.Brand as={Link} to="/">
                    <img src={logo} alt="Step Servicios SA" style={{ height: '38px', width: 'auto' }} />
                </BsNavbar.Brand>
                <BsNavbar.Toggle />
                <BsNavbar.Collapse>
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/">Inicio</Nav.Link>
                        <Nav.Link as={Link} to="/clientes">Clientes</Nav.Link>
                        <Nav.Link as={Link} to="/pedidos">Pedidos</Nav.Link>
                        <Nav.Link as={Link} to="/remitos">Remitos</Nav.Link>
                        {['admin', 'gerente'].includes(user?.rol) && (
                            <Nav.Link as={Link} to="/usuarios">Usuarios</Nav.Link>
                        )}
                    </Nav>
                    <Nav>
                        <NavDropdown title={`${user?.nombre} ${user?.apellido}`} align="end">
                            <NavDropdown.Item onClick={handleLogout}>
                                Cerrar sesión
                            </NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </BsNavbar.Collapse>
            </Container>
        </BsNavbar>
    )
}

export default Navbar