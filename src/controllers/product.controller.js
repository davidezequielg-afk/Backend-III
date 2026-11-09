import ProductService from '../services/product.service.js';
import { RESPONSE_STATUS, HTTP_STATUS } from '../constants/index.js';

export const createProductController = async (req, res, next) => {
    try {
        const { name, stock, price } = req.body || {};
        const product = await ProductService.createProduct({ name, stock, price });
        res.status(HTTP_STATUS.CREATED).json({ status: RESPONSE_STATUS.SUCCESS, data: product });
    } catch (error) {
        next(error);
    }
};

export const getAllProductsController = async (req, res, next) => {
    try {
        const products = await ProductService.getAllProducts(req.query);
        res.status(HTTP_STATUS.OK).json({ status: RESPONSE_STATUS.SUCCESS, data: products });
    } catch (error) {
        next(error);
    }
};

export const getProductByIdController = async (req, res, next) => {
    try {
        const product = await ProductService.getProductById(req.params.id);
        res.status(HTTP_STATUS.OK).json({ status: RESPONSE_STATUS.SUCCESS, data: product });
    } catch (error) {
        next(error);
    }
};

export const updateProductController = async (req, res, next) => {
    try {
        const { name, stock, price } = req.body || {};
        const product = await ProductService.updateProduct(req.params.id, { name, stock, price });
        res.status(HTTP_STATUS.OK).json({ status: RESPONSE_STATUS.SUCCESS, data: product });
    } catch (error) {
        next(error);
    }
};

export const deleteProductController = async (req, res, next) => {
    try {
        const product = await ProductService.deleteProduct(req.params.id);
        res.status(HTTP_STATUS.OK).json({ status: RESPONSE_STATUS.SUCCESS, data: product });
    } catch (error) {
        next(error);
    }
};