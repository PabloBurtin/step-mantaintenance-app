import api from './api.js'

const localService = {
    getByCliente: async (clienteId) => {
        const { data } = await api.get(`/locales?clienteId=${clienteId}`)
        return data
    },

    create: async (localData) => {
        const { data } = await api.post('/locales', localData)
        return data
    },

    update: async (id, localData) => {
        const { data} = await api.put(`/locales/${id}`, localData)
        return data
    },

    delete: async (id) => {
        const { data } = await api.delete(`/locales/${id}`)
        return data
    }
}

export default localService