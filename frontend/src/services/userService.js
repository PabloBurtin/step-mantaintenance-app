import api from './api.js'

const userService = {
    getAll: async () => {
        const { data } = await api.get('/users')
        return data
    },

    create: async (userData) => {
        const { data } = await api.post('/users', userData)
        return data
    },

    update: async (id, userData) => {
        const { data } = await api.put (`/users/${id}`, userData)
        return data
    },

    updateRol: async (id, rol) => {
        const { data } = await api.patch(`/users/${id}/rol`, { rol })
        return data
    },

    delete: async (id) => {
        const { data } = await api.delete(`/users/${id}`)
        return data
    },

    updatePerfil: async (data) => {
        const { data: res } = await api.patch('/users/perfil', data)
        return res
    },

    updatePassword: async (id, passwordActual, passwordNuevo) => {
        const { data } = await api.patch(`/users/${id}/password`, { passwordActual, passwordNuevo })
        return data
    }
}

export default userService