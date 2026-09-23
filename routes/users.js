import { Router } from 'express'
import User from '../models/User.js'
import Store from '../models/Store.js'

const router = Router()

router.post('/', async (req, res) => {
  if (!req.body.email) return res.status(400).send('Falta email')
  const user = await User.create(req.body)
  res.status(201).json(user)
})

router.get('/', async (req, res) => {
  res.json(await User.find())
})

// Para poder probar la demo: alta rápida de comercios
router.post('/stores', async (req, res) => {
  const store = await Store.create(req.body)
  res.status(201).json(store)
})

export default router
