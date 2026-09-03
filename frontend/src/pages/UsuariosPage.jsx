import { useState, useEffect } from "react";
import { Container, Table, Button, Modal, Form, Badge } from "react-bootstrap";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { useAuth } from "../context/AuthContext.jsx";
import userService from "../services/userService.js";

const initialForm = {
    nombre: '',
    apellido: '',
    email: '',
    celular: '',
    password: '',
    rol: 'tecnico'
}

const ROLES = ['admin', 'Supervisor', 'tecnico']

const UsuariosPage = () => {
    const { user: usuarioActual } = useAuth()

    const [usuarios, setUsuarios] = useState([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [editando, setEditando] = useState(null)
    const [rolOriginal, setRolOriginal] = useState(null)
    const [form, setForm] = useState(initialForm)

    const cargarUsuarios = async () => {
        try {
            const resp = await userService.getAll()
            setUsuarios(resp.data || resp)
        } catch {
            toast.error('Error al cargar los usuarios')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        cargarUsuarios()
    }, [])

    const handleChange = (e) => {
        const { name, value } = e.target
        setForm(prev => ({ ...prev, [name]: value }))
    }

    const handleNuevo = () => {
        setEditando(null)
        setRolOriginal(null)
        setForm(initialForm)
        setShowModal(true)
    }

    const handleEditar = (usuario) => {
        setEditando(usuario.id)
        setRolOriginal(usuario.rol)
        setForm({
            nombre: usuario.nombre,
            apellido: usuario.apellido,
            email: usuario.email,
            celular: usuario.celular || '',
            password: '',
            rol: usuario.rol
        })
        setShowModal(true)
    }

    const handleGuardar = async (e) => {
        e.preventDefault()
        try {
            if (editando) {
                await userService.update(editando, {
                    nombre: form.nombre,
                    apellido: form.apellido,
                    email: form.email,
                    celular: form.celular
                })
                if (form.rol !== rolOriginal) {
                    await userService.updateRol(editando, form.rol)
                }
                toast.success('Usuario actualizado')
            } else {
                await userService.create({
                    nombre: form.nombre,
                    apellido: form.apellido,
                    email: form.email,
                    celular: form.celular,
                    password: form.password,
                    rol: form.rol
                })
                toast.success('Usuario creado')
            }
            setShowModal(false)
            cargarUsuarios()
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response?.data?.message || 'Error al guardar el usuario'
            })
        }
    }

    const handleEliminar = async (usuario) => {
        if (usuario.id === usuarioActual.id) {
            Swal.fire({
                icon: 'warning',
                title: 'No podés eliminarte a vos mismo'
            })
            return
        }
        const result = await Swal.fire({
            title: `¿Eliminar a ${usuario.nombre} ${usuario.apellido}?`,
            text: 'Esta acción no se puede deshacer',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Si, eliminar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#d33'
        })
        if (result.isConfirmed) {
            try {
                await userService.delete(usuario.id)
                toast.success('Usuario eliminado')
                cargarUsuarios()
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: error.response?.data?.message || 'Error al eliminar el usuario'
                })
            }
        }
    }

    const badgeRol = (rol) => {
        const colores = { admin: 'danger', Supervisor: 'warning', tecnico: 'primary' }
        return <Badge bg={colores[rol] || 'secondary'}>{rol}</Badge>
    }

    return (
        <Container>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Usuarios</h2>
                <Button variant="primary" onClick={handleNuevo}>➕ Nuevo Usuario</Button>
            </div>

            {loading ? (
                <p>Cargando...</p>
            ) : (
                <Table striped bordered hover responsive>
                    <thead className="table-dark">
                        <tr>
                            <th>Nombre</th>
                            <th>Email</th>
                            <th>Celular</th>
                            <th>Rol</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usuarios.map(usuario => (
                            <tr key={usuario.id}>
                                <td>{usuario.nombre} {usuario.apellido}</td>
                                <td>{usuario.email}</td>
                                <td>{usuario.celular || '-'}</td>
                                <td>{badgeRol(usuario.rol)}</td>
                                <td>
                                    <Button size="sm" variant="outline-primary" className="me-2" onClick={() => handleEditar(usuario)}>
                                        Editar
                                    </Button>
                                    <Button size="sm" variant="outline-danger" onClick={() => handleEliminar(usuario)} disabled={usuario.id === usuarioActual.id}>
                                        Eliminar
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{editando ? 'Editar Usuario' : 'Nuevo Usuario'}</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleGuardar}>
                    <Modal.Body>
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <Form.Label>Nombre</Form.Label>
                                <Form.Control name="nombre" value={form.nombre} onChange={handleChange} required />
                            </div>
                            <div className="col-md-6 mb-3">
                                <Form.Label>Apellido</Form.Label>
                                <Form.Control name="apellido" value={form.apellido} onChange={handleChange} required />
                            </div>
                        </div>
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" name="email" value={form.email} onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Celular</Form.Label>
                            <Form.Control name="celular" value={form.celular} onChange={handleChange} placeholder="5491112345678" />
                        </Form.Group>
                        {!editando && (
                            <Form.Group className="mb-3">
                                <Form.Label>Contraseña</Form.Label>
                                <Form.Control type="password" name="password" value={form.password} onChange={handleChange} required />
                            </Form.Group>
                        )}
                        <Form.Group className="mb-3">
                            <Form.Label>Rol</Form.Label>
                            <Form.Select name="rol" value={form.rol} onChange={handleChange}>
                                {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                            </Form.Select>
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" type="submit">Guardar</Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </Container>
    )
}

export default UsuariosPage