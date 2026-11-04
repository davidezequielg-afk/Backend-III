import mongoose from 'mongoose';
import { ORDER_STATUS, ORDER_PRIORITY, DELIVERY_STATUS } from '../constants/index.js';

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
}, { timestamps: true });
export default mongoose.model('Order', orderSchema);