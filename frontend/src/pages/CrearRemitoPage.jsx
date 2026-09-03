import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Container, Form, Button, Card } from 'react-bootstrap'
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'
import SignatureCanvas from 'react-signature-canvas'
import remitoService from '../services/remitoService.js'
import clienteService from '../services/clienteService.js'
import localService from '../services/localService.js'

const CrearRemitoPage = () => {
    const navigate = useNavigate()
    const location = useLocation()

    const [clientes, setClientes] = useState([])
    const [locales, setLocales] = useState([])
    const [clienteTieneLocales, setClienteTieneLocales] = useState(false)
    const [items, setItems] = useState([''])
    const [guardando, setGuardando] = useState(false)
    const [form, setForm] = useState({
        cliente: location.state?.clienteId || '',
        local: location.state?.localId || '',
        fecha: new Date().toISOString().split('T')[0],
        aclaracion: '',
        ordenDeCompra: location.state?.ordenDeCompra || ''
    })

    const sigRef = useRef(null)

    useEffect(() => {
        clienteService.getAll()
            .then(data => setClientes(data.data || data))
            .catch(() => toast.error('Error al cargar los clientes'))
    }, [])

    useEffect(() => {
        if (!form.cliente || clientes.length === 0) {
            setLocales([])
            setClienteTieneLocales(false)
            return
        }
        const clienteSeleccionado = clientes.find(c => c.id === form.cliente)
        if (!clienteSeleccionado?.tieneLocales) {
            setLocales([])
            setClienteTieneLocales(false)
            setForm(prev => ({ ...prev, local: '' }))
            return
        }
        setClienteTieneLocales(true)
        localService.getByCliente(form.cliente)
            .then(data => setLocales(data.data || data))
            .catch(() => setLocales([]))
    }, [form.cliente, clientes])

    const handleChange = (e) => {
        const { name, value } = e.target
        setForm(prev => ({ ...prev, [name]: value }))
    }

    const handleItemChange = (i, value) => {
        setItems(prev => prev.map((item, idx) => idx === i ? value : item))
    }

    const addItem = () => {
        if (items.length < 20) setItems(prev => [...prev, ''])
    }

    const removeItem = (i) => {
        setItems(prev => prev.filter((_, idx) => idx !== i))
    }

    const handleGuardar = async (e) => {
        e.preventDefault()
        const itemsFiltrados = items.filter(d => d.trim())
        if (itemsFiltrados.length === 0) {
            Swal.fire({ icon: 'warning', title: 'Agregá al menos un trabajo realizado' })
            return
        }
        if (!sigRef.current || sigRef.current.isEmpty()) {
            Swal.fire({ icon: 'warning', title: 'La firma es obligatoria' })
            return
        }
        setGuardando(true)
        try {
            const payload = {
                pedidoId: location.state?.pedidoId || undefined,
                cliente: form.cliente,
                local: clienteTieneLocales && form.local ? form.local : null,
                fecha: form.fecha,
                items: itemsFiltrados.map(d => ({ descripcion: d })),
                firma: sigRef.current.toDataURL('image/png'),
                aclaracion: form.aclaracion || undefined,
                ordenDeCompra: form.ordenDeCompra || undefined
            }
            await remitoService.create(payload)
            toast.success('Remito creado')
            navigate('/remitos')
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response?.data?.message || 'Error al crear el remito'
            })
        } finally {
            setGuardando(false)
        }
    }

    return (
        <Container className="py-4" style={{ maxWidth: '700px' }}>
            <div className="d-flex align-items-center mb-4 gap-3">
                <Button variant="outline-secondary" size="sm" onClick={() => navigate(-1)}>← Volver</Button>
                <h2 className="mb-0">Nuevo Remito</h2>
            </div>

            <Card>
                <Card.Body>
                    <Form onSubmit={handleGuardar}>
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <Form.Label>Cliente</Form.Label>
                                <Form.Select name="cliente" value={form.cliente} onChange={handleChange} required>
                                    <option value="">Seleccionar cliente...</option>
                                    {clientes.map(c => (
                                        <option key={c.id} value={c.id}>{c.nombre}</option>
                                    ))}
                                </Form.Select>
                            </div>
                            <div className="col-md-6 mb-3">
                                <Form.Label>Fecha</Form.Label>
                                <Form.Control type="date" name="fecha" value={form.fecha} onChange={handleChange} required />
                            </div>
                        </div>

                        {clienteTieneLocales && (
                            <Form.Group className="mb-3">
                                <Form.Label>Local</Form.Label>
                                <Form.Select name="local" value={form.local} onChange={handleChange}>
                                    <option value="">Seleccionar local...</option>
                                    {locales.map(l => (
                                        <option key={l.id} value={l.id}>{l.nombre}</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        )}

                        <Form.Label>Trabajos realizados</Form.Label>
                        {items.map((item, i) => (
                            <div key={i} className="d-flex align-items-center mb-2">
                                <span className="me-2 text-muted fw-bold" style={{ minWidth: '22px' }}>{i + 1}.</span>
                                <Form.Control
                                    value={item}
                                    onChange={(e) => handleItemChange(i, e.target.value)}
                                    placeholder={`Descripción del trabajo ${i + 1}...`}
                                />
                                {items.length > 1 && (
                                    <Button variant="outline-danger" size="sm" className="ms-2" onClick={() => removeItem(i)}>✕</Button>
                                )}
                            </div>
                        ))}
                        {items.length < 20 && (
                            <Button variant="outline-secondary" size="sm" className="mb-4" onClick={addItem}>
                                + Agregar item
                            </Button>
                        )}

                       
                        <Form.Group className='mb-3'>
                            <Form.Label>Orden de compra</Form.Label>
                            <Form.Control
                                name='ordenDeCompra'
                                value={form.ordenDeCompra}
                                onChange={handleChange}
                                placeholder='Nº de orden de compra...'
                            />
                        </Form.Group>
                       

                        <Form.Group className="mb-3">
                            <Form.Label>Firma del cliente</Form.Label>
                            <div style={{ border: '1px solid #ced4da', borderRadius: '4px', backgroundColor: '#fff' }}>
                                <SignatureCanvas
                                    ref={sigRef}
                                    penColor="black"
                                    canvasProps={{ style: { width: '100%', height: '130px', display: 'block' } }}
                                />
                            </div>
                            <Button variant="link" size="sm" className="p-0 mt-1" onClick={() => sigRef.current?.clear()}>
                                Limpiar firma
                            </Button>
                        </Form.Group>

                        <Form.Group className="mb-4">
                            <Form.Label>Aclaración <span className="text-muted">(opcional)</span></Form.Label>
                            <Form.Control
                                name="aclaracion"
                                value={form.aclaracion}
                                onChange={handleChange}
                                placeholder="Nombre y apellido del firmante..."
                            />
                        </Form.Group>

                        <div className="d-flex justify-content-end gap-2">
                            <Button variant="secondary" onClick={() => navigate(-1)} disabled={guardando}>Cancelar</Button>
                            <Button variant="primary" type="submit" disabled={guardando}>
                                {guardando ? 'Guardando...' : 'Crear Remito'}
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    )
}

export default CrearRemitoPage