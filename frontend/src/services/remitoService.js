import api from "./api.js";

const remitoService = {
    getAll: async () => { const { data } = await api.get('/remitos'); return data },
    getById: async (id) => { const { data } = await api.get(`/remitos/${id}`); return data},
    create: async (remitoData) => { const { data } = await api.post ('/remitos', remitoData); return data },
    delete: async (id) => { const { data } = await api.delete(`/remitos/${id}`); return data }
}

export default remitoService