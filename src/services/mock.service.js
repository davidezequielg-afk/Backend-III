import { faker } from '@faker-js/faker';
import { ORDER_STATUS, ORDER_PRIORITY, DELIVERY_STATUS, USER_ROLES } from '../constants/index.js';
import userRepository from '../repositories/user.repository.js';
import orderRepository from '../repositories/order.repository.js';
import deliveryRepository from '../repositories/delivery.repository.js';


const DEFAULT_QTY = 10;
const MAX_QTY = 100;

const normalizeQty = (qty) => {
    const n = Number(qty);
    if(!Number.isInteger(n) || n < 1) {
        return DEFAULT_QTY;
    }
    return Math.min(n, MAX_QTY);
}

export const generateUsers = (qty) => {
    return Array.from({ length: normalizeQty(qty) }, () => ({
        name: faker.person.fullName(),
        email: faker.internet.email().toLowerCase(),
        role: faker.helpers.arrayElement([USER_ROLES.USER, USER_ROLES.COURIER])
    }));
}

export const seed = async (qty) => {
    const users = await userRepository.insertMany(generateUsers(qty));
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
    return { usuarios: users.length, orders: orders.length, envios: deliveries.length };
}