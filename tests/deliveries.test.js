import { expect } from "chai";
import { api, connectTestDB, clearDB, disconnectTestDB } from "./helpers.js";

describe('Deliveries', () => {
    before(connectTestDB);
    beforeEach(clearDB);
    after(async () => {
        await clearDB();
        await disconnectTestDB();
    });

    const NON_EXISTENT_ID = '64b7f0c2a1b2c3d4e5f60718';

    const createDelivery = async () => {
        await api.post('/api/mocks/seed?qty=1');
        const res = await api.get('/api/deliveries');
        return res.body.data[0];
    };
    describe('GET /api/deliveries', () => {
        it('lista las entregas con los datos del pedido', async () => {
            await createDelivery();
            const res = await api.get('/api/deliveries');
            expect(res.status).to.equal(200);
            expect(res.body).to.have.property('status', 'success');
            expect(res.body.data).to.be.an('array').with.lengthOf(1);
            expect(res.body.data[0]).to.have.property('_id');
            expect(res.body.data[0].order).to.be.an('object').with.property('_id');
            expect(res.body.data[0]).to.have.property('status');
        });
    });

    describe('GET /api/deliveries/:id', () => {
        it('devuelve la entrega si existe', async () => {
            const delivery = await createDelivery();
            const res = await api.get(`/api/deliveries/${delivery._id}`);
            expect(res.status).to.equal(200);
            expect(res.body).to.have.property('status', 'success');
            expect(res.body.data).to.have.property('_id', delivery._id);
        });
        it('devuelve 404 DELIVERY_NOT_FOUND si no existe', async () => {
            const res = await api.get(`/api/deliveries/${NON_EXISTENT_ID}`);
            expect(res.status).to.equal(404);
            expect(res.body).to.have.property('status', 'error');
            expect(res.body).to.have.property('code', 'DELIVERY_NOT_FOUND');
            expect(res.body).to.have.property('status', 'error');
        });
        it('devuelve 400 INVALID_ID si el ID no es válido', async () => {
            const res = await api.get('/api/deliveries/123');
            expect(res.status).to.equal(400);
            expect(res.body).to.have.property('code', 'INVALID_ID');
            expect(res.body).to.have.property('status', 'error');
        });
    });

    describe('PATCH /api/deliveries/:id/status', () => {
        it('actualiza el estado de la entrega', async () => {
            const delivery = await createDelivery();
            const res = await api.patch(`/api/deliveries/${delivery._id}/status`).send({ status: 'delivered' });
            expect(res.status).to.equal(200);
            expect(res.body).to.have.property('status', 'success');
            expect(res.body.data).to.have.property('_id', delivery._id);
            expect(res.body.data).to.have.property('status', 'delivered');
            expect(res.body.data.order).to.be.a('string');
        });
        it('devuelve 400 INVALID_STATUS si el estado no es válido', async () => {
            const delivery = await createDelivery();
            const res = await api.patch(`/api/deliveries/${delivery._id}/status`).send({ status: 'inventado' });
            expect(res.status).to.equal(400);
            expect(res.body).to.have.property('code', 'INVALID_STATUS');
            expect(res.body).to.have.property('status', 'error');
        });
        it('devuelve 400 INVALID_STATUS si falta el estado', async () => {
            const delivery = await createDelivery();
            const res = await api.patch(`/api/deliveries/${delivery._id}/status`).send({});
            expect(res.status).to.equal(400);
            expect(res.body).to.have.property('code', 'INVALID_STATUS');
            expect(res.body).to.have.property('status', 'error');
        });
        it('devuelve 400 INVALID_JSON si el body no es un JSON válido', async () => {
            const delivery = await createDelivery();
            const res = await api
                .patch(`/api/deliveries/${delivery._id}/status`)
                .set('Content-Type', 'application/json')
                .send('{"status":');
            expect(res.status).to.equal(400);
            expect(res.body).to.have.property('code', 'INVALID_JSON');
            expect(res.body).to.have.property('status', 'error');
        });
        it('devuelve 400 INVALID_ID si el ID no es válido', async () => {
            const res = await api.patch('/api/deliveries/123/status').send({ status: 'delivered' });
            expect(res.status).to.equal(400);
            expect(res.body).to.have.property('code', 'INVALID_ID');
            expect(res.body).to.have.property('status', 'error');
        });
        it('devuelve 404 DELIVERY_NOT_FOUND si no existe', async () => {
            const res = await api.patch(`/api/deliveries/${NON_EXISTENT_ID}/status`).send({ status: 'delivered' });
            expect(res.status).to.equal(404);
            expect(res.body).to.have.property('code', 'DELIVERY_NOT_FOUND');
            expect(res.body).to.have.property('status', 'error');
        });
    });
});
