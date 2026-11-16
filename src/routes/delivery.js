import { Router } from 'express';
import { getAllDeliveriesController, getDeliveryByIdController, updateDeliveryStatusController, uploadDeliveryReceiptController } from '../controllers/delivery.controller.js';
import { uploadReceipt } from '../config/multer.config.js';

const router = Router();

router.get('/', getAllDeliveriesController);
router.get('/:id', getDeliveryByIdController);
router.patch('/:id/status', updateDeliveryStatusController);
router.post('/:id/receipts', uploadReceipt, uploadDeliveryReceiptController);

export default router;