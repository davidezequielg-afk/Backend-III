import mongoose from 'mongoose';
import { ORDER_STATUS, ORDER_PRIORITY, DELIVERY_STATUS } from '../index.js';

const orderSchema = new mongoose.Schema({
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
  deliveryStatus: {
    type: String,
    enum: Object.values(DELIVERY_STATUS),
    default: DELIVERY_STATUS.PENDING
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});
export default mongoose.model('Order', orderSchema);