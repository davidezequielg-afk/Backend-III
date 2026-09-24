import express from 'express';

import ordersRouter from './routes/orders.js';
import usersRouter from './routes/users.js';

const app = express;

app.use('/api/orders', ordersRouter)
app.use('/api/users', usersRouter)

app.listen(PORT, () => console.log('ok'))

export default app;