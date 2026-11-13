import OrderRepository from '../repositories/order.repository.js';
import { AppError } from '../errors/AppError.js';
import { ORDER_STATUS } from '../constants/index.js';

class OrderService {
    async getAllOrders(filter = {}) {
        return await OrderRepository.getAll(filter);
    }
    async getOrderById(id) {
        const order = await OrderRepository.getById(id);
        if (!order) {
            throw new AppError('ORDER_NOT_FOUND');
        }
        return order;
    }
    async updateOrderStatus(id, status) {
        if (!Object.values(ORDER_STATUS).includes(status)) {
            throw new AppError('INVALID_STATUS');
        }
        const updatedOrder = await OrderRepository.update(id, { status });
        if (!updatedOrder) {
            throw new AppError('ORDER_NOT_FOUND');
        }
        return updatedOrder;
    }
}

export default new OrderService();
