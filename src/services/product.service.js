import productRepository from '../repositories/product.repository.js';
import  { PRODUCTS_STATUS } from '../constants/index.js';

const fail = (statusCode, message) => {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
};
const statusFromStock = (stock) =>
    stock > 0 ? PRODUCTS_STATUS.AVAILABLE : PRODUCTS_STATUS.OUT_OF_STOCK;

class ProductService {
    async createProduct(data) {
        const existingProduct = await productRepository.getAll({ name: data.name });
        if (existingProduct.length > 0) {
            throw fail(409, 'El producto ya existe');
        }
        return productRepository.create({ ...data, status: statusFromStock(data.stock ?? 0) });
    }

    async getAllProducts(filter = {}) {
        return productRepository.getAll({ ...filter, status: PRODUCTS_STATUS.AVAILABLE })
    }

    async getProductById(id) {
        const product = await productRepository.getById(id);
        if (!product) {
            throw fail(404, 'Producto no encontrado');
        }
        return product;
    }

    async updateProduct(id, data) {
        const changesProduct = data.stock !== undefined ? { ...data, status: statusFromStock(data.stock) } : { ...data };
        const updatedProduct = await productRepository.update(id, changesProduct);
        if (!updatedProduct) {
            throw fail(404, 'Producto no encontrado para actualizar');
        }
        return updatedProduct;
    }

    async deleteProduct(id) {
        const deletedProduct = await productRepository.delete(id);
        if (!deletedProduct) {
            throw fail(404, 'Producto no encontrado para eliminar');
        }
        return deletedProduct;
    }
}

export default new ProductService();