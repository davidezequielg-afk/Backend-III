import productRepository from '../repositories/product.repository.js';
import  { PRODUCTS_STATUS } from '../constants/index.js';
import { AppError } from '../errors/AppError.js';

const statusFromStock = (stock) =>
    stock > 0 ? PRODUCTS_STATUS.AVAILABLE : PRODUCTS_STATUS.OUT_OF_STOCK;

class ProductService {
    async createProduct(data) {
        const existingProduct = await productRepository.getAll({ name: data.name });
        if (existingProduct.length > 0) {
            throw new AppError('PRODUCT_ALREADY_EXISTS');
        }
        return productRepository.create({ ...data, status: statusFromStock(data.stock ?? 0) });
    }

    async getAllProducts(filter = {}) {
        return productRepository.getAll({ ...filter, status: PRODUCTS_STATUS.AVAILABLE })
    }

    async getProductById(id) {
        const product = await productRepository.getById(id);
        if (!product) {
            throw new AppError('PRODUCT_NOT_FOUND');
        }
        return product;
    }

    async updateProduct(id, data) {
        const changesProduct = data.stock !== undefined ? { ...data, status: statusFromStock(data.stock) } : { ...data };
        const updatedProduct = await productRepository.update(id, changesProduct);
        if (!updatedProduct) {
            throw new AppError('PRODUCT_NOT_FOUND');
        }
        return updatedProduct;
    }

    async deleteProduct(id) {
        const deletedProduct = await productRepository.delete(id);
        if (!deletedProduct) {
            throw new AppError('PRODUCT_NOT_FOUND');
        }
        return deletedProduct;
    }
}

export default new ProductService();