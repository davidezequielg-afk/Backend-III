import { ERROR_DICTIONARY } from './error.dictionary.js';

export class AppError extends Error {
    constructor(codeError) {
        const key = ERROR_DICTIONARY[codeError] ? codeError : 'INTERNAL_SERVER_ERROR';
        const { statusCode, message } = ERROR_DICTIONARY[key];
        super(message);
        this.code = key;
        this.statusCode = statusCode;
    }
}