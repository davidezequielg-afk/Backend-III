import { faker } from '@faker-js/faker';
import { ORDER_STATUS, ORDER_PRIORITY, DELIVERY_STATUS, USER_ROLES } from '../constants/index.js';
import { AppError } from '../errors/AppError.js';
import userRepository from '../repositories/user.repository.js';
import orderRepository from '../repositories/order.repository.js';
import deliveryRepository from '../repositories/delivery.repository.js';

const DEFAULT_QTY = 10;
const MAX_QTY = 100;

const normalizeQty = (qty) => {
    const normalizedQty = Number(qty ?? DEFAULT_QTY);
    if(!Number.isInteger(normalizedQty) || normalizedQty < 1 || normalizedQty > MAX_QTY) {
        throw new AppError('INVALID_QTY');
    }
    return normalizedQty;
}

export const generateUsers = (qty) => {
    return Array.from({ length: normalizeQty(qty) }, () => ({
        name: faker.person.fullName(),
        email: faker.internet.email().toLowerCase(),
        role: faker.helpers.arrayElement([USER_ROLES.USER, USER_ROLES.COURIER])
    }));
}

export const seed = async (qty) => {
    const generatedUsers = generateUsers(qty);
    try {
        const users = await userRepository.insertMany(generatedUsers);
        const orders = await orderRepository.insertMany(
        users.map(user => ({
            user: user._id,
            status: faker.helpers.arrayElement(Object.values(ORDER_STATUS)),
            priority: faker.helpers.arrayElement(Object.values(ORDER_PRIORITY))
        }))
    );
    const couriers = users.filter((u) => u.role === USER_ROLES.COURIER);
    const deliveries = await deliveryRepository.insertMany(
        orders.map(order => ({
            order: order._id,
            ... (couriers.length && { courier: faker.helpers.arrayElement(couriers)._id }),
            status: faker.helpers.arrayElement(Object.values(DELIVERY_STATUS))
        }))
    );
    
        return { usuarios: users.length, pedidos: orders.length, envios: deliveries.length };
    } catch (error) {
        console.error(error);
        throw new AppError('SEED_FAILED');
    }
}