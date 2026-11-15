import { expect } from "chai";
import { api, connectTestDB, clearDB, disconnectTestDB } from "./helpers.js";

describe('Orders',  () => {
    before(connectTestDB);
    beforeEach(clearDB);
    after(async () => {
        await clearDB();
        await disconnectTestDB();
    });

const createUser = async () => {
    const res = await api.post('/api/users').send({ name: 'Cliente', email: 'cliente@test.com', role: 'user' });
    return res.body.data;
};
const createOrder = async (user) => {
    const res = await api.post('/api/orders').send({ user: user._id, priority: 'high' });
    return res.body.data;
};

    describe('POST /api/orders', () => {
        it('devuelve 201 si se crea un pedido para un usuario existente', async () => {
            const user = await createUser();
            const res = await api.post('/api/orders').send({ user: user._id, priority: 'high' });
            expect(res.status).to.equal(201);
            expect(res.body).to.have.property('status', 'success');
            expect(res.body.data).to.have.property('_id');
            expect(res.body.data).to.have.property('user', user._id);
            expect(res.body.data).to.have.property('priority', 'high');
            expect(res.body.data).to.have.property('status', 'pending');
            expect(res.body.data.items).to.be.an('array').that.is.empty;
            });
        it('devuelve 400 VALIDATION_ERROR si falta el usuario', async () => {
            const res = await api.post('/api/orders').send({ priority: 'high' });
            expect(res.status).to.equal(400);
            expect(res.body).to.have.property('status', 'error');
            expect(res.body).to.have.property('code', 'VALIDATION_ERROR');
            expect(res.body).to.have.property('message');
        });

        it('devuelve 400 INVALID_ID si el ID del usuario no es válido', async () => {
            const res = await api.post('/api/orders').send({ user: '123' });
            expect(res.status).to.equal(400);
            expect(res.body).to.have.property('code', 'INVALID_ID');
        });

        it('devuelve 404 USER_NOT_FOUND si el usuario no existe', async () => {
            const res = await api.post('/api/orders').send({ user: '64b7f0c2a1b2c3d4e5f60718' });
            expect(res.status).to.equal(404);
            expect(res.body).to.have.property('code', 'USER_NOT_FOUND');
        });

        });

    describe('GET /api/orders', () => {
        it('lista los pedidos', async () => {
            const user = await createUser();
            await createOrder(user);
            const res = await api.get('/api/orders');
            expect(res.status).to.equal(200);
            expect(res.body).to.have.property('status', 'success');
            expect(res.body.data).to.be.an('array').with.lengthOf(1);
            expect(res.body.data[0].user).to.have.property('email', 'cliente@test.com');
        });
    });

    describe('GET /api/orders/:id', () => {
        it('devuelve el pedido si existe', async () => {
            const user = await createUser();
            const order = await createOrder(user);
            const res = await api.get(`/api/orders/${order._id}`);
            expect(res.status).to.equal(200);
            expect(res.body).to.have.property('status', 'success');
            expect(res.body.data).to.have.property('_id', order._id);
        });
        it('devuelve 404 ORDER_NOT_FOUND si no existe', async () => {
            const res = await api.get('/api/orders/64b7f0c2a1b2c3d4e5f60718');
            expect(res.status).to.equal(404);
            expect(res.body).to.have.property('status', 'error');
            expect(res.body).to.have.property('code', 'ORDER_NOT_FOUND');
        });
        it('devuelve 400 INVALID_ID si el ID no es válido', async () => {
            const res = await api.get('/api/orders/123');
            expect(res.status).to.equal(400);
            expect(res.body).to.have.property('code', 'INVALID_ID');
        });
    });

        describe('PATCH /api/orders/:id/status', () => {
        it('actualiza el estado del pedido', async () => {
            const user = await createUser();
            const order = await createOrder(user);
            const res = await api.patch(`/api/orders/${order._id}/status`).send({ status: 'processing' });
            expect(res.status).to.equal(200);
            expect(res.body).to.have.property('status', 'success');
            expect(res.body.data).to.have.property('_id', order._id);
            expect(res.body.data).to.have.property('status', 'processing');
        });
        it('devuelve 400 INVALID_STATUS si el estado no es válido', async () => {
            const user = await createUser();
            const order = await createOrder(user);
            const res = await api.patch(`/api/orders/${order._id}/status`).send({ status: 'inventado' });
            expect(res.status).to.equal(400);
            expect(res.body).to.have.property('status', 'error');
            expect(res.body).to.have.property('code', 'INVALID_STATUS');
        });
        it('devuelve 404 ORDER_NOT_FOUND si el pedido no existe', async () => {
            const res = await api.patch('/api/orders/64b7f0c2a1b2c3d4e5f60718/status').send({ status: 'processing' });
            expect(res.status).to.equal(404);
            expect(res.body).to.have.property('status', 'error');
            expect(res.body).to.have.property('code', 'ORDER_NOT_FOUND');
        });
    });

});