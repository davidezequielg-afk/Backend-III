import deliveryRepository from '../repositories/delivery.repository.js';
import { AppError } from '../errors/AppError.js';
import { DELIVERY_STATUS, RECEIPT_DOCUMENT_TYPE } from '../constants/index.js';
import { buildFileMetadata, removeFile } from '../utils/file.utils.js';
import logger from '../config/logger.js';

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
    async addReceipt(deliveryId, file) {
        if (!file) {
            throw new AppError('FILE_REQUIRED');
        }
        try {
            const delivery = await deliveryRepository.getById(deliveryId);
            if (!delivery) {
                throw new AppError('DELIVERY_NOT_FOUND');
            }
            const updatedDelivery = await deliveryRepository.addReceipt(deliveryId, buildFileMetadata(file, RECEIPT_DOCUMENT_TYPE));
            logger.info(`Comprobante asociado a la entrega ${deliveryId}: archivo ${file.filename} (${file.size} bytes)`);
            return updatedDelivery;
        } catch (error) {
            await removeFile(file.path);
            if (error instanceof AppError || error.name === 'CastError') {
                throw error;
            }
            logger.error(`Error al guardar el comprobante de la entrega ${deliveryId}: ${error.stack}`);
            throw new AppError('FILE_SAVE_FAILED');
        }
    }

}

export default new DeliveryService();