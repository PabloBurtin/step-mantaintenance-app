import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Card, Badge, Button, Row, Col } from "react-bootstrap";
import { toast } from 'react-toastify';
import pedidoService from "../services/pedidoService.js";
import { PEDIDOS_ESTADOS } from "../constants/index.js";

const estadoVariant = {
    'Pendiente': 'warning',
    'En curso': 'primary',
    'Finalizado': 'success',
    'Cancelado': 'danger'
}

const PedidoDetailPage = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [pedido, setPedido] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const cargar = async () => {
            try {
                const data = await pedidoService.getById(id)
                setPedido(data.data)
            }catch {
                toast.error('No se pudo cargar el pedido')
                navigate('/pedidos')
            } finally {
                setLoading(false)
            }
        }

        cargar()
    }, [id])

    if (loading) return <Container className="py-4"><p>Cargando...</p></Container>
    if(!pedido) return null

    return (
        <Container className="py-4">
            <div className="d-flex align-items-center gap-3 mb-4">
                <Button variant="outline-light" onClick={() => navigate('/pedidos')}>⬅️ Volver</Button>
                <h2 className="mb-0">Pedido #{String(pedido.numero).padStart(4, '0')}</h2>
                <Badge bg={estadoVariant[pedido.estado]}>{pedido.estado}</Badge>
            </div>

            <Card className="shadow-sm">
                <Card.Body>
                    <Row className="g-4">
                        <Col md={6}>
                            <small className="text-muted d-block">Cliente</small>
                            <span className="fw-semibold">{pedido.cliente?.nombre || '-'}</span>
                        </Col>
                        <Col md={6}>
                            <small className="text-muted d-block">Local</small>
                            <span className="fw-semibold">{pedido.local?.nombre || '-'}</span>
                        </Col>
                        <Col md={6}>
                            <small className="text-muted d-block">Técnico asignado</small>
                            <span className="fw-semibold">{pedido.asignadoA ? `${pedido.asignadoA.nombre} ${pedido.asignadoA.apellido}` : '-'}</span>
                        </Col>
                        <Col md={6}>
                            <small className="text-muted d-block">Tipo</small>
                            <span className="fw-semibold">{pedido.tipo}</span>
                        </Col>
                        <Col md={6}>
                            <small className="text-muted d-block">Orden de compra</small>
                            <span className="fw-semibold">{pedido.ordenDeCompra}</span>
                        </Col>
                        <Col md={6}>
                            <small className="text-muted d-block">Fecha de creación</small>
                            <span className="fw-semibold">{pedido.createdAt ? new Date(pedido.createdAt).toLocaleDateString('es-Ar') : '-'}</span>
                        </Col>
                        {pedido.local?.direccion && (
                            <Col md={6}>
                                <small className="text-muted d-block">Dirección</small>
                                <span className="fw-semibold">
                                   {`${pedido.local.direccion.calle} ${pedido.local.direccion.numero}, ${pedido.local.direccion.localidad}, ${pedido.local.direccion.provincia}`}
                                </span>
                            </Col>
                        )}
                        {pedido.local?.ubicacionMaps && (
                            <Col md={6}>
                                <small className="text-muted d-block"> Ubicación</small>
                                <a href={pedido.local.ubicacionMaps} target="_blank" rel="noreferrer" className="fw-semibold">Ver en Google Maps</a>
                            </Col>
                        )}
                        {pedido.descripcion && (
                            <Col md={12}>
                                <small className="text-muted d-block">Descripción</small>
                                <span className="fw-semibold">{pedido.descripcion}</span>
                            </Col>
                        )}
                        {pedido.fechaConclusion && (
                            <Col md={12}>
                                <small className="text-muted d-block">Fecha de conclusión</small>
                                <span className="fw-semibold"> {new Date(pedido.fechaConclusion).toLocaleDateString('es-Ar')}</span>
                            </Col>
                        )}
                        {pedido.estado === PEDIDOS_ESTADOS.CANCELADO && pedido.motivoCancelacion && (
                            <Col md={12}>
                                <small className="text-muted d-block">Motivo de cancelación</small>
                                <span className="fw-semibold text-danger">{pedido.motivoCancelacion}</span>
                            </Col>
                        )}
                    </Row>
                </Card.Body>
            </Card>
        </Container>
    )
}

export default PedidoDetailPage
