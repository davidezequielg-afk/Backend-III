import deliveryRepository from '../repositories/delivery.repository.js';
import { AppError } from '../errors/AppError.js';
import { DELIVERY_STATUS } from '../constants/index.js';

class DeliveryService {
    async getAllDeliveries(filter = {}) {
        const deliveries = await deliveryRepository.getAll(filter);
        return deliveries;
    }

    async getDeliveryById(id) {
        const delivery = await deliveryRepository.getById(id);
        if (!delivery) {
            throw new AppError('DELIVERY_NOT_FOUND');
        }
        return delivery;
    }

    async updateDeliveryStatus(id, status) {
        if (!Object.values(DELIVERY_STATUS).includes(status)) {
            throw new AppError('INVALID_STATUS');
        }
        const updatedDelivery = await deliveryRepository.update(id, { status });
        if (!updatedDelivery) {
            throw new AppError('DELIVERY_NOT_FOUND');
        }
        return updatedDelivery;
    }
}

export default new DeliveryService();