import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  storeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true },
  address: { type: String, required: true },
  items: [{ name: String, price: Number, quantity: Number }],
  total: Number,
  status: { type: String, default: 'pending' },
}, { timestamps: true })

export default mongoose.model('Order', orderSchema)
