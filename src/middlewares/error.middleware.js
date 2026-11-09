import { RESPONSE_STATUS } from '../constants/index.js';
import { AppError } from '../errors/AppError.js';

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
    else {
        console.error(err);
        error = new AppError('INTERNAL_SERVER_ERROR');
    }
    res.status(error.statusCode).json({ status: RESPONSE_STATUS.ERROR, code: error.code, message: error.message });
};