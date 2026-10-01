import logo from '../assets/logo-step.png'

const RemitoPrint = ({ remito }) => {
    if (!remito) return null

    const filas = Array.from ({ length: 20}, (_, i) => remito.items?.[i] || null)


    return (
        <div id='remito-print-content' className='remito-print'>
            
            {/* ===CABECERA==== */}
            <div className='remito-header'>
                {/* Columna izquierda: logo + datos de la empresa */}
                <div className='remito-header-izq'>
                    <img src={logo} alt='STEP SERVICIOS' className='remito-logo'/>
                    <div className='remito-empresa-info'>
                        <div>Gral. Hornos 1104</div>
                        <div>Caseros, Bs. As. (CP1678)</div>
                        <div>Tel: (011) 48532271</div>
                        <div>www.stepservicios.com</div>
                        <div className='remito-iva'>IVA RESPONSABLE INSCRIPTO</div>
                    </div>
                </div>
                
                {/* Columnna central: código de tipo */}
                <div className='remito-header-centro'>X</div>

                {/* Columna derecha: título + número */}
                <div className='remito-header-der'>
                    <div className='remito-titulo'>REMITO</div>
                    <div className='remito-no-factura'>DOCUMENTO NO VALIDO COMO FACTURA</div>
                    <div className='remito-numero'>Nº 0001 - {String(remito.numero ||0).padStart(8, '0')}</div>
                    <div className='remito-fecha'>
                        Fecha: {remito.fecha ? new Date(remito.fecha).toLocaleDateString('es-AR', { timeZone: 'UTC' }): '-'}
                    </div>
                    <div className='remito-fiscal'>
                        <div>CUIT: 30-71445637-3</div>
                        <div>Ing. Brutos: CM 901-418733-3</div>
                        <div>Inicio Act.: 05/2014</div>
                    </div>
                </div>
            </div>

            {/* === DATOS DEL CLIENTE === */}
            <table className='remito-tabla'>
                <tbody>
                    <tr>
                        <td className='celda celda-border-bottom' colSpan={2}>
                            <strong>Empresa:</strong> {remito.cliente?.nombre}{remito.local?.nombre ? ` - ${remito.local.nombre}` : ''}
                        </td>
                    </tr>
                    <tr>
                        <td className='celda celda-w60'>
                            <strong>Domicilio:</strong>{' '} {remito.local?.direccion ? `${remito.local.direccion.calle} ${remito.local.direccion.numero}` :
                            remito.cliente?.direccionFiscal ? `${remito.cliente.direccionFiscal.calle} ${remito.cliente.direccionFiscal.numero}`: ''}
                        </td>
                        <td className='celda celda-border-bottom'>
                            <strong>Localidad:</strong>{' '}{remito.local?.direccion?.localidad || remito.cliente?.direccionFiscal?.ciudad}
                        </td>
                    </tr>
                    <tr>
                        <td className='celda'>
                            <strong>Condicion frente a IVA:</strong>{remito.cliente?.condicionIVA}
                        </td>
                        <td className='celda'>
                            <strong>CUIT:</strong>{remito.cliente?.cuit}
                        </td>
                    </tr>
                </tbody>
            </table>

            <table className='remito-tabla-items'>
                <thead>
                    <tr className='remito-items-header'>
                        <th className='celda celda-items-num celda-center'>Item</th>
                        <th className='celda celda-center'>Descripción de los trabajos realizados</th>
                    </tr>
                </thead>
                <tbody>
                    {filas.map((fila, i) => (
                        <tr key={i} className='remito-fila-item'>
                            <td className='celda celda-center'>{i + 1}</td>
                            <td className='celda'>{fila?.descripcion || ''}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {remito.ordenDeCompra && (
                <table className='remito-tabla-oc'>
                    <tbody>
                        <tr>
                            <td className='celda'>
                                <strong>Orden de compra:</strong>{remito.ordenDeCompra}
                            </td>
                        </tr>
                    </tbody>
                </table>
            )}

            <div className='remito-firmas-container'>
                <div className='remito-firmas'>
                    <div className='remito-firma-col'>
                        <p>Firma</p>
                        {remito.firma && remito.firma.startsWith('data') ? (
                            <img src={remito.firma} alt='Firma' className='remito-firma-img'/>
                        ) : (
                            <div className='remito-firma-linea'></div>
                        )}
                    </div>
                    <div className='remito-firma-col'>
                        <p>Aclaración</p>
                        <div className='remito-aclaracion'>
                            {remito.aclaracion || ''}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RemitoPrint