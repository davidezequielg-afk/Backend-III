import Delivery from '../models/Delivery.js';

const DEFAULT_PROJECTION = '-__v';

class DeliveryRepository {
    async create(data) {
        const delivery = new Delivery(data);
        return delivery.save();
    }
    async getAll(filter = {}, { skip, limit } = {}) {
        const [deliveries, count] = await Promise.all([
            Delivery.find(filter)
                .populate('order')
                .select(DEFAULT_PROJECTION)
                .sort({ _id: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            Delivery.countDocuments(filter)
    ]);
        return { items: deliveries, total: count }; 
    }
    async getById(id) {
        return Delivery.findById(id).select(DEFAULT_PROJECTION).populate('order').lean();
    }
    async getByIdCourier(courierId) {
        return Delivery.find({ courier: courierId }).select(DEFAULT_PROJECTION).populate('order').lean();
    }
    async update(id, data) {
        return Delivery.findByIdAndUpdate(id, data, { new: true, runValidators: true, projection: DEFAULT_PROJECTION });
    }
    async delete(id) {
        return Delivery.findByIdAndDelete(id, { projection: DEFAULT_PROJECTION });
    }
    async insertMany(deliveries) {
        return Delivery.insertMany(deliveries);
    }
    async addReceipt(id, metadata) {
        return Delivery.findByIdAndUpdate(
            id,
            { $push: { receipts: metadata } },
            { new: true, runValidators: true, projection: DEFAULT_PROJECTION }
        );
    }

}

export default new DeliveryRepository();