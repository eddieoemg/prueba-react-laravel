import { useState, useEffect } from 'react'
import { peopleService } from '../../../../services/peopleService.js'

export default function PeopleDetail({ person, onClose }) {
    const [detail, setDetail] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [tab, setTab] = useState('phones')

    useEffect(() => {
        if (!person?.id) return

        const loadDetail = async () => {
            setLoading(true)
            setError(null)
            try {
                const {data} = await peopleService.getById(person.id);
                setDetail({
                    persona: data.persona,
                    telefonos: data.telefonos || [],
                    direcciones: data.direcciones || []
                })
            } catch (e) {
                console.error('Error loading detail:', e)
                setError('Error al cargar el detalle')
            } finally {
                setLoading(false)
            }
        }

        loadDetail()
    }, [person?.id])

    if (!person) return null

    const { telefonos = [], direcciones = [] } = detail || {}

    return (
        <div className="card shadow-sm">
            <div className="card-header bg-primary text-white">
                <div className="d-flex justify-content-between align-items-start">
                    <div>
                        <h6 className="mb-1">
                            {person.nombre} {person.paterno} {person.materno || ''}
                        </h6>
                        <small className="opacity-75">ID: {person.id}</small>
                    </div>
                    <button
                        type="button"
                        className="btn-close btn-close-white"
                        onClick={onClose}
                        aria-label="Cerrar"
                    />
                </div>
            </div>

            <div className="card-body p-0">
                {loading ? (
                    <div className="text-center py-4">
                        <div className="spinner-border spinner-border-sm text-primary" />
                        <p className="small text-muted mt-2 mb-0">Cargando detalles...</p>
                    </div>
                ) : error ? (
                    <div className="alert alert-danger m-3 mb-0">
                        <i className="bi bi-exclamation-triangle me-2" />
                        {error}
                    </div>
                ) : (
                    <>
                        <ul className="nav nav-tabs px-3 pt-2">
                            <li className="nav-item">
                                <button
                                    className={`nav-link ${tab === 'phones' ? 'active' : ''}`}
                                    onClick={() => setTab('phones')}
                                >
                                    <i className="bi bi-telephone me-1" />
                                    Teléfonos
                                    <span className="badge bg-info ms-2">{telefonos.length}</span>
                                </button>
                            </li>
                            <li className="nav-item">
                                <button
                                    className={`nav-link ${tab === 'addresses' ? 'active' : ''}`}
                                    onClick={() => setTab('addresses')}
                                >
                                    <i className="bi bi-geo-alt me-1" />
                                    Direcciones
                                    <span className="badge bg-secondary ms-2">{direcciones.length}</span>
                                </button>
                            </li>
                        </ul>

                        <div style={{ maxHeight: '250px', overflowY: 'auto' }}>
                            {tab === 'phones' && (
                                <ul className="list-group list-group-flush">
                                    {telefonos.length === 0 ? (
                                        <li className="list-group-item text-muted text-center py-3">
                                            <i className="bi bi-telephone-x me-2" />
                                            Sin teléfonos registrados
                                        </li>
                                    ) : (
                                        telefonos.map((t) => (
                                            <li key={t.id_telefono} className="list-group-item">
                                                <i className="bi bi-telephone-fill me-2 text-primary" />
                                                {t.telefono}
                                            </li>
                                        ))
                                    )}
                                </ul>
                            )}

                            {tab === 'addresses' && (
                                <ul className="list-group list-group-flush">
                                    {direcciones.length === 0 ? (
                                        <li className="list-group-item text-muted text-center py-3">
                                            <i className="bi bi-geo-alt-fill me-2" />
                                            Sin direcciones registradas
                                        </li>
                                    ) : (
                                        direcciones.map((d) => (
                                            <li key={d.id_direccion} className="list-group-item">
                                                <div>
                                                    <i className="bi bi-geo-alt-fill me-2 text-danger" />
                                                    <strong>{d.calle}</strong> #{d.numero_exterior}
                                                    {d.numero_interior && (
                                                        <span className="text-muted"> Int. {d.numero_interior}</span>
                                                    )}
                                                </div>
                                                <small className="text-muted ms-4">
                                                    Col. {d.colonia}, CP {d.cp}
                                                </small>
                                            </li>
                                        ))
                                    )}
                                </ul>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}