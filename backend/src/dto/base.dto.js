export default class BaseDTO {
    constructor(data) {
        this.id = this.transformId(data._id || data.id);
        this.createdAt = data.createdAt || null;
        this.updatedAt = data.updatedAt || null;
    }

    transformId = (id) => {
        if (!id) return null;
        return id.toString ? id.toString() : id;
    }

    excludeFields = ( data, fieldsToExclude = []) => {
        const result = { ...data };
        fieldsToExclude.forEach(field => {
            delete result [field];
        });
        return result;
    }

    toJson = () => {
        return { ...this };
    }

    static fromArray(dataArray) {
        return dataArray.map(item => new this(item));
    }

    static fromModel(model) {
        return new this(model);
    }
}