import UserRepository from '../repositories/user.repository.js';
import { AppError } from '../errors/AppError.js';
import { DOCUMENT_TYPES } from '../constants/index.js';
import { buildFileMetadata, removeFile } from '../utils/file.utils.js';
import logger from '../config/logger.js';

class UserService {
    async createUser(data) {
        if(!data.email) {
            throw new AppError('EMAIL_REQUIRED');
        }
        const emailNormalized = data.email.toLowerCase() ;
        const existingUser = await UserRepository.getByEmail(emailNormalized);
        if (existingUser) {
            throw new AppError('USER_ALREADY_EXISTS');
        }
        return UserRepository.create({ ...data, email: emailNormalized });
    }
    async getAllUsers(filter = {}) {
        return UserRepository.getAll(filter);
    }
    async getUserById(id) {
        const user = await UserRepository.getById(id);
        if (!user) {
            throw new AppError('USER_NOT_FOUND');
        }
        return user;
    }
    async updateUser(id, data) {
        const emailNormalized = data.email?.toLowerCase();
        if (emailNormalized) {
            data.email = emailNormalized;
        }
        if(data.email) {
            const existingEmailUser = await UserRepository.getByEmail(emailNormalized);
            if (existingEmailUser && existingEmailUser.id !== id) {
                throw new AppError('EMAIL_ALREADY_EXISTS');
        }
        }
        const updatedUser = await UserRepository.update(id, data);
        if (!updatedUser) {
            throw new AppError('USER_NOT_FOUND');
        }
        return updatedUser;
    }
    async addDocument(userId, file, documentType) {
        if (!file) {
            throw new AppError('FILE_REQUIRED');
        }
        try {
            if (!Object.values(DOCUMENT_TYPES).includes(documentType)) {
                throw new AppError('INVALID_DOCUMENT_TYPE');
            }
            const user = await UserRepository.getById(userId);
            if (!user) {
                throw new AppError('USER_NOT_FOUND');
            }
            const updatedUser = await UserRepository.addDocument(userId, buildFileMetadata(file, documentType));
            logger.info(`Documento cargado: usuario ${userId}, tipo ${documentType}, archivo ${file.filename} (${file.size} bytes)`);
            return updatedUser;
        } catch (error) {
            await removeFile(file.path);
            if (error instanceof AppError || error.name === 'CastError') {
                throw error;
            }
            logger.error(`Error al guardar el documento del usuario ${userId}: ${error.stack}`);
            throw new AppError('FILE_SAVE_FAILED');
        }
    }
    async deleteUser(id) {
        const deletedUser = await UserRepository.delete(id);
        if (!deletedUser) {
            throw new AppError('USER_NOT_FOUND');
        }
        return deletedUser;
    }
}

export default new UserService();
