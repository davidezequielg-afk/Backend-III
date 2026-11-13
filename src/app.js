import express from 'express';

import usersRouter from './routes/users.js';
import productsRouter from './routes/products.js';
import mocksRouter from './routes/mocks.js';
import loggerRouter from './routes/logger.js';
import orderRouter from './routes/order.js';
import { errorHandler, routeNotFoundHandler } from './middlewares/error.middleware.js';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger.config.js';

const app = express();

app.use(express.json())

app.use('/api/users', usersRouter)
app.use('/api/products', productsRouter)
app.use('/api/mocks', mocksRouter)
app.use('/api/orders', orderRouter)
app.use('/api/logger-test', loggerRouter)
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(routeNotFoundHandler);
app.use(errorHandler);


export default app;