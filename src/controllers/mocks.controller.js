import { generateUsers, seed } from '../services/mock.service.js';

export const mockSeedController = async (req, res, next) => {
    try {
        const result = await seed(req.query.qty);
        res.status(201).json({ status: 'success', data: result });
    } catch (error) {
        next(error);
    }
}

export const generateUsersMockController = (req, res, next) => {
    try {
        const users = generateUsers(req.query.qty);
        res.status(200).json({ status: 'success', data: users });
    } catch (error) {
        next(error);
    }
}