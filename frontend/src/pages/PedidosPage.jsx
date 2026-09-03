import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"
import { Container, Table, Button, Modal, Form, Badge } from 'react-bootstrap';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import pedidoService from '../services/pedidoService.js'
import clienteService from '../services/clienteService.js'
import localService from '../services/localService.js'
import userService from '../services/userService.js'
import { useAuth } from '../context/AuthContext.jsx'

const initialForm = {
    cliente: '',
    local: '',
    asignadoA: '',
    tipo: 'Mantenimiento preventivo',
    ordenDeCompra: '',
    descripcion: ''
}

const estadoVariant = {
    'Pendiente': 'warning',
    'En curso': 'primary',
    'Finalizado': 'success',
    'Cancelado': 'secondary'
}

const PedidosPage = () => {
    const { user } = useAuth()
    const esSupervisor = ['admin', 'Supervisor'].includes(user?.rol)

    const [pedidos, setPedidos] = useState([])
    const [clientes, setClientes] = useState([])
    const [locales, setLocales] = useState([])
    const [usuarios, setUsuarios] = useState([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [showDetalle, setShowDetalle] = useState(false)
    const [pedidoDetalle, setPedidoDetalle] = useState(null)
    const [editando, setEditando] = useState(null)
    const [form, setForm] = useState(initialForm)
    const [clienteTieneLocales, setClienteTieneLocales] = useState(false)

    const cargarPedidos = async () => {
        try {
            const data = await pedidoService.getAll()
            setPedidos(data.data || data)
        } catch {
            toast.error('Error al cargar los pedidos')
        }finally{
            setLoading(false)
        }
    }

    useEffect(() => {
        cargarPedidos()
    }, [])

    useEffect(() => {
        if (!form.cliente || clientes.length === 0) {
            setLocales([])
            setClienteTieneLocales(false)
            return
        }
        const clienteSelecionado = clientes.find(c => c.id === form.cliente)
        if(!clienteSelecionado?.tieneLocales) {
            setLocales([])
            setClienteTieneLocales(false)
            setForm(prev => ({ ...prev, local: '' }))
            return
        }
        setClienteTieneLocales(true)
        localService.getByCliente(form.cliente).then(data => {
            setLocales(data.data || data)
        }).catch(() => setLocales([]))
    }, [form.cliente, clientes])

    const abrirModal = async (pedido = null) => {
        try{
            const [clientesData, usuariosData] = await Promise.all([
                clienteService.getAll(),
                userService.getAll()
            ])
            setClientes(clientesData.data || clientesData)
            setUsuarios(usuariosData.data || usuariosData)

            if (pedido) {
                setEditando(pedido.id)
                setForm({
                    cliente: pedido.cliente?._id || pedido.cliente,
                    local: pedido.local?._id || pedido.local || '',
                    asignadoA: pedido.asignadoA?._id || pedido.asignadoA,
                    tipo: pedido.tipo,
                    ordenDeCompra: pedido.ordenDeCompra || '',
                    descripcion: pedido.descripcion || ''
                })
            } else {
                setEditando(null)
                setForm(initialForm)
            }
            setShowModal(true)
        } catch {
            toast.error('Error al cargar los datos del formulario')
        }
    }

    const abrirDetalle = (pedido) => {
        setPedidoDetalle(pedido)
        setShowDetalle(true)
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setForm(prev => ({ ...prev, [name]:value }))
    }

    const handleGuardar = async (e) => {
        e.preventDefault()
        try{
            const payload = { ...form, local: clienteTieneLocales ? form.local: null }
            if (editando) {
                await pedidoService.update(editando, payload)
                toast.success('Pedido actualizado')
            } else {
                await pedidoService.create(payload)
                toast.success('Pedido creado')
            }
            setShowModal(false)
            cargarPedidos()
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response?.data?.message || 'Error al guardar el pedido'
            })
        }
    }

    const handleEstado = async (id, estado) => {
        try {
            await pedidoService.updateEstado(id, estado)
            toast.success('Estado actualizado')
            cargarPedidos()
            if (estado === 'Finalizado') {
                const result = await Swal.fire({
                    title: '¿Crear remito?',
                    text: 'El pedido fue finalizado. ¿Querés generar el remito ahora?',
                    icon: 'question',
                    showCancelButton: true,
                    confirmButtonText: 'Si, crear remito',
                    cancelButtonText: 'Ahora, no'
                })
                if (result.isConfirmed) {
                    const pedido = pedidos.find(p => p.id === id)
                    const clienteId = pedido?.cliente?.id || pedido?.cliente?._id?.toString()
                    const localId = pedido?.local?.id || pedido?.local?._id?.toString() || null
                    const ordenDeCompra = pedido?.ordenDeCompra || null
                    navigate('/remitos/nuevo', { state: {  clienteId, localId, ordenDeCompra, pedidoId: id } })
                }
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response?.data?.message || 'Error al actualizar estado'
            })
        }
    }

    const handleEliminar = async (id, numero) => {
        const result = await Swal.fire({
            title: `¿Deseas eliminar el pedido #${numero}?`,
            text: 'Esta acción no se puede deshacer',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Si, eliminar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#d33'
        })
        if (result.isConfirmed) {
            try {
                await pedidoService.delete(id)
                toast.success('Pedido eliminado')
                cargarPedidos()
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: error.response?.data?.message || 'Error al eliminar el pedido'
                })
            }
        }
    }

    const navigate = useNavigate()

    return (
        <Container>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Pedidos</h2>
                {esSupervisor && (
                    <Button variant="primary" onClick={() => abrirModal()}> ➕ Nuevo Pedido</Button>
                )}
            </div>

            {loading ? (
                <p>Cargando...</p>
            ) : (
                <Table striped bordered hover responsive>
                    <thead className="table-dark">
                        <tr>
                            <th>#</th>
                            <th>Cliente</th>
                            <th>Local</th>
                            <th>Asignado a</th>
                            <th>Tipo</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pedidos.map(pedido => (
                            <tr key={pedido.id} style={{ cursor: 'pointer' }} onClick={() => abrirDetalle(pedido)}>
                                <td>{pedido.numero}</td>
                                <td>{pedido.cliente?.nombre}</td>
                                <td>{pedido.local?.nombre || '-'}</td>
                                <td>{pedido.asignadoA ? `${pedido.asignadoA.nombre} ${pedido.asignadoA.apellido}` : '-'}</td>
                                <td>{pedido.tipo}</td>
                                <td onClick={e => e.stopPropagation()}>
                                    <Form.Select
                                        size="sm"
                                        value={pedido.estado}
                                        onChange={(e) => handleEstado(pedido.id, e.target.value)}
                                        style={{ minWidth: '120px'}}
                                    >
                                        <option>Pendiente</option>
                                        <option>En curso</option>
                                        <option>Finalizado</option>
                                        <option>Cancelado</option>
                                    </Form.Select>
                                </td>
                                <td onClick={e => e.stopPropagation()}>
                                    {esSupervisor && (
                                        <>
                                            <Button size="sm" variant="outline-primary" className="me-2" onClick={() => abrirModal(pedido)}> Editar</Button>
                                            <Button size="sm" variant="outline-danger" onClick={() => handleEliminar(pedido.id, pedido.numero)}>Eliminar</Button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}

            <Modal show={showDetalle} onHide={() => setShowDetalle(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Pedido #{pedidoDetalle?.numero}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {pedidoDetalle&& (
                        <div className="row g-3">
                            <div className="col-md-6">
                                <small className="text-muted">Cliente</small>
                                <p className="mb-1 fw-semibold">{pedidoDetalle.cliente?.nombre}</p>
                            </div>
                              <div className="col-md-6">
                                <small className="text-muted">Local</small>
                                <p className="mb-1 fw-semibold">{pedidoDetalle.local?.nombre}</p>
                            </div>
                              <div className="col-md-6">
                                <small className="text-muted">Asignado a</small>
                                <p className="mb-1 fw-semibold">{pedidoDetalle.asignadoA
                                ? `${pedidoDetalle.asignadoA.nombre} ${pedidoDetalle.asignadoA.apellido}` : '-'}</p>
                            </div>
                              <div className="col-md-6">
                                <small className="text-muted">Tipo</small>
                                <p className="mb-1 fw-semibold">{pedidoDetalle.tipo}</p>
                            </div>
                              <div className="col-md-6">
                                <small className="text-muted">Estado</small>
                                <p className="mb-1 fw-semibold">
                                    <Badge bg={estadoVariant[pedidoDetalle.estado]}>{pedidoDetalle.estado}</Badge>
                                </p>
                            </div>
                              <div className="col-md-6">
                                <small className="text-muted">Orden de compra</small>
                                <p className="mb-1 fw-semibold">{pedidoDetalle.ordenDeCompra || '-'}</p>
                            </div>
                              <div className="col-md-6">
                                <small className="text-muted">Descripción</small>
                                <p className="mb-1 fw-semibold">{pedidoDetalle.descripcion || 'Sin descripción'}</p>
                            </div>
                              <div className="col-md-6">
                                <small className="text-muted">Fecha de creación</small>
                                <p className="mb-1 fw-semibold">{pedidoDetalle.createdAt 
                                ? new Date(pedidoDetalle.createdAt).toLocaleDateString('es-AR') : '-'}</p>
                            </div>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    {esSupervisor && pedidoDetalle && (
                        <Button variant="outline-primary" onClick={() => { setShowDetalle(false); abrirModal(pedidoDetalle)}}> Editar</Button>
                    )}
                    <Button variant="secondary" onClick={() => setShowDetalle(false)}>Cerrar</Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{editando ? 'Editar Pedido' : 'Nuevo Pedido'}</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleGuardar}>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <Form.Label>Cliente</Form.Label>
                            <Form.Select name="cliente" value={form.cliente} onChange={handleChange} required>
                                <option value="">Seleccionar cliente...</option>
                                {clientes.map(c => (
                                    <option key={c.id} value={c.id}>{c.nombre}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>

                        {clienteTieneLocales && (
                        <Form.Group className="mb-3">
                            <Form.Label>Local</Form.Label>
                            <Form.Select name="local" value={form.local} onChange={handleChange} required>
                                <option value="">Seleccionar local...</option>
                                {locales.map(l => (
                                    <option key={l.id} value={l.id}>{l.nombre}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                        )}

                        <Form.Group className="mb-3">
                            <Form.Label>Asignado a</Form.Label>
                            <Form.Select name="asignadoA" value={form.asignadoA} onChange={handleChange} required>
                                <option value="">Seleccionar usuario...</option>
                                {usuarios.map(u => (
                                    <option key={u.id} value={u.id}>{u.nombre} {u.apellido} {u.rol}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Tipo</Form.Label>
                            <Form.Select name="tipo" value={form.tipo} onChange={handleChange} required>
                                <option>Mantenimiento preventivo</option>
                                <option>Reparación</option>
                                <option>Urgencia</option>
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Orden de compra<span className="text-muted">(opcional)</span></Form.Label>
                            <Form.Control name="ordenDeCompra" value={form.ordenDeCompra} onChange={handleChange}/>
                        </Form.Group>

                         <Form.Group className="mb-3">
                            <Form.Label>Descripción<span className="text-muted">(opcional)</span></Form.Label>
                            <Form.Control 
                                as="textarea"
                                rows={3}
                                name="descripcion"
                                value={form.descripcion}
                                onChange={handleChange}
                                placeholder="Detallá qué se debe observar o realizar..."
                            />
                        </Form.Group>
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

export default PedidosPage