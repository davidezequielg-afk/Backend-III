import { Router } from 'express';
import logger from '../config/logger.js';

const router = Router();

router.get('/', (req, res) => {
    logger.debug('Mensaje de pruebas de debug');
    logger.http('Mensaje de pruebas de http');
    logger.info('Mensaje de pruebas de info');
    logger.warning('Mensaje de pruebas de warning');
    logger.error('Mensaje de pruebas de error');
    logger.fatal('Mensaje de pruebas de fatal');
    res.status(200).json({
        status: 'success',
        message: 'Logs generados en todos los niveles'
    });
});

export default router;