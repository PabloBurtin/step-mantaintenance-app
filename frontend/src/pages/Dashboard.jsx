import { useAuth } from "../context/AuthContext.jsx";

const Dashboard = () =>{
    const { user } = useAuth()

    return (
        <div>
            <h2> Bienvenido, {user?.nombre} {user?.apellido}</h2>
            <p className="text-muted"> Rol: {user?.rol}</p>
            <hr />
            <p>Seleccioná una sección del menú para comenzar.</p>
        </div>
    )
}

export default Dashboard