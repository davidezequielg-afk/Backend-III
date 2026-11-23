import express from 'express';

import usersRouter from './routes/users.js';
import productsRouter from './routes/products.js';
import mocksRouter from './routes/mocks.js';
import loggerRouter from './routes/logger.js';
import orderRouter from './routes/order.js';
import deliveryRouter from './routes/delivery.js';
import { errorHandler, routeNotFoundHandler } from './middlewares/error.middleware.js';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger.config.js';
import healthRouter from './routes/health.js';
import { config } from './config/env.config.js';

export const createApp = (settings = config) => {
    const app = express();
    const isProduction = settings.NODE_ENV === 'production';

app.use(express.json())
app.use(express.json({ limit: '100kb' }))
app.use('/api/users', usersRouter)
app.use('/api/products', productsRouter)
app.use('/api/orders', orderRouter)
app.use('/api/deliveries', deliveryRouter)
app.use('/api/health', healthRouter)
if (!isProduction) {
    app.use('/api/mocks', mocksRouter)
    app.use('/api/logger-test', loggerRouter)
}
if (settings.ENABLE_SWAGGER) {
    app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
app.use(routeNotFoundHandler);
app.use(errorHandler);
return app;
};

export default createApp();