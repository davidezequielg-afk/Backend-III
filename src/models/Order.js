import mongoose from 'mongoose';
import { ORDER_STATUS, ORDER_PRIORITY } from '../constants/index.js';

const orderItemSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, min: 1, default: 1 }
}, { _id: false });

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: Object.values(ORDER_STATUS),
        default: ORDER_STATUS.PENDING
  },
    priority: {
        type: String,
        enum: Object.values(ORDER_PRIORITY),
        default: ORDER_PRIORITY.MEDIUM
  },
        items: { type: [orderItemSchema], default: [] },
}, { timestamps: true });
export default mongoose.model('Order', orderSchema);