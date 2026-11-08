import { Router } from 'express';
import { mockSeedController, generateUsersMockController } from '../controllers/mocks.controller.js';

const router = Router();

router.get('/users', generateUsersMockController);
router.post('/seed', mockSeedController);

export default router;