import { expect } from "chai";
import { api, connectTestDB, clearDB, disconnectTestDB } from "./helpers.js";

describe('Mocks', () => {
    before(connectTestDB);
    beforeEach(clearDB);
    after(async () => {
        await clearDB();
        await disconnectTestDB();
    });

    const invalidQtys = ['-5', '0', '2.5', 'abc', '101'];

    describe('GET /api/mocks/users', () => {
        it('genera la cantidad de usuarios pedida', async () => {
            const res = await api.get('/api/mocks/users?qty=3');
            expect(res.status).to.equal(200);
            expect(res.body).to.have.property('status', 'success');
            expect(res.body.data).to.be.an('array').with.lengthOf(3);
            expect(res.body.data[0]).to.have.all.keys('name', 'email', 'role');
        });

        it('genera 10 usuarios por defecto si no se envía qty', async () => {
            const res = await api.get('/api/mocks/users');
            expect(res.status).to.equal(200);
            expect(res.body.data).to.have.lengthOf(10);
        });

        it('no guarda los usuarios en la base de datos', async () => {
            await api.get('/api/mocks/users?qty=3');
            const res = await api.get('/api/users');
            expect(res.body.data).to.have.lengthOf(0);
        });

        invalidQtys.forEach((qty) => {
            it(`devuelve 400 INVALID_QTY con qty=${qty}`, async () => {
                const res = await api.get(`/api/mocks/users?qty=${qty}`);
                expect(res.status).to.equal(400);
                expect(res.body).to.have.property('status', 'error');
                expect(res.body).to.have.property('code', 'INVALID_QTY');
                expect(res.body).to.have.property('message');
            });
        });
    });

    describe('POST /api/mocks/seed', () => {
        it('inserta usuarios, pedidos y envíos', async () => {
            const res = await api.post('/api/mocks/seed?qty=3');
            expect(res.status).to.equal(201);
            expect(res.body).to.have.property('status', 'success');
            expect(res.body.data).to.deep.equal({ usuarios: 3, pedidos: 3, envios: 3 });
        });

        it('guarda los datos: se ven en GET /api/users y GET /api/orders', async () => {
            await api.post('/api/mocks/seed?qty=3');
            const users = await api.get('/api/users');
            const orders = await api.get('/api/orders');
            expect(users.body.data).to.have.lengthOf(3);
            expect(orders.body.data).to.have.lengthOf(3);
        });

        invalidQtys.forEach((qty) => {
            it(`devuelve 400 INVALID_QTY con qty=${qty}`, async () => {
                const res = await api.post(`/api/mocks/seed?qty=${qty}`);
                expect(res.status).to.equal(400);
                expect(res.body).to.have.property('status', 'error');
                expect(res.body).to.have.property('code', 'INVALID_QTY');
                expect(res.body).to.have.property('message');
            });
        });
    });
});
