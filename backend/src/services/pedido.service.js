import PedidoRepository from "../repositories/pedido.repository.js";
import ClienteService from "./cliente.service.js";
import LocalService from "./local.service.js";
import UserService from "./user.service.js";
import { sendPedidoAsignadoEmail } from "./email.service.js";
import { USER_ROLES } from "../constants/index.js";

export default class PedidoService {
    constructor() {
        this.pedidoRepository = new PedidoRepository();
        this.clienteService = new ClienteService();
        this.localService = new LocalService();
        this.userService = new UserService();
    }

    createPedido = async (pedidoData) =>{
        await this.clienteService.getClienteById(pedidoData.cliente);
        if (pedidoData.local) await this.localService.getLocalById(pedidoData.local)
        const tecnico = await this.userService.getUserById(pedidoData.asignadoA);

        const pedido = await this.pedidoRepository.createPedido(pedidoData);

        await this.pedidoRepository.addPedidoToUsuario(pedidoData.asignadoA, pedido.id);

        await sendPedidoAsignadoEmail(tecnico.email, tecnico.nombre, pedido)

        return pedido;
    }

    getPedidoById = async (id) => {
        const pedido = await this.pedidoRepository.findPedidoById(id);
        if(!pedido) throw new Error('Pedido no encontrado');
        return pedido;
    }

    getPedidosByCliente = async (clienteId) => {
        await this.clienteService.getClienteById(clienteId);
        return await this.pedidoRepository.findPedidosByCliente(clienteId);
    }

    getPedidosByUsuarios = async (usuarioId) => {
        await this.userService.getUserById(usuarioId);
        return await this.pedidoRepository.findPedidosByUsuario(usuarioId);
    }

    getAllPedidos = async (user) => {
        let filtro = {};
        if (user.rol === USER_ROLES.TECNICO) {
            filtro = { asignadoA: user.id };
        } else if ([USER_ROLES.SUPERVISOR, USER_ROLES.COMERCIAL].includes(user.rol)) {
            filtro = { $or: [{ creadoPor: user.id }, { asignadoA: user.id }] }
        }
        return await this.pedidoRepository.findAllPedidos(filtro);
    }

    updatePedido = async (id, pedidoData) => {
        const pedidoActual = await this.getPedidoById(id)

        if (pedidoData.cliente) await this.clienteService.getClienteById(pedidoData.cliente);
        if (pedidoData.local) await this.localService.getLocalById(pedidoData.local);
        if (pedidoData.asignadoA) await this.userService.getUserById(pedidoData.asignadoA);

        const pedidoActualizado = await this.pedidoRepository.updatePedido(id, pedidoData);

        if (pedidoData.asignadoA && pedidoData.asignadoA !== pedidoActual.asignadoA?.toString())
        {
            const tecnico = await this.userService.getUserById(pedidoData.asignadoA);
            await sendPedidoAsignadoEmail(tecnico.email, tecnico.nombre, pedidoActualizado);
        }

        return pedidoActualizado
    }

    updateEstado = async (id, estado, motivoCancelacion) => {
        await this.getPedidoById(id);
        return await this.pedidoRepository.updateEstado(id, estado, motivoCancelacion);
    }

    deletePedido = async (id) => {
        const pedido = await this.getPedidoById(id);
        await this.pedidoRepository.removePedidoFromUsuario(pedido.asignadoA, id);
        return await this.pedidoRepository.deletePedido(id);
    }


}