import deliveryService from '../services/delivery.service.js';
import { HTTP_STATUS, RESPONSE_STATUS } from '../constants/index.js';

export const getAllDeliveriesController = async (req, res, next) => {
    try {
        const deliveries = await deliveryService.getAllDeliveries(req.query);
        res.status(HTTP_STATUS.OK).json({
            status: RESPONSE_STATUS.SUCCESS,
            data: deliveries
        });
    } catch (error) {
        next(error);
    }
};

export const getDeliveryByIdController = async (req, res, next) => {
    try {
        const delivery = await deliveryService.getDeliveryById(req.params.id);
        res.status(HTTP_STATUS.OK).json({
            status: RESPONSE_STATUS.SUCCESS,
            data: delivery
        });
    } catch (error) {
        next(error);
    }
};

export const updateDeliveryStatusController = async (req, res, next) => {
    try {
        const { status } = req.body || {};
        const updatedDelivery = await deliveryService.updateDeliveryStatus(req.params.id, status);
        res.status(HTTP_STATUS.OK).json({
            status: RESPONSE_STATUS.SUCCESS,
            data: updatedDelivery
        });
    } catch (error) {
        next(error);
    }
};