import { useState, useEffect, useRef } from "react";
import { Container, Table, Button, Modal, Form } from 'react-bootstrap';
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import html2pdf from 'html2pdf.js';
import SignatureCanvas from 'react-signature-canvas';
import { useLocation } from 'react-router-dom'
import remitoService from '../services/remitoService.js';
import clienteService from "../services/clienteService.js";
import localService from "../services/localService.js";
import RemitoPrint from "../components/RemitoPrint.jsx";
import { useAuth } from '../context/AuthContext.jsx'

const initialForm = {
    cliente: '',
    local: '',
    fecha: new Date().toISOString().split('T')[0],
    aclaracion: '',
    ordenDeCompra: ''
}

const RemitoPage = () => {
    const [remitos, setRemitos] = useState([])
    const [loading, setLoading] = useState(true)

    const [showModal, setShowModal] = useState(false)
    const [clientes, setClientes] = useState([])
    const [locales, setLocales] = useState([])
    const [clienteTieneLocales, setClienteTieneLocales] = useState(false)
    const [form, setForm] = useState(initialForm)
    const [items, setItems] = useState([''])

    const [showDetalle, setShowDetalle] = useState(false)
    const [remitoVista, setRemitoVista] = useState(null)
    const [loadingDetalle, setLoadingDetalle] = useState(false)
    const [generandoPDF, setGenerandoPDF] = useState(false)

    const { user } = useAuth()
    const esAdmin = user?.rol === 'admin'
    const esSupervisorOAdmin = ['admin', 'Supervisor'].includes(user?.rol)

    const location = useLocation()

    const sigRef = useRef(null)

    const cargarRemitos = async () => {
        try {
            const data = await remitoService.getAll()
            setRemitos(data.data || data)
        } catch {
            toast.error('Error al cargar los remitos')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { cargarRemitos() }, [])

    useEffect(() =>{
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

    useEffect(() => {
        if (location.state?.clienteId) {
            abrirModal(location.state.clienteId, location.state.localId)
        }
    }, [])

    const abrirModal = async (clienteIdPreseleccionado = null, localIdPreseleccionado = null) => {
        try {
            const clientesData = await clienteService.getAll()
            setClientes(clientesData.data || clientesData)
            setForm({ ...initialForm, cliente: clienteIdPreseleccionado || '', local: localIdPreseleccionado || '' })
            setItems([''])
            setShowModal(true)
            setTimeout(() => {sigRef.current?.clear() }, 100)
        } catch {
            toast.error('Error al cargar los clientes')
        }
    }

    const abrirDetalle = async (remito) => {
        setLoadingDetalle(true)
        setShowDetalle(true)
        try {
            const data = await remitoService.getById(remito.id)
            setRemitoVista(data.data || data)
        } catch {
            toast.error('Error al cargar el remito')
            setShowDetalle(false)
        } finally {
            setLoadingDetalle(false)
        }
    }

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
        if (itemsFiltrados.length === 0){
            Swal.fire({ icon:'warning', title:'Agregá al menos un trabajo realizado' })
            return
        }
        if (!sigRef.current || sigRef.current.isEmpty()) {
            Swal.fire({ icon:'warning', title: 'La firma es obligatoria' })
            return
        }
        try {
            const payload = {
                cliente: form.cliente,
                local: clienteTieneLocales && form.local ? form.local : null,
                fecha: form.fecha,
                items: itemsFiltrados.map(d => ({ descripcion: d})),
                firma: sigRef.current.toDataURL('image/png'),
                aclaracion: form.aclaracion || undefined,
                ordenDeCompra: form.ordenDeCompra || undefined
            }
            await remitoService.create(payload)
            toast.success('Remito creado')
            setShowModal(false)
            cargarRemitos()
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response?.data?.message || 'Error al crear el remito'
            })
        }
    }

    const handleEliminar = async (remito) => {
        const result = await Swal.fire({
            title: `¿Eliminar remito #${remito.numero}?`,
            text: 'Esta acción no se puede deshacer',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Si, eliminar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#d33'
        })
        if (result.isConfirmed) {
            try {
                await remitoService.delete(remito.id)
                toast.success('Remito eliminado')
                cargarRemitos()
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: error.response?.data?.message || 'Error al eliminar el remito'
                })
            }
        }
    }

    const getPDFOptions = (numero) => ({
        margin: [5, 5, 5, 5],
        filename: `remito-${numero}.pdf`,
        image: { type: 'jpeg', quality: 0.98},
        html2canvas: { scale: 2, useCORS: true},
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait'}
    })

    const descargarPDF = () => {
        const element = document.getElementById('remito-print-content')
        html2pdf().set(getPDFOptions(remitoVista.numero)).from(element).save()
    }

    const compartirPDF = async () => {
        setGenerandoPDF(true)
        try {
            const element = document.getElementById('remito-print-content')
            const opt = getPDFOptions(remitoVista.numero)
            const blob = await html2pdf().set(opt).from(element).output('blob')
            const file = new File([blob], opt.filename, { type: 'application/pdf' })

            if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
                await navigator.share({ title: `Remito #${remitoVista.numero}`, files: [file] })
            } else {
                const url =  URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = opt.filename
                a.click()
                URL.revokeObjectURL(url)
            }
        } catch (error) {
            if (error.name !== 'AbortError') toast.error('Error al compartir el PDF')
        } finally {
            setGenerandoPDF(false)
        }
    }

    return (
        <Container>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Remitos</h2>
                <Button variant="primary" onClick={abrirModal}>➕ Nuevo Remito</Button>
            </div>

            {loading ? (
                <p>Cargando...</p>
            ) : (
                <Table striped bordered hover responsive>
                    <thead className="table-dark">
                        <tr>
                            <th>#</th>
                            <th>Fecha</th>
                            <th>Cliente</th>
                            <th>Local</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {remitos.map(remito => (
                            <tr key={remito.id} style={{ cursor: 'pointer' }} onClick={() => abrirDetalle(remito)}>
                                <td>{remito.numero}</td>
                                <td>{remito.fecha ? new Date(remito.fecha).toLocaleDateString('es-AR'): '-'}</td>
                                <td>{remito.cliente?.nombre}</td>
                                <td>{remito.local?.nombre || '-'}</td>
                                <td onClick={e => e.stopPropagation()}>
                                    {esAdmin && (
                                        <Button size="sm" variant="outline-danger" onClick={() => handleEliminar(remito)}>Eliminar</Button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}

            <Modal show={showDetalle} onHide={() => setShowDetalle(false)} size="xl">
                <Modal.Header closeButton>
                    <Modal.Title>Remito #{remitoVista?.numero}</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ backgroundColor: '#f0f0f0', padding: '20px'}}>
                    {loadingDetalle ? (
                        <p className="text-center">Cargando...</p>
                    ) : (
                        <RemitoPrint remito={remitoVista}/>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDetalle(false)}>Cerrar</Button>
                    <Button variant="outline-primary" onClick={descargarPDF} disabled={loadingDetalle}>⬇️ Descargar PDF</Button>
                    <Button variant="success" onClick={compartirPDF} disabled={loadingDetalle || generandoPDF}> {generandoPDF ? 'Generando...' : '📤 Compartir'}</Button>
                </Modal.Footer>
            </Modal>

            {/*Modal crear remito */}

            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Nuevo Remito</Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleGuardar}>
                    <Modal.Body>
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <Form.Label>Cliente</Form.Label>
                                <Form.Select name="cliente" value={form.cliente} onChange={handleChange} required>
                                    <option value="">Seleccionar cliente...</option>
                                    {clientes.map (c => (
                                        <option key={c.id} value={c.id}>{c.nombre}</option>
                                    ))}
                                </Form.Select>
                            </div>
                            <div className="col-md-6 mb-3">
                                <Form.Label>Fecha</Form.Label>
                                <Form.Control type="date" name="fecha" value={form.fecha} onChange={handleChange} required/>
                            </div>
                        </div>

                        {clienteTieneLocales && (
                            <Form.Group className="mb-3">
                                <Form.Label>Local</Form.Label>
                                <Form.Select name="local" value={form.local} onChange={handleChange} required>
                                    <option value="">Seleccionar local...</option>
                                    {locales.map (l => (
                                        <option key={l.id} value={l.id}>{l.nombre}</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        )}

                        <Form.Label>Trabajos realizados</Form.Label>
                        {items.map((item, i) => (
                            <div key={i} className="d-flex align-items-center mb-2">
                                <span className="me-2 text-muted fw-bold" style={{ minWidth:'22px' }}>{i + 1}.</span>
                                <Form.Control
                                    value={item}
                                    onChange={(e) => handleItemChange(i, e.target.value)}
                                    placeholder={`Descripción del trabajo ${i + 1}...`}/>
                                    {items.length > 1 && (
                                        <Button variant='outline-danger' size="sm" className="ms-2" onClick={() => removeItem(i)}>x</Button>
                                    )}
                            </div>
                        ))}
                        {items.length < 20 && (
                            <Button variant="outline-secondary" size="sm" className="mb-3" onClick={addItem}> + Agregar item</Button>
                        )}

                        <Form.Group className="mb-3">
                            <Form.Label>Orden de compra <span className="text-muted">(opcional)</span></Form.Label>
                            <Form.Control
                                name="ordenDeCompra"
                                value={form.ordenDeCompra}
                                onChange={handleChange}
                                placeholder="Nº de orden de compra..."
                            />
                        </Form.Group>

                        <div className="row -mt-2">
                            <div className="col-12 mb-3">
                                <Form.Label>Firma del cliente</Form.Label>
                                <div style={{ border: '1px solid #ced4da', borderRadius: '4px', backgroundColor: '#fff' }}>
                                    <SignatureCanvas
                                        ref={sigRef}
                                        penColor="black"
                                        canvasProps={{
                                            style: { width: '100%', height: '120px', display: 'block' }
                                        }}
                                    />
                                    <Button variant="link" size="sm" className="p-0 mt-1" onClick={() => sigRef.current?.clear()}>Limpiar firma</Button>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <Form.Label>Aclaración</Form.Label>
                                    <Form.Control
                                        name="aclaracion"
                                        value={form.aclaracion}
                                        onChange={handleChange}
                                        placeholder="Nombre y apellido..."
                                    />
                                </div>
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
                        <Button variant="primary" type="submit">Crear remito</Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </Container>
    )
}

export default RemitoPage