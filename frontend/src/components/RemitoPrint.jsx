import logo from '../assets/logo-step.png'

const RemitoPrint = ({ remito }) => {
    if (!remito) return null

    const filas = Array.from ({ length: 20}, (_, i) => remito.items?.[i] || null)

    const cellStyle = { border: '1px solid #000', padding: '3px 6px' }

    return (
        <div id='remito-print-content' 
        style={{
            fontFamily: 'Arial, sans.serif',
            fontSize: '10px',
            padding: '8mm',
            maxWidth: '210mm',
            margin: '0 auto',
            boxSizing: 'border-box',
            color: '#000',
            backgroundColor: '#fff'
        }}>
            {/* ===CABECERA==== */}
            <div style={{ display: 'flex', border: '1px solid #000', alignItems: 'stretch', marginBottom: '6px' }}>
                {/* Columna izquierda: logo + datos de la empresa */}
                <div style={{ flex: '1', padding: '6px 8px', borderRight: '1px solid #000' }}>
                    <img src={logo} alt='STEP SERVICIOS' style={{ maxHeight: '70px', width: 'auto', maxWidth: '180px', display: 'block' }}/>
                    <div style={{ fontSize: '9px', lineHeight: '1.5', marginTop: '4px' }}>
                        <div>Gral. Hornos 1104</div>
                        <div>Caseros, Bs. As. (CP1678)</div>
                        <div>Tel: (011) 48532271</div>
                        <div>www.stepservicios.com</div>
                        <div style={{ fontWeight: 'bold', marginTop: '3px' }}>IVA RESPONSABLE INSCRIPTO</div>
                    </div>
                </div>
                
                {/* Columnna central: código de tipo */}
                <div style={{ width: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRight: '1px solid black', fontSize: '32px', fontWeight: 'bold', alignSelf: 'stretch' }}>
                    X
                </div>

                {/* Columna derecha: título + número */}
                <div style={{ flex: '1', padding: '6px 8px', textAlign: 'right' }}>
                    <div style={{ fontSize: '18px', fontWeight: 'bold', letterSpacing: '2px' }}>REMITO</div>
                    <div style={{ fontSize: '8px', marginBottom: '4px'}}>DOCUMENTO NO VALIDO COMO FACTURA</div>
                    <div style={{ fontSize: '10px', marginTop: '4px' }}>Nº 0001 - {String(remito.numero ||0).padStart(8, '0')}</div>
                    <div style={{ fontSize: '9px', marginTop: '8px' }}>
                        Fecha: {remito.fecha ? new Date(remito.fecha).toLocaleDateString('es-AR'): '-'}
                    </div>
                    <div style={{ fontSize: '8px', marginTop: '6px', lineHeight: '1.5'}}>
                        <div>CUIT: 30-71445637-3</div>
                        <div>Ing. Brutos: CM 901-418733-3</div>
                        <div>Inicio Act.: 05/2014</div>
                    </div>
                </div>
            </div>

            {/* === DATOS DEL CLIENTE === */}
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '4px' }}>
                <tbody>
                    <tr>
                        <td style={{ ...cellStyle, borderBottom: '1px solid black'}} colSpan={2}>
                            <strong>Empresa:</strong> {remito.cliente?.nombre}
                        </td>
                    </tr>
                    <tr>
                        <td style={{ ...cellStyle, width: '60%' }}>
                            <strong>Domicilio:</strong>{' '} {remito.local?.direccion ? `${remito.local.direccion.calle} ${remito.local.direccion.numero}` :
                            remito.cliente?.direccionFiscal ? `${remito.cliente.direccionFiscal.calle} ${remito.cliente.direccionFiscal.numero}`: ''}
                        </td>
                        <td style={{ ...cellStyle, borderBottom: '1px solid black' }}>
                            <strong>Localidad:</strong>{' '}{remito.local?.direccion?.localidad || remito.cliente?.direccionFiscal?.ciudad}
                        </td>
                    </tr>
                    <tr>
                        <td style={cellStyle}>
                            <strong>Condicion frente a IVA:</strong>{remito.cliente?.condicionIVA}
                        </td>
                        <td style={cellStyle}>
                            <strong>CUIT:</strong>{remito.cliente?.cuit}
                        </td>
                    </tr>
                </tbody>
            </table>

            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '-1px' }}>
                <thead>
                    <tr style={{ backgroundColor: '#bdbdbd' }}>
                        <th style={{ ...cellStyle, width: '45px', textAlign: 'center' }}>Item</th>
                        <th style={{ ...cellStyle, textAlign: 'center' }}>Descripción de los trabajos realizados</th>
                    </tr>
                </thead>
                <tbody>
                    {filas.map((fila, i) => (
                        <tr key={i} style={{ height: '20px' }}>
                            <td style={{ ...cellStyle, textAlign: 'center' }}>{i + 1}</td>
                            <td style={cellStyle}>{fila?.descripcion || ''}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {remito.ordenDeCompra && (
                <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '4px' }}>
                    <tbody>
                        <tr>
                            <td style={{ border: '1px solid #000', padding: '3px 6px', fontSize: '10px' }}>
                                <strong>Orden de compra:</strong>{remito.ordenDeCompra}
                            </td>
                        </tr>
                    </tbody>
                </table>
            )}

            <div style={{ border: '1px solid #000', marginTop: '-1px', padding: '8px 12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '20px' }}>
                    <div style={{ flex: 1 }}>
                        <p style={{ margin: '0 0 4px', fontSize: '10px' }}>Firma</p>
                        {remito.firma && remito.firma.startsWith('data') ? (
                            <img src={remito.firma} alt='Firma' style={{ height: '60px', border: '1px solid #ccc', display: 'block' }}/>
                        ) : (
                            <div style={{ borderBottom: '1px solid #000', height: '60px' }}></div>
                        )}
                    </div>
                    <div style={{ flex: 1 }}>
                        <p style={{ margin: '0 0 4px', fontSize: '10px' }}>Aclaración</p>
                        <div style={{ borderBottom: '1px solid #000', height: '60px', paddingTop: '40px' }}>
                            {remito.aclaracion || ''}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RemitoPrint