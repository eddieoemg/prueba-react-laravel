import { useCallback, useMemo } from 'react'
import { useAuthStore } from '../stores/auth'
import { useUserStore } from '../stores/user'

export function useUser() {
    const user = useUserStore((state) => state.user)
    const clearUser = useUserStore((state) => state.clearUser)

    const token = useAuthStore((state) => state.token)
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
    const clearAuth = useAuthStore((state) => state.clearAuth)

    console.log('isAuthenticated',isAuthenticated);
    const isAdmin = useMemo(() => user?.role === 'admin', [user?.role])
    const isUser = useMemo(() => user?.role === 'user', [user?.role])

    const fullName = useMemo(() => {
        if (!user) return ''
        return [user.name, user.paterno, user.materno].filter(Boolean).join(' ') || user.email
    }, [user])



    const logout = useCallback(() => {
        clearAuth()
        clearUser()
    }, [clearAuth, clearUser])

    return {
        user,
        token,
        isAuthenticated,
        isAdmin,
        isUser,
        role: user?.role || null,
        fullName,
        logout,
    }
}