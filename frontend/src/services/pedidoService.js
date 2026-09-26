import api from './api.js'
import axios from 'axios'

const pedidoService = {
    getAll: async () => {
        const { data } = await api.get ('/pedidos')
        return data
    },

    getById: async (id) => {
        const { data } = await api.get(`/pedidos/${id}`)
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

    updateEstado: async (id, estado, motivoCancelacion = null) => {
        const { data } = await api.patch(`/pedidos/${id}/estado`, { estado, motivoCancelacion })
        return data
    },

    delete: async (id) => {
        const { data } = await api.delete(`/pedidos/${id}`)
        return data
    },

    getShareToken: async (id) => {
        const { data } = await api.get(`/pedidos/${id}/share-token`)
        return data
    },

    getPublic: async (token) => {
        const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'
        const { data } = await axios.get (`${baseURL}/pedidos/public/${token}`)
        return data
    }
}

export default pedidoService