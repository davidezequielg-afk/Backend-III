import { expect } from "chai";
import { api } from "./helpers.js";
import { swaggerSpec } from "../src/config/swagger.config.js";

describe('Swagger', () => {
    describe('GET /api/docs', () => {
        it('sirve la documentación en HTML', async () => {
            const res = await api.get('/api/docs/');
            expect(res.status).to.equal(200);
            expect(res.headers['content-type']).to.include('text/html');
            expect(res.text).to.include('Swagger UI');
        });
        it('devuelve 404 ROUTE_NOT_FOUND si la ruta de documentación no existe', async () => {
            const res = await api.get('/api/docs-inexistente');
            expect(res.status).to.equal(404);
            expect(res.body).to.have.property('status', 'error');
            expect(res.body).to.have.property('code', 'ROUTE_NOT_FOUND');
        });
    });

    describe('Especificación', () => {
        it('documenta los endpoints principales', () => {
            expect(swaggerSpec.info).to.have.property('title', 'ShipNow API');
            expect(swaggerSpec.paths).to.have.property('/api/users');
            expect(swaggerSpec.paths).to.have.property('/api/orders');
            expect(swaggerSpec.paths).to.have.property('/api/deliveries');
            expect(swaggerSpec.paths).to.have.property('/api/mocks/seed');
            expect(swaggerSpec.paths).to.have.property('/api/logger-test');
        });
    });
});
