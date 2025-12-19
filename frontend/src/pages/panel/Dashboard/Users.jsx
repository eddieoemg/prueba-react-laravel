import { useState, useEffect, useCallback } from 'react'
import { userService } from '../../../services/userService'

export default function Users() {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [editing, setEditing] = useState(null)
    const [form, setForm] = useState({ name: '', email: '', password: '', is_admin: false })
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState(null)

    const fetchUsers = useCallback(async () => {
        setLoading(true)
        try {
            const { data } = await userService.getAll()
            setUsers(data.data || [])
        } catch (e) {
            console.error('Error fetching users:', e)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchUsers()
    }, [fetchUsers])

    const openCreate = () => {
        setEditing(null)
        setForm({ name: '', email: '', password: '', is_admin: false })
        setError(null)
        setShowModal(true)
    }

    const openEdit = (user) => {
        setEditing(user)
        setForm({
            name: user.name,
            email: user.email,
            password: '',
            is_admin: user.roles?.some(r => r.name === 'admin') || false
        })
        setError(null)
        setShowModal(true)
    }

    const handleClose = () => {
        if (saving) return
        setShowModal(false)
        setEditing(null)
        setError(null)
    }

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSaving(true)
        setError(null)

        try {
            if (editing) {
                await userService.update(editing.id, form)
            } else {
                await userService.create(form)
            }
            setShowModal(false)
            fetchUsers()
        } catch (err) {
            setError(err.response?.data?.message || 'Error al guardar')
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async (user) => {
        if (!window.confirm(`¿Eliminar a ${user.name}?`)) return
        try {
            await userService.delete(user.id)
            fetchUsers()
        } catch (err) {
            alert('Error al eliminar usuario')
        }
    }

    return (
        <>
            <div className="card shadow-sm">
                <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">
                    <span>
                        <i className="bi bi-person-gear me-2" />
                        Administrar Usuarios
                    </span>
                    <button className="btn btn-success btn-sm" onClick={openCreate}>
                        <i className="bi bi-plus-lg me-1" />
                        Nuevo
                    </button>
                </div>
                <div className="card-body p-0">
                    {loading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border text-primary" />
                        </div>
                    ) : !users.length ? (
                        <div className="text-center py-5 text-muted">
                            <i className="bi bi-person-x fs-1 d-block mb-2" />
                            No hay usuarios
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-hover mb-0">
                                <thead className="table-light">
                                <tr>
                                    <th>Nombre</th>
                                    <th>Correo</th>
                                    <th className="text-center">Rol</th>
                                    <th className="text-center" style={{ width: '120px' }}>Acciones</th>
                                </tr>
                                </thead>
                                <tbody>
                                {users.map(u => (
                                    <tr key={u.id}>
                                        <td>{u.name}</td>
                                        <td>{u.email}</td>
                                        <td className="text-center">
                                            {u.role === 'admin' ? (
                                                <span className="badge bg-warning text-dark">Admin</span>
                                            ) : (
                                                <span className="badge bg-secondary">Usuario</span>
                                            )}
                                        </td>
                                        <td className="text-center">
                                            <button
                                                className="btn btn-primary btn-sm me-1"
                                                onClick={() => openEdit(u)}
                                            >
                                                <i className="bi bi-pencil" />
                                            </button>
                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => handleDelete(u)}
                                            >
                                                <i className="bi bi-trash" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {showModal && (
                <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    <i className={`bi ${editing ? 'bi-pencil' : 'bi-person-plus'} me-2`} />
                                    {editing ? 'Editar Usuario' : 'Nuevo Usuario'}
                                </h5>
                                {!saving && <button className="btn-close" onClick={handleClose} />}
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="modal-body">
                                    {error && (
                                        <div className="alert alert-danger py-2">
                                            <i className="bi bi-exclamation-triangle me-2" />
                                            {error}
                                        </div>
                                    )}
                                    <div className="mb-3">
                                        <label className="form-label">Nombre</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="name"
                                            value={form.name}
                                            onChange={handleChange}
                                            required
                                            disabled={saving}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Correo Electrónico</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            name="email"
                                            value={form.email}
                                            onChange={handleChange}
                                            required
                                            disabled={saving}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">
                                            Contraseña {editing && <small className="text-muted">(dejar vacío para no cambiar)</small>}
                                        </label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            name="password"
                                            value={form.password}
                                            onChange={handleChange}
                                            required={!editing}
                                            disabled={saving}
                                            minLength={6}
                                        />
                                    </div>
                                    <div className="form-check form-switch">
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            id="is_admin"
                                            name="is_admin"
                                            checked={form.is_admin}
                                            onChange={handleChange}
                                            disabled={saving}
                                        />
                                        <label className="form-check-label" htmlFor="is_admin">
                                            <i className="bi bi-shield-check me-1" />
                                            Administrador
                                        </label>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={handleClose} disabled={saving}>
                                        Cancelar
                                    </button>
                                    <button type="submit" className="btn btn-primary" disabled={saving}>
                                        {saving ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" />
                                                Guardando...
                                            </>
                                        ) : (
                                            <>
                                                <i className="bi bi-check-lg me-1" />
                                                Guardar
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}