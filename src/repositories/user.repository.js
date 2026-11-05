import User from '../models/User.js';

const DEFAULT_PROJECTION = '-__v';

class UserRepository {
    async create(data) {
        const user = await User.create(data);
        return user;
    }
    async getAll(filter = {}) {
        const users = await User.find(filter).select(DEFAULT_PROJECTION).lean();
        return users;
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
        const user = await User.findByIdAndUpdate({ _id: id }, data, { new: true, runValidators: true, projection: DEFAULT_PROJECTION });
        return user;
    }
    async delete(id) {
        const user = await User.findByIdAndDelete({ _id: id }, { projection: DEFAULT_PROJECTION });
        return user;
    }
}

export default new UserRepository();