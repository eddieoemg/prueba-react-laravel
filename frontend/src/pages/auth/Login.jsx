import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export default function Login() {
    const navigate = useNavigate()
    const { login, loading, error } = useAuth()

    const [form, setForm] = useState({
        email: '',
        password: '',
    })

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const result = await login(form.email, form.password)

        if (result.success) {
            navigate('/dashboard')
        }
    }

    return (
        <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
            <div className="card shadow" style={{ maxWidth: '400px', width: '100%' }}>
                <div className="card-body p-4">
                    <h2 className="card-title text-center mb-4">Iniciar Sesión</h2>

                    {error && (
                        <div className="alert alert-danger alert-dismissible">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                required
                                className="form-control"
                                placeholder="Ingresa tu correo electronico"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="form-label">Contraseña</label>
                            <input
                                type="password"
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                required
                                className="form-control"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary w-100"
                        >
                            {loading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" />
                                    Ingresando...
                                </>
                            ) : (
                                'Ingresar'
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}