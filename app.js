import express from 'express'
import mongoose from 'mongoose'
import ordersRouter from './routes/orders.js'
import usersRouter from './routes/users.js'


const app = express()
app.use(express.json())

mongoose.connect('mongodb://localhost:27017/shipnow')
  .then(() => console.log('Mongo conectado'))

app.use('/api/orders', ordersRouter)
app.use('/api/users', usersRouter)

app.listen(PORT, () => console.log('ok'))
