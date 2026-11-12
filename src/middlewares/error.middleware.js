import { RESPONSE_STATUS } from '../constants/index.js';
import { AppError } from '../errors/AppError.js';
import logger from '../config/logger.js';

const logError = (req, err, error) => {
    if(error.statusCode >= 500) {
        logger.error(`${req.method} ${req.originalUrl} - ${err.stack}`);
    } else {
        logger.warning(`${req.method} ${req.originalUrl} - ${error.statusCode} ${error.message}`);
    }
};

export const errorHandler = (err, req, res, next) => {
    let error;
    if (err instanceof AppError) {
        error = err;
    }
    else if (err.name === 'CastError') {
        error = new AppError('INVALID_ID');
    }
    else if (err.name === 'ValidationError') {
        error = new AppError('VALIDATION_ERROR');
    }
    else if (err.type === 'entity.parse.failed') {
        error = new AppError('INVALID_JSON');
    }
    else {
        error = new AppError('INTERNAL_SERVER_ERROR');
    }
    logError(req, err, error);
    res.status(error.statusCode).json({ status: RESPONSE_STATUS.ERROR, code: error.code, message: error.message });
};
export const routeNotFoundHandler = (req, res, next) => {
    const error = new AppError('ROUTE_NOT_FOUND');
    next(error);
};