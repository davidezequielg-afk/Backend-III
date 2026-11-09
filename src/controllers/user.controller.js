import UserService from '../services/user.service.js';
import { RESPONSE_STATUS, HTTP_STATUS } from '../constants/index.js';

export const createUserController = async (req, res, next) => {
    try {
        const { email, name } = req.body || {};
        const user = await UserService.createUser({ email, name });
        res.status(HTTP_STATUS.CREATED).json({ status: RESPONSE_STATUS.SUCCESS, data: user });
    } catch (error) {
        next(error);
    }
};

export const getAllUsersController = async (req, res, next) => {
    try {
        const users = await UserService.getAllUsers(req.query);
        res.status(HTTP_STATUS.OK).json({ status: RESPONSE_STATUS.SUCCESS, data: users });
    } catch (error) {
        next(error);
    }
};

export const getUserByIdController = async (req, res, next) => {
    try {
        const user = await UserService.getUserById(req.params.id);
        res.status(HTTP_STATUS.OK).json({ status: RESPONSE_STATUS.SUCCESS, data: user });
    } catch (error) {
        next(error);
    }
};

export const updateUserController = async (req, res, next) => {
    try {
        const { email, name } = req.body || {};
        const user = await UserService.updateUser(req.params.id, { email, name });
        res.status(HTTP_STATUS.OK).json({ status: RESPONSE_STATUS.SUCCESS, data: user });
    } catch (error) {
        next(error);
    }
};

export const deleteUserController = async (req, res, next) => {
    try {
        const user = await UserService.deleteUser(req.params.id);
        res.status(HTTP_STATUS.OK).json({ status: RESPONSE_STATUS.SUCCESS, data: user });
    } catch (error) {
        next(error);
    }
};
