import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Card, Form, Button } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { useAuth } from "../context/AuthContext.jsx";
import authService from "../services/authService.js";

const LoginPage = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)

    const { login } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            const data = await authService.login(email, password)
            login(data.user, data.accessToken, data.refreshToken)
            if (data.user.email === 'diego.rodriguez@stepservicios.com') {
                window.location.href = 'https://www.youtube.com/watch?v=_fI3qL_g698'
            } else if (data.user.email === 'sergio.vilche@stepservicios.com') {
                 window.location.href = 'https://www.youtube.com/shorts/wTKlN9lMs6c'
            } else{
            navigate('/')
            }
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
        <Container className= "d-flex justify-content-center align-items-center vh100">
            <Card style={{width: '400px'}} className="p-4 shadow">
                <Card.Body>
                    <h4 className="text-center mb-4">Step Servicios SA</h4>
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
                            <Form.Control
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="**********"
                                required
                            />
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