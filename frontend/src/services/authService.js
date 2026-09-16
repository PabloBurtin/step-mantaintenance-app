import api from "./api.js";

const authService = {
    login: async (email, password) => {
        const { data } = await api.post('/auth/login', { email, password })
        return data
    },

    logout: async () => {
        await api.post('/auth/logout')
    },

    refresh: async (refreshToken) => {
        const { data } = await api.post('/auth/refresh-token', { refreshToken })
        return data
    },

    changePassword: async (passwordActual, passwordNuevo) => {
        const { data } = await api.patch('/auth/change-password', { passwordActual, passwordNuevo })
        return data
    },
    
    forgotPassword: async (email) => {
        const { data } = await api.post ('/auth/forgot-password', { email })
        return data
    },

    resetPassword: async (token, password) => {
        const { data } = await api.post(`/auth/reset-password/${token}`, { password })
        return data
    }
}

export default authService