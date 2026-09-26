import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Container, Card, Form, Button, InputGroup} from 'react-bootstrap';
import Swal from 'sweetalert2';
import { useAuth } from "../context/AuthContext.jsx";
import authService from "../services/authService.js";
import logo from "../assets/logo-step.png"

const LoginPage = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    const { login } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            const data = await authService.login(email, password)
            login(data.user, data.accessToken, data.refreshToken)
            navigate(location.state?.from || '/')
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error al ingresar',
                text: error.response?.data?.message || 'Credenciales inválidas'
            })
        } finally {
            setLoading(false)
        }
    }


    return (
        <Container className= "auth-container">
            <Card className="login-card p-4 shadow">
                <Card.Body>
                    <div className="auth-logo-container">
                        <img src={logo} alt="Step Servicios SA" className="auth-logo" />
                    </div>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="ejemplo@mail.com"
                            required
                            />
                        </Form.Group>
                        <Form.Group className="mb-4">
                            <Form.Label>Contraseña</Form.Label>
                            <InputGroup>
                                <Form.Control
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="**********"
                                    required
                                />
                                <Button variant="outline-secondary" onClick={() =>setShowPassword(p => !p)}>
                                    {showPassword ? 'Ocultar' : 'Ver'}
                                </Button>
                            </InputGroup>
                       </Form.Group>
                        <Button
                            type="submit"
                            variant="primary"
                            className="w-100"
                            disabled={loading}
                        >
                            {loading ? 'Ingresando...' : 'Ingresar'}
                        </Button>
                        <div className="d-flex justify-content-between mt-3">
                            <Button
                                variant="link"
                                className="p-0"
                                onClick={() => navigate('/register')}
                            >
                                Registrarse
                            </Button>
                            <Button
                                variant="link"
                                className="p-0"
                                onClick={() => navigate('/forgot-password')}
                            >
                                Olvidé mi contraseña
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    )
}

export default LoginPage