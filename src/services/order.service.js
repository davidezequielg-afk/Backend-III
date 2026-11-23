import OrderRepository from '../repositories/order.repository.js';
import UserRepository from '../repositories/user.repository.js';
import { AppError } from '../errors/AppError.js';
import { ORDER_STATUS } from '../constants/index.js';
import { parsePagination, buildPagination, pickFilters } from '../utils/pagination.util.js';

class OrderService {
    async createOrder(data) {
        if (!data.user) {
            throw new AppError('VALIDATION_ERROR');
        }
        const user = await UserRepository.getById(data.user);
        if (!user) {
            throw new AppError('USER_NOT_FOUND');
        }
        return await OrderRepository.create(data);
    }
    async getAllOrders(query = {}) {
        const { page, limit, skip } = parsePagination(query);
        const filters = pickFilters(query, ['status', 'priority']);
        const { items, total } = await OrderRepository.getAll(filters, { skip, limit });
        const pagination = buildPagination({ page, limit, total });
        return { items, pagination };
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
