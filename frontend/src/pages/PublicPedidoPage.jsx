import { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { Container, Card, Row, Col, Badge, Alert } from 'react-bootstrap';
import pedidoService from "../services/pedidoService.js";
import logo from "../assets/logo-step.png"
import { PEDIDOS_ESTADOS } from "../constants/index.js";

const estadoVariant = {
    'Pendiente': 'warning',
    'En curso': 'primary',
    'Finalizado': 'success',
    'Cancelado': 'danger'
}

const PublicPedidoPage = () => {
    const { token } = useParams()
    const [pedido, setPedido] = useState(null)
    const [ loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        pedidoService.getPublic(token)
            .then(data => setPedido(data.data))
            .catch(() => setError('El link es inválido o ha expirado.'))
            .finally(() => setLoading(false))
    }, [token])

    if (loading) return (
        <Container className="py-5 text-center"><p>Cargando...</p></Container>
    )

    if (error) return (
        <Container className="py-5" style={{ maxWidth: 500 }}>
            <Alert variant="danger">{error}</Alert>
        </Container>
    )

    return (
        <Container className="py-5" style={{ maxWidth: 700 }}>
            <div className="mb-4">
                <div className="auth-logo-container">
                    <img src={logo} alt="Step Servicios SA" className="auth-logo" />
                </div>
                <div className="d-flex align-items-center gap-3 mt-1">
                    <h3 className="mb-0">Pedido #{String(pedido.numero).padStart(4, '0')}</h3>
                    <Badge bg={estadoVariant[pedido.estado]}>{pedido.estado}</Badge>
                </div>
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
                            <small className="text-muted d-block">Fecha de creación</small>
                            <span className="fw-semibold">{pedido.createdAt ? new Date(pedido.createdAt).toLocaleDateString('es-AR') : '-'}</span>
                        </Col>
                        {pedido.ordenDeCompra &&(
                            <Col md={6}>
                                <small className="text-muted d-block">Orden de compra</small>
                                <span className="fw-semibold">{pedido.ordenDeCompra}</span>
                            </Col>
                        )}
                        {pedido.local?.direccion && (
                            <Col md={6}>
                                <small className="text-muted d-block">Dirección</small>
                                <span className="fw-semibold">{`${pedido.local.direccion.calle} ${pedido.local.direccion.numero}, ${pedido.local.direccion.localidad}, ${pedido.local.direccion.provincia}`}</span>
                            </Col>
                        )}
                        {pedido.local?.ubicacionMaps && (
                            <Col md={6}>
                                <small className="text-muted d-block">Ubicación</small>
                                <a href={pedido.local.ubicacionMaps} target="_blank" rel="noreferrer" className="fw-semibold">
                                    Ver en Google Maps
                                </a>
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
                                <span className="fw-semibold">{new Date(pedido.fechaConclusion).toLocaleDateString('es-AR')}</span>
                            </Col>
                        )}
                        {pedido.estado === PEDIDOS_ESTADOS.CANCELADO && pedido.motivoCancelacion && (
                            <Col md={6}>
                                <small className="text-muted d-block">Motivo de cancelación</small>
                                <span className="fw-semibold">{pedido.motivoCancelacion}</span>
                            </Col>
                        )}
                    </Row>
                </Card.Body>
            </Card>    
            <p className="text-muted text-center mt-4" style={{ fontSize: '0.8rem' }}>
                Este link expira en 24 horas
            </p>   
        </Container>
    )
}

export default PublicPedidoPage