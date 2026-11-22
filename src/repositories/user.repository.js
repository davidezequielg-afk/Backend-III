import User from '../models/User.js';

const DEFAULT_PROJECTION = '-__v';

class UserRepository {
    async create(data) {
        const user = await User.create(data);
        return user;
    }
    async getAll(filter = {}, { limit, skip } = {}) {
        const [users, count] = await Promise.all([
            User.find(filter).select(DEFAULT_PROJECTION).lean().sort({ _id: -1 }).limit(limit).skip(skip),
            User.countDocuments(filter)
        ]);
        return { items: users, total: count };
    }
    async getById(id) {
        const user = await User.findById( id ).select(DEFAULT_PROJECTION);
        return user;
    }
    async getByEmail(email) {
        const user = await User.findOne({ email }).select(DEFAULT_PROJECTION);
        return user;
    }
    async update(id, data) {
    const user = await User.findByIdAndUpdate(id, data, { new: true, runValidators: true, projection: DEFAULT_PROJECTION });
    return user;
    }
    async delete(id) {
    const user = await User.findByIdAndDelete(id, { projection: DEFAULT_PROJECTION });
    return user;
    }
    async insertMany(users){
        return User.insertMany(users);
    }
    async addDocument(id, metadata) {
        return User.findByIdAndUpdate(
            id,
            { $push: { documents: metadata } },
            { new: true, runValidators: true, projection: DEFAULT_PROJECTION }
        );
    }
}

export default new UserRepository();