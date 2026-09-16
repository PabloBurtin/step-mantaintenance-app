import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Card, Form, Button } from 'react-bootstrap';
import Swal from 'sweetalert2';
import authService from '../services/authService.js'
import logo from '../assets/logo-step.png'

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            await authService.forgotPassword(email)
            Swal.fire({
                icon: 'success',
                title: 'Correo enviado',
                text: 'Si el email existe, vas a recibir un link para restablecer tu contraseña.'
            }).then(() => navigate('/login'))
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response?.data?.message || 'No se pudo enviar el correo'
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
                        <img src={logo} alt="Step Servicios SA" className="auth-logo"/>
                    </div>
                    <h5 className="mb-3 text-center">Recuperar contraseña</h5>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type= 'email'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="ejemplo@mail.com"
                                required
                            />
                        </Form.Group>
                        <Button
                            type="submit"
                            variant="primary"
                            className="w-100"
                            disabled={loading}
                        >
                            {loading ? 'Enviando...' : 'Enviar link de recuperación'}
                        </Button>
                        <div className="text-center mt-3">
                            <Button variant="link" className="p-0" onClick={() => navigate('/login')}>Volver al login</Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    )
}

export default ForgotPasswordPage