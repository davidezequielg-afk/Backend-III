import mongoose from "mongoose";
import { expect } from "chai";
import { api, connectTestDB, clearDB, disconnectTestDB } from "./helpers.js";

describe('Users', () => {
    before(connectTestDB);
    beforeEach(clearDB);
    after(async () => {
        await clearDB();
        await disconnectTestDB();
    });

    

    const validUser = {
        name: "Test User",
        email: "test@example.com",
        role: "user"
    };

    describe('POST /api/users', () => {
        it('crea un usuario válido', async () => {
            const res = await api.post('/api/users').send(validUser);
            expect(res.status).to.equal(201);
            expect(res.body).to.have.property('status', 'success');
            expect(res.body).to.have.property('data');
            expect(res.body.data).to.have.property('email', validUser.email);
        });
        it('devuelve 409 USER_ALREADY_EXISTS si el mail esta duplicado', async () => {
            await api.post('/api/users').send(validUser);
            const res = await api.post('/api/users').send(validUser);
            expect(res.status).to.equal(409);
            expect(res.body).to.have.property('code', 'USER_ALREADY_EXISTS');
        });
        it('devuelve 400 EMAIL_REQUIRED si falta el email', async () => {
            const res = await api.post('/api/users').send({ name: 'Sin email' });
            expect(res.status).to.equal(400);
            expect(res.body).to.have.property('status', 'error');
            expect(res.body).to.have.property('code', 'EMAIL_REQUIRED');
            expect(res.body).to.have.property('message');
        });

    });

    describe('GET /api/users', () => {
        it('lista todos los usuarios', async () => {
            await api.post('/api/users').send(validUser);
            const res = await api.get('/api/users');
            expect(res.status).to.equal(200);
            expect(res.body).to.have.property('status', 'success');
            expect(res.body).to.have.property('data');
            expect(res.body.data).to.be.an('array').with.lengthOf(1);
            expect(res.body.data[0]).to.have.property('email', validUser.email);
        });
        it('devuelve último usuario paginado', async () => {
            for (let i = 0; i < 3; i++) {
                await api.post('/api/users').send({ ...validUser, email: `user${i}@example.com` });
            }
            const res = await api.get('/api/users?page=1&limit=1');
            expect(res.status).to.equal(200);
            expect(res.body).to.have.property('status', 'success');
            expect(res.body).to.have.property('data');
            expect(res.body.data[0]).to.have.property('email', 'user2@example.com');
            expect(res.body.pagination).to.have.property('page', 1);
            expect(res.body.pagination).to.have.property('limit', 1);
            expect(res.body.pagination).to.have.property('total', 3);
            expect(res.body.pagination).to.have.property('totalPages', 3);
            expect(res.body.pagination).to.have.property('hasNextPage', true);
            expect(res.body.pagination).to.have.property('hasPrevPage', false);
            expect(res.body.data).to.be.an('array').with.lengthOf(1);
        });
        it('devuelve segundo usuario paginado', async () => {
            for (let i = 0; i < 3; i++) {
                await api.post('/api/users').send({ ...validUser, email: `user${i}@example.com` });
            }
            const res = await api.get('/api/users?page=2&limit=1');
            expect(res.status).to.equal(200);
            expect(res.body).to.have.property('status', 'success');
            expect(res.body).to.have.property('data');
            expect(res.body.data[0]).to.have.property('email', 'user1@example.com');
            expect(res.body.pagination).to.have.property('page', 2);
            expect(res.body.pagination).to.have.property('limit', 1);
            expect(res.body.pagination).to.have.property('total', 3);
            expect(res.body.pagination).to.have.property('totalPages', 3);
            expect(res.body.pagination).to.have.property('hasNextPage', true);
            expect(res.body.pagination).to.have.property('hasPrevPage', true);
            expect(res.body.data).to.be.an('array').with.lengthOf(1);
        });
        it('devuelve primer usuario paginado', async () => {
            for (let i = 0; i < 3; i++) {
                await api.post('/api/users').send({ ...validUser, email: `user${i}@example.com` });
            }
            const res = await api.get('/api/users?page=3&limit=1');
            expect(res.status).to.equal(200);
            expect(res.body).to.have.property('status', 'success');
            expect(res.body).to.have.property('data');
            expect(res.body.data[0]).to.have.property('email', 'user0@example.com');
            expect(res.body.pagination).to.have.property('page', 3);
            expect(res.body.pagination).to.have.property('limit', 1);
            expect(res.body.pagination).to.have.property('total', 3);
            expect(res.body.pagination).to.have.property('totalPages', 3);
            expect(res.body.pagination).to.have.property('hasNextPage', false);
            expect(res.body.pagination).to.have.property('hasPrevPage', true);
            expect(res.body.data).to.be.an('array').with.lengthOf(1);
        });
        it('devuelve usuarios con rol courier', async () => {
            await mongoose.connection.collection('users').insertMany([
                { ...validUser, role: 'admin', email: 'admin@example.com' },
                { ...validUser, role: 'courier', email: 'courier1@example.com' },
                { ...validUser, role: 'courier', email: 'courier2@example.com' },
                { ...validUser, role: 'courier', email: 'courier3@example.com' },
                { ...validUser, role: 'user', email: 'user@example.com' }
            ]);
            const res = await api.get('/api/users?role=courier');
            expect(res.status).to.equal(200);
            expect(res.body).to.have.property('status', 'success');
            expect(res.body).to.have.property('data');
            expect(res.body.data[0]).to.have.property('role', 'courier');
            expect(res.body.data).to.be.an('array').with.lengthOf(3);
            expect(res.body.pagination).to.have.property('total', 3);
        });
        it('devuelve usuarios con rol user', async () => {
            await mongoose.connection.collection('users').insertMany([
                { ...validUser, role: 'admin', email: 'admin@example.com' },
                { ...validUser, role: 'courier', email: 'courier@example.com' },
                { ...validUser, role: 'user', email: 'user1@example.com' },
                { ...validUser, role: 'user', email: 'user2@example.com' },
                { ...validUser, role: 'user', email: 'user3@example.com' }
            ]);
            const res = await api.get('/api/users?role=user');
            expect(res.status).to.equal(200);
            expect(res.body).to.have.property('status', 'success');
            expect(res.body).to.have.property('data');
            expect(res.body.data[0]).to.have.property('role', 'user');
            expect(res.body.data).to.be.an('array').with.lengthOf(3);
            expect(res.body.pagination).to.have.property('total', 3);
        });
        it('devuelve usuarios con rol admin', async () => {
            await mongoose.connection.collection('users').insertMany([
                { ...validUser, role: 'admin', email: 'adminr@example.com' },
                { ...validUser, role: 'user', email: 'user@example.com' }
            ]);
            const res = await api.get('/api/users?role=admin');
            expect(res.status).to.equal(200);
            expect(res.body).to.have.property('status', 'success');
            expect(res.body).to.have.property('data');
            expect(res.body.data[0]).to.have.property('role', 'admin');
            expect(res.body.data).to.be.an('array').with.lengthOf(1);
        });
        it('devuelve la paginacion vacia si el rol no existe', async () => {
            await mongoose.connection.collection('users').insertMany([
                { ...validUser, role: 'admin', email: 'adminr@example.com' },
                { ...validUser, role: 'user', email: 'user@example.com' }
            ]);
            const res = await api.get('/api/users?role=nonexistent');
            expect(res.status).to.equal(200);
            expect(res.body).to.have.property('status', 'success');
            expect(res.body).to.have.property('data');
            expect(res.body.data).to.be.an('array').with.lengthOf(0);
            expect(res.body.pagination).to.have.property('total', 0);
        });
        it('devuelve la paginacion por defecto si no se especifica el limite', async () => {
            for (let i = 1; i <= 15; i++) {
                await mongoose.connection.collection('users').insertOne(
                { ...validUser, role: 'user', email: `user${i}@example.com` }
                );
            }
            const res = await api.get('/api/users');
            expect(res.status).to.equal(200);
            expect(res.body).to.have.property('status', 'success');
            expect(res.body.data).to.be.an('array').with.lengthOf(10);
            expect(res.body.pagination).to.have.property('page', 1);
            expect(res.body.pagination).to.have.property('limit', 10);
            expect(res.body.pagination).to.have.property('total', 15);
            expect(res.body.pagination).to.have.property('totalPages', 2);
            expect(res.body.pagination).to.have.property('hasNextPage', true);
        });
        it('devuelve 400 si el limite no es mayor al limite maximo', async () => {    
            for (const limit of ['0', '-1', 'abc', '2.5']) {
                const res = await api.get(`/api/users?limit=${limit}`);
                expect(res.status).to.equal(400);
                expect(res.body).to.have.property('code', 'INVALID_PAGINATION');
            }
        });
        it('devuelve 400 si page no es válido', async () => {    
            for (const page of ['0', '-1', 'abc', '2.5']) {
                const res = await api.get(`/api/users?page=${page}`);
                expect(res.status).to.equal(400);
                expect(res.body).to.have.property('code', 'INVALID_PAGINATION');
            }
        });
        it('devuelve 400 INVALID_FILTERS si el filtro intenta usar un operador', async () => {
            const res = await api.get('/api/users?role[$ne]=admin');
            expect(res.status).to.equal(400);
            expect(res.body).to.have.property('code', 'INVALID_FILTERS');
        });
    });

    describe('GET /api/users/:id', () => {
        it('devuelve el usuario si existe', async () => {
            const created = await api.post('/api/users').send(validUser);
            const res = await api.get(`/api/users/${created.body.data._id}`);
            expect(res.status).to.equal(200);
            expect(res.body.data).to.have.property('email', validUser.email);
        });
        it('devuelve 404 USER_NOT_FOUND si no existe', async () => {
            const res = await api.get('/api/users/123456789012345678901234');
            expect(res.status).to.equal(404);
            expect(res.body).to.have.property('code', 'USER_NOT_FOUND');
        });
        it('devuelve 400 INVALID_ID si el id no es válido', async () => {
            const res = await api.get('/api/users/123');
            expect(res.status).to.equal(400);
            expect(res.body).to.have.property('code', 'INVALID_ID');
        });
    });
});