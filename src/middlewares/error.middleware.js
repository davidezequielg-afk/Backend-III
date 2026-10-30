export const errorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode;
    let message = err.message;

    if (err.name === 'CastError') {
        statusCode = 400;
        message = 'ID inválido';
    } else if (err.name === 'ValidationError') {
        statusCode = 400;
    }

    if (!statusCode) {
        console.error(err);
        statusCode = 500;
        message = 'Error interno del servidor';
    }

    res.status(statusCode).json({ status: 'error', message });
};