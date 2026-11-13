import { Router } from 'express';
import { getAllDeliveriesController, getDeliveryByIdController, updateDeliveryStatusController } from '../controllers/delivery.controller.js';
    
const router = Router();

router.get('/', getAllDeliveriesController);
router.get('/:id', getDeliveryByIdController);
router.patch('/:id/status', updateDeliveryStatusController);

export default router;