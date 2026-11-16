import multer from 'multer';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { config } from './env.config.js';
import { FILE_RULES } from '../constants/index.js';
import { AppError } from '../errors/AppError.js';

const createUploader = (folder) => {
    const destination = path.resolve(config.UPLOADS_DIR, folder);
    fs.mkdirSync(destination, { recursive: true });

    const storage = multer.diskStorage({
        destination,
        filename: (req, file, cb) => {
            const extension = path.extname(file.originalname).toLowerCase();
            cb(null, `${Date.now()}-${crypto.randomUUID()}${extension}`);
        }
    });

    const fileFilter = (req, file, cb) => {
        if (!FILE_RULES.ALLOWED_MIME_TYPES.includes(file.mimetype)) {
            return cb(new AppError('INVALID_FILE_TYPE'));
        }
        cb(null, true);
    };

    return multer({
        storage,
        fileFilter,
        limits: { fileSize: FILE_RULES.MAX_SIZE }
    }).single('file');
};

export const uploadDocument = createUploader('documents');
export const uploadReceipt = createUploader('receipts');
