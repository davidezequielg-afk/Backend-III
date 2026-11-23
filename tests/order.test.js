import mongoose from "mongoose";
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
const seedOrders = async (user, list) => {
    const docs = list.map(o => ({
        user: new mongoose.Types.ObjectId(user._id),
        status: o.status,
        priority: o.priority,
        items: []
    }));
    await mongoose.connection.collection('orders').insertMany(docs);
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
        it('filtra los pedidos por status', async () => {
            const user = await createUser();
            await seedOrders(user, [
            { status: 'pending', priority: 'high' },
            { status: 'pending', priority: 'low' },
            { status: 'pending', priority: 'medium' },
            { status: 'completed', priority: 'high' },
            { status: 'completed', priority: 'low' }
        ]);
            const res = await api.get('/api/orders?status=completed');
            expect(res.status).to.equal(200);
            expect(res.body.data).to.have.lengthOf(2);
            expect(res.body.pagination).to.have.property('total', 2);
            for (const order of res.body.data) {
            expect(order).to.have.property('status', 'completed');
        }
        });
        it('filtra los pedidos por prioridad', async () => {
            const user = await createUser();
            await seedOrders(user, [
                { status: 'pending', priority: 'high' },
                { status: 'pending', priority: 'low' },
                { status: 'pending', priority: 'medium' },
                { status: 'completed', priority: 'high' },
                { status: 'completed', priority: 'low' }
            ]);
            const res = await api.get('/api/orders?priority=high');
            expect(res.status).to.equal(200);
            expect(res.body.data).to.have.lengthOf(2);
            expect(res.body.pagination).to.have.property('total', 2);
            for (const order of res.body.data) {
                expect(order).to.have.property('priority', 'high');
            }
        });
        it('filtra los pedidos por prioridad y status', async () => {
            const user = await createUser();
            await seedOrders(user, [
                { status: 'pending', priority: 'high' },
                { status: 'pending', priority: 'low' },
                { status: 'pending', priority: 'medium' },
                { status: 'completed', priority: 'high' },
                { status: 'completed', priority: 'low' }
            ]);
            const res = await api.get('/api/orders?priority=high&status=completed');
            expect(res.status).to.equal(200);
            expect(res.body.data).to.have.lengthOf(1);
            expect(res.body.pagination).to.have.property('total', 1);
            for (const order of res.body.data) {
                expect(order).to.have.property('priority', 'high');
                expect(order).to.have.property('status', 'completed');
            }
        });
        it('Devuelve pedidos paginados', async () => {
            const user = await createUser();
            await seedOrders(user, Array.from({ length: 3 }, (_) => ({ status: 'pending', priority: 'high' })));
            const res = await api.get('/api/orders?page=2&limit=2');
            expect(res.status).to.equal(200);
            expect(res.body.pagination).to.have.property('page', 2);
            expect(res.body.pagination).to.have.property('limit', 2);
            expect(res.body.pagination).to.have.property('total', 3);
            expect(res.body.pagination).to.have.property('totalPages', 2);
            expect(res.body.pagination).to.have.property('hasNextPage', false);
            expect(res.body.pagination).to.have.property('hasPrevPage', true);
            expect(res.body.data).to.be.an('array').with.lengthOf(1);
        });
        it('devuelve 400 si el limite no es mayor al limite maximo', async () => {    
            for (const limit of ['0', '-1', 'abc', '2.5']) {
                const res = await api.get(`/api/orders?limit=${limit}`);
                expect(res.status).to.equal(400);
                expect(res.body).to.have.property('code', 'INVALID_PAGINATION');
            }
        });
        it('devuelve 400 si page no es válido', async () => {    
            for (const page of ['0', '-1', 'abc', '2.5']) {
                const res = await api.get(`/api/orders?page=${page}`);
                expect(res.status).to.equal(400);
                expect(res.body).to.have.property('code', 'INVALID_PAGINATION');
            }
        });
        it('devuelve 400 INVALID_FILTERS si el filtro intenta usar un operador', async () => {
            const res = await api.get('/api/orders?status[$ne]=completed');
            expect(res.status).to.equal(400);
            expect(res.body).to.have.property('code', 'INVALID_FILTERS');
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