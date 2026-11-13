import { HTTP_STATUS } from '../constants/index.js';

export const ERROR_DICTIONARY = Object.freeze({
    USER_NOT_FOUND: {
        statusCode: HTTP_STATUS.NOT_FOUND,
        message: 'Usuario no encontrado'
    },
    USER_ALREADY_EXISTS: {
        statusCode: HTTP_STATUS.CONFLICT,
        message: 'El usuario ya existe'
    },
    EMAIL_REQUIRED: {
        statusCode: HTTP_STATUS.BAD_REQUEST,
        message: 'El correo electrónico es obligatorio'
    },
    EMAIL_ALREADY_EXISTS: {
        statusCode: HTTP_STATUS.CONFLICT,
        message: 'El correo electrónico ya existe'
    },
    VALIDATION_ERROR: {
        statusCode: HTTP_STATUS.BAD_REQUEST,
        message: 'Los datos proporcionados no son válidos'
    },
    PRODUCT_NOT_FOUND: {
        statusCode: HTTP_STATUS.NOT_FOUND,
        message: 'Producto no encontrado'
    },
    PRODUCT_ALREADY_EXISTS: {
        statusCode: HTTP_STATUS.CONFLICT,
        message: 'El producto ya existe'
    },
    ORDER_NOT_FOUND: {
        statusCode: HTTP_STATUS.NOT_FOUND,
        message: 'Orden no encontrada'
    },
    INVALID_STATUS: {
        statusCode: HTTP_STATUS.BAD_REQUEST,
        message: 'Estado inválido'
    },
    DELIVERY_NOT_FOUND: {
    statusCode: HTTP_STATUS.NOT_FOUND,
    message: 'Entrega no encontrada'
    },
    INVALID_ID: {
        statusCode: HTTP_STATUS.BAD_REQUEST,
        message: 'El ID proporcionado no es válido'
    },
    INVALID_QTY: {
        statusCode: HTTP_STATUS.BAD_REQUEST,
        message: 'La cantidad debe ser un numero entero entre el 1 y el 100'
    },
    SEED_FAILED: {
        statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
        message: 'Error al cargar los datos de prueba del sistema en la base de datos'
    },
    INTERNAL_SERVER_ERROR: {
        statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
        message: 'Error interno del servidor'
    },
    ROUTE_NOT_FOUND: {
        statusCode: HTTP_STATUS.NOT_FOUND,
        message: 'Ruta no encontrada'
    },
    INVALID_JSON: {
        statusCode: HTTP_STATUS.BAD_REQUEST,
        message: 'JSON inválido'
    }
});