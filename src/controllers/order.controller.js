import OrderService from '../services/order.service.js';
import { RESPONSE_STATUS, HTTP_STATUS } from '../constants/index.js';

export const getAllOrdersController = async (req, res, next) => {
    try {
        const orders = await OrderService.getAllOrders(req.query);
        res.status(HTTP_STATUS.OK).json({
            status: RESPONSE_STATUS.SUCCESS,
            data: orders
        });
    } catch (error) {
        next(error);
    }
};

export const getOrderByIdController = async (req, res, next) => {
    try {
        const order = await OrderService.getOrderById(req.params.id);
        res.status(HTTP_STATUS.OK).json({
            status: RESPONSE_STATUS.SUCCESS,
            data: order
        });
    } catch (error) {
        next(error);
    }
};

export const updateOrderStatusController = async (req, res, next) => {
    try {
        const { status } = req.body || {};
        const updatedOrder = await OrderService.updateOrderStatus(req.params.id, status);
        res.status(HTTP_STATUS.OK).json({
            status: RESPONSE_STATUS.SUCCESS,
            data: updatedOrder
        });
    } catch (error) {
        next(error);
    }
};