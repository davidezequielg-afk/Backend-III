import UserRepository from '../repositories/user.repository.js';

const fail = (statusCode, message) => {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
};

class UserService {
    async createUser(data) {
        if(!data.email) {
            throw fail(400, 'El correo electrónico es obligatorio');
        }
        const emailNormalized = data.email.toLowerCase() ;
        const existingUser = await UserRepository.getByEmail(emailNormalized);
        if (existingUser) {
            throw fail(409, 'El usuario ya existe');
        }
        return UserRepository.create({ ...data, email: emailNormalized });
    }
    async getAllUsers(filter = {}) {
        return UserRepository.getAll(filter);
    }
    async getUserById(id) {
        const user = await UserRepository.getById(id);
        if (!user) {
            throw fail(404, 'Usuario no encontrado');
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
            throw fail(409, 'El correo electrónico ya está en uso');
        }
        }
        const updatedUser = await UserRepository.update(id, data);
        if (!updatedUser) {
            throw fail(404, 'Usuario no encontrado para actualizar');
        }
        return updatedUser;
    }

    async deleteUser(id) {
        const deletedUser = await UserRepository.delete(id);
        if (!deletedUser) {
            throw fail(404, 'Usuario no encontrado para eliminar');
        }
        return deletedUser;
    }
}

export default new UserService();
