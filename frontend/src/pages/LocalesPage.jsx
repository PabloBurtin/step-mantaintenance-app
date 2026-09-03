import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Table, Button, Modal, Form, Badge } from "react-bootstrap";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import localService from "../services/localService.js";
import clienteService from "../services/clienteService.js";

const initialForm = {
    nombre: '',
    direccion: { calle: '', numero: '', localidad: '', provincia: '' },
    ubicacionMaps: '',
    activo: true
}

const LocalesPage = () => {
    const { clienteId } = useParams()
    const navigate = useNavigate()

    const [locales, setLocales] = useState([])
    const [cliente, setCliente] = useState(null)
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [editando, setEditando] = useState(null)
    const [form, setForm] = useState(initialForm)

    const cargarDatos = async () => {
        try {
            const [clienteData, localesData] = await Promise.all([
                clienteService.getById(clienteId),
                localService.getByCliente(clienteId)
            ])
            setCliente(clienteData.data)
            setLocales(localesData.data || localesData)
        } catch {
            toast.error('Error al cargar los datos')
        } finally {
            setLoading(false)
        }
    }

    useEffect(()=>{
        cargarDatos()
    }, [clienteId])

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        if(name.startsWith('direccion.')) {
            const campo = name.split('.')[1]
            setForm(prev => ({
                ...prev,
                direccion: { ...prev.direccion, [campo]:value }
            }))
        } else {
            setForm(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            }))
        }
    }

    const handleNuevo = () => {
        setEditando(null)
        setForm(initialForm)
        setShowModal(true)
    }

    const handleEditar = (local) => {
        setEditando(local.id)
        setForm({
            nombre: local.nombre,
            direccion: { ...initialForm.direccion, ...local.direccion },
            ubicacionMaps: local.ubicacionMaps || '',
            activo: local.activo
        })
        setShowModal(true)
    }

    const handleGuardar = async (e) => {
        e.preventDefault()
        try {
            const payload = { ...form, cliente: clienteId }
            if (editando) {
                await localService.update(editando, payload)
                toast.success('Local actualizado')
            } else {
                await localService.create(payload)
                toast.success('Local creado')
            }
            setShowModal(false)
            cargarDatos()
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response?.data?.message || 'Error al guardar el local'
            })
        }
    }

    const handleEliminar = async (id, nombre) => {
        const result = await Swal.fire({
            title: `¿Eliminar ${nombre}?`,
            text: 'Esta accion no se puede deshacer',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Si, eliminar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#d33'
        })

        if (result.isConfirmed) {
            try {
                await localService.delete(id)
                toast.success('Local eliminado')
                cargarDatos()
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: error.response?.data?.message || 'Error al eliminar el local'
                })
            }
        }
    }

    return (
        <Container>
            <div className="d-flex align-items-center mb-1">
                <Button variant="link" className="p-0 me-2" onClick={() => navigate('/clientes')}>
                    ⬅️ Volver
                </Button>
            </div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Locales - {cliente?.nombre}</h2>
                <Button variant="primary" onClick={handleNuevo}> ➕ Nuevo Local</Button>
            </div>

            {!loading && cliente && !cliente.tieneLocales && (
                <div className="alert alert-warning">
                    Este cliente no tiene habilitada la opcion de locales.
                </div> 
            )}

            {loading ? (
                <p>Cargando...</p>
            ) : (
                <Table striped bordered hover responsive>
                    <thead className="table-dark">
                        <tr>
                            <th>Nombre</th>
                            <th>Dirección</th>
                            <th>Maps</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {locales.map(local => (
                            <tr key={local.id}>
                                <td>{local.nombre}</td>
                                <td>{local.direccion?.calle} {local.direccion?.numero}, {local.direccion?.localidad}</td>
                                <td> {local.ubicacionMaps 
                                        ? <a href={local.ubicacionMaps} target="_blank" rel="noreferrer">Ver mapa</a>
                                        : '-' 
                                    } 
                                </td>
                                <td>
                                    <Badge bg={local.activo ? 'success' : 'secondary'}>{local.activo ? 'Activo' : 'Inactivo'}</Badge>
                                </td>
                                <td>
                                    <Button size="sm" variant="outline-primary" className="me-2" onClick={() => handleEditar(local)}>Editar</Button>
                                    <Button size="sm" variant="outline-danger" onClick={() => handleEliminar(local.id, local.nombre)}> Eliminar</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{editando ? 'Editar Local' : 'Nuevo Local'}</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleGuardar}>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control name="nombre" value={form.nombre} onChange={handleChange} required/>
                        </Form.Group>
                        
                        <h6 className="mt-3 mb-2">Dirección</h6>
                        <div className="row">
                            <div className="col-md-8 mb-3">
                                <Form.Label>Calle</Form.Label>
                                <Form.Control name="direccion.calle" value={form.direccion.calle} onChange={handleChange} required/>
                            </div>
                            <div className="col-md-6 mb-3">
                                <Form.Label>Altura</Form.Label>
                                <Form.Control name="direccion.numero" value={form.direccion.numero} onChange={handleChange} required/>
                            </div>
                            <div className="col-md-6 mb-3">
                                <Form.Label>Localidad</Form.Label>
                                <Form.Control name="direccion.localidad" value={form.direccion.localidad} onChange={handleChange} required/>
                            </div>
                            <div className="col-md-6 mb-3">
                                <Form.Label>Provincia</Form.Label>
                                <Form.Control name="direccion.provincia" value={form.direccion.provincia} onChange={handleChange} required/>
                            </div>
                        </div>

                        <Form.Group className="mb-3">
                            <Form.Label>URL Google Maps</Form.Label>
                            <Form.Control name="ubicacionMaps" value={form.ubicacionMaps} onChange={handleChange} placeholder="https://maps.google.com/..."/>
                        </Form.Group>

                        <Form.Check
                            type="checkbox"
                            label="Activo"
                            name="activo"
                            checked={form.activo}
                            onChange={handleChange}
                        />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
                        <Button variant="primary" type="submit">Guardar</Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </Container>
    )
}

export default LocalesPage