import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Card, Form, Button } from "react-bootstrap";
import Swal from "sweetalert2";
import authService from "../services/authService.js";
import logo from '../assets/logo-step.png';

const ResetPasswordPage = () => {
    const [password, setPassword] = useState('')
    const [confirmar, setConfirmar] = useState('')
    const [loading, setLoading] = useState(false)
    const { token } = useParams()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (password !== confirmar) {
            Swal.fire({ icon: 'error', title: 'Error', text: 'Las contraseñas no coinciden' })
            return
        }
        setLoading(true)
        try {
            await authService.resetPassword(token, password)
            Swal.fire({
                icon: 'success',
                title: 'Contraseña actualizada',
                text: 'Ya podés iniciar sesión con tu nueva contraseña.'
            }).then(() => navigate('/login'))
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response?.data?.message || 'El link es inválido o ya expiró'
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <Container className="auth-container">
            <Card className="login-card p-4 shadow">
                <Card.Body>
                    <div className="auth-logo-container">
                        <img src={logo} alt="Step Servicios SA" className="auth-logo" />
                    </div>
                    <h5 className="mb-3 text-center">Nueva contraseña</h5>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Nueva contraseña</Form.Label>
                            <Form.Control
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="*********"
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-4">
                            <Form.Label>Confirmar contraseña</Form.Label>
                            <Form.Control
                                type="password"
                                value={confirmar}
                                onChange={(e) => setConfirmar(e.target.value)}
                                placeholder="*********"
                                required
                            />
                        </Form.Group>
                        <Button
                            type="submit"
                            variant="primary"
                            className="w-100"
                            disabled={loading}
                        >
                            {loading ? 'Guardando...' : 'Guardar nueva contraseña'}
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    )
}

export default ResetPasswordPage