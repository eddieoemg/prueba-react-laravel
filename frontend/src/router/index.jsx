import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { useUser } from '../hooks/useUser'
import Login from '../pages/auth/Login'
import Dashboard from '../pages/panel/Dashboard'

function PrivateRoute() {
    const { isAuthenticated } = useUser()

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }

    return <Outlet />
}

function PublicRoute() {
    const { isAuthenticated } = useUser()

    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />
    }

    return <Outlet />
}

export default function AppRouter() {
    return (
        <Routes>
            <Route element={<PublicRoute />}>
                <Route path="/login" element={<Login />} />
            </Route>

            <Route element={<PrivateRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
            </Route>

            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
    )
}