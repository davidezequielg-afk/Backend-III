import Product from '../models/Product.js';

const DEFAULT_PROJECTION = '-__v';

class ProductRepository {
    async create(data) {
        const product = new Product(data);
        return product.save();
    }
    async getAll( filter = {} ) {
        return Product.find(filter).select(DEFAULT_PROJECTION).sort({ createdAt: -1 }).lean();
    }
    async getById(id) {
        return Product.findById(id).select(DEFAULT_PROJECTION).lean();
    }
    async update(id, data) {
        return Product.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    }
    async delete(id) {
        return Product.findByIdAndDelete(id);
    }
}

export default new ProductRepository();