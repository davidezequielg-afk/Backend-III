import mongoose from 'mongoose';
import { PRODUCTS_STATUS } from '../constants/index.js';

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, default: 0, min: 0 },
    status: { type: String, required: true, default: PRODUCTS_STATUS.AVAILABLE, enum: Object.values(PRODUCTS_STATUS) },
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);
export default Product;