import fs from 'fs/promises';
import path from 'path';

export const buildFileMetadata = (file, documentType) => ({
    originalName: file.originalname,
    fileName: file.filename,
    path: path.relative(process.cwd(), file.path).replace(/\\/g, '/'),
    mimeType: file.mimetype,
    size: file.size,
    documentType
});

export const removeFile = async (filePath) => {
    try {
        await fs.unlink(filePath);
    } catch (error) {
        if (error.code !== 'ENOENT') throw error;
    }
};
