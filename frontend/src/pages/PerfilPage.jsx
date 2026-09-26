import { useState } from "react";
import { Container, Card, Form, Button, InputGroup, Row, Col } from 'react-bootstrap';
import { toast } from "react-toastify";
import Swal from 'sweetalert2';
import { useAuth } from '../context/AuthContext.jsx';
import userService from "../services/userService.js";

const PerfilPage = () => {
    const { user } = useAuth()

    const [form, setForm] = useState({
        nombre: user?.nombre || '',
        apellido: user?.apellido || '',
        email: user?.email || '',
        celular: user?.celular || ''
    })
    const [password, setPassword] = useState({
        passwordActual: '',
        passwordNuevo: '',
        confirmar: ''
    })
    const [showActual, setShowActual] = useState(false)
    const [showNuevo, setShowNuevo] = useState(false)
    const [showConfirmar, setShowConfirmar] = useState(false)
    const [ loadingPerfil, setLoadingPerfil] = useState(false)
    const [loadingPassword, setLoadingPassword] = useState(false)

    const handleChange = (e) => {
        const { name, value } = e.target
        setForm(prev => ({ ...prev, [name]: value }))
    }

    const handlePasswordChange = (e) => {
        const { name, value } = e.target
        setPassword(prev => ({ ...prev, [name]: value}))
    }

    const handleGuardarPerfil = async (e) => {
        e.preventDefault()
        setLoadingPerfil(true)
        try {
            await userService.updatePerfil(form)
            toast.success('Perfil actualizado')
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response?.data?.message || 'Error al actualizar el perfil'
            })
        } finally {
            setLoadingPerfil(false)
        }
    }

    const handleCambiarPassword = async (e) => {
        e.preventDefault()
        if (password.passwordNuevo !== password.confirmar) {
            Swal.fire ({ icon: 'error', title: 'Error', text: 'Las contraseñas con coinciden'})
            return
        }
        setLoadingPassword(true)
        try {
            await userService.updatePassword(user.id, password.passwordActual, password.passwordNuevo)
            toast.success('Contraseña actualizada')
            setPassword({ passwordActual: '', passwordNuevo: '', confirmar: ''})
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response?.data?.message || 'Error al cambiar la contraseña'
            })
        } finally {
            setLoadingPassword(false)
        }
    }

    return (
        <Container>
            <h2 className="mb-4">Mi Perfil</h2>
            <Row>
                <Col md={6} className="mb-4">
                    <Card>
                        <Card.Header><strong>Datos personales</strong></Card.Header>
                        <Card.Body>
                            <Form onSubmit={handleGuardarPerfil}>
                                <Row>
                                    <Col md={6} className="mb-3">
                                        <Form.Label>Nombre</Form.Label>
                                        <Form.Control name="nombre" value={form.nombre} onChange={handleChange} required />
                                    </Col>
                                    <Col md={6} className="mb-3">
                                        <Form.Label>Apellido</Form.Label>
                                        <Form.Control name="apellido" value={form.apellido} onChange={handleChange} required />
                                    </Col>
                                </Row>
                                <Form.Group className="mb-3">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control type="email" name="email" value={form.email} onChange={handleChange} required />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Celular</Form.Label>
                                    <Form.Control name="celular" value={form.celular} onChange={handleChange} placeholder="5491112345678" />
                                </Form.Group>
                                <Button type="submit" variant="primary" disabled={loadingPerfil}>
                                    {loadingPerfil ? 'Guardando...' : 'Guardar cambios'}
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6} className="mb-4">
                    <Card>
                        <Card.Header><strong>Cambiar contraseña</strong></Card.Header>
                        <Card.Body>
                            <Form onSubmit={handleCambiarPassword}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Contraseña actual</Form.Label>
                                    <InputGroup>
                                        <Form.Control type={showActual ? 'text' : 'password'} name="passwordActual" value={password.passwordActual} onChange={handlePasswordChange} required />
                                        <Button variant="outline-secondary" onClick={() => setShowActual(p => !p)}> {showActual ? 'Ocultar' : 'Ver'}</Button>
                                    </InputGroup>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Nueva contraseña</Form.Label>
                                    <InputGroup>
                                        <Form.Control type={showNuevo ? 'text' : 'password'} name="passwordNuevo" value={password.passwordNuevo} onChange={handlePasswordChange} required />
                                        <Button variant="outline-secondary" onClick={() => setShowNuevo(p => !p)}> {showNuevo ? 'Ocultar' : 'Ver'}</Button>
                                    </InputGroup>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Confirmar nueva contraseña</Form.Label>
                                    <InputGroup>
                                        <Form.Control type={showConfirmar ? 'text' : 'password'} name="confirmar" value={password.confirmar} onChange={handlePasswordChange} required />
                                        <Button variant="outline-secondary" onClick={() => setShowConfirmar(p => !p)}> {showConfirmar ? 'Ocultar' : 'Ver'}</Button>
                                    </InputGroup>
                                </Form.Group>
                                <Button type="submit" variant="primary" disabled={loadingPassword}>
                                    {loadingPassword ? 'Guardando...' : 'Cambiar contraseña'}
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    )
}

export default PerfilPage