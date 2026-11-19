import { PAGINATION } from '../constants/index.js';
import { AppError } from '../errors/AppError.js';

export const parsePagination = (query) => {
    const page = Number(query.page ?? PAGINATION.DEFAULT_PAGE);
    if (page <= 0 || !Number.isInteger(page)) {
        throw new AppError('INVALID_PAGINATION');
    }
    const limit = Number(query.limit ?? PAGINATION.DEFAULT_LIMIT);
    if (limit <= 0 || limit > PAGINATION.MAX_LIMIT || !Number.isInteger(limit)) {
        throw new AppError('INVALID_PAGINATION');
    }
    const skip = (page - 1) * limit;
    return { page, limit, skip };
};

export const buildPagination = ({ page, limit, total }) => {
    const totalPages = Math.ceil(total / limit);
    return {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
    };
};

export const pickFilters = (query = {}, allowedFilters = []) => {
    const filters = {};
    for (const key of allowedFilters) {
        const value = query[key];
        if (value === undefined) continue;
        if(typeof value !== 'string')
            throw new AppError('INVALID_FILTERS');
        filters[key] = value;
    }
    return filters;
};