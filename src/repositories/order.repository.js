import Order from '../models/Order.js';

const DEFAULT_PROJECTION = '-__v';

class OrderRepository {
    async create(data) {
        return Order.create(data);
    }
    async getAll(filter = {}, { skip, limit } = {}) {
    const [orders, count] = await Promise.all([
        Order.find(filter)
            .populate('user', 'name email role')
            .select(DEFAULT_PROJECTION)
            .sort({ _id: -1 })
            .skip(skip)
            .limit(limit)
            .lean(),
        Order.countDocuments(filter)
    ]);
    return { items: orders, total: count };
    }
    async getById(id) {
        return Order.findById(id).populate('user', 'name email role').select(DEFAULT_PROJECTION).lean();
    }
    async update(id, data) {
        return Order.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
        projection: DEFAULT_PROJECTION
      });
    }

    async delete(id) {
        return Order.findByIdAndDelete(id, { projection: DEFAULT_PROJECTION });
    }

    async insertMany(orders) {
        return Order.insertMany(orders);
    }
}

export default new OrderRepository();