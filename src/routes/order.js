import { Router } from 'express';
import { createOrderController, getAllOrdersController, getOrderByIdController, updateOrderStatusController } from '../controllers/order.controller.js';

const router = Router();

router.post('/', createOrderController);
router.get('/', getAllOrdersController);
router.get('/:id', getOrderByIdController);
router.patch('/:id/status', updateOrderStatusController);

export default router;