import { HTTP_STATUS } from '../constants/index.js';
import { config } from '../config/env.config.js';

export const getHealthController = (req, res) => {
    res.status(HTTP_STATUS.OK).json({
        status: 'ok',
        environment: config.NODE_ENV,
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    });
};