export default class BaseDAO {

    constructor(model) {
        this.model = model;
    }

    create = async (data) =>{
        try {
            const item = new this.model(data);
            return await item.save();
        } catch (error) {
            throw new Error (`Error al crear: ${error.message}`);
        }
    }

    findById = async (id) =>{
        try{
            return await this.model.findById(id);
        } catch (error) {
            throw new Error (`Error al encontrar por ID: ${error.message}`);
        }
    }

    findAll = async (filter = {}, options = {}) =>{
        try{
            const { page, limit, sort, populate } = options;

            let query = this.model.find(filter);

            if (populate) {
                query = query.populate(populate);
            }

            if (sort) {
                query = query.sort(sort);
            }

            if (page && limit) {
                const skip = (page - 1) * limit;
                query = query.skip(skip).limit(limit)
            }

            return await query.exec();
        } catch (error) {
            throw new Error (`Error al obtener todos ${this.model.modelName}: ${error.message}`);
        }
    }

    update = async (id, data) => {
        try {
            return await this.model.findByIdAndUpdate(
                id,
                data,
                {new: true, runValidators: true}
            );
        } catch (error) {
            throw new Error(`Error al actualizar ${this.model.modelName}: ${error.message}`);
        }
    }

    delete = async (id) => {
        try{
            return await this.model.findByIdAndDelete(id);
        } catch (error) {
            throw new Error(`Error al eliminar ${this.model.modelName}: ${error.message}`);
        }
    }

    exists = async (id) =>{
        try {
            const count = await this.model.countDocuments({_id: id});
            return count > 0;
        } catch (error) {
            throw new Error(`Error al verificar existencia ${this.model.modelName}: ${error.message}`);
        }
    }

    count = async (filter = {}) =>{
        try{
            return await this.model.countDocuments(filter)
        } catch (error) {
            throw new Error (`Error al contar ${this.model.modelName}: ${error.message}`);
        }
    }
}