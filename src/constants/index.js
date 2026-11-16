export const RESPONSE_STATUS = Object.freeze({
    SUCCESS: 'success',
    ERROR: 'error'
});
export const HTTP_STATUS = Object.freeze({
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    PAYLOAD_TOO_LARGE: 413,
    INTERNAL_SERVER_ERROR: 500
});
export const USER_ROLES = Object.freeze({
    ADMIN: 'admin',
    USER: 'user',
    COURIER: 'courier'
});
export const PRODUCTS_STATUS = Object.freeze({
    AVAILABLE: 'available',
    OUT_OF_STOCK: 'out_of_stock'
});
export const ORDER_STATUS = Object.freeze({
    PENDING: 'pending',
    PROCESSING: 'processing',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled'
});
export const ORDER_PRIORITY = Object.freeze({
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high'
});
export const DELIVERY_STATUS = Object.freeze({
    PENDING: 'pending',
    IN_TRANSIT: 'in_transit',
    DELIVERED: 'delivered',
    CANCELLED: 'cancelled'
});
export const DOCUMENT_TYPES = Object.freeze({
    DNI: 'dni',
    LICENSE: 'license',
    ADDRESS_PROOF: 'address_proof',
    OTHER: 'other'
});
export const FILE_RULES = Object.freeze({
    ALLOWED_MIME_TYPES: ['application/pdf', 'image/jpeg', 'image/png'],
    MAX_SIZE: 2*1024*1024
}); 
export const RECEIPT_DOCUMENT_TYPE = 'receipt';
