import swaggerJSDoc from 'swagger-jsdoc';
import { config } from './env.config.js';

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'ShipNow API',
            version: '1.0.0',
            description: 'API de ShipNow para gestionar usuarios, pedidos y entregas. Esta documentación permite consultar y probar cada endpoint.'
        },
        servers: [
            { url: `http://localhost:${config.PORT}`, description: 'Servidor local' },
        ],
        tags: [
            { name: 'Users', description: 'Operaciones relacionadas con los usuarios' },
            { name: 'Orders', description: 'Operaciones relacionadas con los pedidos' },
            { name: 'Deliveries', description: 'Operaciones relacionadas con las entregas' },
            { name: 'Mocks', description: 'Operaciones relacionadas con los datos simulados' },
            { name: 'Logger', description: 'Herramienta interna para validar el sistema de logs. No es una funcionalidad de negocio' }
        ]
    },
    apis: ['./src/docs/*.yaml'],
};

export const swaggerSpec = swaggerJSDoc(swaggerOptions);
