import { expect } from "chai";
import { api, connectTestDB, clearDB, disconnectTestDB } from "./helpers.js";

describe('Logger', () => {
    before(connectTestDB);
    after(async () => {
        await clearDB();
        await disconnectTestDB();
    });

    describe('GET /api/logger-test', () => {
        it('genera los logs y responde con éxito', async () => {
            const res = await api.get('/api/logger-test');
            expect(res.status).to.equal(200);
            expect(res.body).to.have.property('status', 'success');
            expect(res.body).to.have.property('message', 'Logs generados en todos los niveles');
        });

        it('devuelve 404 ROUTE_NOT_FOUND si se usa un método no permitido', async () => {
            const res = await api.post('/api/logger-test');
            expect(res.status).to.equal(404);
            expect(res.body).to.have.property('status', 'error');
            expect(res.body).to.have.property('code', 'ROUTE_NOT_FOUND');
            expect(res.body).to.have.property('message');
        });
    });
});

