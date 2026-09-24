import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from 'react-router-dom';
import { Container } from 'react-bootstrap'
import { USER_ROLES } from "../constants/index.js";

const secciones = [
    {
        titulo: 'Pedidos',
        descripcion: 'Gestioná los pedidos de servicio',
        icono: '📋',
        ruta: '/pedidos',
        roles: Object.values(USER_ROLES)
    },
    {
        titulo: 'Remitos',
        descripcion: 'Creá y consulta remitos',
        icono: '🧾',
        ruta: '/remitos',
        roles: Object.values(USER_ROLES)
    },
    {
        titulo: 'Clientes',
        descripcion: 'Administrá los clientes',
        icono: '🏢',
        ruta: '/clientes',
        roles: Object.values(USER_ROLES)
    },
    {
        titulo: 'Usuarios',
        descripcion: 'Gestioná los usuarios del sistema',
        icono: '👥',
        ruta: '/usuarios',
        roles: [USER_ROLES.ADMIN, USER_ROLES.GERENTE]
    }
]


const Dashboard = () =>{
    const { user } = useAuth()
    const navigate = useNavigate()

    const seccionesVisibles = secciones.filter(s => s.roles.includes(user?.rol))

    return (
        <Container className="py-4">
            <div className="dashboard-welcome">
                <h2>Bienvenido, {user?.nombre} {user?.apellido}</h2>
                <span className="dashboard-rol">{user?.rol}</span>
            </div>

            <div className="dashboard-cards">
                {seccionesVisibles.map(s => (
                    <div key={s.ruta} className="dashboard-card" onClick={() => navigate(s.ruta)}>
                        <div className="dashboard-card-icon">{s.icono}</div>
                        <div className="dashboard-card-title">{s.titulo}</div>
                        <div className="dashboard-card-desc">{s.descripcion}</div>
                    </div>
                ))}
            </div>
        </Container>
    )
}

export default Dashboard