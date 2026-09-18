import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Card } from "react-bootstrap";
import Swal from 'sweetalert2'
import api from "../services/api.js";
import logo from '../assets/logo-step.png'

const VerifyEmailPage = () => {
    const { token } = useParams()
    const navigate = useNavigate()
    const [estado, setEstado] = useState('verificando')

    useEffect(() => {
        const verificar = async () => {
            try {
                await api.get(`/auth/verify-email/${token}`)
                setEstado('exitoso')
                Swal.fire({
                    icon: 'success',
                    title: '¡Cuenta confirmada!',
                    text: 'Tu cuenta fue activada correctamente. Ya podes iniciar sesión.'
                }).then(() => navigate('/login'))
            } catch (error) {
                setEstado('error')
                Swal.fire({
                    icon: 'error',
                    title: 'Link inválido',
                    text: error.response?.data?.message || 'El link expiró o ya fue usado.'
                }).then (() => navigate('/login'))

            }
        }
        verificar()
    }, [token])

    return (
        <Container className="auth-container">
            <Card className="login-card p-4 shadow">
                <Card.Body className="text-center">
                    <div className="auth-logo-container">
                        <img src={logo} alt="Step Servicios SA" className="auth-logo" />
                    </div>
                    {estado === 'verificando' && <p>Verificando tu cuenta...</p>}
                    {estado === 'exitoso' && <p>¡Cuenta verificada! Redirigiendo...</p>}
                    {estado === 'error' && <p>El link es inválido o expiró</p>}
                </Card.Body>
            </Card>
        </Container>
    )
}

export default VerifyEmailPage