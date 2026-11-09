import { generateUsers, seed } from '../services/mock.service.js';
import { RESPONSE_STATUS, HTTP_STATUS } from '../constants/index.js';

export const mockSeedController = async (req, res, next) => {
    try {
        const result = await seed(req.query.qty);
        res.status(HTTP_STATUS.CREATED).json({ status: RESPONSE_STATUS.SUCCESS, data: result });
    } catch (error) {
        next(error);
    }
}

export const generateUsersMockController = (req, res, next) => {
    try {
        const users = generateUsers(req.query.qty);
        res.status(HTTP_STATUS.OK).json({ status: RESPONSE_STATUS.SUCCESS, data: users });
    } catch (error) {
        next(error);
    }
}