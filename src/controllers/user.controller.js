import UserService from '../services/user.service.js';

export const createUserController = async (req, res, next) => {
    try {
        const { email, name } = req.body || {};
        const user = await UserService.createUser({ email, name });
        res.status(201).json({ status: 'success', data: user });
    } catch (error) {
        next(error);
    }
};

export const getAllUsersController = async (req, res, next) => {
    try {
        const users = await UserService.getAllUsers(req.query);
        res.status(200).json({ status: 'success', data: users });
    } catch (error) {
        next(error);
    }
};

export const getUserByIdController = async (req, res, next) => {
    try {
        const user = await UserService.getUserById(req.params.id);
        res.status(200).json({ status: 'success', data: user });
    } catch (error) {
        next(error);
    }
};

export const updateUserController = async (req, res, next) => {
    try {
        const { email, name } = req.body || {};
        const user = await UserService.updateUser(req.params.id, { email, name });
        res.status(200).json({ status: 'success', data: user });
    } catch (error) {
        next(error);
    }
};

export const deleteUserController = async (req, res, next) => {
    try {
        const user = await UserService.deleteUser(req.params.id);
        res.status(200).json({ status: 'success', data: user });
    } catch (error) {
        next(error);
    }
};
