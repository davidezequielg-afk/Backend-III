import express from 'express';

import ordersRouter from './routes/orders.js';
import usersRouter from './routes/users.js';

const app = express();

app.use(express.json())

app.use('/api/orders', ordersRouter)
app.use('/api/users', usersRouter)


export default app;