import api from './api.js'

const pedidoService = {
    getAll: async () => {
        const { data } = await api.get ('/pedidos')
        return data
    },

    create: async (pedidoData) => {
        const { data } = await api.post('/pedidos', pedidoData)
        return data
    },

    update: async (id, pedidoData) => {
        const { data } = await api.put(`/pedidos/${id}`, pedidoData)
        return data
    },

    updateEstado: async (id, estado) => {
        const { data } = await api.patch(`/pedidos/${id}/estado`, { estado })
        return data
    },

    delete: async (id) => {
        const { data } = await api.delete(`/pedidos/${id}`)
        return data
    }
}

export default pedidoService