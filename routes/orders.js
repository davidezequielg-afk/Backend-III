import { Router } from 'express'
import Order from '../models/Order.js'
import User from '../models/User.js'
import Store from '../models/Store.js'

const router = Router()

// El "fat controller" de la demo: hace ocho cosas en un solo lugar
router.post('/', async (req, res) => {
  const { userId, storeId, address, items } = req.body

  const user = await User.findById(userId)
  const store = await Store.findById(storeId)
  if (!user) return res.status(404).json({ error: 'Usuario no encontrado' })
  if (!store) return res.status(404).json({ error: 'Comercio no encontrado' })

  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0)

  const order = await Order.create({
    userId, storeId, address, items, total, status: 'pending',
  })

  res.status(201).json(order)
})

router.get('/', async (req, res) => {
  const orders = await Order.find()
  res.json(orders)
})

// Respuesta ambigua para el bloque de contratos: devuelve 200 aunque falle
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
    if (!order) return res.json({ status: 'error', data: null })
    res.json({ status: 'ok', data: order })
  } catch (error) {
    res.json({ status: 'error', data: null })
  }
})

// String mágico con mayúscula: este if no entra nunca
router.patch('/:id/deliver', async (req, res) => {
  const order = await Order.findById(req.params.id)
  if (order.status === 'Delivered') {
    return res.status(400).json({ error: 'Ya fue entregado' })
  }
  order.status = 'delivered'
  await order.save()
  res.json(order)
})

export default router
