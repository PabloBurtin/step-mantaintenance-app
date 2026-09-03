import api from './api.js';

const clienteService = {
    getAll: async (page = 1, limit = 10) => {
        const { data } = await api.get(`/clientes?page=${page}&limit=${limit}`)
        return data
    },

    getById: async (id) => {
        const { data } = await api.get(`/clientes/${id}`)
        return data
    },

    create: async (clienteData) => {
        const { data } = await api.post('/clientes', clienteData)
        return data
    },

    update: async (id, clienteData) => {
        const { data } = await api.put(`/clientes/${id}`, clienteData)
        return data
    },

    delete: async (id) => {
        const { data } = await api.delete(`/clientes/${id}`)
        return data
   }
}

export default clienteService