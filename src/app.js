import express from 'express';

import ordersRouter from './routes/orders.js';
import usersRouter from './routes/users.js';
import productsRouter from './routes/products.js';
import errorHandler from './middlewares/errorHandler.js';

const app = express();

app.use(express.json())

app.use('/api/orders', ordersRouter)
app.use('/api/users', usersRouter)
app.use('/api/products', productsRouter)
app.use(errorHandler);


export default app;