import { useState } from "react";
import { useNavigate } from "react-router-dom"
import { Container, Card, Form, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { useAuth } from '../context/AuthContext.jsx';
import api from "../services/api.js";

const RegisterPage = () => {
    const [form, setForm] = useState({
        nombre: '',
        apellido: '',
        email: '',
        celular: '',
        password: '',
        confirmarPassword: ''
    })
    const [loading, setLoading] = useState(false)

    const { login } = useAuth()
    const navigate = useNavigate()

    const handleChange = (e) => {
        const { name, value } = e.target
        setForm(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (form.password !== form.confirmarPassword) {
            Swal.fire({ 
                icon: 'error',
                title: 'Error',
                text: 'Las contraseñas no coinciden'
            })
            return
        }

        setLoading(true)
        try {
            const { data } = await api.post('/auth/register', {
                nombre: form.nombre,
                apellido: form.apellido,
                email: form.email,
                celular: form.celular,
                password: form.password,
                rol: 'tecnico'
            })
            login(data.user, data.accessToken, data.refreshToken)
            toast.success('Cuentra creada correctamente')
            navigate('/')
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title:' Error al registrarse',
                text: error.response?.data?.message || 'Error al crear la cuenta'
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <Container className="d-flex justify-content-center align-items-center vh-100">
            <Card style={{ width: '450px'}} className="p-4 shadow">
                <Card.Body>
                    <h4 className="text-center mb-4">Crear cuenta</h4>
                    <Form onSubmit={handleSubmit}>
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <Form.Label>Nombre</Form.Label>
                                <Form.Control name="nombre" value={form.nombre} onChange={handleChange} required/>
                            </div>
                             <div className="col-md-6 mb-3">
                                <Form.Label>Apellido</Form.Label>
                                <Form.Control name="apellido" value={form.apellido} onChange={handleChange} required/>
                            </div>
                        </div>
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" name="email" value={form.email} onChange={handleChange} required />
                        </Form.Group>
                         <Form.Group className="mb-3">
                            <Form.Label>Celular</Form.Label>
                            <Form.Control name="celular" value={form.celular} onChange={handleChange} placeholder="+549111245678"required />
                        </Form.Group>
                         <Form.Group className="mb-3">
                            <Form.Label>Contraseña</Form.Label>
                            <Form.Control type="password" name="password" value={form.password} onChange={handleChange} required />
                        </Form.Group>
                         <Form.Group className="mb-3">
                            <Form.Label>Confirmar contraseña</Form.Label>
                            <Form.Control type="password" name="confirmarPassword" value={form.confirmarPassword} onChange={handleChange} required />
                        </Form.Group>
                        <Button type="submit" variant="primary" className="w-100" disabled={loading}>
                            {loading ? 'Creando cuenta...' : 'Registarse'}
                        </Button>
                        <div className="text-center mt-3">
                            <Button variant="link" className="p-0" onClick={() => navigate('/login')}>
                                Ya tengo cuenta
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    )
}

export default RegisterPage