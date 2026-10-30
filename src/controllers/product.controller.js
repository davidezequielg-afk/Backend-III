import ProductService from '../services/product.service.js';

export const createProductController = async (req, res, next) => {
    try {
        const { name, stock, price } = req.body || {};
        const product = await ProductService.createProduct({ name, stock, price });
        res.status(201).json({ status: 'success', data: product });
    } catch (error) {
        next(error);
    }
};

export const getAllProductsController = async (req, res, next) => {
    try {
        const products = await ProductService.getAllProducts(req.query);
        res.status(200).json({ status: 'success', data: products });
    } catch (error) {
        next(error);
    }
};

export const getProductByIdController = async (req, res, next) => {
    try {
        const product = await ProductService.getProductById(req.params.id);
        res.status(200).json({ status: 'success', data: product });
    } catch (error) {
        next(error);
    }
};

export const updateProductController = async (req, res, next) => {
    try {
        const product = await ProductService.updateProduct(req.params.id, req.body);
        res.status(200).json({ status: 'success', data: product });
    } catch (error) {
        next(error);
    }
};

export const deleteProductController = async (req, res, next) => {
    try {
        const product = await ProductService.deleteProduct(req.params.id);
        res.status(200).json({ status: 'success', data: product });
    } catch (error) {
        next(error);
    }
};