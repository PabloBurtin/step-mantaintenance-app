import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Container, Table, Button, Modal, Form, Badge } from 'react-bootstrap'
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'
import clienteService from "../services/clienteService.js"

const initialForm = {
    nombre: '',
    cuit: '',
    condicionIVA: 'Responsable Inscripto',
    direccionFiscal: {
        calle: '', numero: '', piso: '', depto: '',
        ciudad: '', provincia: '', codigoPostal: ''
    },
    tieneLocales: false,
    activo: true
}

const ClientesPage = () => {
    const [clientes, setClientes] = useState([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [editando, setEditando] = useState(null)
    const [form, setForm] = useState(initialForm)

    const cargarClientes = async () => {
        try{
            const data = await clienteService.getAll()
            setClientes(data.data || data)
        } catch {
            toast.error('Error al cargar los clientes')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() =>{
        cargarClientes()
    }, [])

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        if (name.startsWith('direccionFiscal.')) {
            const campo = name.split('.')[1]
            setForm(prev=> ({
                ...prev,
                direccionFiscal:{ ...prev.direccionFiscal, [campo]: value}
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

    const handleEditar = (cliente) => {
        setEditando(cliente.id)
        setForm({
            nombre: cliente.nombre,
            cuit: cliente.cuit,
            condicionIVA: cliente.condicionIVA,
            direccionFiscal: { ...initialForm.direccionFiscal, ...cliente.direccionFiscal },
            tieneLocales: cliente.tieneLocales,
            activo: cliente.activo
        })
        setShowModal(true)
    }

    const handleGuardar = async (e) => {
        e.preventDefault()
        try{
            if (editando) {
                await clienteService.update(editando, form)
                toast.success('Cliente actualizado')
            } else {
                await clienteService.create(form)
                toast.success('Cliente creado')
            }
            setShowModal(false)
            cargarClientes()
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response?.data?.message || 'Error al guardar cliente'
            })
        }
    }

    const handleEliminar = async (id, nombre) => {
        const result = await Swal.fire({
            title: `¿Desea eliminar a ${nombre}`,
            text: 'Esta acción no se puede deshacer',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Si, eliminar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#d33'
        })

        if (result.isConfirmed) {
            try {
                await clienteService.delete(id)
                toast.success('Cliente eliminado')
                cargarClientes()
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: error.response?.data?.nessage || 'Error al eleminar el cliente'
                })
            }
        }
    }

    const navigate = useNavigate()

    return (
        <Container>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Clientes</h2>
                <Button variant="primary" onClick={handleNuevo}>+ Nuevo Cliente</Button>
            </div>

            {loading ? (
                <p>Cargando...</p>
            ) : (
                <Table striped bordered hover responsive>
                    <thead className="table-dark">
                        <tr>
                            <th>Nombre</th>
                            <th>CUIT</th>
                            <th>Condición IVA</th>
                            <th>Ciudad</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clientes.map(cliente => (
                            <tr key={cliente.id}>
                                <td>{cliente.nombre}</td>
                                <td>{cliente.cuit}</td>
                                <td>{cliente.condicionIVA}</td>
                                <td>{cliente.direccionFiscal?.ciudad}</td>
                                <td>
                                    <Badge bg={cliente.activo ? 'success' : 'secondary'}>
                                        {cliente.activo ? 'Activo' : 'Inactivo'}
                                    </Badge>
                                </td>
                                <td>
                                    <Button size="sm" variant="outline-secondary" className="me-2" onClick={() => navigate(`/locales/${cliente.id}`)}>
                                        Locales
                                    </Button>
                                    <Button size= "sm" variant="outline-primary" className="me-2" onClick={() => handleEditar(cliente)}>
                                        Editar
                                    </Button>
                                    <Button size="sm" variant="outline-danger" onClick={() => handleEliminar(cliente.id, cliente.nombre)}>
                                        Eliminar
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}

            <Modal show={showModal} onHide={() => setShowModal(false)} size= "lg">
                <Modal.Header closeButton>
                    <Modal.Title>{editando ? 'Editar Cliente' : 'Nuevo Cliente'}</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleGuardar}>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control name="nombre" value={form.nombre} onChange={handleChange} required/>
                        </Form.Group>
                         <Form.Group className="mb-3">
                            <Form.Label>CUIT</Form.Label>
                            <Form.Control name="cuit" value={form.cuit} onChange={handleChange} required/>
                        </Form.Group>
                         <Form.Group className="mb-3">
                            <Form.Label>Condición IVA</Form.Label>
                            <Form.Select name="condicionIVA" value={form.condicionIVA} onChange={handleChange}>
                                <option>Responsable Inscripto</option>
                                <option>Exento</option>
                                <option>Consumidor Final</option>
                            </Form.Select>
                        </Form.Group>

                        <h6 className="mt-3 mb-2">Dirección Fiscal</h6>
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <Form.Label>Calle</Form.Label>
                                <Form.Control name="direccionFiscal.calle" value={form.direccionFiscal.calle} onChange={handleChange}/>
                            </div>
                            <div className="col-md-6 mb-3">
                                <Form.Label>Numero</Form.Label>
                                <Form.Control name="direccionFiscal.numero" value={form.direccionFiscal.numero} onChange={handleChange}/>
                            </div>
                            <div className="col-md-6 mb-3">
                                <Form.Label>Piso/Depto</Form.Label>
                                <Form.Control name="direccionFiscal.piso" value={form.direccionFiscal.piso} onChange={handleChange} placeholder="Piso"/>
                            </div>
                            <div className="col-md-6 mb-3">
                                <Form.Label>Ciudad</Form.Label>
                                <Form.Control name="direccionFiscal.ciudad" value={form.direccionFiscal.ciudad} onChange={handleChange}/>
                            </div>
                            <div className="col-md-6 mb-3">
                                <Form.Label>Provincia</Form.Label>
                                <Form.Control name="direccionFiscal.provincia" value={form.direccionFiscal.provincia} onChange={handleChange}/>
                            </div>
                            <div className="col-md-6 mb-3">
                                <Form.Label>Código Postal</Form.Label>
                                <Form.Control name="direccionFiscal.codigoPostal" value={form.direccionFiscal.codigoPostal} onChange={handleChange}/>
                            </div>
                        </div>

                        <Form.Check
                            type="checkbox"
                            label="Tiene locales"
                            name="tieneLocales"
                            checked={form.tieneLocales}
                            onChange={handleChange}
                            className="mb-2"
                        />
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

export default ClientesPage